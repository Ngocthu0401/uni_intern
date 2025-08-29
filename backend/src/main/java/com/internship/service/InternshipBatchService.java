package com.internship.service;

import com.internship.dto.request.CreateBatchRequest;
import com.internship.dto.request.UpdateBatchRequest;
import com.internship.dto.response.InternshipBatchWithStudentCountDto;
import com.internship.entity.Company;
import com.internship.entity.InternshipBatch;
import com.internship.repository.CompanyRepository;
import com.internship.repository.InternshipBatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;

@Service
@Transactional
public class InternshipBatchService {

    @Autowired
    private InternshipBatchRepository batchRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public List<InternshipBatch> getAllBatches() {
        return batchRepository.findAll();
    }

    public Page<InternshipBatch> getAllBatches(Pageable pageable) {
        return batchRepository.findAll(pageable);
    }

    public Page<InternshipBatchWithStudentCountDto> getAllBatchesWithStudentCount(Pageable pageable) {
        Page<InternshipBatch> batches = batchRepository.findAll(pageable);

        List<InternshipBatchWithStudentCountDto> dtoList = batches.getContent().stream()
                .map(batch -> {
                    Long studentCount = batchRepository.countStudentsByBatchId(batch.getId());
                    return InternshipBatchWithStudentCountDto.fromEntity(batch, studentCount);
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, batches.getTotalElements());
    }

    public Optional<InternshipBatch> getBatchById(Long id) {
        return batchRepository.findById(id);
    }

    public Optional<InternshipBatchWithStudentCountDto> getBatchByIdWithStudentCount(Long id) {
        Optional<InternshipBatch> batchOpt = batchRepository.findById(id);
        if (batchOpt.isPresent()) {
            InternshipBatch batch = batchOpt.get();
            Long studentCount = batchRepository.countStudentsByBatchId(batch.getId());
            return Optional.of(InternshipBatchWithStudentCountDto.fromEntity(batch, studentCount));
        }
        return Optional.empty();
    }

    public Optional<InternshipBatch> getBatchByCode(String batchCode) {
        return batchRepository.findByBatchCode(batchCode);
    }

    public Optional<InternshipBatchWithStudentCountDto> getBatchByCodeWithStudentCount(String batchCode) {
        Optional<InternshipBatch> batchOpt = batchRepository.findByBatchCode(batchCode);
        if (batchOpt.isPresent()) {
            InternshipBatch batch = batchOpt.get();
            Long studentCount = batchRepository.countStudentsByBatchId(batch.getId());
            return Optional.of(InternshipBatchWithStudentCountDto.fromEntity(batch, studentCount));
        }
        return Optional.empty();
    }

    public List<InternshipBatch> getActiveBatches() {
        return batchRepository.findByIsActive(true);
    }

    public List<InternshipBatchWithStudentCountDto> getActiveBatchesWithStudentCount() {
        List<InternshipBatch> batches = batchRepository.findByIsActive(true);

        return batches.stream()
                .map(batch -> {
                    Long studentCount = batchRepository.countStudentsByBatchId(batch.getId());
                    return InternshipBatchWithStudentCountDto.fromEntity(batch, studentCount);
                })
                .collect(Collectors.toList());
    }

    public List<InternshipBatch> getActiveRegistrationBatches() {
        return batchRepository.findActiveRegistrationBatches(LocalDate.now());
    }

    public List<InternshipBatchWithStudentCountDto> getActiveRegistrationBatchesWithStudentCount() {
        List<InternshipBatch> batches = batchRepository.findActiveRegistrationBatches(LocalDate.now());

        return batches.stream()
                .map(batch -> {
                    Long studentCount = batchRepository.countStudentsByBatchId(batch.getId());
                    return InternshipBatchWithStudentCountDto.fromEntity(batch, studentCount);
                })
                .collect(Collectors.toList());
    }

    public List<InternshipBatch> getOngoingBatches() {
        return batchRepository.findOngoingBatches(LocalDate.now());
    }

    public List<InternshipBatchWithStudentCountDto> getOngoingBatchesWithStudentCount() {
        List<InternshipBatch> batches = batchRepository.findOngoingBatches(LocalDate.now());

        return batches.stream()
                .map(batch -> {
                    Long studentCount = batchRepository.countStudentsByBatchId(batch.getId());
                    return InternshipBatchWithStudentCountDto.fromEntity(batch, studentCount);
                })
                .collect(Collectors.toList());
    }

    public Page<InternshipBatch> searchBatches(String keyword, Pageable pageable) {
        return batchRepository.searchBatches(keyword, pageable);
    }

    public Page<InternshipBatchWithStudentCountDto> searchBatchesWithStudentCount(String keyword, Pageable pageable) {
        Page<InternshipBatch> batches = batchRepository.searchBatches(keyword, pageable);

        List<InternshipBatchWithStudentCountDto> dtoList = batches.getContent().stream()
                .map(batch -> {
                    Long studentCount = batchRepository.countStudentsByBatchId(batch.getId());
                    return InternshipBatchWithStudentCountDto.fromEntity(batch, studentCount);
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, batches.getTotalElements());
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

    public InternshipBatch createBatchFromRequest(CreateBatchRequest request) {
        // Validate batch code uniqueness
        if (request.getBatchCode() != null && batchRepository.existsByBatchCode(request.getBatchCode())) {
            throw new RuntimeException("Batch code already exists: " + request.getBatchCode());
        }

        // Validate date logic
        if (request.getStartDate() != null && request.getEndDate() != null) {
            if (request.getStartDate().isAfter(request.getEndDate())) {
                throw new RuntimeException("Start date cannot be after end date");
            }
        }

        if (request.getRegistrationStartDate() != null && request.getRegistrationEndDate() != null) {
            if (request.getRegistrationStartDate().isAfter(request.getRegistrationEndDate())) {
                throw new RuntimeException("Registration start date cannot be after registration end date");
            }
        }

        // Validate that registration ends before internship starts
        if (request.getRegistrationEndDate() != null && request.getStartDate() != null) {
            if (request.getRegistrationEndDate().isAfter(request.getStartDate())) {
                throw new RuntimeException("Registration period must end before internship starts");
            }
        }

        // Create batch entity
        InternshipBatch batch = new InternshipBatch();
        batch.setBatchName(request.getBatchName() != null ? request.getBatchName() : request.getName());
        batch.setBatchCode(request.getBatchCode() != null ? request.getBatchCode() : generateBatchCode());
        batch.setSemester(request.getSemester());
        batch.setAcademicYear(request.getAcademicYear());
        batch.setStartDate(request.getStartDate());
        batch.setEndDate(request.getEndDate());
        batch.setRegistrationStartDate(request.getRegistrationStartDate());
        batch.setRegistrationEndDate(request.getRegistrationEndDate());
        batch.setDescription(request.getDescription());
        batch.setMaxStudents(request.getMaxStudents());
        batch.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        // Set company if provided
        if (request.getCompanyId() != null) {
            Optional<Company> company = companyRepository.findById(request.getCompanyId());
            if (company.isPresent()) {
                batch.setCompany(company.get());
            } else {
                throw new RuntimeException("Company not found with ID: " + request.getCompanyId());
            }
        }

        return batchRepository.save(batch);
    }

    private String generateBatchCode() {
        return "BATCH_" + System.currentTimeMillis();
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

    public InternshipBatch updateBatchFromRequest(UpdateBatchRequest request) {
        Optional<InternshipBatch> existingOpt = batchRepository.findById(request.getId());
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Batch not found with id: " + request.getId());
        }

        InternshipBatch existing = existingOpt.get();

        // Check if batch code is being changed and if new code already exists
        if (request.getBatchCode() != null && !existing.getBatchCode().equals(request.getBatchCode()) &&
                batchRepository.existsByBatchCode(request.getBatchCode())) {
            throw new RuntimeException("Batch code already exists: " + request.getBatchCode());
        }

        // Validate date logic
        if (request.getStartDate() != null && request.getEndDate() != null) {
            if (request.getStartDate().isAfter(request.getEndDate())) {
                throw new RuntimeException("Start date cannot be after end date");
            }
        }

        if (request.getRegistrationStartDate() != null && request.getRegistrationEndDate() != null) {
            if (request.getRegistrationStartDate().isAfter(request.getRegistrationEndDate())) {
                throw new RuntimeException("Registration start date cannot be after registration end date");
            }
        }

        // Validate that registration ends before internship starts
        if (request.getRegistrationEndDate() != null && request.getStartDate() != null) {
            if (request.getRegistrationEndDate().isAfter(request.getStartDate())) {
                throw new RuntimeException("Registration period must end before internship starts");
            }
        }

        // Update batch fields
        if (request.getBatchName() != null) {
            existing.setBatchName(request.getBatchName());
        } else if (request.getName() != null) {
            existing.setBatchName(request.getName());
        }

        if (request.getBatchCode() != null) {
            existing.setBatchCode(request.getBatchCode());
        }

        if (request.getSemester() != null) {
            existing.setSemester(request.getSemester());
        }

        if (request.getAcademicYear() != null) {
            existing.setAcademicYear(request.getAcademicYear());
        }

        if (request.getStartDate() != null) {
            existing.setStartDate(request.getStartDate());
        }

        if (request.getEndDate() != null) {
            existing.setEndDate(request.getEndDate());
        }

        if (request.getRegistrationStartDate() != null) {
            existing.setRegistrationStartDate(request.getRegistrationStartDate());
        }

        if (request.getRegistrationEndDate() != null) {
            existing.setRegistrationEndDate(request.getRegistrationEndDate());
        }

        if (request.getDescription() != null) {
            existing.setDescription(request.getDescription());
        }

        if (request.getMaxStudents() != null) {
            existing.setMaxStudents(request.getMaxStudents());
        }

        if (request.getIsActive() != null) {
            existing.setIsActive(request.getIsActive());
        }

        // Update company if provided
        if (request.getCompanyId() != null) {
            System.out.println("Updating company with ID: " + request.getCompanyId());
            Optional<Company> company = companyRepository.findById(request.getCompanyId());
            if (company.isPresent()) {
                System.out.println("Found company: " + company.get().getCompanyName());
                existing.setCompany(company.get());
            } else {
                System.out.println("Company not found with ID: " + request.getCompanyId());
                throw new RuntimeException("Company not found with ID: " + request.getCompanyId());
            }
        } else {
            System.out.println("No companyId provided in update request");
        }

        return batchRepository.save(existing);
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

    // Method để lấy các đợt thực tập đã được nhóm theo tên đợt cho quản lý thanh
    // toán
    public List<InternshipBatchWithStudentCountDto> getActiveBatchesGroupedForPayment() {
        List<InternshipBatch> batches = batchRepository.findByIsActive(true);

        // Nhóm các batch theo tên đợt (phần trước dấu gạch nối)
        Map<String, List<InternshipBatch>> groupedBatches = batches.stream()
                .collect(Collectors.groupingBy(batch -> {
                    String batchName = batch.getBatchName();
                    if (batchName != null && batchName.contains(" - ")) {
                        return batchName.split(" - ")[0].trim();
                    }
                    return batchName; // Nếu không có dấu gạch nối, trả về toàn bộ tên
                }));

        // Chuyển đổi thành DTO với thông tin tổng hợp
        return groupedBatches.entrySet().stream()
                .map(entry -> {
                    String batchName = entry.getKey();
                    List<InternshipBatch> batchList = entry.getValue();

                    // Lấy thông tin từ batch đầu tiên trong nhóm
                    InternshipBatch firstBatch = batchList.get(0);

                    // Tính tổng số sinh viên từ tất cả các batch trong nhóm
                    Long totalStudents = batchList.stream()
                            .mapToLong(batch -> batchRepository.countStudentsByBatchId(batch.getId()))
                            .sum();

                    // Tạo DTO với thông tin tổng hợp
                    InternshipBatchWithStudentCountDto dto = InternshipBatchWithStudentCountDto.fromEntity(firstBatch,
                            totalStudents);
                    dto.setBatchName(batchName); // Sử dụng tên đã được nhóm

                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Methods for company-based operations
    public List<InternshipBatch> getBatchesByCompanyId(Long companyId) {
        return batchRepository.findByCompanyId(companyId);
    }

    public List<InternshipBatchWithStudentCountDto> getBatchesByCompanyIdWithStudentCount(Long companyId) {
        List<InternshipBatch> batches = batchRepository.findByCompanyId(companyId);

        return batches.stream()
                .map(batch -> {
                    Long studentCount = batchRepository.countStudentsByBatchId(batch.getId());
                    return InternshipBatchWithStudentCountDto.fromEntity(batch, studentCount);
                })
                .collect(Collectors.toList());
    }

    public List<InternshipBatch> getActiveBatchesByCompanyId(Long companyId) {
        return batchRepository.findByCompanyIdAndIsActive(companyId, true);
    }

    public List<InternshipBatchWithStudentCountDto> getActiveBatchesByCompanyIdWithStudentCount(Long companyId) {
        List<InternshipBatch> batches = batchRepository.findByCompanyIdAndIsActive(companyId, true);

        return batches.stream()
                .map(batch -> {
                    Long studentCount = batchRepository.countStudentsByBatchId(batch.getId());
                    return InternshipBatchWithStudentCountDto.fromEntity(batch, studentCount);
                })
                .collect(Collectors.toList());
    }

    public List<InternshipBatch> getActiveRegistrationBatchesByCompany(Long companyId) {
        return batchRepository.findActiveRegistrationBatchesByCompany(companyId, LocalDate.now());
    }

    public List<InternshipBatchWithStudentCountDto> getActiveRegistrationBatchesByCompanyWithStudentCount(
            Long companyId) {
        List<InternshipBatch> batches = batchRepository.findActiveRegistrationBatchesByCompany(companyId,
                LocalDate.now());

        return batches.stream()
                .map(batch -> {
                    Long studentCount = batchRepository.countStudentsByBatchId(batch.getId());
                    return InternshipBatchWithStudentCountDto.fromEntity(batch, studentCount);
                })
                .collect(Collectors.toList());
    }

    public List<InternshipBatch> getOngoingBatchesByCompany(Long companyId) {
        return batchRepository.findOngoingBatchesByCompany(companyId, LocalDate.now());
    }

    public List<InternshipBatchWithStudentCountDto> getOngoingBatchesByCompanyWithStudentCount(Long companyId) {
        List<InternshipBatch> batches = batchRepository.findOngoingBatchesByCompany(companyId, LocalDate.now());

        return batches.stream()
                .map(batch -> {
                    Long studentCount = batchRepository.countStudentsByBatchId(batch.getId());
                    return InternshipBatchWithStudentCountDto.fromEntity(batch, studentCount);
                })
                .collect(Collectors.toList());
    }

    public Page<InternshipBatch> getBatchesWithFilters(Long companyId, Boolean isActive,
            String semester, String academicYear, Pageable pageable) {
        return batchRepository.findBatchesWithFilters(companyId, isActive, semester, academicYear, pageable);
    }

    public Page<InternshipBatchWithStudentCountDto> getBatchesWithFiltersAndStudentCount(Long companyId,
            Boolean isActive,
            String semester, String academicYear, Pageable pageable) {
        Page<InternshipBatch> batches = batchRepository.findBatchesWithFilters(companyId, isActive, semester,
                academicYear, pageable);

        List<InternshipBatchWithStudentCountDto> dtoList = batches.getContent().stream()
                .map(batch -> {
                    Long studentCount = batchRepository.countStudentsByBatchId(batch.getId());
                    return InternshipBatchWithStudentCountDto.fromEntity(batch, studentCount);
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, batches.getTotalElements());
    }

    public long getBatchCountByCompany(Long companyId) {
        return batchRepository.findByCompanyId(companyId).size();
    }

    public long getActiveBatchCountByCompany(Long companyId) {
        return batchRepository.findByCompanyIdAndIsActive(companyId, true).size();
    }

    // Getter for batch repository (for controller use)
    public InternshipBatchRepository getBatchRepository() {
        return batchRepository;
    }
}