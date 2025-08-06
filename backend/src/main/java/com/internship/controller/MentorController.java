package com.internship.controller;

import com.internship.dto.request.CreateMentorRequest;
import com.internship.entity.Mentor;
import com.internship.service.MentorService;
import jakarta.validation.Valid;
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
@RequestMapping("/mentors")
public class MentorController {
    
    @Autowired
    private MentorService mentorService;
    
    @GetMapping
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Mentor>> getAllMentors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Mentor> mentors = mentorService.getAllMentors(pageable);
        return ResponseEntity.ok(mentors);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<Mentor> getMentorById(@PathVariable Long id) {
        Optional<Mentor> mentor = mentorService.getMentorById(id);
        return mentor.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<Mentor> getMentorByUserId(@PathVariable Long userId) {
        Optional<Mentor> mentor = mentorService.getMentorByUserId(userId);
        return mentor.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<Mentor>> getMentorsByCompanyId(@PathVariable Long companyId) {
        List<Mentor> mentors = mentorService.getMentorsByCompanyId(companyId);
        return ResponseEntity.ok(mentors);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Mentor>> searchMentors(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        // Validate pagination parameters
        page = Math.max(0, page);
        size = Math.max(1, Math.min(100, size));
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Mentor> mentors;
        if (keyword != null && !keyword.trim().isEmpty()) {
            mentors = mentorService.searchMentors(keyword.trim(), pageable);
        } else {
            mentors = mentorService.getAllMentors(pageable);
        }
        
        return ResponseEntity.ok(mentors);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Mentor> createMentor(@Valid @RequestBody CreateMentorRequest request) {
        try {
            Mentor createdMentor = mentorService.createMentorWithUser(request);
            return ResponseEntity.status(201).body(createdMentor); // HTTP 201 Created
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('MENTOR')")
    public ResponseEntity<?> updateMentor(@PathVariable Long id, @RequestBody Mentor mentor) {
        try {
            Mentor updatedMentor = mentorService.updateMentorInfo(id, mentor);
            return ResponseEntity.ok(updatedMentor);
        } catch (RuntimeException e) {
            System.err.println("Error updating mentor: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Void> deleteMentor(@PathVariable Long id) {
        try {
            mentorService.deleteMentor(id);
            return ResponseEntity.noContent().build(); // HTTP 204 No Content
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();  // HTTP 404 if not found
        }
    }
    
    @GetMapping("/statistics/count")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Long> getTotalMentorCount() {
        long count = mentorService.getTotalMentorCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/statistics/company/{companyId}/count")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Long> getMentorCountByCompany(@PathVariable Long companyId) {
        long count = mentorService.getMentorCountByCompany(companyId);
        return ResponseEntity.ok(count);
    }
} 