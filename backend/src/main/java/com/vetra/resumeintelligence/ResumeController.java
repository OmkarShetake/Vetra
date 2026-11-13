package com.vetra.resumeintelligence;

import com.vetra.common.ApiResponse;
import com.vetra.identity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/resumes")
@Tag(name = "Resume Studio", description = "Resume parsing, extraction, keyword alignment, and fact-grounded recommendations")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload PDF/DOCX resume, extract text using Apache PDFBox, and return complete ATS analysis")
    public ResponseEntity<ApiResponse<ResumeDtos.ResumeAnalysisResponse>> upload(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok("Resume uploaded and analyzed", resumeService.uploadResume(file, user)));
    }

    @GetMapping("/{id}/analyze")
    @Operation(summary = "Analyze resume structure, keyword coverage, and evidence alignment")
    public ResponseEntity<ApiResponse<ResumeDtos.ResumeAnalysisResponse>> analyze(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(resumeService.analyzeResume(id, user)));
    }

    @GetMapping("/latest")
    @Operation(summary = "Get the latest analyzed resume for current user")
    public ResponseEntity<ApiResponse<ResumeDtos.ResumeAnalysisResponse>> getLatestResume(
            @AuthenticationPrincipal User user) {
        ResumeDtos.ResumeAnalysisResponse res = resumeService.getLatestResumeAnalysis(user);
        return ResponseEntity.ok(ApiResponse.ok("Latest resume retrieved", res));
    }

    @PostMapping("/ai-rewrite-bullet")
    @Operation(summary = "Use Google Gemini AI to rewrite a weak resume bullet point into an impact statement")
    public ResponseEntity<ApiResponse<String>> rewriteBullet(@RequestBody java.util.Map<String, String> body) {
        String bulletText = body.getOrDefault("bulletText", "");
        String targetRole = body.getOrDefault("targetRole", "Software Engineer");
        String rewritten = resumeService.rewriteBulletWithAi(bulletText, targetRole);
        return ResponseEntity.ok(ApiResponse.ok("Bullet rewritten with Gemini AI", rewritten));
    }
}
