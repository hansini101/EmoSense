"""
Django settings for EmoSense backend.
"""

from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-emosense-dev-key-change-in-production'

DEBUG = True

ALLOWED_HOSTS = ['*', 'localhost', '127.0.0.1']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'emotion',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# MongoDB Configuration with mongoengine
import mongoengine

MONGO_USER = os.getenv('MONGO_USER', '')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD', '')
MONGO_HOST = os.getenv('MONGO_HOST', 'localhost')
MONGO_PORT = int(os.getenv('MONGO_PORT', '27017'))
MONGO_DB = os.getenv('MONGO_DB', 'emosense_db')
MONGO_AUTH_SOURCE = os.getenv('MONGO_AUTH_SOURCE', 'admin')

# Connect to MongoDB
if MONGO_USER and MONGO_PASSWORD:
    mongoengine.connect(
        db=MONGO_DB,
        host=MONGO_HOST,
        port=MONGO_PORT,
        username=MONGO_USER,
        password=MONGO_PASSWORD,
        authentication_source=MONGO_AUTH_SOURCE,
        retryWrites=False
    )
else:
    mongoengine.connect(
        db=MONGO_DB,
        host=MONGO_HOST,
        port=MONGO_PORT
    )

# Keep SQLite for Django auth
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    "http://127.0.0.1:3003",
    "http://localhost:8000",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}

# ML Model Configuration
ML_MODEL_PATH = os.path.join(BASE_DIR, 'emotion', 'ml_model', 'emotion_model.h5')
EMOTION_LABELS = ['Angry', 'Disgusted', 'Fearful', 'Happy', 'Neutral', 'Sad', 'Surprised']
