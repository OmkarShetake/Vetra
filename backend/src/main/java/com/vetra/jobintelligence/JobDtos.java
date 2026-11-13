package com.vetra.jobintelligence;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;

public class JobDtos {

    public record ImportJobRequest(
        @NotBlank String title,
        @NotBlank String company,
        @NotBlank String description,
        String location,
        String employmentType,
        String experienceLevel,
        String sourceUrl,
        String companyType,
        String salaryRange,
        String situationAdvice
    ) {}

    public record JobResponse(
        String id,
        String title,
        String company,
        String location,
        String experienceLevel,
        String employmentType,
        JobSource source,
        String sourceUrl,
        Instant collectedDate,
        String description,
        List<String> requiredSkills,
        List<String> preferredSkills,
        String companyType,
        String salaryRange,
        String situationAdvice
    ) {
        public static JobResponse from(Job job) {
            return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getCompany(),
                job.getLocation(),
                job.getExperienceLevel(),
                job.getEmploymentType(),
                job.getSource(),
                job.getSourceUrl(),
                job.getCollectedDate(),
                job.getDescription(),
                job.getRequiredSkills(),
                job.getPreferredSkills(),
                job.getCompanyType(),
                job.getSalaryRange(),
                job.getSituationAdvice()
            );
        }
    }

    public record JobAnalysisResult(
        String jobId,
        String jobTitle,
        String company,
        int matchScore,
        List<String> matchedSkills,
        List<String> missingRequiredSkills,
        List<String> missingPreferredSkills,
        String personalizedAdvice
    ) {}
}
