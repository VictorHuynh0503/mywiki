@echo off
title MyWiki - Frontend Dev Server

echo.
echo  ========================================
echo    MyWiki - Starting Frontend Dev Server
echo  ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js is not installed or not in PATH.
    echo  Please download and install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Navigate to blog-app folder (same directory as this .bat file)
cd /d "%~dp0blog-app"

if not exist "package.json" (
    echo  [ERROR] Could not find blog-app\package.json
    echo  Make sure this .bat file is placed next to the blog-app folder.
    echo.
    pause
    exit /b 1
)

:: Check if .env file exists
if not exist ".env" (
    echo  [WARN] No .env file found. Copying from .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo  [INFO] .env created. Please open blog-app\.env and add your Supabase anon key.
        echo.
    ) else (
        echo  [WARN] No .env.example found either. Please create blog-app\.env manually.
        echo.
    )
)

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo  [INFO] Installing dependencies, please wait...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo  [ERROR] npm install failed. Check your internet connection and try again.
        pause
        exit /b 1
    )
    echo.
)

echo  [INFO] Starting dev server...
echo  [INFO] Open http://localhost:5173 in your browser.
echo  [INFO] Press Ctrl+C to stop the server.
echo.

call npm run dev

pause