-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 29, 2025 at 12:18 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

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
  `abbreviated_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `company_size` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact_person` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact_phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact_position` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `industry` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `created_at`, `updated_at`, `abbreviated_name`, `address`, `company_code`, `company_name`, `company_size`, `company_type`, `contact_email`, `contact_person`, `contact_phone`, `contact_position`, `description`, `email`, `industry`, `is_active`, `phone_number`, `website`) VALUES
(1, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'FPT Corp', '17 Duy Tân, Cầu Giấy, Hà Nội', 'FPT001', 'Công ty Cổ phần FPT', '10000+', 'Cổ phần', 'hr@fpt.com.vn', 'Nguyễn Văn An', '024-7300-8867', 'Giám đốc Nhân sự', 'Tập đoàn công nghệ hàng đầu Việt Nam với các dịch vụ viễn thông, công nghệ thông tin và giáo dục.', 'contact@fpt.com.vn', 'Công nghệ thông tin', b'1', '024-7300-8866', 'https://fpt.com.vn'),
(2, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'VNG Corp', '182 Lê Đại Hành, Q.11, TP.HCM', 'VNG001', 'Công ty TNHH VNG', '1000-5000', 'TNHH', 'recruit@vng.com.vn', 'Trần Thị Bình', '028-6263-3664', 'Trưởng phòng Tuyển dụng', 'Công ty công nghệ hàng đầu Việt Nam chuyên phát triển game, mạng xã hội và thanh toán điện tử.', 'info@vng.com.vn', 'Game & Internet', b'1', '028-6263-3663', 'https://vng.com.vn'),
(3, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'TMA Solutions', '15 Đường D2, Quận Bình Thạnh, TP.HCM', 'TMA001', 'Công ty TNHH TMA Solutions', '5000-10000', 'TNHH', 'hr@tma.com.vn', 'Lê Minh Cường', '028-3512-7980', 'Giám đốc Nhân sự', 'Công ty phát triển phần mềm lớn nhất Việt Nam, chuyên outsourcing cho thị trường quốc tế.', 'contact@tma.com.vn', 'Phần mềm', b'1', '028-3512-7979', 'https://tmasolutions.com'),
(4, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'STU', '180 Cao Lỗ, Quận 8, TP.HCM', 'STU001', 'Trường Đại học Công nghệ Sài Gòn', '1000-5000', 'Giáo dục', 'cooperation@stu.edu.vn', 'Phạm Thị Dung', '028-5445-7778', 'Trưởng phòng Hợp tác Doanh nghiệp', 'Trường đại học tư thục chất lượng cao, chuyên đào tạo công nghệ thông tin và kỹ thuật.', 'info@stu.edu.vn', 'Giáo dục', b'1', '028-5445-7777', 'https://saigontech.edu.vn'),
(5, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', 'BKAV', '156 Nguyễn Đức Cảnh, Hoàng Mai, Hà Nội', 'BKAV001', 'Công ty An ninh mạng BKAV', '500-1000', 'Cổ phần', 'hr@bkav.com', 'Nguyễn Thái Sơn', '024-3640-2223', 'Giám đốc Phát triển', 'Công ty chuyên phát triển các sản phẩm an ninh mạng và phần mềm antivirus hàng đầu Việt Nam.', 'info@bkav.com', 'An ninh mạng', b'1', '024-3640-2222', 'https://bkav.com');

-- --------------------------------------------------------

--
-- Table structure for table `contracts`
--

CREATE TABLE `contracts` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `approval_date` date DEFAULT NULL,
  `approval_status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `approved_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_signature` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `contract_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contract_file_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contract_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `department_signature` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `payment_date` date DEFAULT NULL,
  `payment_status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_terms` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `signed_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `status` enum('DRAFT','PENDING','SENT','SIGNED','ACTIVE','PAID','REJECTED','EXPIRED','TERMINATED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_signature` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `support_amount` double DEFAULT NULL,
  `template_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `terms_and_conditions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_by_teacher_id` bigint DEFAULT NULL,
  `internship_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `evaluations`
--

CREATE TABLE `evaluations` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `attitude_score` double DEFAULT NULL,
  `comments` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `communication_score` double DEFAULT NULL,
  `evaluation_date` date DEFAULT NULL,
  `evaluator_type` enum('DEPARTMENT','TEACHER','STUDENT','MENTOR') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_final_evaluation` bit(1) DEFAULT NULL,
  `overall_score` double DEFAULT NULL,
  `recommendations` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `soft_skill_score` double DEFAULT NULL,
  `strengths` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `technical_score` double DEFAULT NULL,
  `weaknesses` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `evaluator_id` bigint DEFAULT NULL,
  `internship_id` bigint DEFAULT NULL,
  `communication_attitude` double DEFAULT NULL,
  `discipline_score` double DEFAULT NULL,
  `following_rules` double DEFAULT NULL,
  `initiative_creativity` double DEFAULT NULL,
  `job_requirements_fulfillment` double DEFAULT NULL,
  `learning_spirit` double DEFAULT NULL,
  `professional_score` double DEFAULT NULL,
  `property_protection` double DEFAULT NULL,
  `understanding_organization` double DEFAULT NULL,
  `work_enthusiasm` double DEFAULT NULL,
  `work_schedule_compliance` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `evaluations`
--

INSERT INTO `evaluations` (`id`, `created_at`, `updated_at`, `attitude_score`, `comments`, `communication_score`, `evaluation_date`, `evaluator_type`, `is_final_evaluation`, `overall_score`, `recommendations`, `soft_skill_score`, `strengths`, `technical_score`, `weaknesses`, `evaluator_id`, `internship_id`, `communication_attitude`, `discipline_score`, `following_rules`, `initiative_creativity`, `job_requirements_fulfillment`, `learning_spirit`, `professional_score`, `property_protection`, `understanding_organization`, `work_enthusiasm`, `work_schedule_compliance`) VALUES
(1, '2025-08-29 05:39:08.959618', '2025-08-29 05:39:08.959618', NULL, 'Toots', NULL, '2025-08-29', 'TEACHER', b'0', 8.4, NULL, NULL, '', NULL, '', 3, 2, 1, 5.7, 0.8, 0.7, 1, 1, 2.7, 1, 0.9, 1, 1),
(5, '2025-08-29 06:17:47.061360', '2025-08-29 06:18:30.306689', NULL, 'hoàn thành tốt nhiệm vụ được giao.', NULL, '2025-08-29', 'MENTOR', b'0', 8.7, 'hoàn thành tốt nhiệm vụ được giao.', NULL, 'hoàn thành tốt nhiệm vụ được giao.', NULL, 'hoàn thành tốt nhiệm vụ được giao.', 17, 2, 1, 5.7, 1, 1, 1, 1, 3, 0.7, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `internships`
--

CREATE TABLE `internships` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `benefits` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `end_date` date DEFAULT NULL,
  `final_score` double DEFAULT NULL,
  `internship_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `job_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `job_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mentor_comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `mentor_score` double DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `requirements` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `salary` double DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','ASSIGNED','IN_PROGRESS','COMPLETED','CANCELLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `teacher_comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
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
(1, '2025-08-29 03:35:13.367683', '2025-08-29 04:09:35.640772', 'Hỗ trợ ăn trưa, xe đưa đón, bảo hiểm y tế', '2025-07-20', NULL, 'INT1756438513343', 'Phát triển các API REST sử dụng Spring Boot, tham gia vào dự án thực tế của công ty, học hỏi về kiến trúc microservices và best practices trong phát triển phần mềm.', 'Java Backend Developer Intern', NULL, NULL, 'Sinh viên phù hợp với môi trường làm việc chuyên nghiệp', 'Kiến thức cơ bản về Java, OOP, SQL. Có thể làm việc nhóm và ham học hỏi.', 2500000, '2025-05-18', 'ASSIGNED', NULL, NULL, 40, 1, 1, 2, 1, 2),
(2, '2025-08-29 04:15:34.013995', '2025-08-29 05:40:11.447576', 'Lunch allowance, game credits, team building', '2025-07-20', NULL, 'INT1756440934012', 'Phát triển giao diện web cho game portal, sử dụng ReactJS và modern frontend technologies. Tham gia vào team phát triển game web.', 'Frontend Developer Intern', NULL, NULL, 'Có tiềm năng phát triển thành full-stack developer', 'Kiến thức HTML, CSS, JavaScript. Có kinh nghiệm với ReactJS hoặc Vue.js là một lợi thế.', 3000000, '2025-05-18', 'COMPLETED', NULL, NULL, 45, 2, 2, 3, 9, 1),
(10, '2025-08-29 06:37:08.491843', '2025-08-29 06:37:08.491843', 'Security training, certification sponsorship, health insurance', '2025-11-16', NULL, 'INT1756449428489', 'Tham gia team phát triển các công cụ bảo mật, thực hiện penetration testing, nghiên cứu các lỗ hổng bảo mật mới và phát triển giải pháp phòng chống.', 'Cybersecurity Intern 1', NULL, NULL, 'Có tiềm năng trở thành security expert', 'Kiến thức về network security, ethical hacking. Có certificate về cybersecurity là lợi thế.', 2800000, '2025-09-14', 'PENDING', NULL, NULL, 45, 5, 8, NULL, NULL, 2),
(11, '2025-08-29 06:37:09.241207', '2025-08-29 06:37:09.241207', 'Security training, certification sponsorship, health insurance', '2025-11-16', NULL, 'INT1756449429241', 'Tham gia team phát triển các công cụ bảo mật, thực hiện penetration testing, nghiên cứu các lỗ hổng bảo mật mới và phát triển giải pháp phòng chống.', 'Cybersecurity Intern 2', NULL, NULL, 'Có tiềm năng trở thành security expert', 'Kiến thức về network security, ethical hacking. Có certificate về cybersecurity là lợi thế.', 2800000, '2025-09-14', 'PENDING', NULL, NULL, 45, 5, 8, NULL, NULL, 2),
(12, '2025-08-29 06:37:10.203846', '2025-08-29 06:37:10.203846', 'Security training, certification sponsorship, health insurance', '2025-11-16', NULL, 'INT1756449430202', 'Tham gia team phát triển các công cụ bảo mật, thực hiện penetration testing, nghiên cứu các lỗ hổng bảo mật mới và phát triển giải pháp phòng chống.', 'Cybersecurity Intern 3', NULL, NULL, 'Có tiềm năng trở thành security expert', 'Kiến thức về network security, ethical hacking. Có certificate về cybersecurity là lợi thế.', 2800000, '2025-09-14', 'PENDING', NULL, NULL, 45, 5, 8, NULL, NULL, 2),
(13, '2025-08-29 06:37:10.807208', '2025-08-29 06:37:10.807208', 'Security training, certification sponsorship, health insurance', '2025-11-16', NULL, 'INT1756449430806', 'Tham gia team phát triển các công cụ bảo mật, thực hiện penetration testing, nghiên cứu các lỗ hổng bảo mật mới và phát triển giải pháp phòng chống.', 'Cybersecurity Intern 4', NULL, NULL, 'Có tiềm năng trở thành security expert', 'Kiến thức về network security, ethical hacking. Có certificate về cybersecurity là lợi thế.', 2800000, '2025-09-14', 'PENDING', NULL, NULL, 45, 5, 8, NULL, NULL, 2),
(14, '2025-08-29 06:37:11.407204', '2025-08-29 06:37:11.407204', 'Security training, certification sponsorship, health insurance', '2025-11-16', NULL, 'INT1756449431407', 'Tham gia team phát triển các công cụ bảo mật, thực hiện penetration testing, nghiên cứu các lỗ hổng bảo mật mới và phát triển giải pháp phòng chống.', 'Cybersecurity Intern 5', NULL, NULL, 'Có tiềm năng trở thành security expert', 'Kiến thức về network security, ethical hacking. Có certificate về cybersecurity là lợi thế.', 2800000, '2025-09-14', 'PENDING', NULL, NULL, 45, 5, 8, NULL, NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `internship_batches`
--

CREATE TABLE `internship_batches` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `academic_year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `batch_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `batch_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `end_date` date DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `max_students` int DEFAULT NULL,
  `registration_end_date` date DEFAULT NULL,
  `registration_start_date` date DEFAULT NULL,
  `semester` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `company_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `internship_batches`
--

INSERT INTO `internship_batches` (`id`, `created_at`, `updated_at`, `academic_year`, `batch_code`, `batch_name`, `description`, `end_date`, `is_active`, `max_students`, `registration_end_date`, `registration_start_date`, `semester`, `start_date`, `company_id`) VALUES
(1, '2025-08-29 03:27:25.300732', '2025-08-29 03:27:25.300732', '2024-2025', 'BATCH_1756438044906', 'TT_HK1_2025 - Công ty Cổ phần FPT', 'Đợt thực tập chính thức cho sinh viên năm cuối trong học kỳ 1 năm học 2024-2025', '2025-07-20', b'1', 100, '2025-05-16', '2025-04-30', 'SPRING', '2025-05-18', 1),
(2, '2025-08-29 03:27:25.605106', '2025-08-29 03:27:25.605106', '2024-2025', 'BATCH_1756438045530', 'TT_HK1_2025 - Công ty TNHH VNG', 'Đợt thực tập chính thức cho sinh viên năm cuối trong học kỳ 1 năm học 2024-2025', '2025-07-20', b'1', 50, '2025-05-16', '2025-04-30', 'SPRING', '2025-05-18', 2),
(6, '2025-08-29 03:31:44.632143', '2025-08-29 03:31:44.632143', '2024-2025', 'BATCH_1756438304496', 'TT_HK2_2025 - Công ty TNHH TMA Solutions', 'Đợt thực tập chính thức cho sinh viên năm cuối trong học kỳ 2 năm học 2024-2025', '2025-11-16', b'1', 30, '2025-09-07', '2025-08-24', 'FALL', '2025-09-14', 3),
(7, '2025-08-29 03:31:44.830936', '2025-08-29 03:31:44.830936', '2024-2025', 'BATCH_1756438304722', 'TT_HK2_2025 - Trường Đại học Công nghệ Sài Gòn', 'Đợt thực tập chính thức cho sinh viên năm cuối trong học kỳ 2 năm học 2024-2025', '2025-11-16', b'1', 45, '2025-09-07', '2025-08-24', 'FALL', '2025-09-14', 4),
(8, '2025-08-29 03:31:45.169943', '2025-08-29 03:31:45.169943', '2024-2025', 'BATCH_1756438305135', 'TT_HK2_2025 - Công ty An ninh mạng BKAV', 'Đợt thực tập chính thức cho sinh viên năm cuối trong học kỳ 2 năm học 2024-2025', '2025-11-16', b'1', 40, '2025-09-07', '2025-08-24', 'FALL', '2025-09-14', 5);

-- --------------------------------------------------------

--
-- Table structure for table `internship_progress`
--

CREATE TABLE `internship_progress` (
  `id` bigint NOT NULL,
  `achievements` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `challenges` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `completed_tasks` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `current_week` int NOT NULL,
  `mentor_feedback` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `overall_progress` double DEFAULT NULL,
  `student_reflection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `total_tasks` int DEFAULT NULL,
  `total_weeks` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `week_end_date` date DEFAULT NULL,
  `week_start_date` date DEFAULT NULL,
  `weekly_goals` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `internship_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mentors`
--

CREATE TABLE `mentors` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `expertise_level` enum('JUNIOR','INTERMEDIATE','SENIOR','EXPERT','LEAD') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `office_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `specialization` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
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
  `achievements` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `approved_at` date DEFAULT NULL,
  `challenges` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `feedback` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `grade` double DEFAULT NULL,
  `is_approved_by_mentor` bit(1) DEFAULT NULL,
  `is_approved_by_teacher` bit(1) DEFAULT NULL,
  `mentor_comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `mentor_score` double DEFAULT NULL,
  `next_week_plan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `report_date` date DEFAULT NULL,
  `report_period` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reviewed_at` datetime(6) DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','DRAFT') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `submitted_at` datetime(6) DEFAULT NULL,
  `teacher_comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `teacher_score` double DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('WEEKLY','MONTHLY','FINAL') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `week_number` int DEFAULT NULL,
  `internship_id` bigint NOT NULL,
  `reviewer_id` bigint DEFAULT NULL,
  `student_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `created_at`, `updated_at`, `achievements`, `approved_at`, `challenges`, `content`, `feedback`, `grade`, `is_approved_by_mentor`, `is_approved_by_teacher`, `mentor_comment`, `mentor_score`, `next_week_plan`, `notes`, `report_date`, `report_period`, `reviewed_at`, `status`, `submitted_at`, `teacher_comment`, `teacher_score`, `title`, `type`, `week_number`, `internship_id`, `reviewer_id`, `student_id`) VALUES
