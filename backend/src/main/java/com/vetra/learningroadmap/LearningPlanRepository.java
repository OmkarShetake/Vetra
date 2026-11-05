package com.vetra.learningroadmap;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningPlanRepository extends JpaRepository<LearningPlan, String> {
    Optional<LearningPlan> findFirstByUserIdOrderByCreatedAtDesc(String userId);
}
