package com.internship.service;

import com.internship.entity.Contract;
import com.internship.entity.Internship;
import com.internship.enums.ContractStatus;
import com.internship.repository.ContractRepository;
import com.internship.repository.InternshipRepository;
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
public class ContractService {
    
    @Autowired
    private ContractRepository contractRepository;
    
    @Autowired
    private InternshipRepository internshipRepository;
    
    public List<Contract> getAllContracts() {
        return contractRepository.findAll();
    }
    
    public Page<Contract> getAllContracts(Pageable pageable) {
        return contractRepository.findAll(pageable);
    }
    
    public Optional<Contract> getContractById(Long id) {
        return contractRepository.findById(id);
    }
    
    public Optional<Contract> getContractByCode(String contractCode) {
        return contractRepository.findByContractCode(contractCode);
    }
    
    public List<Contract> getContractsByInternshipId(Long internshipId) {
        return contractRepository.findByInternshipId(internshipId);
    }
    
    public List<Contract> getContractsByStatus(ContractStatus status) {
        return contractRepository.findByStatus(status);
    }
    
    public Page<Contract> getContractsByStatus(ContractStatus status, Pageable pageable) {
        return contractRepository.findByStatus(status, pageable);
    }
    
    public List<Contract> getContractsByStudentId(Long studentId) {
        return contractRepository.findByStudentId(studentId);
    }
    
    public List<Contract> getContractsByCompanyId(Long companyId) {
        return contractRepository.findByCompanyId(companyId);
    }
    
    public Page<Contract> searchContracts(String keyword, Pageable pageable) {
        return contractRepository.searchContracts(keyword, pageable);
    }
    
    public Contract createContract(Contract contract) {
        // Validate internship exists
        if (contract.getInternship() != null && contract.getInternship().getId() != null) {
            Optional<Internship> internshipOpt = internshipRepository.findById(contract.getInternship().getId());
            if (internshipOpt.isEmpty()) {
                throw new RuntimeException("Internship not found with id: " + contract.getInternship().getId());
            }
            contract.setInternship(internshipOpt.get());
        }
        
        // Generate contract code if not provided
        if (contract.getContractCode() == null || contract.getContractCode().isEmpty()) {
            contract.setContractCode(generateContractCode());
        } else {
            // Validate contract code uniqueness
            if (contractRepository.existsByContractCode(contract.getContractCode())) {
                throw new RuntimeException("Contract code already exists: " + contract.getContractCode());
            }
        }
        
        // Set default status
        if (contract.getStatus() == null) {
            contract.setStatus(ContractStatus.DRAFT);
        }
        
        // Created date is handled by BaseEntity
        
        return contractRepository.save(contract);
    }
    
    public Contract updateContract(Contract contract) {
        Optional<Contract> existingOpt = contractRepository.findById(contract.getId());
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Contract not found with id: " + contract.getId());
        }
        
        // Check if contract code is being changed and if new code already exists
        Contract existing = existingOpt.get();
        if (!existing.getContractCode().equals(contract.getContractCode()) &&
            contractRepository.existsByContractCode(contract.getContractCode())) {
            throw new RuntimeException("Contract code already exists: " + contract.getContractCode());
        }
        
        // Validate internship exists if being changed
        if (contract.getInternship() != null && contract.getInternship().getId() != null) {
            Optional<Internship> internshipOpt = internshipRepository.findById(contract.getInternship().getId());
            if (internshipOpt.isEmpty()) {
                throw new RuntimeException("Internship not found with id: " + contract.getInternship().getId());
            }
            contract.setInternship(internshipOpt.get());
        }
        
