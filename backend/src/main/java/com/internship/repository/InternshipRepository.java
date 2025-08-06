package com.internship.repository;

import com.internship.entity.Internship;
import com.internship.enums.InternshipStatus;
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
public interface InternshipRepository extends JpaRepository<Internship, Long> {
    
    Optional<Internship> findByInternshipCode(String internshipCode);
    
    boolean existsByInternshipCode(String internshipCode);
    
    @Query("SELECT i FROM Internship i LEFT JOIN FETCH i.student s LEFT JOIN FETCH s.user WHERE i.student.id = :studentId")
    List<Internship> findByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT i FROM Internship i LEFT JOIN FETCH i.student s LEFT JOIN FETCH s.user LEFT JOIN FETCH i.company LEFT JOIN FETCH i.mentor LEFT JOIN FETCH i.internshipBatch WHERE i.teacher.id = :teacherId")
    List<Internship> findByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT i FROM Internship i LEFT JOIN FETCH i.student s LEFT JOIN FETCH s.user LEFT JOIN FETCH i.company LEFT JOIN FETCH i.teacher LEFT JOIN FETCH i.internshipBatch WHERE i.mentor.id = :mentorId")
    List<Internship> findByMentorId(@Param("mentorId") Long mentorId);
    
    @Query("SELECT i FROM Internship i LEFT JOIN FETCH i.student s LEFT JOIN FETCH s.user LEFT JOIN FETCH i.teacher LEFT JOIN FETCH i.mentor LEFT JOIN FETCH i.internshipBatch WHERE i.company.id = :companyId")
    List<Internship> findByCompanyId(@Param("companyId") Long companyId);
    
    @Query("SELECT i FROM Internship i LEFT JOIN FETCH i.student s LEFT JOIN FETCH s.user LEFT JOIN FETCH i.company LEFT JOIN FETCH i.mentor LEFT JOIN FETCH i.teacher WHERE i.internshipBatch.id = :batchId")
    List<Internship> findByInternshipBatchId(@Param("batchId") Long batchId);
    
    @Query("SELECT i FROM Internship i LEFT JOIN FETCH i.student s LEFT JOIN FETCH s.user LEFT JOIN FETCH i.company LEFT JOIN FETCH i.mentor LEFT JOIN FETCH i.teacher LEFT JOIN FETCH i.internshipBatch WHERE i.status = :status")
    List<Internship> findByStatus(@Param("status") InternshipStatus status);
    
    @Query("SELECT i FROM Internship i WHERE i.student.id = :studentId AND i.status = :status")
    List<Internship> findByStudentIdAndStatus(@Param("studentId") Long studentId, 
                                            @Param("status") InternshipStatus status);
    
    @Query("SELECT i FROM Internship i WHERE i.teacher.id = :teacherId AND i.status = :status")
    Page<Internship> findByTeacherIdAndStatus(@Param("teacherId") Long teacherId, 
                                            @Param("status") InternshipStatus status, 
                                            Pageable pageable);
    
    @Query("SELECT i FROM Internship i WHERE i.internshipBatch.id = :batchId AND i.status = :status")
    Page<Internship> findByBatchIdAndStatus(@Param("batchId") Long batchId, 
                                          @Param("status") InternshipStatus status, 
                                          Pageable pageable);
    
    @Query("SELECT i FROM Internship i WHERE " +
           "i.startDate >= :startDate AND i.endDate <= :endDate")
    List<Internship> findByDateRange(@Param("startDate") LocalDate startDate, 
                                   @Param("endDate") LocalDate endDate);
    
    @Query("SELECT i FROM Internship i " +
           "LEFT JOIN FETCH i.student s LEFT JOIN FETCH s.user " +
           "LEFT JOIN FETCH i.company LEFT JOIN FETCH i.mentor LEFT JOIN FETCH i.teacher LEFT JOIN FETCH i.internshipBatch " +
           "WHERE LOWER(i.internshipCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.student.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.company.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.jobTitle) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Internship> searchInternships(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT i FROM Internship i " +
           "LEFT JOIN FETCH i.student s LEFT JOIN FETCH s.user " +
           "LEFT JOIN FETCH i.company LEFT JOIN FETCH i.mentor LEFT JOIN FETCH i.teacher LEFT JOIN FETCH i.internshipBatch")
    List<Internship> findAllWithDetails();
    
    @Query("SELECT COUNT(i) FROM Internship i WHERE i.status = :status")
    Long countByStatus(@Param("status") InternshipStatus status);
    
    @Query("SELECT COUNT(i) FROM Internship i WHERE i.internshipBatch.id = :batchId")
    Long countByBatchId(@Param("batchId") Long batchId);
    
    // Statistics by month
    @Query("SELECT FUNCTION('DATE_FORMAT', i.startDate, '%Y-%m'), COUNT(i) " +
           "FROM Internship i WHERE i.startDate >= :startDate " +
           "GROUP BY FUNCTION('DATE_FORMAT', i.startDate, '%Y-%m') " +
           "ORDER BY FUNCTION('DATE_FORMAT', i.startDate, '%Y-%m')")
    List<Object[]> countInternshipsByMonth(@Param("startDate") LocalDate startDate);
    
    // Recent internships for activities
    @Query("SELECT i FROM Internship i ORDER BY i.createdAt DESC")
    List<Internship> findTop10ByOrderByCreatedAtDesc(Pageable pageable);
} 