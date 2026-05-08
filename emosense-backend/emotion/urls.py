"""
URL configuration for emotion detection API
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import admin_views

router = DefaultRouter()
router.register(r'admin/recommendations', admin_views.AdminWellnessRecommendationViewSet, basename='recommendations')
router.register(r'admin/resources', admin_views.MentalHealthResourceViewSet, basename='resources')
router.register(r'admin/feedback', admin_views.UserFeedbackViewSet, basename='feedback')
router.register(r'admin/alerts', admin_views.RiskAlertViewSet, basename='alerts')
router.register(r'admin/notifications', admin_views.SystemNotificationViewSet, basename='notifications')
router.register(r'admin/activity-logs', admin_views.AdminActivityLogViewSet, basename='activity-logs')

urlpatterns = [
    path('', views.api_index, name='api-index'),
    path('emosense-backend', views.api_index, name='api-index-alias-no-slash'),
    path('emosense-backend/', views.api_index, name='api-index-alias'),
    
    # 🔐 Authentication
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('check-admin/', views.check_admin, name='check-admin'),
    
    # 🧠 Emotion Detection
    path('predict/', views.predict, name='predict'),
    
    # 👤 User Endpoints
    path('profile/', views.user_profile, name='profile'),
    path('profile/update/', views.update_profile, name='update-profile'),
    path('stats/', views.user_stats, name='user-stats'),
    path('history/', views.emotion_history, name='emotion-history'),
    path('feedback/', views.confirm_emotion_accuracy, name='confirm-accuracy'),
    
    # 👨‍💼 Admin Endpoints
    path('admin/dashboard-stats/', admin_views.admin_dashboard_stats, name='dashboard-stats'),
    path('admin/emotion-distribution/', admin_views.emotion_distribution, name='emotion-distribution'),
    path('admin/daily-usage/', admin_views.daily_usage_stats, name='daily-usage'),
    path('admin/users/', admin_views.admin_user_list, name='admin-user-list'),
    path('admin/users/<int:user_id>/suspend/', admin_views.suspend_user, name='suspend-user'),
    path('admin/suspensions/<int:suspension_id>/unsuspend/', admin_views.unsuspend_user, name='unsuspend-user'),
    path('admin/users/<int:user_id>/delete/', admin_views.delete_user, name='delete-user'),
    
    # Router paths
    path('', include(router.urls)),
]
