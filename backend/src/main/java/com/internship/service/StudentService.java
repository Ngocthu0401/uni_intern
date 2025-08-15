package com.internship.service;

import com.internship.dto.request.CreateStudentRequest;
import com.internship.dto.response.StudentWithInternshipsDto;
import com.internship.dto.response.InternshipForStudentDto;
import com.internship.entity.Internship;
import com.internship.entity.Student;
import com.internship.entity.User;
import com.internship.enums.StudentStatus;
import com.internship.repository.InternshipRepository;
import com.internship.repository.StudentRepository;
import com.internship.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.ArrayList;

@Service
@Transactional(readOnly = true)
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Page<Student> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    public Page<StudentWithInternshipsDto> getAllStudentsWithInternships(Pageable pageable) {
        Page<Student> studentsPage = studentRepository.findAllWithInternships(pageable);

        // Convert students to DTOs with internships
        List<StudentWithInternshipsDto> studentDtos = studentsPage.getContent().stream()
                .map(student -> {
                    // Use already loaded internships from query
                    List<Internship> studentInternships = student.getInternships() != null ? student.getInternships()
                            : List.of();

                    // Create DTO
                    StudentWithInternshipsDto dto = createStudentDto(student, studentInternships);
                    return dto;
                })
                .collect(Collectors.toList());

        // Create new page with DTOs
        return new org.springframework.data.domain.PageImpl<>(
                studentDtos,
                pageable,
                studentsPage.getTotalElements());
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Optional<Student> getStudentByCode(String studentCode) {
        return studentRepository.findByStudentCode(studentCode);
    }

    public Optional<Student> getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId);
    }

    @Transactional(readOnly = false)
    public Optional<Student> getOrCreateStudentByUserId(Long userId) {
        Optional<Student> existing = studentRepository.findByUserId(userId);
        if (existing.isPresent()) {
            return existing;
        }

        // Create only if user exists and is a STUDENT
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }
        User user = userOpt.get();
        if (user.getRole() != com.internship.enums.RoleType.STUDENT) {
            return Optional.empty();
        }

        // Generate a unique student code based on username (fallback to S{userId})
        String baseCode = (user.getUsername() != null && !user.getUsername().isBlank())
                ? user.getUsername()
                : ("S" + userId);
        String candidateCode = baseCode;
        int suffix = 1;
        while (studentRepository.existsByStudentCode(candidateCode)) {
            candidateCode = baseCode + "_" + suffix;
            suffix++;
        }

        Student student = new Student();
        student.setUser(user);
        student.setStudentCode(candidateCode);
        Student saved = studentRepository.save(student);
        return Optional.of(saved);
    }

    public Page<Student> searchStudents(String keyword, Pageable pageable) {
        return studentRepository.searchStudents(keyword, pageable);
    }

    public Page<StudentWithInternshipsDto> searchStudentsWithInternships(String keyword, Pageable pageable) {
        Page<Student> studentsPage = studentRepository.searchStudents(keyword, pageable);

        // Convert students to DTOs with internships
        List<StudentWithInternshipsDto> studentDtos = studentsPage.getContent().stream()
                .map(student -> {
                    // Use already loaded internships from query
                    List<Internship> studentInternships = student.getInternships() != null ? student.getInternships()
                            : List.of();
                    return createStudentDto(student, studentInternships);
                })
                .collect(Collectors.toList());

        // Create new page with DTOs
        return new org.springframework.data.domain.PageImpl<>(
                studentDtos,
                pageable,
                studentsPage.getTotalElements());
    }

    public Page<Student> getStudentsByClass(String className, Pageable pageable) {
        return studentRepository.findByClassName(className, pageable);
    }

    public Page<Student> getStudentsByMajor(String major, Pageable pageable) {
        return studentRepository.findByMajor(major, pageable);
    }

    public Page<Student> getStudentsByAcademicYear(String academicYear, Pageable pageable) {
        return studentRepository.findByAcademicYear(academicYear, pageable);
    }

    @Transactional(readOnly = false)
    public Student createStudent(Student student) {
        // Validate student code uniqueness
        if (studentRepository.existsByStudentCode(student.getStudentCode())) {
            throw new RuntimeException("Student code already exists: " + student.getStudentCode());
        }

        // Validate user exists
        if (student.getUser() != null && student.getUser().getId() != null) {
            Optional<User> userOpt = userRepository.findById(student.getUser().getId());
            if (userOpt.isEmpty()) {
                throw new RuntimeException("User not found with id: " + student.getUser().getId());
            }
            student.setUser(userOpt.get());
        }

        return studentRepository.save(student);
    }

    @Transactional(readOnly = false)
    public Student createStudentWithUser(CreateStudentRequest request) {
        // Validate student code uniqueness
        if (studentRepository.existsByStudentCode(request.getStudentCode())) {
            throw new RuntimeException("Student code already exists: " + request.getStudentCode());
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

        User savedUser = userRepository.save(user);

        // Create Student
        Student student = new Student();
        student.setUser(savedUser);
        student.setStudentCode(request.getStudentCode());
        student.setClassName(request.getClassName());
        student.setMajor(request.getMajor());
        student.setAcademicYear(request.getAcademicYear());
        student.setGpa(request.getGpa());
        student.setStatus(StudentStatus.ACTIVE); // Set default status

        Student savedStudent = studentRepository.save(student);

        // Send email with login credentials
        try {
            emailService.sendPassword(
                    savedUser.getEmail(),
                    savedUser.getFullName(),
                    savedUser.getUsername(),
                    request.getPassword(),
                    savedUser.getRole().toString());
        } catch (Exception e) {
            System.err.println("Failed to send email to student: " + e.getMessage());
            // Continue execution even if email fails
        }

        return savedStudent;
    }

    @Transactional(readOnly = false)
    public Student updateStudent(Student student) {
        Optional<Student> existingOpt = studentRepository.findById(student.getId());
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Student not found with id: " + student.getId());
        }

        Student existing = existingOpt.get();

        // Check if student code is being changed and if new code already exists
        if (!existing.getStudentCode().equals(student.getStudentCode()) &&
                studentRepository.existsByStudentCode(student.getStudentCode())) {
            throw new RuntimeException("Student code already exists: " + student.getStudentCode());
        }

        // IMPORTANT: Preserve the User relationship from existing student
        student.setUser(existing.getUser());

        // Preserve other audit fields from BaseEntity
        student.setCreatedAt(existing.getCreatedAt());
        student.setUpdatedAt(existing.getUpdatedAt());

        // Preserve other fields that shouldn't be updated via this method
        student.setStatus(existing.getStatus());

        System.out.println("Updating student ID: " + student.getId() + " with User ID: " +
                (student.getUser() != null ? student.getUser().getId() : "NULL"));

        Student updatedStudent = studentRepository.save(student);

        // Verify user information is preserved
        System.out.println("Updated student user info: " +
                (updatedStudent.getUser() != null ? updatedStudent.getUser().getFullName() : "NULL"));

        return updatedStudent;
    }

    @Transactional(readOnly = false)
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    public boolean existsByStudentCode(String studentCode) {
        return studentRepository.existsByStudentCode(studentCode);
    }

    public long getTotalStudentCount() {
        return studentRepository.count();
    }

    // Statistics methods for AdminController
    public long getStudentsWithInternshipCount() {
        return studentRepository.countStudentsWithInternships();
    }

    public long getStudentsWithoutInternshipCount() {
        return studentRepository.countStudentsWithoutInternships();
    }

    public Map<String, Long> getStudentStatisticsByStatus() {
        // Now we can use the actual status field
        List<Student> allStudents = studentRepository.findAll();
        Map<String, Long> statistics = allStudents.stream()
                .collect(Collectors.groupingBy(
                        student -> student.getStatus() != null ? student.getStatus().toString() : "UNKNOWN",
                        Collectors.counting()));

        // Ensure all status types are represented
        for (StudentStatus status : StudentStatus.values()) {
            statistics.putIfAbsent(status.toString(), 0L);
        }

        return statistics;
    }

    public Map<String, Long> getStudentStatisticsByClass() {
        List<Object[]> results = studentRepository.countStudentsByClass();
        Map<String, Long> statistics = new HashMap<>();

        for (Object[] result : results) {
            String className = (String) result[0];
            Long count = (Long) result[1];
            statistics.put(className != null ? className : "UNKNOWN", count);
        }

        return statistics;
    }

    public List<Student> getAvailableStudents() {
        return studentRepository.findAvailableStudents();
    }

    // Advanced search method for StudentController - returns DTOs with internships
    public Page<StudentWithInternshipsDto> advancedSearchStudents(
            String keyword,
            String className,
            String major,
            String academicYear,
            Double minGpa,
            Double maxGpa,
            String status,
            Pageable pageable) {
        // Now we can use the status parameter
        StudentStatus studentStatus = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                studentStatus = StudentStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid status, ignore it
            }
        }

        System.out.println("Calling advancedSearch with params: keyword=" + keyword +
                ", className=" + className + ", major=" + major);

        Page<Student> studentPage = studentRepository.advancedSearch(
                keyword, className, major, academicYear,
                minGpa, maxGpa, studentStatus, pageable);

        System.out.println("Found " + studentPage.getContent().size() + " students from repository");

        // Convert to DTOs with internships
        return studentPage.map(this::convertToStudentWithInternshipsDto);
    }

    // Export method for StudentController
    public List<Student> exportStudents(
            String keyword,
            String className,
            String major,
            String status) {
        // Now we can use the status parameter
        StudentStatus studentStatus = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                studentStatus = StudentStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid status, ignore it
            }
        }

        return studentRepository.exportStudents(keyword, className, major, studentStatus);
    }

    // Recent activities method for AdminController
    public List<Map<String, Object>> getRecentActivities(int limit) {
        // Get recent students (last created/updated)
        Pageable pageable = org.springframework.data.domain.PageRequest.of(0, limit);
        Page<Student> recentStudents = studentRepository.findAll(pageable);

        return recentStudents.getContent().stream()
                .map(student -> {
                    Map<String, Object> activity = new HashMap<>();
                    activity.put("id", student.getId());
                    activity.put("type", "STUDENT_ACTIVITY");
                    activity.put("description",
                            "Student: " + student.getUser().getFullName() + " - " + student.getStudentCode());
                    activity.put("studentName", student.getUser().getFullName());
                    activity.put("studentCode", student.getStudentCode());
                    activity.put("className", student.getClassName());
                    activity.put("timestamp", System.currentTimeMillis());
                    return activity;
                })
                .collect(Collectors.toList());
    }

    public List<StudentWithInternshipsDto> getStudentsByTeacherId(Long teacherId) {
        // Get students through internships supervised by the teacher
        List<Internship> internships = internshipRepository.findByTeacherId(teacherId);

        // Group internships by student
        Map<Student, List<Internship>> studentInternshipsMap = internships.stream()
                .filter(internship -> internship.getStudent() != null)
                .collect(Collectors.groupingBy(Internship::getStudent));

        // Create DTO list with internships attached
        return studentInternshipsMap.entrySet().stream()
                .map(entry -> {
                    Student student = entry.getKey();
                    List<Internship> studentInternships = entry.getValue();
                    return createStudentDto(student, studentInternships);
                })
                .collect(Collectors.toList());
    }

    public List<StudentWithInternshipsDto> getStudentsByBatch(Long batchId) {
        // Get students through internships in the specified batch
        List<Internship> internships = internshipRepository.findByInternshipBatchId(batchId);

        // Group internships by student
        Map<Student, List<Internship>> studentInternshipsMap = internships.stream()
                .filter(internship -> internship.getStudent() != null)
                .collect(Collectors.groupingBy(Internship::getStudent));

        // Create DTO list with internships attached
        return studentInternshipsMap.entrySet().stream()
                .map(entry -> {
                    Student student = entry.getKey();
                    List<Internship> studentInternships = entry.getValue();
                    return createStudentDto(student, studentInternships);
                })
                .collect(Collectors.toList());
    }

    private StudentWithInternshipsDto createStudentDto(Student student, List<Internship> studentInternships) {
        StudentWithInternshipsDto dto = new StudentWithInternshipsDto();
        dto.setId(student.getId());
        dto.setCreatedAt(student.getCreatedAt());
        dto.setUpdatedAt(student.getUpdatedAt());
        dto.setUser(student.getUser());
        dto.setStudentCode(student.getStudentCode());
        dto.setClassName(student.getClassName());
        dto.setMajor(student.getMajor());
        dto.setAcademicYear(student.getAcademicYear());
        dto.setGpa(student.getGpa());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setAddress(student.getAddress());
        dto.setParentName(student.getParentName());
        dto.setParentPhone(student.getParentPhone());
        dto.setStatus(student.getStatus());

        // Convert internships to DTOs (without student reference to avoid circular
        // reference)
        List<InternshipForStudentDto> internshipDtos = studentInternships.stream()
                .map(this::createInternshipDto)
                .collect(Collectors.toList());

        dto.setInternships(internshipDtos);
        return dto;
    }

    private InternshipForStudentDto createInternshipDto(Internship internship) {
        InternshipForStudentDto internshipDto = new InternshipForStudentDto();
        internshipDto.setId(internship.getId());
        internshipDto.setCreatedAt(internship.getCreatedAt());
        internshipDto.setUpdatedAt(internship.getUpdatedAt());
        internshipDto.setTeacher(internship.getTeacher());
        internshipDto.setMentor(internship.getMentor());
        internshipDto.setCompany(internship.getCompany());
        internshipDto.setInternshipBatch(internship.getInternshipBatch());
        internshipDto.setInternshipCode(internship.getInternshipCode());
        internshipDto.setJobTitle(internship.getJobTitle());
        internshipDto.setJobDescription(internship.getJobDescription());
        internshipDto.setRequirements(internship.getRequirements());
        internshipDto.setStartDate(internship.getStartDate());
        internshipDto.setEndDate(internship.getEndDate());
        internshipDto.setStatus(internship.getStatus());
        internshipDto.setWorkingHoursPerWeek(internship.getWorkingHoursPerWeek());
        internshipDto.setSalary(internship.getSalary());
        internshipDto.setBenefits(internship.getBenefits());
        internshipDto.setFinalScore(internship.getFinalScore());
        internshipDto.setTeacherScore(internship.getTeacherScore());
        internshipDto.setMentorScore(internship.getMentorScore());
        internshipDto.setTeacherComment(internship.getTeacherComment());
        internshipDto.setMentorComment(internship.getMentorComment());
        internshipDto.setNotes(internship.getNotes());
        return internshipDto;
    }

    private StudentWithInternshipsDto convertToStudentWithInternshipsDto(Student student) {
        System.out.println("Converting student: " + student.getStudentCode() + " with internships: " +
                (student.getInternships() != null ? student.getInternships().size() : "null"));

        StudentWithInternshipsDto dto = new StudentWithInternshipsDto();
        dto.setId(student.getId());
        dto.setCreatedAt(student.getCreatedAt());
        dto.setUpdatedAt(student.getUpdatedAt());
        dto.setUser(student.getUser());
        dto.setStudentCode(student.getStudentCode());
        dto.setClassName(student.getClassName());
        dto.setMajor(student.getMajor());
        dto.setAcademicYear(student.getAcademicYear());
        dto.setGpa(student.getGpa());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setAddress(student.getAddress());
        dto.setParentName(student.getParentName());
        dto.setParentPhone(student.getParentPhone());
        dto.setStatus(student.getStatus());

        // Convert internships to DTOs
        List<InternshipForStudentDto> internshipDtos;
        if (student.getInternships() != null) {
            internshipDtos = student.getInternships().stream()
                    .map(this::createInternshipDto)
                    .collect(Collectors.toList());
            System.out.println(
                    "Converted " + internshipDtos.size() + " internships for student " + student.getStudentCode());
        } else {
            internshipDtos = new ArrayList<>();
            System.out.println("No internships found for student " + student.getStudentCode());
        }
        dto.setInternships(internshipDtos);

        return dto;
    }
}