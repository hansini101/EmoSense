#!/bin/bash
# EmoSense Backend - Personalized Setup

echo ""
echo "🚀 EmoSense Backend - Personalized Setup"
echo "========================================"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Install Python 3.9+"
    exit 1
fi

echo "✓ Python: $(python3 --version)"
echo ""

# Setup
echo "1️⃣  Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null

echo "2️⃣  Installing dependencies..."
pip install -r requirements.txt > /dev/null 2>&1

echo "3️⃣  Downloading ML model..."
python download_model.py > /dev/null 2>&1

echo "4️⃣  Running migrations..."
python manage.py makemigrations emotion > /dev/null 2>&1
python manage.py migrate > /dev/null 2>&1

echo ""
echo "✨ Personalized Backend Setup Complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Source venv: source venv/bin/activate"
echo "   2. Start server: python manage.py runserver"
echo ""
echo "🔐 Create admin user (optional):"
echo "   python manage.py createsuperuser"
echo ""
echo "📝 Test the API:"
echo "   - Register: POST /api/register/"
echo "   - Login: POST /api/login/"
echo "   - Predict: POST /api/predict/"
echo ""
echo "📚 Read: API_PERSONALIZED.md for full docs"
echo ""
