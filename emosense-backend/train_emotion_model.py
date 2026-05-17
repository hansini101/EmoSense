"""
Emotion Detection Model Training Script
Trains a CNN model on FER2013 dataset to achieve >80% accuracy

Usage:
    python train_emotion_model.py
"""

import os
import sys
import numpy as np
import argparse
from pathlib import Path
from datetime import datetime
import json

# TensorFlow imports
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import (
    EarlyStopping, ReduceLROnPlateau, ModelCheckpoint, TensorBoard
)
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2, ResNet50, EfficientNetB0
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input as mobilenet_v2_preprocess
from tensorflow.keras.applications.resnet50 import preprocess_input as resnet50_preprocess
from tensorflow.keras.applications.efficientnet import preprocess_input as efficientnet_preprocess

# Setup paths
BASE_DIR = Path(__file__).parent
MODEL_DIR = BASE_DIR / 'emotion' / 'ml_model'
DATA_DIR = BASE_DIR / 'datasets' / 'fer2013'
LOGS_DIR = BASE_DIR / 'logs'

# Create directories
MODEL_DIR.mkdir(parents=True, exist_ok=True)
LOGS_DIR.mkdir(parents=True, exist_ok=True)

# Configuration
IMG_SIZE = 96
BATCH_SIZE = 32
EPOCHS = 100
EMOTION_LABELS = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
NUM_CLASSES = len(EMOTION_LABELS)
VAL_SPLIT = 0.2

# Color codes for logging
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    END = '\033[0m'


def print_header(msg):
    print(f"\n{Colors.HEADER}{'='*60}")
    print(f"  {msg}")
    print(f"{'='*60}{Colors.END}\n")


def print_success(msg):
    print(f"{Colors.GREEN}✓ {msg}{Colors.END}")


def print_info(msg):
    print(f"{Colors.CYAN}ℹ {msg}{Colors.END}")


def print_warning(msg):
    print(f"{Colors.YELLOW}⚠ {msg}{Colors.END}")


def print_error(msg):
    print(f"{Colors.RED}✗ {msg}{Colors.END}")


def download_fer2013_dataset():
    """
    Download FER2013 dataset from Kaggle
    
    NOTE: You need kaggle.json configured or download manually
    """
    print_info("FER2013 dataset setup instructions:")
    print("  1. Download from: https://www.kaggle.com/datasets/msambare/fer2013")
    print("  2. Extract to: emosense-backend/datasets/fer2013/")
    print("  3. Directory structure should be:")
    print("     datasets/fer2013/train/")
    print("     datasets/fer2013/test/")
    print("     datasets/fer2013/validation/")
    
    if not DATA_DIR.exists():
        print_warning(f"Dataset not found at {DATA_DIR}")
        return False
    
    return True


