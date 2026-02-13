import streamlit as st
import torch
from torchvision import models, transforms
from PIL import Image

# -----------------------
# Load Pretrained Food Classifier
# -----------------------
model = models.resnet50(pretrained=True)
model.eval()

# Food classes (subset with nutrition info)
food_db = {
    "apple": {"carbs": 14, "gi": 36},
    "banana": {"carbs": 27, "gi": 51},
    "bread": {"carbs": 49, "gi": 75},
    "rice": {"carbs": 28, "gi": 73},
    "pizza": {"carbs": 33, "gi": 80},
    "salad": {"carbs": 5, "gi": 15},
    "orange": {"carbs": 12, "gi": 43},
}

labels = list(food_db.keys())

# Image transform
transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor()
])

# -----------------------
# Diabetes Risk Function
# -----------------------
def diabetes_risk(carbs, gi):
    if gi > 70 or carbs > 40:
        return "🔴 HIGH RISK"
    elif gi > 50:
        return "🟠 MODERATE"
    else:
        return "🟢 SAFE"

# -----------------------
# Streamlit UI
# -----------------------
st.title("🩺 Diabetes Food Analyzer AI")

uploaded_file = st.file_uploader("Upload Food Image", type=["jpg","png"])

if uploaded_file:
    image = Image.open(uploaded_file)

    st.image(image, caption="Uploaded Image")

    # Fake prediction demo (replace with real Food-101 model later)
    import random
    predicted_food = random.choice(labels)

    info = food_db[predicted_food]
    risk = diabetes_risk(info["carbs"], info["gi"])

    st.subheader("🍽️ Food Analysis")

    st.write(f"**Food Detected:** {predicted_food}")
    st.write(f"**Carbohydrates:** {info['carbs']} g")
    st.write(f"**Glycemic Index:** {info['gi']}")
    st.write(f"**Diabetes Risk Level:** {risk}")
