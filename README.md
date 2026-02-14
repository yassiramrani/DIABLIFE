# 🩸 DiaBLife: The AI-Powered Guardian for Diabetes Management

> **"Eat Smart. Live Safe. Let AI do the Math."**

## 💡 The Problem
Managing Type 1 and Type 2 diabetes is a 24/7 cognitive burden. Patients make 180+ health-related decisions every day.
*   **Carb Counting is Hard**: Studies show patients miscalculate carbs by 20-50%, leading to dangerous blood sugar swings.
*   **Insulin Math is Complex**: Calculating bolus doses while considering glycemic index and active insulin is prone to human error.
*   **Safety is a Constant Worry**: Hypos (low blood sugar) can be fatal if not treated immediately, especially during sleep.

## 🚀 The Solution: DiaBLife
**DiaBLife** is a comprehensive, full-stack intelligent health assistant that combines **Multimodal AI** with **Real-time Safety Systems** to offload the cognitive burden of diabetes management. It uses computer vision to "see" what you eat and automated logic to "protect" you when you're vulnerable.

## ✨ Key Features & "Wow" Factors

### 1. 📷 Visual Food Intelligence (Powered by Gemini 2.5 Flash)
Forget searching through databases.
*   **Snap & Analyze**: Users simply take a photo of their meal.
*   **Deep Understanding**: Our integration with **Google Gemini 2.5 Flash** doesn't just label food; it understands context, estimates portion sizes volumetrically, and identifies complex mixed meals (e.g., lasagna layers) better than standard object detection.
*   **Output**: Returns precise carbohydrate counts (g) instantly.

### 2. 🧠 Predictive Metabolic Insights
It's not just about carbs; it's about *impact*.
*   **Glycemic Prediction Engine**: Classifies meals by their expected glucose impact: **Rapid Spike**, **Delayed Rise** (for high fat/protein), or **Stable**.
*   **Risk Assessment**: Assigns a "Risk Level" (Low/Medium/High) to every meal before you take a bite.

### 3. 💉 Smart Bolus Advisor
Actionable advice, not just data.
*   **Strategy Recommendation**: Suggests specific insulin delivery patterns based on the food type (e.g., *"Square Wave Bolus suggested for this high-fat pizza"*).

### 4. 🛡️ Emergency Safety Net (IoT Integration)
A specialized **Node.js Safety Server** runs in parallel to the AI.
*   **Automated Rescue**: If logs indicate severe hypoglycemia (low sugar) without resolution, the system triggers a **Twilio Voice Call** to emergency contacts using text-to-speech to read out the patient's status and location.

### 5. 🔒 Privacy-First Architecture
*   **Secure Auth**: Built on **Firebase Authentication** with JWT protection.
*   **Data Sovereignty**: Health data is user-siloed, ensuring sensitive medical information remains private.

## 🛠️ Technical Implementation (The "Under the Hood")

DiaBLife uses a **Hybrid Microservices Architecture** to leverage the best tools for each job:

### **Frontend (The Experience)**
*   **Framework**: **React 19** + **Vite** for sub-second load times.
*   **UI/UX**: **Tailwind CSS** + **Lucide React** for a medical-grade, accessible, and responsive interface.
*   **Data Viz**: **Recharts** for visualizing glucose trends.

### **AI Backend (The Brain)**
*   **Core**: **Python** & **FastAPI** (Async/Await for high concurrency).
*   **Model**: **Google Gemini 2.5 Flash** (via `google-generativeai` SDK).
*   **Prompt Engineering**: Uses sophisticated "Chain-of-Thought" prompting to force the LLM to reason about ingredients before outputting nutritional data (JSON Schema enforcement).

### **Safety Logic Server (The Shield)**
*   **Runtime**: **Node.js**.
*   **Communications**: **Twilio API** for programmable voice and SMS.
*   **Reasoning**: Decoupled from the heavy AI processing to ensure lightweight, reliable alerting even if the AI service is busy.

## 📅 Impact & Future Roadmap
*   **Voice Cloning**: Integration with ElevenLabs to have the emergency call use the *patient's own voice* to alert family members, increasing recognition and response rates.
*   **Wearable Sync**: Direct Bluetooth connection to Dexcom/Freestyle Libre CGMs.
*   **AR Food Overlay**: Using mobile AR to overlay carb counts directly on the dinner plate.

## 🏁 Conclusion
DiaBLife isn't just a calorie counter; it's an **AI Safety System**. By merging the generative power of Gemini with the reliability of deterministic code, we give users the one thing they need most: **Peace of Mind.**

---

## 📚 Full Tutorial & Setup Guide

Follow these steps to get DiaBLife running on your local machine.

### Prerequisites
1.  **Node.js** (v18 or higher) & **npm**.
2.  **Python** (v3.10 or higher) & **pip** (`sudo apt install python3-pip`).
2.  **Python** (v3.10 or higher).
3.  A **Google Cloud API Key** with access to Gemini API.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yassiramrani/DIABLIFE.git
cd DIABLIFE
```

### 2️⃣ Backend Setup (`FoodVision`)

The backend handles the AI logic, database, and authentication.

1.  **Navigate to the backend directory:**
    ```bash
    cd FoodVision
    ```

2.  **Create a virtual environment (Recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use: venv\Scripts\activate
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables:**
    *   Open `main.py` in your code editor.
    *   Locate the line: `os.environ["GOOGLE_API_KEY"] = "YOUR_API_KEY"`.
    *   Replace `"YOUR_API_KEY"` with your actual Google Gemini API Key.
    *   *Note: In a production environment, use a `.env` file.*

5.  **Start the Backend Server:**
    ```bash
    python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```
    ✅ The server should now be running at `http://localhost:8000`. You can test it by visiting `http://localhost:8000/docs` to see the interactive API documentation.

### 3️⃣ Frontend Setup (`diabete project`)

The frontend provides the user interface for interacting with the application.

1.  **Open a new terminal window** (keep the backend running in the first one).

2.  **Navigate to the frontend directory:**
    ```bash
    cd "diabete project"
    ```

3.  **Install Node dependencies:**
    ```bash
    npm install
    ```

4.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    ✅ The application should now be accessible at `http://localhost:5173`.

### 4️⃣ App Server Setup (`server`)

The App Server handles notifications and alerts.

1.  **Open a new terminal window.**

2.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

3.  **Install Node dependencies:**
    ```bash
    npm install
    ```

4.  **Start the Server:**
    ```bash
    npm start
    ```
    ✅ The server should now be running at `http://localhost:3001`.

---

## 🎮 How to Use DiaBLife

1.  **Sign Up**: Open the app (`http://localhost:5173`) and click **"Sign Up"**. Create a new account.
2.  **Log In**: Use your new credentials to log in. You will be redirected to the secure **Dashboard**.
3.  **Log a Meal**: 
    *   Navigate to the **"Food Log"** page.
    *   Click or drag & drop a food image into the upload area.
    *   Click **"Analyze Impact"**.
4.  **View Results**: Wait for the AI to process the image. You will see detailed cards showing:
    *   **Meal Summary**: A description of the food.
    *   **Carb Estimation**: Grams of carbs per component.
    *   **Glycemic Prediction**: The expected blood sugar impact.
    *   **Insulin Advice**: A suggested bolus strategy.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
