package com.internship.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.internship.enums.ReportStatus;
import com.internship.enums.ReportType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "reports")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Report extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;
    
    // Student can be accessed through internship.getStudent()
    // Temporarily keeping student_id column nullable to allow migration
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = true)
    @JsonIgnore
    private Student student;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ReportType type;
    
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "week_number")
    private Integer weekNumber;
    
    @Column(name = "report_period")
    private String reportPeriod;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ReportStatus status = ReportStatus.PENDING;
    
    @Column(name = "report_date")
    private LocalDate reportDate;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id")
    private Teacher reviewer;
    
    @Column(name = "grade")
    private Double grade;
    
    @Column(name = "achievements", columnDefinition = "TEXT")
    private String achievements;
    
    @Column(name = "challenges", columnDefinition = "TEXT")
    private String challenges;
    
    @Column(name = "next_week_plan", columnDefinition = "TEXT")
    private String nextWeekPlan;
    
    @ElementCollection
    @CollectionTable(name = "report_attachments", joinColumns = @JoinColumn(name = "report_id"))
    @Column(name = "file_path")
    private List<String> attachments;
    
    @Column(name = "teacher_comment", columnDefinition = "TEXT")
    private String teacherComment;
    
    @Column(name = "mentor_comment", columnDefinition = "TEXT")
    private String mentorComment;
    
    @Column(name = "teacher_score")
    private Double teacherScore;
    
    @Column(name = "mentor_score")
    private Double mentorScore;
    
    @Column(name = "is_approved_by_teacher")
    private Boolean isApprovedByTeacher = false;
    
    @Column(name = "is_approved_by_mentor")
    private Boolean isApprovedByMentor = false;
    
    @Column(name = "approved_at")
    private LocalDate approvedAt;
    
    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    // Helper methods for ReportService
    public Student getStudent() {
        // Prefer student from internship relationship, fallback to direct student
        if (internship != null && internship.getStudent() != null) {
            return internship.getStudent();
        }
        return student;
    }
    
    public void setStudent(Student student) {
        this.student = student;
    }
    
    public Boolean getIsApproved() {
        return (isApprovedByTeacher != null && isApprovedByTeacher) || 
               (isApprovedByMentor != null && isApprovedByMentor);
    }
    
    public void setIsApproved(Boolean isApproved) {
        // This method is for compatibility with ReportService
        // Actual approval should be handled through specific teacher/mentor approval
        if (isApproved != null && isApproved) {
            this.isApprovedByTeacher = true;
            this.isApprovedByMentor = true;
        } else {
            this.isApprovedByTeacher = false;
            this.isApprovedByMentor = false;
        }
    }
} 