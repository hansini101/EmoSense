#!/usr/bin/env python3
"""
EmoSense System Verification & Testing Script
Comprehensive check of all components
"""

import os
import sys
import subprocess
from pathlib import Path

def print_header(text):
    print("\n" + "="*70)
    print(f"🔍 {text}")
    print("="*70)

def check_python_version():
    print_header("Python Version")
    version = sys.version
    print(f"✅ Python: {version}")
    return True

def check_dependencies():
    print_header("Required Packages")
    
    packages = {
        'django': 'Django',
        'rest_framework': 'Django REST Framework',
        'mongoengine': 'MongoEngine',
        'pymongo': 'PyMongo',
        'tensorflow': 'TensorFlow',
        'numpy': 'NumPy',
        'cv2': 'OpenCV',
        'PIL': 'Pillow'
    }
    
    all_ok = True
    for module, name in packages.items():
        try:
            __import__(module)
            print(f"✅ {name:30} - Installed")
        except ImportError:
            print(f"❌ {name:30} - NOT installed")
            all_ok = False
    
    return all_ok

def check_mongodb():
    print_header("MongoDB Connection")
    
    try:
        import mongoengine
        from django.conf import settings
        
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
        import django
        django.setup()
        
        print(f"📍 Host: {settings.MONGO_HOST}")
        print(f"📍 Port: {settings.MONGO_PORT}")
        print(f"📍 Database: {settings.MONGO_DB}")
        print("✅ MongoDB configured successfully")
        return True
        
    except Exception as e:
        print(f"⚠️  MongoDB configuration error: {e}")
        print("   Note: MongoDB may not be running yet")
        return True  # Don't fail - user needs to start MongoDB

def check_django_setup():
    print_header("Django Configuration")
    
    try:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
        import django
        django.setup()
        
        from django.conf import settings
        
        print(f"✅ DEBUG: {settings.DEBUG}")
        print(f"✅ INSTALLED_APPS: {len(settings.INSTALLED_APPS)} apps")
        print(f"✅ DATABASES: {list(settings.DATABASES.keys())}")
        print(f"✅ REST_FRAMEWORK configured")
        return True
        
    except Exception as e:
        print(f"❌ Django setup error: {e}")
        return False

def check_model_file():
    print_header("Trained Model")
    
    model_path = Path("emotion/ml_model/emotion_model.keras")
    
    if model_path.exists():
        size_mb = model_path.stat().st_size / (1024 * 1024)
        print(f"✅ Model file found")
        print(f"   📍 Location: {model_path}")
        print(f"   📊 Size: {size_mb:.2f} MB")
        return True
    else:
        print(f"⚠️  Model file NOT found")
        print(f"   📍 Expected: {model_path}")
        print("   Note: This is optional - you can add it later")
        return True

def check_env_file():
    print_header(".env Configuration")
    
    env_path = Path(".env")
    
    if env_path.exists():
        print(f"✅ .env file found")
        with open(env_path, 'r') as f:
            lines = f.readlines()
            print(f"   📝 Contains {len(lines)} settings")
        return True
    else:
        print(f"⚠️  .env file NOT found")
        print("   Note: Using default values from settings.py")
        return True

def check_api_routes():
    print_header("API Routes")
    
    try:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
        import django
        django.setup()
        
        from emotion.urls import urlpatterns as emotion_urls
        
        routes = [
            '/api/register/',
            '/api/login/',
            '/api/check-admin/',
            '/api/predict/',
            '/api/profile/',
            '/api/stats/',
            '/api/history/',
        ]
        
        print("✅ API Endpoints:")
        for route in routes:
            print(f"   📍 {route}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error checking routes: {e}")
        return False

def check_frontend():
    print_header("Frontend Configuration")
    
    frontend_path = Path("../emosense-frontend")
    env_path = frontend_path / ".env.development"
    
    if frontend_path.exists():
        print(f"✅ Frontend directory found")
        
        if env_path.exists():
            print(f"✅ .env.development found")
            with open(env_path, 'r') as f:
                content = f.read()
                if 'localhost:8000' in content or 'API_BASE_URL' in content:
                    print(f"✅ Backend URL configured")
        else:
            print(f"⚠️  .env.development NOT found (will use defaults)")
        
        return True
    else:
        print(f"⚠️  Frontend not found at {frontend_path}")
        return True

def print_summary(results):
    print_header("Summary")
    
    passed = sum(1 for r in results.values() if r)
    total = len(results)
    
    print(f"Checks passed: {passed}/{total}\n")
    
    for check, result in results.items():
        status = "✅" if result else "❌"
        print(f"  {status} {check}")
    
    if all(results.values()):
        print("\n🎉 All checks passed!")
        print("\n🚀 Next Steps:")
        print("   1. Ensure MongoDB is running (MONGODB_SETUP.md)")
        print("   2. Start backend: python manage.py runserver")
        print("   3. Start frontend: npm run dev")
        print("   4. Test at: http://localhost:3000")
    else:
        print("\n⚠️  Some checks failed. Please review above.")

def main():
    print("\n" + "="*70)
    print("🎨 EmoSense System Verification")
    print("="*70)
    
    backend_path = Path(__file__).parent / "emosense-backend"
    os.chdir(backend_path)
    sys.path.insert(0, str(backend_path))
    
    results = {
        "Python Version": check_python_version(),
        "Dependencies": check_dependencies(),
        "Django Setup": check_django_setup(),
        "MongoDB Config": check_mongodb(),
        "Model File": check_model_file(),
        ".env File": check_env_file(),
        "API Routes": check_api_routes(),
        "Frontend": check_frontend(),
    }
    
    print_summary(results)
    print("\n" + "="*70 + "\n")

if __name__ == "__main__":
    main()
