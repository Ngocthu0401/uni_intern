package com.internship.service;

import com.internship.dto.request.CreateMentorRequest;
import com.internship.entity.Mentor;
import com.internship.entity.User;
import com.internship.entity.Company;
import com.internship.repository.MentorRepository;
import com.internship.repository.UserRepository;
import com.internship.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MentorService {
    
    @Autowired
    private MentorRepository mentorRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CompanyRepository companyRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    
    public List<Mentor> getAllMentors() {
        return mentorRepository.findAll();
    }
    
    public Page<Mentor> getAllMentors(Pageable pageable) {
        return mentorRepository.findAll(pageable);
    }
    
    public Optional<Mentor> getMentorById(Long id) {
        return mentorRepository.findById(id);
    }
    
    public Optional<Mentor> getMentorByUserId(Long userId) {
        return mentorRepository.findByUserId(userId);
    }
    
    public List<Mentor> getMentorsByCompanyId(Long companyId) {
        return mentorRepository.findByCompanyId(companyId);
    }
    
    public Page<Mentor> searchMentors(String keyword, Pageable pageable) {
        return mentorRepository.searchMentors(keyword, pageable);
    }
    
    public Mentor createMentor(Mentor mentor) {
        // Validate user exists
        if (mentor.getUser() != null && mentor.getUser().getId() != null) {
            Optional<User> userOpt = userRepository.findById(mentor.getUser().getId());
            if (userOpt.isEmpty()) {
                throw new RuntimeException("User not found with id: " + mentor.getUser().getId());
            }
            mentor.setUser(userOpt.get());
        }
        
        // Validate company exists
        if (mentor.getCompany() != null && mentor.getCompany().getId() != null) {
            Optional<Company> companyOpt = companyRepository.findById(mentor.getCompany().getId());
            if (companyOpt.isEmpty()) {
                throw new RuntimeException("Company not found with id: " + mentor.getCompany().getId());
            }
            mentor.setCompany(companyOpt.get());
        }
        
        return mentorRepository.save(mentor);
    }
    
    @Transactional(readOnly = false)
    public Mentor createMentorWithUser(CreateMentorRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }
        
        // Validate company exists
        Company company = null;
        if (request.getCompanyId() != null) {
            company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + request.getCompanyId()));
        }
        
        // Create User first
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setIsActive(true);
        
        User savedUser = userRepository.save(user);
        
        // Create Mentor
        Mentor mentor = new Mentor();
        mentor.setUser(savedUser);
        mentor.setCompany(company);
        mentor.setPosition(request.getPosition());
        mentor.setDepartment(request.getDepartment());
        mentor.setSpecialization(request.getSpecialization());
        mentor.setOfficeLocation(request.getOfficeLocation());
        mentor.setYearsOfExperience(request.getYearsOfExperience());
        
        Mentor savedMentor = mentorRepository.save(mentor);
        
        // Send email with login credentials
        try {
            emailService.sendPassword(
                savedUser.getEmail(), 
                savedUser.getFullName(), 
                savedUser.getUsername(), 
                request.getPassword(), 
                savedUser.getRole().toString()
            );
        } catch (Exception e) {
            System.err.println("Failed to send email to mentor: " + e.getMessage());
            // Continue execution even if email fails
        }
        
        return savedMentor;
    }
    
    public Mentor updateMentor(Mentor mentor) {
        Optional<Mentor> existingOpt = mentorRepository.findById(mentor.getId());
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Mentor not found with id: " + mentor.getId());
        }
        
        // Validate user exists if being changed
        if (mentor.getUser() != null && mentor.getUser().getId() != null) {
            Optional<User> userOpt = userRepository.findById(mentor.getUser().getId());
            if (userOpt.isEmpty()) {
                throw new RuntimeException("User not found with id: " + mentor.getUser().getId());
            }
            mentor.setUser(userOpt.get());
        }
        
        // Validate company exists if being changed
        if (mentor.getCompany() != null && mentor.getCompany().getId() != null) {
            Optional<Company> companyOpt = companyRepository.findById(mentor.getCompany().getId());
            if (companyOpt.isEmpty()) {
                throw new RuntimeException("Company not found with id: " + mentor.getCompany().getId());
            }
            mentor.setCompany(companyOpt.get());
        }
        
        return mentorRepository.save(mentor);
    }
    
    public Mentor updateMentorInfo(Long mentorId, Mentor mentorData) {
        Optional<Mentor> existingOpt = mentorRepository.findById(mentorId);
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Mentor not found with id: " + mentorId);
        }
        
        Mentor existing = existingOpt.get();
        
        // Update only the allowed fields, preserve User relationship
        existing.setPosition(mentorData.getPosition());
        existing.setDepartment(mentorData.getDepartment());
        existing.setYearsOfExperience(mentorData.getYearsOfExperience());
        existing.setSpecialization(mentorData.getSpecialization());
        existing.setOfficeLocation(mentorData.getOfficeLocation());
        existing.setExpertiseLevel(mentorData.getExpertiseLevel());
        
        // Update company if provided
        if (mentorData.getCompany() != null && mentorData.getCompany().getId() != null) {
            Optional<Company> companyOpt = companyRepository.findById(mentorData.getCompany().getId());
            if (companyOpt.isEmpty()) {
                throw new RuntimeException("Company not found with id: " + mentorData.getCompany().getId());
            }
            existing.setCompany(companyOpt.get());
        }
        
        System.out.println("Updating mentor info for ID: " + mentorId + " with User ID: " + 
            (existing.getUser() != null ? existing.getUser().getId() : "NULL"));
        
        Mentor updatedMentor = mentorRepository.save(existing);
        
        System.out.println("Updated mentor info preserved: " + 
            (updatedMentor.getUser() != null ? updatedMentor.getUser().getFullName() : "NULL"));
        
        return updatedMentor;
    }
    
    public void deleteMentor(Long id) {
        if (!mentorRepository.existsById(id)) {
            throw new RuntimeException("Mentor not found with id: " + id);
        }
        mentorRepository.deleteById(id);
    }
    
    public long getTotalMentorCount() {
        return mentorRepository.count();
    }
    
    public long getMentorCountByCompany(Long companyId) {
        return mentorRepository.findByCompanyId(companyId).size();
    }
} 