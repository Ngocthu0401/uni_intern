package com.internship.controller;

import com.internship.entity.InternshipProgress;
import com.internship.entity.Internship;
import com.internship.service.InternshipProgressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/internship-progress")
public class InternshipProgressController {
    
    @Autowired
    private InternshipProgressService progressService;
    
    @GetMapping
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<List<InternshipProgress>> getAllProgress() {
        List<InternshipProgress> progressList = progressService.getAllProgress();
        return ResponseEntity.ok(progressList);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR') or hasRole('STUDENT')")
    public ResponseEntity<InternshipProgress> getProgressById(@PathVariable Long id) {
        Optional<InternshipProgress> progress = progressService.getProgressById(id);
        return progress.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/internship/{internshipId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR') or hasRole('STUDENT')")
    public ResponseEntity<List<InternshipProgress>> getProgressByInternship(@PathVariable Long internshipId) {
        List<InternshipProgress> progressList = progressService.getProgressByInternship(internshipId);
        return ResponseEntity.ok(progressList);
    }
    
    @GetMapping("/internship/{internshipId}/latest")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR') or hasRole('STUDENT')")
    public ResponseEntity<InternshipProgress> getLatestProgressByInternship(@PathVariable Long internshipId) {
        Optional<InternshipProgress> progress = progressService.getLatestProgressByInternship(internshipId);
        return progress.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/internship/{internshipId}/week/{week}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR') or hasRole('STUDENT')")
    public ResponseEntity<InternshipProgress> getProgressByInternshipAndWeek(@PathVariable Long internshipId, @PathVariable Integer week) {
        Optional<InternshipProgress> progress = progressService.getProgressByInternshipAndWeek(internshipId, week);
        return progress.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/mentor/{mentorId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('MENTOR')")
    public ResponseEntity<List<InternshipProgress>> getProgressByMentor(@PathVariable Long mentorId) {
        List<InternshipProgress> progressList = progressService.getProgressByMentor(mentorId);
        return ResponseEntity.ok(progressList);
    }
    
    @GetMapping("/mentor/{mentorId}/average")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('MENTOR')")
    public ResponseEntity<Map<String, Double>> getAverageProgressByMentor(@PathVariable Long mentorId) {
        Double average = progressService.getAverageProgressByMentor(mentorId);
        return ResponseEntity.ok(Map.of("averageProgress", average));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<?> createProgress(@Valid @RequestBody Map<String, Object> progressData) {
        try {
            InternshipProgress progress = new InternshipProgress();
            
            // Set internship
            if (progressData.get("internshipId") != null) {
                Internship internship = new Internship();
                internship.setId(Long.valueOf(progressData.get("internshipId").toString()));
                progress.setInternship(internship);
            }
            
            // Set progress data
            if (progressData.get("currentWeek") != null) {
                progress.setCurrentWeek(Integer.valueOf(progressData.get("currentWeek").toString()));
            }
            
            if (progressData.get("totalWeeks") != null) {
                progress.setTotalWeeks(Integer.valueOf(progressData.get("totalWeeks").toString()));
            }
            
            if (progressData.get("completedTasks") != null) {
                progress.setCompletedTasks(Integer.valueOf(progressData.get("completedTasks").toString()));
            }
            
            if (progressData.get("totalTasks") != null) {
                progress.setTotalTasks(Integer.valueOf(progressData.get("totalTasks").toString()));
            }
            
            if (progressData.get("overallProgress") != null) {
                progress.setOverallProgress(Double.valueOf(progressData.get("overallProgress").toString()));
            }
            
            if (progressData.get("weeklyGoals") != null) {
                progress.setWeeklyGoals((String) progressData.get("weeklyGoals"));
            }
            
            if (progressData.get("achievements") != null) {
                progress.setAchievements((String) progressData.get("achievements"));
            }
            
            if (progressData.get("challenges") != null) {
                progress.setChallenges((String) progressData.get("challenges"));
            }
            
            if (progressData.get("mentorFeedback") != null) {
                progress.setMentorFeedback((String) progressData.get("mentorFeedback"));
            }
            
            if (progressData.get("studentReflection") != null) {
                progress.setStudentReflection((String) progressData.get("studentReflection"));
            }
            
            if (progressData.get("weekStartDate") != null) {
                progress.setWeekStartDate(java.time.LocalDate.parse((String) progressData.get("weekStartDate")));
            }
            
            if (progressData.get("weekEndDate") != null) {
                progress.setWeekEndDate(java.time.LocalDate.parse((String) progressData.get("weekEndDate")));
            }
            
            InternshipProgress createdProgress = progressService.createProgress(progress);
            return ResponseEntity.status(201).body(createdProgress);
        } catch (RuntimeException e) {
            System.err.println("Error creating progress: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<?> updateProgress(@PathVariable Long id, @Valid @RequestBody InternshipProgress progress) {
        try {
            progress.setId(id);
            InternshipProgress updatedProgress = progressService.updateProgress(progress);
            return ResponseEntity.ok(updatedProgress);
        } catch (RuntimeException e) {
            System.err.println("Error updating progress: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PutMapping("/internship/{internshipId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<?> updateOrCreateProgress(@PathVariable Long internshipId, @Valid @RequestBody InternshipProgress progressData) {
        try {
            InternshipProgress updatedProgress = progressService.updateOrCreateProgress(internshipId, progressData);
            return ResponseEntity.ok(updatedProgress);
        } catch (RuntimeException e) {
            System.err.println("Error updating/creating progress: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Void> deleteProgress(@PathVariable Long id) {
        try {
            progressService.deleteProgress(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}