-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 06, 2025 at 02:16 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `internship_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `abbreviated_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_code` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `company_size` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_type` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact_email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact_person` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact_phone` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact_position` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `industry` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `created_at`, `updated_at`, `abbreviated_name`, `address`, `company_code`, `company_name`, `company_size`, `company_type`, `contact_email`, `contact_person`, `contact_phone`, `contact_position`, `description`, `email`, `industry`, `is_active`, `phone_number`, `website`) VALUES
(1, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'FPT Corp', '17 Duy Tân, Cầu Giấy, Hà Nội', 'FPT001', 'Công ty Cổ phần FPT', '10000+', 'Cổ phần', 'hr@fpt.com.vn', 'Nguyễn Văn An', '024-7300-8867', 'Giám đốc Nhân sự', 'Tập đoàn công nghệ hàng đầu Việt Nam với các dịch vụ viễn thông, công nghệ thông tin và giáo dục.', 'contact@fpt.com.vn', 'Công nghệ thông tin', b'1', '024-7300-8866', 'https://fpt.com.vn'),
(2, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'VNG Corp', '182 Lê Đại Hành, Q.11, TP.HCM', 'VNG001', 'Công ty TNHH VNG', '1000-5000', 'TNHH', 'recruit@vng.com.vn', 'Trần Thị Bình', '028-6263-3664', 'Trưởng phòng Tuyển dụng', 'Công ty công nghệ hàng đầu Việt Nam chuyên phát triển game, mạng xã hội và thanh toán điện tử.', 'info@vng.com.vn', 'Game & Internet', b'1', '028-6263-3663', 'https://vng.com.vn'),
(3, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'TMA Solutions', '15 Đường D2, Quận Bình Thạnh, TP.HCM', 'TMA001', 'Công ty TNHH TMA Solutions', '5000-10000', 'TNHH', 'hr@tma.com.vn', 'Lê Minh Cường', '028-3512-7980', 'Giám đốc Nhân sự', 'Công ty phát triển phần mềm lớn nhất Việt Nam, chuyên outsourcing cho thị trường quốc tế.', 'contact@tma.com.vn', 'Phần mềm', b'1', '028-3512-7979', 'https://tmasolutions.com'),
(4, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'STU', '180 Cao Lỗ, Quận 8, TP.HCM', 'STU001', 'Trường Đại học Công nghệ Sài Gòn', '1000-5000', 'Giáo dục', 'cooperation@stu.edu.vn', 'Phạm Thị Dung', '028-5445-7778', 'Trưởng phòng Hợp tác Doanh nghiệp', 'Trường đại học tư thục chất lượng cao, chuyên đào tạo công nghệ thông tin và kỹ thuật.', 'info@stu.edu.vn', 'Giáo dục', b'1', '028-5445-7777', 'https://saigontech.edu.vn'),
(5, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'BKAV', '156 Nguyễn Đức Cảnh, Hoàng Mai, Hà Nội', 'BKAV001', 'Công ty An ninh mạng BKAV', '500-1000', 'Cổ phần', 'hr@bkav.com', 'Nguyễn Thái Sơn', '024-3640-2223', 'Giám đốc Phát triển', 'Công ty chuyên phát triển các sản phẩm an ninh mạng và phần mềm antivirus hàng đầu Việt Nam.', 'info@bkav.com', 'An ninh mạng', b'1', '024-3640-2222', 'https://bkav.com'),
(6, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'Timo Bank', 'Tầng 8, Toà nhà Vincom Center, Lê Thánh Tôn, Q.1, TP.HCM', 'TIMO001', 'Ngân hàng Số Timo', '100-500', 'Cổ phần', 'careers@timo.vn', 'Võ Minh Đức', '028-7106-8668', 'Head of Engineering', 'Ngân hàng số đầu tiên tại Việt Nam, cung cấp dịch vụ ngân hàng hoàn toàn trên mobile.', 'hello@timo.vn', 'Fintech', b'1', '1900-555-866', 'https://timo.vn');

-- --------------------------------------------------------

--
-- Table structure for table `contracts`
--

CREATE TABLE `contracts` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `approval_date` date DEFAULT NULL,
  `approval_status` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `approved_by` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_signature` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_general_ci,
  `contract_code` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contract_file_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contract_type` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `department_signature` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_general_ci,
  `payment_date` date DEFAULT NULL,
  `payment_status` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_terms` text COLLATE utf8mb4_general_ci,
  `signed_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `status` enum('DRAFT','PENDING','SENT','SIGNED','ACTIVE','PAID','REJECTED','EXPIRED','TERMINATED') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_signature` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `support_amount` double DEFAULT NULL,
  `template_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `terms_and_conditions` text COLLATE utf8mb4_general_ci,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_by_teacher_id` bigint DEFAULT NULL,
  `internship_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contracts`
--

