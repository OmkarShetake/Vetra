package com.vetra.learningroadmap;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningTaskRepository extends JpaRepository<LearningTask, String> {
    List<LearningTask> findByPlanIdOrderByPhaseNumberAsc(String planId);
}
