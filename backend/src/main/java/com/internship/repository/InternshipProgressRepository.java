package com.internship.repository;

import com.internship.entity.InternshipProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InternshipProgressRepository extends JpaRepository<InternshipProgress, Long> {
    
    List<InternshipProgress> findByInternshipId(Long internshipId);
    
    List<InternshipProgress> findByInternshipIdOrderByCurrentWeekDesc(Long internshipId);
    
    Optional<InternshipProgress> findByInternshipIdAndCurrentWeek(Long internshipId, Integer currentWeek);
    
    @Query("SELECT ip FROM InternshipProgress ip WHERE ip.internship.id = :internshipId ORDER BY ip.currentWeek DESC")
    Optional<InternshipProgress> findLatestByInternshipId(@Param("internshipId") Long internshipId);
    
    @Query("SELECT ip FROM InternshipProgress ip WHERE ip.internship.mentor.id = :mentorId ORDER BY ip.updatedAt DESC")
    List<InternshipProgress> findByMentorId(@Param("mentorId") Long mentorId);
    
    @Query("SELECT AVG(ip.overallProgress) FROM InternshipProgress ip WHERE ip.internship.mentor.id = :mentorId")
    Double getAverageProgressByMentorId(@Param("mentorId") Long mentorId);
    
    List<InternshipProgress> findByWeekStartDateBetween(LocalDate startDate, LocalDate endDate);
}