(1, '2025-08-29 05:36:56.207003', '2025-08-29 05:37:33.468929', NULL, NULL, NULL, 'Tuần đầu tiên tại FPT, em đã được orientation về quy trình làm việc, coding standards và tools sử dụng. Em đã setup development environment và làm quen với codebase hiện tại. Mentor hướng dẫn em về Spring Boot architecture và database design patterns.', NULL, NULL, b'0', b'1', NULL, NULL, NULL, NULL, '2025-08-29', '21/05/2025 - 28/05/2025', '2025-08-28 22:37:33.226000', 'APPROVED', '2025-08-29 05:36:55.773711', '', 8, 'Báo cáo tuần 1 - làm quen môi trường', 'WEEKLY', 1, 2, NULL, 9);

-- --------------------------------------------------------

--
-- Table structure for table `report_attachments`
--

CREATE TABLE `report_attachments` (
  `report_id` bigint NOT NULL,
  `file_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `academic_year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `class_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gpa` double DEFAULT NULL,
  `major` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parent_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parent_phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','GRADUATED','SUSPENDED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `created_at`, `updated_at`, `academic_year`, `address`, `class_name`, `date_of_birth`, `gpa`, `major`, `parent_name`, `parent_phone`, `status`, `student_code`, `user_id`) VALUES
