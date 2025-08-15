package com.internship.service;

import com.internship.entity.InternshipBatch;
import com.internship.repository.InternshipBatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class InternshipBatchService {
    
    @Autowired
    private InternshipBatchRepository batchRepository;
    
    public List<InternshipBatch> getAllBatches() {
        return batchRepository.findAll();
    }
    
    public Page<InternshipBatch> getAllBatches(Pageable pageable) {
        return batchRepository.findAll(pageable);
    }
    
    public Optional<InternshipBatch> getBatchById(Long id) {
        return batchRepository.findById(id);
    }
    
    public Optional<InternshipBatch> getBatchByCode(String batchCode) {
        return batchRepository.findByBatchCode(batchCode);
    }
    
    public List<InternshipBatch> getActiveBatches() {
        return batchRepository.findByIsActive(true);
    }
    
    public List<InternshipBatch> getActiveRegistrationBatches() {
        return batchRepository.findActiveRegistrationBatches(LocalDate.now());
    }
    
    public List<InternshipBatch> getOngoingBatches() {
        return batchRepository.findOngoingBatches(LocalDate.now());
    }
    
    public Page<InternshipBatch> searchBatches(String keyword, Pageable pageable) {
        return batchRepository.searchBatches(keyword, pageable);
    }
    
    public InternshipBatch createBatch(InternshipBatch batch) {
        // Validate batch code uniqueness
        if (batchRepository.existsByBatchCode(batch.getBatchCode())) {
            throw new RuntimeException("Batch code already exists: " + batch.getBatchCode());
        }
        
        // Validate date logic
        if (batch.getStartDate() != null && batch.getEndDate() != null) {
            if (batch.getStartDate().isAfter(batch.getEndDate())) {
                throw new RuntimeException("Start date cannot be after end date");
            }
        }
        
        if (batch.getRegistrationStartDate() != null && batch.getRegistrationEndDate() != null) {
            if (batch.getRegistrationStartDate().isAfter(batch.getRegistrationEndDate())) {
                throw new RuntimeException("Registration start date cannot be after registration end date");
            }
        }
        
        // Set default active status
        if (batch.getIsActive() == null) {
            batch.setIsActive(true);
        }
        
        return batchRepository.save(batch);
    }
    
    public InternshipBatch updateBatch(InternshipBatch batch) {
        Optional<InternshipBatch> existingOpt = batchRepository.findById(batch.getId());
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Batch not found with id: " + batch.getId());
        }
        
        // Check if batch code is being changed and if new code already exists
        InternshipBatch existing = existingOpt.get();
        if (!existing.getBatchCode().equals(batch.getBatchCode()) &&
            batchRepository.existsByBatchCode(batch.getBatchCode())) {
            throw new RuntimeException("Batch code already exists: " + batch.getBatchCode());
        }
        
        // Validate date logic
        if (batch.getStartDate() != null && batch.getEndDate() != null) {
            if (batch.getStartDate().isAfter(batch.getEndDate())) {
                throw new RuntimeException("Start date cannot be after end date");
            }
        }
        
        if (batch.getRegistrationStartDate() != null && batch.getRegistrationEndDate() != null) {
            if (batch.getRegistrationStartDate().isAfter(batch.getRegistrationEndDate())) {
                throw new RuntimeException("Registration start date cannot be after registration end date");
            }
        }
        
        return batchRepository.save(batch);
    }
    
    public void deleteBatch(Long id) {
        if (!batchRepository.existsById(id)) {
            throw new RuntimeException("Batch not found with id: " + id);
        }
        batchRepository.deleteById(id);
    }
    
    public InternshipBatch activateBatch(Long id) {
        Optional<InternshipBatch> batchOpt = batchRepository.findById(id);
        if (batchOpt.isEmpty()) {
            throw new RuntimeException("Batch not found with id: " + id);
        }
        
        InternshipBatch batch = batchOpt.get();
        batch.setIsActive(true);
        return batchRepository.save(batch);
    }
    
    public InternshipBatch deactivateBatch(Long id) {
        Optional<InternshipBatch> batchOpt = batchRepository.findById(id);
        if (batchOpt.isEmpty()) {
            throw new RuntimeException("Batch not found with id: " + id);
        }
        
        InternshipBatch batch = batchOpt.get();
        batch.setIsActive(false);
        return batchRepository.save(batch);
    }
    
    public boolean existsByBatchCode(String batchCode) {
        return batchRepository.existsByBatchCode(batchCode);
    }
    
    public long getTotalBatchCount() {
        return batchRepository.count();
    }
    
    public long getActiveBatchCount() {
        return batchRepository.findByIsActive(true).size();
    }
    
    // Methods for company-based operations
    public List<InternshipBatch> getBatchesByCompanyId(Long companyId) {
        return batchRepository.findByCompanyId(companyId);
    }
    
    public List<InternshipBatch> getActiveBatchesByCompanyId(Long companyId) {
        return batchRepository.findByCompanyIdAndIsActive(companyId, true);
    }
    
    public List<InternshipBatch> getActiveRegistrationBatchesByCompany(Long companyId) {
        return batchRepository.findActiveRegistrationBatchesByCompany(companyId, LocalDate.now());
    }
    
    public List<InternshipBatch> getOngoingBatchesByCompany(Long companyId) {
        return batchRepository.findOngoingBatchesByCompany(companyId, LocalDate.now());
    }
    
    public Page<InternshipBatch> getBatchesWithFilters(Long companyId, Boolean isActive, 
                                                      String semester, String academicYear, Pageable pageable) {
        return batchRepository.findBatchesWithFilters(companyId, isActive, semester, academicYear, pageable);
    }
    
    public long getBatchCountByCompany(Long companyId) {
        return batchRepository.findByCompanyId(companyId).size();
    }
    
    public long getActiveBatchCountByCompany(Long companyId) {
        return batchRepository.findByCompanyIdAndIsActive(companyId, true).size();
    }
} 