# How to Run DiaBLife

Since you have already installed the dependencies, follow these steps to start the application.

## 1. Start the Backend Server (for Alerts)

Open a new terminal window and run:

```bash
cd server
npm start
```

This will start the server on [http://localhost:3001](http://localhost:3001).

## 2. Start the Frontend Application (User Interface)

Open a **separate** terminal window and run:

```bash
cd "diabete project"
npm run dev
```

This will start the React app on [http://localhost:5173](http://localhost:5173).

## 3. Verify

- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Try to **Sign Up** or **Sign In** to test the new Firebase integration.

---

> **Note:** Ensure you have filled in your `VITE_FIREBASE_API_KEY` and other credentials in `diabete project/.env` before starting the frontend.
