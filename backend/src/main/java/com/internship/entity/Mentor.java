package com.internship.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.internship.enums.ExpertiseLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@Table(name = "mentors")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Mentor extends BaseEntity {
    
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @NotNull(message = "User is required")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    @NotNull(message = "Company is required")
    private Company company;
    
    @Column(name = "position")
    @Size(max = 100, message = "Position must not exceed 100 characters")
    private String position;
    
    @Column(name = "department")
    @Size(max = 100, message = "Department must not exceed 100 characters")
    private String department;
    
    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;
    
    @Column(name = "specialization")
    @Size(max = 255, message = "Specialization must not exceed 255 characters")
    private String specialization;
    
    @Column(name = "office_location")
    @Size(max = 255, message = "Office location must not exceed 255 characters")
    private String officeLocation;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "expertise_level")
    private ExpertiseLevel expertiseLevel = ExpertiseLevel.INTERMEDIATE;
    
    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Internship> internships;
} 