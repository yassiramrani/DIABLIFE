@echo off
echo Starting FoodVision Backend...
"C:\Users\salah\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\LocalCache\local-packages\Python313\Scripts\uvicorn.exe" main:app --reload --port 8000
pause
