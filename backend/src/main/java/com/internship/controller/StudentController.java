package com.internship.controller;

import com.internship.dto.request.CreateStudentRequest;
import com.internship.dto.response.StudentWithInternshipsDto;
import com.internship.entity.Student;
import com.internship.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Student>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        // Validate pagination parameters
        page = Math.max(0, page); // Ensure page is not negative
        size = Math.max(1, Math.min(100, size)); // Ensure size is between 1 and 100

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Student> students = studentService.getAllStudents(pageable);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Optional<Student> student = studentService.getStudentById(id);
        return student.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{studentCode}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<Student> getStudentByCode(@PathVariable String studentCode) {
        Optional<Student> student = studentService.getStudentByCode(studentCode);
        return student.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<Student> getStudentByUserId(@PathVariable("userId") Long userId) {
        Optional<Student> student = studentService.getOrCreateStudentByUserId(userId);
        return student.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<StudentWithInternshipsDto>> searchStudents(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        // Validate pagination parameters
        page = Math.max(0, page); // Ensure page is not negative
        size = Math.max(1, Math.min(100, size)); // Ensure size is between 1 and 100

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        // Search students with internships
        Page<StudentWithInternshipsDto> students = studentService.searchStudentsWithInternships(keyword, pageable);

        return ResponseEntity.ok(students);
    }

    @GetMapping("/class/{className}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Student>> getStudentsByClass(
            @PathVariable String className,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        // Validate pagination parameters
        page = Math.max(0, page);
        size = Math.max(1, Math.min(100, size));

        Pageable pageable = PageRequest.of(page, size);
        Page<Student> students = studentService.getStudentsByClass(className, pageable);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/major/{major}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Student>> getStudentsByMajor(
            @PathVariable String major,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Student> students = studentService.getStudentsByMajor(major, pageable);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/academic-year/{academicYear}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Student>> getStudentsByAcademicYear(
            @PathVariable String academicYear,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Student> students = studentService.getStudentsByAcademicYear(academicYear, pageable);
        return ResponseEntity.ok(students);
    }

    @PostMapping
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Student> createStudent(@RequestBody CreateStudentRequest request) {
        try {
            Student createdStudent = studentService.createStudentWithUser(request);
            return ResponseEntity.ok(createdStudent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('STUDENT')")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Student student) {
        try {
            student.setId(id);
            Student updatedStudent = studentService.updateStudent(student);
            return ResponseEntity.ok(updatedStudent);
        } catch (RuntimeException e) {
            // Log the error for debugging
            System.err.println("Error updating student: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/check-code/{studentCode}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Boolean> checkStudentCodeExists(@PathVariable String studentCode) {
        boolean exists = studentService.existsByStudentCode(studentCode);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/statistics/count")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Long> getTotalStudentCount() {
        long count = studentService.getTotalStudentCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/advanced-search")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<StudentWithInternshipsDto>> advancedSearchStudents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String className,
            @RequestParam(required = false) String major,
            @RequestParam(required = false) String academicYear,
            @RequestParam(required = false) Double minGpa,
            @RequestParam(required = false) Double maxGpa,
            @RequestParam(required = false) String internshipStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<StudentWithInternshipsDto> students = studentService.advancedSearchStudents(
                keyword, className, major, academicYear, minGpa, maxGpa, internshipStatus, pageable);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/export")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<Student>> exportStudents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String className,
            @RequestParam(required = false) String major,
            @RequestParam(required = false) String academicYear) {

        List<Student> students = studentService.exportStudents(keyword, className, major, academicYear);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/statistics/by-status")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<?> getStudentStatisticsByStatus() {
        var statistics = studentService.getStudentStatisticsByStatus();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/statistics/by-class")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<?> getStudentStatisticsByClass() {
        var statistics = studentService.getStudentStatisticsByClass();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<StudentWithInternshipsDto>> getStudentsByTeacherId(@PathVariable Long teacherId) {
        try {
            List<StudentWithInternshipsDto> students = studentService.getStudentsByTeacherId(teacherId);
            return ResponseEntity.ok(students);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/available")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<Student>> getAvailableStudents() {
        try {
            List<Student> availableStudents = studentService.getAvailableStudents();
            return ResponseEntity.ok(availableStudents);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/batch/{batchId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<StudentWithInternshipsDto>> getStudentsByBatch(@PathVariable Long batchId) {
        try {
            List<StudentWithInternshipsDto> students = studentService.getStudentsByBatch(batchId);
            return ResponseEntity.ok(students);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}