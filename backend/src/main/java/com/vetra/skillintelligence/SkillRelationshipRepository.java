package com.vetra.skillintelligence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRelationshipRepository extends JpaRepository<SkillRelationship, String> {
    List<SkillRelationship> findBySourceSkillId(String sourceSkillId);
    List<SkillRelationship> findByTargetSkillId(String targetSkillId);
}
