package com.internship.dto.request;

import lombok.Data;

@Data
public class UpdateEvaluationRequest {
    private String studentId;
    private String internshipId;
    private String evaluationType;
    private String semester;
    private String academicYear;
    
    // Technical evaluation scores
    private Double technicalSkills;
    private Double softSkills;
    private Double workAttitude;
    private Double learningAbility;
    private Double teamwork;
    private Double communication;
    private Double problemSolving;
    private Double creativity;
    private Double punctuality;
    private Double responsibility;
    private Double overallPerformance;
    
    // Comments and feedback
    private Object strengths; // Can be String or Array
    private Object weaknesses; // Can be String or Array
    private String recommendations;
    private String comments;
    
    // Calculated total score
    private Double totalScore;
    
    // Teacher ID (evaluator)
    private Long teacherId;
    
    // Additional fields
    private Boolean isFinalEvaluation = false;
}