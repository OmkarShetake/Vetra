package com.vetra.assessment;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public class AssessmentDtos {

    public record QuestionDto(
        String id,
        String questionText,
        String optionA,
        String optionB,
        String optionC,
        String optionD
    ) {}

    public record AssessmentItemDto(
        String id,
        String title,
        String description,
        String skillArea,
        int questionCount,
        int durationMinutes,
        String difficulty,
        int passingScore
    ) {}

    public record AttemptDto(
        String id,
        String assessmentTitle,
        String skillArea,
        int score,
        boolean passed,
        Instant completedAt
    ) {}

    public record SubmitAssessmentRequest(
        Map<String, String> answers // questionId -> selectedOption (A, B, C, D)
    ) {}

    public record AssessmentResultResponse(
        String assessmentId,
        String title,
        int score,
        boolean passed,
        int correctCount,
        int totalQuestions,
        String verifiedSkill,
        List<QuestionExplanationDto> explanations
    ) {}

    public record QuestionExplanationDto(
        String questionId,
        String questionText,
        String userSelected,
        String correctOption,
        String explanation
    ) {}
}
