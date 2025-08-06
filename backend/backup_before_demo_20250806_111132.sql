-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: internship_management
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` bigint NOT NULL AUTO_INCREMENT,
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
  `website` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6yrvsg7p3v2e969nfmvbo9440` (`company_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contracts`
--

DROP TABLE IF EXISTS `contracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contracts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
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
  `internship_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_cumggxjbttojw3k8b7fgleib6` (`contract_code`),
  UNIQUE KEY `UK_aikvlengwxmtpk4bvbrt96lqj` (`internship_id`),
  KEY `FKfgism94uvtcnby5qcijqg4bxc` (`created_by_teacher_id`),
  CONSTRAINT `FK8dswea723fbvx7677hxhtdwnm` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`id`),
  CONSTRAINT `FKfgism94uvtcnby5qcijqg4bxc` FOREIGN KEY (`created_by_teacher_id`) REFERENCES `teachers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contracts`
--

LOCK TABLES `contracts` WRITE;
/*!40000 ALTER TABLE `contracts` DISABLE KEYS */;
/*!40000 ALTER TABLE `contracts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluations`
--

DROP TABLE IF EXISTS `evaluations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evaluations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
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
  `internship_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqihdmjba0yaamhjp8gr00c27m` (`evaluator_id`),
  KEY `FK2fc43ekjt1e5s6qkiuafqwk2k` (`internship_id`),
  CONSTRAINT `FK2fc43ekjt1e5s6qkiuafqwk2k` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`id`),
  CONSTRAINT `FKqihdmjba0yaamhjp8gr00c27m` FOREIGN KEY (`evaluator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluations`
--

LOCK TABLES `evaluations` WRITE;
/*!40000 ALTER TABLE `evaluations` DISABLE KEYS */;
/*!40000 ALTER TABLE `evaluations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internship_batches`
--

DROP TABLE IF EXISTS `internship_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `internship_batches` (
  `id` bigint NOT NULL AUTO_INCREMENT,
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
  `start_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_hmsciamj5gyk5j2a7px15aqct` (`batch_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internship_batches`
--

LOCK TABLES `internship_batches` WRITE;
/*!40000 ALTER TABLE `internship_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `internship_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internship_progress`
--

DROP TABLE IF EXISTS `internship_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `internship_progress` (
  `id` bigint NOT NULL AUTO_INCREMENT,
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
  `internship_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjvbapg7gtc1fylmfof14i9nm5` (`internship_id`),
  CONSTRAINT `FKjvbapg7gtc1fylmfof14i9nm5` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internship_progress`
--

LOCK TABLES `internship_progress` WRITE;
/*!40000 ALTER TABLE `internship_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `internship_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internships`
--

DROP TABLE IF EXISTS `internships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `internships` (
  `id` bigint NOT NULL AUTO_INCREMENT,
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
  `teacher_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_i2vf3chk4n9nrxrwokf7txjh3` (`internship_code`),
  KEY `FKkw009ia6w9ui3095scywptogh` (`company_id`),
  KEY `FKry0qawpn34wc9jr9rr11jrqy3` (`batch_id`),
  KEY `FK4en3il97mei6smodq6l30urcp` (`mentor_id`),
  KEY `FKkmqhv1l86m6qrqgfftoy92vy6` (`student_id`),
  KEY `FKek638yl1pfnprhojyryxv6t8r` (`teacher_id`),
  CONSTRAINT `FK4en3il97mei6smodq6l30urcp` FOREIGN KEY (`mentor_id`) REFERENCES `mentors` (`id`),
  CONSTRAINT `FKek638yl1pfnprhojyryxv6t8r` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`),
  CONSTRAINT `FKkmqhv1l86m6qrqgfftoy92vy6` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `FKkw009ia6w9ui3095scywptogh` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  CONSTRAINT `FKry0qawpn34wc9jr9rr11jrqy3` FOREIGN KEY (`batch_id`) REFERENCES `internship_batches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internships`
--

LOCK TABLES `internships` WRITE;
/*!40000 ALTER TABLE `internships` DISABLE KEYS */;
/*!40000 ALTER TABLE `internships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mentors`
--

DROP TABLE IF EXISTS `mentors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mentors` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `department` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `expertise_level` enum('JUNIOR','INTERMEDIATE','SENIOR','EXPERT','LEAD') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `office_location` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `specialization` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `years_of_experience` int DEFAULT NULL,
  `company_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_3y0yv2cy2egy1bl908vqnnhrv` (`user_id`),
  KEY `FK958wvri7w7mmggqu31crgs4s6` (`company_id`),
  CONSTRAINT `FK958wvri7w7mmggqu31crgs4s6` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  CONSTRAINT `FKmciiqqph74b3gqsw9615l9cwp` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mentors`
--

LOCK TABLES `mentors` WRITE;
/*!40000 ALTER TABLE `mentors` DISABLE KEYS */;
/*!40000 ALTER TABLE `mentors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_attachments`
--

DROP TABLE IF EXISTS `report_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_attachments` (
  `report_id` bigint NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  KEY `FKjeh6rs623qjcauq87h2py3o06` (`report_id`),
  CONSTRAINT `FKjeh6rs623qjcauq87h2py3o06` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_attachments`
--

LOCK TABLES `report_attachments` WRITE;
/*!40000 ALTER TABLE `report_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
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
  `student_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKi2d2mcm36l0lc38er8prdprc3` (`internship_id`),
  KEY `FKom5m7273evsulyrpuqv4d4vbx` (`reviewer_id`),
  KEY `FKltpvf7j6lodaeqrm3skr8jjdf` (`student_id`),
  CONSTRAINT `FKi2d2mcm36l0lc38er8prdprc3` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`id`),
  CONSTRAINT `FKltpvf7j6lodaeqrm3skr8jjdf` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `FKom5m7273evsulyrpuqv4d4vbx` FOREIGN KEY (`reviewer_id`) REFERENCES `teachers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` bigint NOT NULL AUTO_INCREMENT,
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
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_cgcf3r5xk73o0etbduc1qxnol` (`student_code`),
  UNIQUE KEY `UK_g4fwvutq09fjdlb4bb0byp7t` (`user_id`),
  CONSTRAINT `FKdt1cjx5ve5bdabmuuf3ibrwaq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
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
  `student_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3iq0gxkfwgyxdmlukvibuuqs` (`internship_id`),
  KEY `FKp4kdkxdtaonh23dg8dknssxop` (`mentor_id`),
  KEY `FKq8i7qoh72db7rcn5wviu9xc9q` (`student_id`),
  CONSTRAINT `FK3iq0gxkfwgyxdmlukvibuuqs` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`id`),
  CONSTRAINT `FKp4kdkxdtaonh23dg8dknssxop` FOREIGN KEY (`mentor_id`) REFERENCES `mentors` (`id`),
  CONSTRAINT `FKq8i7qoh72db7rcn5wviu9xc9q` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `degree` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `department` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `office_location` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `specialization` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `teacher_code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_98e7j8mw41re3p2mis5rr9608` (`teacher_code`),
  UNIQUE KEY `UK_cd1k6xwg9jqtiwx9ybnxpmoh9` (`user_id`),
  CONSTRAINT `FKb8dct7w2j1vl1r2bpstw5isc0` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `avatar_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` enum('DEPARTMENT','TEACHER','STUDENT','MENTOR') COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-06 11:11:32
