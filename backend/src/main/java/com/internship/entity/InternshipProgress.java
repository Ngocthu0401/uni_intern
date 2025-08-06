package com.internship.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "internship_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InternshipProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false)
    @JsonBackReference
    private Internship internship;

    @Column(nullable = false)
    private Integer currentWeek = 1;

    @Column(nullable = false)
    private Integer totalWeeks = 12;

    private Integer completedTasks = 0;
    
    private Integer totalTasks = 0;

    @Column(name = "overall_progress")
    private Double overallProgress = 0.0;

    @Column(columnDefinition = "TEXT")
    private String weeklyGoals;

    @Column(columnDefinition = "TEXT")
    private String achievements;

    @Column(columnDefinition = "TEXT")
    private String challenges;

    @Column(columnDefinition = "TEXT")
    private String mentorFeedback;

    @Column(columnDefinition = "TEXT")
    private String studentReflection;

    @Column(name = "week_start_date")
    private LocalDate weekStartDate;

    @Column(name = "week_end_date")
    private LocalDate weekEndDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}