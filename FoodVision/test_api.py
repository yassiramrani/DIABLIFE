import time
import requests
import subprocess
import sys
import os

def test_api():
    # Start the server using venv python
    print("Starting server...")
    venv_python = os.path.join(os.getcwd(), "venv", "bin", "python")
    if not os.path.exists(venv_python):
        print(f"Error: venv python not found at {venv_python}")
        return

    process = subprocess.Popen(
        [venv_python, "-m", "uvicorn", "main:app", "--port", "8000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    try:
        # Wait for server to start
        time.sleep(5)
        
        url = "http://127.0.0.1:8000/analyze-meal/"
        image_path = "uploaded_image.jpg"
        
        if not os.path.exists(image_path):
            print(f"Error: {image_path} not found.")
            return

        print(f"Sending request to {url} with {image_path}...")
        with open(image_path, "rb") as f:
            files = {"file": ("test_image.jpg", f, "image/jpeg")}
            response = requests.post(url, files=files)
        
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Response JSON:")
            print(response.json())
            print("\nSUCCESS: API call was successful.")
        else:
            print("FAILURE: API call failed.")
            print(response.text)

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Kill the server
        print("Stopping server...")
        process.terminate()
        process.wait()

if __name__ == "__main__":
    test_api()
