package com.internship.service;

import com.internship.entity.InternshipProgress;
import com.internship.entity.Internship;
import com.internship.repository.InternshipProgressRepository;
import com.internship.repository.InternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class InternshipProgressService {
    
    @Autowired
    private InternshipProgressRepository progressRepository;
    
    @Autowired
    private InternshipRepository internshipRepository;
    
    public List<InternshipProgress> getAllProgress() {
        return progressRepository.findAll();
    }
    
    public Optional<InternshipProgress> getProgressById(Long id) {
        return progressRepository.findById(id);
    }
    
    public List<InternshipProgress> getProgressByInternship(Long internshipId) {
        return progressRepository.findByInternshipIdOrderByCurrentWeekDesc(internshipId);
    }
    
    public Optional<InternshipProgress> getLatestProgressByInternship(Long internshipId) {
        return progressRepository.findLatestByInternshipId(internshipId);
    }
    
    public List<InternshipProgress> getProgressByMentor(Long mentorId) {
        return progressRepository.findByMentorId(mentorId);
    }
    
    public Optional<InternshipProgress> getProgressByInternshipAndWeek(Long internshipId, Integer week) {
        return progressRepository.findByInternshipIdAndCurrentWeek(internshipId, week);
    }
    
    public Double getAverageProgressByMentor(Long mentorId) {
        Double average = progressRepository.getAverageProgressByMentorId(mentorId);
        return average != null ? average : 0.0;
    }
    
    @Transactional(readOnly = false)
    public InternshipProgress createProgress(InternshipProgress progress) {
        // Set internship if provided
        if (progress.getInternship() != null && progress.getInternship().getId() != null) {
            Optional<Internship> internshipOpt = internshipRepository.findById(progress.getInternship().getId());
            if (internshipOpt.isPresent()) {
                progress.setInternship(internshipOpt.get());
            } else {
                throw new RuntimeException("Internship not found with id: " + progress.getInternship().getId());
            }
        }
        
        // Set default values if not provided
        if (progress.getCurrentWeek() == null) {
            progress.setCurrentWeek(1);
        }
        
        if (progress.getTotalWeeks() == null) {
            progress.setTotalWeeks(12);
        }
        
        if (progress.getCompletedTasks() == null) {
            progress.setCompletedTasks(0);
        }
        
        if (progress.getTotalTasks() == null) {
            progress.setTotalTasks(0);
        }
        
        if (progress.getOverallProgress() == null) {
            progress.setOverallProgress(0.0);
        }
        
        return progressRepository.save(progress);
    }
    
    @Transactional(readOnly = false)
    public InternshipProgress updateProgress(InternshipProgress progress) {
        Optional<InternshipProgress> existingOpt = progressRepository.findById(progress.getId());
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Progress not found with id: " + progress.getId());
        }
        
        return progressRepository.save(progress);
    }
    
    @Transactional(readOnly = false)
    public InternshipProgress updateOrCreateProgress(Long internshipId, InternshipProgress progressData) {
        // Try to find existing progress for current week
        Optional<InternshipProgress> existingOpt = progressRepository.findByInternshipIdAndCurrentWeek(
            internshipId, progressData.getCurrentWeek());
        
        if (existingOpt.isPresent()) {
            // Update existing progress
            InternshipProgress existing = existingOpt.get();
            existing.setCompletedTasks(progressData.getCompletedTasks());
            existing.setTotalTasks(progressData.getTotalTasks());
            existing.setOverallProgress(progressData.getOverallProgress());
            existing.setWeeklyGoals(progressData.getWeeklyGoals());
            existing.setAchievements(progressData.getAchievements());
            existing.setChallenges(progressData.getChallenges());
            existing.setMentorFeedback(progressData.getMentorFeedback());
            existing.setStudentReflection(progressData.getStudentReflection());
            existing.setWeekStartDate(progressData.getWeekStartDate());
            existing.setWeekEndDate(progressData.getWeekEndDate());
            
            return progressRepository.save(existing);
        } else {
            // Create new progress
            progressData.setInternship(new Internship());
            progressData.getInternship().setId(internshipId);
            return createProgress(progressData);
        }
    }
    
    @Transactional(readOnly = false)
    public void deleteProgress(Long id) {
        if (!progressRepository.existsById(id)) {
            throw new RuntimeException("Progress not found with id: " + id);
        }
        progressRepository.deleteById(id);
    }
}