package com.vetra.jobintelligence;

import com.vetra.common.AppException;
import com.vetra.identity.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.regex.Pattern;

@Service
public class JobService {

    private final JobRepository jobRepository;

        private static final Map<String, List<String>> TAXONOMY_SKILLS = Map.ofEntries(
        Map.entry("Java", List.of("java", "jvm", "jdk", "core java")),
        Map.entry("Spring Boot", List.of("spring boot", "springboot", "spring-boot", "spring framework")),
        Map.entry("REST APIs", List.of("rest", "restful", "rest api", "rest apis", "web services")),
        Map.entry("SQL", List.of("sql", "relational database", "rdbms")),
        Map.entry("PostgreSQL", List.of("postgres", "postgresql")),
        Map.entry("Docker", List.of("docker", "containers", "containerization")),
        Map.entry("Git", List.of("git", "github", "gitlab", "version control")),
        Map.entry("OOP", List.of("oop", "object oriented", "object-oriented")),
        Map.entry("Redis", List.of("redis", "caching", "in-memory")),
        Map.entry("Kafka", List.of("kafka", "message broker", "event streaming")),
        Map.entry("Testing", List.of("junit", "mockito", "unit test", "unit testing", "integration testing")),
        Map.entry("Microservices", List.of("microservices", "microservice architecture", "distributed systems")),
        Map.entry("React", List.of("react", "react.js", "reactjs", "react native")),
        Map.entry("TypeScript", List.of("typescript", "ts")),
        Map.entry("JavaScript", List.of("javascript", "js", "es6")),
        Map.entry("Tailwind CSS", List.of("tailwind", "tailwindcss")),
        Map.entry("Next.js", List.of("next.js", "nextjs")),
        Map.entry("Node.js", List.of("node", "nodejs", "node.js")),
        Map.entry("Express.js", List.of("express", "expressjs", "express.js")),
        Map.entry("MongoDB", List.of("mongodb", "mongo", "nosql")),
        Map.entry("Python", List.of("python", "python3")),
        Map.entry("FastAPI", List.of("fastapi", "flask")),
        Map.entry("Pandas & NumPy", List.of("pandas", "numpy", "data analysis")),
        Map.entry("PyTorch", List.of("pytorch", "torch", "tensorflow")),
        Map.entry("Kubernetes", List.of("kubernetes", "k8s")),
        Map.entry("AWS", List.of("aws", "amazon web services", "ec2", "s3")),
        Map.entry("Linux", List.of("linux", "unix", "bash", "shell")),
        Map.entry("CI/CD Pipelines", List.of("ci/cd", "github actions", "jenkins", "gitlab")),
        Map.entry("Kotlin", List.of("kotlin")),
        Map.entry("Android SDK", List.of("android", "android sdk", "jetpack compose")),
        Map.entry("Flutter", List.of("flutter", "dart"))
    );

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @Transactional(readOnly = true)
    public List<JobDtos.JobResponse> getAllJobs(String search) {
        List<Job> jobs;
        if (search != null && !search.isBlank()) {
            jobs = jobRepository.findByTitleContainingIgnoreCaseOrCompanyContainingIgnoreCase(search, search);
        } else {
            jobs = jobRepository.findAll();
        }

        if (jobs.isEmpty()) {
            // Seed initial entry-level opportunities if database is fresh
            seedInitialJobs();
            jobs = jobRepository.findAll();
        }

        return jobs.stream().map(JobDtos.JobResponse::from).toList();
    }

    @Transactional
    public JobDtos.JobResponse importJob(JobDtos.ImportJobRequest req) {
        Job job = new Job();
        job.setTitle(req.title().trim());
        job.setCompany(req.company().trim());
        job.setDescription(req.description().trim());
        job.setLocation(req.location() != null ? req.location() : "Remote / Hybrid");
        job.setEmploymentType(req.employmentType() != null ? req.employmentType() : "Full-Time");
        job.setExperienceLevel(req.experienceLevel() != null ? req.experienceLevel() : "Entry-Level");
        job.setSource(JobSource.USER_SUBMITTED);
        job.setSourceUrl(req.sourceUrl());

        // Extract skills automatically from text description
        List<String> extracted = extractSkills(req.description());
        int splitIndex = (int) Math.ceil(extracted.size() * 0.6);
        job.setRequiredSkills(extracted.subList(0, Math.min(splitIndex, extracted.size())));
        job.setPreferredSkills(extracted.subList(Math.min(splitIndex, extracted.size()), extracted.size()));

        job = jobRepository.save(job);
        return JobDtos.JobResponse.from(job);
    }

