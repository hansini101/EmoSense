@echo off
REM EmoSense Backend - Setup for Windows

echo.
echo 🚀 EmoSense Backend - Windows Setup
echo ====================================
echo.

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found. Install Python 3.9+ from python.org
    pause
    exit /b 1
)

echo ✓ Python found
echo.

REM Setup
echo 1️⃣  Creating virtual environment...
python -m venv venv

echo 2️⃣  Activating virtual environment...
call venv\Scripts\activate.bat

echo 3️⃣  Upgrading pip...
python -m pip install --upgrade pip >nul 2>&1

echo 4️⃣  Installing dependencies...
pip install -r requirements.txt >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo 5️⃣  Downloading ML model...
python download_model.py

echo 6️⃣  Creating database and running migrations...
python manage.py makemigrations emotion
python manage.py migrate

echo.
echo ✨ Setup Complete!
echo.
echo 🎯 Next steps:
echo    1. Activate venv: venv\Scripts\activate.bat
echo    2. Start server: python manage.py runserver
echo.
echo 📝 Or run the server directly:
echo    python manage.py runserver
echo.
echo 🌐 Server will be at: http://localhost:8000
echo.
pause
