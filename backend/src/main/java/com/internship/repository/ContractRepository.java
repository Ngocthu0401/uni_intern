package com.internship.repository;

import com.internship.entity.Contract;
import com.internship.enums.ContractStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    
    Optional<Contract> findByContractCode(String contractCode);
    
    boolean existsByContractCode(String contractCode);
    
    List<Contract> findByInternshipId(Long internshipId);
    
    List<Contract> findByStatus(ContractStatus status);
    
    @Query("SELECT c FROM Contract c JOIN c.internship i JOIN i.student s WHERE s.id = :studentId")
    List<Contract> findByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT c FROM Contract c JOIN c.internship i JOIN i.company comp WHERE comp.id = :companyId")
    List<Contract> findByCompanyId(@Param("companyId") Long companyId);
    
    @Query("SELECT c FROM Contract c WHERE " +
           "LOWER(c.contractCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.internship.student.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Contract> searchContracts(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT c FROM Contract c WHERE c.status = :status")
    Page<Contract> findByStatus(@Param("status") ContractStatus status, Pageable pageable);
    
    @Query("SELECT c FROM Contract c LEFT JOIN c.internship i LEFT JOIN i.teacher t " +
           "WHERE t.id = :teacherId OR c.createdByTeacher.id = :teacherId")
    Page<Contract> findByTeacherId(@Param("teacherId") Long teacherId, Pageable pageable);
} 