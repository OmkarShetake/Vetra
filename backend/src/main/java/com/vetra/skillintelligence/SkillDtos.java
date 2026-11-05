package com.vetra.skillintelligence;

import java.util.List;

public class SkillDtos {

    public record SkillResponse(
        String id,
        String name,
        SkillCategory category,
        String description,
        int demandLevel,
        List<String> prerequisites,
        List<String> relatedSkills
    ) {}

    public record SkillGraphNodeDto(
        String id,
        String label,
        SkillCategory category,
        int level,
        String description,
        int demandLevel
    ) {}

    public record SkillGraphEdgeDto(
        String source,
        String target,
        String type
    ) {}

    public record SkillGraphResponse(
        List<SkillGraphNodeDto> nodes,
        List<SkillGraphEdgeDto> edges
    ) {}
}
