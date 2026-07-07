# TOEIC Practice Website with AI

A full-stack TOEIC practice platform that helps learners improve their English skills through AI-powered feedback and automated answer evaluation.

## Features

- User authentication (JWT)
- TOEIC Listening & Reading practice tests
- AI-powered answer evaluation
- AI-generated feedback for learners
- Test history and score tracking
- Admin dashboard for managing questions and tests
- RESTful API built with FastAPI

## Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Pydantic

### Frontend
- React
- Axios

### AI
- OpenAI API

## Project Structure

```
backend/
frontend/
database/
uploads/
```

## Getting Started

### Clone repository

```bash
git clone https://github.com/hongquan23/exam_management.git
cd exam_management
```

### Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate
# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

## API

Some main APIs

- Authentication
- User Management
- TOEIC Test
- AI Evaluation
- Result History

## Future Improvements

- Contest Mode
- Leaderboard
- Recommendation System