(1, '2025-08-06 11:36:18.000000', '2025-08-20 10:01:47.621118', '2019-2023', NULL, 'CNTT-K19', NULL, 3.8, 'Công nghệ Thông tin', NULL, NULL, 'ACTIVE', '19520001', 7),
(2, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', '2019-2023', '456 Lê Lợi, Q.1, TP.HCM', 'CNTT-K19', '2001-07-22', 3.82, 'Công nghệ Thông tin', 'Trần Minh Tâm', '0908123457', 'ACTIVE', '19520002', 8),
(3, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', '2019-2023', '789 Nguyễn Huệ, Q.1, TP.HCM', 'KTPM-K19', '2001-12-08', 3.65, 'Kỹ thuật Phần mềm', 'Lê Thị Nga', '0908123458', 'ACTIVE', '19520003', 9),
(4, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', '2019-2023', '321 Võ Văn Tần, Q.3, TP.HCM', 'KTPM-K19', '2001-05-10', 3.9, 'Kỹ thuật Phần mềm', 'Phạm Văn Bình', '0908123459', 'ACTIVE', '19520004', 10),
(5, '2025-08-06 11:36:18.000000', '2025-08-06 11:36:18.000000', '2019-2023', '654 Trần Hưng Đạo, Q.1, TP.HCM', 'CNTT-K19', '2001-09-18', 3.55, 'Công nghệ Thông tin', 'Hoàng Thị Lan', '0908123460', 'ACTIVE', '19520005', 11),
(6, '2025-08-06 11:36:18.000000', '2025-08-29 03:14:22.463396', '2019-2023', NULL, 'ATTT-K19', NULL, 3.7, 'An toàn Thông tin', NULL, NULL, 'ACTIVE', '19520006', 12),
(9, '2025-08-29 04:11:40.231300', '2025-08-29 05:40:11.294205', '2024-2025', NULL, 'ATTT-K19', NULL, 3.09, 'An toàn Thông tin', NULL, NULL, 'ACTIVE', 'sv_19520007', 13);

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` bigint NOT NULL,
  `actual_hours` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `due_date` date DEFAULT NULL,
  `estimated_hours` int DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `priority` enum('LOW','MEDIUM','HIGH','URGENT') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('PENDING','IN_PROGRESS','COMPLETED','CANCELLED','OVERDUE') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `internship_id` bigint NOT NULL,
  `mentor_id` bigint DEFAULT NULL,
  `student_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `actual_hours`, `created_at`, `description`, `due_date`, `estimated_hours`, `notes`, `priority`, `status`, `title`, `updated_at`, `internship_id`, `mentor_id`, `student_id`) VALUES
(1, NULL, '2025-08-29 05:05:31.472598', 'Tìm hiểu văn hóa làm việc của công ty và giờ giấc hoạt động trong ngày và trong tuần', '2025-05-26', 40, NULL, 'HIGH', 'COMPLETED', 'Tìm hiểu văn hóa công ty', '2025-08-29 05:06:07.046986', 2, 3, 9);

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `degree` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `office_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `specialization` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `teacher_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
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
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` enum('DEPARTMENT','TEACHER','STUDENT','MENTOR') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
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
  ADD UNIQUE KEY `UK_hmsciamj5gyk5j2a7px15aqct` (`batch_code`),
  ADD KEY `FKqqesgp9wc1psjhce24xjrcvdh` (`company_id`);

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
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evaluations`
--
ALTER TABLE `evaluations`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `internships`
--
ALTER TABLE `internships`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `internship_batches`
--
ALTER TABLE `internship_batches`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `internship_progress`
--
ALTER TABLE `internship_progress`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mentors`
--
ALTER TABLE `mentors`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- Constraints for table `internship_batches`
--
ALTER TABLE `internship_batches`
  ADD CONSTRAINT `FKqqesgp9wc1psjhce24xjrcvdh` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);

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
