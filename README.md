# Aria - ADA Compliance Auditor

## Project Structure
*   `backend/`: Python FastAPI application + Playwright + Gemini integration.
*   `frontend/`: React + TypeScript + Vite + TailwindCSS application.

## Prerequisites
*   **Python 3.10+** (Ensure `python` and `pip` are in your PATH).
*   **Node.js 18+** & **npm** (for the frontend).
*   **Google Gemini API Key**: Get one from [Google AI Studio](https://aistudio.google.com/).

## Installation Guide

### 1. Backend Setup
1.  Navigate to the project root in your terminal.
2.  Navigate to the backend directory: `cd backend`
3.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```
4.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Install Playwright browsers:
    ```bash
    playwright install
    ```
6.  Setup Environment Variables:
    *   Create a file named `.env` in the `backend/` directory.
    *   Add your API key:
        ```
        GEMINI_API_KEY=your_actual_api_key_here
        ```

### 2. Frontend Setup
1.  Open a new terminal window.
2.  Navigate to the frontend directory: `cd frontend`
3.  Install dependencies:
    ```bash
    npm install
    ```

## Running the Application

### Start the Backend
From the `backend/` directory:
```bash
python -m uvicorn main:app --reload --port 8000
```
*The backend API will run at http://localhost:8000*

### Start the Frontend
From the `frontend/` directory:
```bash
npm run dev
```

## Usage
1.  Open your browser to the local frontend URL (e.g., `http://localhost:5173`).
2.  Click **Start Compliance Audit**.
3.  Enter one or more URLs (e.g., `plantpico.com`).
4.  Enable "AI Analysis" for deeper visual checks.
5.  Wait for the audit to complete and download your PDF report.

