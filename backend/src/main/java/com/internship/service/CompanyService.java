package com.internship.service;

import com.internship.entity.Company;
import com.internship.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CompanyService {
    
    @Autowired
    private CompanyRepository companyRepository;
    
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }
    
    public Page<Company> getAllCompanies(Pageable pageable) {
        return companyRepository.findAll(pageable);
    }
    
    public Optional<Company> getCompanyById(Long id) {
        return companyRepository.findById(id);
    }
    
    public Optional<Company> getCompanyByCode(String companyCode) {
        return companyRepository.findByCompanyCode(companyCode);
    }
    
    public List<Company> getActiveCompanies() {
        return companyRepository.findByIsActive(true);
    }
    
    public Page<Company> getCompaniesByStatus(Boolean isActive, Pageable pageable) {
        return companyRepository.findByIsActive(isActive, pageable);
    }
    
    public Page<Company> searchCompanies(String keyword, Pageable pageable) {
        return companyRepository.searchCompanies(keyword, pageable);
    }
    
    public Page<Company> getCompaniesByIndustry(String industry, Pageable pageable) {
        return companyRepository.findByIndustry(industry, pageable);
    }
    
    public Company createCompany(Company company) {
        // Validate company code uniqueness if provided
        if (company.getCompanyCode() != null && !company.getCompanyCode().isEmpty()) {
            if (companyRepository.existsByCompanyCode(company.getCompanyCode())) {
                throw new RuntimeException("Company code already exists: " + company.getCompanyCode());
            }
        } else {
            // Generate company code if not provided
            company.setCompanyCode(generateCompanyCode(company.getCompanyName()));
        }
        
        // Set default active status
        if (company.getIsActive() == null) {
            company.setIsActive(true);
        }
        
        return companyRepository.save(company);
    }
    
    public Company updateCompany(Company company) {
        Optional<Company> existingOpt = companyRepository.findById(company.getId());
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Company not found with id: " + company.getId());
        }
        
        Company existing = existingOpt.get();
        
        // Check if company code is being changed and if new code already exists
        if (company.getCompanyCode() != null && 
            !existing.getCompanyCode().equals(company.getCompanyCode()) &&
            companyRepository.existsByCompanyCode(company.getCompanyCode())) {
            throw new RuntimeException("Company code already exists: " + company.getCompanyCode());
        }
        
        // Preserve audit fields from BaseEntity
        company.setCreatedAt(existing.getCreatedAt());
        company.setUpdatedAt(existing.getUpdatedAt());
        
        // Preserve isActive status if not explicitly set
        if (company.getIsActive() == null) {
            company.setIsActive(existing.getIsActive());
        }
        
        System.out.println("Updating company ID: " + company.getId() + " with name: " + company.getCompanyName());
        
        Company updatedCompany = companyRepository.save(company);
        
        System.out.println("Updated company successfully: " + updatedCompany.getCompanyName());
        
        return updatedCompany;
    }
    
    public Company updateCompanyInfo(Long companyId, Company companyData) {
        Optional<Company> existingOpt = companyRepository.findById(companyId);
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Company not found with id: " + companyId);
        }
        
        Company existing = existingOpt.get();
        
        // Check if company code is being changed and if new code already exists
        if (companyData.getCompanyCode() != null && 
            !existing.getCompanyCode().equals(companyData.getCompanyCode()) &&
            companyRepository.existsByCompanyCode(companyData.getCompanyCode())) {
            throw new RuntimeException("Company code already exists: " + companyData.getCompanyCode());
        }
        
        // Update only the allowed fields, preserve audit info
        existing.setCompanyName(companyData.getCompanyName());
        existing.setAbbreviatedName(companyData.getAbbreviatedName());
        existing.setCompanyCode(companyData.getCompanyCode());
        existing.setCompanyType(companyData.getCompanyType());
        existing.setAddress(companyData.getAddress());
        existing.setPhoneNumber(companyData.getPhoneNumber());
        existing.setEmail(companyData.getEmail());
        existing.setWebsite(companyData.getWebsite());
        existing.setIndustry(companyData.getIndustry());
        existing.setCompanySize(companyData.getCompanySize());
        existing.setDescription(companyData.getDescription());
        existing.setContactPerson(companyData.getContactPerson());
        existing.setContactPosition(companyData.getContactPosition());
        existing.setContactPhone(companyData.getContactPhone());
        existing.setContactEmail(companyData.getContactEmail());
        
        System.out.println("Updating company info for ID: " + companyId + " with name: " + existing.getCompanyName());
        
        Company updatedCompany = companyRepository.save(existing);
        
        System.out.println("Updated company info successfully: " + updatedCompany.getCompanyName());
        
        return updatedCompany;
    }
    
    public void deleteCompany(Long id) {
        if (!companyRepository.existsById(id)) {
            throw new RuntimeException("Company not found with id: " + id);
        }
        
        // Check if company has mentors or internships before deleting
        Optional<Company> company = companyRepository.findById(id);
        if (company.isPresent()) {
            Company comp = company.get();
            // Note: Due to @JsonIgnore, we can't check collections directly
            // In a real scenario, you'd check via repository queries
            // For now, we'll trust cascade operations will handle it properly
        }
        
        companyRepository.deleteById(id);
    }
    
    public Company activateCompany(Long id) {
        Optional<Company> companyOpt = companyRepository.findById(id);
        if (companyOpt.isEmpty()) {
            throw new RuntimeException("Company not found with id: " + id);
        }
        
        Company company = companyOpt.get();
        company.setIsActive(true);
        return companyRepository.save(company);
    }
    
    public Company deactivateCompany(Long id) {
        Optional<Company> companyOpt = companyRepository.findById(id);
        if (companyOpt.isEmpty()) {
            throw new RuntimeException("Company not found with id: " + id);
        }
        
        Company company = companyOpt.get();
        company.setIsActive(false);
        return companyRepository.save(company);
    }
    
    public boolean existsByCompanyCode(String companyCode) {
        return companyRepository.existsByCompanyCode(companyCode);
    }
    
    public long getTotalCompanyCount() {
        return companyRepository.count();
    }
    
    public long getActiveCompanyCount() {
        return companyRepository.findByIsActive(true).size();
    }
    
    private String generateCompanyCode(String companyName) {
        // Simple company code generation based on name and timestamp
        String prefix = companyName != null && companyName.length() >= 3 ? 
                       companyName.substring(0, 3).toUpperCase() : "COM";
        return prefix + System.currentTimeMillis() % 10000;
    }

    // Advanced search method for CompanyController
    public Page<Company> advancedSearchCompanies(
        String name,
        String industry,
        Boolean isActive,
        String location,
        String companyType,
        Pageable pageable
    ) {
        return companyRepository.advancedSearch(name, industry, isActive, location, pageable);
    }
    
    // Export method for CompanyController
    public List<Company> exportCompanies(
        String name,
        String industry,
        Boolean isActive
    ) {
        return companyRepository.exportCompanies(name, industry, isActive);
    }
    
    // Statistics method for AdminController
    public Map<String, Long> getCompanyStatisticsByIndustry() {
        List<Object[]> results = companyRepository.countCompaniesByIndustry();
        Map<String, Long> statistics = new HashMap<>();
        
        for (Object[] result : results) {
            String industry = (String) result[0];
            Long count = (Long) result[1];
            statistics.put(industry != null ? industry : "UNKNOWN", count);
        }
        
        // Add default industries if none exist
        if (statistics.isEmpty()) {
            statistics.put("Technology", 0L);
            statistics.put("Finance", 0L);
            statistics.put("Healthcare", 0L);
            statistics.put("Education", 0L);
        }
        
        return statistics;
    }
} 