package com.vetra.learningroadmap;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "learning_tasks")
public class LearningTask {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private LearningPlan plan;

    private int phaseNumber;
    private String phaseTitle;
    private String title;
    private String priority = "MEDIUM";
    private int estimatedHours = 5;
    private boolean completed = false;
    private String resourceUrl;

    public LearningTask() {
        this.id = UUID.randomUUID().toString();
    }

    public LearningTask(LearningPlan plan, int phaseNumber, String phaseTitle, String title, String priority, int estimatedHours, String resourceUrl) {
        this();
        this.plan = plan;
        this.phaseNumber = phaseNumber;
        this.phaseTitle = phaseTitle;
        this.title = title;
        this.priority = priority;
        this.estimatedHours = estimatedHours;
        this.resourceUrl = resourceUrl;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public LearningPlan getPlan() { return plan; }
    public void setPlan(LearningPlan plan) { this.plan = plan; }
    public int getPhaseNumber() { return phaseNumber; }
    public void setPhaseNumber(int phaseNumber) { this.phaseNumber = phaseNumber; }
    public String getPhaseTitle() { return phaseTitle; }
    public void setPhaseTitle(String phaseTitle) { this.phaseTitle = phaseTitle; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public int getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(int estimatedHours) { this.estimatedHours = estimatedHours; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public String getResourceUrl() { return resourceUrl; }
    public void setResourceUrl(String resourceUrl) { this.resourceUrl = resourceUrl; }
}
