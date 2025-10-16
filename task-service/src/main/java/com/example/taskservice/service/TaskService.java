package com.example.taskservice.service;

import com.example.taskservice.entity.Task;
import com.example.taskservice.entity.Status;
import com.example.taskservice.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    public List<Task> getAllTasksByUserId(Long userId) {
        return taskRepository.findByUserId(userId);
    }
    
    public Optional<Task> getTaskById(Long id, Long userId) {
        Optional<Task> task = taskRepository.findById(id);
        if (task.isPresent() && !task.get().getUserId().equals(userId)) {
            return Optional.empty();
        }
        return task;
    }
    
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }
    
    public Optional<Task> updateTask(Long id, Task taskDetails, Long userId) {
        Optional<Task> existingTask = taskRepository.findById(id);
        
        if (existingTask.isPresent() && existingTask.get().getUserId().equals(userId)) {
            Task task = existingTask.get();
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setPriority(taskDetails.getPriority());
            task.setStatus(taskDetails.getStatus());
            task.setDueDate(taskDetails.getDueDate());
            task.setUpdatedAt(LocalDateTime.now());
            
            return Optional.of(taskRepository.save(task));
        }
        
        return Optional.empty();
    }
    
    public boolean deleteTask(Long id, Long userId) {
        Optional<Task> task = taskRepository.findById(id);
        
        if (task.isPresent() && task.get().getUserId().equals(userId)) {
            taskRepository.deleteById(id);
            return true;
        }
        
        return false;
    }
    
    public List<Task> getTasksByStatus(Long userId, Status status) {
        return taskRepository.findByUserIdAndStatus(userId, status);
    }

    public List<Task> getTasksByPriority(Long userId, com.example.taskservice.entity.Priority priority) {
        return taskRepository.findByUserIdAndPriority(userId, priority);
    }
    
    public List<Task> getOverdueTasks(Long userId) {
        return taskRepository.findOverdueTasksByUserId(userId, LocalDateTime.now());
    }
    
    public List<Task> getTasksByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return taskRepository.findTasksByUserIdAndDateRange(userId, startDate, endDate);
    }
}