INSERT INTO `contracts` (`id`, `created_at`, `updated_at`, `approval_date`, `approval_status`, `approved_by`, `company_signature`, `content`, `contract_code`, `contract_file_url`, `contract_type`, `department_signature`, `end_date`, `notes`, `payment_date`, `payment_status`, `payment_terms`, `signed_date`, `start_date`, `status`, `student_signature`, `support_amount`, `template_id`, `terms_and_conditions`, `title`, `created_by_teacher_id`, `internship_id`) VALUES
(1, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', '2024-08-20', 'APPROVED', 'TS. Nguyễn Văn A', 'FPT Corporation - 26/08/2024', 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nHỢP ĐỒNG HỖ TRỢ THỰC TẬP SINH\n\nBên A: Trường Đại học Công nghệ Thông tin\nBên B: Công ty Cổ phần FPT\nBên C: Sinh viên Nguyễn Minh Khoa - MSSV: 19520001\n\nĐIỀU 1: ĐỐI TƯỢNG HỖ TRỢ\n- Sinh viên đang thực tập tại FPT theo chương trình của trường\n- Có thái độ học tập tích cực và kết quả tốt\n\nĐIỀU 2: MỨC HỖ TRỢ\n- Mức hỗ trợ: 3.000.000 VNĐ/tháng\n- Thời gian hỗ trợ: từ 01/09/2024 đến 15/12/2024\n\nĐIỀU 3: ĐIỀU KIỆN HỖ TRỢ\n- Tham gia đầy đủ các hoạt động thực tập\n- Nộp báo cáo định kỳ theo quy định\n- Có đánh giá tích cực từ doanh nghiệp\n\nĐIỀU 4: THANH TOÁN\n- Thanh toán theo tháng vào ngày 15 hàng tháng\n- Chuyển khoản vào tài khoản sinh viên đăng ký', 'HT_FPT_001_2024', '/contracts/HT_FPT_001_2024.pdf', 'SUPPORT', 'UIT - 27/08/2024', '2024-12-15', 'Hợp đồng đã được ký kết đầy đủ và đang thực hiện', '2024-09-15', 'PAID', 'Thanh toán hàng tháng vào ngày 15. Chuyển khoản qua tài khoản ngân hàng của sinh viên.', '2024-08-25', '2024-09-01', 'SIGNED', 'Nguyễn Minh Khoa - 25/08/2024', 3000000, 'TEMPLATE_SUPPORT_001', '1. Sinh viên cam kết hoàn thành đầy đủ chương trình thực tập\n2. Bảo mật thông tin của công ty\n3. Tuân thủ nội quy và quy định của công ty\n4. Công ty cam kết tạo điều kiện tốt nhất cho sinh viên học tập', 'Hợp đồng hỗ trợ thực tập sinh - Nguyễn Minh Khoa', 1, 1),
(2, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', '2024-08-20', 'APPROVED', 'TS. Nguyễn Văn A', 'FPT Corporation - 26/08/2024', 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nHỢP ĐỒNG HỖ TRỢ THỰC TẬP SINH\n\nBên A: Trường Đại học Công nghệ Thông tin\nBên B: Công ty Cổ phần FPT\nBên C: Sinh viên Trần Thị Lan - MSSV: 19520002\n\nVới mức hỗ trợ đặc biệt cho research project AI/ML: 3.500.000 VNĐ/tháng', 'HT_FPT_002_2024', '/contracts/HT_FPT_002_2024.pdf', 'SUPPORT', 'UIT - 27/08/2024', '2024-12-15', 'Hợp đồng có mức hỗ trợ cao do tham gia research project', '2024-09-15', 'PAID', 'Thanh toán hàng tháng vào ngày 15 với bonus cho research output.', '2024-08-25', '2024-09-01', 'SIGNED', 'Trần Thị Lan - 25/08/2024', 3500000, 'TEMPLATE_SUPPORT_001', 'Các điều khoản tương tự hợp đồng chuẩn với bổ sung về intellectual property cho research project', 'Hợp đồng hỗ trợ thực tập sinh - Trần Thị Lan', 1, 2),
(3, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', '2024-08-25', 'APPROVED', 'ThS. Trần Thị B', 'VNG Corporation - 29/08/2024', 'Hợp đồng hỗ trợ thực tập sinh tại VNG Corporation với focus vào frontend development', 'HT_VNG_001_2024', '/contracts/HT_VNG_001_2024.pdf', 'SUPPORT', 'UIT - 30/08/2024', '2024-12-15', 'Hợp đồng thực hiện tốt, payment on schedule', '2024-09-15', 'PAID', 'Monthly payment với game credits bonus', '2024-08-28', '2024-09-01', 'ACTIVE', 'Lê Văn Hùng - 28/08/2024', 3200000, 'TEMPLATE_SUPPORT_001', 'Điều khoản bảo mật đặc biệt về game content và user data', 'Hợp đồng hỗ trợ thực tập sinh - Lê Văn Hùng', 2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `evaluations`
--

CREATE TABLE `evaluations` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `attitude_score` double DEFAULT NULL,
  `comments` text COLLATE utf8mb4_general_ci,
  `communication_score` double DEFAULT NULL,
  `evaluation_date` date DEFAULT NULL,
  `evaluator_type` enum('DEPARTMENT','TEACHER','STUDENT','MENTOR') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_final_evaluation` bit(1) DEFAULT NULL,
  `overall_score` double DEFAULT NULL,
  `recommendations` text COLLATE utf8mb4_general_ci,
  `soft_skill_score` double DEFAULT NULL,
  `strengths` text COLLATE utf8mb4_general_ci,
  `technical_score` double DEFAULT NULL,
  `weaknesses` text COLLATE utf8mb4_general_ci,
  `evaluator_id` bigint DEFAULT NULL,
  `internship_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `evaluations`
--

INSERT INTO `evaluations` (`id`, `created_at`, `updated_at`, `attitude_score`, `comments`, `communication_score`, `evaluation_date`, `evaluator_type`, `is_final_evaluation`, `overall_score`, `recommendations`, `soft_skill_score`, `strengths`, `technical_score`, `weaknesses`, `evaluator_id`, `internship_id`) VALUES
(1, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 9, 'Sinh viên có tiến bộ rõ rệt trong suốt quá trình thực tập', 8.5, '2024-10-15', 'TEACHER', b'0', 8.5, 'Nên tham gia thêm các project complex để nâng cao kinh nghiệm', 8, 'Kỹ năng lập trình Java tốt, hiểu sâu về Spring Boot, có thái độ học hỏi tích cực', 8.5, 'Cần cải thiện kỹ năng debug và performance tuning', 3, 1),
(2, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 9, 'Rất hài lòng với performance của intern', 8, '2024-10-15', 'MENTOR', b'0', 8.3, 'Khuyến khích tham gia code review nhiều hơn và học thêm về testing', 8.5, 'Code quality tốt, follow coding standards nghiêm túc, teamwork skills tốt', 8, 'Thời gian estimate task chưa chính xác, cần cải thiện time management', 15, 1),
(3, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 9, 'Sinh viên có potential cao trong lĩnh vực AI', 8.5, '2024-10-15', 'TEACHER', b'0', 8.8, 'Nên tìm hiểu thêm về MLOps và model monitoring', 8.5, 'Kiến thức AI/ML vững chắc, có khả năng research tốt, presentation skills ấn tượng', 9, 'Cần cải thiện deployment skills và production mindset', 3, 2),
(4, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 8.5, 'Một trong những intern xuất sắc nhất năm', 8.5, '2024-10-15', 'MENTOR', b'0', 8.6, 'Recommend full-time offer sau khi tốt nghiệp', 8, 'Algorithm thinking mạnh, code Python clean và efficient', 9, 'Cần học thêm về software engineering best practices', 16, 2);

-- --------------------------------------------------------

--
-- Table structure for table `internships`
--

CREATE TABLE `internships` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `benefits` text COLLATE utf8mb4_general_ci,
  `end_date` date DEFAULT NULL,
  `final_score` double DEFAULT NULL,
  `internship_code` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `job_description` text COLLATE utf8mb4_general_ci,
  `job_title` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mentor_comment` text COLLATE utf8mb4_general_ci,
  `mentor_score` double DEFAULT NULL,
  `notes` text COLLATE utf8mb4_general_ci,
  `requirements` text COLLATE utf8mb4_general_ci,
  `salary` double DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','ASSIGNED','IN_PROGRESS','COMPLETED','CANCELLED') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `teacher_comment` text COLLATE utf8mb4_general_ci,
  `teacher_score` double DEFAULT NULL,
  `working_hours_per_week` int DEFAULT NULL,
  `company_id` bigint DEFAULT NULL,
  `batch_id` bigint DEFAULT NULL,
  `mentor_id` bigint DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  `teacher_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `internships`
--

INSERT INTO `internships` (`id`, `created_at`, `updated_at`, `benefits`, `end_date`, `final_score`, `internship_code`, `job_description`, `job_title`, `mentor_comment`, `mentor_score`, `notes`, `requirements`, `salary`, `start_date`, `status`, `teacher_comment`, `teacher_score`, `working_hours_per_week`, `company_id`, `batch_id`, `mentor_id`, `student_id`, `teacher_id`) VALUES
(1, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'Hỗ trợ ăn trưa, xe đưa đón, bảo hiểm y tế', '2024-12-15', 8.5, 'INT_FPT_001', 'Phát triển các API REST sử dụng Spring Boot, tham gia vào dự án thực tế của công ty, học hỏi về kiến trúc microservices và best practices trong phát triển phần mềm.', 'Java Backend Developer Intern', 'Thái độ làm việc tích cực, code clean và có tư duy tốt', 8.3, 'Sinh viên phù hợp với môi trường làm việc chuyên nghiệp', 'Kiến thức cơ bản về Java, OOP, SQL. Có thể làm việc nhóm và ham học hỏi.', 3000000, '2024-09-01', 'IN_PROGRESS', 'Sinh viên có tiến bộ tốt, hiểu biết sâu về Spring Boot', 8.7, 40, 1, 1, 1, 1, 1),
(2, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'Hỗ trợ ăn trưa, xe đưa đón, khóa học AI online', '2024-12-15', 8.8, 'INT_FPT_002', 'Nghiên cứu và phát triển các mô hình machine learning, xử lý dữ liệu lớn, tham gia dự án AI chatbot cho khách hàng doanh nghiệp.', 'AI/ML Research Intern', 'Có khả năng research tốt và tư duy logic mạnh', 8.6, 'Tiềm năng để trở thành AI Engineer trong tương lai', 'Kiến thức về Python, toán học, thống kê. Có kinh nghiệm với thư viện ML như scikit-learn, pandas.', 3500000, '2024-09-01', 'IN_PROGRESS', 'Sinh viên có năng lực xuất sắc trong AI/ML', 9, 40, 1, 1, 2, 1, 1),
(3, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'Lunch allowance, game credits, team building', '2024-12-15', 8.2, 'INT_VNG_001', 'Phát triển giao diện web cho game portal, sử dụng ReactJS và modern frontend technologies. Tham gia vào team phát triển game web.', 'Frontend Developer Intern', 'Code quality tốt, responsive design skills cần trau dồi', 8.4, 'Có tiềm năng phát triển thành full-stack developer', 'Kiến thức HTML, CSS, JavaScript. Có kinh nghiệm với ReactJS hoặc Vue.js là một lợi thế.', 3200000, '2024-09-01', 'IN_PROGRESS', 'Kỹ năng frontend tốt, cần cải thiện về UX/UI', 8, 40, 2, 1, 3, 3, 2),
(4, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'Health insurance, English class, certification support', '2024-12-15', 8.6, 'INT_TMA_001', 'Phát triển ứng dụng enterprise sử dụng .NET Core, Entity Framework, và Azure cloud services. Tham gia dự án outsourcing cho khách hàng quốc tế.', '.NET Developer Intern', 'Delivery đúng deadline, quality code cao', 8.7, 'Phù hợp với môi trường outsourcing quốc tế', 'Kiến thức C#, OOP, SQL Server. Tiếng Anh giao tiếp cơ bản.', 3300000, '2024-09-01', 'IN_PROGRESS', 'Kỹ năng .NET vững chắc, giao tiếp tiếng Anh tốt', 8.5, 40, 3, 1, 4, 4, 3),
(5, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'Meal allowance, lab access, research publication opportunity', '2024-12-15', 8, 'INT_STU_001', 'Nghiên cứu và phát triển các giải pháp IoT cho smart campus, lập trình embedded systems, phát triển mobile app điều khiển thiết bị IoT.', 'IoT Research Assistant', 'Tính sáng tạo cao, giải quyết vấn đề tốt', 8.2, 'Tiềm năng theo hướng nghiên cứu và phát triển sản phẩm', 'Kiến thức về lập trình C/C++, Arduino/Raspberry Pi. Có kinh nghiệm với mobile development là lợi thế.', 2800000, '2024-09-01', 'IN_PROGRESS', 'Có năng lực research, cần cải thiện kỹ năng thuyết trình', 7.8, 35, 4, 1, 5, 5, 2),
(6, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'Security training, certification sponsorship, health insurance', '2024-12-15', 8.7, 'INT_BKAV_001', 'Tham gia team phát triển các công cụ bảo mật, thực hiện penetration testing, nghiên cứu các lỗ hổng bảo mật mới và phát triển giải pháp phòng chống.', 'Cybersecurity Intern', 'Kỹ năng penetration testing xuất sắc', 8.5, 'Có tiềm năng trở thành security expert', 'Kiến thức về network security, ethical hacking. Có certificate về cybersecurity là lợi thế.', 3400000, '2024-09-01', 'IN_PROGRESS', 'Kiến thức security vững, có tư duy phân tích tốt', 8.9, 40, 5, 1, 6, 6, 4),
(9, '2025-08-06 04:49:52.292077', '2025-08-06 04:50:12.211620', 'sdfsdfsdf', '2025-09-06', NULL, 'INT1754455792289', 'sd sdc', 'dfdsfsdf', NULL, NULL, '', 'sdfsdffs', 3334, '2025-08-17', 'ASSIGNED', NULL, NULL, 40, 2, NULL, 5, 5, 4);

-- --------------------------------------------------------

--
-- Table structure for table `internship_batches`
--

CREATE TABLE `internship_batches` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `academic_year` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `batch_code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `batch_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `end_date` date DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `max_students` int DEFAULT NULL,
  `registration_end_date` date DEFAULT NULL,
  `registration_start_date` date DEFAULT NULL,
  `semester` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `internship_batches`
--

INSERT INTO `internship_batches` (`id`, `created_at`, `updated_at`, `academic_year`, `batch_code`, `batch_name`, `description`, `end_date`, `is_active`, `max_students`, `registration_end_date`, `registration_start_date`, `semester`, `start_date`) VALUES
(1, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', '2024-2025', 'TT_HK1_2024', 'Thực tập Học kỳ 1 năm học 2024-2025', 'Đợt thực tập chính thức cho sinh viên năm cuối trong học kỳ 1 năm học 2024-2025', '2024-12-15', b'1', 200, '2024-08-15', '2024-06-01', 'Học kỳ 1', '2024-09-01'),
(2, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', '2024', 'TT_HE_2024', 'Thực tập Hè 2024', 'Đợt thực tập hè cho sinh viên muốn tích lũy kinh nghiệm sớm', '2024-08-30', b'1', 150, '2024-05-31', '2024-04-01', 'Hè', '2024-06-15'),
(3, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', '2023-2024', 'TT_HK2_2023', 'Thực tập Học kỳ 2 năm học 2023-2024', 'Đợt thực tập học kỳ 2 vừa kết thúc', '2024-05-31', b'0', 180, '2024-01-15', '2023-12-01', 'Học kỳ 2', '2024-02-01');

-- --------------------------------------------------------

--
-- Table structure for table `internship_progress`
--

CREATE TABLE `internship_progress` (
  `id` bigint NOT NULL,
  `achievements` text COLLATE utf8mb4_general_ci,
  `challenges` text COLLATE utf8mb4_general_ci,
  `completed_tasks` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `current_week` int NOT NULL,
  `mentor_feedback` text COLLATE utf8mb4_general_ci,
  `overall_progress` double DEFAULT NULL,
  `student_reflection` text COLLATE utf8mb4_general_ci,
  `total_tasks` int DEFAULT NULL,
  `total_weeks` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `week_end_date` date DEFAULT NULL,
  `week_start_date` date DEFAULT NULL,
  `weekly_goals` text COLLATE utf8mb4_general_ci,
  `internship_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `internship_progress`
--

INSERT INTO `internship_progress` (`id`, `achievements`, `challenges`, `completed_tasks`, `created_at`, `current_week`, `mentor_feedback`, `overall_progress`, `student_reflection`, `total_tasks`, `total_weeks`, `updated_at`, `week_end_date`, `week_start_date`, `weekly_goals`, `internship_id`) VALUES
(1, 'Hoàn thành setup environment thành công, hiểu được project structure', 'Gặp khó khăn ban đầu với Spring Boot configuration', 1, '2025-08-06 11:36:18.000000', 1, 'Student shows good technical aptitude, quick learner', 25, 'Môi trường FPT rất chuyên nghiệp, mentor support tốt', 4, 16, '2025-08-06 11:36:18.000000', '2024-09-07', '2024-09-01', 'Setup development environment và làm quen với codebase hiện tại', 1),
(2, 'Successfully implemented registration endpoint với proper validation', 'Password encryption và email verification integration', 2, '2025-08-06 11:36:18.000000', 2, 'Good progress, code quality improving', 50, 'Hiểu rõ hơn về REST API design patterns', 4, 16, '2025-08-06 11:36:18.000000', '2024-09-14', '2024-09-08', 'Hoàn thành User Registration API với validation', 1),
(3, 'Setup JWT library và understand token-based auth flow', 'Token refresh mechanism và security best practices', 2, '2025-08-06 11:36:18.000000', 3, 'On track with timeline, good problem-solving skills', 62.5, 'JWT concept khá phức tạp nhưng thú vị', 4, 16, '2025-08-06 11:36:18.000000', '2024-09-21', '2024-09-15', 'Bắt đầu implement JWT authentication system', 1),
(4, 'Successfully processed 10K+ chat logs, clean dataset ready', 'Data quality issues và text normalization challenges', 1, '2025-08-06 11:36:18.000000', 1, 'Excellent data science skills, thorough preprocessing', 33.3, 'Học được nhiều về NLP preprocessing techniques', 3, 16, '2025-08-06 11:36:18.000000', '2024-09-07', '2024-09-01', 'Data collection và preprocessing cho chatbot project', 2),
(5, 'BERT model achieving 92% accuracy on intent classification', 'Overfitting issues và computational resource management', 1, '2025-08-06 11:36:18.000000', 2, 'Outstanding ML engineering skills, good experimentation', 50, 'Hiểu sâu hơn về transformer models và fine-tuning', 3, 16, '2025-08-06 11:36:18.000000', '2024-09-14', '2024-09-08', 'Model training và hyperparameter tuning', 2),
(6, 'Homepage component hoàn thành với responsive design', 'CSS styling và component architecture decisions', 1, '2025-08-06 11:36:18.000000', 1, 'Good React knowledge, clean component structure', 33.3, 'VNG culture rất dynamic, team work tốt', 3, 16, '2025-08-06 11:36:18.000000', '2024-09-07', '2024-09-01', 'Setup React environment và implement homepage', 3),
(7, 'Game carousel working smoothly, user dashboard implemented', 'State management complexity và API integration', 2, '2025-08-06 11:36:18.000000', 2, 'UI skills improving rapidly, good attention to detail', 66.7, 'Học được nhiều về modern React patterns', 3, 16, '2025-08-06 11:36:18.000000', '2024-09-14', '2024-09-08', 'Hoàn thiện homepage và bắt đầu authentication', 3);

-- --------------------------------------------------------

--
-- Table structure for table `mentors`
--

CREATE TABLE `mentors` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `department` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `expertise_level` enum('JUNIOR','INTERMEDIATE','SENIOR','EXPERT','LEAD') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `office_location` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `specialization` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `years_of_experience` int DEFAULT NULL,
  `company_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mentors`
--

INSERT INTO `mentors` (`id`, `created_at`, `updated_at`, `department`, `expertise_level`, `office_location`, `position`, `specialization`, `years_of_experience`, `company_id`, `user_id`) VALUES
(1, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'Software Development', 'SENIOR', 'Tầng 15, Tòa nhà FPT', 'Senior Software Engineer', 'Java, Spring Boot, Microservices', 8, 1, 15),
(2, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'AI/ML Department', 'EXPERT', 'Tầng 12, Tòa nhà FPT', 'Technical Lead', 'Machine Learning, Python, TensorFlow', 10, 1, 16),
(3, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'Game Development', 'SENIOR', 'Tầng 8, VNG Campus', 'Frontend Lead', 'ReactJS, Unity, Game Development', 7, 2, 17),
(4, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'Enterprise Solutions', 'EXPERT', 'Tầng 5, TMA Tower', 'Solution Architect', '.NET, Azure, System Design', 12, 3, 18),
(5, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'R&D Department', 'SENIOR', 'Phòng Lab 301', 'Research Manager', 'IoT, Embedded Systems, Research', 6, 4, 19),
(6, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'Cybersecurity', 'EXPERT', 'Tầng 3, BKAV Building', 'Security Specialist', 'Network Security, Penetration Testing', 9, 5, 20);

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `achievements` text COLLATE utf8mb4_general_ci,
  `approved_at` date DEFAULT NULL,
  `challenges` text COLLATE utf8mb4_general_ci,
  `content` text COLLATE utf8mb4_general_ci,
  `feedback` text COLLATE utf8mb4_general_ci,
  `grade` double DEFAULT NULL,
  `is_approved_by_mentor` bit(1) DEFAULT NULL,
  `is_approved_by_teacher` bit(1) DEFAULT NULL,
  `mentor_comment` text COLLATE utf8mb4_general_ci,
  `mentor_score` double DEFAULT NULL,
  `next_week_plan` text COLLATE utf8mb4_general_ci,
  `notes` text COLLATE utf8mb4_general_ci,
  `report_date` date DEFAULT NULL,
  `report_period` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reviewed_at` datetime(6) DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','DRAFT') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `submitted_at` datetime(6) DEFAULT NULL,
  `teacher_comment` text COLLATE utf8mb4_general_ci,
  `teacher_score` double DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('WEEKLY','MONTHLY','FINAL') COLLATE utf8mb4_general_ci NOT NULL,
  `week_number` int DEFAULT NULL,
  `internship_id` bigint NOT NULL,
  `reviewer_id` bigint DEFAULT NULL,
  `student_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `created_at`, `updated_at`, `achievements`, `approved_at`, `challenges`, `content`, `feedback`, `grade`, `is_approved_by_mentor`, `is_approved_by_teacher`, `mentor_comment`, `mentor_score`, `next_week_plan`, `notes`, `report_date`, `report_period`, `reviewed_at`, `status`, `submitted_at`, `teacher_comment`, `teacher_score`, `title`, `type`, `week_number`, `internship_id`, `reviewer_id`, `student_id`) VALUES
(1, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, NULL, NULL, 'Tuần đầu tiên tại FPT, em đã được orientation về quy trình làm việc, coding standards và tools sử dụng. Em đã setup development environment và làm quen với codebase hiện tại. Mentor hướng dẫn em về Spring Boot architecture và database design patterns.', NULL, 8.5, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-07', 'Tuần 1 (01/09 - 07/09/2024)', '2024-09-08 09:15:00.000000', 'APPROVED', '2024-09-07 17:30:00.000000', NULL, NULL, 'Báo cáo tuần 1 - Làm quen môi trường làm việc', 'WEEKLY', 1, 1, 1, 1),
(2, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, NULL, NULL, 'Tuần này em đã bắt đầu phát triển module User Management API. Em học được cách implement authentication với JWT, validation với Bean Validation và error handling. Gặp khó khăn trong việc hiểu về dependency injection nhưng đã được mentor giải đáp.', NULL, 8.7, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-14', 'Tuần 2 (08/09 - 14/09/2024)', '2024-09-15 08:30:00.000000', 'APPROVED', '2024-09-14 17:00:00.000000', NULL, NULL, 'Báo cáo tuần 2 - Phát triển REST API đầu tiên', 'WEEKLY', 2, 1, 1, 1),
(3, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, NULL, NULL, 'Em bắt đầu nghiên cứu về Natural Language Processing cho chatbot project. Đã tìm hiểu về BERT, GPT models và các preprocessing techniques. Setup Jupyter notebook environment và làm quen với dataset của công ty.', NULL, 9, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-07', 'Tuần 1 (01/09 - 07/09/2024)', '2024-09-08 10:00:00.000000', 'APPROVED', '2024-09-07 18:00:00.000000', NULL, NULL, 'Báo cáo tuần 1 - Nghiên cứu ML Models', 'WEEKLY', 1, 2, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `report_attachments`
--

CREATE TABLE `report_attachments` (
  `report_id` bigint NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `academic_year` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `class_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gpa` double DEFAULT NULL,
  `major` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parent_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parent_phone` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','GRADUATED','SUSPENDED') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `created_at`, `updated_at`, `academic_year`, `address`, `class_name`, `date_of_birth`, `gpa`, `major`, `parent_name`, `parent_phone`, `status`, `student_code`, `user_id`) VALUES
(1, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', '2019-2023', '123 Nguyễn Văn Cừ, Q.5, TP.HCM', 'CNTT-K19', '2001-03-15', 3.75, 'Công nghệ Thông tin', 'Nguyễn Văn Hải', '0908123456', 'ACTIVE', '19520001', 7),
(2, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', '2019-2023', '456 Lê Lợi, Q.1, TP.HCM', 'CNTT-K19', '2001-07-22', 3.82, 'Công nghệ Thông tin', 'Trần Minh Tâm', '0908123457', 'ACTIVE', '19520002', 8),
(3, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', '2019-2023', '789 Nguyễn Huệ, Q.1, TP.HCM', 'KTPM-K19', '2001-12-08', 3.65, 'Kỹ thuật Phần mềm', 'Lê Thị Nga', '0908123458', 'ACTIVE', '19520003', 9),
(4, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', '2019-2023', '321 Võ Văn Tần, Q.3, TP.HCM', 'KTPM-K19', '2001-05-10', 3.9, 'Kỹ thuật Phần mềm', 'Phạm Văn Bình', '0908123459', 'ACTIVE', '19520004', 10),
(5, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', '2019-2023', '654 Trần Hưng Đạo, Q.1, TP.HCM', 'CNTT-K19', '2001-09-18', 3.55, 'Công nghệ Thông tin', 'Hoàng Thị Lan', '0908123460', 'ACTIVE', '19520005', 11),
(6, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', '2019-2023', '987 Nguyễn Thị Minh Khai, Q.3, TP.HCM', 'ATTT-K19', '2001-11-25', 3.7, 'An toàn Thông tin', 'Đỗ Văn Cường', '0908123461', 'ACTIVE', '19520006', 12);

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` bigint NOT NULL,
  `actual_hours` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `due_date` date DEFAULT NULL,
  `estimated_hours` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_general_ci,
  `priority` enum('LOW','MEDIUM','HIGH','URGENT') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('PENDING','IN_PROGRESS','COMPLETED','CANCELLED','OVERDUE') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `internship_id` bigint NOT NULL,
  `mentor_id` bigint DEFAULT NULL,
  `student_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `actual_hours`, `created_at`, `description`, `due_date`, `estimated_hours`, `notes`, `priority`, `status`, `title`, `updated_at`, `internship_id`, `mentor_id`, `student_id`) VALUES
(1, 6, '2025-08-06 11:36:18.000000', 'Cài đặt và cấu hình môi trường phát triển: JDK 17, IntelliJ IDEA, MySQL, Postman, Git. Clone và setup project từ company repository.', '2024-09-03', 8, 'Completed ahead of schedule, good technical setup skills', 'HIGH', 'COMPLETED', 'Setup Development Environment', '2025-08-06 11:36:18.000000', 1, 1, 1),
(2, 18, '2025-08-06 11:36:18.000000', 'Phát triển REST API cho đăng ký người dùng với validation, password encryption, và email verification.', '2024-09-10', 16, 'Good implementation, minor feedback on validation messages', 'HIGH', 'COMPLETED', 'Implement User Registration API', '2025-08-06 11:36:18.000000', 1, 1, 1),
(3, 15, '2025-08-06 11:36:18.000000', 'Implement JWT-based authentication system với login/logout functionality và middleware protection.', '2024-09-20', 20, 'Currently working on token refresh mechanism', 'HIGH', 'IN_PROGRESS', 'Add JWT Authentication', '2025-08-06 11:36:18.000000', 1, 1, 1),
(4, NULL, '2025-08-06 11:36:18.000000', 'Viết unit tests cho User service với coverage >= 80% sử dụng JUnit và Mockito.', '2024-09-25', 12, 'Waiting for JWT implementation completion', 'MEDIUM', 'PENDING', 'Write Unit Tests', '2025-08-06 11:36:18.000000', 1, 1, 1),
(5, 22, '2025-08-06 11:36:18.000000', 'Thu thập và tiền xử lý dữ liệu chat logs cho chatbot training. Clean data và prepare training dataset.', '2024-09-08', 24, 'Excellent data quality, good preprocessing pipeline', 'HIGH', 'COMPLETED', 'Data Collection and Preprocessing', '2025-08-06 11:36:18.000000', 2, 2, 2),
(6, 28, '2025-08-06 11:36:18.000000', 'Training mô hình phân loại intent sử dụng BERT model với dataset đã chuẩn bị.', '2024-09-18', 32, 'Model accuracy reached 92%, fine-tuning hyperparameters', 'HIGH', 'IN_PROGRESS', 'Train Intent Classification Model', '2025-08-06 11:36:18.000000', 2, 2, 2),
(7, NULL, '2025-08-06 11:36:18.000000', 'Phát triển REST API cho chatbot service với real-time response và logging.', '2024-09-30', 20, 'Dependent on model training completion', 'HIGH', 'PENDING', 'Build Chatbot API', '2025-08-06 11:36:18.000000', 2, 2, 2),
(8, 4, '2025-08-06 11:36:18.000000', 'Cài đặt Node.js, npm, create-react-app, và các development tools. Setup ESLint và Prettier.', '2024-09-03', 6, 'Quick setup, familiar with React ecosystem', 'HIGH', 'COMPLETED', 'Setup React Development Environment', '2025-08-06 11:36:18.000000', 3, 3, 3),
(9, 26, '2025-08-06 11:36:18.000000', 'Phát triển trang chủ game portal với responsive design, game carousel, và user dashboard.', '2024-09-15', 24, 'Good UI implementation, minor responsiveness issues fixed', 'HIGH', 'COMPLETED', 'Implement Game Portal Homepage', '2025-08-06 11:36:18.000000', 3, 3, 3),
(10, 12, '2025-08-06 11:36:18.000000', 'Implement login/register pages với form validation và state management.', '2024-09-22', 16, 'Working on social login integration', 'HIGH', 'IN_PROGRESS', 'Add User Authentication Flow', '2025-08-06 11:36:18.000000', 3, 3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `degree` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `department` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `office_location` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `specialization` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `teacher_code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `created_at`, `updated_at`, `degree`, `department`, `office_location`, `position`, `specialization`, `teacher_code`, `user_id`) VALUES
(1, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'Tiến sĩ', 'Công nghệ Thông tin', 'Phòng 301, Tòa nhà B1', 'Giảng viên chính', 'Trí tuệ nhân tạo, Machine Learning', 'GV001', 3),
(2, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'Thạc sĩ', 'Kỹ thuật Phần mềm', 'Phòng 205, Tòa nhà B2', 'Giảng viên', 'Phát triển Web, Mobile App', 'GV002', 4),
(3, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'Tiến sĩ', 'Công nghệ Thông tin', 'Phòng 401, Tòa nhà B1', 'Phó Giáo sư', 'Cơ sở dữ liệu, Big Data', 'GV003', 5),
(4, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'Tiến sĩ', 'An toàn Thông tin', 'Phòng 302, Tòa nhà B3', 'Giảng viên chính', 'Mật mã học, Blockchain', 'GV004', 6);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `avatar_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` enum('DEPARTMENT','TEACHER','STUDENT','MENTOR') COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `created_at`, `updated_at`, `avatar_url`, `email`, `full_name`, `is_active`, `password`, `phone_number`, `role`, `username`) VALUES
(1, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, 'dept.cntt@uit.edu.vn', 'Bộ môn Công nghệ Thông tin', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0288123456', 'DEPARTMENT', 'dept_cntt'),
(2, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, 'dept.ktpm@uit.edu.vn', 'Bộ môn Kỹ thuật Phần mềm', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0288123457', 'DEPARTMENT', 'dept_ktpm'),
(3, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, 'nguyenvana@uit.edu.vn', 'TS. Nguyễn Văn A', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0901234567', 'TEACHER', 'gv_nguyen_van_a'),
(4, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, 'tranthib@uit.edu.vn', 'ThS. Trần Thị B', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0901234568', 'TEACHER', 'gv_tran_thi_b'),
(5, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, 'levanc@uit.edu.vn', 'PGS.TS. Lê Văn C', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0901234569', 'TEACHER', 'gv_le_van_c'),
(6, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, 'phamthid@uit.edu.vn', 'TS. Phạm Thị D', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0901234570', 'TEACHER', 'gv_pham_thi_d'),
(7, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, '19520001@gm.uit.edu.vn', 'Nguyễn Minh Khoa', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0987654321', 'STUDENT', 'sv_19520001'),
(8, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, '19520002@gm.uit.edu.vn', 'Trần Thị Lan', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0987654322', 'STUDENT', 'sv_19520002'),
(9, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, '19520003@gm.uit.edu.vn', 'Lê Văn Hùng', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0987654323', 'STUDENT', 'sv_19520003'),
(10, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, '19520004@gm.uit.edu.vn', 'Phạm Thị Mai', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0987654324', 'STUDENT', 'sv_19520004'),
(11, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, '19520005@gm.uit.edu.vn', 'Hoàng Văn Nam', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0987654325', 'STUDENT', 'sv_19520005'),
(12, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, '19520006@gm.uit.edu.vn', 'Đỗ Thị Hoa', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0987654326', 'STUDENT', 'sv_19520006'),
(13, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, '19520007@gm.uit.edu.vn', 'Vũ Minh Tuấn', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0987654327', 'STUDENT', 'sv_19520007'),
(14, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, '19520008@gm.uit.edu.vn', 'Bùi Thị Thủy', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0987654328', 'STUDENT', 'sv_19520008'),
(15, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, 'mentor1@fpt.com.vn', 'Nguyễn Thành Đạt', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0912345678', 'MENTOR', 'mentor_fpt_01'),
(16, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, 'mentor2@fpt.com.vn', 'Trần Minh Phong', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0912345679', 'MENTOR', 'mentor_fpt_02'),
(17, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, 'mentor1@vng.com.vn', 'Lê Thị Hương', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0912345680', 'MENTOR', 'mentor_vng_01'),
(18, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, 'mentor1@tma.com.vn', 'Phạm Văn Quang', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0912345681', 'MENTOR', 'mentor_tma_01'),
(19, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, 'mentor1@saigontech.edu.vn', 'Võ Thị Lan', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0912345682', 'MENTOR', 'mentor_saigontech_01'),
(20, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', NULL, 'mentor1@bkav.com.vn', 'Đặng Minh Tuấn', b'1', '$2a$10$MheeC.VK/PrOFFubmu0WrODYX4.N6FPmAXj/Gd9UBBp.8rxIsfWji', '0912345683', 'MENTOR', 'mentor_bkav_01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_6yrvsg7p3v2e969nfmvbo9440` (`company_code`);

--
-- Indexes for table `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_cumggxjbttojw3k8b7fgleib6` (`contract_code`),
  ADD UNIQUE KEY `UK_aikvlengwxmtpk4bvbrt96lqj` (`internship_id`),
  ADD KEY `FKfgism94uvtcnby5qcijqg4bxc` (`created_by_teacher_id`);

--
-- Indexes for table `evaluations`
--
ALTER TABLE `evaluations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKqihdmjba0yaamhjp8gr00c27m` (`evaluator_id`),
  ADD KEY `FK2fc43ekjt1e5s6qkiuafqwk2k` (`internship_id`);

--
-- Indexes for table `internships`
--
ALTER TABLE `internships`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_i2vf3chk4n9nrxrwokf7txjh3` (`internship_code`),
  ADD KEY `FKkw009ia6w9ui3095scywptogh` (`company_id`),
  ADD KEY `FKry0qawpn34wc9jr9rr11jrqy3` (`batch_id`),
  ADD KEY `FK4en3il97mei6smodq6l30urcp` (`mentor_id`),
  ADD KEY `FKkmqhv1l86m6qrqgfftoy92vy6` (`student_id`),
  ADD KEY `FKek638yl1pfnprhojyryxv6t8r` (`teacher_id`);

--
-- Indexes for table `internship_batches`
--
ALTER TABLE `internship_batches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_hmsciamj5gyk5j2a7px15aqct` (`batch_code`);

--
-- Indexes for table `internship_progress`
--
ALTER TABLE `internship_progress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKjvbapg7gtc1fylmfof14i9nm5` (`internship_id`);

--
-- Indexes for table `mentors`
--
ALTER TABLE `mentors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_3y0yv2cy2egy1bl908vqnnhrv` (`user_id`),
  ADD KEY `FK958wvri7w7mmggqu31crgs4s6` (`company_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKi2d2mcm36l0lc38er8prdprc3` (`internship_id`),
  ADD KEY `FKom5m7273evsulyrpuqv4d4vbx` (`reviewer_id`),
  ADD KEY `FKltpvf7j6lodaeqrm3skr8jjdf` (`student_id`);

--
-- Indexes for table `report_attachments`
--
ALTER TABLE `report_attachments`
  ADD KEY `FKjeh6rs623qjcauq87h2py3o06` (`report_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_cgcf3r5xk73o0etbduc1qxnol` (`student_code`),
  ADD UNIQUE KEY `UK_g4fwvutq09fjdlb4bb0byp7t` (`user_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK3iq0gxkfwgyxdmlukvibuuqs` (`internship_id`),
  ADD KEY `FKp4kdkxdtaonh23dg8dknssxop` (`mentor_id`),
  ADD KEY `FKq8i7qoh72db7rcn5wviu9xc9q` (`student_id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_98e7j8mw41re3p2mis5rr9608` (`teacher_code`),
  ADD UNIQUE KEY `UK_cd1k6xwg9jqtiwx9ybnxpmoh9` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`),
  ADD UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `contracts`
--
ALTER TABLE `contracts`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `evaluations`
--
ALTER TABLE `evaluations`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `internships`
--
ALTER TABLE `internships`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `internship_batches`
--
ALTER TABLE `internship_batches`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `internship_progress`
--
ALTER TABLE `internship_progress`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `mentors`
--
ALTER TABLE `mentors`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contracts`
--
ALTER TABLE `contracts`
  ADD CONSTRAINT `FK8dswea723fbvx7677hxhtdwnm` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`id`),
  ADD CONSTRAINT `FKfgism94uvtcnby5qcijqg4bxc` FOREIGN KEY (`created_by_teacher_id`) REFERENCES `teachers` (`id`);

--
-- Constraints for table `evaluations`
--
ALTER TABLE `evaluations`
  ADD CONSTRAINT `FK2fc43ekjt1e5s6qkiuafqwk2k` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`id`),
  ADD CONSTRAINT `FKqihdmjba0yaamhjp8gr00c27m` FOREIGN KEY (`evaluator_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `internships`
--
ALTER TABLE `internships`
  ADD CONSTRAINT `FK4en3il97mei6smodq6l30urcp` FOREIGN KEY (`mentor_id`) REFERENCES `mentors` (`id`),
  ADD CONSTRAINT `FKek638yl1pfnprhojyryxv6t8r` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `FKkmqhv1l86m6qrqgfftoy92vy6` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `FKkw009ia6w9ui3095scywptogh` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  ADD CONSTRAINT `FKry0qawpn34wc9jr9rr11jrqy3` FOREIGN KEY (`batch_id`) REFERENCES `internship_batches` (`id`);

--
-- Constraints for table `internship_progress`
--
ALTER TABLE `internship_progress`
  ADD CONSTRAINT `FKjvbapg7gtc1fylmfof14i9nm5` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`id`);

--
-- Constraints for table `mentors`
--
ALTER TABLE `mentors`
  ADD CONSTRAINT `FK958wvri7w7mmggqu31crgs4s6` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  ADD CONSTRAINT `FKmciiqqph74b3gqsw9615l9cwp` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `FKi2d2mcm36l0lc38er8prdprc3` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`id`),
  ADD CONSTRAINT `FKltpvf7j6lodaeqrm3skr8jjdf` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `FKom5m7273evsulyrpuqv4d4vbx` FOREIGN KEY (`reviewer_id`) REFERENCES `teachers` (`id`);

--
-- Constraints for table `report_attachments`
--
ALTER TABLE `report_attachments`
  ADD CONSTRAINT `FKjeh6rs623qjcauq87h2py3o06` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `FKdt1cjx5ve5bdabmuuf3ibrwaq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `FK3iq0gxkfwgyxdmlukvibuuqs` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`id`),
  ADD CONSTRAINT `FKp4kdkxdtaonh23dg8dknssxop` FOREIGN KEY (`mentor_id`) REFERENCES `mentors` (`id`),
  ADD CONSTRAINT `FKq8i7qoh72db7rcn5wviu9xc9q` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`);

--
-- Constraints for table `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `FKb8dct7w2j1vl1r2bpstw5isc0` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
