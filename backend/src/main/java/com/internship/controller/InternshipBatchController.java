package com.internship.controller;

import com.internship.entity.InternshipBatch;
import com.internship.service.InternshipBatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/batches")
public class InternshipBatchController {
    
    @Autowired
    private InternshipBatchService batchService;
    
    @GetMapping
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<InternshipBatch>> getAllBatches(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        // Validate pagination parameters
        page = Math.max(0, page); // Ensure page is not negative
        size = Math.max(1, Math.min(100, size)); // Ensure size is between 1 and 100
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<InternshipBatch> batches = batchService.getAllBatches(pageable);
        return ResponseEntity.ok(batches);
    }
    
    @GetMapping("/active")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<List<InternshipBatch>> getActiveBatches() {
        List<InternshipBatch> batches = batchService.getActiveBatches();
        return ResponseEntity.ok(batches);
    }
    
    @GetMapping("/registration-active")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<List<InternshipBatch>> getActiveRegistrationBatches() {
        List<InternshipBatch> batches = batchService.getActiveRegistrationBatches();
        return ResponseEntity.ok(batches);
    }
    
    @GetMapping("/ongoing")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<InternshipBatch>> getOngoingBatches() {
        List<InternshipBatch> batches = batchService.getOngoingBatches();
        return ResponseEntity.ok(batches);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<InternshipBatch> getBatchById(@PathVariable Long id) {
        Optional<InternshipBatch> batch = batchService.getBatchById(id);
        return batch.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/code/{batchCode}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<InternshipBatch> getBatchByCode(@PathVariable String batchCode) {
        Optional<InternshipBatch> batch = batchService.getBatchByCode(batchCode);
        return batch.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<InternshipBatch>> searchBatches(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        // Validate pagination parameters
        page = Math.max(0, page); // Ensure page is not negative
        size = Math.max(1, Math.min(100, size)); // Ensure size is between 1 and 100
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<InternshipBatch> batches;
        if (keyword != null && !keyword.trim().isEmpty()) {
            batches = batchService.searchBatches(keyword.trim(), pageable);
        } else {
            batches = batchService.getAllBatches(pageable);
        }
        
        return ResponseEntity.ok(batches);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<InternshipBatch> createBatch(@RequestBody InternshipBatch batch) {
        try {
            InternshipBatch createdBatch = batchService.createBatch(batch);
            return ResponseEntity.ok(createdBatch);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<InternshipBatch> updateBatch(@PathVariable Long id, @RequestBody InternshipBatch batch) {
        try {
            batch.setId(id);
            InternshipBatch updatedBatch = batchService.updateBatch(batch);
            return ResponseEntity.ok(updatedBatch);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<?> deleteBatch(@PathVariable Long id) {
        try {
            batchService.deleteBatch(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<InternshipBatch> activateBatch(@PathVariable Long id) {
        try {
            InternshipBatch batch = batchService.activateBatch(id);
            return ResponseEntity.ok(batch);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<InternshipBatch> deactivateBatch(@PathVariable Long id) {
        try {
            InternshipBatch batch = batchService.deactivateBatch(id);
            return ResponseEntity.ok(batch);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/check-code/{batchCode}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Boolean> checkBatchCodeExists(@PathVariable String batchCode) {
        boolean exists = batchService.existsByBatchCode(batchCode);
        return ResponseEntity.ok(exists);
    }
    
    @GetMapping("/statistics/count")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Long> getTotalBatchCount() {
        long count = batchService.getTotalBatchCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/statistics/active-count")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Long> getActiveBatchCount() {
        long count = batchService.getActiveBatchCount();
        return ResponseEntity.ok(count);
    }
} 