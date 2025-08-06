package com.internship.controller;

import com.internship.entity.Contract;
import com.internship.entity.Teacher;
import com.internship.entity.User;
import com.internship.enums.ContractStatus;
import com.internship.service.ContractService;
import com.internship.service.TeacherService;
import com.internship.service.UserService;
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
@RequestMapping("/contracts")
public class ContractController {
    
    @Autowired
    private ContractService contractService;
    
    @Autowired
    private TeacherService teacherService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Contract>> getAllContracts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Contract> contracts = contractService.getAllContracts(pageable);
        return ResponseEntity.ok(contracts);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<Contract> getContractById(@PathVariable Long id) {
        Optional<Contract> contract = contractService.getContractById(id);
        return contract.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/code/{contractCode}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<Contract> getContractByCode(@PathVariable String contractCode) {
        Optional<Contract> contract = contractService.getContractByCode(contractCode);
        return contract.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/internship/{internshipId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<List<Contract>> getContractsByInternshipId(@PathVariable Long internshipId) {
        List<Contract> contracts = contractService.getContractsByInternshipId(internshipId);
        return ResponseEntity.ok(contracts);
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Contract>> getContractsByStatus(
            @PathVariable ContractStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Contract> contracts = contractService.getContractsByStatus(status, pageable);
        return ResponseEntity.ok(contracts);
    }
    
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<List<Contract>> getContractsByStudentId(@PathVariable Long studentId) {
        List<Contract> contracts = contractService.getContractsByStudentId(studentId);
        return ResponseEntity.ok(contracts);
    }
    
    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<List<Contract>> getContractsByCompanyId(@PathVariable Long companyId) {
        List<Contract> contracts = contractService.getContractsByCompanyId(companyId);
        return ResponseEntity.ok(contracts);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Contract>> searchContracts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Contract> contracts = contractService.searchContracts(keyword, pageable);
        return ResponseEntity.ok(contracts);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Contract> createContract(@RequestBody Contract contract) {
        try {
            Contract createdContract = contractService.createContract(contract);
            return ResponseEntity.ok(createdContract);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Contract> updateContract(@PathVariable Long id, @RequestBody Contract contract) {
        try {
            Optional<Contract> existingContract = contractService.getContractById(id);
            if (existingContract.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            contract.setId(id);
            Contract updatedContract = contractService.updateContract(contract);
            if (updatedContract == null) {
                return ResponseEntity.badRequest().build();
            }
            return ResponseEntity.ok(updatedContract);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<?> deleteContract(@PathVariable Long id) {
        try {
            contractService.deleteContract(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/sign")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('STUDENT')")
    public ResponseEntity<Contract> signContract(@PathVariable Long id) {
        try {
            Contract contract = contractService.signContract(id);
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Contract> activateContract(@PathVariable Long id) {
        try {
            Contract contract = contractService.activateContract(id);
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/expire")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Contract> expireContract(@PathVariable Long id) {
        try {
            Contract contract = contractService.expireContract(id);
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/terminate")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Contract> terminateContract(@PathVariable Long id) {
        try {
            Contract contract = contractService.terminateContract(id);
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/check-code/{contractCode}")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Boolean> checkContractCodeExists(@PathVariable String contractCode) {
        boolean exists = contractService.existsByContractCode(contractCode);
        return ResponseEntity.ok(exists);
    }
    
    @GetMapping("/statistics/count")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Long> getTotalContractCount() {
        long count = contractService.getTotalContractCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/statistics/status/{status}/count")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Long> getContractCountByStatus(@PathVariable ContractStatus status) {
        long count = contractService.getContractCountByStatus(status);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/statistics/internship/{internshipId}/count")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<Long> getContractCountByInternship(@PathVariable Long internshipId) {
        long count = contractService.getContractCountByInternship(internshipId);
        return ResponseEntity.ok(count);
    }
    
    // Teacher-specific endpoints
    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<Page<Contract>> getContractsByTeacher(
            @PathVariable Long teacherId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Contract> contracts = contractService.getContractsByTeacher(teacherId, pageable);
        return ResponseEntity.ok(contracts);
    }
    
    @PostMapping("/teacher")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<?> createSupportContract(@RequestBody java.util.Map<String, Object> contractData, 
                                                    java.security.Principal principal) {
        try {
            // Get current user and teacher
            String username = principal.getName();
            Optional<User> currentUserOpt = userService.getUserByUsername(username);
            if (currentUserOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(java.util.Map.of("message", "User not found"));
            }
            User currentUser = currentUserOpt.get();
            
            // Only set teacher if user is actually a teacher
            Teacher currentTeacher = null;
            if (currentUser.getRole().name().equals("TEACHER")) {
                Optional<Teacher> currentTeacherOpt = teacherService.getTeacherByUserId(currentUser.getId());
                if (currentTeacherOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body(java.util.Map.of("message", "Teacher not found"));
                }
                currentTeacher = currentTeacherOpt.get();
            }
            
            // Set contract type to SUPPORT for teacher-created contracts
            Contract contract = new Contract();
            if (currentTeacher != null) {
                contract.setCreatedByTeacher(currentTeacher);
            }
            contract.setTitle((String) contractData.get("title"));
            contract.setContent((String) contractData.get("content"));
            contract.setTermsAndConditions((String) contractData.get("termsAndConditions"));
            contract.setPaymentTerms((String) contractData.get("paymentTerms"));
            contract.setContractCode((String) contractData.get("contractCode"));
            contract.setContractType("SUPPORT");
            
            // Handle support amount
            if (contractData.containsKey("supportAmount")) {
                Object amountObj = contractData.get("supportAmount");
                if (amountObj instanceof Number) {
                    contract.setSupportAmount(((Number) amountObj).doubleValue());
                } else if (amountObj instanceof String && !((String) amountObj).isEmpty()) {
                    contract.setSupportAmount(Double.valueOf((String) amountObj));
                }
            }
            
            // Handle dates
            if (contractData.containsKey("startDate") && contractData.get("startDate") != null) {
                String startDateStr = (String) contractData.get("startDate");
                if (!startDateStr.isEmpty()) {
                    contract.setStartDate(java.time.LocalDate.parse(startDateStr));
                }
            }
            if (contractData.containsKey("endDate") && contractData.get("endDate") != null) {
                String endDateStr = (String) contractData.get("endDate");
                if (!endDateStr.isEmpty()) {
                    contract.setEndDate(java.time.LocalDate.parse(endDateStr));
                }
            }
            
            // Handle internship relationship
            if (contractData.containsKey("internshipId")) {
                String internshipIdStr = (String) contractData.get("internshipId");
                if (internshipIdStr != null && !internshipIdStr.trim().isEmpty()) {
                    try {
                        Long internshipId = Long.valueOf(internshipIdStr);
                        // Set internship relationship through service
                        Contract createdContract = contractService.createContractWithInternship(contract, internshipId);
                        return ResponseEntity.ok(createdContract);
                    } catch (NumberFormatException e) {
                        return ResponseEntity.badRequest().body(java.util.Map.of("message", "Invalid internship ID format"));
                    }
                } else {
                    // Create contract without internship (template contract)
                    contract.setStatus(com.internship.enums.ContractStatus.DRAFT);
                    contract.setApprovalStatus("PENDING");
                    Contract createdContract = contractService.createContract(contract);
                    return ResponseEntity.ok(createdContract);
                }
            } else {
                // Create contract without internship (template contract)
                contract.setStatus(com.internship.enums.ContractStatus.DRAFT);
                contract.setApprovalStatus("PENDING");
                Contract createdContract = contractService.createContract(contract);
                return ResponseEntity.ok(createdContract);
            }
        } catch (RuntimeException e) {
            System.err.println("Error creating support contract: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<?> approveContract(@PathVariable Long id, @RequestParam String approvedBy) {
        try {
            Contract contract = contractService.approveContract(id, approvedBy);
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER')")
    public ResponseEntity<?> rejectContract(@PathVariable Long id, @RequestParam String rejectedBy) {
        try {
            Contract contract = contractService.rejectContract(id, rejectedBy);
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/payment")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, @RequestParam String paymentStatus) {
        try {
            Contract contract = contractService.updatePaymentStatus(id, paymentStatus);
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('DEPARTMENT')")
    public ResponseEntity<?> updateContractStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            ContractStatus contractStatus = ContractStatus.valueOf(status.toUpperCase());
            Contract contract = contractService.updateContractStatus(id, contractStatus);
            return ResponseEntity.ok(contract);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Invalid status: " + status));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
} 