package com.internship.entity;

import com.internship.enums.ContractStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "contracts")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Contract extends BaseEntity {
    
    @OneToOne
    @JoinColumn(name = "internship_id", referencedColumnName = "id")
    private Internship internship;
    
    @ManyToOne
    @JoinColumn(name = "created_by_teacher_id", referencedColumnName = "id")
    private Teacher createdByTeacher;
    
    @Column(name = "contract_code", unique = true)
    private String contractCode;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "terms_and_conditions", columnDefinition = "TEXT")
    private String termsAndConditions;
    
    @Column(name = "start_date")
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private ContractStatus status = ContractStatus.DRAFT;
    
    @Column(name = "signed_date")
    private LocalDate signedDate;
    
    @Column(name = "contract_file_url")
    private String contractFileUrl;
    
    @Column(name = "student_signature")
    private String studentSignature;
    
    @Column(name = "company_signature")
    private String companySignature;
    
    @Column(name = "department_signature")
    private String departmentSignature;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    // Support contract specific fields
    @Column(name = "contract_type")
    private String contractType = "SUPPORT"; // SUPPORT, INTERNSHIP, etc.
    
    @Column(name = "support_amount")
    private Double supportAmount; // Mức hỗ trợ tài chính
    
    @Column(name = "payment_terms", columnDefinition = "TEXT")
    private String paymentTerms; // Điều khoản thanh toán
    
    @Column(name = "payment_status")
    private String paymentStatus = "PENDING"; // PENDING, PAID, OVERDUE
    
    @Column(name = "payment_date")
    private LocalDate paymentDate; // Ngày thanh toán thực tế
    
    @Column(name = "approval_status")
    private String approvalStatus = "PENDING"; // PENDING, APPROVED, REJECTED
    
    @Column(name = "approved_by")
    private String approvedBy; // Người duyệt
    
    @Column(name = "approval_date")
    private LocalDate approvalDate; // Ngày duyệt
    
    @Column(name = "template_id")
    private String templateId; // ID của template hợp đồng
} 