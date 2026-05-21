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
    try:
        image_file.seek(0)
        image_data = image_file.read()
        nparr = np.frombuffer(image_data, np.uint8)

        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Failed to decode image")

        import os
        cascade_path = os.path.join(
            os.path.dirname(__file__),
            'haarcascade_frontalface_default.xml'
        )
        face_cascade = cv2.CascadeClassifier(cascade_path)
        img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(img_gray, 1.1, 3, minSize=(30, 30))
        print(f"DEBUG: Faces detected: {len(faces)}")

        if len(faces) == 0:
            print("WARNING: No face detected, using full image")
            face_roi = img
        else:
            x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
            face_roi = img[y:y + h, x:x + w]

        img_resized = cv2.resize(face_roi, (IMG_SIZE, IMG_SIZE))
        img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)

        # ✅ CORRECT — matches training: preprocessing_function=preprocess_input
        img_array = img_rgb.astype(np.float32)
        img_preprocessed = preprocess_input(img_array)

        img_final = np.expand_dims(img_preprocessed, axis=0)
        print(f"DEBUG shape: {img_final.shape}, min: {img_final.min():.2f}, max: {img_final.max():.2f}")
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