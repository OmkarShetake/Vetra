package com.vetra.assessment;

import com.vetra.common.AppException;
import com.vetra.identity.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentAttemptRepository attemptRepository;

    public AssessmentService(AssessmentRepository assessmentRepository, AssessmentAttemptRepository attemptRepository) {
        this.assessmentRepository = assessmentRepository;
        this.attemptRepository = attemptRepository;
    }

    @Transactional(readOnly = true)
    public List<AssessmentDtos.AssessmentItemDto> getAllAssessments() {
        List<Assessment> list = assessmentRepository.findAll();
        if (list.isEmpty()) {
            seedSampleAssessments();
            list = assessmentRepository.findAll();
        }
        return list.stream()
            .map(a -> new AssessmentDtos.AssessmentItemDto(
                a.getId(),
                a.getTitle(),
                a.getDescription(),
                a.getSkillArea(),
                a.getQuestions().size(),
                a.getDurationMinutes(),
                a.getDifficulty(),
                a.getPassingScore()
            ))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<AssessmentDtos.QuestionDto> getQuestions(String assessmentId) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
            .orElseThrow(() -> new AppException("Assessment not found", HttpStatus.NOT_FOUND));

        return assessment.getQuestions().stream()
            .map(q -> new AssessmentDtos.QuestionDto(
                q.getId(),
                q.getQuestionText(),
                q.getOptionA(),
                q.getOptionB(),
                q.getOptionC(),
                q.getOptionD()
            ))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<AssessmentDtos.AttemptDto> getUserAttempts(User user) {
        return attemptRepository.findByUserIdOrderByCompletedAtDesc(user.getId()).stream()
            .map(att -> new AssessmentDtos.AttemptDto(
                att.getId(),
                att.getAssessment().getTitle(),
                att.getAssessment().getSkillArea(),
                att.getScore(),
                att.isPassed(),
                att.getCompletedAt()
            ))
            .toList();
    }

    @Transactional
    public AssessmentDtos.AssessmentResultResponse submitAssessment(String assessmentId, AssessmentDtos.SubmitAssessmentRequest req, User user) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
            .orElseThrow(() -> new AppException("Assessment not found", HttpStatus.NOT_FOUND));

        List<AssessmentQuestion> questions = assessment.getQuestions();
        if (questions.isEmpty()) {
            throw new AppException("No questions found for this assessment");
        }

        int correct = 0;
        List<AssessmentDtos.QuestionExplanationDto> explanations = new ArrayList<>();

        for (AssessmentQuestion q : questions) {
            String selected = req.answers() != null ? req.answers().get(q.getId()) : null;
            boolean isCorrect = selected != null && selected.trim().equalsIgnoreCase(q.getCorrectOption());
            if (isCorrect) correct++;

            explanations.add(new AssessmentDtos.QuestionExplanationDto(
                q.getId(),
                q.getQuestionText(),
                selected != null ? selected.toUpperCase() : "None",
                q.getCorrectOption(),
                q.getExplanation()
            ));
        }

        int score = Math.round(((float) correct / questions.size()) * 100);
        boolean passed = score >= assessment.getPassingScore();

        AssessmentAttempt attempt = new AssessmentAttempt(user, assessment, score, passed);
        attemptRepository.save(attempt);

        return new AssessmentDtos.AssessmentResultResponse(
            assessment.getId(),
            assessment.getTitle(),
            score,
            passed,
            correct,
            questions.size(),
            passed ? assessment.getSkillArea() : null,
            explanations
        );
    }

    private void seedSampleAssessments() {
        Assessment javaAssessment = new Assessment("as-1", "Java Fundamentals", "Variables, JVM, Memory Management, and Flow Control.", "Java", 20, "BEGINNER");
        List<AssessmentQuestion> javaQ = List.of(
            new AssessmentQuestion("q-j1", javaAssessment, "Which area of JVM memory stores class metadata and static variables?", "Stack", "Heap", "Metaspace", "Program Counter", "C", "Metaspace (formerly PermGen in Java 7 and earlier) stores class definitions, method data, and static members."),
            new AssessmentQuestion("q-j2", javaAssessment, "What is the difference between String, StringBuilder, and StringBuffer?", "String is mutable, others are immutable", "String is immutable; StringBuilder is mutable and not thread-safe; StringBuffer is synchronized", "All three are identical", "StringBuffer is deprecated", "B", "Strings are immutable. StringBuilder offers high-speed mutable character sequences without synchronization overhead, while StringBuffer is thread-safe."),
            new AssessmentQuestion("q-j3", javaAssessment, "Which interface is the root of the Java Collections Framework?", "Collection", "Iterable", "Map", "List", "B", "Iterable is the super-interface of Collection, enabling foreach loop iteration.")
        );
        javaAssessment.setQuestions(javaQ);

        Assessment springAssessment = new Assessment("as-2", "Spring Boot Fundamentals", "Auto-configuration, Dependency Injection, and RestController.", "Spring Boot", 25, "INTERMEDIATE");
        List<AssessmentQuestion> springQ = List.of(
            new AssessmentQuestion("q-s1", springAssessment, "What does @RestController combine?", "@Controller and @ResponseBody", "@Component and @Service", "@Configuration and @Bean", "@Controller and @Autowired", "A", "@RestController is a convenience annotation combining @Controller and @ResponseBody."),
            new AssessmentQuestion("q-s2", springAssessment, "How does Spring Boot resolve circular dependencies?", "It automatically converts them to proxies", "By default in Spring Boot 2.6+ it throws BeanCurrentlyInCreationException", "It silently ignores them", "It restarts the JVM", "B", "Circular bean dependencies are prohibited by default in Spring Boot 2.6+ to enforce clean decoupling.")
        );
        springAssessment.setQuestions(springQ);

        assessmentRepository.saveAll(List.of(javaAssessment, springAssessment));
    }
}
