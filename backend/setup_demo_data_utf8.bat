@echo off
chcp 65001 >nul
echo ========================================
echo DEMO DATA SETUP SCRIPT (UTF-8 FIXED)
echo ========================================
echo.

REM Set UTF-8 console code page
chcp 65001 >nul

REM Kiểm tra MySQL có được cài đặt không
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MySQL is not installed or not in PATH
    echo Please install MySQL and add it to your PATH environment variable
    pause
    exit /b 1
)

echo MySQL found. Starting UTF-8 demo data setup...
echo.

REM Kiểm tra database có tồn tại không
mysql -u root --default-character-set=utf8mb4 -e "USE internship_management; SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Database 'internship_management' not found
    echo Please make sure the database exists and is accessible
    echo You can create it with: CREATE DATABASE internship_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    pause
    exit /b 1
)

echo Database connection successful.
echo.

REM Backup current data (optional)
set backup_file=backup_before_demo_%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.sql
set backup_file=%backup_file: =0%
echo Creating backup of current data...
mysqldump -u root --default-character-set=utf8mb4 --single-transaction internship_management > %backup_file% 2>nul
if %errorlevel% equ 0 (
    echo Backup created: %backup_file%
) else (
    echo Warning: Could not create backup file
)
echo.

REM Execute demo data script with UTF-8
echo Executing demo data generation script with UTF-8 encoding...
echo This may take a few minutes...
echo.

mysql -u root --default-character-set=utf8mb4 internship_management < generate_demo_data.sql
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS: Demo data has been generated successfully!
    echo ========================================
    echo.
    echo Testing Vietnamese characters...
    mysql -u root --default-character-set=utf8mb4 -e "USE internship_management; SELECT full_name FROM users WHERE username='gv_nguyen_van_a' LIMIT 1;"
    echo.
    echo Demo data includes:
    echo - Users: Department, Teachers, Students, Mentors
    echo - Companies: FPT, VNG, TMA, STU, BKAV, Timo
    echo - Internship Batches: Current and past semesters
    echo - Internships: Active and completed internships
    echo - Reports: Weekly and final reports
    echo - Evaluations: Teacher and mentor evaluations
    echo - Contracts: Support contracts with payment details
    echo - Tasks: Work assignments and progress tracking
    echo - Progress Records: Weekly internship progress
    echo.
    echo Login credentials for testing:
    echo - Department: department_admin / password123
    echo - Teacher: gv_nguyen_van_a / password123
    echo - Student: sv_19520001 / password123
    echo - Mentor: mentor_fpt_01 / password123
    echo.
    echo You can now start the backend server and test the system!
    echo Backend: cd backend ^&^& mvn spring-boot:run
    echo Frontend: cd frontend ^&^& npm start
) else (
    echo.
    echo ========================================
    echo ERROR: Failed to generate demo data
    echo ========================================
    echo Please check the error messages above and try again.
    if exist %backup_file% (
        echo.
        echo To restore your previous data:
        echo mysql -u root --default-character-set=utf8mb4 internship_management ^< %backup_file%
    )
)

echo.
pause