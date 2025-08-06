package com.internship.repository;

import com.internship.config.TestDataBuilder;
import com.internship.entity.Student;
import com.internship.entity.User;
import com.internship.enums.RoleType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
public class StudentRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private StudentRepository studentRepository;

    private Student testStudent;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = TestDataBuilder.createTestUser("testuser", "test@example.com", RoleType.STUDENT);
        testUser = entityManager.persistAndFlush(testUser);
        
        testStudent = TestDataBuilder.createTestStudent(testUser);
        testStudent = entityManager.persistAndFlush(testStudent);
        
        entityManager.clear();
    }

    @Test
    @DisplayName("Should find student by ID")
    void testFindById_Success() {
        // When
        Optional<Student> found = studentRepository.findById(testStudent.getId());

        // Then
        assertTrue(found.isPresent());
        assertEquals(testStudent.getStudentCode(), found.get().getStudentCode());
        assertEquals(testStudent.getMajor(), found.get().getMajor());
    }

    @Test
    @DisplayName("Should find students by major")
    void testFindByMajor_Success() {
        // When
        Pageable pageable = PageRequest.of(0, 10);
        Page<Student> students = studentRepository.findByMajor("Computer Science", pageable);

        // Then
        assertFalse(students.isEmpty());
        assertEquals(1, students.getTotalElements());
        assertEquals(testStudent.getStudentCode(), students.getContent().get(0).getStudentCode());
    }

    @Test
    @DisplayName("Should find students by academic year")
    void testFindByAcademicYear_Success() {
        // When
        Pageable pageable = PageRequest.of(0, 10);
        Page<Student> students = studentRepository.findByAcademicYear("2023", pageable);

        // Then
        assertFalse(students.isEmpty());
        assertEquals(1, students.getTotalElements());
        assertEquals(testStudent.getAcademicYear(), students.getContent().get(0).getAcademicYear());
    }

    // @Test
    // @DisplayName("Should find students by GPA range")
    // void testFindByGpaRange_Success() {
    //     // When
    //     List<Student> students = studentRepository.findByGpaRange(3.0, 4.0);

    //     // Then
    //     assertFalse(students.isEmpty());
    //     assertEquals(1, students.size());
    //     assertTrue(students.get(0).getGpa() >= 3.0 && students.get(0).getGpa() <= 4.0);
    // }

    @Test
    @DisplayName("Should search students by keyword")
    void testSearchStudents_Success() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<Student> students = studentRepository.searchStudents("Computer", pageable);

        // Then
        assertFalse(students.isEmpty());
        assertEquals(1, students.getTotalElements());
        assertTrue(students.getContent().get(0).getMajor().contains("Computer"));
    }

    @Test
    @DisplayName("Should search students by user full name")
    void testSearchStudents_ByUserName() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<Student> students = studentRepository.searchStudents("Test", pageable);

        // Then
        assertFalse(students.isEmpty());
        assertEquals(1, students.getTotalElements());
    }

    @Test
    @DisplayName("Should return empty list when no students match major")
    void testFindByMajor_NotFound() {
        // When
        Pageable pageable = PageRequest.of(0, 10);
        Page<Student> students = studentRepository.findByMajor("Non-existent Major", pageable);

        // Then
        assertTrue(students.isEmpty());
    }

    @Test
    @DisplayName("Should return empty page when no students match search")
    void testSearchStudents_NotFound() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<Student> students = studentRepository.searchStudents("NonExistentKeyword", pageable);

        // Then
        assertTrue(students.isEmpty());
        assertEquals(0, students.getTotalElements());
    }

    @Test
    @DisplayName("Should count total students")
    void testCount_Success() {
        // When
        long count = studentRepository.count();

        // Then
        assertEquals(1, count);
    }

    @Test
    @DisplayName("Should save and find student by student code")
    void testSaveAndFindByStudentCode() {
        // Given
        User newUser = TestDataBuilder.createTestUser("newuser", "new@example.com", RoleType.STUDENT);
        newUser = entityManager.persistAndFlush(newUser);
        
        Student newStudent = TestDataBuilder.createTestStudent(newUser);
        newStudent.setStudentCode("STU002");

        // When
        Student saved = studentRepository.save(newStudent);
        
        // Then
        assertNotNull(saved.getId());
        assertEquals("STU002", saved.getStudentCode());
        
        // Verify it can be found
        Optional<Student> found = studentRepository.findById(saved.getId());
        assertTrue(found.isPresent());
        assertEquals("STU002", found.get().getStudentCode());
    }

    @Test
    @DisplayName("Should delete student by ID")
    void testDeleteById_Success() {
        // Given
        Long studentId = testStudent.getId();

        // When
        studentRepository.deleteById(studentId);
        entityManager.flush();

        // Then
        Optional<Student> found = studentRepository.findById(studentId);
        assertFalse(found.isPresent());
    }
} 