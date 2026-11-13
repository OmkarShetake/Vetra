package com.vetra.learningroadmap;

import com.vetra.identity.User;
import com.vetra.identity.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoadmapService {

    private final LearningPlanRepository planRepository;
    private final LearningTaskRepository taskRepository;
    private final UserRepository userRepository;

    public RoadmapService(LearningPlanRepository planRepository,
                          LearningTaskRepository taskRepository,
                          UserRepository userRepository) {
        this.planRepository = planRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    private User resolveUser(User user) {
        if (user != null) return user;
        return userRepository.findByEmail("omkar@vetra.io")
            .or(() -> userRepository.findAll().stream().findFirst())
            .orElseGet(() -> userRepository.save(new User("omkar@vetra.io", "password", "Omkar Shetake", "Java Backend Developer", "0-2")));
    }

    @Transactional
    public RoadmapDtos.RoadmapResponse getRoadmap(User user) {
        User currentUser = resolveUser(user);
        LearningPlan plan = planRepository.findFirstByUserIdOrderByCreatedAtDesc(currentUser.getId())
            .orElseGet(() -> seedRoadmapForUser(currentUser));

        List<LearningTask> tasks = taskRepository.findByPlanIdOrderByPhaseNumberAsc(plan.getId());
        if (tasks.isEmpty()) {
            seedTasks(plan);
            tasks = taskRepository.findByPlanIdOrderByPhaseNumberAsc(plan.getId());
        }

        Map<Integer, List<LearningTask>> grouped = tasks.stream()
            .collect(Collectors.groupingBy(LearningTask::getPhaseNumber, TreeMap::new, Collectors.toList()));

        List<RoadmapDtos.PhaseDto> phases = new ArrayList<>();
        int completedCount = 0;

        for (Map.Entry<Integer, List<LearningTask>> entry : grouped.entrySet()) {
            List<LearningTask> phaseTasks = entry.getValue();
            String title = phaseTasks.get(0).getPhaseTitle();
            int phaseHours = phaseTasks.stream().mapToInt(LearningTask::getEstimatedHours).sum();

            List<RoadmapDtos.TaskDto> taskDtos = new ArrayList<>();
            for (LearningTask t : phaseTasks) {
                if (t.isCompleted()) completedCount++;
                taskDtos.add(new RoadmapDtos.TaskDto(
                    t.getId(),
                    t.getTitle(),
                    t.getPriority(),
                    t.getEstimatedHours(),
                    t.isCompleted(),
                    t.getResourceUrl()
                ));
            }
            phases.add(new RoadmapDtos.PhaseDto(entry.getKey(), title, phaseHours, taskDtos));
        }

        int totalTasks = tasks.size();
        int progress = totalTasks > 0 ? Math.round(((float) completedCount / totalTasks) * 100) : 0;

        return new RoadmapDtos.RoadmapResponse(
            plan.getId(),
            plan.getTargetRole(),
            plan.getTotalHours(),
            completedCount,
            totalTasks,
            progress,
            phases
        );
    }

    @Transactional
    public boolean toggleTask(String taskId) {
        LearningTask task = taskRepository.findById(taskId).orElse(null);
        if (task != null) {
            task.setCompleted(!task.isCompleted());
            taskRepository.save(task);
            return task.isCompleted();
        }
        return false;
    }

    private LearningPlan seedRoadmapForUser(User user) {
        String role = user.getTargetRole() != null ? user.getTargetRole() : "Java Backend Developer";
        LearningPlan plan = new LearningPlan(user, role, 185);
        return planRepository.save(plan);
    }

    private void seedTasks(LearningPlan plan) {
        List<LearningTask> list = List.of(
            new LearningTask(plan, 1, "Java Core Fundamentals", "Java syntax, primitive types, and control flow", "HIGH", 5, "https://docs.oracle.com/javase/tutorial/"),
            new LearningTask(plan, 1, "Java Core Fundamentals", "Memory management: Heap vs Stack, GC basics", "HIGH", 6, null),
            new LearningTask(plan, 2, "OOP and Collections", "Encapsulation, Polymorphism, Abstraction, Inheritance", "HIGH", 8, null),
            new LearningTask(plan, 2, "OOP and Collections", "Collections Framework: List, Set, Map, and Queue", "HIGH", 10, null),
            new LearningTask(plan, 3, "SQL and PostgreSQL", "SQL fundamentals: SELECT, JOINs, subqueries, aggregation", "HIGH", 12, null),
            new LearningTask(plan, 3, "SQL and PostgreSQL", "Relational database schema design and indexing", "MEDIUM", 8, null),
            new LearningTask(plan, 4, "Spring Boot and REST APIs", "Spring Boot project setup, auto-configuration, and starters", "HIGH", 15, null),
            new LearningTask(plan, 4, "Spring Boot and REST APIs", "REST controller design, DTOs, and validation", "HIGH", 18, null),
            new LearningTask(plan, 5, "Spring Security & Docker", "JWT authentication and authorization filters", "HIGH", 14, null),
            new LearningTask(plan, 5, "Spring Security & Docker", "Containerizing Spring Boot apps with Docker multi-stage builds", "MEDIUM", 10, null)
        );
        taskRepository.saveAll(list);
    }
}
