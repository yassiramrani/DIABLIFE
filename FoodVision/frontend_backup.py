import streamlit as st
import requests
import pandas as pd
from PIL import Image
import io

# --- CONFIGURATION DE LA PAGE ---
st.set_page_config(
    page_title="DiaSense AI Monitor",
    page_icon="🩸",
    layout="wide"  # Important pour l'affichage en parallèle
)

# --- CSS PERSONNALISÉ (Pour le look "Medical Tech") ---
st.markdown("""
    <style>
    .big-font { font-size:20px !important; font-weight: bold; }
    .risk-high { color: #ff4b4b; font-weight: bold; }
    .risk-low { color: #0df032; font-weight: bold; }
    </style>
""", unsafe_allow_html=True)

# --- TITRE ---
st.title("🩸 DiaSense AI - Analyse Métabolique")
st.markdown("---")

# --- LAYOUT EN COLONNES (PARALLÈLE) ---
col1, col2 = st.columns([1, 1])  # 50% gauche, 50% droite

# --- COLONNE GAUCHE : IMAGE ---
with col1:
    st.header("📸 Capture du Repas")
    uploaded_file = st.file_uploader("Prendre une photo ou uploader", type=["jpg", "jpeg", "png"])

    if uploaded_file is not None:
        # Afficher l'image
        image = Image.open(uploaded_file)
        st.image(image, caption="Image analysée par Vision IA", use_container_width=True)

# --- COLONNE DROITE : RÉSULTATS ---
with col2:
    st.header("📊 Analyse IML")

    if uploaded_file is not None:
        with st.spinner('Synchronisation avec le moteur Neural Gemini...'):
            try:
                # 1. Envoi de l'image à ton API FastAPI (backend)
                # Remet le curseur du fichier au début pour la lecture
                uploaded_file.seek(0)
                files = {"file": (uploaded_file.name, uploaded_file, uploaded_file.type)}
                
                # APPEL API (Localhost)
                response = requests.post("http://127.0.0.1:8000/analyze-meal/", files=files)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # --- AFFICHER LE RÉSUMÉ ---
                    st.success(f"Plat identifié : {data.get('meal_summary', 'Inconnu')}")
                    
                    # --- INDICATEURS CLÉS (METRICS) ---
                    m1, m2, m3 = st.columns(3)
                    m1.metric("Glucides Totaux", f"{data.get('total_carbs_est', 0)}g")
                    
                    risk = data.get('diasense_advice', {}).get('risk_level', 'Unknown')
                    m2.metric("Niveau de Risque", risk)
                    
                    bolus = data.get('diasense_advice', {}).get('suggested_bolus_strategy', '-')
                    m3.metric("Stratégie Bolus", bolus)

                    # --- TABLEAU DÉTAILLÉ (DATAFRAME) ---
                    st.subheader("Détail des Composants")
                    components = data.get('components', [])
                    
                    if components:
                        # Création d'un tableau Pandas propre
                        df = pd.DataFrame(components)
                        # Renommer les colonnes pour l'affichage
                        df = df.rename(columns={
                            "name": "Aliment",
                            "portion_est": "Portion",
                            "carbs_g": "Glucides (g)",
                            "glycemic_index": "Index Glycémique",
                            "impact": "Impact"
                        })
                        st.dataframe(df, use_container_width=True)
                    
                    # --- CONSEIL IA (EXPANDER) ---
                    with st.expander("Voir l'analyse métabolique complète", expanded=True):
                        st.info(data.get('diasense_advice', {}).get('prediction', 'Pas de prédiction disponible.'))

                else:
                    st.error(f"Erreur API: {response.status_code}")
                    st.write(response.text)

            except Exception as e:
                st.error(f"Erreur de connexion : {e}")
                st.warning("Assurez-vous que le fichier 'main.py' tourne sur le port 8000 !")

    else:
        st.info("En attente d'une image pour commencer l'analyse...")
