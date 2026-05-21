"""
Image preprocessing utilities for emotion detection
EfficientNetB0 + RAF-DB: 224x224 RGB input
"""
import cv2
import numpy as np
from PIL import Image
from tensorflow.keras.applications.efficientnet import preprocess_input

# ========================
# IMAGE VALIDATION CONSTANTS
# ========================
MAX_IMAGE_SIZE_MB = 5
MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
ALLOWED_FORMATS = {'JPEG', 'PNG', 'WEBP', 'GIF'}
IMG_SIZE = 224  # EfficientNetB0 native input size


# ========================
# IMAGE VALIDATION FUNCTION
# ========================
def is_valid_image_content(file):
    """
    Validate image file by checking actual content, not filename.
    """
    try:
        file.seek(0)
        img = Image.open(file)
        img.convert("RGB")  # Force full decoding
        file.seek(0)
        return True
    except Exception as e:
        print(f"IMAGE ERROR: {e}")
        return False


def preprocess_image(image_file):
    """
    Preprocess image for EfficientNetB0 emotion detection model.

    Pipeline:
        1. Decode image with OpenCV
        2. Detect face with Haar Cascade (fallback to full image)
        3. Resize to 224x224
        4. Convert BGR → RGB
        5. Apply EfficientNetB0 preprocess_input (not /255.0)
        6. Return shape (1, 224, 224, 3)

    Args:
        image_file: Django UploadedFile object

    Returns:
        numpy array of shape (1, 224, 224, 3)
    """
    try:
        # Read from beginning
        image_file.seek(0)
        image_data = image_file.read()
        nparr = np.frombuffer(image_data, np.uint8)

        # Decode as colour image
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Failed to decode image")

        # ── Face detection ────────────────────────────────────────────────────
        import os
        cascade_path = os.path.join(
            os.path.dirname(__file__),
            'haarcascade_frontalface_default.xml'
        )
        face_cascade = cv2.CascadeClassifier(cascade_path)
        img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(img_gray, 1.3, 5)

        if len(faces) == 0:
            print("WARNING: No face detected, using full image")
            face_roi = img  # Keep as colour (BGR)
        else:
            x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
            face_roi = img[y:y + h, x:x + w]  # Crop colour image, NOT grayscale

        # ── Resize to 224x224 ─────────────────────────────────────────────────
        img_resized = cv2.resize(face_roi, (IMG_SIZE, IMG_SIZE))

        # ── BGR → RGB ─────────────────────────────────────────────────────────
        img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)

        # ── EfficientNetB0 preprocessing ──────────────────────────────────────
        # preprocess_input handles its own scaling — do NOT divide by 255.0
        img_array = img_rgb.astype(np.float32)
        img_preprocessed = preprocess_input(img_array)

        # ── Add batch dimension → (1, 224, 224, 3) ───────────────────────────
        img_final = np.expand_dims(img_preprocessed, axis=0)

        print(f"DEBUG: Preprocessed image shape: {img_final.shape}")
        return img_final

    except Exception as e:
        raise ValueError(f"Image preprocessing failed: {str(e)}")


def get_image_hash(image_file):
    """Get SHA256 hash of image for deduplication."""
    import hashlib
    image_file.seek(0)
    image_hash = hashlib.sha256(image_file.read()).hexdigest()
    image_file.seek(0)
    return image_hash