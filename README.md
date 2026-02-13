# 🩸 DiaBLife: AI-Powered Diabetes Management System

**DiaBLife** is a comprehensive, full-stack application designed to empower individuals with diabetes through intelligent meal analysis and personalized health insights. By leveraging the power of **Google Gemini Vision Pro**, DiaBLife analyzes food images to provide instant nutritional breakdowns, glycemic impact predictions, and insulin dosing strategies.

---

## 🚀 Key Features

*   **📷 Instant Meal Analysis**: Simply upload a photo of your meal. Our AI identifies food components, estimates portion sizes, and calculates carbohydrate content.
*   **🧠 Intelligent Insights**: Get real-time predictions on how a meal will affect your blood glucose levels (Rapid Spike, Delayed Rise, Stable).
*   **💉 Bolus Strategy Advisor**: Receive actionable advice on insulin timing and dosing strategies (e.g., standard bolus, extended bolus) based on meal composition.
*   **🔒 Secure & Private**: Built with privacy in mind. Secure user authentication (JWT) ensures your health data remains private and accessible only to you.
*   **📊 Comprehensive Dashboard**: Track your glucose trends, log your meals, and monitor your health metrics in one intuitive interface.

---

## 🛠️ Tech Stack

This project is a modern full-stack application composed of two main parts:

### **Frontend (`diabete project`)**
*   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) for lightning-fast development.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a sleek, responsive, and modern UI.
*   **Icons**: [Lucide React](https://lucide.dev/) for beautiful, consistent iconography.
*   **Routing**: [React Router](https://reactrouter.com/) for seamless navigation.

### **Backend (`FoodVision`)**
*   **API Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python) for high-performance API endpoints.
*   **AI Model**: [Google Gemini 1.5 Flash](https://deepmind.google/technologies/gemini/) (via `google-generativeai`) for state-of-the-art image analysis.
*   **Database**: **SQLite** + [SQLAlchemy](https://www.sqlalchemy.org/) for robust and lightweight data storage.
*   **Authentication**: **JWT** (JSON Web Tokens) + **Bcrypt** for secure, stateless user sessions.

---

## 📚 Full Tutorial & Setup Guide

Follow these steps to get DiaBLife running on your local machine.

### Prerequisites
1.  **Node.js** (v18 or higher) & **npm**.
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
    python main.py
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
