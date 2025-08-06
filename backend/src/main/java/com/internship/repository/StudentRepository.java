package com.internship.repository;

import com.internship.entity.Student;
import com.internship.enums.StudentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

       @Query("SELECT DISTINCT s FROM Student s LEFT JOIN FETCH s.user LEFT JOIN FETCH s.internships")
       Page<Student> findAllWithInternships(Pageable pageable);

       Optional<Student> findByStudentCode(String studentCode);

       Optional<Student> findByUserId(Long userId);

       boolean existsByStudentCode(String studentCode);

       @Query("SELECT DISTINCT s FROM Student s " +
                     "LEFT JOIN FETCH s.user " +
                     "LEFT JOIN FETCH s.internships i " +
                     "WHERE (:keyword IS NULL OR " +
                     "LOWER(s.studentCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                     "LOWER(s.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                     "LOWER(s.user.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                     "LOWER(s.className) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                     "LOWER(s.major) LIKE LOWER(CONCAT('%', :keyword, '%')))")
       Page<Student> searchStudents(@Param("keyword") String keyword, Pageable pageable);

       @Query("SELECT s FROM Student s JOIN FETCH s.user WHERE s.className = :className")
       Page<Student> findByClassName(@Param("className") String className, Pageable pageable);

       @Query("SELECT s FROM Student s JOIN FETCH s.user WHERE s.major = :major")
       Page<Student> findByMajor(@Param("major") String major, Pageable pageable);

       @Query("SELECT s FROM Student s JOIN FETCH s.user WHERE s.academicYear = :academicYear")
       Page<Student> findByAcademicYear(@Param("academicYear") String academicYear, Pageable pageable);

       // Statistics queries - using existing fields
       @Query("SELECT COUNT(DISTINCT s) FROM Student s JOIN s.internships i WHERE i.id IS NOT NULL")
       long countStudentsWithInternships();

       @Query("SELECT COUNT(s) FROM Student s WHERE s NOT IN (SELECT DISTINCT s2 FROM Student s2 JOIN s2.internships i2)")
       long countStudentsWithoutInternships();

       // Statistics by major instead of status (since status doesn't exist)
       @Query("SELECT s.major, COUNT(s) FROM Student s WHERE s.major IS NOT NULL GROUP BY s.major")
       List<Object[]> countStudentsByMajor();

       @Query("SELECT s.className, COUNT(s) FROM Student s WHERE s.className IS NOT NULL GROUP BY s.className")
       List<Object[]> countStudentsByClass();

       // Advanced search with internships
       @Query("SELECT DISTINCT s FROM Student s " +
                     "LEFT JOIN FETCH s.user " +
                     "LEFT JOIN FETCH s.internships i " +
                     "LEFT JOIN FETCH i.company " +
                     "LEFT JOIN FETCH i.mentor " +
                     "LEFT JOIN FETCH i.teacher " +
                     "LEFT JOIN FETCH i.internshipBatch " +
                     "WHERE " +
                     "(:keyword IS NULL OR LOWER(s.studentCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                     "LOWER(s.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                     "LOWER(s.user.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
                     "(:className IS NULL OR s.className = :className) AND " +
                     "(:major IS NULL OR s.major = :major) AND " +
                     "(:academicYear IS NULL OR s.academicYear = :academicYear) AND " +
                     "(:minGpa IS NULL OR s.gpa >= :minGpa) AND " +
                     "(:maxGpa IS NULL OR s.gpa <= :maxGpa) AND " +
                     "(:status IS NULL OR s.status = :status)")
       Page<Student> advancedSearch(@Param("keyword") String keyword,
                     @Param("className") String className,
                     @Param("major") String major,
                     @Param("academicYear") String academicYear,
                     @Param("minGpa") Double minGpa,
                     @Param("maxGpa") Double maxGpa,
                     @Param("status") StudentStatus status,
                     Pageable pageable);

       // Export query
       @Query("SELECT s FROM Student s JOIN FETCH s.user WHERE " +
                     "(:keyword IS NULL OR LOWER(s.studentCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                     "LOWER(s.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                     "LOWER(s.user.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
                     "(:className IS NULL OR s.className = :className) AND " +
                     "(:major IS NULL OR s.major = :major) AND " +
                     "(:status IS NULL OR s.status = :status)")
       List<Student> exportStudents(@Param("keyword") String keyword,
                     @Param("className") String className,
                     @Param("major") String major,
                     @Param("status") StudentStatus status);
}