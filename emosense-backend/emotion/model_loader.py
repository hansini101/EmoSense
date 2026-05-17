"""
Model loader for TensorFlow emotion detection model
"""
import os
import sys
import types
import numpy as np
from django.conf import settings

# Global model instance
_model = None


def _register_keras_compatibility_shims():
    """Bridge Keras 3 serialization paths onto the TensorFlow 2.15 runtime."""
    if 'keras.src.models.functional' in sys.modules:
        return {
            'Functional': sys.modules['keras.src.models.functional'].Functional,
        }

    try:
        from tensorflow.python.keras.engine.functional import Functional
        from tensorflow.python.keras.layers import InputLayer as LegacyInputLayer
    except Exception:
        return

    legacy_input_layer_init = LegacyInputLayer.__init__

    def compatible_input_layer_init(self, *args, batch_shape=None, optional=False, **kwargs):
        if batch_shape is not None and 'input_shape' not in kwargs and 'batch_input_shape' not in kwargs:
            kwargs['input_shape'] = tuple(batch_shape[1:])
        legacy_input_layer_init(self, *args, **kwargs)

    LegacyInputLayer.__init__ = compatible_input_layer_init

    # Monkeypatch Dense to accept and ignore Keras 3's `quantization_config` kw
    try:
        import keras.layers as standalone_keras_layers
        Dense = getattr(standalone_keras_layers, 'Dense', None)
        if Dense is not None:
            orig_dense_init = Dense.__init__

            def dense_init_compat(self, *args, quantization_config=None, **kwargs):
                if 'quantization_config' in kwargs:
                    kwargs.pop('quantization_config')
                return orig_dense_init(self, *args, **kwargs)

            Dense.__init__ = dense_init_compat
    except Exception:
        pass

    keras_src_module = sys.modules.setdefault('keras.src', types.ModuleType('keras.src'))
    keras_src_models_module = sys.modules.setdefault(
        'keras.src.models',
        types.ModuleType('keras.src.models')
    )
    functional_module = types.ModuleType('keras.src.models.functional')
    functional_module.Functional = Functional

    keras_layers_module = sys.modules.get('tensorflow.keras.layers')
    if keras_layers_module is not None:
        setattr(keras_layers_module, 'InputLayer', LegacyInputLayer)

    try:
        import keras.layers as standalone_keras_layers
        setattr(standalone_keras_layers, 'InputLayer', LegacyInputLayer)
        standalone_keras_layers.InputLayer.__init__ = compatible_input_layer_init
    except Exception:
        pass

    legacy_layers_module = sys.modules.get('tensorflow.python.keras.layers')
    if legacy_layers_module is not None:
        setattr(legacy_layers_module, 'InputLayer', LegacyInputLayer)
        legacy_layers_module.InputLayer.__init__ = compatible_input_layer_init

    setattr(keras_src_module, 'models', keras_src_models_module)
    setattr(keras_src_models_module, 'functional', functional_module)
    sys.modules['keras.src.models.functional'] = functional_module

    custom_objects = {
        'Functional': Functional,
        'InputLayer': LegacyInputLayer,
    }

    try:
        import keras.layers as standalone_keras_layers
        for layer_name in ['Rescaling', 'Normalization']:
            layer_class = getattr(standalone_keras_layers, layer_name, None)
            if layer_class is not None:
                custom_objects[layer_name] = layer_class
    except Exception:
        pass

    try:
        import keras
        keras.utils.get_custom_objects().update(custom_objects)
    except Exception:
        pass

    try:
        from tensorflow.keras.utils import get_custom_objects as tf_get_custom_objects
        tf_get_custom_objects().update(custom_objects)
    except Exception:
        pass

    return custom_objects


def load_model():
    """Load the emotion detection model"""
    global _model
    
    if _model is not None:
        return _model
    
    try:
        # Use the correct import path for TensorFlow 2.13.0
        custom_objects = _register_keras_compatibility_shims() or {}
        from tensorflow.keras import models
        
        model_path = settings.ML_MODEL_PATH
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model not found at {model_path}. "
                "Please download the model using: python download_model.py"
            )
        
        _model = models.load_model(model_path, custom_objects=custom_objects)
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
        preprocessed_image: numpy array of shape (1, 96, 96, 1)
    
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
