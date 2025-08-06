package com.internship.service;

import com.internship.dto.request.CreateTeacherRequest;
import com.internship.entity.*;
import com.internship.enums.InternshipStatus;
import com.internship.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class TeacherService {
    
    @Autowired
    private TeacherRepository teacherRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private InternshipRepository internshipRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private EvaluationRepository evaluationRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    
    @Autowired
    private EntityManager entityManager;
    
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }
    
    public Page<Teacher> getAllTeachers(Pageable pageable) {
        return teacherRepository.findAll(pageable);
    }
    
    public Optional<Teacher> getTeacherById(Long id) {
        return teacherRepository.findById(id);
    }
    
    public Optional<Teacher> getTeacherByCode(String teacherCode) {
        return teacherRepository.findByTeacherCode(teacherCode);
    }
    
    public Optional<Teacher> getTeacherByUserId(Long userId) {
        return teacherRepository.findByUserId(userId);
    }
    
    public Page<Teacher> searchTeachers(String keyword, Pageable pageable) {
        return teacherRepository.searchTeachers(keyword, pageable);
    }
    
    public Page<Teacher> getTeachersByDepartment(String department, Pageable pageable) {
        return teacherRepository.findByDepartment(department, pageable);
    }
    
    public Page<Teacher> getTeachersBySpecialization(String specialization, Pageable pageable) {
        return teacherRepository.findBySpecialization(specialization, pageable);
    }
    
    public Teacher createTeacher(Teacher teacher) {
        // Validate teacher code uniqueness
        if (teacherRepository.existsByTeacherCode(teacher.getTeacherCode())) {
            throw new RuntimeException("Teacher code already exists: " + teacher.getTeacherCode());
        }
        
        // Validate user exists
        if (teacher.getUser() != null && teacher.getUser().getId() != null) {
            Optional<User> userOpt = userRepository.findById(teacher.getUser().getId());
            if (userOpt.isEmpty()) {
                throw new RuntimeException("User not found with id: " + teacher.getUser().getId());
            }
            teacher.setUser(userOpt.get());
        }
        
        return teacherRepository.save(teacher);
    }
    
    public Teacher createTeacherWithUser(CreateTeacherRequest request) {
        // Validate teacher code uniqueness
        if (teacherRepository.existsByTeacherCode(request.getTeacherCode())) {
            throw new RuntimeException("Teacher code already exists: " + request.getTeacherCode());
        }
        
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }
        
        // Create User first
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encode password
        user.setRole(request.getRole());
        user.setIsActive(true);
        
        System.out.println("Creating user with username: " + request.getUsername() + ", email: " + request.getEmail());
        User savedUser = userRepository.save(user);
        entityManager.flush(); // Force immediate database save
        System.out.println("User saved with ID: " + savedUser.getId());
        
        // Verify user was saved properly
        if (savedUser.getId() == null) {
            throw new RuntimeException("Failed to save user - no ID generated");
        }
        
        // Create Teacher
        Teacher teacher = new Teacher();
        teacher.setUser(savedUser);
        teacher.setTeacherCode(request.getTeacherCode());
        teacher.setDepartment(request.getDepartment());
        teacher.setPosition(request.getPosition());
        teacher.setDegree(request.getDegree());
        teacher.setSpecialization(request.getSpecialization());
        teacher.setOfficeLocation(request.getOfficeLocation());
        
        System.out.println("Creating teacher with code: " + request.getTeacherCode() + " for user ID: " + savedUser.getId());
        Teacher savedTeacher = teacherRepository.save(teacher);
        System.out.println("Teacher saved with ID: " + savedTeacher.getId());
        
        // Verify teacher has user information
        if (savedTeacher.getUser() == null) {
            System.err.println("WARNING: Saved teacher does not have user information!");
            // Re-fetch to ensure user relationship is loaded
            savedTeacher = teacherRepository.findById(savedTeacher.getId()).orElse(savedTeacher);
        }
        
        // Send email with login credentials
        try {
            emailService.sendPassword(
                savedUser.getEmail(), 
                savedUser.getFullName(), 
                savedUser.getUsername(), 
                request.getPassword(), 
                savedUser.getRole().toString()
            );
        } catch (Exception e) {
            System.err.println("Failed to send email to teacher: " + e.getMessage());
            // Continue execution even if email fails
        }
        
        System.out.println("Final teacher user info: " + (savedTeacher.getUser() != null ? savedTeacher.getUser().getFullName() : "NULL"));
        return savedTeacher;
    }
    
    public Teacher updateTeacher(Teacher teacher) {
        Optional<Teacher> existingOpt = teacherRepository.findById(teacher.getId());
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Teacher not found with id: " + teacher.getId());
        }
        
        Teacher existing = existingOpt.get();
        
        // Check if teacher code is being changed and if new code already exists
        if (!existing.getTeacherCode().equals(teacher.getTeacherCode()) &&
            teacherRepository.existsByTeacherCode(teacher.getTeacherCode())) {
            throw new RuntimeException("Teacher code already exists: " + teacher.getTeacherCode());
        }
        
        // IMPORTANT: Preserve the User relationship from existing teacher
        teacher.setUser(existing.getUser());
        
        // Preserve other audit fields from BaseEntity
        teacher.setCreatedAt(existing.getCreatedAt());
        teacher.setUpdatedAt(existing.getUpdatedAt());
        
        System.out.println("Updating teacher ID: " + teacher.getId() + " with User ID: " + 
            (teacher.getUser() != null ? teacher.getUser().getId() : "NULL"));
        
        Teacher updatedTeacher = teacherRepository.save(teacher);
        
        // Verify user information is preserved
        System.out.println("Updated teacher user info: " + 
            (updatedTeacher.getUser() != null ? updatedTeacher.getUser().getFullName() : "NULL"));
        
        return updatedTeacher;
    }
    
    public Teacher updateTeacherInfo(Long teacherId, Teacher teacherData) {
        Optional<Teacher> existingOpt = teacherRepository.findById(teacherId);
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Teacher not found with id: " + teacherId);
        }
        
        Teacher existing = existingOpt.get();
        
        // Check if teacher code is being changed and if new code already exists
        if (!existing.getTeacherCode().equals(teacherData.getTeacherCode()) &&
            teacherRepository.existsByTeacherCode(teacherData.getTeacherCode())) {
            throw new RuntimeException("Teacher code already exists: " + teacherData.getTeacherCode());
        }
        
        // Update only the allowed fields, preserve User and audit info
        existing.setTeacherCode(teacherData.getTeacherCode());
        existing.setDepartment(teacherData.getDepartment());
        existing.setPosition(teacherData.getPosition());
        existing.setDegree(teacherData.getDegree());
        existing.setSpecialization(teacherData.getSpecialization());
        existing.setOfficeLocation(teacherData.getOfficeLocation());
        
        System.out.println("Updating teacher info for ID: " + teacherId + " with User ID: " + 
            (existing.getUser() != null ? existing.getUser().getId() : "NULL"));
        
        Teacher updatedTeacher = teacherRepository.save(existing);
        
        System.out.println("Updated teacher user info preserved: " + 
            (updatedTeacher.getUser() != null ? updatedTeacher.getUser().getFullName() : "NULL"));
        
        return updatedTeacher;
    }
    
    public void deleteTeacher(Long id) {
        if (!teacherRepository.existsById(id)) {
            throw new RuntimeException("Teacher not found with id: " + id);
        }
        teacherRepository.deleteById(id);
    }
    
    public boolean existsByTeacherCode(String teacherCode) {
        return teacherRepository.existsByTeacherCode(teacherCode);
    }
    
    public long getTotalTeacherCount() {
        return teacherRepository.count();
    }
    
    public Map<String, Object> getTeacherStatistics(Long userId) {
        // Find teacher by user ID, not teacher ID
        Optional<Teacher> teacherOpt = teacherRepository.findByUserId(userId);
        if (teacherOpt.isEmpty()) {
            throw new RuntimeException("Teacher not found with user id: " + userId);
        }
        
        Teacher teacher = teacherOpt.get();
        Long teacherId = teacher.getId();
        Map<String, Object> statistics = new HashMap<>();
        
        // Get all internships supervised by this teacher
        List<Internship> internships = internshipRepository.findByTeacherId(teacherId);
        
        // Get all reports for internships supervised by this teacher
        List<Report> reports = reportRepository.findByTeacherId(teacherId);
        
        // Get all evaluations for internships supervised by this teacher
        List<Evaluation> evaluations = evaluationRepository.findByTeacherId(teacherId);
        
        // Get unique students from internships
        List<Student> students = internships.stream()
            .filter(i -> i.getStudent() != null)
            .map(Internship::getStudent)
            .distinct()
            .collect(Collectors.toList());
        
        // Calculate overview statistics
        Map<String, Object> overview = new HashMap<>();
        overview.put("totalStudents", students.size());
        overview.put("activeInternships", internships.stream().filter(i -> InternshipStatus.IN_PROGRESS.equals(i.getStatus())).count());
        overview.put("completedInternships", internships.stream().filter(i -> InternshipStatus.COMPLETED.equals(i.getStatus())).count());
        
        // Count pending reports based on approval status
        long pendingReports = reports.stream().filter(r -> 
            (r.getIsApprovedByTeacher() == null || !r.getIsApprovedByTeacher()) &&
            (r.getIsApprovedByMentor() == null || !r.getIsApprovedByMentor())
        ).count();
        overview.put("pendingReports", pendingReports);
        
        // Calculate average grade using overallScore
        List<Evaluation> validEvaluations = evaluations.stream()
            .filter(e -> e.getOverallScore() != null && e.getOverallScore() > 0)
            .collect(Collectors.toList());
        double averageGrade = validEvaluations.isEmpty() ? 0 : 
            validEvaluations.stream().mapToDouble(Evaluation::getOverallScore).average().orElse(0);
        overview.put("averageGrade", Math.round(averageGrade * 100.0) / 100.0);
        
        // Calculate completion rate
        double completionRate = internships.isEmpty() ? 0 : 
            (double) internships.stream().filter(i -> InternshipStatus.COMPLETED.equals(i.getStatus())).count() / internships.size() * 100;
        overview.put("completionRate", Math.round(completionRate * 100.0) / 100.0);
        
        statistics.put("overview", overview);
        
        // Calculate grade distribution
        Map<String, Object> gradeDistribution = new HashMap<>();
        gradeDistribution.put("excellent", validEvaluations.stream().filter(e -> e.getOverallScore() >= 9).count());
        gradeDistribution.put("good", validEvaluations.stream().filter(e -> e.getOverallScore() >= 7 && e.getOverallScore() < 9).count());
        gradeDistribution.put("average", validEvaluations.stream().filter(e -> e.getOverallScore() >= 5 && e.getOverallScore() < 7).count());
        gradeDistribution.put("poor", validEvaluations.stream().filter(e -> e.getOverallScore() < 5).count());
        statistics.put("gradeDistribution", gradeDistribution);
        
        // Calculate report statistics
        Map<String, Object> reportStatistics = new HashMap<>();
        reportStatistics.put("totalReports", reports.size());
        reportStatistics.put("approvedReports", reports.stream().filter(r -> 
            (r.getIsApprovedByTeacher() != null && r.getIsApprovedByTeacher()) ||
            (r.getIsApprovedByMentor() != null && r.getIsApprovedByMentor())
        ).count());
        reportStatistics.put("pendingReports", pendingReports);
        reportStatistics.put("rejectedReports", reports.stream().filter(r -> 
            (r.getIsApprovedByTeacher() != null && !r.getIsApprovedByTeacher() && r.getTeacherComment() != null) ||
            (r.getIsApprovedByMentor() != null && !r.getIsApprovedByMentor() && r.getMentorComment() != null)
        ).count());
        reportStatistics.put("averageSubmissionTime", 0); // Could be calculated based on submission patterns
        statistics.put("reportStatistics", reportStatistics);
        
        // Calculate company distribution
        Map<String, Long> companyCount = internships.stream()
            .filter(i -> i.getCompany() != null && i.getCompany().getCompanyName() != null)
            .collect(Collectors.groupingBy(i -> i.getCompany().getCompanyName(), Collectors.counting()));
        
        List<Map<String, Object>> companyDistribution = companyCount.entrySet().stream()
            .map(entry -> {
                Map<String, Object> company = new HashMap<>();
                company.put("name", entry.getKey());
                company.put("count", entry.getValue());
                return company;
            })
            .sorted((a, b) -> Long.compare((Long) b.get("count"), (Long) a.get("count")))
            .limit(10)
            .collect(Collectors.toList());
        statistics.put("companyDistribution", companyDistribution);
        
        // Get top performers
        List<Map<String, Object>> topPerformers = validEvaluations.stream()
            .filter(e -> e.getInternship() != null && e.getInternship().getStudent() != null)
            .collect(Collectors.toMap(
                e -> e.getInternship().getStudent().getId(),
                e -> {
                    Map<String, Object> performer = new HashMap<>();
                    Student student = e.getInternship().getStudent();
                    performer.put("id", student.getId());
                    performer.put("name", student.getUser().getFullName());
                    performer.put("studentCode", student.getStudentCode());
                    performer.put("company", e.getInternship().getCompany() != null ? 
                        e.getInternship().getCompany().getCompanyName() : "N/A");
                    performer.put("grade", e.getOverallScore());
                    performer.put("status", e.getInternship().getStatus());
                    return performer;
                },
                (existing, replacement) -> (Double) existing.get("grade") >= (Double) replacement.get("grade") ? existing : replacement
            ))
            .values()
            .stream()
            .sorted((a, b) -> Double.compare((Double) b.get("grade"), (Double) a.get("grade")))
            .limit(5)
            .collect(Collectors.toList());
        statistics.put("topPerformers", topPerformers);
        
        // Monthly progress (simplified - could be expanded with real date calculations)
        List<Map<String, Object>> monthlyProgress = Arrays.asList(
            createMonthlyData("T1", 2, 8),
            createMonthlyData("T2", 5, 12), 
            createMonthlyData("T3", 8, 15),
            createMonthlyData("T4", 12, 18),
            createMonthlyData("T5", 15, 20),
            createMonthlyData("T6", 18, 15)
        );
        statistics.put("monthlyProgress", monthlyProgress);
        
        return statistics;
    }
    
    private Map<String, Object> createMonthlyData(String month, int completed, int active) {
        Map<String, Object> data = new HashMap<>();
        data.put("month", month);
        data.put("completed", completed);
        data.put("active", active);
        return data;
    }
} 