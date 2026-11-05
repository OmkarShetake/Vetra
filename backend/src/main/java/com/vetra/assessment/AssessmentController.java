package com.vetra.assessment;

import com.vetra.common.ApiResponse;
import com.vetra.identity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assessments")
@Tag(name = "Assessments", description = "Verified technical skill assessments, quizzing, and automated evaluation")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping
    @Operation(summary = "Get list of available technical skill assessments")
    public ResponseEntity<ApiResponse<List<AssessmentDtos.AssessmentItemDto>>> getAssessments() {
        return ResponseEntity.ok(ApiResponse.ok(assessmentService.getAllAssessments()));
    }

    @GetMapping("/{id}/questions")
    @Operation(summary = "Get questions for an assessment")
    public ResponseEntity<ApiResponse<List<AssessmentDtos.QuestionDto>>> getQuestions(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(assessmentService.getQuestions(id)));
    }

    @GetMapping("/attempts")
    @Operation(summary = "Get history of assessment attempts and verified credentials")
    public ResponseEntity<ApiResponse<List<AssessmentDtos.AttemptDto>>> getAttempts(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(assessmentService.getUserAttempts(user)));
    }

    @PostMapping("/{id}/submit")
    @Operation(summary = "Submit answers for automatic grading, feedback, and skill verification")
    public ResponseEntity<ApiResponse<AssessmentDtos.AssessmentResultResponse>> submit(
            @PathVariable String id,
            @RequestBody AssessmentDtos.SubmitAssessmentRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok("Assessment evaluated", assessmentService.submitAssessment(id, req, user)));
    }
}
