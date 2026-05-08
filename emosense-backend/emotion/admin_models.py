from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class AdminUser(models.Model):
    """Admin user with role-based permissions"""
    
    ROLE_CHOICES = [
        ('superadmin', 'Super Admin'),
        ('admin', 'Admin'),
        ('moderator', 'Moderator'),
        ('analyst', 'Data Analyst'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='admin')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_admin = models.DateTimeField(null=True, blank=True)
    
    # Permissions
    can_manage_users = models.BooleanField(default=True)
    can_manage_content = models.BooleanField(default=True)
    can_view_analytics = models.BooleanField(default=True)
    can_manage_admins = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"


class UserSuspension(models.Model):
    """Track suspended/banned users"""
    
    REASON_CHOICES = [
        ('inappropriate_content', 'Inappropriate Content'),
        ('spam', 'Spam'),
        ('harassment', 'Harassment'),
        ('policy_violation', 'Policy Violation'),
        ('high_risk_alert', 'High Risk Alert'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='suspensions')
    reason = models.CharField(max_length=50, choices=REASON_CHOICES)
    description = models.TextField()
    suspended_by = models.ForeignKey(AdminUser, on_delete=models.SET_NULL, null=True)
    suspended_at = models.DateTimeField(auto_now_add=True)
    until = models.DateTimeField(null=True, blank=True)  # Temporary suspension date
    is_active = models.BooleanField(default=True)  # False = unsuspended
    
    def __str__(self):
        return f"{self.user.username} - {self.get_reason_display()}"


class WellnessRecommendation(models.Model):
    """Manage recommendations shown to users"""
    
    EMOTION_CHOICES = [
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('angry', 'Angry'),
        ('fearful', 'Fearful'),
        ('neutral', 'Neutral'),
        ('surprised', 'Surprised'),
        ('disgusted', 'Disgusted'),
    ]
    
    emotion = models.CharField(max_length=20, choices=EMOTION_CHOICES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    recommendation_type = models.CharField(
        max_length=50,
        choices=[
            ('breathing', 'Breathing Exercise'),
            ('meditation', 'Meditation'),
            ('music', 'Music'),
            ('activity', 'Activity'),
            ('quote', 'Motivational Quote'),
            ('resource', 'Resource'),
        ]
    )
    content = models.JSONField(default=dict)  # Flexible content structure
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(AdminUser, on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return f"{self.get_emotion_display()} - {self.title}"


class LumaAIPrompt(models.Model):
    """Manage Luma chatbot responses"""
    
    CATEGORY_CHOICES = [
        ('stress', 'Stress Management'),
        ('motivation', 'Motivation'),
        ('breathing', 'Breathing Exercises'),
        ('relaxation', 'Relaxation'),
        ('emergency', 'Emergency Support'),
        ('general', 'General Support'),
    ]
    
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    keyword = models.CharField(max_length=100)
    response = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(AdminUser, on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return f"{self.get_category_display()} - {self.keyword}"


class MentalHealthResource(models.Model):
    """Manage mental health resources"""
    
    RESOURCE_TYPE_CHOICES = [
        ('hotline', 'Hotline'),
        ('counselor', 'Counselor'),
        ('article', 'Article'),
        ('video', 'Video'),
        ('support_group', 'Support Group'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPE_CHOICES)
    contact_info = models.CharField(max_length=200, blank=True)  # Phone number, email, etc.
    url = models.URLField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    availability = models.CharField(max_length=100, blank=True)  # "24/7", "Mon-Fri 9-5", etc.
    is_emergency = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.get_resource_type_display()} - {self.title}"


class UserFeedback(models.Model):
    """Manage user feedback and support requests"""
    
    FEEDBACK_TYPE_CHOICES = [
        ('bug_report', 'Bug Report'),
        ('feature_request', 'Feature Request'),
        ('review', 'Review'),
        ('support_request', 'Support Request'),
        ('suggestion', 'Suggestion'),
    ]
    
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks')
    feedback_type = models.CharField(max_length=20, choices=FEEDBACK_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(
        max_length=10,
        choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('urgent', 'Urgent')],
        default='medium'
    )
    admin_response = models.TextField(blank=True)
    admin_assigned = models.ForeignKey(AdminUser, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.get_feedback_type_display()} - {self.title}"


class SystemNotification(models.Model):
    """System notifications and announcements"""
    
    NOTIFICATION_TYPE_CHOICES = [
        ('announcement', 'Announcement'),
        ('maintenance', 'Maintenance Notice'),
        ('alert', 'Alert'),
        ('wellness_tip', 'Wellness Tip'),
    ]
    
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES)
    created_by = models.ForeignKey(AdminUser, on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=True)
    target_users = models.CharField(
        max_length=20,
        choices=[('all', 'All Users'), ('new', 'New Users'), ('active', 'Active Users')],
        default='all'
    )
    scheduled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.get_notification_type_display()} - {self.title}"


class RiskAlert(models.Model):
    """High-risk emotional pattern detection"""
    
    RISK_LEVEL_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('reviewed', 'Reviewed'),
        ('contacted', 'Contacted User'),
        ('resolved', 'Resolved'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='risk_alerts')
    risk_level = models.CharField(max_length=10, choices=RISK_LEVEL_CHOICES)
    reason = models.TextField()  # Why was this flagged?
    emotion_pattern = models.JSONField(default=list)  # Emotions detected
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    reviewed_by = models.ForeignKey(AdminUser, on_delete=models.SET_NULL, null=True, blank=True)
    admin_notes = models.TextField(blank=True)
    action_taken = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.get_risk_level_display()}"


class SystemSettings(models.Model):
    """System-wide settings"""
    
    # AI Model settings
    ai_confidence_threshold = models.FloatField(default=0.7)  # Minimum confidence to report emotion
    model_version = models.CharField(max_length=50, default='1.0.0')
    
    # Safety settings
    enable_emergency_alerts = models.BooleanField(default=True)
    require_2fa = models.BooleanField(default=False)
    max_failed_login_attempts = models.IntegerField(default=5)
    
    # Features
    enable_luma_chat = models.BooleanField(default=True)
    enable_emotion_detection = models.BooleanField(default=True)
    enable_wellness_recommendations = models.BooleanField(default=True)
    
    # Email settings
    email_notifications_enabled = models.BooleanField(default=True)
    from_email = models.EmailField(default='noreply@emosense.com')
    
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(AdminUser, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return "System Settings"
    
    class Meta:
        verbose_name_plural = "System Settings"


class AdminActivityLog(models.Model):
    """Log all admin actions"""
    
    ACTION_CHOICES = [
        ('user_suspended', 'User Suspended'),
        ('user_deleted', 'User Deleted'),
        ('recommendation_added', 'Recommendation Added'),
        ('settings_changed', 'Settings Changed'),
        ('user_reset_password', 'Reset User Password'),
        ('alert_reviewed', 'Alert Reviewed'),
        ('other', 'Other'),
    ]
    
    admin = models.ForeignKey(AdminUser, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    description = models.TextField()
    target_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.admin.user.username} - {self.get_action_display()}"
