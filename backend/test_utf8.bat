@echo off
chcp 65001 >nul
echo Testing UTF-8 support...
echo.

echo Setting UTF-8 for MySQL session...
mysql -u root --default-character-set=utf8mb4 -e "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci; SELECT 'Test Vietnamese: Bộ môn Công nghệ Thông tin' as test;"

echo.
echo Checking current data in database...
mysql -u root --default-character-set=utf8mb4 -e "USE internship_management; SELECT id, username, full_name, email FROM users WHERE role='TEACHER' LIMIT 3;"

echo.
echo If you see garbled text above, run: setup_demo_data_utf8.bat
pause