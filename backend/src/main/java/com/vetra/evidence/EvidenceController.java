package com.vetra.evidence;

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
@RequestMapping("/api/v1/evidence")
@Tag(name = "Evidence Portfolio", description = "Verifiable project, GitHub repository, and credential evidence")
public class EvidenceController {

    private final EvidenceService evidenceService;

    public EvidenceController(EvidenceService evidenceService) {
        this.evidenceService = evidenceService;
    }

    @GetMapping
    @Operation(summary = "Get user evidence portfolio items")
    public ResponseEntity<ApiResponse<List<EvidenceDtos.EvidenceResponse>>> getEvidence(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(evidenceService.getUserEvidence(user)));
    }

    @PostMapping
    @Operation(summary = "Add project or GitHub repository evidence")
    public ResponseEntity<ApiResponse<EvidenceDtos.EvidenceResponse>> addEvidence(
            @Valid @RequestBody EvidenceDtos.CreateEvidenceRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok("Evidence added", evidenceService.addEvidence(req, user)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an evidence item")
    public ResponseEntity<ApiResponse<Void>> deleteEvidence(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        evidenceService.deleteEvidence(id, user);
        return ResponseEntity.ok(ApiResponse.ok("Evidence deleted", null));
    }

    @PatchMapping("/{id}/toggle-verify")
    @Operation(summary = "Toggle verification status of evidence")
    public ResponseEntity<ApiResponse<EvidenceDtos.EvidenceResponse>> toggleVerify(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok("Verification updated", evidenceService.toggleVerify(id, user)));
    }
}
