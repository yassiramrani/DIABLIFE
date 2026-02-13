import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime, timedelta

# --- PAGE CONFIGURATION ---
st.set_page_config(
    page_title="DiaSense Dashboard",
    page_icon="🧬",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- STYLING ---
st.markdown("""
<style>
    /* Global Theme */
    .stApp {
        background-color: #0E1117;
        color: #FAFAFA;
    }
    
    /* Metrics Cards */
    .metric-card {
        background-color: #1E293B;
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .metric-label {
        font-size: 0.85rem;
        color: #94A3B8;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.05em;
    }
    .metric-value {
        font-size: 2rem;
        font-weight: 700;
        color: #F8FAFC;
        margin: 8px 0;
    }
    .metric-delta {
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 4px;
    }
    .delta-up { color: #10B981; }
    .delta-down { color: #EF4444; }
    
    /* Headers */
    h1, h2, h3 {
        color: #F8FAFC;
        font-family: 'Inter', sans-serif;
    }
    
    /* Custom Sidebar */
    [data-testid="stSidebar"] {
        background-color: #0F172A;
        border-right: 1px solid #1E293B;
    }
</style>
""", unsafe_allow_html=True)

# --- MOCK DATA GENERATION ---
def get_mock_data():
    dates = [datetime.now() - timedelta(days=i) for i in range(6, -1, -1)]
    dates_str = [d.strftime("%a") for d in dates]
    
    glucose_avg = [110, 115, 108, 125, 118, 112, 105]
    carbs_total = [180, 200, 150, 220, 190, 160, 140]
    insulin_units = [22, 25, 18, 28, 24, 20, 18]
    
    return pd.DataFrame({
        "Day": dates_str,
        "Glucose (mg/dL)": glucose_avg,
        "Carbs (g)": carbs_total,
        "Insulin (U)": insulin_units
    })

# --- COMPONENTS ---

def render_metric(label, value, delta, delta_type="neutral"):
    delta_color = "delta-up" if delta_type == "good" else "delta-down" if delta_type == "bad" else "gray"
    delta_arrow = "↑" if delta > 0 else "↓"
    
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">{label}</div>
        <div class="metric-value">{value}</div>
        <div class="metric-delta {delta_color}">
            {delta_arrow} {abs(delta)}% vs last week
        </div>
    </div>
    """, unsafe_allow_html=True)

def render_charts(df):
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("### 📈 Glucose Trends")
        fig_glucose = px.area(df, x="Day", y="Glucose (mg/dL)", 
                              line_shape="spline", 
                              color_discrete_sequence=["#3B82F6"])
        fig_glucose.update_layout(
            plot_bgcolor="rgba(0,0,0,0)",
            paper_bgcolor="rgba(0,0,0,0)",
            font=dict(color="#94A3B8"),
            margin=dict(l=0, r=0, t=10, b=0),
            height=300,
            yaxis=dict(gridcolor="#334155"),
            xaxis=dict(gridcolor="rgba(0,0,0,0)")
        )
        st.plotly_chart(fig_glucose, use_container_width=True)
        
    with col2:
        st.markdown("### 🍎 Carbs vs Insulin")
        fig_scatter = go.Figure()
        fig_scatter.add_trace(go.Bar(
            x=df["Day"], 
            y=df["Carbs (g)"],
            name="Carbs",
            marker_color="#10B981",
            opacity=0.8
        ))
        fig_scatter.update_layout(
            plot_bgcolor="rgba(0,0,0,0)",
            paper_bgcolor="rgba(0,0,0,0)",
            font=dict(color="#94A3B8"),
            margin=dict(l=0, r=0, t=10, b=0),
            height=300,
            barmode='group',
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
        )
        st.plotly_chart(fig_scatter, use_container_width=True)

# --- MAIN APP ---
def main():
    # URL param for "widget" mode
    query_params = st.query_params
    mode = query_params.get("mode", "full")
    
    if mode == "widget":
        # Simplified "Widget" View for embedding
        st.markdown("### ⚡ Quick Status")
        df = get_mock_data()
        latest = df.iloc[-1]
        
        c1, c2 = st.columns(2)
        with c1:
            st.metric("Avg Glucose", f"{latest['Glucose (mg/dL)']} mg/dL", "-7")
        with c2:
            st.metric("Carbs Today", f"{latest['Carbs (g)']} g", "-20")
            
        st.caption("Last updated: Just now")
        
    else:
        # Full Dashboard
        st.title("DiaSense | <span style='color:#3B82F6'>Metabolic Dashboard</span>", anchor=False)
        st.markdown("*Patient Overview: DS-8291-X*")
        st.markdown("---")
        
        # 1. Top Level Metrics
        m1, m2, m3, m4 = st.columns(4)
        with m1:
            render_metric("Time in Range", "82%", 5, "good")
        with m2:
            render_metric("Avg Glucose", "105 mg/dL", -12, "good")
        with m3:
            render_metric("Daily Carbs", "140g", -15, "good")
        with m4:
            render_metric("Insulin Sensitivity", "1:12", 0, "neutral")
            
        st.markdown("<br>", unsafe_allow_html=True)
        
        # 2. Charts
        df = get_mock_data()
        render_charts(df)
        
        # 3. Recent Meals Log (Mock)
        st.markdown("### 🥗 Recent Meals")
        meals_df = pd.DataFrame({
            "Time": ["12:30 PM", "08:15 AM", "Yesterday"],
            "Meal": ["Grilled Chicken Salad", "Oatmeal & Berries", "Salmon with Rice"],
            "Carbs": ["15g", "45g", "60g"],
            "Bolus": ["1.5 U", "4.0 U", "5.5 U"],
            "Impact": ["Stable", "Moderate Rise", "Delayed Peak"]
        })
        
        st.dataframe(
            meals_df, 
            use_container_width=True,
            hide_index=True,
            column_config={
                "Impact": st.column_config.TextColumn(
                    "Impact",
                    help="Predicted glycemic impact",
                    validate="^Stable|Moderate Rise|Delayed Peak$"
                )
            }
        )

        # --- REPORT GENERATION (Stream 3) ---
        st.markdown("### 📄 Clinical Reports")
        
        # Mock data for report generation
        latest_meal = {
            "meal_summary": "Grilled Chicken Salad with vinaigrette",
            "total_carbs_est": 15,
            "diasense_advice": {
                "risk_level": "Low",
                "suggested_bolus_strategy": "Standard Bolus",
                "prediction": "Stable glucose levels expected."
            },
            "components": [
                {"name": "Chicken Breast", "portion_est": "150g", "carbs_g": 0, "glycemic_index": "Low"},
                {"name": "Mixed Greens", "portion_est": "2 cups", "carbs_g": 5, "glycemic_index": "Low"},
                {"name": "Croutons", "portion_est": "1/4 cup", "carbs_g": 10, "glycemic_index": "Medium"}
            ]
        }
        
        col_rep1, col_rep2 = st.columns([1, 4])
        with col_rep1:
            # Import dynamically to avoid top-level failures if file missing
            try:
                from report_generator import generate_pdf
                pdf_bytes = generate_pdf(latest_meal)
                
                st.download_button(
                    label="📥 Download PDF Report",
                    data=pdf_bytes,
                    file_name=f"diasense_report_{datetime.now().strftime('%Y%m%d')}.pdf",
                    mime="application/pdf"
                )
            except ImportError:
                st.error("Report Generator module not found.")
            except Exception as e:
                st.error(f"Failed to generate report: {e}")

if __name__ == "__main__":
    main()
