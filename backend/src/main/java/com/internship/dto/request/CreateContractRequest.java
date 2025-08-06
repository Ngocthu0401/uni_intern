package com.internship.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateContractRequest {
    private String title;
    private String content;
    private String termsAndConditions;
    private String contractType = "SUPPORT";
    private Double supportAmount;
    private String paymentTerms;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long internshipId;
    private String templateId;
    private String notes;
}