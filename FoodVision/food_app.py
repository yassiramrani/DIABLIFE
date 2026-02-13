import streamlit as st
from ultralytics import YOLO
from PIL import Image
import numpy as np

# -------------------------
# Load YOLOv8 Model
# -------------------------
@st.cache_resource
def load_model():
    return YOLO("yolov8l.pt")   # Better accuracy model

model = load_model()

# -------------------------
# Streamlit UI
# -------------------------
st.set_page_config(page_title="Food Detection AI", layout="wide")

st.title("🍔 Food Detection using YOLOv8")
st.write("Upload an image to detect food items.")

uploaded_file = st.file_uploader(
    "Choose an image", type=["jpg", "jpeg", "png"]
)

if uploaded_file is not None:
    image = Image.open(uploaded_file)

    col1, col2 = st.columns(2)

    with col1:
        st.subheader("Original Image")
        st.image(image, use_column_width=True)

    # Convert image to numpy
    img_array = np.array(image)

    # Run detection
    results = model(img_array)

    # Plot detected image
    annotated_img = results[0].plot()

    with col2:
        st.subheader("Detected Objects")
        st.image(annotated_img, use_column_width=True)

    # Show detection details
    st.subheader("📊 Detection Results")

    for box in results[0].boxes:
        cls_id = int(box.cls[0])
        conf = float(box.conf[0])

        st.write(
            f"✅ **{model.names[cls_id]}** — Confidence: {conf:.2%}"
        )
