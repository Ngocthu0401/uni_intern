package com.internship.controller;

import com.internship.dto.request.CreateInternshipRequest;
import com.internship.dto.request.UpdateInternshipRequest;
import com.internship.entity.Internship;
import com.internship.enums.InternshipStatus;
import com.internship.service.InternshipService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/internships")
public class InternshipController {

    @Autowired
    private InternshipService internshipService;

    @GetMapping
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<Page<Internship>> getAllInternships(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Internship> internships = internshipService.getAllInternships(pageable);
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT') or hasRole('MENTOR')")
    public ResponseEntity<Internship> getInternshipById(@PathVariable Long id) {
        Optional<Internship> internship = internshipService.getInternshipById(id);
        return internship.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT') or hasRole('MENTOR')")
    public ResponseEntity<Internship> getInternshipByCode(@PathVariable String code) {
        Optional<Internship> internship = internshipService.getInternshipByCode(code);
        return internship.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<List<Internship>> getInternshipsByStudentId(@PathVariable Long studentId) {
        List<Internship> internships = internshipService.getInternshipsByStudentId(studentId);
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<Internship>> getInternshipsByTeacherId(@PathVariable Long teacherId) {
        List<Internship> internships = internshipService.getInternshipsByTeacherId(teacherId);
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/mentor/{mentorId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('MENTOR')")
    public ResponseEntity<List<Internship>> getInternshipsByMentorId(@PathVariable Long mentorId) {
        List<Internship> internships = internshipService.getInternshipsByMentorId(mentorId);
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<List<Internship>> getInternshipsByCompanyId(@PathVariable Long companyId) {
        List<Internship> internships = internshipService.getInternshipsByCompanyId(companyId);
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/batch/{batchId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<Internship>> getInternshipsByBatchId(@PathVariable Long batchId) {
        List<Internship> internships = internshipService.getInternshipsByBatchId(batchId);
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<Internship>> getInternshipsByStatus(@PathVariable InternshipStatus status) {
        List<Internship> internships = internshipService.getInternshipsByStatus(status);
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Internship>> searchInternships(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String companyName,
            @RequestParam(required = false) Long batchId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        // Validate pagination parameters
        page = Math.max(0, page);
        size = Math.max(1, Math.min(100, size));

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<Internship> internships;

        // Check if any filter is provided
        boolean hasFilters = (keyword != null && !keyword.trim().isEmpty()) ||
                (status != null && !status.trim().isEmpty()) ||
                (companyName != null && !companyName.trim().isEmpty()) ||
                (batchId != null);

        if (hasFilters) {
            // Convert status string to enum if provided
            InternshipStatus statusEnum = null;
            if (status != null && !status.trim().isEmpty()) {
                try {
                    statusEnum = InternshipStatus.valueOf(status.toUpperCase());
                } catch (IllegalArgumentException e) {
                    // If invalid status, return empty result
                    return ResponseEntity.ok(Page.empty(pageable));
                }
            }

            internships = internshipService.searchInternshipsWithFilters(
                    keyword, statusEnum, companyName, batchId, pageable);
        } else {
            internships = internshipService.getAllInternships(pageable);
        }

        return ResponseEntity.ok(internships);
    }

    @PostMapping
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<?> createInternship(@RequestBody CreateInternshipRequest request) {
        try {
            System.out.println("Received request: " + request);
            System.out.println("Job title: " + request.getJobTitle());
            System.out.println("Batch ID: " + request.getInternshipBatchId());
            Internship createdInternship = internshipService.createInternshipFromRequest(request);
            return ResponseEntity.status(201).body(createdInternship); // HTTP 201 Created
        } catch (RuntimeException e) {
            System.err.println("Error creating internship: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error creating internship: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "Unexpected error: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<?> updateInternship(@PathVariable Long id, @RequestBody UpdateInternshipRequest request) {
        try {
            System.out.println("Received update request for ID: " + id);
            System.out.println("Job title: " + request.getJobTitle());
            System.out.println("Batch ID: " + request.getInternshipBatchId());
            Internship updatedInternship = internshipService.updateInternshipFromRequest(id, request);
            return ResponseEntity.ok(updatedInternship);
        } catch (RuntimeException e) {
            System.err.println("Error updating internship: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error updating internship: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "Unexpected error: " + e.getMessage()));
        }
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<?> patchInternship(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            Internship updatedInternship = internshipService.patchInternship(id, updates);
            return ResponseEntity.ok(updatedInternship);
        } catch (RuntimeException e) {
            System.err.println("Error patching internship: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Void> deleteInternship(@PathVariable Long id) {
        try {
            internshipService.deleteInternship(id);
            return ResponseEntity.noContent().build(); // HTTP 204 No Content
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // HTTP 404 if not found
        }
    }

    @PutMapping("/{id}/assign-teacher/{teacherId}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Internship> assignTeacher(@PathVariable Long id, @PathVariable Long teacherId) {
        try {
            Internship internship = internshipService.assignTeacher(id, teacherId);
            return internship != null ? ResponseEntity.ok(internship) : ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/assign-mentor/{mentorId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Internship> assignMentor(@PathVariable Long id, @PathVariable Long mentorId) {
        try {
            Internship internship = internshipService.assignMentor(id, mentorId);
            return internship != null ? ResponseEntity.ok(internship) : ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<?> assignInternship(@PathVariable Long id, @RequestBody Map<String, Object> assignmentData) {
        try {
            Long companyId = assignmentData.get("companyId") != null &&
                    !assignmentData.get("companyId").toString().trim().isEmpty()
                            ? Long.valueOf(assignmentData.get("companyId").toString())
                            : null;
            Long studentId = assignmentData.get("studentId") != null &&
                    !assignmentData.get("studentId").toString().trim().isEmpty()
                            ? Long.valueOf(assignmentData.get("studentId").toString())
                            : null;
            Long mentorId = assignmentData.get("mentorId") != null &&
                    !assignmentData.get("mentorId").toString().trim().isEmpty()
                            ? Long.valueOf(assignmentData.get("mentorId").toString())
                            : null;
            Long teacherId = assignmentData.get("teacherId") != null &&
                    !assignmentData.get("teacherId").toString().trim().isEmpty()
                            ? Long.valueOf(assignmentData.get("teacherId").toString())
                            : null;

            Internship internship = internshipService.assignInternship(id, companyId, studentId, mentorId, teacherId);
            return internship != null ? ResponseEntity.ok(internship) : ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/start")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Internship> startInternship(@PathVariable Long id) {
        Internship internship = internshipService.startInternship(id);
        return internship != null ? ResponseEntity.ok(internship) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Internship> approveInternship(@PathVariable Long id) {
        try {
            Internship internship = internshipService.approveInternship(id);
            return internship != null ? ResponseEntity.ok(internship) : ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Internship> rejectInternship(@PathVariable Long id) {
        try {
            Internship internship = internshipService.rejectInternship(id);
            return internship != null ? ResponseEntity.ok(internship) : ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Internship> completeInternship(@PathVariable Long id) {
        Internship internship = internshipService.completeInternship(id);
        return internship != null ? ResponseEntity.ok(internship) : ResponseEntity.notFound().build();
    }

    @GetMapping("/statistics/status/{status}/count")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Long> countByStatus(@PathVariable InternshipStatus status) {
        Long count = internshipService.countByStatus(status);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/statistics/batch/{batchId}/count")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Long> countByBatchId(@PathVariable Long batchId) {
        Long count = internshipService.countByBatchId(batchId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Map<String, Long>> getInternshipStatistics() {
        Map<String, Long> statistics = internshipService.getInternshipStatistics();
        return ResponseEntity.ok(statistics);
    }

    // Task management endpoints - delegating to TaskController
    @GetMapping("/{internshipId}/tasks")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR') or hasRole('STUDENT')")
    public ResponseEntity<?> getInternshipTasks(@PathVariable Long internshipId) {
        // Redirect to TaskController
        return ResponseEntity.status(302)
                .header("Location", "/api/tasks/internship/" + internshipId)
                .build();
    }

    @PostMapping("/tasks")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<?> createTask(@RequestBody Map<String, Object> taskData) {
        // Redirect to TaskController
        return ResponseEntity.status(302)
                .header("Location", "/api/tasks")
                .body(Map.of("message", "Please use /api/tasks endpoint directly"));
    }

    @PutMapping("/tasks/{taskId}/status")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR') or hasRole('STUDENT')")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long taskId, @RequestBody Map<String, String> statusData) {
        // Redirect to TaskController
        return ResponseEntity.status(302)
                .header("Location", "/api/tasks/" + taskId + "/status")
                .body(Map.of("message", "Please use /api/tasks/" + taskId + "/status endpoint directly"));
    }

    // Progress tracking endpoints - delegating to InternshipProgressController
    @GetMapping("/{internshipId}/progress")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR') or hasRole('STUDENT')")
    public ResponseEntity<?> getInternshipProgress(@PathVariable Long internshipId) {
        // Redirect to InternshipProgressController
        return ResponseEntity.status(302)
                .header("Location", "/api/internship-progress/internship/" + internshipId + "/latest")
                .build();
    }

    @PutMapping("/{internshipId}/progress")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<?> updateInternshipProgress(@PathVariable Long internshipId,
            @RequestBody Map<String, Object> progressData) {
        // Redirect to InternshipProgressController
        return ResponseEntity.status(302)
                .header("Location", "/api/internship-progress/internship/" + internshipId)
                .body(Map.of("message",
                        "Please use /api/internship-progress/internship/" + internshipId + " endpoint directly"));
    }

}