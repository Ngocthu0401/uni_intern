package com.internship.dto.response;

import com.internship.entity.Company;
import com.internship.entity.Mentor;
import com.internship.entity.Teacher;
import com.internship.entity.InternshipBatch;
import com.internship.enums.InternshipStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class InternshipForStudentDto {
    private Long id;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Teacher teacher;
    private Mentor mentor;
    private Company company;
    private InternshipBatch internshipBatch;
    private String internshipCode;
    private String jobTitle;
    private String jobDescription;
    private String requirements;
    private LocalDate startDate;
    private LocalDate endDate;
    private InternshipStatus status;
    private Integer workingHoursPerWeek;
    private Double salary;
    private String benefits;
    private Double finalScore;
    private Double teacherScore;
    private Double mentorScore;
    private String teacherComment;
    private String mentorComment;
    private String notes;
}