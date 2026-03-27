@echo off
title Full-Stack Application
color 0A

echo Starting Full-Stack Application...
echo.

echo [1/2] Starting Spring Boot Backend...
start "Backend" cmd /k "cd backend && mvn spring-boot:run"

timeout /t 10 /nobreak > nul

echo [2/2] Starting React Frontend...
start "Frontend" cmd /k "cd frontend && npm start"

timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo ✅ Application Started Successfully!
echo ========================================
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8080
echo ========================================
echo.
echo Press any key to open browser...
pause > nul

start http://localhost:5173