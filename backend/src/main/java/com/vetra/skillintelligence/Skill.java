package com.vetra.skillintelligence;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillCategory category;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int demandLevel = 50;
    private Instant createdAt = Instant.now();

    public Skill() {
        this.id = UUID.randomUUID().toString();
    }

    public Skill(String id, String name, SkillCategory category, String description, int demandLevel) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.demandLevel = demandLevel;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public SkillCategory getCategory() { return category; }
    public void setCategory(SkillCategory category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getDemandLevel() { return demandLevel; }
    public void setDemandLevel(int demandLevel) { this.demandLevel = demandLevel; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
