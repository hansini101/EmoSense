#!/usr/bin/env python
"""
Initialize EmoSense database with test users
Run this AFTER starting MongoDB and Django
"""
import os
import sys
import django

sys.path.insert(0, '/c/Projects/EmoSense/emosense-backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from emotion.models import AdminUser, UserProfile

def create_users():
    """Create test users in database"""
    print("=" * 50)
    print("EmoSense Database Setup")
    print("=" * 50)
    
    # Create admin user
    admin_user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@emosense.com',
            'is_staff': True,
            'is_superuser': True
        }
    )
    if created:
        admin_user.set_password('Admin@123')
        admin_user.save()
        print("✅ Created admin user: admin / Admin@123")
    else:
        print("✅ Admin user already exists: admin / Admin@123")
    
    # Create regular test user
    test_user, created = User.objects.get_or_create(
        username='testuser2024',
        defaults={
            'email': 'test@emosense.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
    )
    if created:
        test_user.set_password('Test@123')
        test_user.save()
        print("✅ Created test user: testuser2024 / Test@123")
    else:
        print("✅ Test user already exists: testuser2024 / Test@123")
    
    # Mark admin user as admin in MongoDB
    try:
        admin_doc = AdminUser.objects.get(username='admin')
        print("✅ Admin user already in MongoDB")
    except:
        AdminUser.objects.create(
            username='admin',
            email='admin@emosense.com',
            is_admin=True
        )
        print("✅ Created admin in MongoDB")
    
    print("\n" + "=" * 50)
    print("Database Setup Complete!")
    print("=" * 50)
    print("\nYou can now login with:")
    print("  Admin: admin / Admin@123")
    print("  User: testuser2024 / Test@123")
    print("\nAccess: http://localhost:3000")
    print("=" * 50)

if __name__ == '__main__':
    try:
        create_users()
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Make sure MongoDB and Django are running!")
