-- ========================================
-- SCRIPT RESET DATABASE - XÓA TẤT CẢ DỮ LIỆU
-- ========================================
-- Script này sẽ xóa toàn bộ dữ liệu trong database
-- và đặt lại auto_increment counters về 1
-- CHỈ SỬ DỤNG TRONG MÔI TRƯỜNG DEVELOPMENT!

SET FOREIGN_KEY_CHECKS = 0;

-- Xóa tất cả dữ liệu theo thứ tự để tránh lỗi khóa ngoại
DELETE FROM internship_progress;
DELETE FROM tasks;
DELETE FROM evaluations;  
DELETE FROM contracts;
DELETE FROM reports;
DELETE FROM internships;
DELETE FROM mentors;
DELETE FROM teachers;
DELETE FROM students;
DELETE FROM companies;
DELETE FROM internship_batches;
DELETE FROM users;

-- Reset auto increment counters
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE companies AUTO_INCREMENT = 1;
ALTER TABLE internship_batches AUTO_INCREMENT = 1;
ALTER TABLE teachers AUTO_INCREMENT = 1;
ALTER TABLE students AUTO_INCREMENT = 1;
ALTER TABLE mentors AUTO_INCREMENT = 1;
ALTER TABLE internships AUTO_INCREMENT = 1;
ALTER TABLE reports AUTO_INCREMENT = 1;
ALTER TABLE evaluations AUTO_INCREMENT = 1;
ALTER TABLE contracts AUTO_INCREMENT = 1;
ALTER TABLE tasks AUTO_INCREMENT = 1;
ALTER TABLE internship_progress AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Database has been reset successfully!' as message;
SELECT 'All tables are now empty and auto-increment counters reset to 1' as status;