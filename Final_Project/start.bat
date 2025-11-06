@echo off
echo 🚀 Starting Student Performance Prediction System...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo 📦 Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install Python dependencies
pip install -r requirements.txt

echo 🖥️  Starting backend server...
start /b python app.py

REM Wait for backend to start
timeout /t 5 /nobreak >nul

echo 🎨 Setting up frontend...
cd ..\react

REM Install Node.js dependencies
npm install

echo 🌐 Starting frontend server...
start /b npm run dev

echo ✅ System is starting up!
echo 📊 Backend running on: http://localhost:5000
echo 🎨 Frontend running on: http://localhost:5173
echo.
echo Press any key to stop all servers
pause >nul

echo 🛑 Stopping servers...
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1