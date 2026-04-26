from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """Personalized user profile for EmoSense"""
    
    COMMUNICATION_STYLE_CHOICES = [
        ('formal', 'Formal'),
        ('casual', 'Casual'),
        ('supportive', 'Supportive'),
        ('motivational', 'Motivational'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='emosense_profile')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Personalization
    name = models.CharField(max_length=100, blank=True)
    communication_style = models.CharField(
        max_length=20, 
        choices=COMMUNICATION_STYLE_CHOICES,
        default='supportive'
    )
    preferred_activities = models.JSONField(default=list, blank=True)  # ["meditation", "yoga", "music"]
    avoided_activities = models.JSONField(default=list, blank=True)
    privacy_level = models.CharField(
        max_length=20,
        choices=[('public', 'Public'), ('private', 'Private'), ('anonymous', 'Anonymous')],
        default='private'
    )
    
    # Notifications
    enable_notifications = models.BooleanField(default=True)
    notification_time = models.TimeField(null=True, blank=True)  # When to get daily check-in
    
    def __str__(self):
        return f"Profile of {self.user.username}"
    
    @property
    def emotion_trend(self):
        """Calculate if emotions are improving/declining/stable"""
        recent = EmotionPrediction.objects.filter(user=self.user).order_by('-created_at')[:7]
        if len(recent) < 2:
            return "insufficient_data"
        
        emotions_scale = {'angry': 1, 'disgusted': 1, 'fearful': 2, 'sad': 2, 'neutral': 3, 'surprised': 4, 'happy': 5}
        scores = [emotions_scale.get(e.emotion, 3) for e in recent]
        
        if scores[-1] > scores[0] + 1:
            return "improving"
        elif scores[-1] < scores[0] - 1:
            return "declining"
        else:
            return "stable"


class UserPreferences(models.Model):
    """Fine-grained preferences for each user"""
    
    profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='preferences')
    
    # Wellness goals
    daily_goal = models.CharField(
        max_length=50,
        choices=[
            ('stress_relief', 'Reduce Stress'),
            ('mood_boost', 'Boost Mood'),
            ('sleep', 'Better Sleep'),
            ('focus', 'Improve Focus'),
            ('general', 'General Wellness'),
        ],
        default='general'
    )
    
    # Recommendations
    use_ai_recommendations = models.BooleanField(default=True)
    recommendation_frequency = models.CharField(
        max_length=20,
        choices=[('always', 'Always'), ('sometimes', 'Sometimes'), ('rarely', 'Rarely')],
        default='sometimes'
    )
    
    # Data collection
    share_data_for_improvement = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Preferences of {self.profile.user.username}"


