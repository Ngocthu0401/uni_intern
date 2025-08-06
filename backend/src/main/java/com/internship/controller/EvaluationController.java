package com.internship.controller;

import com.internship.dto.request.CreateEvaluationRequest;
import com.internship.dto.request.UpdateEvaluationRequest;
import com.internship.entity.Evaluation;
import com.internship.service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/evaluations")
public class EvaluationController {
    
    @Autowired
    private EvaluationService evaluationService;
    
    @GetMapping
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Evaluation>> getAllEvaluations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Evaluation> evaluations = evaluationService.getAllEvaluations(pageable);
        return ResponseEntity.ok(evaluations);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT') or hasRole('MENTOR')")
    public ResponseEntity<Evaluation> getEvaluationById(@PathVariable Long id) {
        Optional<Evaluation> evaluation = evaluationService.getEvaluationById(id);
        return evaluation.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/internship/{internshipId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT') or hasRole('MENTOR')")
    public ResponseEntity<List<Evaluation>> getEvaluationsByInternshipId(@PathVariable Long internshipId) {
        List<Evaluation> evaluations = evaluationService.getEvaluationsByInternshipId(internshipId);
        return ResponseEntity.ok(evaluations);
    }
    
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<List<Evaluation>> getEvaluationsByStudentId(@PathVariable Long studentId) {
        List<Evaluation> evaluations = evaluationService.getEvaluationsByStudentId(studentId);
        return ResponseEntity.ok(evaluations);
    }
    
    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<Evaluation>> getEvaluationsByTeacherId(@PathVariable Long teacherId) {
        List<Evaluation> evaluations = evaluationService.getEvaluationsByTeacherId(teacherId);
        return ResponseEntity.ok(evaluations);
    }
    
    @GetMapping("/mentor/{mentorId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<List<Evaluation>> getEvaluationsByMentorId(@PathVariable Long mentorId) {
        List<Evaluation> evaluations = evaluationService.getEvaluationsByMentorId(mentorId);
        return ResponseEntity.ok(evaluations);
    }
    
    @GetMapping("/batch/{batchId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<Evaluation>> getEvaluationsByBatchId(@PathVariable Long batchId) {
        List<Evaluation> evaluations = evaluationService.getEvaluationsByBatchId(batchId);
        return ResponseEntity.ok(evaluations);
    }
    
    @GetMapping("/score-range")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<Evaluation>> getEvaluationsByScoreRange(
            @RequestParam Double minScore,
            @RequestParam Double maxScore) {
        
        List<Evaluation> evaluations = evaluationService.getEvaluationsByScoreRange(minScore, maxScore);
        return ResponseEntity.ok(evaluations);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Evaluation>> searchEvaluations(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Evaluation> evaluations = evaluationService.searchEvaluations(keyword, pageable);
        return ResponseEntity.ok(evaluations);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<?> createEvaluation(@RequestBody CreateEvaluationRequest request) {
        try {
            Evaluation createdEvaluation = evaluationService.createEvaluation(request);
            return ResponseEntity.ok(createdEvaluation);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<?> updateEvaluation(@PathVariable Long id, @RequestBody UpdateEvaluationRequest request) {
        try {
            Evaluation updatedEvaluation = evaluationService.updateEvaluationWithDto(id, request);
            return ResponseEntity.ok(updatedEvaluation);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<?> deleteEvaluation(@PathVariable Long id) {
        try {
            evaluationService.deleteEvaluation(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/statistics/average-score/internship/{internshipId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<?> getAverageScoreByInternship(@PathVariable Long internshipId) {
        try {
            Double averageScore = evaluationService.getAverageScoreByInternship(internshipId);
            if (averageScore == null) {
                return ResponseEntity.ok(0.0);
            }
            return ResponseEntity.ok(averageScore);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/statistics/average-score/student/{studentId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<?> getAverageScoreByStudent(@PathVariable Long studentId) {
        try {
            Double averageScore = evaluationService.getAverageScoreByStudent(studentId);
            if (averageScore == null) {
                return ResponseEntity.ok(0.0);
            }
            return ResponseEntity.ok(averageScore);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/statistics/count")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Long> getTotalEvaluationCount() {
        long count = evaluationService.getTotalEvaluationCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/statistics/internship/{internshipId}/count")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Long> getEvaluationCountByInternship(@PathVariable Long internshipId) {
        long count = evaluationService.getEvaluationCountByInternship(internshipId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/statistics/batch/{batchId}/count")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Long> getEvaluationCountByBatch(@PathVariable Long batchId) {
        long count = evaluationService.getEvaluationCountByBatch(batchId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/teacher/{teacherId}/statistics")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Map<String, Object>> getEvaluationStatisticsByTeacher(@PathVariable Long teacherId) {
        try {
            Map<String, Object> statistics = evaluationService.getEvaluationStatisticsByTeacher(teacherId);
            return ResponseEntity.ok(statistics);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/test/create-sample/{studentId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<?> createSampleEvaluations(@PathVariable Long studentId) {
        try {
            evaluationService.createSampleEvaluations(studentId);
            return ResponseEntity.ok(Map.of("message", "Sample evaluations created successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
} 