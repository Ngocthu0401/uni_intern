package com.internship.dto.request;

import com.internship.enums.RoleType;
import lombok.Data;

@Data
public class CreateMentorRequest {
    // User information
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String password;
    private RoleType role = RoleType.MENTOR;
    
    // Mentor specific information
    private Long companyId;
    private String position;
    private String department;
    private String specialization;
    private String officeLocation;
    private Integer yearsOfExperience;
}