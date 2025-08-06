package com.internship.controller;

import com.internship.entity.Task;
import com.internship.entity.Task.TaskStatus;
import com.internship.entity.Internship;
import com.internship.entity.Mentor;
import com.internship.entity.Student;
import com.internship.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/tasks")
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    @GetMapping
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR') or hasRole('STUDENT')")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskService.getTaskById(id);
        return task.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/internship/{internshipId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR') or hasRole('STUDENT')")
    public ResponseEntity<List<Task>> getTasksByInternship(@PathVariable Long internshipId) {
        List<Task> tasks = taskService.getTasksByInternship(internshipId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/mentor/{mentorId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('MENTOR')")
    public ResponseEntity<List<Task>> getTasksByMentor(@PathVariable Long mentorId) {
        List<Task> tasks = taskService.getTasksByMentor(mentorId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<List<Task>> getTasksByStudent(@PathVariable Long studentId) {
        List<Task> tasks = taskService.getTasksByStudent(studentId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable TaskStatus status) {
        List<Task> tasks = taskService.getTasksByStatus(status);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/overdue")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<List<Task>> getOverdueTasks() {
        List<Task> tasks = taskService.getOverdueTasks();
        return ResponseEntity.ok(tasks);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<?> createTask(@Valid @RequestBody Map<String, Object> taskData) {
        try {
            Task task = new Task();
            task.setTitle((String) taskData.get("title"));
            task.setDescription((String) taskData.get("description"));
            
            // Set internship
            if (taskData.get("internshipId") != null) {
                Internship internship = new Internship();
                internship.setId(Long.valueOf(taskData.get("internshipId").toString()));
                task.setInternship(internship);
            }
            
            // Set mentor
            if (taskData.get("mentorId") != null) {
                Mentor mentor = new Mentor();
                mentor.setId(Long.valueOf(taskData.get("mentorId").toString()));
                task.setMentor(mentor);
            }
            
            // Set student
            if (taskData.get("studentId") != null) {
                Student student = new Student();
                student.setId(Long.valueOf(taskData.get("studentId").toString()));
                task.setStudent(student);
            }
            
            // Set priority
            if (taskData.get("priority") != null) {
                task.setPriority(Task.TaskPriority.valueOf((String) taskData.get("priority")));
            }
            
            // Set due date
            if (taskData.get("dueDate") != null) {
                task.setDueDate(java.time.LocalDate.parse((String) taskData.get("dueDate")));
            }
            
            // Set estimated hours
            if (taskData.get("estimatedHours") != null) {
                task.setEstimatedHours(Integer.valueOf(taskData.get("estimatedHours").toString()));
            }
            
            Task createdTask = taskService.createTask(task);
            return ResponseEntity.status(201).body(createdTask);
        } catch (RuntimeException e) {
            System.err.println("Error creating task: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR')")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @Valid @RequestBody Task task) {
        try {
            task.setId(id);
            Task updatedTask = taskService.updateTask(task);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            System.err.println("Error updating task: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('TEACHER') or hasRole('MENTOR') or hasRole('STUDENT')")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long id, @RequestBody Map<String, String> statusData) {
        try {
            TaskStatus status = TaskStatus.valueOf(statusData.get("status"));
            Task updatedTask = taskService.updateTaskStatus(id, status);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            System.err.println("Error updating task status: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DEPARTMENT') or hasRole('MENTOR')")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}