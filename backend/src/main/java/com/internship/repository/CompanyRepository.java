package com.internship.repository;

import com.internship.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    
    Optional<Company> findByCompanyCode(String companyCode);
    
    boolean existsByCompanyCode(String companyCode);
    
    List<Company> findByIsActive(Boolean isActive);
    
    @Query("SELECT c FROM Company c WHERE " +
           "LOWER(c.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.companyCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.industry) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.address) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Company> searchCompanies(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT c FROM Company c WHERE c.industry = :industry AND c.isActive = true")
    Page<Company> findByIndustry(@Param("industry") String industry, Pageable pageable);
    
    @Query("SELECT c FROM Company c WHERE c.isActive = :isActive")
    Page<Company> findByIsActive(@Param("isActive") Boolean isActive, Pageable pageable);
    
    // Advanced search method
    @Query("SELECT c FROM Company c WHERE " +
           "(:name IS NULL OR LOWER(c.companyName) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:industry IS NULL OR c.industry = :industry) AND " +
           "(:isActive IS NULL OR c.isActive = :isActive) AND " +
           "(:location IS NULL OR LOWER(c.address) LIKE LOWER(CONCAT('%', :location, '%')))")
    Page<Company> advancedSearch(@Param("name") String name,
                                @Param("industry") String industry,
                                @Param("isActive") Boolean isActive,
                                @Param("location") String location,
                                Pageable pageable);
    
    // Export method
    @Query("SELECT c FROM Company c WHERE " +
           "(:name IS NULL OR LOWER(c.companyName) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:industry IS NULL OR c.industry = :industry) AND " +
           "(:isActive IS NULL OR c.isActive = :isActive)")
    List<Company> exportCompanies(@Param("name") String name,
                                 @Param("industry") String industry,
                                 @Param("isActive") Boolean isActive);
    
    // Statistics method
    @Query("SELECT c.industry, COUNT(c) FROM Company c WHERE c.isActive = true GROUP BY c.industry")
    List<Object[]> countCompaniesByIndustry();
} 