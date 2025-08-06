package com.internship.repository;

import com.internship.entity.Evaluation;
import com.internship.enums.RoleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    
    List<Evaluation> findByInternshipId(Long internshipId);
    
    List<Evaluation> findByEvaluatorId(Long evaluatorId);
    
    List<Evaluation> findByEvaluatorType(RoleType evaluatorType);
    
    @Query("SELECT e FROM Evaluation e WHERE e.internship.id = :internshipId AND e.evaluatorType = :evaluatorType")
    List<Evaluation> findByInternshipIdAndEvaluatorType(@Param("internshipId") Long internshipId, 
                                                       @Param("evaluatorType") RoleType evaluatorType);
    
    @Query("SELECT e FROM Evaluation e WHERE e.internship.student.id = :studentId")
    List<Evaluation> findByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT e FROM Evaluation e WHERE e.internship.student.id = :studentId")
    Page<Evaluation> findByStudentId(@Param("studentId") Long studentId, Pageable pageable);
    
    @Query("SELECT e FROM Evaluation e WHERE e.isFinalEvaluation = :isFinal")
    Page<Evaluation> findByIsFinalEvaluation(@Param("isFinal") Boolean isFinal, Pageable pageable);
    
    @Query("SELECT e FROM Evaluation e WHERE e.internship.teacher.id = :teacherId")
    List<Evaluation> findByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT e FROM Evaluation e WHERE e.internship.mentor.id = :mentorId")
    List<Evaluation> findByMentorId(@Param("mentorId") Long mentorId);
    
    @Query("SELECT e FROM Evaluation e WHERE e.internship.internshipBatch.id = :batchId")
    List<Evaluation> findByBatchId(@Param("batchId") Long batchId);
    
    @Query("SELECT e FROM Evaluation e WHERE e.overallScore >= :minScore AND e.overallScore <= :maxScore")
    List<Evaluation> findByScoreRange(@Param("minScore") Double minScore, @Param("maxScore") Double maxScore);
    
    @Query("SELECT e FROM Evaluation e WHERE " +
           "LOWER(e.comments) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.internship.student.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Evaluation> searchEvaluations(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT e FROM Evaluation e WHERE " +
           "e.internship.id = :internshipId AND e.evaluatorType = :evaluatorType AND e.isFinalEvaluation = true")
    List<Evaluation> findFinalEvaluationByInternshipAndEvaluatorType(@Param("internshipId") Long internshipId, 
                                                                   @Param("evaluatorType") RoleType evaluatorType);
} 