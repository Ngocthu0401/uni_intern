package com.internship.repository;

import com.internship.entity.InternshipBatch;
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
public interface InternshipBatchRepository extends JpaRepository<InternshipBatch, Long> {
    
    Optional<InternshipBatch> findByBatchCode(String batchCode);
    
    boolean existsByBatchCode(String batchCode);
    
    List<InternshipBatch> findByIsActive(Boolean isActive);
    
    @Query("SELECT ib FROM InternshipBatch ib WHERE " +
           "ib.registrationStartDate <= :currentDate AND ib.registrationEndDate >= :currentDate AND ib.isActive = true")
    List<InternshipBatch> findActiveRegistrationBatches(@Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT ib FROM InternshipBatch ib WHERE " +
           "ib.startDate <= :currentDate AND ib.endDate >= :currentDate AND ib.isActive = true")
    List<InternshipBatch> findOngoingBatches(@Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT ib FROM InternshipBatch ib WHERE " +
           "LOWER(ib.batchName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(ib.batchCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(ib.semester) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(ib.academicYear) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<InternshipBatch> searchBatches(@Param("keyword") String keyword, Pageable pageable);
} 