class EmotionPrediction(models.Model):
    """Emotion detection with user context for personalization"""
    
    EMOTION_CHOICES = [
        ('angry', 'Angry'),
        ('disgusted', 'Disgusted'),
        ('fearful', 'Fearful'),
        ('happy', 'Happy'),
        ('neutral', 'Neutral'),
        ('sad', 'Sad'),
        ('surprised', 'Surprised'),
    ]
    
    # User context
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    
    # Prediction
    emotion = models.CharField(max_length=20, choices=EMOTION_CHOICES)
    confidence = models.FloatField()
    
    # Context
    time_of_day = models.CharField(
        max_length=20,
        choices=[
            ('morning', 'Morning (6-12)'),
            ('afternoon', 'Afternoon (12-18)'),
            ('evening', 'Evening (18-24)'),
            ('night', 'Night (0-6)'),
        ],
        null=True,
        blank=True
    )
    day_of_week = models.CharField(
        max_length=10,
        choices=[
            ('monday', 'Monday'),
            ('tuesday', 'Tuesday'),
            ('wednesday', 'Wednesday'),
            ('thursday', 'Thursday'),
            ('friday', 'Friday'),
            ('saturday', 'Saturday'),
            ('sunday', 'Sunday'),
        ],
        null=True,
        blank=True
    )
    
    # User feedback
    user_confirmed = models.BooleanField(null=True, blank=True)  # Did user confirm accuracy?
    user_notes = models.TextField(blank=True)
    
    # Metadata
    image_hash = models.CharField(max_length=64, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        user_str = self.user.username if self.user else 'Anonymous'
        return f"{user_str} - {self.emotion} ({self.confidence:.0%})"
    
    @property
    def accuracy_feedback(self):
        """Get user feedback on detection accuracy"""
        if self.user_confirmed is None:
            return "pending"
        return "accurate" if self.user_confirmed else "inaccurate"


class WellnessRecommendation(models.Model):
    """Personalized wellness recommendations based on emotion patterns"""
    
    ACTIVITY_TYPES = [
        ('breathing', 'Breathing Exercise'),
        ('meditation', 'Meditation'),
        ('music', 'Music Playlist'),
        ('physical', 'Physical Activity'),
        ('social', 'Social Activity'),
        ('journaling', 'Journaling'),
        ('mindfulness', 'Mindfulness'),
        ('gratitude', 'Gratitude Practice'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    emotion = models.CharField(max_length=20)
    activity_type = models.CharField(max_length=30, choices=ACTIVITY_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    duration_minutes = models.IntegerField(default=10)
    
    # Recommendation metadata
    reason = models.TextField()  # Why this was recommended
    effectiveness_rating = models.FloatField(default=0.0)  # User rating after trying
    user_tried = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} (for {self.emotion})"


class EmotionPattern(models.Model):
    """Track emotion patterns over time for personalization"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='emotion_pattern')
    
    # Most common emotions
    most_common_emotion = models.CharField(max_length=20, blank=True)
    second_common_emotion = models.CharField(max_length=20, blank=True)
    
    # Time patterns
    peak_stress_time = models.CharField(max_length=20, blank=True)  # "afternoon" / "thursday"
    peak_happy_time = models.CharField(max_length=20, blank=True)
    
    # Trends
    weekly_pattern = models.JSONField(default=dict)  # {"monday": [scores], "tuesday": [...]}
    improvement_rate = models.FloatField(default=0.0)  # % improvement over time
    
    # Stats
    total_predictions = models.IntegerField(default=0)
    accuracy_feedback_percentage = models.FloatField(default=0.0)  # % of accurate predictions
    
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Patterns for {self.user.username}"
    
    @property
    def emotion_trend(self):
        """Calculate if emotions are improving/declining/stable"""
        predictions = EmotionPrediction.objects.filter(user=self.user).order_by('-created_at')[:14]
        if len(predictions) < 2:
            return "insufficient_data"
        
        emotions_scale = {'angry': 1, 'disgusted': 1, 'fearful': 2, 'sad': 2, 'neutral': 3, 'surprised': 4, 'happy': 5}
        scores = [emotions_scale.get(p.emotion, 3) for p in predictions]
        
        if scores and len(scores) >= 2:
            avg_recent = sum(scores[:7]) / 7 if len(scores) >= 7 else sum(scores) / len(scores)
            avg_older = sum(scores[-7:]) / 7 if len(scores) >= 7 else sum(scores) / len(scores)
            
            if avg_recent > avg_older + 0.5:
                return "improving"
            elif avg_recent < avg_older - 0.5:
                return "declining"
        
        return "stable"
    
    @staticmethod
    def calculate_for_user(user):
        """Calculate/update patterns for a user"""
        from django.db.models import Count
        
        predictions = EmotionPrediction.objects.filter(user=user)
        if not predictions.exists():
            return None
        
        pattern, created = EmotionPattern.objects.get_or_create(user=user)
        
        # Get most common emotions
        emotion_counts = predictions.values('emotion').annotate(count=Count('emotion')).order_by('-count')
        if emotion_counts:
            pattern.most_common_emotion = emotion_counts[0]['emotion']
            if len(emotion_counts) > 1:
                pattern.second_common_emotion = emotion_counts[1]['emotion']
        
        # Calculate accuracy
        accurate_predictions = predictions.filter(user_confirmed=True).count()
        confirmed_total = predictions.filter(user_confirmed__isnull=False).count()
        if confirmed_total > 0:
            pattern.accuracy_feedback_percentage = (accurate_predictions / confirmed_total) * 100
        
        pattern.total_predictions = predictions.count()
        pattern.save()
        
        return pattern
