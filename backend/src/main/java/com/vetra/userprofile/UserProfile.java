package com.vetra.userprofile;

import com.vetra.identity.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @Column(length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String education;
    private String graduationYear;
    
    @Column(columnDefinition = "TEXT")
    private String careerObjectives;

    private String githubUsername;
    private String linkedinUrl;
    private String portfolioUrl;
    private int readinessScore = 0;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public UserProfile() {
        this.id = UUID.randomUUID().toString();
    }

    public UserProfile(User user) {
        this();
        this.user = user;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }
    public String getGraduationYear() { return graduationYear; }
    public void setGraduationYear(String graduationYear) { this.graduationYear = graduationYear; }
    public String getCareerObjectives() { return careerObjectives; }
    public void setCareerObjectives(String careerObjectives) { this.careerObjectives = careerObjectives; }
    public String getGithubUsername() { return githubUsername; }
    public void setGithubUsername(String githubUsername) { this.githubUsername = githubUsername; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }
    public int getReadinessScore() { return readinessScore; }
    public void setReadinessScore(int readinessScore) { this.readinessScore = readinessScore; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
