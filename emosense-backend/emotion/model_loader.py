"""
Model loader for EfficientNetB0 emotion detection model (.keras format)
"""
import os
import numpy as np
from pathlib import Path
from django.conf import settings

# Global model instance — loaded once, reused for all requests
_model = None


def load_model():
    """
    Load the EfficientNetB0 emotion detection model.

    Uses a global singleton so the model is loaded only once on first
    request and cached in memory for all subsequent requests.

    Returns:
        Loaded Keras model ready for prediction
    """
    global _model

    if _model is not None:
        return _model

    try:
        import tensorflow as tf

        model_path = settings.ML_MODEL_PATH

        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model not found at {model_path}. "
                "Run: python download_model.py"
            )

        # .keras format loads cleanly with no custom_objects needed
        _model = tf.keras.models.load_model(model_path)
        print(f"✓ EfficientNetB0 model loaded from {model_path}")
        print(f"  Input shape  : {_model.input_shape}")
        print(f"  Output shape : {_model.output_shape}")
        return _model

    except ImportError:
        raise ImportError(
            "TensorFlow not installed. Run: pip install tensorflow"
        )
    except Exception as e:
        raise RuntimeError(f"Failed to load model: {str(e)}")


def predict_emotion(preprocessed_image):
    """
    Predict emotion from preprocessed image.

    Args:
        preprocessed_image: numpy array of shape (1, 224, 224, 3)

    Returns:
        dict with emotion label, confidence, and all class probabilities
    """
    model = load_model()
    predictions = model.predict(preprocessed_image, verbose=0)

    emotion_idx = int(np.argmax(predictions[0]))
    confidence = float(predictions[0][emotion_idx])
    emotion_labels = settings.EMOTION_LABELS

    return {
        'emotion': emotion_labels[emotion_idx],
        'confidence': confidence,
        'all_predictions': {
            emotion_labels[i]: float(predictions[0][i])
            for i in range(len(emotion_labels))
        }
    }