from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import (
    AdminUser, UserSuspension, AdminWellnessRecommendation,
    MentalHealthResource, UserFeedback, RiskAlert,
    SystemNotification, AdminActivityLog, EmotionPrediction,
    EmotionPattern
)
from .admin_serializers import (
    AdminUserSerializer, UserSuspensionSerializer,
    AdminWellnessRecommendationSerializer, MentalHealthResourceSerializer,
    UserFeedbackSerializer, RiskAlertSerializer, SystemNotificationSerializer,
    AdminActivityLogSerializer, DashboardStatsSerializer,
    EmotionDistributionSerializer, DailyUsageSerializer, UserDetailSerializer
)


class IsAdminUser(permissions.BasePermission):
    """Check if user is an admin"""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            admin = AdminUser.objects.get(user=request.user, is_active=True)
            return True
        except AdminUser.DoesNotExist:
            return False


class IsAdminOrReadOnly(permissions.BasePermission):
    """Allow admin to modify, read-only for others"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        try:
            admin = AdminUser.objects.get(user=request.user, is_active=True)
            return True
        except AdminUser.DoesNotExist:
            return False


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_stats(request):
    """Get dashboard statistics"""
    today = timezone.now().date()
    
    # Active users today
    active_today = EmotionPrediction.objects.filter(
        created_at__date=today
    ).values('user').distinct().count()
    
    # Total detections
    total_detections = EmotionPrediction.objects.count()
    
    # Most common emotion
    emotion_dist = EmotionPrediction.objects.values('emotion').annotate(
        count=Count('emotion')
    ).order_by('-count').first()
    most_common = emotion_dist['emotion'] if emotion_dist else 'happy'
    
    # High risk alerts
    high_risk = RiskAlert.objects.filter(
        risk_level__in=['high', 'critical'],
        status='new'
    ).count()
    
    stats = {
        'total_users': User.objects.count(),
        'active_users_today': active_today,
        'total_detections': total_detections,
        'most_common_emotion': most_common,
        'high_risk_alerts': high_risk,
    }
    
    serializer = DashboardStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def emotion_distribution(request):
    """Get emotion distribution for charts"""
    total = EmotionPrediction.objects.count()
    if total == 0:
        return Response([])
    
    distribution = EmotionPrediction.objects.values('emotion').annotate(
        count=Count('emotion')
    ).order_by('-count')
    
    result = []
    for item in distribution:
        result.append({
            'emotion': item['emotion'],
            'count': item['count'],
            'percentage': round((item['count'] / total) * 100, 2)
        })
    
    return Response(result)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def daily_usage_stats(request):
    """Get daily usage statistics for the last 30 days"""
    days = int(request.query_params.get('days', 30))
    start_date = timezone.now() - timedelta(days=days)
    
    result = []
    for i in range(days):
        date = start_date + timedelta(days=i)
        date_only = date.date()
        
        detections = EmotionPrediction.objects.filter(
            created_at__date=date_only
        ).count()
        
        active_users = EmotionPrediction.objects.filter(
            created_at__date=date_only
        ).values('user').distinct().count()
        
        result.append({
            'date': date_only,
            'detections': detections,
            'active_users': active_users,
        })
    
    serializer = DailyUsageSerializer(result, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_user_list(request):
    """List all users for admin management"""
    users = User.objects.all()
    
    # Search
    search = request.query_params.get('search', '')
    if search:
        users = users.filter(
            Q(username__icontains=search) |
            Q(email__icontains=search) |
            Q(first_name__icontains=search)
        )
    
    # Filter
    filter_type = request.query_params.get('filter', '')
    if filter_type == 'suspended':
        suspended_users = UserSuspension.objects.filter(
            is_active=True
        ).values_list('user_id', flat=True)
        users = users.filter(id__in=suspended_users)
    elif filter_type == 'high_risk':
        risk_users = RiskAlert.objects.filter(
            risk_level__in=['high', 'critical'],
            status='new'
        ).values_list('user_id', flat=True)
        users = users.filter(id__in=risk_users)
    
    # Pagination
    page = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('page_size', 20))
    start = (page - 1) * page_size
    end = start + page_size
    
    total = users.count()
    users = users[start:end]
    
    serializer = UserDetailSerializer(users, many=True)
    return Response({
        'total': total,
        'page': page,
        'page_size': page_size,
        'results': serializer.data
    })


@api_view(['POST'])
@permission_classes([IsAdminUser])
def suspend_user(request, user_id):
    """Suspend a user"""
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    admin = AdminUser.objects.get(user=request.user)
    
    suspension = UserSuspension.objects.create(
        user=user,
        reason=request.data.get('reason', 'other'),
        description=request.data.get('description', ''),
        suspended_by=admin,
        until=request.data.get('until', None)
    )
    
    # Log activity
    AdminActivityLog.objects.create(
        admin=admin,
        action='user_suspended',
        description=f"Suspended user {user.username}: {request.data.get('reason')}",
        target_user=user,
        ip_address=get_client_ip(request)
    )
    
    serializer = UserSuspensionSerializer(suspension)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def unsuspend_user(request, suspension_id):
    """Unsuspend a user"""
    try:
        suspension = UserSuspension.objects.get(id=suspension_id)
    except UserSuspension.DoesNotExist:
        return Response({'error': 'Suspension not found'}, status=status.HTTP_404_NOT_FOUND)
    
    suspension.is_active = False
    suspension.save()
    
    admin = AdminUser.objects.get(user=request.user)
    AdminActivityLog.objects.create(
        admin=admin,
        action='user_suspended',
        description=f"Unsuspended user {suspension.user.username}",
        target_user=suspension.user,
        ip_address=get_client_ip(request)
    )
    
    return Response({'message': 'User unsuspended successfully'})


@api_view(['POST'])
@permission_classes([IsAdminUser])
def delete_user(request, user_id):
    """Delete a user"""
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    admin = AdminUser.objects.get(user=request.user)
    
    username = user.username
    user.delete()
    
    AdminActivityLog.objects.create(
        admin=admin,
        action='user_deleted',
        description=f"Deleted user {username}",
        ip_address=get_client_ip(request)
    )
    
    return Response({'message': 'User deleted successfully'})


class AdminWellnessRecommendationViewSet(viewsets.ModelViewSet):
    """Manage wellness recommendations"""
    queryset = AdminWellnessRecommendation.objects.all()
    serializer_class = AdminWellnessRecommendationSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    def perform_create(self, serializer):
        admin = AdminUser.objects.get(user=self.request.user)
        serializer.save(created_by=admin)
        
        AdminActivityLog.objects.create(
            admin=admin,
            action='recommendation_added',
            description=f"Added recommendation: {serializer.data.get('title')}",
            ip_address=get_client_ip(self.request)
        )


class MentalHealthResourceViewSet(viewsets.ModelViewSet):
    """Manage mental health resources"""
    queryset = MentalHealthResource.objects.all()
    serializer_class = MentalHealthResourceSerializer
    permission_classes = [IsAdminOrReadOnly]


class UserFeedbackViewSet(viewsets.ModelViewSet):
    """Manage user feedback"""
    queryset = UserFeedback.objects.all()
    serializer_class = UserFeedbackSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=True, methods=['post'])
    def assign_to_admin(self, request, pk=None):
        feedback = self.get_object()
        admin = AdminUser.objects.get(user=request.user)
        feedback.admin_assigned = admin
        feedback.save()
        return Response({'message': 'Feedback assigned'})
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        feedback = self.get_object()
        feedback.status = 'resolved'
        feedback.resolved_at = timezone.now()
        feedback.admin_response = request.data.get('response', '')
        feedback.save()
        return Response({'message': 'Feedback resolved'})


class RiskAlertViewSet(viewsets.ModelViewSet):
    """Manage risk alerts"""
    queryset = RiskAlert.objects.all()
    serializer_class = RiskAlertSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=True, methods=['post'])
    def review_alert(self, request, pk=None):
        alert = self.get_object()
        admin = AdminUser.objects.get(user=request.user)
        alert.reviewed_by = admin
        alert.status = 'reviewed'
        alert.admin_notes = request.data.get('notes', '')
        alert.action_taken = request.data.get('action', '')
        alert.save()
        
        AdminActivityLog.objects.create(
            admin=admin,
            action='alert_reviewed',
            description=f"Reviewed high-risk alert for {alert.user.username}",
            target_user=alert.user,
            ip_address=get_client_ip(request)
        )
        
        return Response({'message': 'Alert reviewed'})


class SystemNotificationViewSet(viewsets.ModelViewSet):
    """Manage system notifications"""
    queryset = SystemNotification.objects.all()
    serializer_class = SystemNotificationSerializer
    permission_classes = [IsAdminUser]
    
    def perform_create(self, serializer):
        admin = AdminUser.objects.get(user=request.user)
        serializer.save(created_by=admin)


class AdminActivityLogViewSet(viewsets.ModelViewSet):
    """View admin activity logs"""
    queryset = AdminActivityLog.objects.all()
    serializer_class = AdminActivityLogSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        return AdminActivityLog.objects.all().order_by('-created_at')[:1000]


def get_client_ip(request):
    """Get client IP address"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
