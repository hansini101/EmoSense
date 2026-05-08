# EmoSense - Quick Start Guide

## Development Environment

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 12+ (or SQLite for local dev)

### Frontend Setup
```bash
cd emosense-frontend
npm install
# or pnpm install

# Create .env.local
cp .env.development .env.local

# Start dev server
npm run dev
# Frontend will run on http://localhost:3000
```

### Backend Setup
```bash
cd emosense-backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start dev server
python manage.py runserver
# Backend will run on http://localhost:8000
```

### Access the Application
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin-login
- API: http://localhost:8000/api
- Django Admin: http://localhost:8000/admin

---

## Authentication

### Admin Credentials
- **Username**: admin
- **Password**: Admin@123
- **Access**: http://localhost:3000/admin-login

### User Credentials (for testing)
- **Username**: testuser2024
- **Password**: Test@123
- **Access**: http://localhost:3000/login

### Key Features
- ✅ Role-based access control (Admin vs User)
- ✅ Separate login pages for admin and users
- ✅ Admin-only dashboard at /admin
- ✅ User dashboard at /dashboard
- ✅ Logout button in authenticated navbar
- ✅ Language switcher (English / Sinhala)
- ✅ Token-based authentication

---

## Production Deployment

### Quick Deployment Steps

1. **Read the Deployment Guide**
   ```bash
   cat DEPLOYMENT.md
   ```

2. **Prepare Environment Variables**
   - Frontend: `emosense-frontend/.env.production`
   - Backend: `emosense-backend/.env.production`

3. **Deploy Backend**
   - Use Gunicorn + Systemd
   - Configure Nginx reverse proxy
   - Setup PostgreSQL database

4. **Deploy Frontend**
   - Build with `npm run build`
   - Use PM2 for process management
   - Configure Nginx for static assets

5. **SSL/TLS**
   - Use Let's Encrypt for free certificates
   - Configure auto-renewal

6. **Verify Deployment**
   - Check both services running
   - Test login flows
   - Verify API connectivity
   - Test admin panel

---

## Environment Variables

### Frontend (.env.local or .env.production)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEPLOYMENT_URL=http://localhost:3000
NEXT_PUBLIC_SUPPORTED_LANGUAGES=en,si
```

### Backend (.env)
```bash
DEBUG=True  # Set to False in production
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
```

---

## Project Structure

```
EmoSense/
├── emosense-frontend/          # Next.js React app
│   ├── app/                    # Page routes
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   └── (main)/            # Main app pages
│   ├── components/             # Reusable components
│   ├── lib/                    # Utilities
│   ├── public/                 # Static assets
│   └── .env.production         # Production config
│
├── emosense-backend/           # Django DRF backend
│   ├── config/                 # Django settings
│   ├── emotion/                # Emotion detection app
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.production         # Production config
│
├── DEPLOYMENT.md               # Full deployment guide
└── README.md
```

---

## Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production build
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript
```

### Backend
```bash
python manage.py runserver       # Start dev server
python manage.py migrate         # Apply migrations
python manage.py createsuperuser # Create admin user
python manage.py collectstatic   # Collect static files
python manage.py shell           # Interactive shell
```

---

## Features

✅ **Authentication**
- User registration and login
- Admin login with role separation
- Token-based JWT authentication
- Logout functionality

✅ **Emotion Detection**
- Real-time emotion detection using webcam
- Emotion history tracking
- Personalized recommendations

✅ **Admin Panel**
- User management
- Emotion analytics dashboard
- Risk alerts system
- Feedback management
- Resource management

✅ **User Features**
- Emotion detection
- Wellness hub
- AI therapist (Luma)
- Mood history
- Counselor booking
- Language switching (EN/SI)

✅ **Security**
- CORS protection
- CSRF tokens
- Role-based access control
- Secure password storage
- HTTPOnly cookies

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Database Errors
```bash
# Reset database (development only)
python manage.py migrate --run-syncdb

# Check migrations
python manage.py showmigrations
```

### CORS Errors
- Verify `CORS_ALLOWED_ORIGINS` in backend settings
- Check frontend API_BASE_URL
- Restart backend after changes

### Frontend Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

---

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [DEPLOYMENT.md](DEPLOYMENT.md) guide
3. Check GitHub Issues
4. Contact: support@emosense.com

---

## License

EmoSense © 2026. All rights reserved.
