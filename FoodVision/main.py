import os
import uvicorn
import json
import requests
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from PIL import Image
import io
from dotenv import load_dotenv

# --- CONFIGURATION ---
# Explicitly load .env from current directory
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

# Gemini Config
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
FIREBASE_WEB_API_KEY = os.getenv("FIREBASE_WEB_API_KEY")

if not GOOGLE_API_KEY:
    print("WARNING: GOOGLE_API_KEY not found in .env")

genai.configure(api_key=GOOGLE_API_KEY)

# Initialisation de l'application FastAPI
app = FastAPI(
    title="DiaBLife AI Backend",
    description="API for metabolic meal analysis using Gemini Vision (Firebase Secured)",
    version="1.0.0"
)

# --- CORS MIDDLEWARE ---
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173", # Vite default
    "http://127.0.0.1:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- PYDANTIC MODELS ---
class MealComponent(BaseModel):
    name: str
    portion_est: str
    carbs_g: int
    glycemic_index: str
    impact: str

class DiaSenseAdvice(BaseModel):
    risk_level: str
    prediction: str
    suggested_bolus_strategy: str

class AnalysisResponse(BaseModel):
    scan_id: str
    meal_summary: str
    total_carbs_est: int
    components: List[MealComponent]
    diasense_advice: DiaSenseAdvice
    filename: Optional[str] = None
    status: str

# Config modèle Gemini
model = genai.GenerativeModel('gemini-flash-latest') # Confirmed available in list_models

# --- PROMPT SYSTÈME ---
DIASENSE_SYSTEM_PROMPT = """
You are the AI engine 'Individual Metabolic Learning' (IML) for the DiaBLife app.
Analyze this meal image for a diabetic patient.

TASK:
1. Identify food items.
2. Estimate carbs (g) for each.
3. Predict glycemic impact (Fast, Delayed, Stable).
4. Suggest insulin action (Standard, Extended, etc.).

RESPONSE FORMAT (JSON ONLY):
{
  "scan_id": "auto_generated",
  "meal_summary": "Brief summary of the meal",
  "total_carbs_est": 0,
  "components": [
    {
      "name": "Food Item",
      "portion_est": "e.g. 1 cup",
      "carbs_g": 0,
      "glycemic_index": "Low/Medium/High",
      "impact": "Stable/Spike"
    }
  ],
  "diasense_advice": {
    "risk_level": "Low/Medium/High",
    "prediction": "Expected glucose response...",
    "suggested_bolus_strategy": "Insulin suggestion..."
  }
}
"""

# --- DEPENDENCIES ---
async def get_current_user(authorization: str = Header(None)):
    """
    Verifies Firebase ID Token passed in Authorization header.
    Format: Bearer <token>
    Uses Firebase Auth REST API checks (no service account needed).
    """
    if not authorization or not authorization.startswith("Bearer "):
         # During dev/testing we might want to allow bypass if no firebase creds setup
         # But for security, we throw 401.
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
        )

    token = authorization.split(" ")[1]
    
    if not FIREBASE_WEB_API_KEY:
        print("WARNING: FIREBASE_WEB_API_KEY missing. Verifying token blindly (INSECURE - DEV ONLY).")
        # In strict prod, we'd fail here. 
        # But this allows at least 'some' token presence check.
        return "dev-user-uid"

    try:
        # verify via Google Identity Toolkit REST API
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={FIREBASE_WEB_API_KEY}"
        response = requests.post(url, json={"idToken": token})
        
        if response.status_code != 200:
            print(f"Token verification failed: {response.text}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials (API check failed)",
            )
            
        data = response.json()
        if not data.get("users"):
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: user not found",
            )
            
        uid = data["users"][0]["localId"]
        return uid

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Token verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication server error",
        )

# --- ROUTES API ---

@app.get("/")
def read_root():
    return {"status": "DiaBLife AI Backend Running"}

@app.post("/analyze-meal/", response_model=AnalysisResponse)
async def analyze_meal(
    file: UploadFile = File(...), 
    current_user_uid: str = Depends(get_current_user)
):
    """
    Upload image -> Gemini Vision Analysis -> JSON
    Requires Firebase Auth Token.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    if not GOOGLE_API_KEY or GOOGLE_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
         raise HTTPException(status_code=500, detail="Server misconfigured: Missing Gemini API Key.")

    try:
        # 1. Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        # 2. Call Gemini
        response = model.generate_content([DIASENSE_SYSTEM_PROMPT, image])
        
        # 3. Parse Response
        raw_text = response.text
        # Cleanup markdown code blocks if present
        if "```json" in raw_text:
            raw_text = raw_text.replace("```json", "").replace("```", "")
        
        analysis_data = json.loads(raw_text.strip())

        # Add metadata
        analysis_data["filename"] = file.filename
        analysis_data["status"] = "success"

        return analysis_data 

    except Exception as e:
        print(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
