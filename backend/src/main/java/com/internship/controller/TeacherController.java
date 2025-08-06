package com.internship.controller;

import com.internship.dto.request.CreateTeacherRequest;
import com.internship.entity.Teacher;
import com.internship.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/teachers")
public class TeacherController {
    
    @Autowired
    private TeacherService teacherService;
    
    @GetMapping
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Page<Teacher>> getAllTeachers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Teacher> teachers = teacherService.getAllTeachers(pageable);
        return ResponseEntity.ok(teachers);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Teacher> getTeacherById(@PathVariable Long id) {
        Optional<Teacher> teacher = teacherService.getTeacherById(id);
        return teacher.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/code/{teacherCode}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Teacher> getTeacherByCode(@PathVariable String teacherCode) {
        Optional<Teacher> teacher = teacherService.getTeacherByCode(teacherCode);
        return teacher.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Teacher> getTeacherByUserId(@PathVariable Long userId) {
        Optional<Teacher> teacher = teacherService.getTeacherByUserId(userId);
        return teacher.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Page<Teacher>> searchTeachers(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        // Validate pagination parameters
        page = Math.max(0, page);
        size = Math.max(1, Math.min(100, size));
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // If no keyword provided, return all teachers
        Page<Teacher> teachers;
        if (keyword == null || keyword.trim().isEmpty()) {
            teachers = teacherService.getAllTeachers(pageable);
        } else {
            teachers = teacherService.searchTeachers(keyword, pageable);
        }
        
        return ResponseEntity.ok(teachers);
    }
    
    @GetMapping("/department/{department}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Page<Teacher>> getTeachersByDepartment(
            @PathVariable String department,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Teacher> teachers = teacherService.getTeachersByDepartment(department, pageable);
        return ResponseEntity.ok(teachers);
    }
    
    @GetMapping("/specialization/{specialization}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Page<Teacher>> getTeachersBySpecialization(
            @PathVariable String specialization,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Teacher> teachers = teacherService.getTeachersBySpecialization(specialization, pageable);
        return ResponseEntity.ok(teachers);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<?> createTeacher(@Valid @RequestBody CreateTeacherRequest request) {
        try {
            Teacher createdTeacher = teacherService.createTeacherWithUser(request);
            return ResponseEntity.ok(createdTeacher);
        } catch (RuntimeException e) {
            // Log the error for debugging
            System.err.println("Error creating teacher: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<?> updateTeacher(@PathVariable Long id, @Valid @RequestBody Teacher teacher) {
        try {
            Teacher updatedTeacher = teacherService.updateTeacherInfo(id, teacher);
            return ResponseEntity.ok(updatedTeacher);
        } catch (RuntimeException e) {
            // Log the error for debugging
            System.err.println("Error updating teacher: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<?> deleteTeacher(@PathVariable Long id) {
        try {
            teacherService.deleteTeacher(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/check-code/{teacherCode}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Boolean> checkTeacherCodeExists(@PathVariable String teacherCode) {
        boolean exists = teacherService.existsByTeacherCode(teacherCode);
        return ResponseEntity.ok(exists);
    }
    
    @GetMapping("/statistics/count")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Long> getTotalTeacherCount() {
        long count = teacherService.getTotalTeacherCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/user/{userId}/statistics")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Map<String, Object>> getTeacherStatisticsByUserId(@PathVariable Long userId) {
        try {
            Map<String, Object> statistics = teacherService.getTeacherStatistics(userId);
            return ResponseEntity.ok(statistics);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
} 