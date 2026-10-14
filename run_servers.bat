@echo off
title 12Axes Server Launcher
echo ========================================================
echo         12Axes Full Stack Development Server
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting Local Backend API (Port 8080)...
start "12Axes Backend API" /min cmd /c "python profile-audit\local_api_server.py"

echo [2/3] Waiting for Backend API...
timeout /t 2 /nobreak >nul

echo [3/3] Starting Frontend Dev Server (Port 5173)...
cd /d "%~dp0frontend"
start "12Axes Frontend" cmd /c "npm run dev"

echo.
echo ========================================================
echo Servers launched!
echo   - Backend API:    http://127.0.0.1:8080
echo   - Frontend Web:   http://localhost:5173
echo.
echo Opening browser...
echo ========================================================
timeout /t 3 /nobreak >nul
start http://localhost:5173
