# EmoSense Backend

This service powers EmoSense features such as emotion prediction, personalized responses, and user-level analytics.

## Overview

The backend includes:

- User registration and login
- Token-based authentication
- Emotion prediction endpoint
- Profile and preference management
- Emotion history, stats, and feedback endpoints

## Before You Start

If you are using bash on Windows, `python` may not be available by default.
For the smoothest setup, use Command Prompt or PowerShell with `py -3`.

## Setup (Windows)

1. Open Command Prompt or PowerShell.
2. Move into the backend folder:

```bash
cd C:\Users\USER\OneDrive\Documents\Desktop\Individual Project\Project\EmoSense\emosense-backend
```

3. Create a virtual environment:

```bash
py -3 -m venv venv
```

4. Activate the environment:

```bash
venv\Scripts\activate
```

5. Install dependencies:

```bash
pip install -r requirements.txt
```

6. Download the model:

```bash
py -3 download_model.py
```

7. Apply migrations:

```bash
py -3 manage.py makemigrations emotion
py -3 manage.py migrate
```

8. Start the server:

```bash
py -3 manage.py runserver
```

Backend runs at:

- http://127.0.0.1:8000

## If You Must Use bash on Windows

Try running with the Windows launcher path:

```bash
/c/Windows/py.exe -3 manage.py runserver
```

If that fails, switch to Command Prompt or PowerShell.

## API Routes

Base URL:

- http://127.0.0.1:8000/api/

Authentication:

- POST /api/register/
- POST /api/login/

Emotion:

- POST /api/predict/

User:

- GET /api/profile/
- PUT /api/profile/update/
- GET /api/stats/
- GET /api/history/
- POST /api/feedback/

## Quick API Test

Use a valid image path:

```bash
curl -X POST http://127.0.0.1:8000/api/predict/ -F "image=@C:/path/to/test.jpg"
```

If the file path is wrong, curl returns error 26.

## Troubleshooting

Python not found:

- Use `py -3` instead of `python`
- If needed, install Python and disable Python App Execution Aliases in Windows settings

Port already in use:

```bash
py -3 manage.py runserver 8001
```

Model missing:

```bash
py -3 download_model.py
```

Migration issues:

```bash
py -3 manage.py makemigrations emotion
py -3 manage.py migrate
```
