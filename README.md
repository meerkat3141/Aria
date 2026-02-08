# Aria - ADA Compliance Auditor

## Project Structure
*   `backend/`: Python FastAPI application + Playwright + Gemini integration.
*   `frontend/`: React + TypeScript + Vite + TailwindCSS application.

## Prerequisites
*   **Python 3.10+** (`python` and `pip` need to be in your PATH).
*   **Node.js 18+** & **npm** (these are for frontend).
*   **Google Gemini API Key**: Get a key at [Google AI Studio](https://aistudio.google.com/).

## Installation Guide

### 1. Backend Setup
1.  Go to your project root in terminal
2.  Switch to backend directory in your terminal: `cd backend`
3.  We reccomend creating a virtual environment but this is optional:
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
    *   In your `backend/` directory create a`.env` file.
    *   Paste in your API Key:
        ```
        GEMINI_API_KEY=your_actual_api_key_here
        ```

### 2. Frontend Setup
1.  Open a new command prompt window (or other terminal).
2.  Switch to your frontend directory in terminal: `cd frontend`
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
*Backend runs at http://localhost:8000*

### Start the Frontend
From the `frontend/` directory:
```bash
npm run dev
```

## Usage
1.  Open the local frontend URL in your browser (e.g., `http://localhost:5173`).
2.  Click **Start Compliance Audit**.
3.  Paste your list of websites in the entry field (e.g., `plantpico.com`).
4.  Enable "AI Analysis" for deeper visual checks.
5.  Allow the audit to run and you will be able to download a PDF report of ADA compliance checks.

## Purpose
Approximately 95 - 97% of websites are not compliant with WCAG (Web Content Accesibility Guidelines) detailed in the American Disability Act (ADA). Since it is increasingly difficult to detect these violations and report them efficiently, websites continue to violate these regulations

This tool is designed to allow users to audit multiple websites for ADA compliance. Using an AI headless browser, the application efficiently and accurately audits multiple websites for ADA complaiance.The application generates a PDF report of ADA checks for each website which can be viewed in the dashboard. The application checks for missing alt text, poor color contrast, missing ARIA roles, and other common ADA violations. The PDF generation capability of this appliction allows for efficent claim submissions to ADA regulation agencies and helps alleviate the issue of inaccessible websites for disabled users