def load_fer2013_data():
    """
    Load FER2013 dataset from directory structure
    Expected structure:
        datasets/fer2013/
        ├── train/
        │   ├── angry/
        │   ├── disgust/
        │   └── ...
        ├── test/
        └── validation/ (optional, auto-split from train if missing)
    """
    print_header("Loading FER2013 Dataset")
    
    if not DATA_DIR.exists():
        print_error(f"Dataset directory not found: {DATA_DIR}")
        print_info("Please ensure the dataset is extracted properly")
        return None, None, None, None, None, None
    
    train_dir = DATA_DIR / 'train'
    test_dir = DATA_DIR / 'test'
    val_dir = DATA_DIR / 'validation'
    
    if not all([train_dir.exists(), test_dir.exists()]):
        print_error("Dataset structure incomplete")
        return None, None, None, None, None, None
    
    print_info("Loading training data...")
    if val_dir.exists():
        train_datagen = ImageDataGenerator(
            rescale=1./255,
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            zoom_range=0.2,
            horizontal_flip=True,
            fill_mode='nearest'
        )
        val_datagen = ImageDataGenerator(rescale=1./255)

        train_data = train_datagen.flow_from_directory(
            train_dir,
            target_size=(IMG_SIZE, IMG_SIZE),
            batch_size=BATCH_SIZE,
            color_mode='grayscale',
            classes={label: i for i, label in enumerate(EMOTION_LABELS)},
            class_mode='categorical'
        )
        print_success(f"Training samples: {train_data.samples}")

        print_info("Loading validation data...")
        val_data = val_datagen.flow_from_directory(
            val_dir,
            target_size=(IMG_SIZE, IMG_SIZE),
            batch_size=BATCH_SIZE,
            color_mode='grayscale',
            classes={label: i for i, label in enumerate(EMOTION_LABELS)},
            class_mode='categorical'
        )
        print_success(f"Validation samples: {val_data.samples}")
    else:
        print_warning("Validation folder not found. Splitting train data with validation_split=0.2")
        split_train_datagen = ImageDataGenerator(
            rescale=1./255,
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            zoom_range=0.2,
            horizontal_flip=True,
            fill_mode='nearest',
            validation_split=VAL_SPLIT
        )
        split_val_datagen = ImageDataGenerator(
            rescale=1./255,
            validation_split=VAL_SPLIT
        )

        train_data = split_train_datagen.flow_from_directory(
            train_dir,
            target_size=(IMG_SIZE, IMG_SIZE),
            batch_size=BATCH_SIZE,
            color_mode='grayscale',
            classes={label: i for i, label in enumerate(EMOTION_LABELS)},
            class_mode='categorical',
            subset='training',
            seed=42
        )
        val_data = split_val_datagen.flow_from_directory(
            train_dir,
            target_size=(IMG_SIZE, IMG_SIZE),
            batch_size=BATCH_SIZE,
            color_mode='grayscale',
            classes={label: i for i, label in enumerate(EMOTION_LABELS)},
            class_mode='categorical',
            subset='validation',
            seed=42
        )
        print_success(f"Training samples: {train_data.samples}")
        print_success(f"Validation samples: {val_data.samples}")
    
    print_info("Loading test data...")
    test_datagen = ImageDataGenerator(rescale=1./255)
    test_data = test_datagen.flow_from_directory(
        test_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        color_mode='grayscale',
        classes={label: i for i, label in enumerate(EMOTION_LABELS)},
        class_mode='categorical',
        shuffle=False
    )
    print_success(f"Test samples: {test_data.samples}")
    
    return train_data, val_data, test_data, train_data.samples, val_data.samples, test_data.samples