    public List<String> extractSkills(String text) {
        if (text == null || text.isBlank()) return Collections.emptyList();
        String lower = text.toLowerCase();
        List<String> found = new ArrayList<>();

        for (Map.Entry<String, List<String>> entry : TAXONOMY_SKILLS.entrySet()) {
            for (String alias : entry.getValue()) {
                Pattern pattern = Pattern.compile("\\b" + Pattern.quote(alias) + "\\b", Pattern.CASE_INSENSITIVE);
                if (pattern.matcher(lower).find()) {
                    found.add(entry.getKey());
                    break;
                }
            }
        }
        return found;
    }

    @Transactional(readOnly = true)
    public JobDtos.JobAnalysisResult analyzeJob(String jobId, User user) {
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new AppException("Job not found", HttpStatus.NOT_FOUND));

        // Baseline demonstrated skills for student/entry-level profile
        Set<String> userSkills = Set.of("Java", "OOP", "SQL", "Git", "REST APIs", "PostgreSQL");

        List<String> matched = new ArrayList<>();
        List<String> missingRequired = new ArrayList<>();
        List<String> missingPreferred = new ArrayList<>();

        for (String reqSkill : job.getRequiredSkills()) {
            if (userSkills.contains(reqSkill)) {
                matched.add(reqSkill);
            } else {
                missingRequired.add(reqSkill);
            }
        }

        for (String prefSkill : job.getPreferredSkills()) {
            if (!userSkills.contains(prefSkill)) {
                missingPreferred.add(prefSkill);
            }
        }

        int totalRequired = Math.max(1, job.getRequiredSkills().size());
        int score = (int) Math.round(((double) matched.size() / totalRequired) * 100);

        String advice = missingRequired.isEmpty()
            ? "Strong match! You demonstrate all required technical skills for this role."
            : "Focus on closing critical gaps in " + String.join(", ", missingRequired) + " through project evidence.";

        return new JobDtos.JobAnalysisResult(
            job.getId(),
            job.getTitle(),
            job.getCompany(),
            score,
            matched,
            missingRequired,
            missingPreferred,
            advice
        );
    }

    private void seedInitialJobs() {
        Job job1 = new Job();
        job1.setTitle("Backend Java Developer");
        job1.setCompany("TechNova Solutions");
        job1.setLocation("Bengaluru, India");
        job1.setExperienceLevel("Entry-Level");
        job1.setEmploymentType("Full-Time");
        job1.setSource(JobSource.COMPANY_CAREER_PAGE);
        job1.setSourceUrl("https://example.com/technova/backend-java");
        job1.setDescription("Looking for an entry-level Java backend developer to build RESTful microservices with Spring Boot and PostgreSQL.");
        job1.setRequiredSkills(List.of("Java", "Spring Boot", "REST APIs", "SQL", "Git"));
        job1.setPreferredSkills(List.of("Docker", "PostgreSQL", "Redis"));

        Job job2 = new Job();
        job2.setTitle("Junior Software Engineer (Java)");
        job2.setCompany("CloudPeak Systems");
        job2.setLocation("Remote (India)");
        job2.setExperienceLevel("Entry-Level");
        job2.setEmploymentType("Full-Time");
        job2.setSource(JobSource.AGGREGATOR_API);
        job2.setDescription("Strong fundamentals in Java, data structures, and object-oriented programming required for distributed backend services.");
        job2.setRequiredSkills(List.of("Java", "OOP", "SQL", "Git"));
        job2.setPreferredSkills(List.of("Spring Boot", "Docker", "Testing"));

        jobRepository.saveAll(List.of(job1, job2));
    }
}
