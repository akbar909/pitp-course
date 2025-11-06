@echo off
echo ===================================
echo Student Performance Backend Setup
echo ===================================
echo.

REM Navigate to backend directory
cd /d "%~dp0"

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

echo Python is installed!

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ===================================
echo Starting Flask Backend Server...
echo ===================================
echo.
echo Backend will run on: http://localhost:5000
echo.
echo Note: Make sure MongoDB is running on your system
echo If you don't have MongoDB, you can:
echo 1. Install MongoDB Community Server from https://mongodb.com
echo 2. Or use the local fallback mode (limited functionality)
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py

pause