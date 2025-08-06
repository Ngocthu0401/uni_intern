package com.internship.dto.response;

import com.internship.entity.Teacher;
import lombok.Data;

@Data
public class TeacherResponse {
    private Long id;
    private String teacherCode;
    private String department;
    private String position;
    private String degree;
    private String specialization;
    private String officeLocation;
    
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
    
    // Constructor to convert from Teacher entity
    public TeacherResponse(Teacher teacher) {
        this.id = teacher.getId();
        this.teacherCode = teacher.getTeacherCode();
        this.department = teacher.getDepartment();
        this.position = teacher.getPosition();
        this.degree = teacher.getDegree();
        this.specialization = teacher.getSpecialization();
        this.officeLocation = teacher.getOfficeLocation();
        
        if (teacher.getUser() != null) {
            this.user = new UserInfo();
            this.user.setId(teacher.getUser().getId());
            this.user.setUsername(teacher.getUser().getUsername());
            this.user.setEmail(teacher.getUser().getEmail());
            this.user.setFullName(teacher.getUser().getFullName());
            this.user.setPhoneNumber(teacher.getUser().getPhoneNumber());
            this.user.setIsActive(teacher.getUser().getIsActive());
            this.user.setAvatarUrl(teacher.getUser().getAvatarUrl());
        }
    }
}