package com.internship.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.config.TestConfig;
import com.internship.config.TestDataBuilder;
import com.internship.entity.Student;
import com.internship.entity.User;
import com.internship.enums.RoleType;
import com.internship.repository.StudentRepository;
import com.internship.repository.UserRepository;
import com.internship.security.jwt.JwtUtils;
import com.internship.security.jwt.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Import(TestConfig.class)
@Transactional
public class StudentControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    private String departmentToken;
    private String studentToken;
    private User departmentUser;
    private User studentUser;
    private Student testStudent;

    @BeforeEach
    void setUp() {
        studentRepository.deleteAll();
        userRepository.deleteAll();

        // Create department user and token
        departmentUser = TestDataBuilder.createTestUser("department", "dept@test.com", RoleType.DEPARTMENT);
        departmentUser.setPassword(passwordEncoder.encode("password123"));
        departmentUser = userRepository.save(departmentUser);
        departmentToken = generateTokenForUser(departmentUser);

        // Create student user and token
        studentUser = TestDataBuilder.createTestUser("student", "student@test.com", RoleType.STUDENT);
        studentUser.setPassword(passwordEncoder.encode("password123"));
        studentUser = userRepository.save(studentUser);
        studentToken = generateTokenForUser(studentUser);

        // Create test student
        testStudent = TestDataBuilder.createTestStudent(studentUser);
        testStudent = studentRepository.save(testStudent);
    }

    private String generateTokenForUser(User user) {
        // Create a mock Authentication object
        org.springframework.security.core.userdetails.User userDetails = 
            new org.springframework.security.core.userdetails.User(
                user.getUsername(), 
                user.getPassword(), 
                java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
            );
        
        org.springframework.security.authentication.UsernamePasswordAuthenticationToken authentication = 
            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
            );
        
        return jwtUtils.generateJwtToken(authentication);
    }

    @Test
    @DisplayName("Should get all students with department role")
    void testGetAllStudents_WithDepartmentRole() throws Exception {
        mockMvc.perform(get("/api/students")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(0))));
    }

    @Test
    @DisplayName("Should deny access to students list with student role")
    void testGetAllStudents_WithStudentRole() throws Exception {
        mockMvc.perform(get("/api/students")
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should get student by ID")
    void testGetStudentById_Success() throws Exception {
        mockMvc.perform(get("/api/students/{id}", testStudent.getId())
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testStudent.getId()))
                .andExpect(jsonPath("$.studentCode").value("STU001"))
                .andExpect(jsonPath("$.major").value("Computer Science"));
    }

    @Test
    @DisplayName("Should return 404 for non-existent student")
    void testGetStudentById_NotFound() throws Exception {
        mockMvc.perform(get("/api/students/{id}", 99999L)
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should create new student")
    void testCreateStudent_Success() throws Exception {
        User newUser = TestDataBuilder.createTestUser("newstudent", "newstudent@test.com", RoleType.STUDENT);
        newUser.setPassword(passwordEncoder.encode("password123"));
        newUser = userRepository.save(newUser);

        Student newStudent = TestDataBuilder.createTestStudent(newUser);
        newStudent.setStudentCode("STU002");

        mockMvc.perform(post("/api/students")
                .header("Authorization", "Bearer " + departmentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newStudent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.studentCode").value("STU002"))
                .andExpect(jsonPath("$.major").value("Computer Science"));
    }

    @Test
    @DisplayName("Should update student")
    void testUpdateStudent_Success() throws Exception {
        testStudent.setMajor("Information Technology");
        testStudent.setGpa(3.8);

        mockMvc.perform(put("/api/students/{id}", testStudent.getId())
                .header("Authorization", "Bearer " + departmentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testStudent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.major").value("Information Technology"))
                .andExpect(jsonPath("$.gpa").value(3.8));
    }

    @Test
    @DisplayName("Should delete student")
    void testDeleteStudent_Success() throws Exception {
        mockMvc.perform(delete("/api/students/{id}", testStudent.getId())
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk());

        // Verify student is deleted
        mockMvc.perform(get("/api/students/{id}", testStudent.getId())
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should search students by keyword")
    void testSearchStudents_Success() throws Exception {
        mockMvc.perform(get("/api/students/search")
                .param("keyword", "Computer")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("Should get students by major")
    void testGetStudentsByMajor_Success() throws Exception {
        mockMvc.perform(get("/api/students/major/{major}", "Computer Science")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("Should get student statistics")
    void testGetStudentStatistics_Success() throws Exception {
        mockMvc.perform(get("/api/students/statistics/count")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("Should deny access without token")
    void testGetAllStudents_WithoutToken() throws Exception {
        mockMvc.perform(get("/api/students"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should deny access with invalid token")
    void testGetAllStudents_WithInvalidToken() throws Exception {
        mockMvc.perform(get("/api/students")
                .header("Authorization", "Bearer invalidtoken"))
                .andExpect(status().isUnauthorized());
    }
} 