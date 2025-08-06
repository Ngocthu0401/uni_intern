package com.internship.entity;

import com.internship.enums.RoleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "evaluations")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Evaluation extends BaseEntity {
    
    @ManyToOne
    @JoinColumn(name = "internship_id", referencedColumnName = "id")
    private Internship internship;
    
    @ManyToOne
    @JoinColumn(name = "evaluator_id", referencedColumnName = "id")
    private User evaluator;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "evaluator_type")
    private RoleType evaluatorType;
    
    @Column(name = "evaluation_date")
    private LocalDate evaluationDate;
    
    @Column(name = "technical_score")
    private Double technicalScore;
    
    @Column(name = "soft_skill_score")
    private Double softSkillScore;
    
    @Column(name = "attitude_score")
    private Double attitudeScore;
    
    @Column(name = "communication_score")
    private Double communicationScore;
    
    @Column(name = "overall_score")
    private Double overallScore;
    
    @Column(name = "strengths", columnDefinition = "TEXT")
    private String strengths;
    
    @Column(name = "weaknesses", columnDefinition = "TEXT")
    private String weaknesses;
    
    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations;
    
    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;
    
    @Column(name = "is_final_evaluation")
    private Boolean isFinalEvaluation = false;
    
    // Helper method for EvaluationService
    public Double getScore() {
        return this.overallScore;
    }
    
    public void setScore(Double score) {
        this.overallScore = score;
    }
} 