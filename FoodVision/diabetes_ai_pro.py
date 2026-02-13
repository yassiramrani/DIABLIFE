import streamlit as st
from ultralytics import YOLO
import torch
from torchvision import models, transforms
from PIL import Image
import pandas as pd

# -----------------------------
# Load Models
# -----------------------------
@st.cache_resource
def load_models():
    detector = YOLO("yolov8n.pt")

    classifier = models.resnet50(pretrained=True)
    classifier.eval()

    return detector, classifier

detector, classifier = load_models()

# -----------------------------
# Nutrition Database (USDA subset)
# -----------------------------
nutrition_db = {
    "rice": {"carbs": 28, "gi": 73},
    "bread": {"carbs": 49, "gi": 75},
    "apple": {"carbs": 14, "gi": 36},
    "banana": {"carbs": 27, "gi": 51},
    "pizza": {"carbs": 33, "gi": 80},
    "salad": {"carbs": 5, "gi": 15},
}

# -----------------------------
# Image Transform
# -----------------------------
transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor()
])

# -----------------------------
# Diabetes Risk Calculation
# -----------------------------
def glycemic_load(carbs, gi):
    return (carbs * gi) / 100

def risk_level(gl):
    if gl > 20:
        return "🔴 HIGH RISK"
    elif gl > 10:
        return "🟠 MODERATE"
    else:
        return "🟢 SAFE"

# -----------------------------
# Streamlit UI
# -----------------------------
st.title("🩺 AI Diabetes Food Analyzer (Production Model)")

uploaded = st.file_uploader("Upload Food Image", type=["jpg","png"])

if uploaded:
    image = Image.open(uploaded)

    st.image(image, caption="Input Image")

    # -------------------------
    # Step 1: Detect Food Objects
    # -------------------------
    results = detector(image)

    annotated = results[0].plot()
    st.image(annotated, caption="Detected Objects")

    st.subheader("📊 Diabetes Nutrition Analysis")

    detected_items = []

    for box in results[0].boxes:
        cls = int(box.cls[0])
        label = detector.names[cls]

        if label in nutrition_db:
            detected_items.append(label)

    if not detected_items:
        st.warning("No known food detected.")
    else:
        for food in detected_items:
            info = nutrition_db[food]

            carbs = info["carbs"]
            gi = info["gi"]
            gl = glycemic_load(carbs, gi)

            st.write(f"### 🍽️ {food}")
            st.write(f"Carbs: {carbs} g")
            st.write(f"Glycemic Index: {gi}")
            st.write(f"Glycemic Load: {gl:.1f}")
            st.write(f"Risk Level: {risk_level(gl)}")

