package com.vetra.jobintelligence;

import com.vetra.common.AppException;
import com.vetra.identity.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

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
        return getAllJobs(search, null);
    }

    @Transactional(readOnly = true)
    public List<JobDtos.JobResponse> getAllJobs(String search, String companyType) {
        List<Job> jobs = jobRepository.findAll();
        if (jobs.isEmpty()) {
            seedInitialJobs();
            jobs = jobRepository.findAll();
        }

        return jobs.stream()
            .filter(j -> {
                if (search != null && !search.isBlank()) {
                    String q = search.toLowerCase();
                    boolean matchTitle = j.getTitle() != null && j.getTitle().toLowerCase().contains(q);
                    boolean matchCompany = j.getCompany() != null && j.getCompany().toLowerCase().contains(q);
                    boolean matchSkills = j.getRequiredSkills() != null && j.getRequiredSkills().stream().anyMatch(s -> s.toLowerCase().contains(q));
                    if (!matchTitle && !matchCompany && !matchSkills) return false;
                }
                if (companyType != null && !companyType.isBlank() && !companyType.equalsIgnoreCase("ALL")) {
                    if (j.getCompanyType() != null && !j.getCompanyType().equalsIgnoreCase(companyType)) {
                        return false;
                    }
                }
                return true;
            })
            .map(JobDtos.JobResponse::from)
            .toList();
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
        job.setCompanyType(req.companyType() != null ? req.companyType() : "PRODUCT");
        job.setSalaryRange(req.salaryRange() != null ? req.salaryRange() : "Competitive Market Rate");
        job.setSituationAdvice(req.situationAdvice() != null ? req.situationAdvice()
            : "Review this company's engineering blog and GitHub repositories. Focus on matching their technical stack and operational scale.");

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
                if (lower.contains(alias.toLowerCase())) {
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
            .orElseThrow(() -> new AppException("Job posting not found", HttpStatus.NOT_FOUND));

        Set<String> userSkills = new HashSet<>(Arrays.asList("Java", "Spring Boot", "REST APIs", "SQL", "Git", "OOP"));

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

        String advice = job.getSituationAdvice() != null && !job.getSituationAdvice().isBlank()
            ? job.getSituationAdvice()
            : (missingRequired.isEmpty()
                ? "Strong match! You demonstrate all required technical skills for this role."
                : "Focus on closing critical gaps in " + String.join(", ", missingRequired) + " through project evidence.");

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
        // 1. PRODUCT-BASED TIER (Fintech, Tech Giants & Unicorns)
        Job job1 = new Job();
        job1.setTitle("Software Development Engineer I (Java)");
        job1.setCompany("Razorpay Technologies");
        job1.setLocation("Bengaluru, India (Hybrid)");
        job1.setExperienceLevel("0-2 years");
        job1.setEmploymentType("Full-Time");
        job1.setSource(JobSource.COMPANY_CAREER_PAGE);
        job1.setSourceUrl("https://razorpay.com/jobs");
        job1.setCompanyType("PRODUCT");
        job1.setSalaryRange("₹14 - ₹22 LPA");
        job1.setSituationAdvice("Razorpay is a Tier-1 Fintech Unicorn. Their interview loop prioritizes transaction idempotency, low-latency API contracts, and concurrency safety. Practice transactional isolation levels and high-throughput PostgreSQL queries.");
        job1.setDescription("Build resilient, high-volume payment processing microservices using Spring Boot, PostgreSQL, and Kafka. Own service uptime, idempotency keys, and zero-data-loss transactional pipelines.");
        job1.setRequiredSkills(List.of("Java", "Spring Boot", "REST APIs", "SQL", "Git"));
        job1.setPreferredSkills(List.of("PostgreSQL", "Kafka", "Redis", "Docker"));

        Job job2 = new Job();
        job2.setTitle("Frontend Platform Engineer (React & TypeScript)");
        job2.setCompany("Swiggy Labs");
        job2.setLocation("Bengaluru / Remote");
        job2.setExperienceLevel("1-3 years");
        job2.setEmploymentType("Full-Time");
        job2.setSource(JobSource.COMPANY_CAREER_PAGE);
        job2.setSourceUrl("https://swiggy.com/careers");
        job2.setCompanyType("PRODUCT");
        job2.setSalaryRange("₹13 - ₹20 LPA");
        job2.setSituationAdvice("Consumer unicorn serving millions of daily concurrent orders. Focus on Core Web Vitals, code-splitting, client-side caching (TanStack Query), and strict TypeScript types.");
        job2.setDescription("Architect responsive web applications with React 18, Next.js, and TypeScript. Optimize bundle size, Core Web Vitals, and client caching for high-conversion web storefronts.");
        job2.setRequiredSkills(List.of("React", "TypeScript", "JavaScript", "Tailwind CSS", "Git"));
        job2.setPreferredSkills(List.of("Next.js", "REST APIs", "HTML5 & CSS3"));

        // 2. FAST-GROWING STARTUPS
        Job job3 = new Job();
        job3.setTitle("Backend Engineer (Developer Tooling)");
        job3.setCompany("Postman Scaleup");
        job3.setLocation("Bengaluru, India (Remote)");
        job3.setExperienceLevel("0-2 years");
        job3.setEmploymentType("Full-Time");
        job3.setSource(JobSource.COMPANY_CAREER_PAGE);
        job3.setSourceUrl("https://postman.com/careers");
        job3.setCompanyType("STARTUP");
        job3.setSalaryRange("₹15 - ₹24 LPA");
        job3.setSituationAdvice("High-velocity API platform. Focus on shipping speed, developer experience, containerized Docker environments, and clean API design.");
        job3.setDescription("Build scalable developer tools and REST API infrastructure using Node.js/TypeScript and Spring Boot. Maintain high reliability and rapid continuous integration.");
        job3.setRequiredSkills(List.of("TypeScript", "Node.js", "REST APIs", "SQL", "Git"));
        job3.setPreferredSkills(List.of("Docker", "PostgreSQL", "Redis", "Microservices"));

        Job job4 = new Job();
        job4.setTitle("Junior AI & Backend Engineer");
        job4.setCompany("Cohere Labs Partner");
        job4.setLocation("Remote (India)");
        job4.setExperienceLevel("0-2 years");
        job4.setEmploymentType("Full-Time");
        job4.setSource(JobSource.USER_SUBMITTED);
        job4.setCompanyType("STARTUP");
        job4.setSalaryRange("₹12 - ₹18 LPA");
        job4.setSituationAdvice("Applied AI startup building production RAG pipelines. Interviewers evaluate FastAPI async endpoints, vector embedding similarity search, and containerization with Docker.");
        job4.setDescription("Develop high-performance REST APIs with FastAPI, integrate vector database embeddings, clean structured datasets with Pandas/SQL, and deploy scalable ML services with Docker.");
        job4.setRequiredSkills(List.of("Python", "SQL", "FastAPI", "Pandas & NumPy", "Git"));
        job4.setPreferredSkills(List.of("Docker", "PyTorch", "PostgreSQL"));

        // 3. GLOBAL ENTERPRISE / SERVICE-BASED CONSULTANCIES
        Job job5 = new Job();
        job5.setTitle("Junior Java Software Engineer");
        job5.setCompany("EPAM Systems");
        job5.setLocation("Hyderabad / Bengaluru (Hybrid)");
        job5.setExperienceLevel("Entry-Level");
        job5.setEmploymentType("Full-Time");
        job5.setSource(JobSource.PUBLIC_POSTING);
        job5.setSourceUrl("https://epam.com/careers");
        job5.setCompanyType("SERVICE");
        job5.setSalaryRange("₹7 - ₹11 LPA");
        job5.setSituationAdvice("Global engineering consultancy with strict code quality standards. Technical interview focuses on core Java OOP principles, Collections complexity, Spring MVC architecture, and JUnit testing.");
        job5.setDescription("Deliver enterprise software solutions for global banking and retail clients. Implement Spring Boot REST services, automated JUnit test suites, and relational database schema persistence.");
        job5.setRequiredSkills(List.of("Java", "OOP", "Spring Boot", "SQL", "Git"));
        job5.setPreferredSkills(List.of("REST APIs", "PostgreSQL", "Docker", "Testing"));

        Job job6 = new Job();
        job6.setTitle("Associate Full Stack Engineer");
        job6.setCompany("Accenture Technology");
        job6.setLocation("Pune / Bengaluru (Hybrid)");
        job6.setExperienceLevel("0-2 years");
        job6.setEmploymentType("Full-Time");
        job6.setSource(JobSource.PUBLIC_POSTING);
        job6.setCompanyType("SERVICE");
        job6.setSalaryRange("₹6 - ₹9 LPA");
        job6.setSituationAdvice("Enterprise client delivery stream. Focuses on structured problem solving, clean documentation, standard Spring Boot patterns, and relational database queries.");
        job6.setDescription("Design and maintain full stack web applications for enterprise clients. Work with Java, Spring Boot, React, and relational database systems.");
        job6.setRequiredSkills(List.of("Java", "Spring Boot", "React", "SQL", "Git"));
        job6.setPreferredSkills(List.of("REST APIs", "HTML5 & CSS3", "Docker"));

        jobRepository.saveAll(List.of(job1, job2, job3, job4, job5, job6));
    }
}
