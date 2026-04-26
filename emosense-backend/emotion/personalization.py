"""
Personalization engine - Generate context-aware recommendations
Based on emotion patterns, preferences, and user history
"""
from django.db.models import Count, Q, Avg
from .models import EmotionPrediction, WellnessRecommendation, EmotionPattern


ACTIVITY_SUGGESTIONS = {
    'angry': [
        {
            'type': 'breathing',
            'title': '4-7-8 Breathing Exercise',
            'description': 'Calm your nervous system with this proven breathing technique',
            'duration': 5,
        },
        {
            'type': 'physical',
            'title': 'Quick Walk',
            'description': 'A brisk walk to help burn off anger and clear your mind',
            'duration': 15,
        },
        {
            'type': 'journaling',
            'title': 'Anger Journal',
            'description': 'Write down what\'s making you angry - it helps process emotions',
            'duration': 10,
        },
    ],
    'sad': [
        {
            'type': 'music',
            'title': 'Uplifting Playlist',
            'description': 'Music that gradually lifts your mood',
            'duration': 20,
        },
        {
            'type': 'gratitude',
            'title': 'Gratitude Reflection',
            'description': 'Think of 3 things you\'re grateful for - shifts perspective',
            'duration': 5,
        },
        {
            'type': 'social',
            'title': 'Reach Out',
            'description': 'Connect with someone who makes you feel better',
            'duration': 15,
        },
    ],
    'fearful': [
        {
            'type': 'meditation',
            'title': 'Grounding Meditation',
            'description': 'Bring yourself back to the present moment',
            'duration': 10,
        },
        {
            'type': 'breathing',
            'title': 'Box Breathing',
            'description': 'Equal-paced breathing to calm anxiety',
            'duration': 5,
        },
        {
            'type': 'mindfulness',
            'title': '5-4-3-2-1 Sensory',
            'description': 'Notice 5 things you see, 4 you hear, 3 you feel, etc.',
            'duration': 5,
        },
    ],
    'happy': [
        {
            'type': 'social',
            'title': 'Share the Joy',
            'description': 'Tell someone what made you happy',
            'duration': 10,
        },
        {
            'type': 'gratitude',
            'title': 'Celebrate',
            'description': 'Acknowledge what brought this happiness',
            'duration': 5,
        },
    ],
    'neutral': [
        {
            'type': 'mindfulness',
            'title': 'Body Scan',
            'description': 'Connect with your body to discover underlying emotions',
            'duration': 10,
        },
        {
            'type': 'meditation',
            'title': 'Reflection',
            'description': 'Take a moment to check in with yourself',
            'duration': 5,
        },
    ],
}


def get_personalized_response(user, detected_emotion, confidence):
    """
    Generate personalized response based on user's history and preferences
    
    Returns dict with:
    - greeting: personalized greeting
    - acknowledgment: recognition of detected emotion
    - insight: pattern-based insight
    - recommendation: personalized activity
    - supportive_message: encouraging message
    """
    
    try:
        profile = user.emosense_profile
        preferences = profile.preferences
    except:
        # Fallback for anonymous users
        return {
            'greeting': 'Hello there! 👋',
            'acknowledgment': f'I detect you might be feeling {detected_emotion}.',
            'insight': 'Keep tracking your emotions to discover your patterns!',
            'recommendation': None,
            'supportive_message': 'You\'re doing great by checking in with yourself. 💙',
        }
    
    # Get user's name or use username
    name = profile.name or user.username
    
    # Build response components
    response = {}
    
    # 1. Personalized greeting
    if profile.communication_style == 'motivational':
        response['greeting'] = f'Hey {name}! Let\'s tackle this! 💪'
    elif profile.communication_style == 'supportive':
        response['greeting'] = f'I\'m here for you, {name}. 💙'
    elif profile.communication_style == 'casual':
        response['greeting'] = f'Hey {name}! What\'s up? 👋'
    else:
        response['greeting'] = f'Hello {name}.'
    
    # 2. Emotion acknowledgment with pattern context
    recent_emotions = EmotionPrediction.objects.filter(user=user).values_list('emotion', flat=True)[:3]
    is_repeat = detected_emotion in recent_emotions
    
    if is_repeat and len(recent_emotions) >= 2:
        response['acknowledgment'] = f'I\'ve noticed you\'ve been feeling **{detected_emotion}** recently. 🔄'
    else:
        response['acknowledgment'] = f'I\'m sensing you might be feeling **{detected_emotion}**.'
    
    # 3. Pattern-based insight
    pattern = EmotionPattern.objects.filter(user=user).first()
    if pattern:
        response['insight'] = 'I am tracking your emotion patterns to support better recommendations.'
        if pattern.emotion_trend == 'improving':
            response['insight'] = f'Great news! Your mood has been improving. Keep it up! 📈'
        elif pattern.emotion_trend == 'declining':
            response['insight'] = f'I notice your mood has been shifting. Let\'s focus on self-care. 🌱'
        
        if pattern.most_common_emotion:
            response['insight'] += f'\n\nYour most common emotion is **{pattern.most_common_emotion}**.'
    else:
        response['insight'] = 'Every emotion you log helps me understand you better.'
    
    # 4. Personalized recommendation
    recommendation = get_recommendation_for_emotion(
        user, detected_emotion, profile.preferred_activities
    )
    if recommendation:
        response['recommendation'] = recommendation
    
    # 5. Supportive message based on communication style
    supportive_messages = {
        'motivational': 'You\'ve got this! Remember: emotions are temporary. 💫',
        'supportive': 'Remember, it\'s okay to feel what you\'re feeling. I\'m here. 💙',
        'casual': 'No worries, mate. This too shall pass. 😊',
        'formal': 'This is a temporary state. You will feel better.',
    }
    
    response['supportive_message'] = supportive_messages.get(
        profile.communication_style,
        'You\'re doing great. Keep taking care of yourself. 💙'
    )
    
    return response


