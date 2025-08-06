package com.internship.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.config.TestConfig;
import com.internship.config.TestDataBuilder;
import com.internship.dto.request.CreateStudentRequest;
import com.internship.entity.Student;
import com.internship.entity.User;
import com.internship.enums.RoleType;
import com.internship.enums.StudentStatus;
import com.internship.repository.StudentRepository;
import com.internship.repository.UserRepository;
import com.internship.security.jwt.JwtUtils;
import com.internship.security.jwt.UserPrincipal;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Import(TestConfig.class)
@Transactional
public class StudentApiIntegrationTest {

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
    private User departmentUser;
    private Student testStudent;

    @BeforeEach
    void setUp() {
        // Create department user and token
        departmentUser = TestDataBuilder.createTestUser("department", "dept@test.com", RoleType.DEPARTMENT);
        departmentUser.setPassword(passwordEncoder.encode("password123"));
        departmentUser = userRepository.save(departmentUser);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            UserPrincipal.create(departmentUser), null, UserPrincipal.create(departmentUser).getAuthorities());
        departmentToken = jwtUtils.generateJwtToken(authentication);

        // Create test student with user
        User studentUser = TestDataBuilder.createTestUser("student", "student@test.com", RoleType.STUDENT);
        studentUser.setPassword(passwordEncoder.encode("password123"));
        studentUser = userRepository.save(studentUser);

        testStudent = TestDataBuilder.createTestStudent(studentUser);
        testStudent.setStatus(StudentStatus.ACTIVE);
        testStudent = studentRepository.save(testStudent);
    }

    @Test
    @DisplayName("Should return student with user information")
    void testGetStudentById_WithUserInfo() throws Exception {
        mockMvc.perform(get("/api/students/{id}", testStudent.getId())
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(testStudent.getId()))
                .andExpect(jsonPath("$.studentCode").value(testStudent.getStudentCode()))
                .andExpect(jsonPath("$.user").exists())
                .andExpect(jsonPath("$.user.id").value(testStudent.getUser().getId()))
                .andExpect(jsonPath("$.user.fullName").value(testStudent.getUser().getFullName()))
                .andExpect(jsonPath("$.user.email").value(testStudent.getUser().getEmail()))
                .andExpect(jsonPath("$.user.phoneNumber").value(testStudent.getUser().getPhoneNumber()));
    }

    @Test
    @DisplayName("Should create student with user information")
    void testCreateStudent_WithUserInfo() throws Exception {
        CreateStudentRequest request = new CreateStudentRequest();
        request.setUsername("newstudent");
        request.setEmail("newstudent@test.com");
        request.setFullName("New Student");
        request.setPhoneNumber("0123456789");
        request.setStudentCode("STU002");
        request.setClassName("SE2024");
        request.setMajor("Computer Science");
        request.setAcademicYear("2024");
        request.setGpa(3.5);

        mockMvc.perform(post("/api/students")
                .header("Authorization", "Bearer " + departmentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.studentCode").value("STU002"))
                .andExpect(jsonPath("$.user").exists())
                .andExpect(jsonPath("$.user.fullName").value("New Student"))
                .andExpect(jsonPath("$.user.email").value("newstudent@test.com"))
                .andExpect(jsonPath("$.user.phoneNumber").value("0123456789"));
    }

    @Test
    @DisplayName("Should search students with user information")
    void testSearchStudents_WithUserInfo() throws Exception {
        mockMvc.perform(get("/api/students/search")
                .param("keyword", "Test")
                .header("Authorization", "Bearer " + departmentToken))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].user").exists())
                .andExpect(jsonPath("$.content[0].user.fullName").exists())
                .andExpect(jsonPath("$.content[0].user.email").exists());
    }
}