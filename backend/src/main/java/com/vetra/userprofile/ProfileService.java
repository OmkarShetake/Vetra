package com.vetra.userprofile;

import com.vetra.common.AppException;
import com.vetra.identity.User;
import com.vetra.identity.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final UserProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(UserProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ProfileDtos.ProfileResponse completeOnboarding(User user, ProfileDtos.OnboardingRequest req) {
        user.setFullName(req.fullName() != null && !req.fullName().isBlank() ? req.fullName() : user.getFullName());
        user.setTargetRole(req.targetJobRole());
        user.setExperienceLevel(req.experienceLevel());
        user.setOnboardingCompleted(true);
        userRepository.save(user);

        UserProfile profile = profileRepository.findByUserId(user.getId())
            .orElse(new UserProfile(user));

        profile.setEducation(req.education());
        profile.setGraduationYear(req.graduationYear());
        profile.setCareerObjectives(req.careerObjectives());
        profile.setReadinessScore(65); // Initial baseline score upon onboarding

        profile = profileRepository.save(profile);
        return ProfileDtos.ProfileResponse.from(profile);
    }

    @Transactional(readOnly = true)
    public ProfileDtos.ProfileResponse getProfile(User user) {
        UserProfile profile = profileRepository.findByUserId(user.getId())
            .orElseGet(() -> profileRepository.save(new UserProfile(user)));
        return ProfileDtos.ProfileResponse.from(profile);
    }

    @Transactional
    public ProfileDtos.ProfileResponse updateProfile(User user, ProfileDtos.UpdateProfileRequest req) {
        UserProfile profile = profileRepository.findByUserId(user.getId())
            .orElseGet(() -> new UserProfile(user));

        if (req.targetRole() != null) user.setTargetRole(req.targetRole());
        if (req.experienceLevel() != null) user.setExperienceLevel(req.experienceLevel());
        userRepository.save(user);

        if (req.education() != null) profile.setEducation(req.education());
        if (req.graduationYear() != null) profile.setGraduationYear(req.graduationYear());
        if (req.careerObjectives() != null) profile.setCareerObjectives(req.careerObjectives());
        if (req.githubUsername() != null) profile.setGithubUsername(req.githubUsername());
        if (req.linkedinUrl() != null) profile.setLinkedinUrl(req.linkedinUrl());
        if (req.portfolioUrl() != null) profile.setPortfolioUrl(req.portfolioUrl());

        profile = profileRepository.save(profile);
        return ProfileDtos.ProfileResponse.from(profile);
    }
}
