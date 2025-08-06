package com.internship.dto.request;

import com.internship.enums.RoleType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

@Data
public class CreateStudentRequest {
    
    // User information
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    private String phoneNumber;
    
    @NotBlank(message = "Password is required")
    private String password = "defaultPassword123";
    
    private RoleType role = RoleType.STUDENT;
    
    // Student specific information
    @NotBlank(message = "Student code is required")
    private String studentCode;
    
    @NotBlank(message = "Class name is required")
    private String className;
    
    @NotBlank(message = "Major is required")
    private String major;
    
    private String academicYear;
    
    @DecimalMin(value = "0.0", message = "GPA must be at least 0.0")
    @DecimalMax(value = "4.0", message = "GPA must be at most 4.0")
    private Double gpa = 0.0;
}