# How to Run DiaBLife

Currently, the project uses a Node.js backend (for Twilio features) and a React frontend. The Python backend mentioned in the main README is missing.

## Prerequisites
- Node.js (v18 or higher)
- npm (Node Package Manager)

## Steps to Run

### 1. Start the Backend (Server)
Open a terminal and run:
```bash
cd server
npm install
npm start
```
The server will start at `http://localhost:3001`

### 2. Start the Frontend (Client)
Open a *new* terminal and run:
```bash
cd "diabete project"
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`

### 3. Start the AI Backend (FoodVision)
Open a *new* terminal and run:
```bash
cd FoodVision
run.bat
```
*Note: Ensure you have added your Gemini API Key to `FoodVision/.env`.*

## Troubleshooting
- If you see errors about missing modules, ensure you ran `npm install` in frontend/backend directories.
- For Python backend, dependencies are installed globally. Use `run.bat` to start it easily.
