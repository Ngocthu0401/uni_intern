package com.internship.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.internship.enums.InternshipStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "internships")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Internship extends BaseEntity {
    
    @ManyToOne
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "teacher_id", referencedColumnName = "id")
    private Teacher teacher;
    
    @ManyToOne
    @JoinColumn(name = "mentor_id", referencedColumnName = "id")
    private Mentor mentor;
    
    @ManyToOne
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    private Company company;
    
    @ManyToOne
    @JoinColumn(name = "batch_id", referencedColumnName = "id")
    private InternshipBatch internshipBatch;
    
    @Column(name = "internship_code", unique = true)
    private String internshipCode;
    
    @Column(name = "job_title")
    @NotBlank(message = "Job title is required")
    @Size(max = 255, message = "Job title must not exceed 255 characters")
    private String jobTitle;
    
    @Column(name = "job_description", columnDefinition = "TEXT")
    @NotBlank(message = "Job description is required")
    private String jobDescription;
    
    @Column(name = "requirements", columnDefinition = "TEXT")
    private String requirements;
    
    @Column(name = "start_date")
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    @Column(name = "end_date")
    @NotNull(message = "End date is required")
    private LocalDate endDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private InternshipStatus status = InternshipStatus.PENDING;
    
    @Column(name = "working_hours_per_week")
    private Integer workingHoursPerWeek;
    
    @Column(name = "salary")
    private Double salary;
    
    @Column(name = "benefits", columnDefinition = "TEXT")
    private String benefits;
    
    @Column(name = "final_score")
    private Double finalScore;
    
    @Column(name = "teacher_score")
    private Double teacherScore;
    
    @Column(name = "mentor_score")
    private Double mentorScore;
    
    @Column(name = "teacher_comment", columnDefinition = "TEXT")
    private String teacherComment;
    
    @Column(name = "mentor_comment", columnDefinition = "TEXT")
    private String mentorComment;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @OneToMany(mappedBy = "internship", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Report> reports;
    
    @OneToMany(mappedBy = "internship", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Evaluation> evaluations;
    
    @OneToMany(mappedBy = "internship", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Task> tasks;
    
    @OneToMany(mappedBy = "internship", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<InternshipProgress> progressRecords;
} 