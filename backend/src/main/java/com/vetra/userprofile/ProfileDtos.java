package com.vetra.userprofile;

import java.util.List;

public class ProfileDtos {

    public record OnboardingRequest(
        String fullName,
        String education,
        String graduationYear,
        String experienceLevel,
        String targetJobRole,
        List<String> preferredTechStack,
        List<String> currentSkills,
        String careerObjectives
    ) {}

    public record UpdateProfileRequest(
        String education,
        String graduationYear,
        String experienceLevel,
        String targetRole,
        String careerObjectives,
        String githubUsername,
        String linkedinUrl,
        String portfolioUrl
    ) {}

    public record ProfileResponse(
        String id,
        String userId,
        String fullName,
        String email,
        String education,
        String graduationYear,
        String experienceLevel,
        String targetRole,
        String careerObjectives,
        String githubUsername,
        String linkedinUrl,
        String portfolioUrl,
        int careerReadinessScore
    ) {
        public static ProfileResponse from(UserProfile profile) {
            return new ProfileResponse(
                profile.getId(),
                profile.getUser().getId(),
                profile.getUser().getFullName(),
                profile.getUser().getEmail(),
                profile.getEducation(),
                profile.getGraduationYear(),
                profile.getUser().getExperienceLevel(),
                profile.getUser().getTargetRole(),
                profile.getCareerObjectives(),
                profile.getGithubUsername(),
                profile.getLinkedinUrl(),
                profile.getPortfolioUrl(),
                profile.getReadinessScore()
            );
        }
    }
}
