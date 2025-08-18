package com.internship.dto.response;

import com.internship.entity.Company;
import com.internship.entity.InternshipBatch;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InternshipBatchWithStudentCountDto {
    private Long id;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String batchName;
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
    private Company company;
    private Long currentStudents; // Số lượng sinh viên đã đăng ký
    private Long enrollmentProgress; // Phần trăm đăng ký (0-100)
    
    public static InternshipBatchWithStudentCountDto fromEntity(InternshipBatch batch, Long currentStudents) {
        InternshipBatchWithStudentCountDto dto = new InternshipBatchWithStudentCountDto();
        dto.setId(batch.getId());
        dto.setCreatedAt(batch.getCreatedAt());
        dto.setUpdatedAt(batch.getUpdatedAt());
        dto.setBatchName(batch.getBatchName());
        dto.setBatchCode(batch.getBatchCode());
        dto.setSemester(batch.getSemester());
        dto.setAcademicYear(batch.getAcademicYear());
        dto.setStartDate(batch.getStartDate());
        dto.setEndDate(batch.getEndDate());
        dto.setRegistrationStartDate(batch.getRegistrationStartDate());
        dto.setRegistrationEndDate(batch.getRegistrationEndDate());
        dto.setDescription(batch.getDescription());
        dto.setMaxStudents(batch.getMaxStudents());
        dto.setIsActive(batch.getIsActive());
        dto.setCompany(batch.getCompany());
        dto.setCurrentStudents(currentStudents != null ? currentStudents : 0L);
        
        // Tính phần trăm đăng ký
        if (batch.getMaxStudents() != null && batch.getMaxStudents() > 0) {
            dto.setEnrollmentProgress(Math.round((double) dto.getCurrentStudents() / batch.getMaxStudents() * 100));
        } else {
            dto.setEnrollmentProgress(0L);
        }
        
        return dto;
    }
}
