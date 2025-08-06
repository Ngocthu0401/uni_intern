package com.internship.controller;

import com.internship.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/admin")
public class AdminController {
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private TeacherService teacherService;
    
    @Autowired
    private CompanyService companyService;
    
    @Autowired
    private MentorService mentorService;
    
    @Autowired
    private InternshipBatchService batchService;
    
    @Autowired
    private InternshipService internshipService;
    
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Thống kê cơ bản
        stats.put("totalStudents", studentService.getTotalStudentCount());
        stats.put("totalTeachers", teacherService.getTotalTeacherCount());
        stats.put("totalCompanies", companyService.getTotalCompanyCount());
        stats.put("totalMentors", mentorService.getTotalMentorCount());
        stats.put("totalBatches", batchService.getTotalBatchCount());
        stats.put("totalInternships", internshipService.getTotalInternshipCount());
        
        // Thống kê trạng thái
        stats.put("activeCompanies", companyService.getActiveCompanyCount());
        stats.put("ongoingInternships", internshipService.getOngoingInternshipCount());
        stats.put("completedInternships", internshipService.getCompletedInternshipCount());
        
        // Thống kê theo sinh viên
        stats.put("studentsWithInternship", studentService.getStudentsWithInternshipCount());
        stats.put("studentsWithoutInternship", studentService.getStudentsWithoutInternshipCount());
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/dashboard/charts")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Map<String, Object>> getDashboardCharts() {
        Map<String, Object> charts = new HashMap<>();
        
        // Biểu đồ phân bố sinh viên theo trạng thái
        charts.put("studentsByStatus", studentService.getStudentStatisticsByStatus());
        
        // Biểu đồ phân bố sinh viên theo lớp
        charts.put("studentsByClass", studentService.getStudentStatisticsByClass());
        
        // Biểu đồ công ty theo ngành
        charts.put("companiesByIndustry", companyService.getCompanyStatisticsByIndustry());
        
        // Biểu đồ thực tập theo tháng
        charts.put("internshipsByMonth", internshipService.getInternshipStatisticsByMonth());
        
        return ResponseEntity.ok(charts);
    }
    
    @GetMapping("/dashboard/recent-activities")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<?> getRecentActivities(
            @RequestParam(defaultValue = "10") int limit) {
        
        var activities = studentService.getRecentActivities(limit);
        return ResponseEntity.ok(activities);
    }
    
    @GetMapping("/system-info")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Map<String, Object>> getSystemInfo() {
        Map<String, Object> systemInfo = new HashMap<>();
        
        systemInfo.put("version", "1.0.0");
        systemInfo.put("environment", "production");
        systemInfo.put("database", "mysql");
        systemInfo.put("uptime", System.currentTimeMillis());
        
        return ResponseEntity.ok(systemInfo);
    }
    
    @GetMapping("/reports/summary")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Map<String, Object>> getReportsSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        // Các thống kê báo cáo cần thiết
        summary.put("totalReports", 0); // Sẽ implement sau
        summary.put("pendingReports", 0);
        summary.put("approvedReports", 0);
        summary.put("rejectedReports", 0);
        
        return ResponseEntity.ok(summary);
    }
} 