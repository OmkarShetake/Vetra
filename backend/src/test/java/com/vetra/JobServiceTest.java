package com.vetra;

import com.vetra.jobintelligence.JobRepository;
import com.vetra.jobintelligence.JobService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JobServiceTest {

    private JobService jobService;
    private JobRepository jobRepository;

    @BeforeEach
    void setUp() {
        jobRepository = Mockito.mock(JobRepository.class);
        jobService = new JobService(jobRepository);
    }

    @Test
    void testExtractSkillsFromJobDescription() {
        String jd = "We are seeking a Backend Engineer with strong Java and Spring Boot experience. Must know SQL, PostgreSQL, REST APIs, and Docker for containerized deployments.";
        List<String> skills = jobService.extractSkills(jd);

        assertTrue(skills.contains("Java"));
        assertTrue(skills.contains("Spring Boot"));
        assertTrue(skills.contains("SQL"));
        assertTrue(skills.contains("PostgreSQL"));
        assertTrue(skills.contains("REST APIs"));
        assertTrue(skills.contains("Docker"));
    }

    @Test
    void testEmptyDescriptionExtractsNoSkills() {
        List<String> skills = jobService.extractSkills("");
        assertTrue(skills.isEmpty());
    }
}
