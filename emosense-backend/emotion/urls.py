"""
URL configuration for emotion detection API
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_index, name='api-index'),
    path('emosense-backend', views.api_index, name='api-index-alias-no-slash'),
    path('emosense-backend/', views.api_index, name='api-index-alias'),
    # 🔐 Authentication
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    
    # 🧠 Emotion Detection
    path('predict/', views.predict, name='predict'),
    
    # 👤 User Endpoints
    path('profile/', views.user_profile, name='profile'),
    path('profile/update/', views.update_profile, name='update-profile'),
    path('stats/', views.user_stats, name='user-stats'),
    path('history/', views.emotion_history, name='emotion-history'),
    path('feedback/', views.confirm_emotion_accuracy, name='confirm-accuracy'),
]
