# How to Find Your Firebase Configuration Keys

Follow these steps to get the values for your `.env` file:

1.  **Go to the Firebase Console**:
    *   Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
    *   Log in with your Google account.

2.  **Select Your Project**:
    *   Click on your project (e.g., "DiaBLife").

3.  **Open Project Settings**:
    *   Click the **Gear icon** (⚙️) next to "Project Overview" in the left sidebar.
    *   Select **Project settings**.

4.  **Scroll to "Your apps"**:
    *   Scroll down to the bottom of the "General" tab until you see the **Your apps** card.
    *   If you haven't created a Web app yet, click the **Web icon** (`</>`) to register your app. Give it a name (e.g., "DiaBLife Web") and click **Register app**.

5.  **Get the Config**:
    *   You will see a code snippet under "SDK setup and configuration".
    *   Select the **Config** radio button (if available) or look for the `const firebaseConfig = { ... }` object in the code.

6.  **Copy the Values**:
    *   Copy the values from the `firebaseConfig` object and paste them into your `.env` file passed to the corresponding variables.

### Example Mapping

| Firebase Config Key | .env Variable |
| :--- | :--- |
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

**Example `.env` file:**
```env
VITE_FIREBASE_API_KEY=AIzaSyDx8...
VITE_FIREBASE_AUTH_DOMAIN=diablife-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=diablife-12345
VITE_FIREBASE_STORAGE_BUCKET=diablife-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```
