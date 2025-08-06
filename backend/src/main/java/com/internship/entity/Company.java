package com.internship.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@Table(name = "companies")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Company extends BaseEntity {
    
    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 100, message = "Company name must be between 2 and 100 characters")
    @Column(name = "company_name", nullable = false)
    private String companyName;
    
    @Size(max = 20, message = "Abbreviated name must not exceed 20 characters")
    @Column(name = "abbreviated_name")
    private String abbreviatedName;
    
    @Column(name = "company_code", unique = true)
    private String companyCode;
    
    @Size(max = 50, message = "Company type must not exceed 50 characters")
    @Column(name = "company_type")
    private String companyType;
    
    @Size(max = 255, message = "Address must not exceed 255 characters")
    @Column(name = "address")
    private String address;
    
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Email(message = "Please provide a valid email address")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    @Column(name = "email")
    private String email;
    
    @Column(name = "website")
    private String website;
    
    @Column(name = "industry")
    private String industry;
    
    @Column(name = "company_size")
    private String companySize;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "contact_person")
    private String contactPerson;
    
    @Column(name = "contact_position")
    private String contactPosition;
    
    @Column(name = "contact_phone")
    private String contactPhone;
    
    @Column(name = "contact_email")
    private String contactEmail;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Mentor> mentors;
    
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Internship> internships;
} 