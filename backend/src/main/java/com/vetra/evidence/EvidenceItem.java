package com.vetra.evidence;

import com.vetra.identity.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "evidence_items")
public class EvidenceItem {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String type; // PROJECT, CERTIFICATION, ASSESSMENT, GITHUB_REPO, WORK_EXPERIENCE

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String url;
    private boolean verified = false;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "evidence_linked_skills", joinColumns = @JoinColumn(name = "evidence_id"))
    @Column(name = "skill_name")
    private List<String> linkedSkills = new ArrayList<>();

    private Instant createdAt = Instant.now();

    public EvidenceItem() {
        this.id = UUID.randomUUID().toString();
    }

    public EvidenceItem(User user, String type, String title, String description, String url, List<String> linkedSkills, boolean verified) {
        this();
        this.user = user;
        this.type = type;
        this.title = title;
        this.description = description;
        this.url = url;
        this.linkedSkills = linkedSkills;
        this.verified = verified;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public List<String> getLinkedSkills() { return linkedSkills; }
    public void setLinkedSkills(List<String> linkedSkills) { this.linkedSkills = linkedSkills; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
