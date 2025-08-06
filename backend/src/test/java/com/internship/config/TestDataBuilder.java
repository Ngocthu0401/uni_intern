package com.internship.config;

import com.internship.entity.*;
import com.internship.enums.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TestDataBuilder {
    
    public static User createTestUser(String username, String email, RoleType role) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword("password123");
        user.setFullName("Test " + username);
        user.setPhoneNumber("0123456789");
        user.setRole(role);
        user.setIsActive(true);
        return user;
    }
    
    public static Student createTestStudent(User user) {
        Student student = new Student();
        student.setUser(user);
        student.setStudentCode("STU001");
        student.setMajor("Computer Science");
        student.setAcademicYear("2023");
        student.setGpa(3.5);
        return student;
    }
    
    public static Teacher createTestTeacher(User user) {
        Teacher teacher = new Teacher();
        teacher.setUser(user);
        teacher.setTeacherCode("TEA001");
        teacher.setDepartment("Information Technology");
        teacher.setSpecialization("Software Engineering");
        teacher.setDegree("PhD");
        return teacher;
    }
    
    public static Company createTestCompany() {
        Company company = new Company();
        company.setCompanyName("Test Company Ltd");
        company.setCompanyCode("COMP001");
        company.setIndustry("Technology");
        company.setAddress("123 Test Street");
        company.setPhoneNumber("0987654321");
        company.setEmail("test@company.com");
        company.setWebsite("https://testcompany.com");
        company.setDescription("Test company description");
        company.setIsActive(true);
        return company;
    }
    
    public static Mentor createTestMentor(User user, Company company) {
        Mentor mentor = new Mentor();
        mentor.setUser(user);
        mentor.setCompany(company);
        mentor.setPosition("Senior Developer");
        mentor.setYearsOfExperience(5);
        mentor.setDepartment("IT Department");
        return mentor;
    }
    
    public static InternshipBatch createTestBatch() {
        InternshipBatch batch = new InternshipBatch();
        batch.setBatchName("Test Batch 2024");
        batch.setBatchCode("BATCH001");
        batch.setStartDate(LocalDate.now());
        batch.setEndDate(LocalDate.now().plusMonths(3));
        batch.setDescription("Test batch description");
        batch.setMaxStudents(50);
        batch.setIsActive(true);
        return batch;
    }
    
    public static Internship createTestInternship(Student student, Company company, Teacher teacher, Mentor mentor, InternshipBatch batch) {
        Internship internship = new Internship();
        internship.setStudent(student);
        internship.setCompany(company);
        internship.setTeacher(teacher);
        internship.setMentor(mentor);
        internship.setInternshipBatch(batch);
        internship.setStartDate(LocalDate.now());
        internship.setEndDate(LocalDate.now().plusMonths(3));
        internship.setStatus(InternshipStatus.PENDING);
        internship.setJobDescription("Test internship description");
        return internship;
    }
    
    public static Report createTestReport(Internship internship) {
        Report report = new Report();
        report.setInternship(internship);
        report.setWeekNumber(1);
        report.setReportDate(LocalDate.now());
        report.setTitle("Weekly Report 1");
        report.setContent("Test report content");
        report.setAchievements("Test achievements");
        report.setChallenges("Test challenges");
        report.setNextWeekPlan("Next week plan");
        report.setSubmittedAt(LocalDate.now().atStartOfDay());
        report.setIsApprovedByTeacher(false);
        report.setIsApprovedByMentor(false);
        return report;
    }
    
    public static Evaluation createTestEvaluation(Internship internship, User evaluator, RoleType evaluatorType) {
        Evaluation evaluation = new Evaluation();
        evaluation.setInternship(internship);
        evaluation.setEvaluator(evaluator);
        evaluation.setEvaluatorType(evaluatorType);
        evaluation.setEvaluationDate(LocalDate.now());
        evaluation.setTechnicalScore(8.0);
        evaluation.setSoftSkillScore(7.5);
        evaluation.setAttitudeScore(9.0);
        evaluation.setCommunicationScore(8.5);
        evaluation.setOverallScore(8.25);
        evaluation.setComments("Good performance");
        evaluation.setIsFinalEvaluation(false);
        return evaluation;
    }
    
    public static Contract createTestContract(Internship internship) {
        Contract contract = new Contract();
        contract.setInternship(internship);
        contract.setContractCode("CON001");
        contract.setTitle("Internship Contract");
        contract.setContent("Test contract content");
        contract.setStartDate(LocalDate.now());
        contract.setEndDate(LocalDate.now().plusMonths(3));
        contract.setStatus(ContractStatus.DRAFT);
        return contract;
    }
} 