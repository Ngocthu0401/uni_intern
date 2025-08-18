package com.internship.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBatchRequest {
    private String batchName; // Thay đổi từ name thành batchName để khớp với JSON
    private String name; // Giữ lại để backward compatibility
    private String batchCode;
    private String semester;
    private String academicYear;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate registrationStartDate;
    private LocalDate registrationEndDate;
    private String description;
    private Integer maxStudents;
    private Boolean isActive;
    private Long companyId; // ID của công ty
}
