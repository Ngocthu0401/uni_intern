package com.internship.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.config.TestConfig;
import com.internship.config.TestDataBuilder;
import com.internship.entity.*;
import com.internship.enums.RoleType;
import com.internship.repository.*;
import com.internship.security.jwt.JwtUtils;
import com.internship.security.jwt.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestConfig.class)
@Transactional
public class ApiEndpointsIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private InternshipBatchRepository batchRepository;

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    private String departmentToken;
    private String teacherToken;
    private String studentToken;
    private String mentorToken;

    private User departmentUser, teacherUser, studentUser, mentorUser;
    private Student student;
    private Teacher teacher;
    private Company company;
    private Mentor mentor;
    private InternshipBatch batch;
    private Internship internship;

    @BeforeEach
    void setUp() {
        // Clean all repositories
        contractRepository.deleteAll();
        evaluationRepository.deleteAll();
        reportRepository.deleteAll();
        internshipRepository.deleteAll();
        batchRepository.deleteAll();
        mentorRepository.deleteAll();
        companyRepository.deleteAll();
        teacherRepository.deleteAll();
        studentRepository.deleteAll();
        userRepository.deleteAll();

        // Create test users
        departmentUser = createUserWithToken("department", RoleType.DEPARTMENT);
        teacherUser = createUserWithToken("teacher", RoleType.TEACHER);
        studentUser = createUserWithToken("student", RoleType.STUDENT);
        mentorUser = createUserWithToken("mentor", RoleType.MENTOR);

        departmentToken = generateTokenForUser(departmentUser);
        teacherToken = generateTokenForUser(teacherUser);
        studentToken = generateTokenForUser(studentUser);
        mentorToken = generateTokenForUser(mentorUser);

        // Create test entities
        student = TestDataBuilder.createTestStudent(studentUser);
        student = studentRepository.save(student);

        teacher = TestDataBuilder.createTestTeacher(teacherUser);
        teacher = teacherRepository.save(teacher);

        company = TestDataBuilder.createTestCompany();
        company = companyRepository.save(company);

        mentor = TestDataBuilder.createTestMentor(mentorUser, company);
        mentor = mentorRepository.save(mentor);

        batch = TestDataBuilder.createTestBatch();
        batch = batchRepository.save(batch);

        internship = TestDataBuilder.createTestInternship(student, company, teacher, mentor, batch);
        internship = internshipRepository.save(internship);
    }

    private User createUserWithToken(String username, RoleType role) {
        User user = TestDataBuilder.createTestUser(username, username + "@test.com", role);
        user.setPassword(passwordEncoder.encode("password123"));
        return userRepository.save(user);
    }

    private String generateTokenForUser(User user) {
        // Create UserPrincipal from User entity
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        
        // Create Authentication object with UserPrincipal
        org.springframework.security.authentication.UsernamePasswordAuthenticationToken authentication = 
            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                userPrincipal, null, userPrincipal.getAuthorities()
            );
        
        return jwtUtils.generateJwtToken(authentication);
    }

    // ========== AUTH ENDPOINTS ==========
    @Test
    @DisplayName("Auth endpoints should work")
    void testAuthEndpoints() throws Exception {
        // Test login endpoint
        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"department\",\"password\":\"password123\"}"))
                .andExpect(status().isOk());
    }

    // ========== STUDENT ENDPOINTS ==========
    @Test
    @DisplayName("Student endpoints should work")
    void testStudentEndpoints() throws Exception {
        // GET all students
        mockMvc.perform(get("/api/students")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET student by ID
        mockMvc.perform(get("/api/students/{id}", student.getId())
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET students by major
        mockMvc.perform(get("/api/students/major/{major}", "Computer Science")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET student statistics
        mockMvc.perform(get("/api/students/statistics/count")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // SEARCH students
        mockMvc.perform(get("/api/students/search")
                .param("keyword", "test")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());
    }

    // ========== TEACHER ENDPOINTS ==========
    @Test
    @DisplayName("Teacher endpoints should work")
    void testTeacherEndpoints() throws Exception {
        // GET all teachers
        mockMvc.perform(get("/api/teachers")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET teacher by ID
        mockMvc.perform(get("/api/teachers/{id}", teacher.getId())
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET teachers by department
        mockMvc.perform(get("/api/teachers/department/{department}", "Information Technology")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET teacher statistics
        mockMvc.perform(get("/api/teachers/statistics/count")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());
    }

    // ========== COMPANY ENDPOINTS ==========
    @Test
    @DisplayName("Company endpoints should work")
    void testCompanyEndpoints() throws Exception {
        // GET all companies
        mockMvc.perform(get("/api/companies")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET company by ID
        mockMvc.perform(get("/api/companies/{id}", company.getId())
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET companies by industry
        mockMvc.perform(get("/api/companies/industry/{industry}", "Technology")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET company statistics
        mockMvc.perform(get("/api/companies/statistics/count")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());
    }

    // ========== MENTOR ENDPOINTS ==========
    @Test
    @DisplayName("Mentor endpoints should work")
    void testMentorEndpoints() throws Exception {
        // GET all mentors
        mockMvc.perform(get("/api/mentors")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET mentor by ID
        mockMvc.perform(get("/api/mentors/{id}", mentor.getId())
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET mentors by company
        mockMvc.perform(get("/api/mentors/company/{companyId}", company.getId())
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());
    }

    // ========== BATCH ENDPOINTS ==========
    @Test
    @DisplayName("Batch endpoints should work")
    void testBatchEndpoints() throws Exception {
        // GET all batches
        mockMvc.perform(get("/api/batches")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET batch by ID
        mockMvc.perform(get("/api/batches/{id}", batch.getId())
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET active batches
        mockMvc.perform(get("/api/batches/active")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET batch statistics
        mockMvc.perform(get("/api/batches/statistics/count")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());
    }

    // ========== INTERNSHIP ENDPOINTS ==========
    @Test
    @DisplayName("Internship endpoints should work")
    void testInternshipEndpoints() throws Exception {
        // GET all internships
        mockMvc.perform(get("/api/internships")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET internship by ID
        mockMvc.perform(get("/api/internships/{id}", internship.getId())
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET internships by student
        mockMvc.perform(get("/api/internships/student/{studentId}", student.getId())
                .header("Authorization", "Bearer " + teacherToken))
                .andExpect(status().isOk());

        // GET internships by status
        mockMvc.perform(get("/api/internships/status/{status}", "APPROVED")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());
    }

    // ========== REPORT ENDPOINTS ==========
    @Test
    @DisplayName("Report endpoints should work")
    void testReportEndpoints() throws Exception {
        Report report = TestDataBuilder.createTestReport(internship);
        report = reportRepository.save(report);

        // GET all reports
        mockMvc.perform(get("/api/reports")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET report by ID
        mockMvc.perform(get("/api/reports/{id}", report.getId())
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET reports by internship
        mockMvc.perform(get("/api/reports/internship/{internshipId}", internship.getId())
                .header("Authorization", "Bearer " + teacherToken))
                .andExpect(status().isOk());

        // GET report statistics
        mockMvc.perform(get("/api/reports/statistics/count")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());
    }

    // ========== EVALUATION ENDPOINTS ==========
    @Test
    @DisplayName("Evaluation endpoints should work")
    void testEvaluationEndpoints() throws Exception {
        Evaluation evaluation = TestDataBuilder.createTestEvaluation(internship, teacherUser, RoleType.TEACHER);
        evaluation = evaluationRepository.save(evaluation);

        // GET all evaluations
        mockMvc.perform(get("/api/evaluations")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET evaluation by ID
        mockMvc.perform(get("/api/evaluations/{id}", evaluation.getId())
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET evaluations by internship
        mockMvc.perform(get("/api/evaluations/internship/{internshipId}", internship.getId())
                .header("Authorization", "Bearer " + teacherToken))
                .andExpect(status().isOk());

        // GET evaluation statistics
        mockMvc.perform(get("/api/evaluations/statistics/count")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());
    }

    // ========== CONTRACT ENDPOINTS ==========
    @Test
    @DisplayName("Contract endpoints should work")
    void testContractEndpoints() throws Exception {
        Contract contract = TestDataBuilder.createTestContract(internship);
        contract = contractRepository.save(contract);

        // GET all contracts
        mockMvc.perform(get("/api/contracts")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET contract by ID
        mockMvc.perform(get("/api/contracts/{id}", contract.getId())
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET contracts by internship
        mockMvc.perform(get("/api/contracts/internship/{internshipId}", internship.getId())
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // GET contract statistics
        mockMvc.perform(get("/api/contracts/statistics/count")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());
    }

    // ========== SECURITY TESTS ==========
    @Test
    @DisplayName("Should deny access without authentication")
    void testUnauthenticatedAccess() throws Exception {
        mockMvc.perform(get("/api/students"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/teachers"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/companies"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should deny access with wrong role")
    void testUnauthorizedAccess() throws Exception {
        // Student trying to access department-only endpoint
        mockMvc.perform(post("/api/students")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isForbidden());
    }
} 