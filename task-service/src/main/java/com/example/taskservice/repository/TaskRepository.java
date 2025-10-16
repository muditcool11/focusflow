package com.example.taskservice.repository;

import com.example.taskservice.entity.Task;
import com.example.taskservice.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByUserId(Long userId);
    
    List<Task> findByUserIdAndStatus(Long userId, Status status);
    
    List<Task> findByUserIdAndPriority(Long userId, com.example.taskservice.entity.Priority priority);
    
    @Query("SELECT t FROM Task t WHERE t.userId = :userId AND t.dueDate < :currentDate AND t.status != 'DONE'")
    List<Task> findOverdueTasksByUserId(@Param("userId") Long userId, @Param("currentDate") java.time.LocalDateTime currentDate);
    
    @Query("SELECT t FROM Task t WHERE t.userId = :userId AND t.dueDate BETWEEN :startDate AND :endDate")
    List<Task> findTasksByUserIdAndDateRange(@Param("userId") Long userId, 
                                           @Param("startDate") java.time.LocalDateTime startDate, 
                                           @Param("endDate") java.time.LocalDateTime endDate);
}
