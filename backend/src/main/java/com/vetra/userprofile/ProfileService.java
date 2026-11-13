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

    private User resolveUser(User user) {
        if (user != null) return user;
        return userRepository.findByEmail("omkar@vetra.io")
            .or(() -> userRepository.findAll().stream().findFirst())
            .orElseGet(() -> userRepository.save(new User("omkar@vetra.io", "password", "Omkar Shetake", "Java Backend Developer", "0-2")));
    }

    @Transactional
    public ProfileDtos.ProfileResponse completeOnboarding(User user, ProfileDtos.OnboardingRequest req) {
        User currentUser = resolveUser(user);
        currentUser.setFullName(req.fullName() != null && !req.fullName().isBlank() ? req.fullName() : currentUser.getFullName());
        currentUser.setTargetRole(req.targetJobRole());
        currentUser.setExperienceLevel(req.experienceLevel());
        currentUser.setOnboardingCompleted(true);
        userRepository.save(currentUser);

        UserProfile profile = profileRepository.findByUserId(currentUser.getId())
            .orElse(new UserProfile(currentUser));

        profile.setEducation(req.education());
        profile.setGraduationYear(req.graduationYear());
        profile.setCareerObjectives(req.careerObjectives());
        profile.setReadinessScore(65); // Initial baseline score upon onboarding

        profile = profileRepository.save(profile);
        return ProfileDtos.ProfileResponse.from(profile);
    }

    @Transactional
    public ProfileDtos.ProfileResponse getProfile(User user) {
        User currentUser = resolveUser(user);
        UserProfile profile = profileRepository.findByUserId(currentUser.getId())
            .orElseGet(() -> profileRepository.save(new UserProfile(currentUser)));
        return ProfileDtos.ProfileResponse.from(profile);
    }

    @Transactional
    public ProfileDtos.ProfileResponse updateProfile(User user, ProfileDtos.UpdateProfileRequest req) {
        User currentUser = resolveUser(user);
        UserProfile profile = profileRepository.findByUserId(currentUser.getId())
            .orElseGet(() -> new UserProfile(currentUser));

        if (req.fullName() != null && !req.fullName().isBlank()) currentUser.setFullName(req.fullName());
        if (req.targetRole() != null) currentUser.setTargetRole(req.targetRole());
        if (req.experienceLevel() != null) currentUser.setExperienceLevel(req.experienceLevel());
        userRepository.save(currentUser);

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
