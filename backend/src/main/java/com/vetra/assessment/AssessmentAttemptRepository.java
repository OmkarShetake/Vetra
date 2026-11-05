package com.vetra.assessment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentAttemptRepository extends JpaRepository<AssessmentAttempt, String> {
    List<AssessmentAttempt> findByUserIdOrderByCompletedAtDesc(String userId);
}
