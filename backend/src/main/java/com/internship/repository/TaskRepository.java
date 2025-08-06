package com.internship.repository;

import com.internship.entity.Task;
import com.internship.entity.Task.TaskStatus;
import com.internship.entity.Task.TaskPriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByInternshipId(Long internshipId);
    
    List<Task> findByInternshipIdOrderByCreatedAtDesc(Long internshipId);
    
    List<Task> findByMentorId(Long mentorId);
    
    List<Task> findByStudentId(Long studentId);
    
    List<Task> findByStatus(TaskStatus status);
    
    List<Task> findByPriority(TaskPriority priority);
    
    List<Task> findByInternshipIdAndStatus(Long internshipId, TaskStatus status);
    
    List<Task> findByInternshipIdAndPriority(Long internshipId, TaskPriority priority);
    
    List<Task> findByDueDateBefore(LocalDate date);
    
    List<Task> findByDueDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.internship.id = :internshipId AND t.status = :status")
    Long countByInternshipIdAndStatus(@Param("internshipId") Long internshipId, @Param("status") TaskStatus status);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.mentor.id = :mentorId AND t.status = :status")
    Long countByMentorIdAndStatus(@Param("mentorId") Long mentorId, @Param("status") TaskStatus status);
    
    @Query("SELECT t FROM Task t WHERE t.internship.mentor.id = :mentorId ORDER BY t.createdAt DESC")
    List<Task> findByInternshipMentorId(@Param("mentorId") Long mentorId);
}