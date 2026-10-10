@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   SMART CAMPUS PLATFORM - WINDOWS PRODUCTION DEPLOYER
echo ========================================================
echo.

:: 1. Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js v18 or higher from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [INFO] Detected Node.js: %NODE_VERSION%

:: 2. Check for .env file
if not exist ".env" (
    echo [INFO] .env not found. Initializing from .env.example...
    copy .env.example .env >nul
)

:: 3. Install dependencies if node_modules is missing
if not exist "node_modules\" (
    echo [INFO] Installing required dependencies...
    call npm install --omit=dev
)

:: 4. Ensure data directories exist
if not exist "backend\data\" mkdir backend\data
if not exist "backend\data\backups\" mkdir backend\data\backups

echo.
echo ========================================================
echo   LAUNCHING SMART CAMPUS PRODUCTION SERVER...
echo   Open in browser: http://localhost:3042/
echo   Health check:    http://localhost:3042/api/health
echo   Stop server:     Press CTRL + C
echo ========================================================
echo.

set NODE_ENV=production
node backend\server.js

pause
