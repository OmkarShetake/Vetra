-- ============================================================================
-- VETRA - Flyway Migration V2: Seed Taxonomy, Roles, and Prerequisites
-- ============================================================================

-- Core Skills
INSERT INTO skills (id, name, category, description, demand_level) VALUES
('sk-java', 'Java', 'LANGUAGE', 'Object-oriented programming language, JVM ecosystem, memory management, garbage collection.', 92),
('sk-oop', 'OOP', 'CONCEPT', 'Core principles: Encapsulation, Abstraction, Inheritance, Polymorphism.', 88),
('sk-collections', 'Collections', 'FRAMEWORK', 'Java Collections Framework: List, Set, Map, Queue, algorithms and time complexity.', 85),
('sk-multithreading', 'Multithreading', 'CONCEPT', 'Concurrency, synchronization, thread lifecycle, executors, and thread safety.', 78),
('sk-jdbc', 'JDBC', 'FRAMEWORK', 'Java Database Connectivity API for relational databases.', 74),
('sk-spring-boot', 'Spring Boot', 'FRAMEWORK', 'Opinionated framework for building microservices, auto-configuration, dependency injection.', 89),
('sk-rest-apis', 'REST APIs', 'CONCEPT', 'Representational State Transfer principles, HTTP status codes, stateless API design.', 90),
('sk-spring-security', 'Spring Security', 'FRAMEWORK', 'Authentication, authorization, JWT tokens, OAuth2, and defense against OWASP vulnerabilities.', 82),
('sk-postgresql', 'PostgreSQL', 'DATABASE', 'Advanced open-source relational database, complex queries, transactions, indexes, JSONB.', 84),
('sk-sql', 'SQL', 'LANGUAGE', 'Structured Query Language: SELECT, JOINs, subqueries, aggregation, normalization.', 91),
('sk-redis', 'Redis', 'DATABASE', 'In-memory data structure store, caching, session management, Pub/Sub.', 76),
('sk-docker', 'Docker', 'TOOL', 'Containerization, Dockerfile, multi-stage builds, container networking and volumes.', 80),
('sk-git', 'Git', 'TOOL', 'Distributed version control, branching workflows, rebasing, pull requests.', 95),
('sk-testing', 'Testing', 'CONCEPT', 'Unit testing, integration testing, JUnit 5, Mockito, test coverage.', 83),
('sk-kafka', 'Kafka', 'TOOL', 'Distributed event streaming platform, consumer groups, topics, partitions.', 72),
('sk-microservices', 'Microservices', 'CONCEPT', 'Distributed architecture, service discovery, API gateways, fault tolerance.', 75)
ON CONFLICT (name) DO NOTHING;

-- Skill Relationships (Prerequisites & Dependencies)
INSERT INTO skill_relationships (id, source_skill_id, target_skill_id, relationship_type) VALUES
('rel-1', 'sk-java', 'sk-oop', 'PREREQUISITE'),
('rel-2', 'sk-oop', 'sk-collections', 'PREREQUISITE'),
('rel-3', 'sk-collections', 'sk-multithreading', 'RELATED'),
('rel-4', 'sk-collections', 'sk-jdbc', 'PREREQUISITE'),
('rel-5', 'sk-jdbc', 'sk-spring-boot', 'PREREQUISITE'),
('rel-6', 'sk-spring-boot', 'sk-rest-apis', 'REQUIRES'),
('rel-7', 'sk-spring-boot', 'sk-spring-security', 'REQUIRES'),
('rel-8', 'sk-sql', 'sk-postgresql', 'PREREQUISITE'),
('rel-9', 'sk-postgresql', 'sk-jdbc', 'RELATED'),
('rel-10', 'sk-spring-boot', 'sk-microservices', 'PREREQUISITE'),
('rel-11', 'sk-docker', 'sk-microservices', 'PREREQUISITE'),
('rel-12', 'sk-testing', 'sk-spring-boot', 'RELATED')
ON CONFLICT DO NOTHING;

-- Role Profiles
INSERT INTO role_profiles (id, title, description, experience_level) VALUES
('role-java-backend', 'Java Backend Developer', 'Develops robust backend services, RESTful APIs, and data access layers using Java and Spring Boot.', 'Entry-Level'),
('role-se', 'Software Engineer', 'General software engineering role covering core data structures, algorithms, databases, and version control.', 'Entry-Level'),
('role-spring-boot', 'Spring Boot Developer', 'Specialized backend engineer building microservices, REST APIs, and database integrations with Spring Boot.', 'Entry-Level')
ON CONFLICT (title) DO NOTHING;

-- Role Profile Skills (Target Requirements)
INSERT INTO role_profile_skills (role_id, skill_id, importance) VALUES
('role-java-backend', 'sk-java', 'REQUIRED'),
('role-java-backend', 'sk-oop', 'REQUIRED'),
('role-java-backend', 'sk-sql', 'REQUIRED'),
('role-java-backend', 'sk-spring-boot', 'REQUIRED'),
('role-java-backend', 'sk-rest-apis', 'REQUIRED'),
('role-java-backend', 'sk-postgresql', 'REQUIRED'),
('role-java-backend', 'sk-git', 'REQUIRED'),
('role-java-backend', 'sk-docker', 'PREFERRED'),
('role-java-backend', 'sk-spring-security', 'PREFERRED'),
('role-java-backend', 'sk-testing', 'REQUIRED'),
('role-java-backend', 'sk-redis', 'BENEFICIAL'),
('role-java-backend', 'sk-microservices', 'BENEFICIAL')
ON CONFLICT DO NOTHING;
