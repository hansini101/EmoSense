"""
Quick setup script for EmoSense Backend
Run this after cloning to get started
"""

import os
import sys
import subprocess

def run_command(cmd, description):
    """Run a shell command and report status"""
    print(f"\n📦 {description}...")
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        print(f"❌ Failed: {description}")
        return False
    print(f"✓ {description}")
    return True


def main():
    print("\n🚀 EmoSense Backend Setup\n")
    
    steps = [
        ("python -m venv venv", "Creating virtual environment"),
        ("python -m pip install --upgrade pip", "Upgrading pip"),
        ("pip install -r requirements.txt", "Installing dependencies"),
        ("python download_model.py", "Downloading ML model"),
        ("python manage.py migrate", "Setting up database"),
    ]
    
    for cmd, desc in steps:
        if not run_command(cmd, desc):
            print(f"\n⚠️  Setup partially complete. Continue manually or fix the issue.")
            return
    
    print("\n" + "="*50)
    print("✨ Setup Complete!")
    print("="*50)
    print("\n🎯 Next steps:")
    print("   1. Activate venv: source venv/bin/activate")
    print("   2. Start server: python manage.py runserver")
    print("   3. Test API: curl -X POST http://localhost:8000/api/predict/ -F 'image=@test.jpg'")
    print("\n📚 Read: README.md for full documentation")
    print()


if __name__ == '__main__':
    main()
