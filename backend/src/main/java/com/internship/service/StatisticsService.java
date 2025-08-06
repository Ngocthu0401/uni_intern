package com.internship.service;

import com.internship.repository.InternshipRepository;
import com.internship.repository.StudentRepository;
import com.internship.repository.CompanyRepository;
import com.internship.enums.InternshipStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class StatisticsService {
    
    @Autowired
    private InternshipRepository internshipRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private CompanyRepository companyRepository;
    
    @Autowired
    private StudentService studentService;
    
    // Internship statistics
    public long getTotalInternshipCount() {
        return internshipRepository.count();
    }
    
    public long getOngoingInternshipCount() {
        return internshipRepository.countByStatus(InternshipStatus.IN_PROGRESS);
    }
    
    public long getCompletedInternshipCount() {
        return internshipRepository.countByStatus(InternshipStatus.COMPLETED);
    }
    
    public Map<String, Long> getInternshipStatisticsByMonth() {
        // TODO: Implement query to get statistics by month
        Map<String, Long> stats = new HashMap<>();
        stats.put("2024-01", 5L);
        stats.put("2024-02", 8L);
        stats.put("2024-03", 12L);
        return stats;
    }
    
    // Student statistics
    public long getStudentsWithInternshipCount() {
        return studentService.getStudentsWithInternshipCount();
    }
    
    public long getStudentsWithoutInternshipCount() {
        return studentService.getStudentsWithoutInternshipCount();
    }
    
    public Map<String, Long> getStudentStatisticsByStatus() {
        return studentService.getStudentStatisticsByStatus();
    }
    
    public Map<String, Long> getStudentStatisticsByClass() {
        return studentService.getStudentStatisticsByClass();
    }
    
    // Company statistics
    public Map<String, Long> getCompanyStatisticsByIndustry() {
        // TODO: Implement proper query to group by industry
        Map<String, Long> stats = new HashMap<>();
        stats.put("Technology", 15L);
        stats.put("Finance", 8L);
        stats.put("Healthcare", 5L);
        stats.put("Education", 3L);
        return stats;
    }
    
    // Recent activities
    public List<Map<String, Object>> getRecentActivities(int limit) {
        // TODO: Implement recent activities query
        return List.of(
            Map.of(
                "id", 1L,
                "type", "INTERNSHIP_CREATED",
                "description", "New internship created",
                "timestamp", System.currentTimeMillis()
            ),
            Map.of(
                "id", 2L,
                "type", "STUDENT_ENROLLED",
                "description", "Student enrolled in internship",
                "timestamp", System.currentTimeMillis() - 3600000
            ),
            Map.of(
                "id", 3L,
                "type", "COMPANY_REGISTERED",
                "description", "New company registered",
                "timestamp", System.currentTimeMillis() - 7200000
            )
        );
    }
} 