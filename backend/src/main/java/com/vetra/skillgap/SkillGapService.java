package com.vetra.skillgap;

import com.vetra.evidence.EvidenceItem;
import com.vetra.evidence.EvidenceRepository;
import com.vetra.identity.User;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SkillGapService {

    private final EvidenceRepository evidenceRepository;

    public SkillGapService() {
        this.evidenceRepository = null;
    }

    public SkillGapService(EvidenceRepository evidenceRepository) {
        this.evidenceRepository = evidenceRepository;
    }

        private static final Map<String, List<RoleRequirement>> ROLE_TAXONOMY = Map.ofEntries(
        Map.entry("Java Backend Developer", List.of(
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
        )),
        Map.entry("Frontend Developer", List.of(
            new RoleRequirement("JavaScript", "CRITICAL", List.of(), "Core browser programming language, ES6+, event handling, DOM."),
            new RoleRequirement("TypeScript", "CRITICAL", List.of("JavaScript"), "Type safety, interfaces, and maintainable large-scale frontend architecture."),
            new RoleRequirement("React", "CRITICAL", List.of("JavaScript"), "Standard UI library for stateful component hierarchies and hooks."),
            new RoleRequirement("HTML5 & CSS3", "CRITICAL", List.of(), "Semantic document structure, accessibility, and modern responsive layouts."),
            new RoleRequirement("Tailwind CSS", "IMPORTANT", List.of("HTML5 & CSS3"), "Utility-first responsive design framework."),
            new RoleRequirement("REST APIs", "IMPORTANT", List.of(), "Consuming asynchronous backend endpoints and handling loading states."),
            new RoleRequirement("Next.js", "IMPORTANT", List.of("React"), "Server-side rendering, routing, and SEO optimization."),
            new RoleRequirement("Git", "IMPORTANT", List.of(), "Version control for team collaboration.")
        )),
        Map.entry("Full Stack Developer", List.of(
            new RoleRequirement("JavaScript", "CRITICAL", List.of(), "Full-stack language bridging frontend and Node.js backend."),
            new RoleRequirement("TypeScript", "CRITICAL", List.of("JavaScript"), "End-to-end type safety across client and server boundaries."),
            new RoleRequirement("React", "CRITICAL", List.of("JavaScript"), "Interactive frontend client interface development."),
            new RoleRequirement("Node.js", "CRITICAL", List.of("JavaScript"), "Scalable asynchronous backend services and APIs."),
            new RoleRequirement("SQL", "CRITICAL", List.of(), "Relational database querying and schema modeling."),
            new RoleRequirement("PostgreSQL", "IMPORTANT", List.of("SQL"), "Structured persistent storage."),
            new RoleRequirement("REST APIs", "IMPORTANT", List.of(), "Clean HTTP API design, validation, and status codes."),
            new RoleRequirement("Docker", "IMPORTANT", List.of(), "Containerized local and production runtime environments."),
            new RoleRequirement("Git", "IMPORTANT", List.of(), "Version control and branching.")
        )),
        Map.entry("Cloud & DevOps Engineer", List.of(
            new RoleRequirement("Linux", "CRITICAL", List.of(), "Operating system fundamentals, bash scripting, permissions, process management."),
            new RoleRequirement("Docker", "CRITICAL", List.of("Linux"), "Containerization, image optimization, multi-stage builds."),
            new RoleRequirement("Kubernetes", "CRITICAL", List.of("Docker"), "Container orchestration, ingress, deployments, pod lifecycle."),
            new RoleRequirement("AWS", "CRITICAL", List.of(), "Primary cloud provider: VPC, IAM, EC2, S3, RDS, ECS."),
            new RoleRequirement("CI/CD Pipelines", "CRITICAL", List.of("Git"), "Automated build, test, and deployment workflows (GitHub Actions)."),
            new RoleRequirement("Git", "IMPORTANT", List.of(), "Infrastructure as Code versioning."),
            new RoleRequirement("Terraform", "IMPORTANT", List.of("AWS"), "Declarative cloud infrastructure provisioning."),
            new RoleRequirement("Python", "BENEFICIAL", List.of(), "Automation scripts and cloud infrastructure tooling.")
        )),
        Map.entry("Data & AI/ML Engineer", List.of(
            new RoleRequirement("Python", "CRITICAL", List.of(), "Core language for scientific computing, modeling, and data pipelines."),
            new RoleRequirement("SQL", "CRITICAL", List.of(), "Relational data extraction, window functions, and analytics."),
            new RoleRequirement("Pandas & NumPy", "CRITICAL", List.of("Python"), "Data manipulation, cleansing, matrix operations, and feature engineering."),
            new RoleRequirement("FastAPI", "CRITICAL", List.of("Python"), "Serving ML inference endpoints and data APIs at high concurrency."),
            new RoleRequirement("Git", "IMPORTANT", List.of(), "Collaborative model tracking and code versioning."),
            new RoleRequirement("PyTorch", "IMPORTANT", List.of("Python"), "Deep learning neural network modeling and fine-tuning."),
            new RoleRequirement("Docker", "IMPORTANT", List.of(), "Containerizing data processing jobs and model endpoints."),
            new RoleRequirement("LLMs & Prompt Engineering", "IMPORTANT", List.of("Python"), "Generative AI, retrieval-augmented generation (RAG), and embeddings.")
        )),
        Map.entry("Mobile Application Developer", List.of(
            new RoleRequirement("Kotlin", "CRITICAL", List.of(), "Modern native mobile development language."),
            new RoleRequirement("Android SDK", "CRITICAL", List.of("Kotlin"), "Activities, fragments, Jetpack Compose, viewmodels, and coroutines."),
            new RoleRequirement("REST APIs", "CRITICAL", List.of(), "Network requests, JSON serialization, and offline caching."),
            new RoleRequirement("Git", "IMPORTANT", List.of(), "Version control for mobile codebases."),
            new RoleRequirement("Flutter", "BENEFICIAL", List.of(), "Cross-platform iOS and Android app development.")
        )),
        Map.entry("Software Engineer", List.of(
            new RoleRequirement("Java", "CRITICAL", List.of(), "Primary language for algorithmic implementation and systems."),
            new RoleRequirement("OOP", "CRITICAL", List.of("Java"), "Solid object-oriented design patterns and clean code principles."),
            new RoleRequirement("Data Structures", "CRITICAL", List.of("Java"), "Time and space complexity optimization for engineering problems."),
            new RoleRequirement("SQL", "IMPORTANT", List.of(), "Database querying and relational schema comprehension."),
            new RoleRequirement("Git", "IMPORTANT", List.of(), "Version control fundamentals."),
            new RoleRequirement("Testing", "IMPORTANT", List.of("Java"), "Automated test suites for code verification."),
            new RoleRequirement("Docker", "BENEFICIAL", List.of(), "Reproducible local dev setups.")
        )),
        Map.entry("Spring Boot Developer", List.of(
            new RoleRequirement("Spring Boot", "CRITICAL", List.of("Java"), "Core framework expertise, auto-configuration, and starters."),
            new RoleRequirement("Java", "CRITICAL", List.of(), "Modern Java features (Streams, Records, Concurrency)."),
            new RoleRequirement("REST APIs", "CRITICAL", List.of("Spring Boot"), "RESTful service endpoints, validation, and error contracts."),
            new RoleRequirement("PostgreSQL", "IMPORTANT", List.of(), "Spring Data JPA repository mappings and persistence."),
            new RoleRequirement("Spring Security", "IMPORTANT", List.of("Spring Boot"), "Authentication filters and authorization guards."),
            new RoleRequirement("Docker", "IMPORTANT", List.of(), "Containerized Spring Boot deployments.")
        ))
    );

    private record RoleRequirement(String name, String importance, List<String> prerequisites, String reason) {}

    public SkillGapDtos.SkillGapAnalysisResponse analyzeGap(SkillGapDtos.AnalyzeGapRequest req, User user) {
        String role = (req.targetRole() != null && !req.targetRole().isBlank())
            ? req.targetRole()
            : (user != null && user.getTargetRole() != null ? user.getTargetRole() : "Java Backend Developer");

        List<RoleRequirement> requirements = getOrSynthesizeRequirements(role);

        // Build dynamic user evidence set from database and request skills
        Set<String> verifiedSkills = new HashSet<>();
        Set<String> partialSkills = new HashSet<>();
        Map<String, Integer> evidenceCountMap = new HashMap<>();

        if (user != null && evidenceRepository != null) {
            List<EvidenceItem> userEvidence = evidenceRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
            for (EvidenceItem item : userEvidence) {
                if (item.getLinkedSkills() != null) {
                    for (String s : item.getLinkedSkills()) {
                        evidenceCountMap.put(s.toLowerCase(), evidenceCountMap.getOrDefault(s.toLowerCase(), 0) + 1);
                        if (item.isVerified()) {
                            verifiedSkills.add(s.toLowerCase());
                        } else {
                            partialSkills.add(s.toLowerCase());
                        }
                    }
                }
            }
        }

        // Incorporate currentSkills explicitly passed in the request (e.g. from parsed resume)
        if (req.currentSkills() != null && !req.currentSkills().isEmpty()) {
            for (String s : req.currentSkills()) {
                String lower = s.toLowerCase();
                evidenceCountMap.put(lower, evidenceCountMap.getOrDefault(lower, 0) + 1);
                verifiedSkills.add(lower);
            }
        }

        // Default baseline only if completely empty
        if (verifiedSkills.isEmpty() && partialSkills.isEmpty()) {
            verifiedSkills.addAll(Set.of("java", "oop", "sql", "git"));
            partialSkills.addAll(Set.of("rest apis"));
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
            String reqLower = reqItem.name.toLowerCase();
            boolean isVerified = verifiedSkills.contains(reqLower) || verifiedSkills.stream().anyMatch(v -> v.contains(reqLower) || reqLower.contains(v));
            boolean isPartial = !isVerified && (partialSkills.contains(reqLower) || partialSkills.stream().anyMatch(p -> p.contains(reqLower) || reqLower.contains(p)));
            int count = evidenceCountMap.getOrDefault(reqLower, isVerified ? 2 : isPartial ? 1 : 0);

            if (isVerified) {
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
            } else if (isPartial) {
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

    private List<RoleRequirement> getOrSynthesizeRequirements(String role) {
        if (role == null || role.isBlank()) {
            return ROLE_TAXONOMY.get("Java Backend Developer");
        }
        String cleanRole = role.trim();
        for (Map.Entry<String, List<RoleRequirement>> entry : ROLE_TAXONOMY.entrySet()) {
            if (entry.getKey().equalsIgnoreCase(cleanRole)) {
                return entry.getValue();
            }
        }
        return synthesizeCustomRoleRequirements(cleanRole);
    }

    private List<RoleRequirement> synthesizeCustomRoleRequirements(String role) {
        String lower = role.toLowerCase();
        List<RoleRequirement> list = new ArrayList<>();

        if (lower.contains("data") || lower.contains("etl") || lower.contains("big data") || lower.contains("analytics")) {
            list.add(new RoleRequirement("Python", "CRITICAL", List.of(), "Core language for data pipelines, scripting, and transformation."));
            list.add(new RoleRequirement("SQL", "CRITICAL", List.of(), "Advanced data extraction, indexing, and relational data warehousing."));
            list.add(new RoleRequirement("Apache Spark / PySpark", "CRITICAL", List.of("Python", "SQL"), "Distributed cluster data processing."));
            list.add(new RoleRequirement("Apache Kafka", "CRITICAL", List.of(), "Real-time distributed event streaming and message queuing."));
            list.add(new RoleRequirement("Airflow", "IMPORTANT", List.of("Python"), "Workflow orchestration and scheduled DAG automation."));
            list.add(new RoleRequirement("Snowflake / BigQuery", "IMPORTANT", List.of("SQL"), "Cloud analytical data warehouse storage."));
            list.add(new RoleRequirement("Docker", "IMPORTANT", List.of(), "Containerized pipeline execution."));
            list.add(new RoleRequirement("Git", "IMPORTANT", List.of(), "Version control for data transformation scripts."));
            return list;
        }

        if (lower.contains("go") || lower.contains("golang")) {
            list.add(new RoleRequirement("Go (Golang)", "CRITICAL", List.of(), "Idiomatic Go syntax, standard library, and tooling."));
            list.add(new RoleRequirement("Concurrency (Goroutines)", "CRITICAL", List.of("Go (Golang)"), "High-concurrency lightweight thread scheduling."));
            list.add(new RoleRequirement("REST & gRPC APIs", "CRITICAL", List.of("Go (Golang)"), "High-performance inter-microservice communication."));
            list.add(new RoleRequirement("SQL & PostgreSQL", "CRITICAL", List.of(), "Relational data persistence and connection pooling."));
            list.add(new RoleRequirement("Docker", "IMPORTANT", List.of(), "Containerization for Go binaries."));
            list.add(new RoleRequirement("Kubernetes", "IMPORTANT", List.of("Docker"), "Cloud-native container orchestration."));
            list.add(new RoleRequirement("Git", "IMPORTANT", List.of(), "Distributed version tracking."));
            return list;
        }

        if (lower.contains("security") || lower.contains("cyber")) {
            list.add(new RoleRequirement("Linux Systems", "CRITICAL", List.of(), "Operating system internals, permissions, and bash shell."));
            list.add(new RoleRequirement("Python Scripting", "CRITICAL", List.of(), "Automated vulnerability scanning and security tooling."));
            list.add(new RoleRequirement("Networking & TCP/IP", "CRITICAL", List.of(), "Firewalls, packet inspection, and secure transport."));
            list.add(new RoleRequirement("OWASP Top 10", "CRITICAL", List.of(), "Web application vulnerability remediation and defense."));
            list.add(new RoleRequirement("Cryptography & PKI", "IMPORTANT", List.of(), "Encryption, TLS certs, hashing, and signature validation."));
            list.add(new RoleRequirement("Cloud Security (AWS)", "IMPORTANT", List.of("Linux Systems"), "IAM policies, VPC isolation, and audit compliance."));
            list.add(new RoleRequirement("Git", "IMPORTANT", List.of(), "Secure code review and commit hygiene."));
            return list;
        }

        if (lower.contains("qa") || lower.contains("test") || lower.contains("automation")) {
            list.add(new RoleRequirement("Test Automation (Playwright/Selenium)", "CRITICAL", List.of(), "End-to-end automated UI and regression testing."));
            list.add(new RoleRequirement("Java / Python / TypeScript", "CRITICAL", List.of(), "Programming language for test script engineering."));
            list.add(new RoleRequirement("REST API Testing", "CRITICAL", List.of(), "Validating backend contracts, status codes, and payloads."));
            list.add(new RoleRequirement("CI/CD Integration", "IMPORTANT", List.of(), "Running automated test suites on pull requests."));
            list.add(new RoleRequirement("Git", "IMPORTANT", List.of(), "Version control for test repositories."));
            list.add(new RoleRequirement("Docker", "BENEFICIAL", List.of(), "Containerized headless test execution."));
            return list;
        }

        // Novel custom role dynamic synthesis
        list.add(new RoleRequirement(role + " Core Competencies", "CRITICAL", List.of(), "Fundamental domain knowledge and core syntax for " + role + "."));
        list.add(new RoleRequirement("System Architecture & Design", "CRITICAL", List.of(), "Architectural patterns and structural decomposition for " + role + "."));
        list.add(new RoleRequirement("Data Modeling & Relational Storage", "CRITICAL", List.of(), "Database querying, data integrity, and storage design."));
        list.add(new RoleRequirement("API & Inter-Service Communication", "IMPORTANT", List.of(), "Stateless API contracts and service protocols."));
        list.add(new RoleRequirement("Automated Unit & Integration Testing", "IMPORTANT", List.of(), "Test suites ensuring regression safety."));
        list.add(new RoleRequirement("Git & Version Control", "IMPORTANT", List.of(), "Branch workflows and commit hygiene."));
        list.add(new RoleRequirement("Containerization & Cloud Infrastructure", "IMPORTANT", List.of(), "Deployment environments and scalable runtime."));
        return list;
    }
}
