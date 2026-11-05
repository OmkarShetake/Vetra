package com.vetra.skillintelligence;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "skill_relationships")
public class SkillRelationship {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "source_skill_id", nullable = false)
    private Skill sourceSkill;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "target_skill_id", nullable = false)
    private Skill targetSkill;

    @Column(nullable = false)
    private String relationshipType; // PREREQUISITE, RELATED, REQUIRES

    public SkillRelationship() {
        this.id = UUID.randomUUID().toString();
    }

    public SkillRelationship(String id, Skill sourceSkill, Skill targetSkill, String relationshipType) {
        this.id = id;
        this.sourceSkill = sourceSkill;
        this.targetSkill = targetSkill;
        this.relationshipType = relationshipType;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Skill getSourceSkill() { return sourceSkill; }
    public void setSourceSkill(Skill sourceSkill) { this.sourceSkill = sourceSkill; }
    public Skill getTargetSkill() { return targetSkill; }
    public void setTargetSkill(Skill targetSkill) { this.targetSkill = targetSkill; }
    public String getRelationshipType() { return relationshipType; }
    public void setRelationshipType(String relationshipType) { this.relationshipType = relationshipType; }
}
