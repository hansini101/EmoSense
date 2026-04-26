"""
Django admin configuration for emotion app
"""
from django.contrib import admin
from .models import (
    UserProfile, UserPreferences, EmotionPrediction, 
    WellnessRecommendation, EmotionPattern
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'communication_style', 'created_at')
    list_filter = ('communication_style', 'privacy_level', 'created_at')
    search_fields = ('user__username', 'name')
    
    fieldsets = (
        ('User', {
            'fields': ('user', 'name')
        }),
        ('Personalization', {
            'fields': ('communication_style', 'preferred_activities', 'avoided_activities', 'privacy_level')
        }),
        ('Notifications', {
            'fields': ('enable_notifications', 'notification_time')
        }),
    )


@admin.register(UserPreferences)
class UserPreferencesAdmin(admin.ModelAdmin):
    list_display = ('profile', 'daily_goal', 'recommendation_frequency')
    list_filter = ('daily_goal', 'recommendation_frequency')


@admin.register(EmotionPrediction)
class EmotionPredictionAdmin(admin.ModelAdmin):
    list_display = ('user', 'emotion', 'confidence', 'time_of_day', 'created_at')
    list_filter = ('emotion', 'time_of_day', 'day_of_week', 'created_at', 'user_confirmed')
    search_fields = ('user__username',)
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Prediction', {
            'fields': ('emotion', 'confidence', 'user_confirmed')
        }),
        ('Context', {
            'fields': ('time_of_day', 'day_of_week', 'user_notes')
        }),
        ('Metadata', {
            'fields': ('image_hash', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        return False


@admin.register(WellnessRecommendation)
class WellnessRecommendationAdmin(admin.ModelAdmin):
    list_display = ('title', 'emotion', 'activity_type', 'duration_minutes')
    list_filter = ('activity_type', 'emotion')
    search_fields = ('title', 'description')


@admin.register(EmotionPattern)
class EmotionPatternAdmin(admin.ModelAdmin):
    list_display = ('user', 'most_common_emotion', 'emotion_trend', 'total_predictions')
    list_filter = ('most_common_emotion',)
    search_fields = ('user__username',)
    readonly_fields = ('last_updated',)
