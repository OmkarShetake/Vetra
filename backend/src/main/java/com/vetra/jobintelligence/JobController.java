package com.vetra.jobintelligence;

import com.vetra.common.ApiResponse;
import com.vetra.identity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/jobs")
@Tag(name = "Job Intelligence", description = "Job market ingestion, skill requirements, and vacancy search")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    @Operation(summary = "Get all jobs with optional keyword and company archetype search")
    public ResponseEntity<ApiResponse<List<JobDtos.JobResponse>>> getJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String companyType) {
        return ResponseEntity.ok(ApiResponse.ok(jobService.getAllJobs(search, companyType)));
    }

    @PostMapping("/import")
    @Operation(summary = "Import user-submitted job description with automated skill extraction")
    public ResponseEntity<ApiResponse<JobDtos.JobResponse>> importJob(@Valid @RequestBody JobDtos.ImportJobRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Job imported and skills extracted", jobService.importJob(req)));
    }

    @PostMapping("/{id}/analyze")
    @Operation(summary = "Analyze job requirements against user skill evidence")
    public ResponseEntity<ApiResponse<JobDtos.JobAnalysisResult>> analyzeJob(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(jobService.analyzeJob(id, user)));
    }
}
