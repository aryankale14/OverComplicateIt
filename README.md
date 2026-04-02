# OverComplicateIt

A full-stack web application that transforms your mundane life updates into buzzword-heavy, highly-engaging (and incredibly cringey) LinkedIn posts. 

## Features
- **Zero-Shot AI Prompting**: Finely-tuned system instructions to turn any boring event ("I ate toast") into a disruptive startup manifesto.
- **Customizable Personas**: Choose between Hustle Guru, Startup Founder, Ex-FAANG Tech Lead, and more.
- **Cringe & Length Sliders**: Dial in the exact level of unhinged corporate terminology and post length.
- **Analytics Dashboard**: Tracks generation history via a secure, password-protected SQLite backend.
- **Premium Dark Mode UI**: Built with React and Vanilla CSS, featuring gorgeous glassmorphism, animated background orbs, and micro-interactions.

## Tech Stack
- **Frontend**: React (Vite), TypeScript, Vanilla CSS, Lucide Icons.
- **Backend**: FastAPI (Python), SQLite, Google Gemini API.

## Requirements
- Python 3.9+
- Node.js 18+
- A Google Gemini API Key

## Setup & Running Locally

### 1. Backend Setup
Navigate to the backend folder, set up your virtual environment, and run the FastAPI server:
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
```

You must set your Gemini API key in your environment variables. 
Optionally, you can create a `.env` file in the `backend/` directory or export it directly:
```bash
export GOOGLE_API_KEY="your_api_key_here" # Mac/Linux
set GOOGLE_API_KEY="your_api_key_here"    # Windows
```

Run the server:
```bash
python main.py
```
*The backend will run on `http://localhost:8000`.*

### 2. Frontend Setup
In a new terminal window, navigate to the frontend folder, install dependencies, and run the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`.*

## Architecture Notes
To prevent CORS issues without hardcoding the absolute backend URL inside the React components, Vite `proxy` is configured in `vite.config.ts`. All frontend calls to `/api/...` are automatically proxied to the FastAPI server running on `localhost:8000`.

## Disclaimer
*This project is a parody tool. Please do not use it for actual career advice. Or do, and see what happens.*
