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
    @Operation(summary = "Upload PDF/DOCX resume and extract text using Apache PDFBox")
    public ResponseEntity<ApiResponse<ResumeDtos.ResumeUploadResponse>> upload(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok("Resume uploaded and parsed", resumeService.uploadResume(file, user)));
    }

    @GetMapping("/{id}/analyze")
    @Operation(summary = "Analyze resume structure, keyword coverage, and evidence alignment")
    public ResponseEntity<ApiResponse<ResumeDtos.ResumeAnalysisResponse>> analyze(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(resumeService.analyzeResume(id, user)));
    }

    @PostMapping("/ai-rewrite-bullet")
    @Operation(summary = "Use Google Gemini AI to rewrite a weak resume bullet point into an impact statement")
    public ResponseEntity<ApiResponse<String>> rewriteBullet(@RequestBody java.util.Map<String, String> body) {
        String bulletText = body.getOrDefault("bulletText", "");
        String rewritten = resumeService.rewriteBulletWithAi(bulletText);
        return ResponseEntity.ok(ApiResponse.ok("Bullet rewritten with Gemini AI", rewritten));
    }
}
