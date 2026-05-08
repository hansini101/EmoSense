from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    AdminUser, UserSuspension, AdminWellnessRecommendation,
    MentalHealthResource, UserFeedback, RiskAlert,
    SystemNotification, AdminActivityLog, EmotionPrediction,
    EmotionPattern
)


class AdminUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = AdminUser
        fields = ['id', 'username', 'email', 'role', 'is_active', 'created_at', 'last_login_admin',
                  'can_manage_users', 'can_manage_content', 'can_view_analytics', 'can_manage_admins']


class UserSuspensionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    suspended_by_name = serializers.CharField(source='suspended_by.user.username', read_only=True)
    
    class Meta:
        model = UserSuspension
        fields = ['id', 'username', 'reason', 'description', 'suspended_by_name', 
                  'suspended_at', 'until', 'is_active']


class AdminWellnessRecommendationSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.user.username', read_only=True)
    
    class Meta:
        model = AdminWellnessRecommendation
        fields = ['id', 'emotion', 'title', 'description', 'recommendation_type',
                  'content', 'is_active', 'created_at', 'updated_at', 'created_by_name']


class MentalHealthResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentalHealthResource
        fields = ['id', 'title', 'description', 'resource_type', 'contact_info',
                  'url', 'location', 'availability', 'is_emergency', 'is_active', 'created_at']


class UserFeedbackSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    admin_name = serializers.CharField(source='admin_assigned.user.username', read_only=True)
    
    class Meta:
        model = UserFeedback
        fields = ['id', 'username', 'feedback_type', 'title', 'description', 'status',
                  'priority', 'admin_response', 'admin_name', 'created_at', 'updated_at', 'resolved_at']


class RiskAlertSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.user.username', read_only=True)
    
    class Meta:
        model = RiskAlert
        fields = ['id', 'username', 'risk_level', 'reason', 'emotion_pattern', 'status',
                  'reviewed_by_name', 'admin_notes', 'action_taken', 'created_at', 'resolved_at']


class SystemNotificationSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.user.username', read_only=True)
    
    class Meta:
        model = SystemNotification
        fields = ['id', 'title', 'message', 'notification_type', 'created_by_name',
                  'is_active', 'target_users', 'scheduled_at', 'created_at']


class AdminActivityLogSerializer(serializers.ModelSerializer):
    admin_name = serializers.CharField(source='admin.user.username', read_only=True)
    target_username = serializers.CharField(source='target_user.username', read_only=True)
    
    class Meta:
        model = AdminActivityLog
        fields = ['id', 'admin_name', 'action', 'description', 'target_username', 'ip_address', 'created_at']


# Dashboard Serializers
class DashboardStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    active_users_today = serializers.IntegerField()
    total_detections = serializers.IntegerField()
    most_common_emotion = serializers.CharField()
    high_risk_alerts = serializers.IntegerField()
    
    
class EmotionDistributionSerializer(serializers.Serializer):
    emotion = serializers.CharField()
    count = serializers.IntegerField()
    percentage = serializers.FloatField()


class DailyUsageSerializer(serializers.Serializer):
    date = serializers.DateField()
    detections = serializers.IntegerField()
    active_users = serializers.IntegerField()


class UserDetailSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    total_detections = serializers.SerializerMethodField()
    emotion_trend = serializers.SerializerMethodField()
    last_active = serializers.SerializerMethodField()
    is_suspended = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined',
                  'total_detections', 'emotion_trend', 'last_active', 'is_suspended']
    
    def get_total_detections(self, obj):
        return EmotionPrediction.objects.filter(user=obj).count()
    
    def get_emotion_trend(self, obj):
        try:
            pattern = EmotionPattern.objects.get(user=obj)
            return pattern.emotion_trend
        except:
            return None
    
    def get_last_active(self, obj):
        last = EmotionPrediction.objects.filter(user=obj).last()
        return last.created_at if last else None
    
    def get_is_suspended(self, obj):
        return UserSuspension.objects.filter(user=obj, is_active=True).exists()
