package com.vetra.skillgap;

import com.vetra.common.ApiResponse;
import com.vetra.identity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/skill-gap")
@Tag(name = "Skill Gap Intelligence", description = "Explainable gap breakdown against target role requirements")
public class SkillGapController {

    private final SkillGapService skillGapService;

    public SkillGapController(SkillGapService skillGapService) {
        this.skillGapService = skillGapService;
    }

    @PostMapping("/analyze")
    @Operation(summary = "Calculate explainable skill gaps against target role")
    public ResponseEntity<ApiResponse<SkillGapDtos.SkillGapAnalysisResponse>> analyze(
            @RequestBody(required = false) SkillGapDtos.AnalyzeGapRequest req,
            @AuthenticationPrincipal User user) {
        SkillGapDtos.AnalyzeGapRequest request = req != null ? req : new SkillGapDtos.AnalyzeGapRequest("Java Backend Developer", null);
        return ResponseEntity.ok(ApiResponse.ok("Analysis generated", skillGapService.analyzeGap(request, user)));
    }
}