def get_recommendation_for_emotion(user, emotion, preferred_activities=None):
    """Get best activity recommendation for detected emotion"""
    
    if emotion not in ACTIVITY_SUGGESTIONS:
        return None
    
    suggestions = ACTIVITY_SUGGESTIONS[emotion]
    
    # Filter by user preferences if provided
    if preferred_activities:
        suggestions = [s for s in suggestions if s['type'] in preferred_activities]
    
    if not suggestions:
        suggestions = ACTIVITY_SUGGESTIONS[emotion]  # Fallback to all
    
    # Get the first suggestion (could be randomized)
    if suggestions:
        return {
            'activity': suggestions[0]['title'],
            'description': suggestions[0]['description'],
            'duration': suggestions[0]['duration'],
            'emoji': {
                'breathing': '🫁',
                'meditation': '🧘',
                'music': '🎵',
                'physical': '🏃',
                'social': '👫',
                'journaling': '📝',
                'mindfulness': '🧠',
                'gratitude': '🙏',
            }.get(suggestions[0]['type'], '✨')
        }
    
    return None


def update_emotion_patterns(user):
    """Update emotion patterns for a user based on latest predictions"""
    pattern = EmotionPattern.calculate_for_user(user)
    return pattern


def get_user_stats(user):
    """Get comprehensive stats for a user's emotion tracking"""
    
    predictions = EmotionPrediction.objects.filter(user=user)
    
    if not predictions.exists():
        return {
            'total_predictions': 0,
            'emotion_distribution': {},
            'accuracy': None,
            'trend': None,
            'most_common_emotion': None,
        }
    
    # Emotion distribution
    emotion_dist = predictions.values('emotion').annotate(
        count=Count('emotion'),
        avg_confidence=Avg('confidence')
    ).order_by('-count')
    
    emotion_distribution = {
        item['emotion']: {
            'count': item['count'],
            'percentage': (item['count'] / predictions.count()) * 100,
            'avg_confidence': item['avg_confidence']
        }
        for item in emotion_dist
    }
    
    # Accuracy from user feedback
    accurate = predictions.filter(user_confirmed=True).count()
    total_feedback = predictions.filter(user_confirmed__isnull=False).count()
    accuracy = (accurate / total_feedback * 100) if total_feedback > 0 else None
    
    # Pattern
    pattern = EmotionPattern.objects.filter(user=user).first()
    
    return {
        'total_predictions': predictions.count(),
        'emotion_distribution': emotion_distribution,
        'accuracy': round(accuracy, 1) if accuracy else None,
        'trend': pattern.emotion_trend if pattern else None,
        'most_common_emotion': pattern.most_common_emotion if pattern else None,
        'avg_confidence': predictions.aggregate(Avg('confidence'))['confidence__avg'],
    }
