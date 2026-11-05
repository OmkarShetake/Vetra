package com.vetra.identity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {

    public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, message = "Password must be at least 6 characters") String password,
        @NotBlank String fullName
    ) {}

    public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
    ) {}

    public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserDto user
    ) {}

    public record UserDto(
        String id,
        String email,
        String fullName,
        String avatarUrl,
        boolean onboardingCompleted,
        String targetRole,
        String experienceLevel
    ) {
        public static UserDto from(User user) {
            return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.isOnboardingCompleted(),
                user.getTargetRole(),
                user.getExperienceLevel()
            );
        }
    }
}
