package com.internship.service;

import com.internship.entity.Task;
import com.internship.entity.Task.TaskStatus;
import com.internship.entity.Task.TaskPriority;
import com.internship.entity.Internship;
import com.internship.entity.Mentor;
import com.internship.entity.Student;
import com.internship.repository.TaskRepository;
import com.internship.repository.InternshipRepository;
import com.internship.repository.MentorRepository;
import com.internship.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private InternshipRepository internshipRepository;
    
    @Autowired
    private MentorRepository mentorRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
    
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }
    
    public List<Task> getTasksByInternship(Long internshipId) {
        return taskRepository.findByInternshipIdOrderByCreatedAtDesc(internshipId);
    }
    
    public List<Task> getTasksByMentor(Long mentorId) {
        return taskRepository.findByInternshipMentorId(mentorId);
    }
    
    public List<Task> getTasksByStudent(Long studentId) {
        return taskRepository.findByStudentId(studentId);
    }
    
    public List<Task> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }
    
    public List<Task> getOverdueTasks() {
        return taskRepository.findByDueDateBefore(LocalDate.now());
    }
    
    @Transactional(readOnly = false)
    public Task createTask(Task task) {
        // Set internship if provided
        if (task.getInternship() != null && task.getInternship().getId() != null) {
            Optional<Internship> internshipOpt = internshipRepository.findById(task.getInternship().getId());
            if (internshipOpt.isPresent()) {
                task.setInternship(internshipOpt.get());
            } else {
                throw new RuntimeException("Internship not found with id: " + task.getInternship().getId());
            }
        }
        
        // Set mentor if provided
        if (task.getMentor() != null && task.getMentor().getId() != null) {
            Optional<Mentor> mentorOpt = mentorRepository.findById(task.getMentor().getId());
            if (mentorOpt.isPresent()) {
                task.setMentor(mentorOpt.get());
            } else {
                throw new RuntimeException("Mentor not found with id: " + task.getMentor().getId());
            }
        }
        
        // Set student if provided
        if (task.getStudent() != null && task.getStudent().getId() != null) {
            Optional<Student> studentOpt = studentRepository.findById(task.getStudent().getId());
            if (studentOpt.isPresent()) {
                task.setStudent(studentOpt.get());
            } else {
                throw new RuntimeException("Student not found with id: " + task.getStudent().getId());
            }
        }
        
        // Set default status if not provided
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.PENDING);
        }
        
        // Set default priority if not provided
        if (task.getPriority() == null) {
            task.setPriority(TaskPriority.MEDIUM);
        }
        
        return taskRepository.save(task);
    }
    
    @Transactional(readOnly = false)
    public Task updateTask(Task task) {
        Optional<Task> existingOpt = taskRepository.findById(task.getId());
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Task not found with id: " + task.getId());
        }
        
        return taskRepository.save(task);
    }
    
    @Transactional(readOnly = false)
    public Task updateTaskStatus(Long taskId, TaskStatus status) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isEmpty()) {
            throw new RuntimeException("Task not found with id: " + taskId);
        }
        
        Task task = taskOpt.get();
        task.setStatus(status);
        return taskRepository.save(task);
    }
    
    @Transactional(readOnly = false)
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }
    
    // Statistics methods
    public Long countTasksByInternshipAndStatus(Long internshipId, TaskStatus status) {
        return taskRepository.countByInternshipIdAndStatus(internshipId, status);
    }
    
    public Long countTasksByMentorAndStatus(Long mentorId, TaskStatus status) {
        return taskRepository.countByMentorIdAndStatus(mentorId, status);
    }
}