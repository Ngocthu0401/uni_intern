package com.internship.controller;

import com.internship.dto.request.CreateBatchRequest;
import com.internship.dto.request.UpdateBatchRequest;
import com.internship.dto.response.InternshipBatchWithStudentCountDto;
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
    public ResponseEntity<Page<InternshipBatchWithStudentCountDto>> getAllBatches(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        // Validate pagination parameters
        page = Math.max(0, page); // Ensure page is not negative
        size = Math.max(1, Math.min(100, size)); // Ensure size is between 1 and 100

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<InternshipBatchWithStudentCountDto> batches = batchService.getAllBatchesWithStudentCount(pageable);
        return ResponseEntity.ok(batches);
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<List<InternshipBatchWithStudentCountDto>> getActiveBatches() {
        List<InternshipBatchWithStudentCountDto> batches = batchService.getActiveBatchesWithStudentCount();
        return ResponseEntity.ok(batches);
    }

    @GetMapping("/active/grouped-for-payment")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<InternshipBatchWithStudentCountDto>> getActiveBatchesGroupedForPayment() {
        List<InternshipBatchWithStudentCountDto> batches = batchService.getActiveBatchesGroupedForPayment();
        return ResponseEntity.ok(batches);
    }

    @GetMapping("/registration-active")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<List<InternshipBatchWithStudentCountDto>> getActiveRegistrationBatches() {
        List<InternshipBatchWithStudentCountDto> batches = batchService.getActiveRegistrationBatchesWithStudentCount();
        return ResponseEntity.ok(batches);
    }

    @GetMapping("/ongoing")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<InternshipBatchWithStudentCountDto>> getOngoingBatches() {
        List<InternshipBatchWithStudentCountDto> batches = batchService.getOngoingBatchesWithStudentCount();
        return ResponseEntity.ok(batches);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<InternshipBatchWithStudentCountDto> getBatchById(@PathVariable Long id) {
        Optional<InternshipBatchWithStudentCountDto> batch = batchService.getBatchByIdWithStudentCount(id);
        return batch.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{batchCode}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<InternshipBatchWithStudentCountDto> getBatchByCode(@PathVariable String batchCode) {
        Optional<InternshipBatchWithStudentCountDto> batch = batchService.getBatchByCodeWithStudentCount(batchCode);
        return batch.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<InternshipBatchWithStudentCountDto>> searchBatches(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        // Validate pagination parameters
        page = Math.max(0, page); // Ensure page is not negative
        size = Math.max(1, Math.min(100, size)); // Ensure size is between 1 and 100

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<InternshipBatchWithStudentCountDto> batches;
        if (keyword != null && !keyword.trim().isEmpty()) {
            batches = batchService.searchBatchesWithStudentCount(keyword.trim(), pageable);
        } else {
            batches = batchService.getAllBatchesWithStudentCount(pageable);
        }

        return ResponseEntity.ok(batches);
    }

    @PostMapping
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<InternshipBatchWithStudentCountDto> createBatch(@RequestBody CreateBatchRequest request) {
        try {
            InternshipBatch createdBatch = batchService.createBatchFromRequest(request);
            // Convert to DTO to ensure company is loaded
            Long studentCount = batchService.getBatchRepository().countStudentsByBatchId(createdBatch.getId());
            InternshipBatchWithStudentCountDto dto = InternshipBatchWithStudentCountDto.fromEntity(createdBatch,
                    studentCount);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<InternshipBatchWithStudentCountDto> updateBatch(@PathVariable Long id,
            @RequestBody UpdateBatchRequest request) {
        try {
            System.out.println("Update request received - ID: " + id + ", CompanyId: " + request.getCompanyId());
            request.setId(id);
            InternshipBatch updatedBatch = batchService.updateBatchFromRequest(request);
            // Convert to DTO to ensure company is loaded
            Long studentCount = batchService.getBatchRepository().countStudentsByBatchId(updatedBatch.getId());
            InternshipBatchWithStudentCountDto dto = InternshipBatchWithStudentCountDto.fromEntity(updatedBatch,
                    studentCount);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            System.out.println("Error in update: " + e.getMessage());
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
    public ResponseEntity<InternshipBatchWithStudentCountDto> activateBatch(@PathVariable Long id) {
        try {
            InternshipBatch batch = batchService.activateBatch(id);
            // Convert to DTO to ensure company is loaded
            Long studentCount = batchService.getBatchRepository().countStudentsByBatchId(batch.getId());
            InternshipBatchWithStudentCountDto dto = InternshipBatchWithStudentCountDto.fromEntity(batch, studentCount);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<InternshipBatchWithStudentCountDto> deactivateBatch(@PathVariable Long id) {
        try {
            InternshipBatch batch = batchService.deactivateBatch(id);
            // Convert to DTO to ensure company is loaded
            Long studentCount = batchService.getBatchRepository().countStudentsByBatchId(batch.getId());
            InternshipBatchWithStudentCountDto dto = InternshipBatchWithStudentCountDto.fromEntity(batch, studentCount);
            return ResponseEntity.ok(dto);
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