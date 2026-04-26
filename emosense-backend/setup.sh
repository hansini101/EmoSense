#!/bin/bash
# EmoSense Backend - Quick Start Guide

echo "🚀 EmoSense Backend Quick Start"
echo "================================"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Install Python 3.9+"
    exit 1
fi

echo "✓ Python found: $(python3 --version)"
echo ""

# Setup
echo "1️⃣  Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null

echo "2️⃣  Installing dependencies..."
pip install -r requirements.txt > /dev/null

echo "3️⃣  Downloading ML model..."
python download_model.py > /dev/null

echo "4️⃣  Setting up database..."
python manage.py migrate > /dev/null

echo ""
echo "✨ Setup Complete!"
echo ""
echo "🎯 Start the server:"
echo "   python manage.py runserver"
echo ""
echo "📸 Test the API:"
echo "   curl -X POST http://localhost:8000/api/predict/ -F 'image=@test.jpg'"
echo ""
