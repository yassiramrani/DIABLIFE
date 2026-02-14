# How to Enable Email/Password Authentication

The error `auth/operation-not-allowed` means you haven't enabled the "Email/Password" sign-in method in your Firebase Console yet.

1.  **Go to Firebase Console**:
    *   Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
    *   Select your project (**DiaBLife** / `diablife-ee235`).

2.  **Navigate to Authentication**:
    *   In the left sidebar, click **Build** > **Authentication**.
    *   Click on the **Sign-in method** tab.

3.  **Enable Email/Password**:
    *   Click on **Email/Password** in the list of Sign-in providers.
    *   Toggle the **Enable** switch to **ON**.
    *   Click **Save**.

4.  **Retry**:
    *   Go back to your app ([http://localhost:5173/signup](http://localhost:5173/signup)) and try to Sign Up again. It should work now!