def create_model_v1():
    """
    Simple CNN model - Fast training, baseline performance
    """
    print_info("Building Model V1 (Simple CNN)...")
    
    model = models.Sequential([
        layers.Input(shape=(IMG_SIZE, IMG_SIZE, 1)),
        
        # Block 1
        layers.Conv2D(64, 3, padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.Conv2D(64, 3, padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D(2),
        layers.Dropout(0.3),
        
        # Block 2
        layers.Conv2D(128, 3, padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.Conv2D(128, 3, padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D(2),
        layers.Dropout(0.3),
        
        # Block 3
        layers.Conv2D(256, 3, padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.Conv2D(256, 3, padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D(2),
        layers.Dropout(0.3),
        
        # Global pooling
        layers.GlobalAveragePooling2D(),
        
        # Dense layers
        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        
        layers.Dense(128, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        
        # Output
        layers.Dense(NUM_CLASSES, activation='softmax')
    ])
    
    return model


def create_model_v2():
    """
    Transfer learning with MobileNetV2 - Better performance
    """
    print_info("Building Model V2 (MobileNetV2 Transfer Learning)...")
    
    # Load pretrained MobileNetV2
    base_model = MobileNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze most layers, unfreeze top layers
    base_model.trainable = True
    for layer in base_model.layers[:-30]:
        layer.trainable = False
    
    model = models.Sequential([
        layers.Input(shape=(IMG_SIZE, IMG_SIZE, 1)),
        # Convert grayscale to RGB
        layers.Lambda(lambda x: tf.image.grayscale_to_rgb(x)),
        # Undo generator rescale and apply backbone-specific preprocessing.
        layers.Rescaling(255.0),
        layers.Lambda(mobilenet_v2_preprocess),
        
        # Transfer learning backbone
        base_model,
        
        # Custom top layers
        layers.GlobalAveragePooling2D(),
        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        
        layers.Dense(128, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.3),
        
        layers.Dense(NUM_CLASSES, activation='softmax')
    ])
    
    return model


def create_model_v3():
    """
    Transfer learning with ResNet50 - High performance
    """
    print_info("Building Model V3 (ResNet50 Transfer Learning)...")
    
    base_model = ResNet50(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Fine-tune top layers
    base_model.trainable = True
    for layer in base_model.layers[:-50]:
        layer.trainable = False
    
    model = models.Sequential([
        layers.Input(shape=(IMG_SIZE, IMG_SIZE, 1)),
        layers.Lambda(lambda x: tf.image.grayscale_to_rgb(x)),
        layers.Rescaling(255.0),
        layers.Lambda(resnet50_preprocess),
        
        base_model,
        
        layers.GlobalAveragePooling2D(),
        layers.Dense(512, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        
        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.3),
        
        layers.Dense(128, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.2),
        
        layers.Dense(NUM_CLASSES, activation='softmax')
    ])
    
    return model


def create_model_v4():
    """
    EfficientNetB0 - Optimal performance and efficiency
    """
    print_info("Building Model V4 (EfficientNetB0 Transfer Learning)...")
    
    base_model = EfficientNetB0(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights='imagenet'
    )
    
    base_model.trainable = True
    for layer in base_model.layers[:-40]:
        layer.trainable = False
    
    model = models.Sequential([
        layers.Input(shape=(IMG_SIZE, IMG_SIZE, 1)),
        layers.Lambda(lambda x: tf.image.grayscale_to_rgb(x)),
        layers.Rescaling(255.0),
        layers.Lambda(efficientnet_preprocess),
        
        base_model,
        
        layers.GlobalAveragePooling2D(),
        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        
        layers.Dense(128, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.3),
        
        layers.Dense(NUM_CLASSES, activation='softmax')
    ])
    
    return model


def compile_model(model, learning_rate=0.001):
    """Compile the model with optimal settings"""
    optimizer = Adam(learning_rate=learning_rate)
    model.compile(
        optimizer=optimizer,
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    return model


def train_model(model, train_data, val_data, train_samples, val_samples, model_name='emotion_model', epochs=EPOCHS):
    """Train the model with callbacks"""
    
    print_header(f"Training {model_name}")
    
    # Callbacks
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    checkpoint = ModelCheckpoint(
        str(MODEL_DIR / f'{model_name}_best_{timestamp}.keras'),
        monitor='val_accuracy',
        save_best_only=True,
        verbose=1
    )
    
    early_stop = EarlyStopping(
        monitor='val_accuracy',
        patience=15,
        verbose=1,
        restore_best_weights=True
    )
    
    reduce_lr = ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=5,
        min_lr=1e-7,
        verbose=1
    )
    
    tensorboard = TensorBoard(
        log_dir=str(LOGS_DIR / timestamp),
        histogram_freq=1
    )
    
    # Calculate steps
    train_steps = max(1, int(np.ceil(train_samples / BATCH_SIZE)))
    val_steps = max(1, int(np.ceil(val_samples / BATCH_SIZE)))
    
    # Train
    history = model.fit(
        train_data,
        steps_per_epoch=train_steps,
        validation_data=val_data,
        validation_steps=val_steps,
        epochs=epochs,
        callbacks=[checkpoint, early_stop, reduce_lr, tensorboard],
        verbose=1
    )
    
    return history, timestamp


def evaluate_model(model, test_data, test_samples):
    """Evaluate model on test set"""
    
    print_header("Evaluating Model on Test Set")
    
    test_steps = max(1, int(np.ceil(test_samples / BATCH_SIZE)))
    
    # Evaluate
    test_loss, test_accuracy = model.evaluate(
        test_data,
        steps=test_steps,
        verbose=1
    )
    
    print_success(f"Test Accuracy: {test_accuracy*100:.2f}%")
    print_success(f"Test Loss: {test_loss:.4f}")
    
    return test_accuracy, test_loss


def save_model(model, model_name='best_model_final'):
    """Save model in Keras format"""
    
    print_header("Saving Model")
    
    model_path = MODEL_DIR / f'{model_name}.keras'
    
    model.save(str(model_path))
    
    print_success(f"Model saved to: {model_path}")
    
    # Model info
    model_info = {
        'model_name': model_name,
        'timestamp': datetime.now().isoformat(),
        'input_shape': (IMG_SIZE, IMG_SIZE, 1),
        'output_classes': NUM_CLASSES,
        'emotion_labels': EMOTION_LABELS,
        'model_size_mb': model_path.stat().st_size / (1024*1024)
    }
    
    info_path = MODEL_DIR / f'{model_name}_info.json'
    with open(info_path, 'w') as f:
        json.dump(model_info, f, indent=2)
    
    print_success(f"Model info saved to: {info_path}")
    
    return model_path


def main():
    """Main training pipeline"""
    parser = argparse.ArgumentParser(description='Train FER2013 emotion model')
    parser.add_argument('--models', nargs='+', default=['v2'], choices=['v1', 'v2', 'v3', 'v4'])
    parser.add_argument('--epochs', type=int, default=EPOCHS)
    args = parser.parse_args()
    epochs = args.epochs
    
    print_header("🚀 Emotion Detection Model Training")
    print_info(f"Configuration:")
    print(f"  - Image Size: {IMG_SIZE}x{IMG_SIZE}")
    print(f"  - Batch Size: {BATCH_SIZE}")
    print(f"  - Epochs: {EPOCHS}")
    print(f"  - Classes: {NUM_CLASSES} ({', '.join(EMOTION_LABELS)})")
    print(f"  - Model Dir: {MODEL_DIR}")
    
    # Check dataset
    print_header("Dataset Check")
    if not download_fer2013_dataset():
        print_warning("Dataset not found. Download FER2013 manually and extract to: datasets/fer2013/")
        print_info("Training will be skipped until dataset is available")
        return False
    
    # Load data
    train_data, val_data, test_data, train_samples, val_samples, test_samples = load_fer2013_data()
    
    if train_data is None:
        print_error("Failed to load dataset")
        return False
    
    # Build and train models
    model_registry = {
        'v1': create_model_v1,
        'v2': create_model_v2,
        'v3': create_model_v3,
        'v4': create_model_v4,
    }
    models_to_train = [(name, model_registry[name]) for name in args.models]
    
    results = {}
    best_accuracy = 0
    best_model = None
    best_model_name = None
    
    for version, create_func in models_to_train:
        try:
            print_info(f"\n{'='*60}")
            print_info(f"Training Model {version.upper()}")
            print_info(f"{'='*60}")
            
            # Create model
            model = create_func()
            model = compile_model(model)
            
            # Display architecture
            print_info("Model Architecture:")
            model.summary()
            
            # Train
            history, timestamp = train_model(
                model,
                train_data,
                val_data,
                train_samples,
                val_samples,
                f'emotion_model_{version}',
                epochs=epochs,
            )
            
            # Evaluate
            test_acc, test_loss = evaluate_model(model, test_data, test_samples)
            
            results[version] = {
                'test_accuracy': float(test_acc),
                'test_loss': float(test_loss),
                'timestamp': timestamp
            }
            
            # Track best model
            if test_acc > best_accuracy:
                best_accuracy = test_acc
                best_model = model
                best_model_name = version
            
            print_success(f"Model {version} training complete!")
            print(f"  Test Accuracy: {test_acc*100:.2f}%")
            print(f"  Test Loss: {test_loss:.4f}")
            
        except Exception as e:
            print_error(f"Error training model {version}: {str(e)}")
            continue
    
    # Summary
    print_header("Training Summary")
    print_info("Results for all models:")
    for version, metrics in results.items():
        acc = metrics['test_accuracy'] * 100
        status = "✓ >80%" if acc > 80 else "✗ <80%"
        print(f"  {version.upper()}: {acc:.2f}% {status}")
    
    # Save best model
    if best_model is not None:
        print_header(f"Best Model: {best_model_name.upper()}")
        print_info(f"Test Accuracy: {best_accuracy*100:.2f}%")
        
        if best_accuracy > 0.80:
            print_success(f"✓ Model achieves >80% accuracy!")
        else:
            print_warning(f"⚠ Model accuracy ({best_accuracy*100:.2f}%) is below 80%")
            print_info("Consider:")
            print("  - Using a larger training dataset")
            print("  - Increasing training epochs")
            print("  - Fine-tuning hyperparameters")
            print("  - Using ensemble methods")
        
        save_model(best_model, 'best_model_final')
        
        # Save results
        results_path = LOGS_DIR / f"training_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(results_path, 'w') as f:
            json.dump({
                'best_model': best_model_name,
                'best_accuracy': float(best_accuracy),
                'all_results': results
            }, f, indent=2)
        
        print_success(f"Results saved to: {results_path}")
        
        return best_accuracy > 0.80
    
    return False


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
