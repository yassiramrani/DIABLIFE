import os
import uvicorn
import json
from typing import List, Optional
from datetime import datetime, timedelta
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import google.generativeai as genai
from PIL import Image
import io

# Database & Auth Imports
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from jose import JWTError, jwt

# --- CONFIGURATION ---
# Remplacez ceci par votre clé API Gemini réelle
os.environ["GOOGLE_API_KEY"] = "AIzaSyBHJvbUtmFOFcxOSoIBKiyIaIMjU0A9g8M"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

# JWT Configuration
SECRET_KEY = "your-secret-key-keep-it-secret" # Change this in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Database Configuration
SQLALCHEMY_DATABASE_URL = "sqlite:///./users.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- DATABASE MODELS ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

Base.metadata.create_all(bind=engine)

# --- AUTH UTILS ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- DEPENDENCIES ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.email == username).first()
    if user is None:
        raise credentials_exception
    return user

# Initialisation de l'application FastAPI
app = FastAPI(
    title="DiaBLife AI Backend",
    description="API pour l'analyse métabolique des repas via Gemini Vision (Secured)",
    version="1.0.0"
)

# --- CORS MIDDLEWARE (Added for React Integration) ---
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
    "http://localhost:5173",
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

class UserCreate(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: str
    class Config:
        orm_mode = True

# Configuration du modèle Gemini
model = genai.GenerativeModel('gemini-2.5-flash')

# --- PROMPT SYSTÈME ---
DIASENSE_SYSTEM_PROMPT = """
Tu es le moteur d'intelligence artificielle 'Individual Metabolic Learning' (IML) de l'application DiaSense.
Ton rôle est d'analyser cette image de repas pour un patient diabétique.

TACHE :
1. Identifie les aliments présents (Step 1: Capture Visuelle).
2. Estime les glucides (carbs) en grammes pour chaque composant.
3. Préis l'impact glycémique (Pic rapide, retardé, ou stable).
4. Suggère une action d'insuline (ex: Bolus standard, Duo-square, ou attente).

FORMAT DE RÉPONSE :
Retourne UNIQUEMENT un objet JSON valide. Ne mets pas de balises markdown (```json).
Structure requise :
{
  "scan_id": "auto_generated",
  "meal_summary": "string",
  "total_carbs_est": int,
  "components": [
    {
      "name": "string",
      "portion_est": "string",
      "carbs_g": int,
      "glycemic_index": "Low/Medium/High",
      "impact": "string"
    }
  ],
  "diasense_advice": {
    "risk_level": "Low/Medium/High",
    "prediction": "string",
    "suggested_bolus_strategy": "string"
  }
}
"""

# --- ROUTES API ---

@app.get("/")
def read_root():
    return {"status": "DiaSense AI Server is running"}

# Auth Routes
@app.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# Protected Analysis Route
@app.post("/analyze-meal/", response_model=AnalysisResponse)
async def analyze_meal(
    file: UploadFile = File(...), 
    current_user: User = Depends(get_current_user) # Now requires authentication!
):
    """
    Endpoint principal : Upload d'image -> Analyse Gemini -> JSON
    """
    # 1. Vérification du type de fichier
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Le fichier doit être une image.")

    try:
        # 2. Lecture de l'image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        # 3. Envoi à Gemini
        response = model.generate_content([DIASENSE_SYSTEM_PROMPT, image])
        
        # 4. Nettoyage de la réponse
        raw_text = response.text
        if "```json" in raw_text:
            raw_text = raw_text.replace("```json", "").replace("```", "")
        
        # Parsing JSON
        analysis_data = json.loads(raw_text.strip())

        # Ajout de métadonnées DiaSense
        analysis_data["filename"] = file.filename
        analysis_data["status"] = "success"

        return analysis_data 

    except Exception as e:
        print(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
