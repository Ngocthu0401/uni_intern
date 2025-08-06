@echo off
setlocal enabledelayedexpansion

echo 🚀 Internship Management API Test Suite
echo =========================================

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version
echo.

:: Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found. Please run this script from the api-tests directory.
    pause
    exit /b 1
)

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if !errorlevel! neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
    echo.
) else (
    echo ✅ Dependencies already installed
    echo.
)

:: Check if Spring Boot application is running
echo 🏥 Checking if Spring Boot application is running...
curl -s --max-time 5 http://localhost:8080 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Spring Boot application is not reachable on port 8080
    echo 💡 Please start your Spring Boot application first:
    echo    cd backend
    echo    mvnw.cmd spring-boot:run
    echo.
    set /p response="❓ Do you want to continue anyway? (y/N): "
    if /i "!response!" neq "y" (
        echo 👋 Exiting...
        pause
        exit /b 1
    )
) else (
    echo ✅ Spring Boot application is running on port 8080
)

echo.

:: Parse command line arguments (basic implementation)
set "MODULE="
set "VERBOSE="
set "URL="
set "CMD=node test-runner.js"

:: Simple argument parsing for common cases
if "%1"=="-m" set "MODULE=%2" & set "CMD=%CMD% --module %2"
if "%1"=="--module" set "MODULE=%2" & set "CMD=%CMD% --module %2"
if "%1"=="-v" set "VERBOSE=--verbose" & set "CMD=%CMD% --verbose"
if "%1"=="--verbose" set "VERBOSE=--verbose" & set "CMD=%CMD% --verbose"
if "%1"=="-h" goto :help
if "%1"=="--help" goto :help

:: Run the tests
echo 🧪 Running API tests...
echo Command: %CMD%
echo.

%CMD%
set TEST_EXIT_CODE=%errorlevel%

echo.
if %TEST_EXIT_CODE% equ 0 (
    echo 🎉 All tests completed successfully!
) else (
    echo ❌ Some tests failed. Exit code: %TEST_EXIT_CODE%
)

pause
exit /b %TEST_EXIT_CODE%

:help
echo Usage: %0 [OPTIONS]
echo.
echo Options:
echo   -m, --module ^<module^>   Test specific module (auth, students, teachers, companies, mentors, batches, internships)
echo   -v, --verbose           Verbose output
echo   -h, --help              Show this help message
echo.
echo Examples:
echo   %0                      # Run all tests
echo   %0 -m auth              # Test only authentication module
echo   %0 -v                   # Run all tests with verbose output
pause
exit /b 0 