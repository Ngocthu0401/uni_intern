package com.internship.service;

import com.internship.entity.Internship;
import com.internship.entity.Company;
import com.internship.entity.Student;
import com.internship.entity.Mentor;
import com.internship.entity.Teacher;
import com.internship.entity.InternshipBatch;
import com.internship.enums.InternshipStatus;
import com.internship.repository.InternshipRepository;
import com.internship.repository.CompanyRepository;
import com.internship.repository.StudentRepository;
import com.internship.repository.MentorRepository;
import com.internship.repository.TeacherRepository;
import com.internship.repository.InternshipBatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class InternshipService {

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private InternshipBatchRepository internshipBatchRepository;

    public List<Internship> getAllInternships() {
        return internshipRepository.findAllWithDetails();
    }

    public Page<Internship> getAllInternships(Pageable pageable) {
        return internshipRepository.findAll(pageable);
    }

    public Optional<Internship> getInternshipById(Long id) {
        return internshipRepository.findById(id);
    }

    public Optional<Internship> getInternshipByCode(String code) {
        return internshipRepository.findByInternshipCode(code);
    }

    public List<Internship> getInternshipsByStudentId(Long studentId) {
        return internshipRepository.findByStudentId(studentId);
    }

    public List<Internship> getInternshipsByTeacherId(Long teacherId) {
        return internshipRepository.findByTeacherId(teacherId);
    }

    public List<Internship> getInternshipsByMentorId(Long mentorId) {
        return internshipRepository.findByMentorId(mentorId);
    }

    public List<Internship> getInternshipsByCompanyId(Long companyId) {
        return internshipRepository.findByCompanyId(companyId);
    }

    public List<Internship> getInternshipsByBatchId(Long batchId) {
        return internshipRepository.findByInternshipBatchId(batchId);
    }

    public List<Internship> getInternshipsByStatus(InternshipStatus status) {
        return internshipRepository.findByStatus(status);
    }

    public Page<Internship> getInternshipsByTeacherIdAndStatus(Long teacherId, InternshipStatus status,
            Pageable pageable) {
        return internshipRepository.findByTeacherIdAndStatus(teacherId, status, pageable);
    }

    public Page<Internship> getInternshipsByBatchIdAndStatus(Long batchId, InternshipStatus status, Pageable pageable) {
        return internshipRepository.findByBatchIdAndStatus(batchId, status, pageable);
    }

    public List<Internship> getInternshipsByDateRange(LocalDate startDate, LocalDate endDate) {
        return internshipRepository.findByDateRange(startDate, endDate);
    }

    public Page<Internship> searchInternships(String keyword, Pageable pageable) {
        return internshipRepository.searchInternships(keyword, pageable);
    }

    public Page<Internship> searchInternshipsWithFilters(String keyword, InternshipStatus status, String companyName,
            Long batchId, Pageable pageable) {
        return internshipRepository.searchInternshipsWithFilters(keyword, status, companyName, batchId, pageable);
    }

    @Transactional(readOnly = false)
    public Internship createInternship(Internship internship) {
        // Validate internship code uniqueness if provided
        if (internship.getInternshipCode() != null && !internship.getInternshipCode().isEmpty()) {
            if (internshipRepository.existsByInternshipCode(internship.getInternshipCode())) {
                throw new RuntimeException("Internship code already exists: " + internship.getInternshipCode());
            }
        } else {
            // Generate internship code if not provided
            internship.setInternshipCode(generateInternshipCode());
        }

        // Set default status if not provided
        if (internship.getStatus() == null) {
            internship.setStatus(InternshipStatus.PENDING);
        }

        return internshipRepository.save(internship);
    }

    @Transactional(readOnly = false)
    public Internship createInternshipFromRequest(com.internship.dto.request.CreateInternshipRequest request) {
        Internship internship = new Internship();

        // Set basic fields
        internship.setJobTitle(request.getJobTitle());
        internship.setJobDescription(request.getJobDescription());
        internship.setRequirements(request.getRequirements());
        internship.setStartDate(request.getStartDate());
        internship.setEndDate(request.getEndDate());
        internship.setStatus(request.getStatus());
        internship.setWorkingHoursPerWeek(request.getWorkingHoursPerWeek());
        internship.setSalary(request.getSalary());
        internship.setBenefits(request.getBenefits());
        internship.setNotes(request.getNotes());

        // Set relationships if IDs are provided
        if (request.getStudentId() != null) {
            Optional<Student> student = studentRepository.findById(request.getStudentId());
            if (student.isPresent()) {
                internship.setStudent(student.get());
            } else {
                throw new RuntimeException("Student not found with ID: " + request.getStudentId());
            }
        }

        if (request.getTeacherId() != null) {
            Optional<Teacher> teacher = teacherRepository.findById(request.getTeacherId());
            if (teacher.isPresent()) {
                internship.setTeacher(teacher.get());
            } else {
                throw new RuntimeException("Teacher not found with ID: " + request.getTeacherId());
            }
        }

        if (request.getMentorId() != null) {
            Optional<Mentor> mentor = mentorRepository.findById(request.getMentorId());
            if (mentor.isPresent()) {
                internship.setMentor(mentor.get());
            } else {
                throw new RuntimeException("Mentor not found with ID: " + request.getMentorId());
            }
        }

        if (request.getCompanyId() != null) {
            Optional<Company> company = companyRepository.findById(request.getCompanyId());
            if (company.isPresent()) {
                internship.setCompany(company.get());
            } else {
                throw new RuntimeException("Company not found with ID: " + request.getCompanyId());
            }
        }

        if (request.getInternshipBatchId() != null) {
            System.out.println("Looking for batch with ID: " + request.getInternshipBatchId());
            Optional<InternshipBatch> batch = internshipBatchRepository.findById(request.getInternshipBatchId());
            if (batch.isPresent()) {
                System.out.println("Found batch: " + batch.get().getBatchName());
                internship.setInternshipBatch(batch.get());
            } else {
                System.out.println("Batch not found with ID: " + request.getInternshipBatchId());
                throw new RuntimeException("Internship batch not found with ID: " + request.getInternshipBatchId());
            }
        }

        // Generate internship code
        internship.setInternshipCode(generateInternshipCode());

        // Set default status if not provided
        if (internship.getStatus() == null) {
            internship.setStatus(InternshipStatus.PENDING);
        }

        return internshipRepository.save(internship);
    }

    @Transactional(readOnly = false)
    public Internship updateInternship(Internship internship) {
        Optional<Internship> existingOpt = internshipRepository.findById(internship.getId());
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Internship not found with id: " + internship.getId());
        }

        // Check if internship code is being changed and if new code already exists
        Internship existing = existingOpt.get();
        if (internship.getInternshipCode() != null &&
                !existing.getInternshipCode().equals(internship.getInternshipCode()) &&
                internshipRepository.existsByInternshipCode(internship.getInternshipCode())) {
            throw new RuntimeException("Internship code already exists: " + internship.getInternshipCode());
        }

        return internshipRepository.save(internship);
    }

    @Transactional
    public Internship patchInternship(Long id, Map<String, Object> updates) {
        Optional<Internship> existingOpt = internshipRepository.findById(id);
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Internship not found with id: " + id);
        }

        Internship existing = existingOpt.get();

        // Update only the provided fields
        updates.forEach((key, value) -> {
            switch (key) {
                case "status":
                    if (value instanceof String) {
                        existing.setStatus(InternshipStatus.valueOf((String) value));
                    }
                    break;
                case "teacherComment":
                    existing.setTeacherComment((String) value);
                    break;
                case "teacherScore":
                    if (value != null) {
                        if (value instanceof Number) {
                            existing.setTeacherScore(((Number) value).doubleValue());
                        }
                    } else {
                        existing.setTeacherScore(null);
                    }
                    break;
                case "finalScore":
                    if (value != null) {
                        if (value instanceof Number) {
                            existing.setFinalScore(((Number) value).doubleValue());
                        }
                    } else {
                        existing.setFinalScore(null);
                    }
                    break;
                case "mentorComment":
                    existing.setMentorComment((String) value);
                    break;
                case "mentorScore":
                    if (value != null) {
                        if (value instanceof Number) {
                            existing.setMentorScore(((Number) value).doubleValue());
                        }
                    } else {
                        existing.setMentorScore(null);
                    }
                    break;
                // Add more fields as needed
            }
        });

        return internshipRepository.save(existing);
    }

    @Transactional(readOnly = false)
    public void deleteInternship(Long id) {
        if (!internshipRepository.existsById(id)) {
            throw new RuntimeException("Internship not found with id: " + id);
        }
        internshipRepository.deleteById(id);
    }

    public Internship assignTeacher(Long internshipId, Long teacherId) {
        Optional<Internship> internshipOpt = internshipRepository.findById(internshipId);
        if (internshipOpt.isPresent()) {
            Internship internship = internshipOpt.get();
            // Set teacher (you'll need to inject TeacherService or TeacherRepository)
            internship.setStatus(InternshipStatus.ASSIGNED);
            return internshipRepository.save(internship);
        }
        return null;
    }

    public Internship assignMentor(Long internshipId, Long mentorId) {
        Optional<Internship> internshipOpt = internshipRepository.findById(internshipId);
        if (internshipOpt.isPresent()) {
            Internship internship = internshipOpt.get();
            // Set mentor (you'll need to inject MentorService or MentorRepository)
            internship.setStatus(InternshipStatus.ASSIGNED);
            return internshipRepository.save(internship);
        }
        return null;
    }

    @Transactional(readOnly = false)
    public Internship assignInternship(Long internshipId, Long companyId, Long studentId, Long mentorId,
            Long teacherId) {
        Optional<Internship> internshipOpt = internshipRepository.findById(internshipId);
        if (internshipOpt.isPresent()) {
            Internship internship = internshipOpt.get();

            // Assign company if provided
            if (companyId != null) {
                Optional<Company> companyOpt = companyRepository.findById(companyId);
                if (companyOpt.isPresent()) {
                    internship.setCompany(companyOpt.get());
                } else {
                    throw new RuntimeException("Company not found with ID: " + companyId);
                }
            }

            // Assign student if provided
            if (studentId != null) {
                Optional<Student> studentOpt = studentRepository.findById(studentId);
                if (studentOpt.isPresent()) {
                    internship.setStudent(studentOpt.get());
                } else {
                    throw new RuntimeException("Student not found with ID: " + studentId);
                }
            }

            // Assign mentor if provided
            if (mentorId != null) {
                Optional<Mentor> mentorOpt = mentorRepository.findById(mentorId);
                if (mentorOpt.isPresent()) {
                    internship.setMentor(mentorOpt.get());
                } else {
                    throw new RuntimeException("Mentor not found with ID: " + mentorId);
                }
            }

            // Assign teacher if provided
            if (teacherId != null) {
                Optional<Teacher> teacherOpt = teacherRepository.findById(teacherId);
                if (teacherOpt.isPresent()) {
                    internship.setTeacher(teacherOpt.get());
                } else {
                    throw new RuntimeException("Teacher not found with ID: " + teacherId);
                }
            }

            // Update status to ASSIGNED
            internship.setStatus(InternshipStatus.ASSIGNED);

            return internshipRepository.save(internship);
        }
        throw new RuntimeException("Internship not found with ID: " + internshipId);
    }

    public Internship startInternship(Long internshipId) {
        Optional<Internship> internshipOpt = internshipRepository.findById(internshipId);
        if (internshipOpt.isPresent()) {
            Internship internship = internshipOpt.get();
            internship.setStatus(InternshipStatus.IN_PROGRESS);
            internship.setStartDate(LocalDate.now());
            return internshipRepository.save(internship);
        }
        return null;
    }

    public Internship completeInternship(Long internshipId) {
        Optional<Internship> internshipOpt = internshipRepository.findById(internshipId);
        if (internshipOpt.isPresent()) {
            Internship internship = internshipOpt.get();
            internship.setStatus(InternshipStatus.COMPLETED);
            internship.setEndDate(LocalDate.now());
            return internshipRepository.save(internship);
        }
        return null;
    }

    public Long countByStatus(InternshipStatus status) {
        return internshipRepository.countByStatus(status);
    }

    public Long countByBatchId(Long batchId) {
        return internshipRepository.countByBatchId(batchId);
    }

    // Statistics methods
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
        // Get statistics for last 12 months
        LocalDate startDate = LocalDate.now().minusMonths(11);
        Map<String, Long> statistics = new HashMap<>();

        // Generate months for last 12 months
        LocalDate current = startDate;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        for (int i = 0; i < 12; i++) {
            String monthKey = current.format(formatter);

            // Count internships that started in this month
            List<Internship> monthlyInternships = getInternshipsByDateRange(
                    current.withDayOfMonth(1),
                    current.withDayOfMonth(current.lengthOfMonth()));

            statistics.put(monthKey, (long) monthlyInternships.size());
            current = current.plusMonths(1);
        }

        return statistics;
    }

    public Internship approveInternship(Long internshipId) {
        Optional<Internship> internshipOpt = internshipRepository.findById(internshipId);
        if (internshipOpt.isEmpty()) {
            throw new RuntimeException("Internship not found with id: " + internshipId);
        }

        Internship internship = internshipOpt.get();
        if (internship.getStatus() != InternshipStatus.PENDING) {
            throw new RuntimeException(
                    "Can only approve internships with PENDING status. Current status: " + internship.getStatus());
        }

        internship.setStatus(InternshipStatus.APPROVED);
        return internshipRepository.save(internship);
    }

    public Internship rejectInternship(Long internshipId) {
        Optional<Internship> internshipOpt = internshipRepository.findById(internshipId);
        if (internshipOpt.isEmpty()) {
            throw new RuntimeException("Internship not found with id: " + internshipId);
        }

        Internship internship = internshipOpt.get();
        if (internship.getStatus() != InternshipStatus.PENDING) {
            throw new RuntimeException(
                    "Can only reject internships with PENDING status. Current status: " + internship.getStatus());
        }

        internship.setStatus(InternshipStatus.REJECTED);
        return internshipRepository.save(internship);
    }

    private String generateInternshipCode() {
        // Simple code generation - you can make this more sophisticated
        return "INT" + System.currentTimeMillis();
    }

    public Map<String, Long> getInternshipStatistics() {
        Map<String, Long> statistics = new HashMap<>();

        // Count by status
        for (InternshipStatus status : InternshipStatus.values()) {
            Long count = countByStatus(status);
            statistics.put(status.toString().toLowerCase(), count);
        }

        // Total count
        Long total = getTotalInternshipCount();
        statistics.put("total", total);

        return statistics;
    }
}