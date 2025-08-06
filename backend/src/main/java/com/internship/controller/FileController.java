package com.internship.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/files")
public class FileController {
    
    // Base directory for file uploads (should be configurable)
    private final String uploadDir = System.getProperty("user.dir") + "/uploads/reports/";
    
    @GetMapping("/download/{fileName}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT') or hasRole('MENTOR')")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            // Resolve file path
            Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
            
            // Security check: ensure file is within upload directory
            if (!filePath.startsWith(Paths.get(uploadDir))) {
                throw new RuntimeException("Invalid file path");
            }
            
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                // Determine content type
                String contentType = null;
                try {
                    contentType = Files.probeContentType(filePath);
                } catch (IOException ex) {
                    // Fallback to default content type
                    contentType = "application/octet-stream";
                }
                
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, 
                               "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("File not found: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found: " + fileName, ex);
        }
    }
    
    @GetMapping("/view/{fileName}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT') or hasRole('MENTOR')")
    public ResponseEntity<Resource> viewFile(@PathVariable String fileName) {
        try {
            // Resolve file path
            Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
            
            // Security check: ensure file is within upload directory
            if (!filePath.startsWith(Paths.get(uploadDir))) {
                throw new RuntimeException("Invalid file path");
            }
            
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                // Determine content type
                String contentType = null;
                try {
                    contentType = Files.probeContentType(filePath);
                } catch (IOException ex) {
                    // Fallback to default content type
                    contentType = "application/octet-stream";
                }
                
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                        .body(resource);
            } else {
                throw new RuntimeException("File not found: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found: " + fileName, ex);
        }
    }
    
    @PostMapping("/upload")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> uploadFiles(@RequestParam(value = "files", required = false) MultipartFile[] files) {
        try {
            // Handle case where no files are uploaded
            if (files == null || files.length == 0) {
                return ResponseEntity.ok(Map.of("files", new ArrayList<>(), "message", "No files uploaded"));
            }
            
            // Create uploads directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            List<String> fileNames = new ArrayList<>();
            
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }
                
                // Generate unique filename to avoid conflicts
                String originalFilename = file.getOriginalFilename();
                String extension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String uniqueFilename = UUID.randomUUID().toString() + "_" + originalFilename;
                
                // Save file
                Path filePath = uploadPath.resolve(uniqueFilename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                fileNames.add(uniqueFilename);
            }
            
            return ResponseEntity.ok(Map.of("files", fileNames, "message", "Files uploaded successfully"));
            
        } catch (IOException ex) {
            throw new RuntimeException("Failed to upload files", ex);
        }
    }
}