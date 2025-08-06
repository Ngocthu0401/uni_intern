package com.internship.dto.response;

import com.internship.entity.Student;
import com.internship.enums.StudentStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentResponse {
    private Long id;
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
    
    // User information
    private UserInfo user;
    
    @Data
    public static class UserInfo {
        private Long id;
        private String username;
        private String email;
        private String fullName;
        private String phoneNumber;
        private Boolean isActive;
        private String avatarUrl;
    }
    
    // Constructor to convert from Student entity
    public StudentResponse(Student student) {
        this.id = student.getId();
        this.studentCode = student.getStudentCode();
        this.className = student.getClassName();
        this.major = student.getMajor();
        this.academicYear = student.getAcademicYear();
        this.gpa = student.getGpa();
        this.dateOfBirth = student.getDateOfBirth();
        this.address = student.getAddress();
        this.parentName = student.getParentName();
        this.parentPhone = student.getParentPhone();
        this.status = student.getStatus();
        
        if (student.getUser() != null) {
            this.user = new UserInfo();
            this.user.setId(student.getUser().getId());
            this.user.setUsername(student.getUser().getUsername());
            this.user.setEmail(student.getUser().getEmail());
            this.user.setFullName(student.getUser().getFullName());
            this.user.setPhoneNumber(student.getUser().getPhoneNumber());
            this.user.setIsActive(student.getUser().getIsActive());
            this.user.setAvatarUrl(student.getUser().getAvatarUrl());
        }
    }
}