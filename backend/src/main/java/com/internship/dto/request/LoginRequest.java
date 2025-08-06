package com.internship.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    
    // Username field - no validation to allow email login
    private String username;
    
    // Email field for email login
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    // Helper method to get username or email
    public String getUsernameOrEmail() {
        if (username != null && !username.trim().isEmpty()) {
            return username;
        }
        return email;
    }
} 