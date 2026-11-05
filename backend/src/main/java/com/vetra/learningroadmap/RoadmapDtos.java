package com.vetra.learningroadmap;

import java.util.List;

public class RoadmapDtos {

    public record TaskDto(
        String id,
        String title,
        String priority,
        int estimatedHours,
        boolean completed,
        String resourceUrl
    ) {}

    public record PhaseDto(
        int phaseNumber,
        String title,
        int estimatedHours,
        List<TaskDto> tasks
    ) {}

    public record RoadmapResponse(
        String planId,
        String targetRole,
        int totalHours,
        int completedTasks,
        int totalTasks,
        int progressPercent,
        List<PhaseDto> phases
    ) {}
}
