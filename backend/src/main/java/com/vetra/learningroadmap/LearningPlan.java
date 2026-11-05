package com.vetra.learningroadmap;

import com.vetra.identity.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "learning_plans")
public class LearningPlan {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String targetRole;

    private int totalHours = 0;
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<LearningTask> tasks = new ArrayList<>();

    public LearningPlan() {
        this.id = UUID.randomUUID().toString();
    }

    public LearningPlan(User user, String targetRole, int totalHours) {
        this();
        this.user = user;
        this.targetRole = targetRole;
        this.totalHours = totalHours;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    public int getTotalHours() { return totalHours; }
    public void setTotalHours(int totalHours) { this.totalHours = totalHours; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public List<LearningTask> getTasks() { return tasks; }
    public void setTasks(List<LearningTask> tasks) { this.tasks = tasks; }
}
