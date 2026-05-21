"""
Download and setup emotion detection model

This script sets up the EmoSense emotion detection model.
The production model is EfficientNetB0 trained on RAF-DB (.keras format).

Usage:
    python download_model.py
"""

import os
import json
from pathlib import Path

# ── Model configuration ───────────────────────────────────────────────────────
BASE_DIR  = Path(__file__).parent
MODEL_DIR = BASE_DIR / 'emotion' / 'ml_model'

# .keras is the native Keras 3 format — replaces legacy .h5
# Advantages over .h5:
#   - Custom objects (e.g. WarmupCosineDecay) are stored inside the file
#   - No need to pass custom_objects= when loading
#   - Faster save/load, more reliable architecture serialisation
MODEL_PATH = MODEL_DIR / 'emotion_model.keras'

IMG_SIZE    = 224   # EfficientNetB0 native input size (was 96 for MobileNetV2)
NUM_CLASSES = 7

EMOTION_LABELS = ['surprise', 'fear', 'disgust', 'happy', 'sad', 'angry', 'neutral']


def check_existing_model():
    """Check if a valid model file already exists."""
    if MODEL_PATH.exists():
        size_mb = MODEL_PATH.stat().st_size / 1024 / 1024
        print(f"✓ Model already exists at {MODEL_PATH}")
        print(f"  Size: {size_mb:.2f} MB")
        return True
    return False


def check_for_placed_model():
    """
    Check if the user has manually placed their trained .keras model.
    This is the recommended path — copy your downloaded emotion_model_rafdb_v3.keras
    into the ml_model directory and rename it to emotion_model.keras.
    """
    expected = MODEL_DIR / 'emotion_model.keras'
    alternatives = list(MODEL_DIR.glob('*.keras')) + list(MODEL_DIR.glob('*.h5'))

    if expected.exists():
        return True

    if alternatives:
        found = alternatives[0]
        print(f"⚠  Found model file: {found.name}")
        print(f"   Renaming to emotion_model.keras ...")
        found.rename(expected)
        print(f"✓ Renamed to {expected}")
        return True

    return False


def create_placeholder_model():
    """
    Create a placeholder EfficientNetB0 model with ImageNet weights only.

    IMPORTANT: This model is NOT trained for emotion detection.
    It exists solely so the backend server can start without crashing.
    Replace it with your trained emotion_model_rafdb_v3.keras for real predictions.

    Architecture matches the production model exactly:
        EfficientNetB0 → GAP → BN → Dense(512) → Drop(0.4)
                              → Dense(256) → Drop(0.3) → Softmax(7)
    """
    try:
        import tensorflow as tf
        from tensorflow.keras import layers, regularizers
        from tensorflow.keras.applications import EfficientNetB0

        print("📦 Creating placeholder EfficientNetB0 model (ImageNet weights only)...")
        print("   ⚠  This model is NOT trained for emotion detection.")
        print("   Place your trained emotion_model_rafdb_v3.keras in:")
        print(f"   {MODEL_DIR}")

        backbone = EfficientNetB0(
            weights='imagenet',
            include_top=False,
            input_shape=(IMG_SIZE, IMG_SIZE, 3)
        )
        backbone.trainable = False

        inputs  = tf.keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
        x       = backbone(inputs, training=False)
        x       = layers.GlobalAveragePooling2D()(x)
        x       = layers.BatchNormalization()(x)
        x       = layers.Dense(512, activation='relu',
                               kernel_regularizer=regularizers.l2(1e-4))(x)
        x       = layers.Dropout(0.4)(x)
        x       = layers.Dense(256, activation='relu',
                               kernel_regularizer=regularizers.l2(1e-4))(x)
        x       = layers.Dropout(0.3)(x)
        outputs = layers.Dense(NUM_CLASSES, activation='softmax')(x)

        model = tf.keras.Model(inputs, outputs)

        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )

        os.makedirs(MODEL_DIR, exist_ok=True)

        # .keras format — no custom_objects= needed on load
        model.save(str(MODEL_PATH))

        size_mb = MODEL_PATH.stat().st_size / 1024 / 1024
        print(f"✓ Placeholder model saved to {MODEL_PATH}  ({size_mb:.1f} MB)")
        return True

    except ImportError:
        print("❌ TensorFlow not installed. Run: pip install tensorflow")
        return False
    except Exception as e:
        print(f"❌ Error creating placeholder model: {e}")
        return False


def load_model_test():
    """Smoke-test that the saved model loads and runs a dummy prediction."""
    try:
        import tensorflow as tf
        import numpy as np

        print("\n🔍 Smoke-testing model load...")

        # .keras format: no custom_objects= required
        model = tf.keras.models.load_model(str(MODEL_PATH))

        dummy = np.zeros((1, IMG_SIZE, IMG_SIZE, 3), dtype=np.float32)
        preds = model.predict(dummy, verbose=0)

        assert preds.shape == (1, NUM_CLASSES), \
            f"Unexpected output shape: {preds.shape}"

        predicted_label = EMOTION_LABELS[preds.argmax()]
        print(f"✓ Model loaded successfully")
        print(f"  Input shape : (1, {IMG_SIZE}, {IMG_SIZE}, 3)")
        print(f"  Output shape: {preds.shape}")
        print(f"  Dummy prediction: {predicted_label} ({preds.max()*100:.1f}% confidence)")
        return True

    except Exception as e:
        print(f"❌ Model load test failed: {e}")
        return False


def print_instructions():
    """Print instructions for placing the trained model."""
    print("\n" + "─" * 60)
    print("  HOW TO USE YOUR TRAINED MODEL")
    print("─" * 60)
    print(f"  1. Copy emotion_model_rafdb_v3.keras (downloaded from")
    print(f"     Google Colab) into:")
    print(f"     {MODEL_DIR}")
    print(f"  2. Rename it to:  emotion_model.keras")
    print(f"  3. Re-run this script to verify, or start the server.")
    print()
    print("  Format note:")
    print("  .keras  — Native Keras 3 format (recommended)")
    print("           Custom objects stored inside; no extra args needed.")
    print("  .h5     — Legacy HDF5 format (Keras 1/2 era)")
    print("           Requires custom_objects= on load; slower.")
    print("─" * 60 + "\n")


def main():
    print("\n🚀 EmoSense — Emotion Detection Model Setup")
    print(f"   Model format : .keras  (Keras 3 native)")
    print(f"   Architecture : EfficientNetB0 + RAF-DB")
    print(f"   Input size   : {IMG_SIZE}×{IMG_SIZE} RGB")
    print(f"   Classes      : {NUM_CLASSES}  {EMOTION_LABELS}\n")

    os.makedirs(MODEL_DIR, exist_ok=True)

    # 1. Already set up?
    if check_existing_model():
        load_model_test()
        return

    # 2. User placed their trained .keras (or .h5) file manually?
    if check_for_placed_model():
        print("✓ Trained model found.")
        load_model_test()
        return

    # 3. Nothing found — print instructions and create placeholder
    print("⚠  No trained model found in model directory.")
    print_instructions()

    print("Creating placeholder model so the server can start...\n")
    if create_placeholder_model():
        load_model_test()
        print("\n⚠  Remember: replace the placeholder with your trained")
        print(f"   emotion_model_rafdb_v3.keras for real predictions.")
    else:
        print("\n❌ Setup failed. Check TensorFlow installation.")


if __name__ == '__main__':
    main()