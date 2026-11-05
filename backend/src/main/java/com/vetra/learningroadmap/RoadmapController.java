package com.vetra.learningroadmap;

import com.vetra.common.ApiResponse;
import com.vetra.identity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/learning-plans")
@Tag(name = "Learning Roadmap", description = "Personalized phased roadmaps, milestone tracking, and task completion")
public class RoadmapController {

    private final RoadmapService roadmapService;

    public RoadmapController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    @GetMapping
    @Operation(summary = "Get user learning roadmap based on target role and skill gaps")
    public ResponseEntity<ApiResponse<RoadmapDtos.RoadmapResponse>> getRoadmap(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(roadmapService.getRoadmap(user)));
    }

    @PostMapping("/tasks/{id}/toggle")
    @Operation(summary = "Toggle completion status of a learning task")
    public ResponseEntity<ApiResponse<Boolean>> toggleTask(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok("Task toggled", roadmapService.toggleTask(id)));
    }
}
