package com.vetra.userprofile;

import com.vetra.common.ApiResponse;
import com.vetra.identity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@Tag(name = "User Profile", description = "Career profile and onboarding management")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping("/onboarding")
    @Operation(summary = "Submit onboarding data and setup career profile")
    public ResponseEntity<ApiResponse<ProfileDtos.ProfileResponse>> completeOnboarding(
            @AuthenticationPrincipal User user,
            @RequestBody ProfileDtos.OnboardingRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Onboarding completed", profileService.completeOnboarding(user, req)));
    }

    @GetMapping
    @Operation(summary = "Get user career profile")
    public ResponseEntity<ApiResponse<ProfileDtos.ProfileResponse>> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(profileService.getProfile(user)));
    }

    @PutMapping
    @Operation(summary = "Update career profile settings")
    public ResponseEntity<ApiResponse<ProfileDtos.ProfileResponse>> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody ProfileDtos.UpdateProfileRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Profile updated", profileService.updateProfile(user, req)));
    }
}
