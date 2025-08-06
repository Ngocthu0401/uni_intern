package com.internship.controller;

import com.internship.entity.Report;
import com.internship.enums.ReportStatus;
import com.internship.enums.ReportType;
import com.internship.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/reports")
public class ReportController {
    
    @Autowired
    private ReportService reportService;
    
    @GetMapping
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Report>> getAllReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Report> reports = reportService.getAllReports(pageable);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT') or hasRole('MENTOR')")
    public ResponseEntity<Report> getReportById(@PathVariable Long id) {
        Optional<Report> report = reportService.getReportById(id);
        return report.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/internship/{internshipId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT') or hasRole('MENTOR')")
    public ResponseEntity<List<Report>> getReportsByInternshipId(@PathVariable Long internshipId) {
        List<Report> reports = reportService.getReportsByInternshipId(internshipId);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<List<Report>> getReportsByStudentId(@PathVariable Long studentId) {
        List<Report> reports = reportService.getReportsByStudentId(studentId);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Report>> getReportsByTeacherId(
            @PathVariable Long teacherId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "submittedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Report> reports = reportService.getReportsByTeacherIdWithFilters(
            teacherId, keyword, status, pageable);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/mentor/{mentorId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<List<Report>> getReportsByMentorId(@PathVariable Long mentorId) {
        List<Report> reports = reportService.getReportsByMentorId(mentorId);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/batch/{batchId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<Report>> getReportsByBatchId(@PathVariable Long batchId) {
        List<Report> reports = reportService.getReportsByBatchId(batchId);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/approval-status/{isApproved}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Report>> getReportsByApprovalStatus(
            @PathVariable Boolean isApproved,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Report> reports = reportService.getReportsByApprovalStatus(isApproved, pageable);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<Report>> getReportsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<Report> reports = reportService.getReportsByDateRange(startDate, endDate);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Report>> searchReports(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Report> reports = reportService.searchReports(keyword, pageable);
        return ResponseEntity.ok(reports);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> createReport(@Valid @RequestBody Map<String, Object> reportData) {
        try {
            // Extract internship ID from nested object or direct field
            Long internshipId;
            if (reportData.containsKey("internship") && reportData.get("internship") instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> internshipData = (Map<String, Object>) reportData.get("internship");
                internshipId = Long.valueOf(internshipData.get("id").toString());
            } else if (reportData.containsKey("internshipId")) {
                internshipId = Long.valueOf(reportData.get("internshipId").toString());
            } else {
                throw new RuntimeException("Internship ID is required");
            }
            
            // Student ID is optional - if not provided, we'll get it from the internship
            Long studentId = null;
            if (reportData.containsKey("studentId")) {
                studentId = Long.valueOf(reportData.get("studentId").toString());
            }
            
            // Create report object
            Report report = new Report();
            report.setTitle((String) reportData.get("title"));
            report.setType(ReportType.valueOf((String) reportData.get("type")));
            report.setContent((String) reportData.get("content"));
            
            // Optional fields
            if (reportData.containsKey("weekNumber")) {
                report.setWeekNumber(Integer.valueOf(reportData.get("weekNumber").toString()));
            }
            if (reportData.containsKey("reportPeriod")) {
                report.setReportPeriod((String) reportData.get("reportPeriod"));
            }
            if (reportData.containsKey("achievements")) {
                report.setAchievements((String) reportData.get("achievements"));
            }
            if (reportData.containsKey("challenges")) {
                report.setChallenges((String) reportData.get("challenges"));
            }
            if (reportData.containsKey("nextWeekPlan")) {
                report.setNextWeekPlan((String) reportData.get("nextWeekPlan"));
            }
            if (reportData.containsKey("notes")) {
                report.setNotes((String) reportData.get("notes"));
            }
            
            // Handle attachments (can be single string or list)
            if (reportData.containsKey("attachments")) {
                Object attachmentsData = reportData.get("attachments");
                if (attachmentsData instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<String> attachments = (List<String>) attachmentsData;
                    report.setAttachments(attachments);
                } else if (attachmentsData instanceof String) {
                    // Single attachment as string
                    report.setAttachments(List.of((String) attachmentsData));
                }
            }
            
            Report createdReport = reportService.createNewReport(report, studentId, internshipId);
            return ResponseEntity.status(201).body(createdReport);
            
        } catch (RuntimeException e) {
            System.err.println("Error creating report: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error creating report: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid request data"));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER')")
    public ResponseEntity<Report> updateReport(@PathVariable Long id, @RequestBody Map<String, Object> updateData) {
        try {
            // Get existing report
            Optional<Report> existingOpt = reportService.getReportById(id);
            if (existingOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Report existingReport = existingOpt.get();
            
            // Update only the provided fields
            if (updateData.containsKey("title")) {
                existingReport.setTitle((String) updateData.get("title"));
            }
            if (updateData.containsKey("content")) {
                existingReport.setContent((String) updateData.get("content"));
            }
            if (updateData.containsKey("status")) {
                existingReport.setStatus(ReportStatus.valueOf((String) updateData.get("status")));
            }
            if (updateData.containsKey("teacherComment")) {
                existingReport.setTeacherComment((String) updateData.get("teacherComment"));
            }
            if (updateData.containsKey("teacherScore")) {
                Object scoreObj = updateData.get("teacherScore");
                if (scoreObj != null) {
                    existingReport.setTeacherScore(Double.valueOf(scoreObj.toString()));
                }
            }
            if (updateData.containsKey("isApprovedByTeacher")) {
                existingReport.setIsApprovedByTeacher((Boolean) updateData.get("isApprovedByTeacher"));
            }
            if (updateData.containsKey("reviewedAt")) {
                String reviewedAtStr = (String) updateData.get("reviewedAt");
                if (reviewedAtStr != null) {
                    try {
                        // Handle ISO format with Z
                        if (reviewedAtStr.endsWith("Z")) {
                            reviewedAtStr = reviewedAtStr.replace("Z", "");
                        }
                        existingReport.setReviewedAt(LocalDateTime.parse(reviewedAtStr));
                    } catch (Exception e) {
                        // If parsing fails, set current time
                        existingReport.setReviewedAt(LocalDateTime.now());
                    }
                }
            }
            if (updateData.containsKey("achievements")) {
                existingReport.setAchievements((String) updateData.get("achievements"));
            }
            if (updateData.containsKey("challenges")) {
                existingReport.setChallenges((String) updateData.get("challenges"));
            }
            if (updateData.containsKey("nextWeekPlan")) {
                existingReport.setNextWeekPlan((String) updateData.get("nextWeekPlan"));
            }
            if (updateData.containsKey("attachments")) {
                Object attachmentsData = updateData.get("attachments");
                if (attachmentsData instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<String> attachments = (List<String>) attachmentsData;
                    existingReport.setAttachments(attachments);
                }
            }
            
            Report updatedReport = reportService.updateReport(existingReport);
            return ResponseEntity.ok(updatedReport);
        } catch (RuntimeException e) {
            System.err.println("Error updating report: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('STUDENT')")
    public ResponseEntity<?> deleteReport(@PathVariable Long id) {
        try {
            reportService.deleteReport(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<Report> approveReport(@PathVariable Long id, @RequestParam(required = false) String feedback) {
        try {
            Report report = reportService.approveReport(id, feedback);
            return ResponseEntity.ok(report);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<Report> rejectReport(@PathVariable Long id, @RequestParam(required = false) String feedback) {
        try {
            Report report = reportService.rejectReport(id, feedback);
            return ResponseEntity.ok(report);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/statistics/count")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Long> getTotalReportCount() {
        long count = reportService.getTotalReportCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/statistics/internship/{internshipId}/count")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Long> getReportCountByInternship(@PathVariable Long internshipId) {
        long count = reportService.getReportCountByInternship(internshipId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/statistics/approved/count")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Long> getApprovedReportCount() {
        long count = reportService.getApprovedReportCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/statistics/pending/count")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Long> getPendingReportCount() {
        long count = reportService.getPendingReportCount();
        return ResponseEntity.ok(count);
    }
    
    // New enhanced endpoints
    
    // Get reports by status (using new enum)
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<Report>> getReportsByStatus(@PathVariable ReportStatus status) {
        List<Report> reports = reportService.getReportsByStatus(status);
        return ResponseEntity.ok(reports);
    }
    
    // Get reports by type (using new enum)
    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<Report>> getReportsByType(@PathVariable ReportType type) {
        List<Report> reports = reportService.getReportsByType(type);
        return ResponseEntity.ok(reports);
    }
    
    // Update report status with feedback and grade
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('TEACHER') or hasRole('DEPARTMENT')")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> statusData) {
        try {
            ReportStatus status = ReportStatus.valueOf((String) statusData.get("status"));
            String feedback = (String) statusData.get("feedback");
            Double grade = statusData.containsKey("grade") ? 
                Double.valueOf(statusData.get("grade").toString()) : null;
            
            Report updatedReport = reportService.updateReportStatus(id, status, feedback, grade);
            return ResponseEntity.ok(updatedReport);
        } catch (RuntimeException e) {
            System.err.println("Error updating report status: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    // Get report statistics for student
    @GetMapping("/student/{studentId}/statistics")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<Map<String, Object>> getReportStatistics(@PathVariable Long studentId) {
        Map<String, Object> statistics = reportService.getReportStatistics(studentId);
        return ResponseEntity.ok(statistics);
    }
    
    // Get next week number for student
    @GetMapping("/student/{studentId}/next-week")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Integer>> getNextWeekNumber(@PathVariable Long studentId) {
        Integer nextWeekNumber = reportService.getNextWeekNumber(studentId);
        return ResponseEntity.ok(Map.of("nextWeekNumber", nextWeekNumber));
    }
    
    // Check if student can submit weekly report for specific week
    @GetMapping("/student/{studentId}/can-submit-week/{weekNumber}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Boolean>> canSubmitWeeklyReport(
            @PathVariable Long studentId, 
            @PathVariable Integer weekNumber) {
        boolean canSubmit = reportService.canStudentSubmitWeeklyReport(studentId, weekNumber);
        return ResponseEntity.ok(Map.of("canSubmit", canSubmit));
    }
    
    // Get latest report by type
    @GetMapping("/student/{studentId}/latest/{type}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<Report> getLatestReportByType(
            @PathVariable Long studentId, 
            @PathVariable ReportType type) {
        Optional<Report> report = reportService.getLatestReportByType(studentId, type);
        return report.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}