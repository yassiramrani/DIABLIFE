# How to Push DiaBLife to GitHub

Follow these steps to safely upload your project to GitHub.

## 1. Prepare the Project (Done!)
I have already created `.gitignore` files to ensure your **API Keys** and **Secrets** are NOT uploaded.
*   `FoodVision/.env` (Contains your Gemini Key) -> **IGNORED** (Safe)
*   `node_modules/` (Huge dependency folders) -> **IGNORED** (Safe)

## 2. Initialize Git (If not already done)
Open your terminal in the **root** folder (`DIABLIFE`) and run:

```bash
git init
```

## 3. Commit Your Files
Add all files to the staging area and commit them:

```bash
git add .
git commit -m "Initial commit: FoodVision backend and React frontend"
```

## 4. Create a Repository on GitHub
1.  Go to [GitHub.com](https://github.com/new).
2.  Create a new repository (e.g., `diablife-ai`).
3.  **Do NOT** initialize with README, license, or gitignore (we already have them).
4.  Click **Create repository**.

## 5. Link and Push
Copy the commands shown on GitHub under "…or push an existing repository from the command line". They will look like this:

```bash
git remote add origin https://github.com/yassiramrani/DIABLIFE.git
git branch -M main
git push -u origin main
```

## 6. Important Notes
*   **API Keys:** Your `.env` files are ignored. If you clone this repo on another machine, you must manually create the `.env` files and paste your keys again.
*   **Deployment:** If you deploy to Vercel/Netlify/Heroku, you must add your Environment Variables (like `GOOGLE_API_KEY`) in their project settings dashboard.

## Alternative: Push to a New Branch
If you want to work on a separate branch (feature branch) instead of `main`:

1.  **Create and switch to new branch:**
    ```bash
    git checkout -b feature/food-vision
    ```
2.  **Add and Commit changes:**
    ```bash
    git add .
    git commit -m "Added FoodVision backend and updated frontend"
    ```
3.  **Push the branch:**
    ```bash
    git push -u origin feature/food-vision
    ```
