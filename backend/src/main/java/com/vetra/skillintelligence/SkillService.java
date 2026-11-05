package com.vetra.skillintelligence;

import com.vetra.common.AppException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final SkillRelationshipRepository relationshipRepository;

    public SkillService(SkillRepository skillRepository, SkillRelationshipRepository relationshipRepository) {
        this.skillRepository = skillRepository;
        this.relationshipRepository = relationshipRepository;
    }

    @Transactional(readOnly = true)
    public List<SkillDtos.SkillResponse> getAllSkills(String query) {
        List<Skill> skills = (query != null && !query.isBlank())
            ? skillRepository.findByNameContainingIgnoreCase(query)
            : skillRepository.findAll();

        if (skills.isEmpty()) {
            seedTaxonomy();
            skills = skillRepository.findAll();
        }

        return skills.stream().map(this::toSkillResponse).toList();
    }

    @Transactional(readOnly = true)
    public SkillDtos.SkillResponse getSkillById(String id) {
        Skill skill = skillRepository.findById(id)
            .orElseThrow(() -> new AppException("Skill not found", HttpStatus.NOT_FOUND));
        return toSkillResponse(skill);
    }

    @Transactional(readOnly = true)
    public SkillDtos.SkillGraphResponse getSkillGraph() {
        List<Skill> skills = skillRepository.findAll();
        if (skills.isEmpty()) {
            seedTaxonomy();
            skills = skillRepository.findAll();
        }

        List<SkillRelationship> relationships = relationshipRepository.findAll();

        List<SkillDtos.SkillGraphNodeDto> nodes = skills.stream()
            .map(s -> new SkillDtos.SkillGraphNodeDto(
                s.getId(),
                s.getName(),
                s.getCategory(),
                s.getDemandLevel() > 80 ? 1 : 2,
                s.getDescription(),
                s.getDemandLevel()
            ))
            .toList();

        List<SkillDtos.SkillGraphEdgeDto> edges = relationships.stream()
            .map(r -> new SkillDtos.SkillGraphEdgeDto(
                r.getSourceSkill().getId(),
                r.getTargetSkill().getId(),
                r.getRelationshipType()
            ))
            .toList();

        return new SkillDtos.SkillGraphResponse(nodes, edges);
    }

    private SkillDtos.SkillResponse toSkillResponse(Skill s) {
        List<String> prereqs = relationshipRepository.findByTargetSkillId(s.getId()).stream()
            .map(r -> r.getSourceSkill().getName())
            .toList();

        List<String> related = relationshipRepository.findBySourceSkillId(s.getId()).stream()
            .map(r -> r.getTargetSkill().getName())
            .toList();

        return new SkillDtos.SkillResponse(
            s.getId(),
            s.getName(),
            s.getCategory(),
            s.getDescription(),
            s.getDemandLevel(),
            prereqs,
            related
        );
    }

    private void seedTaxonomy() {
        Skill java = new Skill("sk-java", "Java", SkillCategory.LANGUAGE, "Core object-oriented language and JVM fundamentals.", 92);
        Skill oop = new Skill("sk-oop", "OOP", SkillCategory.CONCEPT, "Object-oriented programming principles: Encapsulation, Polymorphism, Abstraction, Inheritance.", 88);
        Skill collections = new Skill("sk-collections", "Collections", SkillCategory.FRAMEWORK, "List, Set, Map data structures and algorithms in Java.", 85);
        Skill springBoot = new Skill("sk-spring-boot", "Spring Boot", SkillCategory.FRAMEWORK, "Modern Java backend framework for microservices and REST APIs.", 89);
        Skill restApis = new Skill("sk-rest-apis", "REST APIs", SkillCategory.CONCEPT, "RESTful API design, HTTP verbs, status codes, and JSON serialization.", 90);
        Skill sql = new Skill("sk-sql", "SQL", SkillCategory.LANGUAGE, "Relational queries, indexes, normalization, and ACID transactions.", 91);
        Skill postgresql = new Skill("sk-postgresql", "PostgreSQL", SkillCategory.DATABASE, "Advanced relational database management system.", 84);
        Skill docker = new Skill("sk-docker", "Docker", SkillCategory.TOOL, "Containerization of applications for predictable runtime environments.", 80);
        Skill git = new Skill("sk-git", "Git", SkillCategory.TOOL, "Distributed version control system and repository management.", 95);

        skillRepository.saveAll(List.of(java, oop, collections, springBoot, restApis, sql, postgresql, docker, git));

        relationshipRepository.saveAll(List.of(
            new SkillRelationship("r1", java, oop, "PREREQUISITE"),
            new SkillRelationship("r2", oop, collections, "PREREQUISITE"),
            new SkillRelationship("r3", collections, springBoot, "PREREQUISITE"),
            new SkillRelationship("r4", springBoot, restApis, "REQUIRES"),
            new SkillRelationship("r5", sql, postgresql, "PREREQUISITE")
        ));
    }
}
