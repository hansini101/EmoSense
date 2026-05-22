# EmoSense — AI Emotion Recognition and Mental Wellness

Clean, accurate project overview and quick start for local development.

## Quick start (3 steps)

1. Start MongoDB (if using local MongoDB):

```powershell
# Windows (Admin)
net start MongoDB

# Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community
```

2. Start backend (Django REST API):

```powershell
cd emosense-backend
# use python or py launcher depending on your system
py -3 -m venv venv
venv\Scripts\activate          # Windows PowerShell
pip install -r requirements.txt
py -3 manage.py migrate
py -3 manage.py runserver 0.0.0.0:8000
```

3. Start frontend (Next.js):

```bash
cd emosense-frontend
# either pnpm or npm works; pnpm is recommended if you use it
npm run dev
# or
pnpm dev
```

Open: http://localhost:3000

---

## What this project is
- Web application for facial emotion detection, mood tracking and personalized wellness recommendations.
- Frontend: Next.js + React + TypeScript
- Backend: Django + Django REST Framework
- Data: MongoDB (mongoengine available) for application data; Django's SQLite used for default auth in development
- ML: TensorFlow/Keras model (EfficientNetB0 preferred) with OpenCV-based face preprocessing

## Important configuration
- Backend settings: `emosense-backend/config/settings.py`
  - ML model path: `emotion/ml_model/emotion_model.keras`
  - Emotion labels (order used by the model): `['surprise','fear','disgust','happy','sad','angry','neutral']`
- Frontend env: `emosense-frontend/.env.development`
  - `NEXT_PUBLIC_API_BASE_URL` should point to `http://localhost:8000`
  - `PORT=3000` (dev server)

## ML model expectations
- Place your trained model at: `emosense-backend/emotion/ml_model/emotion_model.keras`
- Expected input for production model: `(1, 224, 224, 3)` — RGB images resized to 224×224 (EfficientNetB0 preprocessing).
- If you trained a model with a different input size or preprocessing, update `emosense-backend/emotion/utils.py` `preprocess_image()` accordingly.

## API endpoints (examples)
- `POST /api/register/` — register user
- `POST /api/login/` — obtain auth token
- `POST /api/predict/` — upload image for prediction (form-data: `image`, optional `notes`)
- `GET /api/profile/`, `PUT /api/profile/update/`, `GET /api/stats/`, `GET /api/history/`, `POST /api/feedback/`

See: `emosense-backend/emotion/views.py` for request/response shapes.

## Data & privacy notes
- The app stores prediction metadata in `EmotionPrediction` (emotion, confidence, time context, optional `image_hash`).
- Raw images are not persisted by default. If you require stricter behavior, ensure `get_image_hash()` is used and raw image saving is disabled.

## Troubleshooting (common)
- MongoDB: ensure service is running; check `MONGO_HOST`, `MONGO_PORT` in `emosense-backend/.env` or `config/settings.py`.
- Model missing: run `python emosense-backend/download_model.py` or place your `.keras` model in `emotion/ml_model/`.
- Port conflicts: backend runs on `8000`, frontend on `3000`. Change if necessary.
- Frontend dev server: Next.js will use the `PORT` environment variable. `npm run dev` reads `package.json` `dev` script.

## Development notes & known nuances
- Both MongoDB and Django's SQLite are present. The project connects to MongoDB via `mongoengine` for app-specific data but also keeps Django's default DB for auth. If you want a single DB, either migrate Django models to mongoengine or configure Django to use MongoDB-compatible backend.
- The training script (`train_emotion_model.py`) contains several model variants (v1–v4). Production loader and `download_model.py` expect an EfficientNetB0-style `.keras` file named `emotion_model.keras`.

## Quick verification
From repo root run:

```bash
python test_system.py
```

This runs a set of smoke checks for environment and configuration.

---

## Want me to update anything else?
I can:
- Lock the frontend dev script to explicitly use `-p 3000` in `package.json`.
- Add image-hash saving to the prediction flow so only hashes are stored.
- Convert Django models to `mongoengine` documents if you want full MongoDB storage.

Tell me which change you want next and I'll apply it.
