package com.vetra.assessment;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "assessments")
public class Assessment {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String skillArea;

    private int durationMinutes = 30;
    private String difficulty = "BEGINNER";
    private int passingScore = 70;

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<AssessmentQuestion> questions = new ArrayList<>();

    public Assessment() {
        this.id = UUID.randomUUID().toString();
    }

    public Assessment(String id, String title, String description, String skillArea, int durationMinutes, String difficulty) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.skillArea = skillArea;
        this.durationMinutes = durationMinutes;
        this.difficulty = difficulty;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSkillArea() { return skillArea; }
    public void setSkillArea(String skillArea) { this.skillArea = skillArea; }
    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public int getPassingScore() { return passingScore; }
    public void setPassingScore(int passingScore) { this.passingScore = passingScore; }
    public List<AssessmentQuestion> getQuestions() { return questions; }
    public void setQuestions(List<AssessmentQuestion> questions) { this.questions = questions; }
}
