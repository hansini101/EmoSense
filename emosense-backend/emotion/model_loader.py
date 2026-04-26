"""
Model loader for TensorFlow emotion detection model
"""
import os
import numpy as np
from django.conf import settings

# Global model instance
_model = None


def load_model():
    """Load the emotion detection model"""
    global _model
    
    if _model is not None:
        return _model
    
    try:
        # Use the correct import path for TensorFlow 2.13.0
        from tensorflow.keras import models
        
        model_path = settings.ML_MODEL_PATH
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model not found at {model_path}. "
                "Please download the model using: python download_model.py"
            )
        
        _model = models.load_model(model_path)
        print(f"✓ Model loaded successfully from {model_path}")
        return _model
        
    except ImportError:
        raise ImportError(
            "TensorFlow not installed. Install with: pip install tensorflow"
        )
    except Exception as e:
        raise RuntimeError(f"Failed to load model: {str(e)}")


def predict_emotion(preprocessed_image):
    """
    Predict emotion from preprocessed image
    
    Args:
        preprocessed_image: numpy array of shape (1, 48, 48, 1)
    
    Returns:
        dict with emotion and confidence
    """
    model = load_model()
    
    # Make prediction
    predictions = model.predict(preprocessed_image, verbose=0)
    
    # Get emotion with highest confidence
    emotion_idx = np.argmax(predictions[0])
    confidence = float(predictions[0][emotion_idx])
    
    emotion_labels = settings.EMOTION_LABELS
    emotion = emotion_labels[emotion_idx]
    
    return {
        'emotion': emotion,
        'confidence': confidence,
        'all_predictions': {
            emotion_labels[i]: float(predictions[0][i])
            for i in range(len(emotion_labels))
        }
    }
