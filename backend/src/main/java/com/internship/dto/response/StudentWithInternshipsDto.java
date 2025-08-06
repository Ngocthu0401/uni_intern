package com.internship.dto.response;

import com.internship.entity.User;
import com.internship.enums.StudentStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class StudentWithInternshipsDto {
    private Long id;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private User user;
    private String studentCode;
    private String className;
    private String major;
    private String academicYear;
    private Double gpa;
    private LocalDate dateOfBirth;
    private String address;
    private String parentName;
    private String parentPhone;
    private StudentStatus status;
    private List<InternshipForStudentDto> internships;
}