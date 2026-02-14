# DiabLife - AI-Powered Diabetes Management

DiabLife is a comprehensive web application designed to help individuals with diabetes manage their condition through intelligent meal analysis and glucose tracking.

## Core Features

### 🍎 Food Vision AI
- **Instant Analysis**: Upload meal photos to get real-time nutritional breakdown.
- **Carb Estimation**: AI-powered estimation of carbohydrate content in grams.
- **Glycemic Impact**: Predicts glucose spikes (Rapid, Delayed, Stable).
- **Bolus Strategy**: Suggests insulin dosing strategies based on meal composition.
- **Privacy First**: Secure, authenticated analysis.

### 🔐 Secure Authentication
- **User Accounts**: Sign up and log in securely to access personalized features.
- **Data Privacy**: Your food logs and health data are private to your account.
- **JWT Protection**: All sensitive API endpoints are protected with JSON Web Tokens.

### 📊 Dashboard & Tracking
- **Overview**: At-a-glance view of your recent activity and health metrics.
- **Food Log**: History of analyzed meals with detailed nutritional insights.
- **Insights**: (Coming Soon) Long-term trends and personalized recommendations.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Python, FastAPI, SQLite, SQLAlchemy.
- **AI Model**: Google Gemini Vision Pro (via API).
- **Authentication**: JWT (JSON Web Tokens), Passlib (Bcrypt).

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Google Gemini API Key

### Backend Setup (FoodVision)

1.  Navigate to the backend directory:
    ```bash
    cd FoodVision
    ```

2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Configure API Key:
    - Open `main.py` and replace `your-api-key` with your actual Google Gemini API Key.

5.  Run the server:
    ```bash
    python main.py
    ```
    The server will start at `http://localhost:8000`.

### Frontend Setup (diabete project)

1.  Navigate to the frontend directory:
    ```bash
    cd "diabete project"
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

### App Server Setup (server)

For notifications and alerts, you also need to run the Node.js server.

1.  Navigate to the `server` directory (in the project root):
    ```bash
    cd ../server
    ```

2.  Install dependencies and start:
    ```bash
    npm install
    npm start
    ```
    The server will run at `http://localhost:3001`.

## Usage Guide

1.  **Sign Up**: Create a new account with your email and password.
2.  **Login**: Access your dashboard using your credentials.
3.  **Log Food**: Go to "Food Log", upload a meal photo, and click "Analyze Impact".
4.  **Review**: View the detailed breakdown of carbs, risk level, and suggested actions.

## License

MIT License.
