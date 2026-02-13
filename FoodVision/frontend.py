import streamlit as st
import requests
import pandas as pd
from PIL import Image
import io
import time

# --- PAGE CONFIGURATION ---
st.set_page_config(
    page_title="DiaSense AI | Metabolic Intelligence",
    page_icon="🩸",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- LOAD CSS ---
def local_css(file_name):
    try:
        with open(file_name) as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)
    except FileNotFoundError:
        st.warning(f"Style file {file_name} not found. Please ensure it exists.")

local_css("style.css")

# --- UTILS ---
def get_risk_class(level):
    level = str(level).lower()
    if "high" in level:
        return "risk-high"
    elif "moderate" in level or "medium" in level:
        return "risk-moderate"
    else:
        return "risk-low"

# --- SIDEBAR ---
def render_sidebar():
    with st.sidebar:
        st.markdown("## 👤 Patient Profile")
        st.markdown("""
        <div style="background-color: #F9FAFB; padding: 16px; border-radius: 12px; border: 1px solid #E5E7EB; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color:#6B7280; font-size: 0.875rem;">ID</span>
                <span style="font-weight:600; color:#111827;">DS-8291-X</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color:#6B7280; font-size: 0.875rem;">Target</span>
                <span style="font-weight:600; color:#111827;">70-180 mg/dL</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color:#6B7280; font-size: 0.875rem;">Ratio</span>
                <span style="font-weight:600; color:#111827;">1:10 g</span>
            </div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("### ⚙️ Preferences")
        st.toggle("High Contrast", value=False)
        st.toggle("Voice Assistant", value=False)
        st.caption("v2.2.0 • Light Mode")

# --- MAIN APP ---
def main():
    render_sidebar()

    # Layout: Header
    st.markdown("<h1>DiaSense AI</h1>", unsafe_allow_html=True)
    st.markdown("<p style='font-size: 1.1rem; color: #6B7280; margin-bottom: 40px;'>Metabolic Intelligence & Bolus Calculator</p>", unsafe_allow_html=True)

    # Layout: Grid
    col1, col2 = st.columns([1, 1.3], gap="large")

    # --- LEFT COLUMN: INPUT ---
    with col1:
        st.markdown("### 📸 Capture Meal")
        
        # Tabs for Input
        tab1, tab2 = st.tabs(["📂 Upload File", "📷 Camera"])
        
        uploaded_file = None
        
        with tab1:
            file_upload = st.file_uploader("Upload meal image", type=["jpg", "jpeg", "png", "webp"], label_visibility="collapsed")
            if file_upload:
                uploaded_file = file_upload
        
        with tab2:
            camera_snap = st.camera_input("Take a photo")
            if camera_snap:
                uploaded_file = camera_snap

        # Image Preview
        if uploaded_file is not None:
            st.markdown("<br>", unsafe_allow_html=True) 
            image = Image.open(uploaded_file)
            st.image(image, caption="Analysis Target", use_container_width=True)
            
            st.markdown("<br>", unsafe_allow_html=True)
            analyze_btn = st.button("🔍 Analyze Metabolics", use_container_width=True, type="primary")

    # --- RIGHT COLUMN: ANALYSIS ---
    with col2:
        st.markdown("### 📊 Analysis Report")

        if uploaded_file and 'analyze_btn' in locals() and analyze_btn:
            with st.spinner('Thinking...'):
                try:
                    # Prepare File
                    uploaded_file.seek(0)
                    files = {"file": (uploaded_file.name, uploaded_file, "image/jpeg")}
                    
                    # API Call
                    response = requests.post("http://127.0.0.1:8000/analyze-meal/", files=files)
                    
                    if response.status_code == 200:
                        data = response.json()
                        advice = data.get('diasense_advice', {})
                        
                        # --- 1. SUMMARY CARD ---
                        st.markdown(f"""
                        <div class="summary-box">
                            <h3 style="margin:0; color: #1E3A8A; font-size: 1.25rem;">{data.get('meal_summary', 'Unknown Meal')}</h3>
                            <p style="margin:5px 0 0 0; color: #3B82F6; font-size: 0.9rem;">High Confidence Detection</p>
                        </div>
                        <br>
                        """, unsafe_allow_html=True)

                        # --- 2. KEY METRICS ---
                        # Using a custom HTML container for better control than st.metric
                        risk = advice.get('risk_level', 'Unknown')
                        risk_class = get_risk_class(risk)
                        
                        carbs = data.get('total_carbs_est', 0)
                        bolus = advice.get('suggested_bolus_strategy', 'N/A')

                        m1, m2 = st.columns(2)
                        
                        with m1:
                            st.markdown(f"""
                            <div class="custom-card" style="text-align: center;">
                                <div style="color: #6B7280; font-size: 0.85rem; font-weight: 600; text-transform: uppercase;">Total Carbs</div>
                                <div style="font-size: 2rem; font-weight: 700; color: #111827; margin: 8px 0;">{carbs}g</div>
                                <div style="font-size: 0.85rem; color: {'#EF4444' if carbs > 60 else '#10B981'};">
                                    {f'Over Limit (+{carbs-60}g)' if carbs > 60 else 'Within Limit'}
                                </div>
                            </div>
                            """, unsafe_allow_html=True)
                        
                        with m2:
                            st.markdown(f"""
                            <div class="custom-card" style="text-align: center;">
                                <div style="color: #6B7280; font-size: 0.85rem; font-weight: 600; text-transform: uppercase;">Risk Level</div>
                                <div style="margin-top: 12px;">
                                    <span class="risk-pill {risk_class}">{risk}</span>
                                </div>
                                <div style="font-size: 0.85rem; color: #6B7280; margin-top: 8px;">
                                    {bolus}
                                </div>
                            </div>
                            """, unsafe_allow_html=True)

                        # --- 3. DETAILED BREAKDOWN ---
                        st.markdown("#### 🥗 Nutrition Breakdown")
                        components = data.get('components', [])
                        if components:
                            df = pd.DataFrame(components)
                            df_display = df[['name', 'portion_est', 'carbs_g', 'glycemic_index']].rename(columns={
                                "name": "Item",
                                "portion_est": "Portion",
                                "carbs_g": "Carbs (g)",
                                "glycemic_index": "GI"
                            })
                            
                            st.dataframe(
                                df_display, 
                                use_container_width=True,
                                hide_index=True,
                                column_config={
                                    "Carbs (g)": st.column_config.ProgressColumn(
                                        "Carbs", 
                                        format="%d g", 
                                        min_value=0, 
                                        max_value=100,
                                    ),
                                    "GI": st.column_config.TextColumn("GI")
                                }
                            )

                        # --- 4. PREDICTION ---
                        st.markdown("#### ⚕️ Clinical Insight")
                        st.markdown(f"""
                        <div style="background-color: #F3F4F6; padding: 16px; border-radius: 12px; border-left: 4px solid #9CA3AF;">
                            <p style="margin:0; font-style: italic; color: #4B5563;">"{advice.get('prediction', 'No prediction available.')}"</p>
                        </div>
                        """, unsafe_allow_html=True)

                    else:
                        st.error(f"Server returned status {response.status_code}")
                        st.text(response.text)

                except requests.exceptions.ConnectionError:
                    st.error("❌ Could not connect to the neural engine.")
                    st.info("Tip: Ensure 'main.py' is running.")
                except Exception as e:
                    st.error(f"Analysis Failed: {e}")

        elif not uploaded_file:
            # Empty State
            st.markdown("""
            <div style="text-align: center; padding: 60px 20px; border: 2px dashed #E5E7EB; border-radius: 16px; background-color: #F9FAFB;">
                <h3 style="color: #9CA3AF; margin-bottom: 8px;">Waiting for Input</h3>
                <p style="color: #D1D5DB;">Upload a meal photo to begin analysis</p>
            </div>
            """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
