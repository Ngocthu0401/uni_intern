package com.internship.repository;

import com.internship.entity.Mentor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorRepository extends JpaRepository<Mentor, Long> {
    
    Optional<Mentor> findByUserId(Long userId);
    
    List<Mentor> findByCompanyId(Long companyId);
    
    @Query("SELECT m FROM Mentor m JOIN FETCH m.user WHERE " +
           "LOWER(m.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.user.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.position) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.specialization) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Mentor> searchMentors(@Param("keyword") String keyword, Pageable pageable);
}