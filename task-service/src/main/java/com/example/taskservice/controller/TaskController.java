package com.example.taskservice.controller;

import com.example.taskservice.entity.Task;
import com.example.taskservice.dto.CreateTaskRequest;
import com.example.taskservice.entity.Status;
import com.example.taskservice.service.TaskService;
import com.example.taskservice.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {
    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);
    
    @Autowired
    private TaskService taskService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    private Long getUserIdFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                // Try to get numeric userId claim first (added by user-service). Fallback to subject parsing.
                Long userId = jwtUtil.getUserIdFromToken(token);
                if (userId != null) return userId;
                String username = jwtUtil.getUsernameFromToken(token);
                // Fallback: if subject contains numeric id, parse it (legacy behavior)
                try {
                    return Long.parseLong(username);
                } catch (NumberFormatException ex) {
                    return null;
                }
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }
    
    @GetMapping(path = {"", "/"})
    public ResponseEntity<?> getAllTasks(@RequestParam(required = false) Status status,
                                         @RequestParam(required = false) com.example.taskservice.entity.Priority priority,
                                         HttpServletRequest request) {
        Long userId = getUserIdFromToken(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or missing token"));
        }

        // Prefer status-based query when provided. If both provided, apply both filters.
        if (status != null && priority != null) {
            List<Task> tasksByStatus = taskService.getTasksByStatus(userId, status);
            // filter by priority
            tasksByStatus.removeIf(t -> !t.getPriority().equals(priority));
            return ResponseEntity.ok(tasksByStatus);
        } else if (status != null) {
            List<Task> tasks = taskService.getTasksByStatus(userId, status);
            return ResponseEntity.ok(tasks);
        } else if (priority != null) {
            List<Task> tasks = taskService.getTasksByPriority(userId, priority);
            return ResponseEntity.ok(tasks);
        }

        List<Task> tasks = taskService.getAllTasksByUserId(userId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id, HttpServletRequest request) {
        Long userId = getUserIdFromToken(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or missing token"));
        }
        
        Optional<Task> task = taskService.getTaskById(id, userId);
        if (task.isPresent()) {
            return ResponseEntity.ok(task.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Task not found"));
        }
    }
    
    @PostMapping(path = {"", "/"})
    public ResponseEntity<?> createTask(@Valid @RequestBody CreateTaskRequest createRequest, HttpServletRequest request) {
        logger.debug("Incoming createTask request: {}", createRequest);
        try {
            Long userId = getUserIdFromToken(request);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid or missing token"));
            }

            // Map DTO to entity and set the userId from the JWT claim before validation/persistence
            Task task = new Task();
            task.setTitle(createRequest.getTitle());
            task.setDescription(createRequest.getDescription());
            task.setPriority(createRequest.getPriority());
            task.setStatus(createRequest.getStatus());
            task.setDueDate(createRequest.getDueDate());
            task.setUserId(userId);

            Task createdTask = taskService.createTask(task);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        } catch (Exception e) {
            logger.error("Error creating task", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @Valid @RequestBody CreateTaskRequest updateRequest, 
                                       HttpServletRequest request) {
        Long userId = getUserIdFromToken(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or missing token"));
        }

        // Map DTO to a Task object (userId will be enforced from existing entity)
        Task taskDetails = new Task();
        taskDetails.setTitle(updateRequest.getTitle());
        taskDetails.setDescription(updateRequest.getDescription());
        taskDetails.setPriority(updateRequest.getPriority());
        taskDetails.setStatus(updateRequest.getStatus());
        taskDetails.setDueDate(updateRequest.getDueDate());

        Optional<Task> updatedTask = taskService.updateTask(id, taskDetails, userId);
        if (updatedTask.isPresent()) {
            return ResponseEntity.ok(updatedTask.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Task not found or access denied"));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, HttpServletRequest request) {
        Long userId = getUserIdFromToken(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or missing token"));
        }
        
        boolean deleted = taskService.deleteTask(id, userId);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Task not found or access denied"));
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getTasksByStatus(@PathVariable Status status, HttpServletRequest request) {
        Long userId = getUserIdFromToken(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or missing token"));
        }
        
        List<Task> tasks = taskService.getTasksByStatus(userId, status);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/overdue")
    public ResponseEntity<?> getOverdueTasks(HttpServletRequest request) {
        Long userId = getUserIdFromToken(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or missing token"));
        }
        
        List<Task> tasks = taskService.getOverdueTasks(userId);
        return ResponseEntity.ok(tasks);
    }
}
