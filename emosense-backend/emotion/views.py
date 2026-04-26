"""
Emotion Detection API Views - With Personalization
Image → Model → Personalized Prediction → JSON
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.utils import timezone
import numpy as np

from .utils import preprocess_image
from .model_loader import load_model
from .models import EmotionPrediction, UserProfile, EmotionPattern
from .personalization import (
    get_personalized_response, 
    get_user_stats,
    update_emotion_patterns
)


EMOTION_LABELS = ["angry", "disgusted", "fearful", "happy", "sad", "surprised", "neutral"]


# ========================
# 🔐 AUTHENTICATION ENDPOINTS
# ========================

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user
    
    POST /api/register/
    {
        "username": "student@example.com",
        "password": "securepass123",
        "first_name": "John"
    }
    """
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        
        if not username or not password:
            return Response(
                {'error': 'Username and password required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already taken'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user
        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name
        )
        
        # Create profile and preferences
        from .models import UserPreferences
        profile = UserProfile.objects.create(user=user, name=first_name)
        UserPreferences.objects.create(profile=profile)
        
        # Get token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'status': 'success',
            'message': 'Account created successfully',
            'token': token.key,
            'user_id': user.id,
            'username': user.username
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def api_index(request):
    """Simple API index for browser checks."""
    return Response({
        'status': 'ok',
        'service': 'EmoSense API',
        'routes': [
            '/api/register/',
            '/api/login/',
            '/api/predict/',
            '/api/profile/',
            '/api/profile/update/',
            '/api/stats/',
            '/api/history/',
            '/api/feedback/',
        ]
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login user and get authentication token
    
    POST /api/login/
    {
        "username": "student@example.com",
        "password": "securepass123"
    }
    """
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username and password required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = User.objects.filter(username=username).first()
        if not user or not user.check_password(password):
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'status': 'success',
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'first_name': user.first_name
        })
    
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ========================
# 🧠 EMOTION DETECTION (WITH PERSONALIZATION)
# ========================

@api_view(['POST'])
def predict(request):
    """
    🧠 Emotion Detection API (Personalized)
    
    POST /api/predict/
    
    Form Data:
        - image: image file
        - user_id: (optional) user ID for personalization
        - notes: (optional) user's notes about their emotion
    
    Returns personalized response if user is authenticated
    """
    try:
        image = request.FILES.get('image')
        if not image:
            return Response(
                {"error": "No image provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not image.content_type.startswith('image/'):
            return Response(
                {"error": "Invalid file type. Please upload an image."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get optional user context
        user = request.user if request.user.is_authenticated else None
        user_notes = request.data.get('notes', '')
        
        # Preprocess and predict
        processed_image = preprocess_image(image)
        model = load_model()
        prediction = model.predict(processed_image, verbose=0)
        
        emotion_idx = np.argmax(prediction[0])
        confidence = float(np.max(prediction[0]))
        emotion = EMOTION_LABELS[emotion_idx]
        
        # Get time context
        now = timezone.now()
        hour = now.hour
        if hour >= 6 and hour < 12:
            time_of_day = 'morning'
        elif hour >= 12 and hour < 18:
            time_of_day = 'afternoon'
        elif hour >= 18 and hour < 24:
            time_of_day = 'evening'
        else:
            time_of_day = 'night'
        
        day_of_week = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][now.weekday()]
        
        # Store prediction
        emotion_pred = EmotionPrediction.objects.create(
            user=user,
            emotion=emotion,
            confidence=confidence,
            time_of_day=time_of_day,
            day_of_week=day_of_week,
            user_notes=user_notes
        )
        
        response = {
            'status': 'success',
            'prediction_id': emotion_pred.id,
            'emotion': emotion.title(),
            'confidence': round(confidence, 2),
        }
        
        # Add personalization if user is authenticated
        if user and user.is_authenticated:
            try:
                personalized = get_personalized_response(user, emotion, confidence)
                response['personalization'] = personalized
                
                # Update patterns
                update_emotion_patterns(user)
            except Exception as e:
                print(f"Personalization error: {e}")
        
        return Response(response)
    
    except ValueError as ve:
        return Response(
            {"error": f"Image processing failed: {str(ve)}"},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"error": f"Prediction failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ========================
# 📊 USER ENDPOINTS
# ========================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Get user's profile and personalization data
    
    GET /api/profile/
    Headers: Authorization: Token <token>
    """
    try:
        profile = request.user.emosense_profile
        prefs = profile.preferences
        
        return Response({
            'status': 'success',
            'user_id': request.user.id,
            'username': request.user.username,
            'first_name': request.user.first_name,
            'profile': {
                'name': profile.name,
                'communication_style': profile.communication_style,
                'privacy_level': profile.privacy_level,
                'preferred_activities': profile.preferred_activities,
            },
            'preferences': {
                'daily_goal': prefs.daily_goal,
                'recommendation_frequency': prefs.recommendation_frequency,
                'enable_notifications': profile.enable_notifications,
            }
        })
    
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update user profile and preferences
    
    PUT /api/profile/update/
    """
    try:
        profile = request.user.emosense_profile
        
        # Update profile fields
        if 'name' in request.data:
            profile.name = request.data['name']
        if 'communication_style' in request.data:
            profile.communication_style = request.data['communication_style']
        if 'preferred_activities' in request.data:
            profile.preferred_activities = request.data['preferred_activities']
        if 'privacy_level' in request.data:
            profile.privacy_level = request.data['privacy_level']
        
        profile.save()
        
        # Update preferences
        prefs = profile.preferences
        if 'daily_goal' in request.data:
            prefs.daily_goal = request.data['daily_goal']
        if 'recommendation_frequency' in request.data:
            prefs.recommendation_frequency = request.data['recommendation_frequency']
        
        prefs.save()
        
        return Response({
            'status': 'success',
            'message': 'Profile updated'
        })
    
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    """
    Get user's emotion statistics and insights
    
    GET /api/stats/
    """
    try:
        stats = get_user_stats(request.user)
        
        return Response({
            'status': 'success',
            'stats': stats
        })
    
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def emotion_history(request):
    """
    Get user's emotion prediction history
    
    GET /api/history/?limit=50
    """
    try:
        limit = int(request.GET.get('limit', 50))
        predictions = EmotionPrediction.objects.filter(
            user=request.user
        ).values(
            'id', 'emotion', 'confidence', 'created_at', 
            'time_of_day', 'day_of_week', 'user_confirmed'
        )[:limit]
        
        return Response({
            'status': 'success',
            'count': len(predictions),
            'predictions': list(predictions)
        })
    
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_emotion_accuracy(request):
    """
    User confirms if emotion detection was accurate (for training)
    
    POST /api/feedback/
    {
        "prediction_id": 123,
        "accurate": true,
        "actual_emotion": "happy"
    }
    """
    try:
        prediction_id = request.data.get('prediction_id')
        accurate = request.data.get('accurate')
        
        prediction = EmotionPrediction.objects.get(id=prediction_id, user=request.user)
        prediction.user_confirmed = accurate
        prediction.save()
        
        # Update patterns
        update_emotion_patterns(request.user)
        
        return Response({
            'status': 'success',
            'message': 'Feedback recorded'
        })
    
    except EmotionPrediction.DoesNotExist:
        return Response(
            {'error': 'Prediction not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
