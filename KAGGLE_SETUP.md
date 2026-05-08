# Kaggle API Setup for EmoSense

## ✅ Step 1: Install Kaggle Package

```bash
pip install kaggle
```

## ✅ Step 2: Configure Kaggle Credentials

Your `kaggle.json` file contains your API credentials. Place it here:

**Windows:**
```
C:\Users\<YourUsername>\.kaggle\kaggle.json
```

**Linux/Mac:**
```
~/.kaggle/kaggle.json
```

Then set permissions:

**Windows (PowerShell):**
```powershell
$file = "C:\Users\<YourUsername>\.kaggle\kaggle.json"
icacls $file /inheritance:r /grant:r "$($env:USERNAME):(F)"
```

**Linux/Mac:**
```bash
chmod 600 ~/.kaggle/kaggle.json
```

## ✅ Step 3: Find Your Dataset

### Option 1: Check Your Kaggle Account
1. Go to: https://www.kaggle.com/settings/account
2. Look at "Datasets" section
3. Find your dataset name

### Option 2: List Available Datasets
```bash
# Search for emotion/facial expression datasets
kaggle datasets list -s emotion
kaggle datasets list -s "facial expression"
kaggle datasets list -s fer2013
```

## ✅ Step 4: Download Dataset

### Command Format:
```bash
kaggle datasets download -d <owner>/<dataset-name>
```

### Popular Emotion Detection Datasets:

**1. FER2013 (Facial Expression Recognition)**
```bash
kaggle datasets download -d msambare/fer2013
```

**2. Facial Expression Recognition Dataset**
```bash
kaggle datasets download -d ananthu017/emotion-recognition-fer
```

**3. Emotion Detection from Facial Images**
```bash
kaggle datasets download -d praveengovi/emotions
```

**4. Custom Emotion Dataset**
```bash
# Replace with your dataset
kaggle datasets download -d <your-username>/<your-dataset-name>
```

## 📁 File Structure After Download

```
C:\Projects\EmoSense\emosense-backend\
├── ml_model/
│   ├── emotion_model.h5
│   └── downloaded_dataset/  ← Dataset goes here
│       ├── train/
│       │   ├── angry/
│       │   ├── disgust/
│       │   ├── fear/
│       │   ├── happy/
│       │   ├── neutral/
│       │   ├── sad/
│       │   └── surprise/
│       └── test/
│           └── (same structure)
```

## 🔧 Usage Example

```python
import os
from pathlib import Path

# Dataset location
DATASET_PATH = Path("ml_model/downloaded_dataset")

# List all images
for emotion_folder in os.listdir(DATASET_PATH / "train"):
    folder_path = DATASET_PATH / "train" / emotion_folder
    images = os.listdir(folder_path)
    print(f"{emotion_folder}: {len(images)} images")
```

## 🚀 Full Setup Command (Automated)

```bash
# 1. Install Kaggle
pip install kaggle

# 2. Set up credentials (manual - copy kaggle.json to ~/.kaggle/)

# 3. Download dataset (example - FER2013)
cd C:\Projects\EmoSense\emosense-backend\ml_model
kaggle datasets download -d msambare/fer2013
unzip fer2013.zip
```

---

## ✅ Verification

Check if Kaggle API is working:

```bash
kaggle api status
```

You should see: `Successfully authenticated`

---

## 🐛 Troubleshooting

**Issue: "Permission denied" or "403 Forbidden"**
- Solution: Re-upload your kaggle.json in account settings
- URL: https://www.kaggle.com/settings/account

**Issue: "Kaggle not found"**
- Solution: Install it: `pip install kaggle`

**Issue: Dataset not found**
- Solution: Check spelling and use full owner/dataset-name format
- Command: `kaggle datasets list -s <dataset-name>`

**Issue: File permissions on Linux**
- Solution: `chmod 600 ~/.kaggle/kaggle.json`
