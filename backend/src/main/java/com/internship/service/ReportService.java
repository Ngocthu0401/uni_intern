package com.internship.service;

import com.internship.entity.Report;
import com.internship.entity.Internship;
import com.internship.entity.Student;
import com.internship.enums.ReportStatus;
import com.internship.enums.ReportType;
import com.internship.repository.ReportRepository;
import com.internship.repository.InternshipRepository;
import com.internship.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class ReportService {
    
    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private InternshipRepository internshipRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }
    
    public Page<Report> getAllReports(Pageable pageable) {
        return reportRepository.findAll(pageable);
    }
    
    public Optional<Report> getReportById(Long id) {
        return reportRepository.findById(id);
    }
    
    public List<Report> getReportsByInternshipId(Long internshipId) {
        return reportRepository.findByInternshipId(internshipId);
    }
    
    public List<Report> getReportsByStudentId(Long studentId) {
        return reportRepository.findByStudentId(studentId);
    }
    
    public List<Report> getReportsByTeacherId(Long teacherId) {
        return reportRepository.findByTeacherId(teacherId);
    }
    
    public Page<Report> getReportsByTeacherIdWithFilters(Long teacherId, String keyword, String status, Pageable pageable) {
        // If no filters, use basic teacher query
        if ((keyword == null || keyword.trim().isEmpty()) && (status == null || status.trim().isEmpty())) {
            return reportRepository.findByTeacherId(teacherId, pageable);
        }
        
        // Apply filters
        ReportStatus reportStatus = null;
        if (status != null && !status.trim().isEmpty() && !"all".equalsIgnoreCase(status)) {
            try {
                reportStatus = ReportStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid status, ignore filter
            }
        }
        
        return reportRepository.findByTeacherIdWithFilters(teacherId, keyword, reportStatus, pageable);
    }
    
    public List<Report> getReportsByMentorId(Long mentorId) {
        return reportRepository.findByMentorId(mentorId);
    }
    
    public List<Report> getReportsByBatchId(Long batchId) {
        return reportRepository.findByBatchId(batchId);
    }
    
    public List<Report> getReportsByApprovalStatus(Boolean isApproved) {
        return reportRepository.findByIsApproved(isApproved);
    }
    
    public Page<Report> getReportsByApprovalStatus(Boolean isApproved, Pageable pageable) {
        return reportRepository.findByIsApproved(isApproved, pageable);
    }
    
    public List<Report> getReportsByDateRange(LocalDate startDate, LocalDate endDate) {
        return reportRepository.findByDateRange(startDate, endDate);
    }
    
    public Page<Report> searchReports(String keyword, Pageable pageable) {
        return reportRepository.searchReports(keyword, pageable);
    }
    
    public Report createReport(Report report) {
        // Validate internship exists
        if (report.getInternship() != null && report.getInternship().getId() != null) {
            Optional<Internship> internshipOpt = internshipRepository.findById(report.getInternship().getId());
            if (internshipOpt.isEmpty()) {
                throw new RuntimeException("Internship not found with id: " + report.getInternship().getId());
            }
            Internship internship = internshipOpt.get();
            report.setInternship(internship);
            // Also set direct student relationship for database compatibility
            if (internship.getStudent() != null) {
                report.setStudent(internship.getStudent());
            }
        }
        
        // Set default values
        if (report.getSubmittedAt() == null) {
            report.setSubmittedAt(LocalDate.now().atStartOfDay());
        }
        if (report.getIsApproved() == null) {
            report.setIsApproved(false);
        }
        
        return reportRepository.save(report);
    }
    
    public Report updateReport(Report report) {
        Optional<Report> existingOpt = reportRepository.findById(report.getId());
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Report not found with id: " + report.getId());
        }
        
        Report existingReport = existingOpt.get();
        
        // Preserve existing relationships if not provided in update
        if (report.getInternship() == null) {
            report.setInternship(existingReport.getInternship());
        } else if (report.getInternship().getId() != null) {
            // Validate internship exists if being changed
            Optional<Internship> internshipOpt = internshipRepository.findById(report.getInternship().getId());
            if (internshipOpt.isEmpty()) {
                throw new RuntimeException("Internship not found with id: " + report.getInternship().getId());
            }
            report.setInternship(internshipOpt.get());
        }
        
        // Preserve student relationship
        if (report.getStudent() == null) {
            report.setStudent(existingReport.getStudent());
        }
        
        return reportRepository.save(report);
    }
    
    public void deleteReport(Long id) {
        if (!reportRepository.existsById(id)) {
            throw new RuntimeException("Report not found with id: " + id);
        }
        reportRepository.deleteById(id);
    }
    
    public Report approveReport(Long id, String feedback) {
        Optional<Report> reportOpt = reportRepository.findById(id);
        if (reportOpt.isEmpty()) {
            throw new RuntimeException("Report not found with id: " + id);
        }
        
        Report report = reportOpt.get();
        report.setIsApproved(true);
        report.setApprovedAt(LocalDate.now());
        if (feedback != null && !feedback.trim().isEmpty()) {
            report.setFeedback(feedback);
        }
        
        return reportRepository.save(report);
    }
    
    public Report rejectReport(Long id, String feedback) {
        Optional<Report> reportOpt = reportRepository.findById(id);
        if (reportOpt.isEmpty()) {
            throw new RuntimeException("Report not found with id: " + id);
        }
        
        Report report = reportOpt.get();
        report.setIsApproved(false);
        report.setApprovedAt(null);
        if (feedback != null && !feedback.trim().isEmpty()) {
            report.setFeedback(feedback);
        }
        
        return reportRepository.save(report);
    }
    
    public long getTotalReportCount() {
        return reportRepository.count();
    }
    
    public long getReportCountByInternship(Long internshipId) {
        return reportRepository.findByInternshipId(internshipId).size();
    }
    
    public long getApprovedReportCount() {
        return reportRepository.findByIsApproved(true).size();
    }
    
    public long getPendingReportCount() {
        return reportRepository.findByIsApproved(false).size();
    }
    
    // New enhanced methods for Reports functionality
    
    public List<Report> getReportsByStudentIdOrdered(Long studentId) {
        return reportRepository.findByStudentIdOrderBySubmittedAtDesc(studentId);
    }
    
    public List<Report> getReportsByStatus(ReportStatus status) {
        return reportRepository.findByStatus(status);
    }
    
    public List<Report> getReportsByType(ReportType type) {
        return reportRepository.findByType(type);
    }
    
    public List<Report> getReportsByStudentAndStatus(Long studentId, ReportStatus status) {
        return reportRepository.findByStudentIdAndStatus(studentId, status);
    }
    
    public List<Report> getReportsByStudentAndType(Long studentId, ReportType type) {
        return reportRepository.findByStudentIdAndType(studentId, type);
    }
    
    public Report createNewReport(Report report, Long studentId, Long internshipId) {
        // Validate internship exists
        Optional<Internship> internshipOpt = internshipRepository.findById(internshipId);
        if (internshipOpt.isEmpty()) {
            throw new RuntimeException("Internship not found with id: " + internshipId);
        }
        
        Internship internship = internshipOpt.get();
        
        // If studentId is provided, validate it matches the internship's student
        if (studentId != null) {
            if (internship.getStudent() == null || !internship.getStudent().getId().equals(studentId)) {
                throw new RuntimeException("Student ID does not match the internship's student");
            }
        }
        
        // Set relationships
        report.setInternship(internship);
        // Also set direct student relationship for database compatibility
        if (internship.getStudent() != null) {
            report.setStudent(internship.getStudent());
        }
        
        // Set default values
        if (report.getStatus() == null) {
            report.setStatus(ReportStatus.PENDING);
        }
        if (report.getSubmittedAt() == null) {
            report.setSubmittedAt(LocalDateTime.now());
        }
        if (report.getReportDate() == null) {
            report.setReportDate(LocalDate.now());
        }
        
        return reportRepository.save(report);
    }
    
    public Report updateReportStatus(Long reportId, ReportStatus status, String feedback, Double grade) {
        Optional<Report> reportOpt = reportRepository.findById(reportId);
        if (reportOpt.isEmpty()) {
            throw new RuntimeException("Report not found with id: " + reportId);
        }
        
        Report report = reportOpt.get();
        report.setStatus(status);
        
        if (feedback != null && !feedback.trim().isEmpty()) {
            report.setFeedback(feedback);
        }
        
        if (grade != null) {
            report.setGrade(grade);
        }
        
        if (status == ReportStatus.APPROVED || status == ReportStatus.REJECTED) {
            report.setReviewedAt(LocalDateTime.now());
        }
        
        return reportRepository.save(report);
    }
    
    public Map<String, Object> getReportStatistics(Long studentId) {
        Map<String, Object> statistics = new HashMap<>();
        
        // Get basic counts
        long totalReports = reportRepository.countByStudentIdAndStatus(studentId, null);
        long approvedReports = reportRepository.countByStudentIdAndStatus(studentId, ReportStatus.APPROVED);
        long pendingReports = reportRepository.countByStudentIdAndStatus(studentId, ReportStatus.PENDING);
        long rejectedReports = reportRepository.countByStudentIdAndStatus(studentId, ReportStatus.REJECTED);
        
        // Get average grade
        Optional<Double> averageGrade = reportRepository.getAverageGradeByStudent(studentId);
        
        statistics.put("totalReports", totalReports);
        statistics.put("approvedReports", approvedReports);
        statistics.put("pendingReports", pendingReports);
        statistics.put("rejectedReports", rejectedReports);
        statistics.put("averageGrade", averageGrade.orElse(0.0));
        
        return statistics;
    }
    
    public boolean canStudentSubmitWeeklyReport(Long studentId, Integer weekNumber) {
        return !reportRepository.existsByStudentIdAndWeekNumber(studentId, weekNumber);
    }
    
    public Integer getNextWeekNumber(Long studentId) {
        List<Report> weeklyReports = reportRepository.findByStudentIdAndType(studentId, ReportType.WEEKLY);
        return weeklyReports.size() + 1;
    }
    
    public Optional<Report> getLatestReportByType(Long studentId, ReportType type) {
        return reportRepository.findLatestReportByStudentAndType(studentId, type);
    }
}