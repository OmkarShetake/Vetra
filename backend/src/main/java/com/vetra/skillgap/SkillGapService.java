package com.vetra.skillgap;

import com.vetra.evidence.EvidenceItem;
import com.vetra.evidence.EvidenceRepository;
import com.vetra.identity.User;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SkillGapService {

    private final EvidenceRepository evidenceRepository;

    public SkillGapService(EvidenceRepository evidenceRepository) {
        this.evidenceRepository = evidenceRepository;
    }

    private static final Map<String, List<RoleRequirement>> ROLE_TAXONOMY = Map.of(
        "Java Backend Developer", List.of(
            new RoleRequirement("Java", "CRITICAL", List.of(), "Core programming foundation required for backend systems."),
            new RoleRequirement("OOP", "CRITICAL", List.of("Java"), "Essential for domain modeling, modularity, and clean architecture."),
            new RoleRequirement("SQL", "CRITICAL", List.of(), "Required for writing performant queries, transactions, and data modeling."),
            new RoleRequirement("Spring Boot", "CRITICAL", List.of("Java", "OOP"), "Dominant enterprise Java framework for building microservices."),
            new RoleRequirement("REST APIs", "IMPORTANT", List.of("Spring Boot"), "Standard architecture for inter-service communication and frontend integration."),
            new RoleRequirement("PostgreSQL", "IMPORTANT", List.of("SQL"), "Industry-standard relational database for structured storage."),
            new RoleRequirement("Git", "IMPORTANT", List.of(), "Necessary for collaborative team workflows and version tracking."),
            new RoleRequirement("Docker", "IMPORTANT", List.of(), "Containerization ensures consistent deployment environments."),
            new RoleRequirement("Testing", "IMPORTANT", List.of("Java"), "Unit and integration tests with JUnit and Mockito maintain high reliability."),
            new RoleRequirement("Spring Security", "IMPORTANT", List.of("Spring Boot"), "Secures endpoints with JWT tokens and role-based permissions."),
            new RoleRequirement("Redis", "BENEFICIAL", List.of(), "In-memory caching improves backend read performance."),
            new RoleRequirement("Kafka", "BENEFICIAL", List.of(), "Event streaming decouples asynchronous backend workloads.")
        ),
        "Software Engineer", List.of(
            new RoleRequirement("Java", "CRITICAL", List.of(), "Primary language for algorithmic implementation and systems."),
            new RoleRequirement("OOP", "CRITICAL", List.of("Java"), "Solid object-oriented design patterns and clean code principles."),
            new RoleRequirement("Data Structures", "CRITICAL", List.of("Java"), "Time and space complexity optimization for engineering problems."),
            new RoleRequirement("SQL", "IMPORTANT", List.of(), "Database querying and relational schema comprehension."),
            new RoleRequirement("Git", "IMPORTANT", List.of(), "Version control fundamentals."),
            new RoleRequirement("Testing", "IMPORTANT", List.of(), "Automated test suites for code verification."),
            new RoleRequirement("Docker", "BENEFICIAL", List.of(), "Reproducible local dev setups.")
        ),
        "Spring Boot Developer", List.of(
            new RoleRequirement("Spring Boot", "CRITICAL", List.of("Java"), "Core framework expertise, auto-configuration, and starters."),
            new RoleRequirement("Java", "CRITICAL", List.of(), "Modern Java features (Streams, Records, Concurrency)."),
            new RoleRequirement("REST APIs", "CRITICAL", List.of("Spring Boot"), "RESTful service endpoints, validation, and error contracts."),
            new RoleRequirement("PostgreSQL", "IMPORTANT", List.of(), "Spring Data JPA repository mappings and persistence."),
            new RoleRequirement("Spring Security", "IMPORTANT", List.of("Spring Boot"), "Authentication filters and authorization guards."),
            new RoleRequirement("Docker", "IMPORTANT", List.of(), "Containerized Spring Boot deployments.")
        )
    );

    private record RoleRequirement(String name, String importance, List<String> prerequisites, String reason) {}

    public SkillGapDtos.SkillGapAnalysisResponse analyzeGap(SkillGapDtos.AnalyzeGapRequest req, User user) {
        String role = (req.targetRole() != null && !req.targetRole().isBlank())
            ? req.targetRole()
            : (user != null && user.getTargetRole() != null ? user.getTargetRole() : "Java Backend Developer");

        List<RoleRequirement> requirements = ROLE_TAXONOMY.getOrDefault(role, ROLE_TAXONOMY.get("Java Backend Developer"));

        // Build dynamic user evidence set from database
        Set<String> verifiedSkills = new HashSet<>();
        Set<String> partialSkills = new HashSet<>();
        Map<String, Integer> evidenceCountMap = new HashMap<>();

        if (user != null) {
            List<EvidenceItem> userEvidence = evidenceRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
            for (EvidenceItem item : userEvidence) {
                if (item.getLinkedSkills() != null) {
                    for (String s : item.getLinkedSkills()) {
                        evidenceCountMap.put(s, evidenceCountMap.getOrDefault(s, 0) + 1);
                        if (item.isVerified()) {
                            verifiedSkills.add(s);
                        } else {
                            partialSkills.add(s);
                        }
                    }
                }
            }
        }

        // Default baseline if user has no items yet
        if (verifiedSkills.isEmpty() && partialSkills.isEmpty()) {
            verifiedSkills.addAll(Set.of("Java", "OOP", "SQL", "Git"));
            partialSkills.addAll(Set.of("REST APIs"));
        }

        List<SkillGapDtos.SkillGapItem> items = new ArrayList<>();
        int demonstrated = 0;
        int partial = 0;
        int notDemonstrated = 0;
        int scoreWeightedSum = 0;
        int totalWeight = 0;

        for (RoleRequirement reqItem : requirements) {
            int weight = reqItem.importance.equals("CRITICAL") ? 3 : reqItem.importance.equals("IMPORTANT") ? 2 : 1;
            totalWeight += weight;
            int count = evidenceCountMap.getOrDefault(reqItem.name, verifiedSkills.contains(reqItem.name) ? 2 : partialSkills.contains(reqItem.name) ? 1 : 0);

            if (verifiedSkills.contains(reqItem.name)) {
                demonstrated++;
                scoreWeightedSum += weight * 100;
                items.add(new SkillGapDtos.SkillGapItem(
                    reqItem.name,
                    "DEMONSTRATED",
                    reqItem.importance,
                    count,
                    "Verified project or repository evidence in portfolio",
                    reqItem.reason,
                    reqItem.prerequisites
                ));
            } else if (partialSkills.contains(reqItem.name)) {
                partial++;
                scoreWeightedSum += (int) (weight * 50);
                items.add(new SkillGapDtos.SkillGapItem(
                    reqItem.name,
                    "PARTIALLY_DEMONSTRATED",
                    reqItem.importance,
                    count,
                    "Unverified project or coursework claim",
                    reqItem.name + " is partially demonstrated. Build a production project or pass an assessment to verify proficiency.",
                    reqItem.prerequisites
                ));
            } else {
                notDemonstrated++;
                items.add(new SkillGapDtos.SkillGapItem(
                    reqItem.name,
                    "NOT_DEMONSTRATED",
                    reqItem.importance,
                    0,
                    "No verifiable evidence found in your profile",
                    reqItem.name + " is required for " + role + " (" + reqItem.reason + "). We recommend following the learning roadmap phase.",
                    reqItem.prerequisites
                ));
            }
        }

        int overallScore = totalWeight > 0 ? Math.round((float) scoreWeightedSum / totalWeight) : 0;

        String summary = String.format(
            "For %s, you demonstrate %d out of %d required capabilities (%d%% readiness score). Focus on completing evidence for %s to reach top-tier readiness.",
            role, demonstrated, requirements.size(), overallScore,
            notDemonstrated > 0 ? items.stream().filter(i -> i.status().equals("NOT_DEMONSTRATED") && i.importance().equals("CRITICAL")).findFirst().map(SkillGapDtos.SkillGapItem::skillName).orElse("critical gaps") : "advanced concepts"
        );

        return new SkillGapDtos.SkillGapAnalysisResponse(
            role,
            overallScore,
            demonstrated,
            partial,
            notDemonstrated,
            items,
            summary
        );
    }
}
