"""
Download and setup emotion detection model

This script downloads a pretrained emotion detection model.
Supports multiple sources:
- FER+ model from TensorFlow Hub
- Custom trained models

Usage:
    python download_model.py
"""

import os
import urllib.request
import json
from pathlib import Path

# Model paths
BASE_DIR = Path(__file__).parent
MODEL_DIR = BASE_DIR / 'emotion' / 'ml_model'
MODEL_PATH = MODEL_DIR / 'emotion_model.h5'


def create_simple_model():
    """
    Create a simple CNN model if pretrained one is not available
    This is a placeholder model for development/testing
    """
    try:
        import tensorflow as tf
        from tensorflow.keras import layers, models
        
        print("📦 Creating simple emotion detection model...")
        
        model = models.Sequential([
            layers.Conv2D(64, (3, 3), activation='relu', input_shape=(48, 48, 1)),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            layers.Conv2D(128, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            layers.Conv2D(256, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            layers.Flatten(),
            layers.Dense(256, activation='relu'),
            layers.Dropout(0.5),
            layers.Dense(7, activation='softmax')  # 7 emotions
        ])
        
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        # Save model
        model.save(str(MODEL_PATH))
        print(f"✓ Model created and saved to {MODEL_PATH}")
        return True
        
    except ImportError:
        print("❌ TensorFlow not installed. Install with: pip install tensorflow")
        return False
    except Exception as e:
        print(f"❌ Error creating model: {e}")
        return False


def download_pretrained_model():
    """
    Download pretrained FER emotion model
    """
    try:
        # Option 1: Use a pre-downloaded model (faster for testing)
        # This is a 5MB FER-2013 trained model
        model_url = "https://github.com/matin-gh/emotion-detection-cnn/releases/download/v1/model.h5"
        
        print(f"📥 Downloading pretrained model...")
        print(f"   From: {model_url}")
        
        os.makedirs(MODEL_DIR, exist_ok=True)
        
        def download_progress(block_num, block_size, total_size):
            downloaded = block_num * block_size
            percent = min(downloaded * 100 // total_size, 100)
            print(f"   Downloaded: {percent}%", end='\r')
        
        urllib.request.urlretrieve(model_url, MODEL_PATH, download_progress)
        print(f"\n✓ Model downloaded to {MODEL_PATH}")
        return True
        
    except Exception as e:
        print(f"❌ Error downloading model: {e}")
        print("   Falling back to creating a new model...")
        return False


def main():
    """Main setup function"""
    print("\n🚀 EmoSense Emotion Detection Model Setup\n")
    
    # Create model directory
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    # Check if model already exists
    if MODEL_PATH.exists():
        print(f"✓ Model already exists at {MODEL_PATH}")
        print(f"  Size: {MODEL_PATH.stat().st_size / 1024 / 1024:.2f}MB")
        return
    
    print("Model not found. Attempting to download...\n")
    
    # Try downloading pretrained model first
    if download_pretrained_model():
        return
    
    # Fall back to creating a simple model
    print("\n")
    if create_simple_model():
        return
    
    print("\n❌ Failed to setup model. Please check dependencies.")


if __name__ == '__main__':
    main()
