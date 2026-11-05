package com.vetra.skillgap;

import java.util.List;

public class SkillGapDtos {

    public record AnalyzeGapRequest(
        String targetRole,
        List<String> currentSkills
    ) {}

    public record SkillGapItem(
        String skillName,
        String status, // DEMONSTRATED, PARTIALLY_DEMONSTRATED, NOT_DEMONSTRATED
        String importance, // CRITICAL, IMPORTANT, BENEFICIAL
        int evidenceCount,
        String evidenceDescription,
        String explanation,
        List<String> prerequisites
    ) {}

    public record SkillGapAnalysisResponse(
        String targetRole,
        int overallScore,
        int demonstratedCount,
        int partiallyDemonstratedCount,
        int notDemonstratedCount,
        List<SkillGapItem> skills,
        String summaryRecommendation
    ) {}
}
