package com.internship.dto.request;

import com.internship.enums.InternshipStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateInternshipRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 255, message = "Job title must not exceed 255 characters")
    private String jobTitle;

    @NotBlank(message = "Job description is required")
    private String jobDescription;

    private String requirements;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private InternshipStatus status = InternshipStatus.PENDING;

    private Integer workingHoursPerWeek;

    private Double salary;

    private String benefits;

    private String notes;

    // Relationship IDs
    private Long studentId;
    private Long teacherId;
    private Long mentorId;
    private Long companyId;
    private Long internshipBatchId;
}
