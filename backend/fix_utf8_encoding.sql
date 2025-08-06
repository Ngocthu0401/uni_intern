-- ========================================
-- SCRIPT SỬA LỖI ENCODING UTF-8
-- ========================================

-- Đặt charset cho session hiện tại
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET CHARACTER SET utf8mb4;

-- Kiểm tra và hiển thị charset hiện tại
SELECT 'Current charset settings:' as info;
SHOW VARIABLES LIKE 'character_set%';

-- Kiểm tra collation hiện tại  
SELECT 'Current collation settings:' as info;
SHOW VARIABLES LIKE 'collation%';

SELECT 'UTF-8 encoding has been set for this session!' as message;
SELECT 'You should now see Vietnamese characters correctly.' as note;

-- Test Vietnamese text
SELECT 'Bộ môn Công nghệ Thông tin' as test_vietnamese_text;
SELECT 'Nguyễn Văn A' as test_vietnamese_name;