"""
URL configuration for EmoSense backend.
"""

from django.http import JsonResponse
from django.urls import path, include


def root(request):
    return JsonResponse(
        {
            "status": "ok",
            "service": "EmoSense Backend",
            "message": "Backend is running.",
            "api_base": "/api/",
            "endpoints": [
                "/api/register/",
                "/api/login/",
                "/api/predict/",
                "/api/profile/",
                "/api/profile/update/",
                "/api/stats/",
                "/api/history/",
                "/api/feedback/",
            ],
        }
    )

urlpatterns = [
    path('', root, name='root'),
    path('api/', include('emotion.urls')),
]
