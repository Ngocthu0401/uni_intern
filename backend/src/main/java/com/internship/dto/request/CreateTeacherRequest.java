package com.internship.dto.request;

import com.internship.enums.RoleType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateTeacherRequest {
    
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
    
    private RoleType role = RoleType.TEACHER;
    
    // Teacher specific information
    @NotBlank(message = "Teacher code is required")
    private String teacherCode;
    
    @NotBlank(message = "Department is required")
    private String department;
    
    @NotBlank(message = "Position is required")
    private String position;
    
    @NotBlank(message = "Degree is required")
    private String degree;
    
    private String specialization;
    
    private String officeLocation;
}