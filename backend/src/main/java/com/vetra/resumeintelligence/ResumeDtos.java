package com.vetra.resumeintelligence;

import java.time.Instant;
import java.util.List;

public class ResumeDtos {

    public record ResumeUploadResponse(
        String resumeId,
        String fileName,
        long fileSize,
        Instant uploadedAt,
        String status,
        int textLength
    ) {}

    public record ResumeSubScore(
        String key,
        String label,
        int value,
        String description
    ) {}

    public record ResumeSuggestionDto(
        String id,
        String category,
        String priority, // CRITICAL, HIGH, MEDIUM, LOW
        String title,
        String description
    ) {}

    public record ResumeJobMatchDto(
        String jobId,
        int matchScore,
        List<String> matchedSkills,
        List<String> missingKeywords,
        List<String> indirectSkills,
        List<String> weakEvidenceSkills
    ) {}

    public record ResumeAnalysisResponse(
        String resumeId,
        String fileName,
        int overallScore,
        String detectedRole,
        List<ResumeSubScore> subScores,
        List<ResumeSuggestionDto> recommendations,
        List<String> extractedSkills,
        List<String> detectedSections
    ) {}
}
