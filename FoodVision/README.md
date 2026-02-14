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

## 🏛️ Legacy Prototype (YOLOv8)

*The following section describes the initial prototype of this project, which used a local YOLOv8 model. This has been superseded by the Gemini-based implementation but is kept here for reference.*

### Automated Food Detection Using YOLOv8

**FoodVision** (Legacy) is a deep learning-based food detection system that utilizes YOLOv8 to identify and classify various food items in images. The system is capable of detecting 55 different food classes.

#### Features
- Real-time food detection using YOLOv8
- Support for 55 different food classes
- Calorie estimation per 100g of detected food items
- Web interface using Streamlit (`Sapp.py`)
- Support for both image upload and camera capture

#### Usage (Legacy)
To run the legacy Streamlit app:
```bash
streamlit run Sapp.py
```

#### Supported Food Classes
The model can detect 55 different food items including:
- Green foods: asparagus, avocados, broccoli, cabbage, etc.
- White/Beige foods: banana, cauliflower, garlic, mushroom, etc.
- Purple/Red foods: beetroot, blackberry, cherry, eggplant, etc.
- Orange/Yellow foods: apricot, carrot, corn, mango, etc.

#### Team Members (Original Project)
- Brian Tham
- Hong Ziyang
- Javier Si Zhao Hong
- Timothy Zoe Delaya
