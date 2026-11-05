package com.vetra.skillintelligence;

import com.vetra.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/skills")
@Tag(name = "Skill Intelligence", description = "Taxonomy, prerequisites, relationships, and interactive graph")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    @Operation(summary = "Get skills list with optional search query")
    public ResponseEntity<ApiResponse<List<SkillDtos.SkillResponse>>> getSkills(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(ApiResponse.ok(skillService.getAllSkills(q)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed skill metadata by ID")
    public ResponseEntity<ApiResponse<SkillDtos.SkillResponse>> getSkillById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(skillService.getSkillById(id)));
    }

    @GetMapping("/graph")
    @Operation(summary = "Get interactive skill graph nodes and edges")
    public ResponseEntity<ApiResponse<SkillDtos.SkillGraphResponse>> getSkillGraph() {
        return ResponseEntity.ok(ApiResponse.ok(skillService.getSkillGraph()));
    }
}
