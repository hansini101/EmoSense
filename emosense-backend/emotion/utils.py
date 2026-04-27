"""
Image preprocessing utilities for emotion detection
"""
import cv2
import numpy as np
from io import BytesIO
from PIL import Image

# ========================
# IMAGE VALIDATION CONSTANTS
# ========================
MAX_IMAGE_SIZE_MB = 5
MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
ALLOWED_FORMATS = {'JPEG', 'PNG', 'WEBP', 'GIF'}


# ========================
# IMAGE VALIDATION FUNCTION
# ========================
def is_valid_image_content(file):
    """
    Validate image file by checking actual content, not filename.
    
    This is the most reliable version that:
    1. Seeks to beginning BEFORE opening (critical)
    2. Opens image with PIL
    3. Converts to RGB to force full decoding
    4. Seeks to beginning AGAIN for downstream use
    
    ⚠️ CRITICAL: Double seek() ensures file pointer is correct and
    prevents file consumption by Django or other middleware.
    
    Args:
        file: Django UploadedFile object
    
    Returns:
        bool: True if file is a valid image, False otherwise
    """
    try:
        # 🔥 CRITICAL: Seek to beginning BEFORE opening
        file.seek(0)
        
        # Open file as image
        img = Image.open(file)
        
        # Force full decoding by converting to RGB
        img = img.convert("RGB")
        
        # 🔥 CRITICAL: Reset pointer again for downstream processing
        file.seek(0)
        
        return True
        
    except Exception as e:
        print(f"IMAGE ERROR: {e}")
        return False


def preprocess_image(image_file):
    """
    Preprocess image for emotion detection model with face detection
    
    Args:
        image_file: Django UploadedFile object
    
    Returns:
        numpy array of shape (1, 48, 48, 1) ready for model input
    """
    try:
        # Ensure we read from the beginning of uploaded file.
        image_file.seek(0)

        # Read image from file
        image_data = image_file.read()
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Failed to decode image")
        
        # Convert to grayscale
        img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Load local Haar Cascade classifier for face detection
        import os
        cascade_path = os.path.join(
            os.path.dirname(__file__),
            'haarcascade_frontalface_default.xml'
        )
        face_cascade = cv2.CascadeClassifier(cascade_path)
        
        # Detect faces with parameters optimized for emotion recognition
        faces = face_cascade.detectMultiScale(img_gray, 1.3, 5)

        if len(faces) == 0:
            # Fallback: Use full image if no face detected
            print("WARNING: No face detected, using full image")
            face_roi = img_gray
        else:
            # Use the largest detected face when multiple faces are present
            x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
            face_roi = img_gray[y:y + h, x:x + w]
        
        # Resize to model input size (48x48)
        img_resized = cv2.resize(face_roi, (48, 48))
        
        # Normalize to [0, 1]
        img_normalized = img_resized.astype('float32') / 255.0
        
        # Reshape for model input: (batch_size, height, width, channels)
        img_final = np.reshape(img_normalized, (1, 48, 48, 1))
        
        return img_final
        
    except Exception as e:
        raise ValueError(f"Image preprocessing failed: {str(e)}")


def extract_faces(image_file):
    """
    Extract faces from image using Haar Cascade
    
    Args:
        image_file: Django UploadedFile object
    
    Returns:
        list of preprocessed face images
    """
    try:
        # Read image
        image_data = image_file.read()
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Failed to decode image")
        
        # Load local Haar Cascade classifier
        import os
        cascade_path = os.path.join(
            os.path.dirname(__file__),
            'haarcascade_frontalface_default.xml'
        )
        face_cascade = cv2.CascadeClassifier(cascade_path)
        
        # Convert to grayscale
        img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = face_cascade.detectMultiScale(
            img_gray, 
            scaleFactor=1.1, 
            minNeighbors=5, 
            minSize=(30, 30)
        )
        
        if len(faces) == 0:
            raise ValueError("No faces detected in image")
        
        # Extract and preprocess each face
        processed_faces = []
        for (x, y, w, h) in faces:
            face_roi = img_gray[y:y+h, x:x+w]
            face_resized = cv2.resize(face_roi, (48, 48))
            face_normalized = face_resized.astype('float32') / 255.0
            face_reshaped = np.reshape(face_normalized, (1, 48, 48, 1))
            processed_faces.append(face_reshaped)
        
        return processed_faces
        
    except Exception as e:
        raise ValueError(f"Face extraction failed: {str(e)}")


def get_image_hash(image_file):
    """Get SHA256 hash of image for deduplication"""
    import hashlib
    image_file.seek(0)
    image_hash = hashlib.sha256(image_file.read()).hexdigest()
    image_file.seek(0)
    return image_hash
