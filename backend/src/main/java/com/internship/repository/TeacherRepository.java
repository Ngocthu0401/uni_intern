package com.internship.repository;

import com.internship.entity.Teacher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    
    Optional<Teacher> findByTeacherCode(String teacherCode);
    
    Optional<Teacher> findByUserId(Long userId);
    
    boolean existsByTeacherCode(String teacherCode);
    
    @Query("SELECT t FROM Teacher t JOIN FETCH t.user WHERE " +
           "LOWER(t.teacherCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.user.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.department) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.specialization) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Teacher> searchTeachers(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT t FROM Teacher t JOIN FETCH t.user WHERE t.department = :department")
    Page<Teacher> findByDepartment(@Param("department") String department, Pageable pageable);
    
    @Query("SELECT t FROM Teacher t JOIN FETCH t.user WHERE t.specialization = :specialization")
    Page<Teacher> findBySpecialization(@Param("specialization") String specialization, Pageable pageable);
} 