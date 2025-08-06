package com.internship.service;

import com.internship.config.TestDataBuilder;
import com.internship.entity.Student;
import com.internship.entity.User;
import com.internship.enums.RoleType;
import com.internship.repository.StudentRepository;
import com.internship.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private StudentService studentService;

    private Student testStudent;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = TestDataBuilder.createTestUser("testuser", "test@example.com", RoleType.STUDENT);
        testUser.setId(1L);
        
        testStudent = TestDataBuilder.createTestStudent(testUser);
        testStudent.setId(1L);
    }

    @Test
    @DisplayName("Should get all students with pagination")
    void testGetAllStudents_WithPagination() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        List<Student> students = Arrays.asList(testStudent);
        Page<Student> studentPage = new PageImpl<>(students, pageable, 1);
        
        when(studentRepository.findAll(pageable)).thenReturn(studentPage);

        // When
        Page<Student> result = studentService.getAllStudents(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testStudent.getId(), result.getContent().get(0).getId());
        verify(studentRepository).findAll(pageable);
    }

    @Test
    @DisplayName("Should get student by ID successfully")
    void testGetStudentById_Success() {
        // Given
        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));

        // When
        Optional<Student> result = studentService.getStudentById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testStudent.getId(), result.get().getId());
        assertEquals(testStudent.getStudentCode(), result.get().getStudentCode());
        verify(studentRepository).findById(1L);
    }

    @Test
    @DisplayName("Should return empty when student not found")
    void testGetStudentById_NotFound() {
        // Given
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<Student> result = studentService.getStudentById(99L);

        // Then
        assertFalse(result.isPresent());
        verify(studentRepository).findById(99L);
    }

    @Test
    @DisplayName("Should create student successfully")
    void testCreateStudent_Success() {
        // Given
        when(studentRepository.existsByStudentCode(testStudent.getStudentCode())).thenReturn(false);
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(studentRepository.save(any(Student.class))).thenReturn(testStudent);

        // When
        Student result = studentService.createStudent(testStudent);

        // Then
        assertNotNull(result);
        assertEquals(testStudent.getId(), result.getId());
        assertEquals(testStudent.getStudentCode(), result.getStudentCode());
        verify(studentRepository).save(testStudent);
    }

    @Test
    @DisplayName("Should update student successfully")
    void testUpdateStudent_Success() {
        // Given
        when(studentRepository.findById(1L)).thenReturn(Optional.of(testStudent));
        when(studentRepository.save(any(Student.class))).thenReturn(testStudent);

        testStudent.setMajor("Information Technology");

        // When
        Student result = studentService.updateStudent(testStudent);

        // Then
        assertNotNull(result);
        assertEquals("Information Technology", result.getMajor());
        verify(studentRepository).save(testStudent);
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent student")
    void testUpdateStudent_NotFound() {
        // Given
        testStudent.setId(99L);
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> studentService.updateStudent(testStudent));
        
        assertEquals("Student not found with id: 99", exception.getMessage());
        verify(studentRepository).findById(99L);
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    @DisplayName("Should delete student successfully")
    void testDeleteStudent_Success() {
        // Given
        when(studentRepository.existsById(1L)).thenReturn(true);
        doNothing().when(studentRepository).deleteById(1L);

        // When
        assertDoesNotThrow(() -> studentService.deleteStudent(1L));

        // Then
        verify(studentRepository).existsById(1L);
        verify(studentRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent student")
    void testDeleteStudent_NotFound() {
        // Given
        when(studentRepository.existsById(99L)).thenReturn(false);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> studentService.deleteStudent(99L));
        
        assertEquals("Student not found with id: 99", exception.getMessage());
        verify(studentRepository).existsById(99L);
        verify(studentRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("Should get students by major")
    void testGetStudentsByMajor_Success() {
        // Given
        List<Student> students = Arrays.asList(testStudent);
        Pageable pageable = PageRequest.of(0, 10);
        Page<Student> studentPage = new PageImpl<>(students, pageable, 1);
        when(studentRepository.findByMajor("Computer Science", pageable)).thenReturn(studentPage);

        // When
        Page<Student> result = studentService.getStudentsByMajor("Computer Science", pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testStudent.getId(), result.getContent().get(0).getId());
        verify(studentRepository).findByMajor("Computer Science", pageable);
    }

    @Test
    @DisplayName("Should search students by keyword")
    void testSearchStudents_Success() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        List<Student> students = Arrays.asList(testStudent);
        Page<Student> studentPage = new PageImpl<>(students, pageable, 1);
        
        when(studentRepository.searchStudents("test", pageable)).thenReturn(studentPage);

        // When
        Page<Student> result = studentService.searchStudents("test", pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(studentRepository).searchStudents("test", pageable);
    }

    @Test
    @DisplayName("Should get total student count")
    void testGetTotalStudentCount_Success() {
        // Given
        when(studentRepository.count()).thenReturn(5L);

        // When
        long result = studentService.getTotalStudentCount();

        // Then
        assertEquals(5L, result);
        verify(studentRepository).count();
    }
} 