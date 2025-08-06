-- ========================================
-- SCRIPT TẠO DỮ LIỆU DEMO CHO HỆ THỐNG QUẢN LÝ THỰC TẬP
-- ========================================

-- Xóa dữ liệu cũ (theo thứ tự để tránh lỗi khóa ngoại)
SET FOREIGN_KEY_CHECKS = 0;

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
DELETE FROM users WHERE id > 18; -- Giữ lại users đã có

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- 1. TẠO USERS (Người dùng)
-- ========================================

INSERT INTO users (username, password, email, full_name, phone_number, role, is_active, created_at, updated_at) VALUES 
-- Department Users (Bộ môn)
('dept_cntt', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', 'dept.cntt@uit.edu.vn', 'Bộ môn Công nghệ Thông tin', '0288123456', 'DEPARTMENT', 1, NOW(), NOW()),
('dept_ktpm', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', 'dept.ktpm@uit.edu.vn', 'Bộ môn Kỹ thuật Phần mềm', '0288123457', 'DEPARTMENT', 1, NOW(), NOW()),

-- Teacher Users (Giảng viên)
('gv_nguyen_van_a', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', 'nguyenvana@uit.edu.vn', 'TS. Nguyễn Văn A', '0901234567', 'TEACHER', 1, NOW(), NOW()),
('gv_tran_thi_b', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', 'tranthib@uit.edu.vn', 'ThS. Trần Thị B', '0901234568', 'TEACHER', 1, NOW(), NOW()),
('gv_le_van_c', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', 'levanc@uit.edu.vn', 'PGS.TS. Lê Văn C', '0901234569', 'TEACHER', 1, NOW(), NOW()),
('gv_pham_thi_d', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', 'phamthid@uit.edu.vn', 'TS. Phạm Thị D', '0901234570', 'TEACHER', 1, NOW(), NOW()),

-- Student Users (Sinh viên)
('sv_19520001', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '19520001@gm.uit.edu.vn', 'Nguyễn Minh Khoa', '0987654321', 'STUDENT', 1, NOW(), NOW()),
('sv_19520002', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '19520002@gm.uit.edu.vn', 'Trần Thị Lan', '0987654322', 'STUDENT', 1, NOW(), NOW()),
('sv_19520003', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '19520003@gm.uit.edu.vn', 'Lê Văn Hùng', '0987654323', 'STUDENT', 1, NOW(), NOW()),
('sv_19520004', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '19520004@gm.uit.edu.vn', 'Phạm Thị Mai', '0987654324', 'STUDENT', 1, NOW(), NOW()),
('sv_19520005', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '19520005@gm.uit.edu.vn', 'Hoàng Văn Nam', '0987654325', 'STUDENT', 1, NOW(), NOW()),
('sv_19520006', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '19520006@gm.uit.edu.vn', 'Đỗ Thị Hoa', '0987654326', 'STUDENT', 1, NOW(), NOW()),
('sv_19520007', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '19520007@gm.uit.edu.vn', 'Vũ Minh Tuấn', '0987654327', 'STUDENT', 1, NOW(), NOW()),
('sv_19520008', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '19520008@gm.uit.edu.vn', 'Bùi Thị Thủy', '0987654328', 'STUDENT', 1, NOW(), NOW()),

-- Mentor Users (Cán bộ hướng dẫn)
('mentor_fpt_01', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', 'mentor1@fpt.com.vn', 'Nguyễn Thành Đạt', '0912345678', 'MENTOR', 1, NOW(), NOW()),
('mentor_fpt_02', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', 'mentor2@fpt.com.vn', 'Trần Minh Phong', '0912345679', 'MENTOR', 1, NOW(), NOW()),
('mentor_vng_01', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', 'mentor1@vng.com.vn', 'Lê Thị Hương', '0912345680', 'MENTOR', 1, NOW(), NOW()),
('mentor_tma_01', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', 'mentor1@tma.com.vn', 'Phạm Văn Quang', '0912345681', 'MENTOR', 1, NOW(), NOW()),
('mentor_saigontech_01', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', 'mentor1@saigontech.edu.vn', 'Võ Thị Lan', '0912345682', 'MENTOR', 1, NOW(), NOW()),
('mentor_bkav_01', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', 'mentor1@bkav.com.vn', 'Đặng Minh Tuấn', '0912345683', 'MENTOR', 1, NOW(), NOW());

-- ========================================
-- 2. TẠO COMPANIES (Công ty)
-- ========================================

INSERT INTO companies (company_name, abbreviated_name, company_code, company_type, address, phone_number, email, website, industry, company_size, description, contact_person, contact_position, contact_phone, contact_email, is_active, created_at, updated_at) VALUES 
('Công ty Cổ phần FPT', 'FPT Corp', 'FPT001', 'Cổ phần', '17 Duy Tân, Cầu Giấy, Hà Nội', '024-7300-8866', 'contact@fpt.com.vn', 'https://fpt.com.vn', 'Công nghệ thông tin', '10000+', 'Tập đoàn công nghệ hàng đầu Việt Nam với các dịch vụ viễn thông, công nghệ thông tin và giáo dục.', 'Nguyễn Văn An', 'Giám đốc Nhân sự', '024-7300-8867', 'hr@fpt.com.vn', 1, NOW(), NOW()),

('Công ty TNHH VNG', 'VNG Corp', 'VNG001', 'TNHH', '182 Lê Đại Hành, Q.11, TP.HCM', '028-6263-3663', 'info@vng.com.vn', 'https://vng.com.vn', 'Game & Internet', '1000-5000', 'Công ty công nghệ hàng đầu Việt Nam chuyên phát triển game, mạng xã hội và thanh toán điện tử.', 'Trần Thị Bình', 'Trưởng phòng Tuyển dụng', '028-6263-3664', 'recruit@vng.com.vn', 1, NOW(), NOW()),

('Công ty TNHH TMA Solutions', 'TMA Solutions', 'TMA001', 'TNHH', '15 Đường D2, Quận Bình Thạnh, TP.HCM', '028-3512-7979', 'contact@tma.com.vn', 'https://tmasolutions.com', 'Phần mềm', '5000-10000', 'Công ty phát triển phần mềm lớn nhất Việt Nam, chuyên outsourcing cho thị trường quốc tế.', 'Lê Minh Cường', 'Giám đốc Nhân sự', '028-3512-7980', 'hr@tma.com.vn', 1, NOW(), NOW()),

('Trường Đại học Công nghệ Sài Gòn', 'STU', 'STU001', 'Giáo dục', '180 Cao Lỗ, Quận 8, TP.HCM', '028-5445-7777', 'info@stu.edu.vn', 'https://saigontech.edu.vn', 'Giáo dục', '1000-5000', 'Trường đại học tư thục chất lượng cao, chuyên đào tạo công nghệ thông tin và kỹ thuật.', 'Phạm Thị Dung', 'Trưởng phòng Hợp tác Doanh nghiệp', '028-5445-7778', 'cooperation@stu.edu.vn', 1, NOW(), NOW()),

('Công ty An ninh mạng BKAV', 'BKAV', 'BKAV001', 'Cổ phần', '156 Nguyễn Đức Cảnh, Hoàng Mai, Hà Nội', '024-3640-2222', 'info@bkav.com', 'https://bkav.com', 'An ninh mạng', '500-1000', 'Công ty chuyên phát triển các sản phẩm an ninh mạng và phần mềm antivirus hàng đầu Việt Nam.', 'Nguyễn Thái Sơn', 'Giám đốc Phát triển', '024-3640-2223', 'hr@bkav.com', 1, NOW(), NOW()),

('Ngân hàng Số Timo', 'Timo Bank', 'TIMO001', 'Cổ phần', 'Tầng 8, Toà nhà Vincom Center, Lê Thánh Tôn, Q.1, TP.HCM', '1900-555-866', 'hello@timo.vn', 'https://timo.vn', 'Fintech', '100-500', 'Ngân hàng số đầu tiên tại Việt Nam, cung cấp dịch vụ ngân hàng hoàn toàn trên mobile.', 'Võ Minh Đức', 'Head of Engineering', '028-7106-8668', 'careers@timo.vn', 1, NOW(), NOW());

-- ========================================
-- 3. TẠO INTERNSHIP BATCHES (Đợt thực tập)
-- ========================================

INSERT INTO internship_batches (batch_name, batch_code, semester, academic_year, start_date, end_date, registration_start_date, registration_end_date, description, max_students, is_active, created_at, updated_at) VALUES 
('Thực tập Học kỳ 1 năm học 2024-2025', 'TT_HK1_2024', 'Học kỳ 1', '2024-2025', '2024-09-01', '2024-12-15', '2024-06-01', '2024-08-15', 'Đợt thực tập chính thức cho sinh viên năm cuối trong học kỳ 1 năm học 2024-2025', 200, 1, NOW(), NOW()),
('Thực tập Hè 2024', 'TT_HE_2024', 'Hè', '2024', '2024-06-15', '2024-08-30', '2024-04-01', '2024-05-31', 'Đợt thực tập hè cho sinh viên muốn tích lũy kinh nghiệm sớm', 150, 1, NOW(), NOW()),
('Thực tập Học kỳ 2 năm học 2023-2024', 'TT_HK2_2023', 'Học kỳ 2', '2023-2024', '2024-02-01', '2024-05-31', '2023-12-01', '2024-01-15', 'Đợt thực tập học kỳ 2 vừa kết thúc', 180, 0, NOW(), NOW());

-- ========================================
-- 4. TẠO TEACHERS (Giảng viên)
-- ========================================

INSERT INTO teachers (user_id, teacher_code, department, position, degree, specialization, office_location, created_at, updated_at) VALUES 
((SELECT id FROM users WHERE username = 'gv_nguyen_van_a'), 'GV001', 'Công nghệ Thông tin', 'Giảng viên chính', 'Tiến sĩ', 'Trí tuệ nhân tạo, Machine Learning', 'Phòng 301, Tòa nhà B1', NOW(), NOW()),
((SELECT id FROM users WHERE username = 'gv_tran_thi_b'), 'GV002', 'Kỹ thuật Phần mềm', 'Giảng viên', 'Thạc sĩ', 'Phát triển Web, Mobile App', 'Phòng 205, Tòa nhà B2', NOW(), NOW()),
((SELECT id FROM users WHERE username = 'gv_le_van_c'), 'GV003', 'Công nghệ Thông tin', 'Phó Giáo sư', 'Tiến sĩ', 'Cơ sở dữ liệu, Big Data', 'Phòng 401, Tòa nhà B1', NOW(), NOW()),
((SELECT id FROM users WHERE username = 'gv_pham_thi_d'), 'GV004', 'An toàn Thông tin', 'Giảng viên chính', 'Tiến sĩ', 'Mật mã học, Blockchain', 'Phòng 302, Tòa nhà B3', NOW(), NOW());

-- ========================================
-- 5. TẠO STUDENTS (Sinh viên)
-- ========================================

INSERT INTO students (user_id, student_code, class_name, major, academic_year, gpa, date_of_birth, address, parent_name, parent_phone, status, created_at, updated_at) VALUES 
((SELECT id FROM users WHERE username = 'sv_19520001'), '19520001', 'CNTT-K19', 'Công nghệ Thông tin', '2019-2023', 3.75, '2001-03-15', '123 Nguyễn Văn Cừ, Q.5, TP.HCM', 'Nguyễn Văn Hải', '0908123456', 'ACTIVE', NOW(), NOW()),
((SELECT id FROM users WHERE username = 'sv_19520002'), '19520002', 'CNTT-K19', 'Công nghệ Thông tin', '2019-2023', 3.82, '2001-07-22', '456 Lê Lợi, Q.1, TP.HCM', 'Trần Minh Tâm', '0908123457', 'ACTIVE', NOW(), NOW()),
((SELECT id FROM users WHERE username = 'sv_19520003'), '19520003', 'KTPM-K19', 'Kỹ thuật Phần mềm', '2019-2023', 3.65, '2001-12-08', '789 Nguyễn Huệ, Q.1, TP.HCM', 'Lê Thị Nga', '0908123458', 'ACTIVE', NOW(), NOW()),
((SELECT id FROM users WHERE username = 'sv_19520004'), '19520004', 'KTPM-K19', 'Kỹ thuật Phần mềm', '2019-2023', 3.90, '2001-05-10', '321 Võ Văn Tần, Q.3, TP.HCM', 'Phạm Văn Bình', '0908123459', 'ACTIVE', NOW(), NOW()),
((SELECT id FROM users WHERE username = 'sv_19520005'), '19520005', 'CNTT-K19', 'Công nghệ Thông tin', '2019-2023', 3.55, '2001-09-18', '654 Trần Hưng Đạo, Q.1, TP.HCM', 'Hoàng Thị Lan', '0908123460', 'ACTIVE', NOW(), NOW()),
((SELECT id FROM users WHERE username = 'sv_19520006'), '19520006', 'ATTT-K19', 'An toàn Thông tin', '2019-2023', 3.70, '2001-11-25', '987 Nguyễn Thị Minh Khai, Q.3, TP.HCM', 'Đỗ Văn Cường', '0908123461', 'ACTIVE', NOW(), NOW()),
((SELECT id FROM users WHERE username = 'sv_19520007'), '19520007', 'CNTT-K19', 'Công nghệ Thông tin', '2019-2023', 3.45, '2001-01-30', '159 Pasteur, Q.1, TP.HCM', 'Vũ Thị Hồng', '0908123462', 'ACTIVE', NOW(), NOW()),
((SELECT id FROM users WHERE username = 'sv_19520008'), '19520008', 'KTPM-K19', 'Kỹ thuật Phần mềm', '2019-2023', 3.85, '2001-04-12', '753 Cách Mạng Tháng 8, Q.10, TP.HCM', 'Bùi Văn Đức', '0908123463', 'ACTIVE', NOW(), NOW());

-- ========================================
-- 6. TẠO MENTORS (Cán bộ hướng dẫn)
-- ========================================

INSERT INTO mentors (user_id, company_id, position, department, years_of_experience, specialization, office_location, expertise_level, created_at, updated_at) VALUES 
((SELECT id FROM users WHERE username = 'mentor_fpt_01'), (SELECT id FROM companies WHERE company_code = 'FPT001'), 'Senior Software Engineer', 'Software Development', 8, 'Java, Spring Boot, Microservices', 'Tầng 15, Tòa nhà FPT', 'SENIOR', NOW(), NOW()),
((SELECT id FROM users WHERE username = 'mentor_fpt_02'), (SELECT id FROM companies WHERE company_code = 'FPT001'), 'Technical Lead', 'AI/ML Department', 10, 'Machine Learning, Python, TensorFlow', 'Tầng 12, Tòa nhà FPT', 'EXPERT', NOW(), NOW()),
((SELECT id FROM users WHERE username = 'mentor_vng_01'), (SELECT id FROM companies WHERE company_code = 'VNG001'), 'Frontend Lead', 'Game Development', 7, 'ReactJS, Unity, Game Development', 'Tầng 8, VNG Campus', 'SENIOR', NOW(), NOW()),
((SELECT id FROM users WHERE username = 'mentor_tma_01'), (SELECT id FROM companies WHERE company_code = 'TMA001'), 'Solution Architect', 'Enterprise Solutions', 12, '.NET, Azure, System Design', 'Tầng 5, TMA Tower', 'EXPERT', NOW(), NOW()),
((SELECT id FROM users WHERE username = 'mentor_saigontech_01'), (SELECT id FROM companies WHERE company_code = 'STU001'), 'Research Manager', 'R&D Department', 6, 'IoT, Embedded Systems, Research', 'Phòng Lab 301', 'SENIOR', NOW(), NOW()),
((SELECT id FROM users WHERE username = 'mentor_bkav_01'), (SELECT id FROM companies WHERE company_code = 'BKAV001'), 'Security Specialist', 'Cybersecurity', 9, 'Network Security, Penetration Testing', 'Tầng 3, BKAV Building', 'EXPERT', NOW(), NOW());

-- ========================================
-- 7. TẠO INTERNSHIPS (Thực tập)
-- ========================================

INSERT INTO internships (student_id, teacher_id, mentor_id, company_id, batch_id, internship_code, job_title, job_description, requirements, start_date, end_date, status, working_hours_per_week, salary, benefits, final_score, teacher_score, mentor_score, teacher_comment, mentor_comment, notes, created_at, updated_at) VALUES 
-- Thực tập tại FPT
((SELECT id FROM students WHERE student_code = '19520001'), (SELECT id FROM teachers WHERE teacher_code = 'GV001'), (SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_fpt_01')), (SELECT id FROM companies WHERE company_code = 'FPT001'), (SELECT id FROM internship_batches WHERE batch_code = 'TT_HK1_2024'), 'INT_FPT_001', 'Java Backend Developer Intern', 'Phát triển các API REST sử dụng Spring Boot, tham gia vào dự án thực tế của công ty, học hỏi về kiến trúc microservices và best practices trong phát triển phần mềm.', 'Kiến thức cơ bản về Java, OOP, SQL. Có thể làm việc nhóm và ham học hỏi.', '2024-09-01', '2024-12-15', 'IN_PROGRESS', 40, 3000000, 'Hỗ trợ ăn trưa, xe đưa đón, bảo hiểm y tế', 8.5, 8.7, 8.3, 'Sinh viên có tiến bộ tốt, hiểu biết sâu về Spring Boot', 'Thái độ làm việc tích cực, code clean và có tư duy tốt', 'Sinh viên phù hợp với môi trường làm việc chuyên nghiệp', NOW(), NOW()),

((SELECT id FROM students WHERE student_code = '19520002'), (SELECT id FROM teachers WHERE teacher_code = 'GV001'), (SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_fpt_02')), (SELECT id FROM companies WHERE company_code = 'FPT001'), (SELECT id FROM internship_batches WHERE batch_code = 'TT_HK1_2024'), 'INT_FPT_002', 'AI/ML Research Intern', 'Nghiên cứu và phát triển các mô hình machine learning, xử lý dữ liệu lớn, tham gia dự án AI chatbot cho khách hàng doanh nghiệp.', 'Kiến thức về Python, toán học, thống kê. Có kinh nghiệm với thư viện ML như scikit-learn, pandas.', '2024-09-01', '2024-12-15', 'IN_PROGRESS', 40, 3500000, 'Hỗ trợ ăn trưa, xe đưa đón, khóa học AI online', 8.8, 9.0, 8.6, 'Sinh viên có năng lực xuất sắc trong AI/ML', 'Có khả năng research tốt và tư duy logic mạnh', 'Tiềm năng để trở thành AI Engineer trong tương lai', NOW(), NOW()),

-- Thực tập tại VNG
((SELECT id FROM students WHERE student_code = '19520003'), (SELECT id FROM teachers WHERE teacher_code = 'GV002'), (SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_vng_01')), (SELECT id FROM companies WHERE company_code = 'VNG001'), (SELECT id FROM internship_batches WHERE batch_code = 'TT_HK1_2024'), 'INT_VNG_001', 'Frontend Developer Intern', 'Phát triển giao diện web cho game portal, sử dụng ReactJS và modern frontend technologies. Tham gia vào team phát triển game web.', 'Kiến thức HTML, CSS, JavaScript. Có kinh nghiệm với ReactJS hoặc Vue.js là một lợi thế.', '2024-09-01', '2024-12-15', 'IN_PROGRESS', 40, 3200000, 'Lunch allowance, game credits, team building', 8.2, 8.0, 8.4, 'Kỹ năng frontend tốt, cần cải thiện về UX/UI', 'Code quality tốt, responsive design skills cần trau dồi', 'Có tiềm năng phát triển thành full-stack developer', NOW(), NOW()),

-- Thực tập tại TMA Solutions
((SELECT id FROM students WHERE student_code = '19520004'), (SELECT id FROM teachers WHERE teacher_code = 'GV003'), (SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_tma_01')), (SELECT id FROM companies WHERE company_code = 'TMA001'), (SELECT id FROM internship_batches WHERE batch_code = 'TT_HK1_2024'), 'INT_TMA_001', '.NET Developer Intern', 'Phát triển ứng dụng enterprise sử dụng .NET Core, Entity Framework, và Azure cloud services. Tham gia dự án outsourcing cho khách hàng quốc tế.', 'Kiến thức C#, OOP, SQL Server. Tiếng Anh giao tiếp cơ bản.', '2024-09-01', '2024-12-15', 'IN_PROGRESS', 40, 3300000, 'Health insurance, English class, certification support', 8.6, 8.5, 8.7, 'Kỹ năng .NET vững chắc, giao tiếp tiếng Anh tốt', 'Delivery đúng deadline, quality code cao', 'Phù hợp với môi trường outsourcing quốc tế', NOW(), NOW()),

-- Thực tập tại Saigon Technology University
((SELECT id FROM students WHERE student_code = '19520005'), (SELECT id FROM teachers WHERE teacher_code = 'GV002'), (SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_saigontech_01')), (SELECT id FROM companies WHERE company_code = 'STU001'), (SELECT id FROM internship_batches WHERE batch_code = 'TT_HK1_2024'), 'INT_STU_001', 'IoT Research Assistant', 'Nghiên cứu và phát triển các giải pháp IoT cho smart campus, lập trình embedded systems, phát triển mobile app điều khiển thiết bị IoT.', 'Kiến thức về lập trình C/C++, Arduino/Raspberry Pi. Có kinh nghiệm với mobile development là lợi thế.', '2024-09-01', '2024-12-15', 'IN_PROGRESS', 35, 2800000, 'Meal allowance, lab access, research publication opportunity', 8.0, 7.8, 8.2, 'Có năng lực research, cần cải thiện kỹ năng thuyết trình', 'Tính sáng tạo cao, giải quyết vấn đề tốt', 'Tiềm năng theo hướng nghiên cứu và phát triển sản phẩm', NOW(), NOW()),

-- Thực tập tại BKAV
((SELECT id FROM students WHERE student_code = '19520006'), (SELECT id FROM teachers WHERE teacher_code = 'GV004'), (SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_bkav_01')), (SELECT id FROM companies WHERE company_code = 'BKAV001'), (SELECT id FROM internship_batches WHERE batch_code = 'TT_HK1_2024'), 'INT_BKAV_001', 'Cybersecurity Intern', 'Tham gia team phát triển các công cụ bảo mật, thực hiện penetration testing, nghiên cứu các lỗ hổng bảo mật mới và phát triển giải pháp phòng chống.', 'Kiến thức về network security, ethical hacking. Có certificate về cybersecurity là lợi thế.', '2024-09-01', '2024-12-15', 'IN_PROGRESS', 40, 3400000, 'Security training, certification sponsorship, health insurance', 8.7, 8.9, 8.5, 'Kiến thức security vững, có tư duy phân tích tốt', 'Kỹ năng penetration testing xuất sắc', 'Có tiềm năng trở thành security expert', NOW(), NOW()),

-- Thực tập đã hoàn thành (batch trước)
((SELECT id FROM students WHERE student_code = '19520007'), (SELECT id FROM teachers WHERE teacher_code = 'GV001'), (SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_fpt_01')), (SELECT id FROM companies WHERE company_code = 'FPT001'), (SELECT id FROM internship_batches WHERE batch_code = 'TT_HE_2024'), 'INT_FPT_SUM_001', 'Mobile App Developer Intern', 'Phát triển ứng dụng mobile sử dụng React Native, tham gia dự án app e-commerce cho khách hàng doanh nghiệp.', 'Kiến thức JavaScript, React. Có kinh nghiệm mobile development là lợi thế.', '2024-06-15', '2024-08-30', 'COMPLETED', 40, 2800000, 'Meal allowance, transportation', 8.3, 8.2, 8.4, 'Hoàn thành tốt project, kỹ năng mobile development cải thiện đáng kể', 'Teamwork tốt, delivery đúng timeline', 'Sinh viên có tiềm năng làm việc full-time', NOW(), NOW()),

((SELECT id FROM students WHERE student_code = '19520008'), (SELECT id FROM teachers WHERE teacher_code = 'GV002'), (SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_vng_01')), (SELECT id FROM companies WHERE company_code = 'VNG001'), (SELECT id FROM internship_batches WHERE batch_code = 'TT_HE_2024'), 'INT_VNG_SUM_001', 'Game Developer Intern', 'Phát triển mini game sử dụng Unity, tham gia team phát triển game mobile casual.', 'Kiến thức C#, Unity. Đam mê game development.', '2024-06-15', '2024-08-30', 'COMPLETED', 40, 3000000, 'Game credits, team events, meal allowance', 8.5, 8.6, 8.4, 'Creativity cao, game development skills tốt', 'Có passion với game, code quality stable', 'Recommend cho full-time position', NOW(), NOW());

-- ========================================
-- 8. TẠO REPORTS (Báo cáo)
-- ========================================

INSERT INTO reports (internship_id, student_id, title, type, content, week_number, report_period, status, report_date, submitted_at, reviewed_at, reviewer_id, grade, created_at, updated_at) VALUES 
-- Reports cho sinh viên 19520001 tại FPT
((SELECT id FROM internships WHERE internship_code = 'INT_FPT_001'), (SELECT id FROM students WHERE student_code = '19520001'), 'Báo cáo tuần 1 - Làm quen môi trường làm việc', 'WEEKLY', 'Tuần đầu tiên tại FPT, em đã được orientation về quy trình làm việc, coding standards và tools sử dụng. Em đã setup development environment và làm quen với codebase hiện tại. Mentor hướng dẫn em về Spring Boot architecture và database design patterns.', 1, 'Tuần 1 (01/09 - 07/09/2024)', 'APPROVED', '2024-09-07', '2024-09-07 17:30:00', '2024-09-08 09:15:00', (SELECT id FROM teachers WHERE teacher_code = 'GV001'), 8.5, NOW(), NOW()),

((SELECT id FROM internships WHERE internship_code = 'INT_FPT_001'), (SELECT id FROM students WHERE student_code = '19520001'), 'Báo cáo tuần 2 - Phát triển REST API đầu tiên', 'WEEKLY', 'Tuần này em đã bắt đầu phát triển module User Management API. Em học được cách implement authentication với JWT, validation với Bean Validation và error handling. Gặp khó khăn trong việc hiểu về dependency injection nhưng đã được mentor giải đáp.', 2, 'Tuần 2 (08/09 - 14/09/2024)', 'APPROVED', '2024-09-14', '2024-09-14 17:00:00', '2024-09-15 08:30:00', (SELECT id FROM teachers WHERE teacher_code = 'GV001'), 8.7, NOW(), NOW()),

-- Reports cho sinh viên 19520002 tại FPT (AI/ML)
((SELECT id FROM internships WHERE internship_code = 'INT_FPT_002'), (SELECT id FROM students WHERE student_code = '19520002'), 'Báo cáo tuần 1 - Nghiên cứu ML Models', 'WEEKLY', 'Em bắt đầu nghiên cứu về Natural Language Processing cho chatbot project. Đã tìm hiểu về BERT, GPT models và các preprocessing techniques. Setup Jupyter notebook environment và làm quen với dataset của công ty.', 1, 'Tuần 1 (01/09 - 07/09/2024)', 'APPROVED', '2024-09-07', '2024-09-07 18:00:00', '2024-09-08 10:00:00', (SELECT id FROM teachers WHERE teacher_code = 'GV001'), 9.0, NOW(), NOW()),

-- Reports cho sinh viên đã hoàn thành (19520007)
((SELECT id FROM internships WHERE internship_code = 'INT_FPT_SUM_001'), (SELECT id FROM students WHERE student_code = '19520007'), 'Báo cáo cuối kỳ thực tập', 'FINAL', 'Trong 10 tuần thực tập tại FPT, em đã hoàn thành việc phát triển app e-commerce mobile sử dụng React Native. App có đầy đủ chức năng: đăng nhập, browsing products, shopping cart, payment integration với VNPay. Em đã học được rất nhiều về mobile development, state management với Redux, và API integration. Dự án đã được deploy thành công và khách hàng hài lòng với kết quả.', NULL, 'Toàn bộ kỳ thực tập', 'APPROVED', '2024-08-30', '2024-08-30 16:00:00', '2024-08-31 09:00:00', (SELECT id FROM teachers WHERE teacher_code = 'GV001'), 8.3, NOW(), NOW());

-- ========================================
-- 9. TẠO EVALUATIONS (Đánh giá)
-- ========================================

INSERT INTO evaluations (internship_id, evaluator_id, evaluator_type, evaluation_date, technical_score, soft_skill_score, attitude_score, communication_score, overall_score, strengths, weaknesses, recommendations, comments, is_final_evaluation, created_at, updated_at) VALUES 
-- Đánh giá từ Teacher cho sinh viên 19520001
((SELECT id FROM internships WHERE internship_code = 'INT_FPT_001'), (SELECT user_id FROM teachers WHERE teacher_code = 'GV001'), 'TEACHER', '2024-10-15', 8.5, 8.0, 9.0, 8.5, 8.5, 'Kỹ năng lập trình Java tốt, hiểu sâu về Spring Boot, có thái độ học hỏi tích cực', 'Cần cải thiện kỹ năng debug và performance tuning', 'Nên tham gia thêm các project complex để nâng cao kinh nghiệm', 'Sinh viên có tiến bộ rõ rệt trong suốt quá trình thực tập', false, NOW(), NOW()),

-- Đánh giá từ Mentor cho sinh viên 19520001  
((SELECT id FROM internships WHERE internship_code = 'INT_FPT_001'), (SELECT user_id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_fpt_01')), 'MENTOR', '2024-10-15', 8.0, 8.5, 9.0, 8.0, 8.3, 'Code quality tốt, follow coding standards nghiêm túc, teamwork skills tốt', 'Thời gian estimate task chưa chính xác, cần cải thiện time management', 'Khuyến khích tham gia code review nhiều hơn và học thêm về testing', 'Rất hài lòng với performance của intern', false, NOW(), NOW()),

-- Đánh giá cho sinh viên AI/ML (19520002)
((SELECT id FROM internships WHERE internship_code = 'INT_FPT_002'), (SELECT user_id FROM teachers WHERE teacher_code = 'GV001'), 'TEACHER', '2024-10-15', 9.0, 8.5, 9.0, 8.5, 8.8, 'Kiến thức AI/ML vững chắc, có khả năng research tốt, presentation skills ấn tượng', 'Cần cải thiện deployment skills và production mindset', 'Nên tìm hiểu thêm về MLOps và model monitoring', 'Sinh viên có potential cao trong lĩnh vực AI', false, NOW(), NOW()),

((SELECT id FROM internships WHERE internship_code = 'INT_FPT_002'), (SELECT user_id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_fpt_02')), 'MENTOR', '2024-10-15', 9.0, 8.0, 8.5, 8.5, 8.6, 'Algorithm thinking mạnh, code Python clean và efficient', 'Cần học thêm về software engineering best practices', 'Recommend full-time offer sau khi tốt nghiệp', 'Một trong những intern xuất sắc nhất năm', false, NOW(), NOW()),

-- Đánh giá cuối kỳ cho sinh viên đã hoàn thành (19520007)
((SELECT id FROM internships WHERE internship_code = 'INT_FPT_SUM_001'), (SELECT user_id FROM teachers WHERE teacher_code = 'GV001'), 'TEACHER', '2024-08-30', 8.0, 8.5, 8.5, 8.0, 8.2, 'Mobile development skills tốt, responsive UI, user experience tốt', 'Cần cải thiện performance optimization và caching strategies', 'Tiếp tục học thêm về native mobile development', 'Hoàn thành tốt nhiệm vụ được giao', true, NOW(), NOW()),

((SELECT id FROM internships WHERE internship_code = 'INT_FPT_SUM_001'), (SELECT user_id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_fpt_01')), 'MENTOR', '2024-08-30', 8.5, 8.0, 8.5, 8.0, 8.4, 'Delivery đúng timeline, bug fixing skills tốt, integration testing careful', 'State management phức tạp vẫn còn khó khăn', 'Có thể offer part-time position trong khi học', 'Project completion rate 100%, quality đạt yêu cầu', true, NOW(), NOW());

-- ========================================
-- 10. TẠO CONTRACTS (Hợp đồng)
-- ========================================

INSERT INTO contracts (internship_id, created_by_teacher_id, contract_code, title, content, terms_and_conditions, start_date, end_date, status, signed_date, contract_file_url, student_signature, company_signature, department_signature, notes, contract_type, support_amount, payment_terms, payment_status, payment_date, approval_status, approved_by, approval_date, template_id, created_at, updated_at) VALUES 
-- Hợp đồng hỗ trợ cho sinh viên tại FPT
((SELECT id FROM internships WHERE internship_code = 'INT_FPT_001'), (SELECT id FROM teachers WHERE teacher_code = 'GV001'), 'HT_FPT_001_2024', 'Hợp đồng hỗ trợ thực tập sinh - Nguyễn Minh Khoa', 
'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nHỢP ĐỒNG HỖ TRỢ THỰC TẬP SINH\n\nBên A: Trường Đại học Công nghệ Thông tin\nBên B: Công ty Cổ phần FPT\nBên C: Sinh viên Nguyễn Minh Khoa - MSSV: 19520001\n\nĐIỀU 1: ĐỐI TƯỢNG HỖ TRỢ\n- Sinh viên đang thực tập tại FPT theo chương trình của trường\n- Có thái độ học tập tích cực và kết quả tốt\n\nĐIỀU 2: MỨC HỖ TRỢ\n- Mức hỗ trợ: 3.000.000 VNĐ/tháng\n- Thời gian hỗ trợ: từ 01/09/2024 đến 15/12/2024\n\nĐIỀU 3: ĐIỀU KIỆN HỖ TRỢ\n- Tham gia đầy đủ các hoạt động thực tập\n- Nộp báo cáo định kỳ theo quy định\n- Có đánh giá tích cực từ doanh nghiệp\n\nĐIỀU 4: THANH TOÁN\n- Thanh toán theo tháng vào ngày 15 hàng tháng\n- Chuyển khoản vào tài khoản sinh viên đăng ký',
'1. Sinh viên cam kết hoàn thành đầy đủ chương trình thực tập\n2. Bảo mật thông tin của công ty\n3. Tuân thủ nội quy và quy định của công ty\n4. Công ty cam kết tạo điều kiện tốt nhất cho sinh viên học tập',
'2024-09-01', '2024-12-15', 'SIGNED', '2024-08-25', 
'/contracts/HT_FPT_001_2024.pdf', 
'Nguyễn Minh Khoa - 25/08/2024', 
'FPT Corporation - 26/08/2024', 
'UIT - 27/08/2024',
'Hợp đồng đã được ký kết đầy đủ và đang thực hiện', 'SUPPORT', 3000000.00,
'Thanh toán hàng tháng vào ngày 15. Chuyển khoản qua tài khoản ngân hàng của sinh viên.',
'PAID', '2024-09-15', 'APPROVED', 'TS. Nguyễn Văn A', '2024-08-20', 'TEMPLATE_SUPPORT_001', NOW(), NOW()),

-- Hợp đồng cho sinh viên AI/ML tại FPT
((SELECT id FROM internships WHERE internship_code = 'INT_FPT_002'), (SELECT id FROM teachers WHERE teacher_code = 'GV001'), 'HT_FPT_002_2024', 'Hợp đồng hỗ trợ thực tập sinh - Trần Thị Lan', 
'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nHỢP ĐỒNG HỖ TRỢ THỰC TẬP SINH\n\nBên A: Trường Đại học Công nghệ Thông tin\nBên B: Công ty Cổ phần FPT\nBên C: Sinh viên Trần Thị Lan - MSSV: 19520002\n\nVới mức hỗ trợ đặc biệt cho research project AI/ML: 3.500.000 VNĐ/tháng',
'Các điều khoản tương tự hợp đồng chuẩn với bổ sung về intellectual property cho research project',
'2024-09-01', '2024-12-15', 'SIGNED', '2024-08-25',
'/contracts/HT_FPT_002_2024.pdf',
'Trần Thị Lan - 25/08/2024',
'FPT Corporation - 26/08/2024', 
'UIT - 27/08/2024',
'Hợp đồng có mức hỗ trợ cao do tham gia research project', 'SUPPORT', 3500000.00,
'Thanh toán hàng tháng vào ngày 15 với bonus cho research output.',
'PAID', '2024-09-15', 'APPROVED', 'TS. Nguyễn Văn A', '2024-08-20', 'TEMPLATE_SUPPORT_001', NOW(), NOW()),

-- Hợp đồng cho sinh viên tại VNG
((SELECT id FROM internships WHERE internship_code = 'INT_VNG_001'), (SELECT id FROM teachers WHERE teacher_code = 'GV002'), 'HT_VNG_001_2024', 'Hợp đồng hỗ trợ thực tập sinh - Lê Văn Hùng',
'Hợp đồng hỗ trợ thực tập sinh tại VNG Corporation với focus vào frontend development',
'Điều khoản bảo mật đặc biệt về game content và user data',
'2024-09-01', '2024-12-15', 'ACTIVE', '2024-08-28',
'/contracts/HT_VNG_001_2024.pdf',
'Lê Văn Hùng - 28/08/2024',
'VNG Corporation - 29/08/2024',
'UIT - 30/08/2024',
'Hợp đồng thực hiện tốt, payment on schedule', 'SUPPORT', 3200000.00,
'Monthly payment với game credits bonus',
'PAID', '2024-09-15', 'APPROVED', 'ThS. Trần Thị B', '2024-08-25', 'TEMPLATE_SUPPORT_001', NOW(), NOW());

-- ========================================
-- 11. TẠO TASKS (Nhiệm vụ)
-- ========================================

INSERT INTO tasks (title, description, internship_id, mentor_id, student_id, status, priority, due_date, estimated_hours, actual_hours, notes, created_at, updated_at) VALUES 
-- Tasks cho sinh viên tại FPT (Java Backend)
('Setup Development Environment', 'Cài đặt và cấu hình môi trường phát triển: JDK 17, IntelliJ IDEA, MySQL, Postman, Git. Clone và setup project từ company repository.', 
(SELECT id FROM internships WHERE internship_code = 'INT_FPT_001'), 
(SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_fpt_01')),
(SELECT id FROM students WHERE student_code = '19520001'),
'COMPLETED', 'HIGH', '2024-09-03', 8, 6, 'Completed ahead of schedule, good technical setup skills', NOW(), NOW()),

('Implement User Registration API', 'Phát triển REST API cho đăng ký người dùng với validation, password encryption, và email verification.',
(SELECT id FROM internships WHERE internship_code = 'INT_FPT_001'),
(SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_fpt_01')),
(SELECT id FROM students WHERE student_code = '19520001'), 
'COMPLETED', 'HIGH', '2024-09-10', 16, 18, 'Good implementation, minor feedback on validation messages', NOW(), NOW()),

('Add JWT Authentication', 'Implement JWT-based authentication system với login/logout functionality và middleware protection.',
(SELECT id FROM internships WHERE internship_code = 'INT_FPT_001'),
(SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_fpt_01')),
(SELECT id FROM students WHERE student_code = '19520001'),
'IN_PROGRESS', 'HIGH', '2024-09-20', 20, 15, 'Currently working on token refresh mechanism', NOW(), NOW()),

('Write Unit Tests', 'Viết unit tests cho User service với coverage >= 80% sử dụng JUnit và Mockito.',
(SELECT id FROM internships WHERE internship_code = 'INT_FPT_001'),
(SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_fpt_01')),
(SELECT id FROM students WHERE student_code = '19520001'),
'PENDING', 'MEDIUM', '2024-09-25', 12, NULL, 'Waiting for JWT implementation completion', NOW(), NOW()),

-- Tasks cho sinh viên AI/ML tại FPT
('Data Collection and Preprocessing', 'Thu thập và tiền xử lý dữ liệu chat logs cho chatbot training. Clean data và prepare training dataset.',
(SELECT id FROM internships WHERE internship_code = 'INT_FPT_002'),
(SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_fpt_02')),
(SELECT id FROM students WHERE student_code = '19520002'),
'COMPLETED', 'HIGH', '2024-09-08', 24, 22, 'Excellent data quality, good preprocessing pipeline', NOW(), NOW()),

('Train Intent Classification Model', 'Training mô hình phân loại intent sử dụng BERT model với dataset đã chuẩn bị.',
(SELECT id FROM internships WHERE internship_code = 'INT_FPT_002'),
(SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_fpt_02')),
(SELECT id FROM students WHERE student_code = '19520002'),
'IN_PROGRESS', 'HIGH', '2024-09-18', 32, 28, 'Model accuracy reached 92%, fine-tuning hyperparameters', NOW(), NOW()),

('Build Chatbot API', 'Phát triển REST API cho chatbot service với real-time response và logging.',
(SELECT id FROM internships WHERE internship_code = 'INT_FPT_002'),
(SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_fpt_02')),
(SELECT id FROM students WHERE student_code = '19520002'),
'PENDING', 'HIGH', '2024-09-30', 20, NULL, 'Dependent on model training completion', NOW(), NOW()),

-- Tasks cho sinh viên Frontend tại VNG
('Setup React Development Environment', 'Cài đặt Node.js, npm, create-react-app, và các development tools. Setup ESLint và Prettier.',
(SELECT id FROM internships WHERE internship_code = 'INT_VNG_001'),
(SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_vng_01')),
(SELECT id FROM students WHERE student_code = '19520003'),
'COMPLETED', 'HIGH', '2024-09-03', 6, 4, 'Quick setup, familiar with React ecosystem', NOW(), NOW()),

('Implement Game Portal Homepage', 'Phát triển trang chủ game portal với responsive design, game carousel, và user dashboard.',
(SELECT id FROM internships WHERE internship_code = 'INT_VNG_001'),
(SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_vng_01')),
(SELECT id FROM students WHERE student_code = '19520003'),
'COMPLETED', 'HIGH', '2024-09-15', 24, 26, 'Good UI implementation, minor responsiveness issues fixed', NOW(), NOW()),

('Add User Authentication Flow', 'Implement login/register pages với form validation và state management.',
(SELECT id FROM internships WHERE internship_code = 'INT_VNG_001'),
(SELECT id FROM mentors WHERE user_id = (SELECT id FROM users WHERE username = 'mentor_vng_01')),
(SELECT id FROM students WHERE student_code = '19520003'),
'IN_PROGRESS', 'HIGH', '2024-09-22', 16, 12, 'Working on social login integration', NOW(), NOW());

-- ========================================
-- 12. TẠO INTERNSHIP PROGRESS (Tiến độ thực tập)
-- ========================================

INSERT INTO internship_progress (internship_id, current_week, total_weeks, completed_tasks, total_tasks, overall_progress, weekly_goals, achievements, challenges, mentor_feedback, student_reflection, week_start_date, week_end_date, created_at, updated_at) VALUES 
-- Progress cho sinh viên tại FPT (Java Backend)
((SELECT id FROM internships WHERE internship_code = 'INT_FPT_001'), 1, 16, 1, 4, 25.0, 
'Setup development environment và làm quen với codebase hiện tại', 
'Hoàn thành setup environment thành công, hiểu được project structure',
'Gặp khó khăn ban đầu với Spring Boot configuration',
'Student shows good technical aptitude, quick learner',
'Môi trường FPT rất chuyên nghiệp, mentor support tốt',
'2024-09-01', '2024-09-07', NOW(), NOW()),

((SELECT id FROM internships WHERE internship_code = 'INT_FPT_001'), 2, 16, 2, 4, 50.0,
'Hoàn thành User Registration API với validation',
'Successfully implemented registration endpoint với proper validation',
'Password encryption và email verification integration',
'Good progress, code quality improving',
'Hiểu rõ hơn về REST API design patterns',
'2024-09-08', '2024-09-14', NOW(), NOW()),

((SELECT id FROM internships WHERE internship_code = 'INT_FPT_001'), 3, 16, 2, 4, 62.5,
'Bắt đầu implement JWT authentication system',
'Setup JWT library và understand token-based auth flow',
'Token refresh mechanism và security best practices',
'On track with timeline, good problem-solving skills',
'JWT concept khá phức tạp nhưng thú vị',
'2024-09-15', '2024-09-21', NOW(), NOW()),

-- Progress cho sinh viên AI/ML tại FPT
((SELECT id FROM internships WHERE internship_code = 'INT_FPT_002'), 1, 16, 1, 3, 33.3,
'Data collection và preprocessing cho chatbot project',
'Successfully processed 10K+ chat logs, clean dataset ready',
'Data quality issues và text normalization challenges',
'Excellent data science skills, thorough preprocessing',
'Học được nhiều về NLP preprocessing techniques',
'2024-09-01', '2024-09-07', NOW(), NOW()),

((SELECT id FROM internships WHERE internship_code = 'INT_FPT_002'), 2, 16, 1, 3, 50.0,
'Model training và hyperparameter tuning',
'BERT model achieving 92% accuracy on intent classification',
'Overfitting issues và computational resource management',
'Outstanding ML engineering skills, good experimentation',
'Hiểu sâu hơn về transformer models và fine-tuning',
'2024-09-08', '2024-09-14', NOW(), NOW()),

-- Progress cho sinh viên Frontend tại VNG
((SELECT id FROM internships WHERE internship_code = 'INT_VNG_001'), 1, 16, 1, 3, 33.3,
'Setup React environment và implement homepage',
'Homepage component hoàn thành với responsive design',
'CSS styling và component architecture decisions',
'Good React knowledge, clean component structure',
'VNG culture rất dynamic, team work tốt',
'2024-09-01', '2024-09-07', NOW(), NOW()),

((SELECT id FROM internships WHERE internship_code = 'INT_VNG_001'), 2, 16, 2, 3, 66.7,
'Hoàn thiện homepage và bắt đầu authentication',
'Game carousel working smoothly, user dashboard implemented',
'State management complexity và API integration',
'UI skills improving rapidly, good attention to detail',
'Học được nhiều về modern React patterns',
'2024-09-08', '2024-09-14', NOW(), NOW());

-- ========================================
-- CONFIRMATION MESSAGES
-- ========================================

SELECT 'Demo data generation completed successfully!' as message;
SELECT 
    (SELECT COUNT(*) FROM users WHERE id > 18) as new_users_created,
    (SELECT COUNT(*) FROM companies) as companies_created,
    (SELECT COUNT(*) FROM internship_batches) as batches_created,
    (SELECT COUNT(*) FROM teachers) as teachers_created,
    (SELECT COUNT(*) FROM students) as students_created,
    (SELECT COUNT(*) FROM mentors) as mentors_created,
    (SELECT COUNT(*) FROM internships) as internships_created,
    (SELECT COUNT(*) FROM reports) as reports_created,
    (SELECT COUNT(*) FROM evaluations) as evaluations_created,
    (SELECT COUNT(*) FROM contracts) as contracts_created,
    (SELECT COUNT(*) FROM tasks) as tasks_created,
    (SELECT COUNT(*) FROM internship_progress) as progress_records_created;