        return contractRepository.save(contract);
    }
    
    public void deleteContract(Long id) {
        if (!contractRepository.existsById(id)) {
            throw new RuntimeException("Contract not found with id: " + id);
        }
        contractRepository.deleteById(id);
    }
    
    public Contract signContract(Long id) {
        Optional<Contract> contractOpt = contractRepository.findById(id);
        if (contractOpt.isEmpty()) {
            throw new RuntimeException("Contract not found with id: " + id);
        }
        
        Contract contract = contractOpt.get();
        contract.setStatus(ContractStatus.SIGNED);
        contract.setSignedDate(LocalDate.now());
        
        return contractRepository.save(contract);
    }
    
    public Contract activateContract(Long id) {
        Optional<Contract> contractOpt = contractRepository.findById(id);
        if (contractOpt.isEmpty()) {
            throw new RuntimeException("Contract not found with id: " + id);
        }
        
        Contract contract = contractOpt.get();
        contract.setStatus(ContractStatus.ACTIVE);
        
        return contractRepository.save(contract);
    }
    
    public Contract expireContract(Long id) {
        Optional<Contract> contractOpt = contractRepository.findById(id);
        if (contractOpt.isEmpty()) {
            throw new RuntimeException("Contract not found with id: " + id);
        }
        
        Contract contract = contractOpt.get();
        contract.setStatus(ContractStatus.EXPIRED);
        
        return contractRepository.save(contract);
    }
    
    public Contract terminateContract(Long id) {
        Optional<Contract> contractOpt = contractRepository.findById(id);
        if (contractOpt.isEmpty()) {
            throw new RuntimeException("Contract not found with id: " + id);
        }
        
        Contract contract = contractOpt.get();
        contract.setStatus(ContractStatus.TERMINATED);
        
        return contractRepository.save(contract);
    }
    
    public boolean existsByContractCode(String contractCode) {
        return contractRepository.existsByContractCode(contractCode);
    }
    
    public long getTotalContractCount() {
        return contractRepository.count();
    }
    
    public long getContractCountByStatus(ContractStatus status) {
        return contractRepository.findByStatus(status).size();
    }
    
    public long getContractCountByInternship(Long internshipId) {
        return contractRepository.findByInternshipId(internshipId).size();
    }
    
    private String generateContractCode() {
        // Simple contract code generation
        return "CT" + System.currentTimeMillis();
    }
    
    // Teacher-specific methods
    public Page<Contract> getContractsByTeacher(Long teacherId, Pageable pageable) {
        return contractRepository.findByTeacherId(teacherId, pageable);
    }
    
    public Contract approveContract(Long id, String approvedBy) {
        Optional<Contract> contractOpt = contractRepository.findById(id);
        if (contractOpt.isEmpty()) {
            throw new RuntimeException("Contract not found with id: " + id);
        }
        
        Contract contract = contractOpt.get();
        contract.setApprovalStatus("APPROVED");
        contract.setApprovedBy(approvedBy);
        contract.setApprovalDate(LocalDate.now());
        contract.setStatus(ContractStatus.SIGNED);
        
        return contractRepository.save(contract);
    }
    
    public Contract rejectContract(Long id, String rejectedBy) {
        Optional<Contract> contractOpt = contractRepository.findById(id);
        if (contractOpt.isEmpty()) {
            throw new RuntimeException("Contract not found with id: " + id);
        }
        
        Contract contract = contractOpt.get();
        contract.setApprovalStatus("REJECTED");
        contract.setApprovedBy(rejectedBy);
        contract.setApprovalDate(LocalDate.now());
        contract.setStatus(ContractStatus.REJECTED);
        
        return contractRepository.save(contract);
    }
    
    public Contract updatePaymentStatus(Long id, String paymentStatus) {
        Optional<Contract> contractOpt = contractRepository.findById(id);
        if (contractOpt.isEmpty()) {
            throw new RuntimeException("Contract not found with id: " + id);
        }
        
        Contract contract = contractOpt.get();
        contract.setPaymentStatus(paymentStatus);
        
        if ("PAID".equals(paymentStatus)) {
            contract.setPaymentDate(LocalDate.now());
            contract.setStatus(ContractStatus.PAID);
        }
        
        return contractRepository.save(contract);
    }
    
    public Contract updateContractStatus(Long id, ContractStatus status) {
        Optional<Contract> contractOpt = contractRepository.findById(id);
        if (contractOpt.isEmpty()) {
            throw new RuntimeException("Contract not found with id: " + id);
        }
        
        Contract contract = contractOpt.get();
        contract.setStatus(status);
        
        // Update additional fields based on status
        switch (status) {
            case SIGNED:
                if (contract.getSignedDate() == null) {
                    contract.setSignedDate(LocalDate.now());
                }
                break;
            case PAID:
                if (contract.getPaymentDate() == null) {
                    contract.setPaymentDate(LocalDate.now());
                }
                if (contract.getPaymentStatus() == null || !"PAID".equals(contract.getPaymentStatus())) {
                    contract.setPaymentStatus("PAID");
                }
                break;
            case EXPIRED:
            case TERMINATED:
                // These statuses don't require additional field updates
                break;
        }
        
        return contractRepository.save(contract);
    }
    
    public Contract createContractWithInternship(Contract contract, Long internshipId) {
        // Validate internship exists
        Optional<Internship> internshipOpt = internshipRepository.findById(internshipId);
        if (internshipOpt.isEmpty()) {
            throw new RuntimeException("Internship not found with id: " + internshipId);
        }
        
        // Set internship relationship
        contract.setInternship(internshipOpt.get());
        
        // Use the existing createContract method which handles code generation and validation
        return createContract(contract);
    }
} 