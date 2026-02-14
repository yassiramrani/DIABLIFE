# DiaBLife AI Backend (FoodVision)

The **FoodVision** component is the intelligent core of DiaBLife. It exposes a high-performance API that leverages **Google's Gemini 1.5 Flash** model to analyze food images, estimate carbohydrate content, and provide personalized insulin dosing advice.

## 🏗️ Architecture

*   **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
*   **AI Engine**: Google Gemini 1.5 Flash (via `google-generativeai`)
*   **Authentication**: Firebase Admin SDK / Custom JWT verification
*   **Image Processing**: PIL (Python Imaging Library)

## 🚀 Setup & Run

### 1. Prerequisites
*   Python 3.10+
*   A Google Cloud Project with Gemini API enabled.
*   A Firebase project (for authentication).

### 2. Installation

Navigate to the `FoodVision` directory and set up your environment:

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configuration

Create a `.env` file in the `FoodVision` directory with your API keys:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
FIREBASE_WEB_API_KEY=your_firebase_api_key_here
```

### 4. Running the Server

Start the FastAPI server:

```bash
python main.py
```

The API will be available at `http://localhost:8000`.
You can access the interactive API docs at `http://localhost:8000/docs`.

## 🔌 API Endpoints

### `POST /analyze-meal/`
Uploads a meal image for AI analysis.

*   **Headers**: `Authorization: Bearer <FIREBASE_ID_TOKEN>`
*   **Body**: `multipart/form-data` with `file` (image).
*   **Response**: JSON containing:
    *   `meal_summary`: Description of the meal.
    *   `total_carbs_est`: Estimated total carbohydrates (g).
    *   `components`: List of identified food items with portions and carb counts.
    *   `diasense_advice`: Glycemic prediction and bolus strategy.

---
