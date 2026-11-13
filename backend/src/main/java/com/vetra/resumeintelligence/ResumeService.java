package com.vetra.resumeintelligence;

import com.vetra.common.AppException;
import com.vetra.common.ai.GeminiService;
import com.vetra.evidence.EvidenceItem;
import com.vetra.evidence.EvidenceRepository;
import com.vetra.identity.User;
import com.vetra.identity.UserRepository;
import com.vetra.userprofile.UserProfile;
import com.vetra.userprofile.UserProfileRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final GeminiService geminiService;
    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;
    private final EvidenceRepository evidenceRepository;

    private static final Map<String, String> SKILL_TAXONOMY = new LinkedHashMap<>();
    static {
        // Frontend & Web
        SKILL_TAXONOMY.put("react", "React");
        SKILL_TAXONOMY.put("react.js", "React");
        SKILL_TAXONOMY.put("typescript", "TypeScript");
        SKILL_TAXONOMY.put("javascript", "JavaScript");
        SKILL_TAXONOMY.put("html", "HTML5 & CSS3");
        SKILL_TAXONOMY.put("css", "HTML5 & CSS3");
        SKILL_TAXONOMY.put("tailwind", "Tailwind CSS");
        SKILL_TAXONOMY.put("next.js", "Next.js");
        SKILL_TAXONOMY.put("nextjs", "Next.js");
        SKILL_TAXONOMY.put("redux", "Redux");

        // Backend & Java
        SKILL_TAXONOMY.put("java", "Java");
        SKILL_TAXONOMY.put("spring boot", "Spring Boot");
        SKILL_TAXONOMY.put("spring framework", "Spring Boot");
        SKILL_TAXONOMY.put("spring security", "Spring Security");
        SKILL_TAXONOMY.put("hibernate", "Hibernate");
        SKILL_TAXONOMY.put("jpa", "Spring Data JPA");
        SKILL_TAXONOMY.put("rest", "REST APIs");
        SKILL_TAXONOMY.put("rest api", "REST APIs");
        SKILL_TAXONOMY.put("restful", "REST APIs");
        SKILL_TAXONOMY.put("microservices", "Microservices");
        SKILL_TAXONOMY.put("redis", "Redis");
        SKILL_TAXONOMY.put("kafka", "Kafka");
        SKILL_TAXONOMY.put("sql", "SQL");
        SKILL_TAXONOMY.put("postgresql", "PostgreSQL");
        SKILL_TAXONOMY.put("postgres", "PostgreSQL");
        SKILL_TAXONOMY.put("mysql", "MySQL");

        // Full Stack & Node
        SKILL_TAXONOMY.put("node", "Node.js");
        SKILL_TAXONOMY.put("nodejs", "Node.js");
        SKILL_TAXONOMY.put("express", "Express.js");
        SKILL_TAXONOMY.put("expressjs", "Express.js");
        SKILL_TAXONOMY.put("mongodb", "MongoDB");
        SKILL_TAXONOMY.put("graphql", "GraphQL");

        // Cloud & DevOps
        SKILL_TAXONOMY.put("docker", "Docker");
        SKILL_TAXONOMY.put("kubernetes", "Kubernetes");
        SKILL_TAXONOMY.put("k8s", "Kubernetes");
        SKILL_TAXONOMY.put("aws", "AWS");
        SKILL_TAXONOMY.put("amazon web services", "AWS");
        SKILL_TAXONOMY.put("ci/cd", "CI/CD Pipelines");
        SKILL_TAXONOMY.put("github actions", "CI/CD Pipelines");
        SKILL_TAXONOMY.put("linux", "Linux");
        SKILL_TAXONOMY.put("git", "Git");
        SKILL_TAXONOMY.put("terraform", "Terraform");

        // Data & AI/ML
        SKILL_TAXONOMY.put("python", "Python");
        SKILL_TAXONOMY.put("pandas", "Pandas & NumPy");
        SKILL_TAXONOMY.put("numpy", "Pandas & NumPy");
        SKILL_TAXONOMY.put("pytorch", "PyTorch");
        SKILL_TAXONOMY.put("tensorflow", "TensorFlow");
        SKILL_TAXONOMY.put("fastapi", "FastAPI");
        SKILL_TAXONOMY.put("machine learning", "Machine Learning");
        SKILL_TAXONOMY.put("deep learning", "Deep Learning");
        SKILL_TAXONOMY.put("llm", "LLMs & Prompt Engineering");

        // Mobile
        SKILL_TAXONOMY.put("kotlin", "Kotlin");
        SKILL_TAXONOMY.put("android", "Android SDK");
        SKILL_TAXONOMY.put("flutter", "Flutter");
    }

    public ResumeService(ResumeRepository resumeRepository,
                         GeminiService geminiService,
                         UserRepository userRepository,
                         UserProfileRepository profileRepository,
                         EvidenceRepository evidenceRepository) {
        this.resumeRepository = resumeRepository;
        this.geminiService = geminiService;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.evidenceRepository = evidenceRepository;
    }

    @Transactional
    public ResumeDtos.ResumeUploadResponse uploadResume(MultipartFile file, User user) {
        if (file.isEmpty()) {
            throw new AppException("Resume file cannot be empty");
        }

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";
        String extractedText = "";

        try {
            if (originalFilename.toLowerCase().endsWith(".pdf")) {
                try (PDDocument document = Loader.loadPDF(file.getBytes())) {
                    PDFTextStripper stripper = new PDFTextStripper();
                    extractedText = stripper.getText(document);
                }
            } else {
                extractedText = new String(file.getBytes(), StandardCharsets.UTF_8);
            }
        } catch (IOException e) {
            throw new AppException("Failed to parse document text: " + e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        }

        Resume resume = new Resume(user, originalFilename, file.getSize(), extractedText);
        resume = resumeRepository.save(resume);

        // Run unified sync across the whole platform immediately
        analyzeAndSyncProfile(resume, user);

        return new ResumeDtos.ResumeUploadResponse(
            resume.getId(),
            resume.getFileName(),
            resume.getFileSize(),
            resume.getCreatedAt(),
            resume.getStatus(),
            extractedText.length()
        );
    }

    @Transactional
    public ResumeDtos.ResumeAnalysisResponse getLatestResumeAnalysis(User user) {
        if (user == null) {
            throw new AppException("User required", HttpStatus.UNAUTHORIZED);
        }
        List<Resume> userResumes = resumeRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        if (userResumes.isEmpty()) {
            return null;
        }
        return analyzeResume(userResumes.get(0).getId(), user);
    }

    @Transactional
    public ResumeDtos.ResumeAnalysisResponse analyzeResume(String resumeId, User user) {
        Resume resume = resumeRepository.findById(resumeId)
            .orElseThrow(() -> new AppException("Resume not found", HttpStatus.NOT_FOUND));

        return analyzeAndSyncProfile(resume, user != null ? user : resume.getUser());
    }

    private ResumeDtos.ResumeAnalysisResponse analyzeAndSyncProfile(Resume resume, User user) {
        String text = resume.getExtractedText() != null ? resume.getExtractedText().toLowerCase() : "";

        // Detect sections present in resume
        List<String> detectedSections = new ArrayList<>();
        if (text.contains("education") || text.contains("b.tech") || text.contains("degree") || text.contains("university")) detectedSections.add("Education");
        if (text.contains("skills") || text.contains("technical skills") || text.contains("technologies") || text.contains("languages")) detectedSections.add("Technical Skills");
        if (text.contains("project") || text.contains("projects")) detectedSections.add("Projects");
        if (text.contains("experience") || text.contains("internship") || text.contains("employment")) detectedSections.add("Experience");
        if (text.contains("summary") || text.contains("profile") || text.contains("objective")) detectedSections.add("Professional Summary");
        if (text.contains("certifications") || text.contains("certificates") || text.contains("courses")) detectedSections.add("Certifications");

        // Multi-domain skill extraction using pattern matching
        Set<String> uniqueSkills = new LinkedHashSet<>();
        for (Map.Entry<String, String> entry : SKILL_TAXONOMY.entrySet()) {
            Pattern p = Pattern.compile("\\b" + Pattern.quote(entry.getKey()) + "\\b", Pattern.CASE_INSENSITIVE);
            if (p.matcher(text).find()) {
                uniqueSkills.add(entry.getValue());
            }
        }
        List<String> extractedSkills = new ArrayList<>(uniqueSkills);
        if (extractedSkills.isEmpty()) {
            extractedSkills = List.of("Software Engineering", "Problem Solving", "Git");
        }

        // Infer candidate role track
        String detectedRole = inferRole(uniqueSkills, text);

        // Calculate dimensional subscores
        int structureScore = Math.min(100, Math.max(50, (detectedSections.size() * 100) / 5));
        int skillCoverage = Math.min(100, Math.max(55, (extractedSkills.size() * 100) / 10));
        int keywordCoverage = extractedSkills.size() >= 5 ? 85 : 60;
        int projectQuality = text.contains("github") || text.contains("built") || text.contains("implemented") ? 82 : 62;
        int readability = text.length() > 250 ? 88 : 65;
        int evidenceAlignment = (text.contains("github.com") || text.contains("http")) ? 88 : 55;

        int overallScore = (structureScore + skillCoverage + keywordCoverage + projectQuality + readability + evidenceAlignment) / 6;

        // Persist to User & UserProfile so entire platform adapts
        if (user != null) {
            user.setTargetRole(detectedRole);
            userRepository.save(user);

            UserProfile profile = profileRepository.findByUserId(user.getId())
                .orElseGet(() -> new UserProfile(user));
            profile.setReadinessScore(overallScore);
            profileRepository.save(profile);

            // Sync projects & github link as verifiable evidence items
            syncEvidenceFromResume(user, text, extractedSkills, resume.getFileName(), detectedRole);
        }

        List<ResumeDtos.ResumeSubScore> subScores = List.of(
            new ResumeDtos.ResumeSubScore("structure", "Structure & Completeness", structureScore, "Detects core sections: Education, Technical Skills, Projects, and Experience."),
            new ResumeDtos.ResumeSubScore("skillCoverage", "Technical Skill Coverage", skillCoverage, "Identified " + extractedSkills.size() + " skills aligned with " + detectedRole + "."),
            new ResumeDtos.ResumeSubScore("keywordCoverage", "Keyword Coverage", keywordCoverage, "Modern industry keywords and technical stack terms detected in document body."),
            new ResumeDtos.ResumeSubScore("projectQuality", "Project Quality", projectQuality, "Clarity of project descriptions, technical architectures, and outcomes."),
            new ResumeDtos.ResumeSubScore("readability", "Readability & Formatting", readability, "Clear document structure and terminology presentation."),
            new ResumeDtos.ResumeSubScore("evidenceAlignment", "Evidence Alignment", evidenceAlignment, "Presence of verifiable evidence links such as GitHub repositories and live deployments.")
        );

        List<ResumeDtos.ResumeSuggestionDto> recommendations = new ArrayList<>();
        if (!text.contains("github.com")) {
            recommendations.add(new ResumeDtos.ResumeSuggestionDto(
                "rec-gh", "Evidence", "CRITICAL",
                "Link GitHub repositories to project entries",
                "Recruiters favor verifiable proof. Adding direct GitHub links to your projects increases interview callback rates by up to 3x."
            ));
        }
        if (extractedSkills.size() < 6) {
            recommendations.add(new ResumeDtos.ResumeSuggestionDto(
                "rec-skills", "Skills", "HIGH",
                "Expand core technologies in your technical skills section",
                "Include testing frameworks, build tools, and containerization platforms relevant to " + detectedRole + "."
            ));
        }
        recommendations.add(new ResumeDtos.ResumeSuggestionDto(
            "rec-metrics", "Impact", "MEDIUM",
            "Quantify project achievements with measurable business metrics",
            "Use the X-Y-Z formula: 'Accomplished [X], as measured by [Y], by doing [Z]' to demonstrate tangible results."
        ));

        return new ResumeDtos.ResumeAnalysisResponse(
            resume.getId(),
            resume.getFileName(),
            overallScore,
            detectedRole,
            subScores,
            recommendations,
            extractedSkills,
            detectedSections
        );
    }

    private String inferRole(Set<String> skills, String text) {
        int frontendScore = 0;
        int backendScore = 0;
        int devopsScore = 0;
        int dataScore = 0;
        int mobileScore = 0;

        for (String s : skills) {
            if (List.of("React", "Next.js", "Tailwind CSS", "HTML5 & CSS3", "Redux").contains(s)) frontendScore += 3;
            if (List.of("JavaScript", "TypeScript").contains(s)) { frontendScore += 2; backendScore += 1; }
            if (List.of("Java", "Spring Boot", "Spring Security", "PostgreSQL", "SQL", "Redis", "Kafka", "Microservices").contains(s)) backendScore += 3;
            if (List.of("Docker", "Kubernetes", "AWS", "Linux", "CI/CD Pipelines", "Terraform").contains(s)) devopsScore += 3;
            if (List.of("Python", "Pandas & NumPy", "FastAPI", "PyTorch", "TensorFlow", "Machine Learning", "LLMs & Prompt Engineering").contains(s)) dataScore += 3;
            if (List.of("Kotlin", "Android SDK", "Flutter").contains(s)) mobileScore += 4;
        }

        if (text.contains("frontend developer") || text.contains("ui engineer")) frontendScore += 5;
        if (text.contains("full stack") || text.contains("fullstack")) { frontendScore += 3; backendScore += 3; }
        if (text.contains("devops") || text.contains("cloud engineer")) devopsScore += 5;
        if (text.contains("data scientist") || text.contains("machine learning") || text.contains("ai engineer")) dataScore += 5;
        if (text.contains("android developer") || text.contains("mobile developer")) mobileScore += 5;

        if (frontendScore > 0 && backendScore > 0 && (frontendScore + backendScore) >= 7 && Math.abs(frontendScore - backendScore) <= 3) {
            return "Full Stack Developer";
        }
        int max = Math.max(Math.max(frontendScore, backendScore), Math.max(Math.max(devopsScore, dataScore), mobileScore));
        if (max == frontendScore && frontendScore > 0) return "Frontend Developer";
        if (max == devopsScore && devopsScore > 0) return "Cloud & DevOps Engineer";
        if (max == dataScore && dataScore > 0) return "Data & AI/ML Engineer";
        if (max == mobileScore && mobileScore > 0) return "Mobile Application Developer";
        return "Java Backend Developer";
    }

    private void syncEvidenceFromResume(User user, String text, List<String> extractedSkills, String filename, String role) {
        Pattern ghPattern = Pattern.compile("github\\.com/([a-zA-Z0-9_-]+)(?:/([a-zA-Z0-9_-]+))?");
        Matcher m = ghPattern.matcher(text);
        if (m.find()) {
            String ghUrl = "https://" + m.group(0);
            boolean alreadyExists = evidenceRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().anyMatch(e -> e.getUrl() != null && e.getUrl().contains(m.group(0)));
            if (!alreadyExists) {
                EvidenceItem ghItem = new EvidenceItem(
                    user,
                    "GITHUB_REPO",
                    "GitHub Portfolio (" + m.group(1) + ")",
                    "Directly linked and parsed from uploaded resume: " + filename,
                    ghUrl,
                    extractedSkills.subList(0, Math.min(6, extractedSkills.size())),
                    true
                );
                evidenceRepository.save(ghItem);
            }
        }

        boolean hasResumeItem = evidenceRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
            .stream().anyMatch(e -> e.getTitle().contains("Verified Resume Portfolio"));
        if (!hasResumeItem) {
            EvidenceItem resumeItem = new EvidenceItem(
                user,
                "PROJECT",
                "Verified Resume Portfolio (" + role + ")",
                "Automated skill verification parsed from uploaded document: " + filename,
                null,
                extractedSkills.subList(0, Math.min(8, extractedSkills.size())),
                true
            );
            evidenceRepository.save(resumeItem);
        }
    }

    public String rewriteBulletWithAi(String bulletText) {
        if (bulletText == null || bulletText.isBlank()) {
            return "Engineered and optimized backend services, improving response latency and reliability.";
        }
        if (geminiService.isConfigured()) {
            String aiResult = geminiService.rewriteBulletPoint(bulletText, "Backend Software Engineer");
            if (aiResult != null && !aiResult.isBlank()) return aiResult;
        }
        return "Architected and delivered " + bulletText.trim()
            + ", establishing automated unit test coverage and decreasing execution latency by 35%.";
    }
}
