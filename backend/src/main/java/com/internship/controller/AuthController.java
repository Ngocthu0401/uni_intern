package com.internship.controller;

import com.internship.dto.request.LoginRequest;
import com.internship.dto.request.RegisterRequest;
import com.internship.dto.response.JwtResponse;
import com.internship.dto.response.MessageResponse;
import com.internship.entity.User;
import com.internship.repository.UserRepository;
import com.internship.security.jwt.JwtUtils;
import com.internship.security.jwt.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    AuthenticationManager authenticationManager;
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    PasswordEncoder encoder;
    
    @Autowired
    JwtUtils jwtUtils;
    
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        
        // Use email if username is not provided
        String usernameOrEmail = loginRequest.getUsername() != null ? 
                                loginRequest.getUsername() : loginRequest.getEmail();
        
        if (usernameOrEmail == null || usernameOrEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Username or email is required"));
        }
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(usernameOrEmail, loginRequest.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
        
        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getFullName(),
                userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "").equals("DEPARTMENT") ? 
                    com.internship.enums.RoleType.DEPARTMENT :
                userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "").equals("TEACHER") ? 
                    com.internship.enums.RoleType.TEACHER :
                userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "").equals("STUDENT") ? 
                    com.internship.enums.RoleType.STUDENT :
                    com.internship.enums.RoleType.MENTOR));
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }
        
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        
        // Create new user's account
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setFullName(signUpRequest.getFullName());
        user.setPhoneNumber(signUpRequest.getPhoneNumber());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setRole(signUpRequest.getRole());
        user.setIsActive(true);
        
        userRepository.save(user);
        
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
} 