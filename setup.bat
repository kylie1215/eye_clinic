@echo off
echo ========================================
echo Eye Clinic Management System Setup
echo ========================================
echo.

REM Check if PHP is installed
where php >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PHP is not installed or not in PATH
    echo Please install PHP 8.2 or higher
    pause
    exit /b 1
)

REM Check if Composer is installed
where composer >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Composer is not installed or not in PATH
    echo Please install Composer from https://getcomposer.org/
    pause
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] All prerequisites are installed
echo.

echo ========================================
echo Step 1: Installing Backend Dependencies
echo ========================================
cd backend
call composer install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
echo.

echo ========================================
echo Step 2: Installing Frontend Dependencies
echo ========================================
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
echo.

echo ========================================
echo Step 3: Database Setup
echo ========================================
echo.
echo IMPORTANT: Please create the database manually before proceeding.
echo.
echo Open your MySQL client and run:
echo   CREATE DATABASE final_sys CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
echo.
echo Press any key after you've created the database...
pause >nul

echo.
echo ========================================
echo Step 4: Running Migrations and Seeding
echo ========================================
call php artisan migrate:fresh --seed
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to run migrations
    echo Make sure the database 'final_sys' exists and credentials are correct
    pause
    exit /b 1
)
echo [OK] Database migrated and seeded successfully
echo.

echo ========================================
echo Step 5: Creating Storage Link
echo ========================================
call php artisan storage:link
echo [OK] Storage link created
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Login Credentials:
echo   Admin:  admin@eyeclinic.com / password
echo   Doctor: dr.smith@eyeclinic.com / password
echo   Client: john@example.com / password
echo.
echo To start the development server, run:
echo   composer dev
echo.
echo Or start services separately:
echo   php artisan serve      (Backend server)
echo   npm run dev            (Frontend dev server)
echo   php artisan queue:work (Queue worker)
echo.
echo The application will be available at:
echo   http://localhost:8000
echo.
pause
