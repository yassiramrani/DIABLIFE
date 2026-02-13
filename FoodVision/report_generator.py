from fpdf import FPDF
from datetime import datetime

class DiaSenseReport(FPDF):
    def header(self):
        # Logo or Title
        self.set_font('Helvetica', 'B', 16)
        self.set_text_color(30, 58, 138)  # Dark Blue
        self.cell(0, 10, 'DiaSense AI | Metabolic Report', border=False, new_x="LMARGIN", new_y="NEXT", align='L')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')

    def chapter_title(self, title):
        self.set_font('Helvetica', 'B', 12)
        self.set_fill_color(240, 248, 255) # Light Blue
        self.set_text_color(0, 0, 0)
        self.cell(0, 10, title, fill=True, new_x="LMARGIN", new_y="NEXT", align='L')
        self.ln(4)

    def chapter_body(self, body):
        self.set_font('Helvetica', '', 10)
        self.multi_cell(0, 5, body)
        self.ln()

def generate_pdf(data, filename="report.pdf"):
    pdf = DiaSenseReport()
    pdf.add_page()
    
    # 1. Patient Info
    pdf.set_font('Helvetica', '', 10)
    pdf.cell(0, 5, f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "Patient ID: DS-8291-X", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(10)
    
    # 2. Meal Summary
    pdf.chapter_title("Meal Analysis Summary")
    pdf.chapter_body(data.get('meal_summary', 'No summary provided.'))
    
    # 3. Metrics
    pdf.chapter_title("Key Metabolic Metrics")
    carbs = data.get('total_carbs_est', 'N/A')
    advice = data.get('diasense_advice', {})
    risk = advice.get('risk_level', 'N/A')
    bolus = advice.get('suggested_bolus_strategy', 'N/A')
    
    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(40, 7, "Total Carbs:", border=1)
    pdf.set_font('Helvetica', '', 10)
    pdf.cell(0, 7, f"{carbs} g", border=1, new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(40, 7, "Risk Level:", border=1)
    pdf.set_font('Helvetica', '', 10)
    pdf.cell(0, 7, f"{risk}", border=1, new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(40, 7, "Strategy:", border=1)
    pdf.set_font('Helvetica', '', 10)
    pdf.cell(0, 7, f"{bolus}", border=1, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)
    
    # 4. Components Table
    pdf.chapter_title("Food Components Breakdown")
    components = data.get('components', [])
    
    if components:
        # Table Header
        pdf.set_font('Helvetica', 'B', 9)
        pdf.cell(60, 7, "Item", border=1)
        pdf.cell(40, 7, "Portion", border=1)
        pdf.cell(20, 7, "Carbs", border=1)
        pdf.cell(30, 7, "Glycemic Index", border=1, new_x="LMARGIN", new_y="NEXT")
        
        # Table Rows
        pdf.set_font('Helvetica', '', 9)
        for c in components:
            name = c.get('name', '')[:25] # Truncate for simplicity
            portion = c.get('portion_est', '')[:20]
            carbs_g = str(c.get('carbs_g', ''))
            gi = c.get('glycemic_index', '')
            
            pdf.cell(60, 7, name, border=1)
            pdf.cell(40, 7, portion, border=1)
            pdf.cell(20, 7, carbs_g, border=1)
            pdf.cell(30, 7, gi, border=1, new_x="LMARGIN", new_y="NEXT")
    else:
        pdf.chapter_body("No detailed components detected.")
        
    pdf.ln(5)
    
    # 5. Clinical Prediction
    pdf.chapter_title("Clinical Prediction")
    pdf.chapter_body(advice.get('prediction', 'No prediction available.'))
    
    return pdf.output(dest='S').encode('latin-1') # Return bytes for Streamlit download

# Test block
if __name__ == "__main__":
    mock_data = {
        "meal_summary": "Test Meal",
        "total_carbs_est": 50,
        "diasense_advice": {
            "risk_level": "Medium",
            "suggested_bolus_strategy": "Extended",
            "prediction": "Moderate rise expected."
        },
        "components": [
            {"name": "Rice", "portion_est": "1 cup", "carbs_g": 45, "glycemic_index": "High"},
            {"name": "Vegetables", "portion_est": "1/2 cup", "carbs_g": 5, "glycemic_index": "Low"}
        ]
    }
    pdf_bytes = generate_pdf(mock_data)
    with open("test_report.pdf", "wb") as f:
        f.write(pdf_bytes)
    print("Test report generated: test_report.pdf")
