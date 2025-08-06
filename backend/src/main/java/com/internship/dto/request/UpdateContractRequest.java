package com.internship.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateContractRequest {
    private String title;
    private String content;
    private String termsAndConditions;
    private String contractType;
    private Double supportAmount;
    private String paymentTerms;
    private LocalDate startDate;
    private LocalDate endDate;
    private String notes;
    private String paymentStatus;
    private String approvalStatus;
}