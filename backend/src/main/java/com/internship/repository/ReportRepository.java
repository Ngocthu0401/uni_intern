package com.internship.repository;

import com.internship.entity.Report;
import com.internship.enums.ReportStatus;
import com.internship.enums.ReportType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    List<Report> findByInternshipId(Long internshipId);
    
    Optional<Report> findByInternshipIdAndWeekNumber(Long internshipId, Integer weekNumber);
    
    @Query("SELECT r FROM Report r WHERE r.internship.id = :internshipId ORDER BY r.weekNumber ASC")
    List<Report> findByInternshipIdOrderByWeekNumber(@Param("internshipId") Long internshipId);
    
    @Query("SELECT r FROM Report r WHERE r.internship.student.id = :studentId")
    List<Report> findByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT r FROM Report r WHERE r.internship.student.id = :studentId")
    Page<Report> findByStudentId(@Param("studentId") Long studentId, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE r.internship.teacher.id = :teacherId")
    List<Report> findByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT r FROM Report r WHERE r.internship.teacher.id = :teacherId")
    Page<Report> findByTeacherId(@Param("teacherId") Long teacherId, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE r.internship.teacher.id = :teacherId " +
           "AND (:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.internship.student.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.internship.student.studentCode) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:status IS NULL OR r.status = :status)")
    Page<Report> findByTeacherIdWithFilters(@Param("teacherId") Long teacherId, 
                                          @Param("keyword") String keyword, 
                                          @Param("status") ReportStatus status, 
                                          Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE r.internship.mentor.id = :mentorId")
    List<Report> findByMentorId(@Param("mentorId") Long mentorId);
    
    @Query("SELECT r FROM Report r WHERE r.internship.mentor.id = :mentorId")
    Page<Report> findByMentorId(@Param("mentorId") Long mentorId, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE " +
           "r.reportDate >= :startDate AND r.reportDate <= :endDate")
    List<Report> findByDateRange(@Param("startDate") LocalDate startDate, 
                               @Param("endDate") LocalDate endDate);
    
    @Query("SELECT r FROM Report r WHERE r.internship.internshipBatch.id = :batchId")
    List<Report> findByBatchId(@Param("batchId") Long batchId);
    
    @Query("SELECT r FROM Report r WHERE " +
           "r.isApprovedByTeacher = :approved OR r.isApprovedByMentor = :approved")
    List<Report> findByIsApproved(@Param("approved") Boolean approved);
    
    @Query("SELECT r FROM Report r WHERE " +
           "r.isApprovedByTeacher = :approved OR r.isApprovedByMentor = :approved")
    Page<Report> findByIsApproved(@Param("approved") Boolean approved, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE " +
           "r.isApprovedByTeacher = :approved OR r.isApprovedByMentor = :approved")
    Page<Report> findByApprovalStatus(@Param("approved") Boolean approved, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE " +
           "LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.internship.student.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Report> searchReports(@Param("keyword") String keyword, Pageable pageable);
    
    // New methods for enhanced functionality
    
    // Find reports by student ID (using internship.student relationship)
    @Query("SELECT r FROM Report r WHERE r.internship.student.id = :studentId ORDER BY r.submittedAt DESC")
    List<Report> findByStudentIdOrderBySubmittedAtDesc(@Param("studentId") Long studentId);
    
    // Find reports by status
    List<Report> findByStatus(ReportStatus status);
    
    // Find reports by type
    List<Report> findByType(ReportType type);
    
    // Find reports by student and status
    @Query("SELECT r FROM Report r WHERE r.internship.student.id = :studentId AND r.status = :status")
    List<Report> findByStudentIdAndStatus(@Param("studentId") Long studentId, @Param("status") ReportStatus status);
    
    // Find reports by student and type
    @Query("SELECT r FROM Report r WHERE r.internship.student.id = :studentId AND r.type = :type")
    List<Report> findByStudentIdAndType(@Param("studentId") Long studentId, @Param("type") ReportType type);
    
    // Count reports by status
    long countByStatus(ReportStatus status);
    
    // Count reports by student and status
    @Query("SELECT COUNT(r) FROM Report r WHERE r.internship.student.id = :studentId AND r.status = :status")
    long countByStudentIdAndStatus(@Param("studentId") Long studentId, @Param("status") ReportStatus status);
    
    // Count reports by type
    long countByType(ReportType type);
    
    // Get average grade for student
    @Query("SELECT AVG(r.grade) FROM Report r WHERE r.internship.student.id = :studentId AND r.grade IS NOT NULL")
    Optional<Double> getAverageGradeByStudent(@Param("studentId") Long studentId);
    
    // Get latest report by student and type
    @Query("SELECT r FROM Report r WHERE r.internship.student.id = :studentId AND r.type = :type ORDER BY r.submittedAt DESC")
    Optional<Report> findLatestReportByStudentAndType(@Param("studentId") Long studentId, @Param("type") ReportType type);
    
    // Check if student has submitted report for specific week
    @Query("SELECT COUNT(r) > 0 FROM Report r WHERE r.internship.student.id = :studentId AND r.type = 'WEEKLY' AND r.weekNumber = :weekNumber")
    boolean existsByStudentIdAndWeekNumber(@Param("studentId") Long studentId, @Param("weekNumber") Integer weekNumber);
    
    // Get reports statistics by student
    @Query("SELECT " +
           "COUNT(r) as totalReports, " +
           "COUNT(CASE WHEN r.status = 'APPROVED' THEN 1 END) as approvedReports, " +
           "COUNT(CASE WHEN r.status = 'PENDING' THEN 1 END) as pendingReports, " +
           "COUNT(CASE WHEN r.status = 'REJECTED' THEN 1 END) as rejectedReports, " +
           "AVG(r.grade) as averageGrade " +
           "FROM Report r WHERE r.internship.student.id = :studentId")
    Object[] getReportStatisticsByStudent(@Param("studentId") Long studentId);
} 