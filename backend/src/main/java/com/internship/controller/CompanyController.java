package com.internship.controller;

import com.internship.entity.Company;
import com.internship.service.CompanyService;
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
@RequestMapping("/companies")
public class CompanyController {
    
    @Autowired
    private CompanyService companyService;
    
    @GetMapping
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<Page<Company>> getAllCompanies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Company> companies = companyService.getAllCompanies(pageable);
        return ResponseEntity.ok(companies);
    }
    
    @GetMapping("/active")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<List<Company>> getActiveCompanies() {
        List<Company> companies = companyService.getActiveCompanies();
        return ResponseEntity.ok(companies);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT') or hasRole('MENTOR')")
    public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {
        Optional<Company> company = companyService.getCompanyById(id);
        return company.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/code/{companyCode}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT') or hasRole('MENTOR')")
    public ResponseEntity<Company> getCompanyByCode(@PathVariable String companyCode) {
        Optional<Company> company = companyService.getCompanyByCode(companyCode);
        return company.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/status/{isActive}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Page<Company>> getCompaniesByStatus(
            @PathVariable Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Company> companies = companyService.getCompaniesByStatus(isActive, pageable);
        return ResponseEntity.ok(companies);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<Page<Company>> searchCompanies(
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
        
        // If no keyword provided, return all companies
        Page<Company> companies;
        if (keyword == null || keyword.trim().isEmpty()) {
            companies = companyService.getAllCompanies(pageable);
        } else {
            companies = companyService.searchCompanies(keyword, pageable);
        }
        
        return ResponseEntity.ok(companies);
    }
    
    @GetMapping("/industry/{industry}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<Page<Company>> getCompaniesByIndustry(
            @PathVariable String industry,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Company> companies = companyService.getCompaniesByIndustry(industry, pageable);
        return ResponseEntity.ok(companies);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<?> createCompany(@Valid @RequestBody Company company) {
        try {
            Company createdCompany = companyService.createCompany(company);
            return ResponseEntity.status(201).body(createdCompany); // HTTP 201 Created
        } catch (RuntimeException e) {
            // Log the error for debugging
            System.err.println("Error creating company: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<?> updateCompany(@PathVariable Long id, @Valid @RequestBody Company company) {
        try {
            Company updatedCompany = companyService.updateCompanyInfo(id, company);
            return ResponseEntity.ok(updatedCompany);
        } catch (RuntimeException e) {
            // Log the error for debugging
            System.err.println("Error updating company: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        try {
            companyService.deleteCompany(id);
            return ResponseEntity.noContent().build(); // HTTP 204 No Content
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();  // HTTP 404 if not found
        }
    }
    
    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Company> activateCompany(@PathVariable Long id) {
        try {
            Company company = companyService.activateCompany(id);
            return ResponseEntity.ok(company);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Company> deactivateCompany(@PathVariable Long id) {
        try {
            Company company = companyService.deactivateCompany(id);
            return ResponseEntity.ok(company);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/check-code/{companyCode}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Boolean> checkCompanyCodeExists(@PathVariable String companyCode) {
        boolean exists = companyService.existsByCompanyCode(companyCode);
        return ResponseEntity.ok(exists);
    }
    
    @GetMapping("/statistics/count")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Long> getTotalCompanyCount() {
        long count = companyService.getTotalCompanyCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/statistics/active-count")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Long> getActiveCompanyCount() {
        long count = companyService.getActiveCompanyCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/advanced-search")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Company>> advancedSearchCompanies(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String companyType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Company> companies = companyService.advancedSearchCompanies(
            keyword, industry, isActive, location, companyType, pageable);
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/export")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<List<Company>> exportCompanies(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) Boolean isActive) {
        
        List<Company> companies = companyService.exportCompanies(keyword, industry, isActive);
        return ResponseEntity.ok(companies);
    }
} 