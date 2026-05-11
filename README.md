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

## Aria Assist Chrome Extension

Aria Assist is a companion Chrome Extension that acts as an immediate accessibility patch for non-compliant websites. It features a Text Magnifier (Loupe), Text-to-Speech, Contrast Filters, and Dyslexia Font rendering.

### Setup Instructions
1. Go to Google Chrome, then enter `chrome://extensions/` into the browser URL bar.
2. Switch on **Developer mode** using the toggle at the top-right of this page.
3. Click on **Load unpacked** located at the top-left of this page.
4. Browse to your project folder, select the `extension` sub-folder, then click "Select Folder".
5. The extension has now been installed! You can pin it to your toolbar for easy access by clicking on the puzzle piece icon 🧩 in Chrome.

> **Note:** If you add any new logos or change any code within the extension folder, you **must click** the circular **Refresh icon ↻** on the Aria Assist card on the `chrome://extensions/` page to force Chrome to load your changes.

### How To Use
1. Open the local frontend URL in your browser (for example: `http://localhost:5173`).
2. Click **Start Compliance Audit**.
3. Paste your list of websites into the entry field (for example: `plantpico.com`).
4. Enable **AI Analysis** if you want an additional level of visual checking.
5. When the audit runs its course, you will then have the option to download an ADA compliance report in the form of a PDF.

### Why It's Important
Approximately 95 - 97% of websites do not comply with the Web Content Accessibility Guidelines (WCAG) as outlined in the Americans with Disabilities Act (ADA), and it is becoming more difficult to identify and report these violations.

This tool is designed to allow users to audit multiple websites for ADA compliance. Using an AI headless browser, the application efficiently and accurately audits multiple websites. It generates a PDF report of ADA checks for each website, which can be viewed in the dashboard. The application checks for missing alt text, poor color contrast, missing ARIA roles, and other common ADA violations. The PDF generation capability of this application allows for efficient claim submissions to ADA regulation agencies, helping to alleviate the issue of inaccessible websites for disabled users.