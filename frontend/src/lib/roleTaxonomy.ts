import type { SkillCategory } from '@/types'

export interface SkillNode {
  id: string
  label: string
  category: SkillCategory
  x: number
  y: number
  description: string
  prerequisites: string[]
  relatedSkills: string[]
  roleRelevance: string[]
  demandLevel: number
}

export interface SkillEdge {
  source: string
  target: string
  type: 'PREREQUISITE' | 'RELATED' | 'REQUIRES'
}

export type Importance = 'CRITICAL' | 'IMPORTANT' | 'BENEFICIAL'

export interface RoleSkillRequirement {
  name: string
  importance: Importance
  prerequisites: string[]
}

export const PRESET_ROLES = [
  'Java Backend Developer',
  'Frontend Developer',
  'Full Stack Developer',
  'Cloud / DevOps Engineer',
  'AI / Machine Learning Engineer',
  'Data Engineer',
  'Golang / Distributed Systems Engineer',
  'Cybersecurity Engineer',
  'Software Engineer',
  'Spring Boot Developer',
  'Mobile Developer (Android/Flutter)',
]

// ---------------------------------------------------------------------------
// Universal Dynamic Role DAG Synthesizer
// ---------------------------------------------------------------------------

export function synthesizeRoleGraph(role: string): { nodes: SkillNode[]; edges: SkillEdge[] } {
  const clean = (role || 'Software Engineer').trim()
  const lower = clean.toLowerCase()

  // 1. Java Backend Developer
  if (lower.includes('java') && (lower.includes('backend') || lower.includes('developer') || lower.includes('engineer'))) {
    return {
      nodes: [
        { id: 'java', label: 'Java', category: 'LANGUAGE', x: 120, y: 300, description: 'Core Java: syntax, OOP, Collections, JVM memory model, and concurrency.', prerequisites: [], relatedSkills: ['OOP', 'Collections', 'JDBC', 'Testing'], roleRelevance: [clean], demandLevel: 94 },
        { id: 'git', label: 'Git', category: 'TOOL', x: 120, y: 150, description: 'Distributed version control, branch workflows, and commit hygiene.', prerequisites: [], relatedSkills: ['Testing'], roleRelevance: [clean], demandLevel: 90 },
        { id: 'sql', label: 'SQL', category: 'DATABASE', x: 120, y: 460, description: 'Relational data modeling, ACID transactions, complex JOINs, and query indexing.', prerequisites: [], relatedSkills: ['JDBC', 'PostgreSQL'], roleRelevance: [clean], demandLevel: 92 },
        { id: 'oop', label: 'OOP & Clean Architecture', category: 'CONCEPT', x: 280, y: 220, description: 'Object-oriented programming principles and SOLID design patterns.', prerequisites: ['java'], relatedSkills: ['Spring Framework'], roleRelevance: [clean], demandLevel: 88 },
        { id: 'collections', label: 'Collections Framework', category: 'CONCEPT', x: 280, y: 330, description: 'List, Set, Map performance characteristics and memory footprints.', prerequisites: ['java'], relatedSkills: ['JDBC'], roleRelevance: [clean], demandLevel: 85 },
        { id: 'jdbc', label: 'JDBC', category: 'CONCEPT', x: 310, y: 470, description: 'Database connectivity and transactional execution pipelines.', prerequisites: ['java', 'sql'], relatedSkills: ['Hibernate'], roleRelevance: [clean], demandLevel: 80 },
        { id: 'testing', label: 'JUnit 5 & Mockito', category: 'TOOL', x: 320, y: 120, description: 'Automated unit and integration testing frameworks for microservices.', prerequisites: ['java'], relatedSkills: ['Spring Boot'], roleRelevance: [clean], demandLevel: 85 },
        { id: 'spring-framework', label: 'Spring Core & DI', category: 'FRAMEWORK', x: 480, y: 260, description: 'Dependency Injection (DI), IoC container, and Spring AOP.', prerequisites: ['oop'], relatedSkills: ['Spring Boot'], roleRelevance: [clean], demandLevel: 92 },
        { id: 'hibernate', label: 'Hibernate / JPA', category: 'FRAMEWORK', x: 480, y: 420, description: 'Object-Relational Mapping (ORM) and Java Persistence API.', prerequisites: ['jdbc', 'sql'], relatedSkills: ['PostgreSQL'], roleRelevance: [clean], demandLevel: 89 },
        { id: 'postgresql', label: 'PostgreSQL', category: 'DATABASE', x: 480, y: 530, description: 'Production relational database, JSONB, and connection pooling.', prerequisites: ['sql'], relatedSkills: ['Hibernate'], roleRelevance: [clean], demandLevel: 88 },
        { id: 'spring-boot', label: 'Spring Boot 3', category: 'FRAMEWORK', x: 650, y: 290, description: 'Convention-over-configuration microservices platform and embedded servers.', prerequisites: ['spring-framework'], relatedSkills: ['REST APIs', 'Spring Security'], roleRelevance: [clean], demandLevel: 96 },
        { id: 'rest-apis', label: 'REST APIs', category: 'CONCEPT', x: 750, y: 180, description: 'Stateless HTTP API endpoints, OpenAPI contracts, and error serialization.', prerequisites: ['spring-boot'], relatedSkills: ['Spring Security'], roleRelevance: [clean], demandLevel: 95 },
        { id: 'spring-security', label: 'Spring Security & JWT', category: 'FRAMEWORK', x: 770, y: 330, description: 'Authentication, authorization, and stateless JWT token verification.', prerequisites: ['spring-boot'], relatedSkills: [], roleRelevance: [clean], demandLevel: 91 },
        { id: 'docker', label: 'Docker Containers', category: 'TOOL', x: 650, y: 480, description: 'Containerized packaging, multi-stage builds, and Compose networking.', prerequisites: ['git'], relatedSkills: ['PostgreSQL'], roleRelevance: [clean], demandLevel: 89 },
        { id: 'redis', label: 'Redis Cache', category: 'DATABASE', x: 830, y: 460, description: 'In-memory distributed key-value cache and rate limiting.', prerequisites: ['spring-boot'], relatedSkills: [], roleRelevance: [clean], demandLevel: 84 },
        { id: 'kafka', label: 'Apache Kafka', category: 'TOOL', x: 830, y: 260, description: 'Distributed event streaming for decoupled microservices.', prerequisites: ['spring-boot'], relatedSkills: [], roleRelevance: [clean], demandLevel: 86 }
      ],
      edges: [
        { source: 'java', target: 'oop', type: 'PREREQUISITE' },
        { source: 'java', target: 'collections', type: 'PREREQUISITE' },
        { source: 'java', target: 'testing', type: 'PREREQUISITE' },
        { source: 'java', target: 'jdbc', type: 'REQUIRES' },
        { source: 'sql', target: 'jdbc', type: 'PREREQUISITE' },
        { source: 'oop', target: 'spring-framework', type: 'PREREQUISITE' },
        { source: 'jdbc', target: 'hibernate', type: 'PREREQUISITE' },
        { source: 'sql', target: 'postgresql', type: 'PREREQUISITE' },
        { source: 'spring-framework', target: 'spring-boot', type: 'PREREQUISITE' },
        { source: 'spring-boot', target: 'rest-apis', type: 'PREREQUISITE' },
        { source: 'spring-boot', target: 'spring-security', type: 'PREREQUISITE' },
        { source: 'spring-boot', target: 'hibernate', type: 'RELATED' },
        { source: 'spring-boot', target: 'docker', type: 'RELATED' },
        { source: 'spring-boot', target: 'redis', type: 'RELATED' },
        { source: 'spring-boot', target: 'kafka', type: 'RELATED' },
        { source: 'git', target: 'testing', type: 'RELATED' }
      ]
    }
  }

  // 2. Data Engineer / Analytics / Big Data
  if (lower.includes('data') && (lower.includes('engineer') || lower.includes('etl') || lower.includes('analytics') || lower.includes('big data') || lower.includes('platform'))) {
    return {
      nodes: [
        { id: 'python', label: 'Python Core', category: 'LANGUAGE', x: 120, y: 250, description: 'Core Python for data transformation, scripting, and pipeline orchestration.', prerequisites: [], relatedSkills: ['SQL', 'Spark'], roleRelevance: [clean], demandLevel: 96 },
        { id: 'sql', label: 'Advanced SQL', category: 'DATABASE', x: 120, y: 420, description: 'Window functions, CTEs, query optimization, indexing, and transactional partitioning.', prerequisites: [], relatedSkills: ['Data Warehousing'], roleRelevance: [clean], demandLevel: 98 },
        { id: 'git', label: 'Git & Version Control', category: 'TOOL', x: 120, y: 120, description: 'Version control for transformation pipelines and data pipelines as code.', prerequisites: [], relatedSkills: [], roleRelevance: [clean], demandLevel: 88 },
        { id: 'spark', label: 'Apache Spark / PySpark', category: 'FRAMEWORK', x: 300, y: 230, description: 'Distributed data processing, RDDs, DataFrames, cluster memory management, and ETL.', prerequisites: ['python', 'sql'], relatedSkills: ['Kafka', 'Airflow'], roleRelevance: [clean], demandLevel: 94 },
        { id: 'kafka', label: 'Apache Kafka', category: 'TOOL', x: 300, y: 390, description: 'Real-time event streaming, topic partitioning, producers/consumers, and stream processing.', prerequisites: [], relatedSkills: ['Spark'], roleRelevance: [clean], demandLevel: 92 },
        { id: 'airflow', label: 'Apache Airflow', category: 'TOOL', x: 490, y: 220, description: 'DAG workflow scheduling, sensor monitoring, task dependencies, and pipeline retries.', prerequisites: ['python'], relatedSkills: ['Spark'], roleRelevance: [clean], demandLevel: 90 },
        { id: 'warehouse', label: 'Snowflake / BigQuery', category: 'DATABASE', x: 490, y: 400, description: 'Cloud data warehousing, columnar storage, MPP architecture, and star schema modeling.', prerequisites: ['sql'], relatedSkills: ['dbt'], roleRelevance: [clean], demandLevel: 93 },
        { id: 'dbt', label: 'dbt (Data Build Tool)', category: 'FRAMEWORK', x: 670, y: 260, description: 'Modular SQL transformations, data lineage, automated testing, and CI/CD for analytics.', prerequisites: ['warehouse', 'git'], relatedSkills: [], roleRelevance: [clean], demandLevel: 89 },
        { id: 'docker', label: 'Docker & Containers', category: 'TOOL', x: 670, y: 420, description: 'Containerizing ETL workers, Airflow tasks, and pipeline environments.', prerequisites: ['git'], relatedSkills: ['Cloud Data Platforms'], roleRelevance: [clean], demandLevel: 88 },
        { id: 'cloud-data', label: 'Cloud Data (AWS/GCP)', category: 'PLATFORM', x: 830, y: 340, description: 'AWS S3/EMR/Glue or GCP BigQuery/Dataflow scalable managed data pipelines.', prerequisites: ['docker', 'warehouse'], relatedSkills: [], roleRelevance: [clean], demandLevel: 95 }
      ],
      edges: [
        { source: 'python', target: 'spark', type: 'PREREQUISITE' },
        { source: 'sql', target: 'spark', type: 'PREREQUISITE' },
        { source: 'sql', target: 'warehouse', type: 'PREREQUISITE' },
        { source: 'spark', target: 'airflow', type: 'RELATED' },
        { source: 'kafka', target: 'warehouse', type: 'RELATED' },
        { source: 'warehouse', target: 'dbt', type: 'PREREQUISITE' },
        { source: 'git', target: 'dbt', type: 'RELATED' },
        { source: 'git', target: 'docker', type: 'RELATED' },
        { source: 'docker', target: 'cloud-data', type: 'PREREQUISITE' },
        { source: 'warehouse', target: 'cloud-data', type: 'PREREQUISITE' }
      ]
    }
  }

  // 3. Golang / Go Developer
  if (lower.includes('go') || lower.includes('golang')) {
    return {
      nodes: [
        { id: 'go', label: 'Go (Golang)', category: 'LANGUAGE', x: 120, y: 280, description: 'Idiomatic Go programming: pointers, structs, interfaces, garbage collection, and toolchain.', prerequisites: [], relatedSkills: ['Concurrency', 'gRPC'], roleRelevance: [clean], demandLevel: 95 },
        { id: 'git', label: 'Git & Versioning', category: 'TOOL', x: 120, y: 140, description: 'Version control, go modules management, and PR review workflows.', prerequisites: [], relatedSkills: [], roleRelevance: [clean], demandLevel: 90 },
        { id: 'sql', label: 'Relational SQL', category: 'DATABASE', x: 120, y: 440, description: 'Database schema modeling, SQL query optimization, and transactions.', prerequisites: [], relatedSkills: ['PostgreSQL'], roleRelevance: [clean], demandLevel: 91 },
        { id: 'concurrency', label: 'Goroutines & Channels', category: 'CONCEPT', x: 290, y: 240, description: 'CSP concurrency model, worker pools, select statement, mutexes, and race condition detection.', prerequisites: ['go'], relatedSkills: ['Microservices'], roleRelevance: [clean], demandLevel: 96 },
        { id: 'postgresql', label: 'PostgreSQL & GORM', category: 'DATABASE', x: 290, y: 420, description: 'Relational database persistence, database migrations, connection pooling (pgx), and ACID.', prerequisites: ['sql', 'go'], relatedSkills: ['Microservices'], roleRelevance: [clean], demandLevel: 89 },
        { id: 'grpc', label: 'REST & gRPC Microservices', category: 'CONCEPT', x: 480, y: 240, description: 'Protocol Buffers, HTTP/2 streaming, low-latency inter-service RPCs, and OpenAPI docs.', prerequisites: ['concurrency'], relatedSkills: ['Docker'], roleRelevance: [clean], demandLevel: 93 },
        { id: 'redis', label: 'Redis In-Memory Cache', category: 'DATABASE', x: 480, y: 410, description: 'High-speed caching, distributed rate-limiting, and session management in Go.', prerequisites: ['go'], relatedSkills: ['grpc'], roleRelevance: [clean], demandLevel: 86 },
        { id: 'docker', label: 'Docker Multi-stage Builds', category: 'TOOL', x: 670, y: 280, description: 'Compiling lightweight scratch/alpine Go container images under 20MB.', prerequisites: ['go', 'git'], relatedSkills: ['Kubernetes'], roleRelevance: [clean], demandLevel: 92 },
        { id: 'kafka', label: 'Kafka Event Streaming', category: 'TOOL', x: 670, y: 440, description: 'Asynchronous event streaming and message queuing between decoupled Go services.', prerequisites: ['concurrency'], relatedSkills: ['Docker'], roleRelevance: [clean], demandLevel: 88 },
        { id: 'kubernetes', label: 'Kubernetes & Cloud Deploy', category: 'PLATFORM', x: 830, y: 350, description: 'Deploying high-concurrency Go microservices with health probes and autoscaling.', prerequisites: ['docker'], relatedSkills: [], roleRelevance: [clean], demandLevel: 94 }
      ],
      edges: [
        { source: 'go', target: 'concurrency', type: 'PREREQUISITE' },
        { source: 'go', target: 'postgresql', type: 'PREREQUISITE' },
        { source: 'sql', target: 'postgresql', type: 'PREREQUISITE' },
        { source: 'concurrency', target: 'grpc', type: 'PREREQUISITE' },
        { source: 'postgresql', target: 'grpc', type: 'RELATED' },
        { source: 'go', target: 'redis', type: 'RELATED' },
        { source: 'grpc', target: 'docker', type: 'PREREQUISITE' },
        { source: 'concurrency', target: 'kafka', type: 'RELATED' },
        { source: 'docker', target: 'kubernetes', type: 'PREREQUISITE' }
      ]
    }
  }

  // 4. Cybersecurity / Security Engineer
  if (lower.includes('security') || lower.includes('cyber') || lower.includes('infosec')) {
    return {
      nodes: [
        { id: 'linux', label: 'Linux Systems & Shell', category: 'CONCEPT', x: 120, y: 260, description: 'Operating system internals, user permissions, audit logs, and bash shell scripting.', prerequisites: [], relatedSkills: ['Networking'], roleRelevance: [clean], demandLevel: 94 },
        { id: 'networking', label: 'Networking & TCP/IP', category: 'CONCEPT', x: 120, y: 420, description: 'OSI layers, packet analysis with Wireshark, routing, DNS, and TLS handshakes.', prerequisites: [], relatedSkills: ['Network Security'], roleRelevance: [clean], demandLevel: 96 },
        { id: 'git', label: 'Git & Code Review', category: 'TOOL', x: 120, y: 130, description: 'Secure code review, signed commits, and dependency vulnerability scanning.', prerequisites: [], relatedSkills: [], roleRelevance: [clean], demandLevel: 88 },
        { id: 'python-sec', label: 'Python Security Scripting', category: 'LANGUAGE', x: 290, y: 230, description: 'Automating security scanners, log parsing, payload crafting, and API auditing.', prerequisites: ['linux'], relatedSkills: ['OWASP'], roleRelevance: [clean], demandLevel: 92 },
        { id: 'crypto', label: 'Cryptography & PKI', category: 'CONCEPT', x: 290, y: 390, description: 'Asymmetric encryption (RSA/ECC), hashing (SHA-256), digital certificates, and HMAC.', prerequisites: ['networking'], relatedSkills: ['App Security'], roleRelevance: [clean], demandLevel: 90 },
        { id: 'owasp', label: 'OWASP Top 10 & Web Sec', category: 'CONCEPT', x: 480, y: 240, description: 'Remediating SQLi, XSS, CSRF, SSRF, broken access control, and API vulnerabilities.', prerequisites: ['python-sec'], relatedSkills: ['Pen Testing'], roleRelevance: [clean], demandLevel: 98 },
        { id: 'siem', label: 'SIEM & Threat Monitoring', category: 'TOOL', x: 480, y: 410, description: 'Splunk, Elastic Security, intrusion detection (Snort), and incident triage.', prerequisites: ['linux', 'networking'], relatedSkills: ['Cloud Security'], roleRelevance: [clean], demandLevel: 91 },
        { id: 'iam', label: 'IAM & Zero Trust Auth', category: 'CONCEPT', x: 670, y: 270, description: 'OAuth 2.0, OpenID Connect, SAML, RBAC, least privilege, and multi-factor auth.', prerequisites: ['crypto', 'owasp'], relatedSkills: ['Cloud Security'], roleRelevance: [clean], demandLevel: 93 },
        { id: 'cloud-sec', label: 'Cloud Security (AWS/Azure)', category: 'PLATFORM', x: 830, y: 340, description: 'Securing cloud VPCs, AWS GuardDuty, Security Groups, and container runtime defense.', prerequisites: ['iam', 'siem'], relatedSkills: [], roleRelevance: [clean], demandLevel: 95 }
      ],
      edges: [
        { source: 'linux', target: 'python-sec', type: 'PREREQUISITE' },
        { source: 'networking', target: 'crypto', type: 'PREREQUISITE' },
        { source: 'python-sec', target: 'owasp', type: 'PREREQUISITE' },
        { source: 'crypto', target: 'owasp', type: 'RELATED' },
        { source: 'linux', target: 'siem', type: 'PREREQUISITE' },
        { source: 'crypto', target: 'iam', type: 'PREREQUISITE' },
        { source: 'owasp', target: 'iam', type: 'RELATED' },
        { source: 'siem', target: 'cloud-sec', type: 'PREREQUISITE' },
        { source: 'iam', target: 'cloud-sec', type: 'PREREQUISITE' }
      ]
    }
  }

  // 5. Frontend / React
  if (lower.includes('frontend') || lower.includes('react') || lower.includes('ui developer')) {
    return {
      nodes: [
        { id: 'html-css', label: 'HTML5 & CSS3', category: 'CONCEPT', x: 120, y: 200, description: 'Semantic markup, modern layout models (Flexbox, CSS Grid), responsive design, and accessibility.', prerequisites: [], relatedSkills: ['Tailwind CSS', 'JavaScript'], roleRelevance: [clean], demandLevel: 92 },
        { id: 'javascript', label: 'JavaScript ES6+', category: 'LANGUAGE', x: 120, y: 350, description: 'Modern JavaScript: closures, asynchronous event loop, Promises, async/await, and DOM APIs.', prerequisites: [], relatedSkills: ['TypeScript', 'React'], roleRelevance: [clean], demandLevel: 96 },
        { id: 'git', label: 'Git & GitHub', category: 'TOOL', x: 120, y: 500, description: 'Branch management, feature branches, pull requests, and merge conflict resolution.', prerequisites: [], relatedSkills: ['CI/CD'], roleRelevance: [clean], demandLevel: 89 },
        { id: 'typescript', label: 'TypeScript', category: 'LANGUAGE', x: 290, y: 280, description: 'Static type checking, interfaces, generics, utility types, and strict type safety.', prerequisites: ['javascript'], relatedSkills: ['React', 'Next.js'], roleRelevance: [clean], demandLevel: 94 },
        { id: 'tailwind', label: 'Tailwind CSS', category: 'FRAMEWORK', x: 290, y: 150, description: 'Utility-first modern CSS framework, responsive design tokens, and dark-mode styling systems.', prerequisites: ['html-css'], relatedSkills: ['React'], roleRelevance: [clean], demandLevel: 90 },
        { id: 'dom-apis', label: 'Browser APIs & Fetch', category: 'CONCEPT', x: 290, y: 430, description: 'HTTP requests, REST endpoints, WebSockets, LocalStorage, and browser security contexts (CORS).', prerequisites: ['javascript'], relatedSkills: ['REST APIs'], roleRelevance: [clean], demandLevel: 86 },
        { id: 'react', label: 'React 18', category: 'FRAMEWORK', x: 480, y: 290, description: 'Component architecture, Hooks (useState, useEffect, useMemo), Virtual DOM, and Concurrent mode.', prerequisites: ['javascript', 'typescript'], relatedSkills: ['Next.js', 'State Management'], roleRelevance: [clean], demandLevel: 97 },
        { id: 'rest-apis', label: 'REST & GraphQL APIs', category: 'CONCEPT', x: 480, y: 150, description: 'Consuming backend API contracts, TanStack React Query, data fetching caching, and mutation state.', prerequisites: ['dom-apis'], relatedSkills: ['React'], roleRelevance: [clean], demandLevel: 92 },
        { id: 'testing', label: 'Vitest / React Testing', category: 'TOOL', x: 480, y: 450, description: 'Component testing, DOM rendering assertions, user event simulations, and test coverage.', prerequisites: ['react'], relatedSkills: ['React'], roleRelevance: [clean], demandLevel: 82 },
        { id: 'state-management', label: 'Zustand / Redux', category: 'FRAMEWORK', x: 670, y: 220, description: 'Global client-side application state, persistent stores, unidirectional data flow, and selectors.', prerequisites: ['react'], relatedSkills: ['Next.js'], roleRelevance: [clean], demandLevel: 88 },
        { id: 'nextjs', label: 'Next.js & App Router', category: 'FRAMEWORK', x: 670, y: 360, description: 'React Server Components (RSC), SSR, Static Site Generation (SSG), and Edge API routes.', prerequisites: ['react', 'typescript'], relatedSkills: ['Performance'], roleRelevance: [clean], demandLevel: 93 },
        { id: 'performance', label: 'Core Web Vitals', category: 'CONCEPT', x: 670, y: 490, description: 'LCP, FID, CLS metrics optimization, code-splitting, lazy loading, and modern bundle optimization.', prerequisites: ['react'], relatedSkills: ['Next.js'], roleRelevance: [clean], demandLevel: 85 },
        { id: 'ci-cd', label: 'Vercel / GitHub Actions', category: 'TOOL', x: 830, y: 330, description: 'Automated preview deployments, pull request validation checks, and production CI/CD.', prerequisites: ['git'], relatedSkills: ['Next.js'], roleRelevance: [clean], demandLevel: 87 }
      ],
      edges: [
        { source: 'html-css', target: 'tailwind', type: 'PREREQUISITE' },
        { source: 'javascript', target: 'typescript', type: 'PREREQUISITE' },
        { source: 'javascript', target: 'dom-apis', type: 'PREREQUISITE' },
        { source: 'typescript', target: 'react', type: 'PREREQUISITE' },
        { source: 'tailwind', target: 'react', type: 'RELATED' },
        { source: 'dom-apis', target: 'rest-apis', type: 'PREREQUISITE' },
        { source: 'react', target: 'rest-apis', type: 'RELATED' },
        { source: 'react', target: 'state-management', type: 'PREREQUISITE' },
        { source: 'react', target: 'nextjs', type: 'PREREQUISITE' },
        { source: 'react', target: 'testing', type: 'PREREQUISITE' },
        { source: 'nextjs', target: 'performance', type: 'RELATED' },
        { source: 'git', target: 'ci-cd', type: 'PREREQUISITE' },
        { source: 'nextjs', target: 'ci-cd', type: 'RELATED' }
      ]
    }
  }

  // 6. Universal Novel Role Synthesizer
  // Generates a 5-layer interconnected DAG dynamically for ANY custom role name!
  return {
    nodes: [
      { id: 'core-foundation', label: `${clean} Foundations`, category: 'LANGUAGE', x: 120, y: 260, description: `Core programming fundamentals, syntax, and standards essential for ${clean}.`, prerequisites: [], relatedSkills: ['Data Modeling', 'Architecture'], roleRelevance: [clean], demandLevel: 95 },
      { id: 'git', label: 'Git & Version Control', category: 'TOOL', x: 120, y: 420, description: 'Collaborative development, branch workflows, and version management.', prerequisites: [], relatedSkills: ['Testing'], roleRelevance: [clean], demandLevel: 90 },
      { id: 'data-modeling', label: 'Data Modeling & Storage', category: 'DATABASE', x: 290, y: 230, description: `Relational and persistent data modeling required for modern ${clean} solutions.`, prerequisites: ['core-foundation'], relatedSkills: ['Architecture'], roleRelevance: [clean], demandLevel: 91 },
      { id: 'core-concepts', label: 'Core Domain Paradigms', category: 'CONCEPT', x: 290, y: 400, description: `Key domain design patterns, abstraction principles, and structural models for ${clean}.`, prerequisites: ['core-foundation'], relatedSkills: ['Architecture'], roleRelevance: [clean], demandLevel: 89 },
      { id: 'framework-layer', label: `${clean} Frameworks`, category: 'FRAMEWORK', x: 480, y: 250, description: `Production ecosystem frameworks and libraries standard across industry ${clean} teams.`, prerequisites: ['data-modeling', 'core-concepts'], relatedSkills: ['Architecture'], roleRelevance: [clean], demandLevel: 94 },
      { id: 'testing-layer', label: 'Automated Testing Suites', category: 'TOOL', x: 480, y: 420, description: `Unit, regression, and integration testing frameworks ensuring reliability in ${clean}.`, prerequisites: ['core-foundation', 'git'], relatedSkills: ['CI/CD'], roleRelevance: [clean], demandLevel: 87 },
      { id: 'architecture', label: 'System Architecture & APIs', category: 'CONCEPT', x: 670, y: 270, description: `Scalable service design, contract definition, latency reduction, and security for ${clean}.`, prerequisites: ['framework-layer'], relatedSkills: ['Cloud Deployment'], roleRelevance: [clean], demandLevel: 96 },
      { id: 'cloud-deploy', label: 'Cloud Deployment & CI/CD', category: 'PLATFORM', x: 830, y: 340, description: `Containerized deployment, automated build verification, and cloud hosting for ${clean}.`, prerequisites: ['architecture', 'testing-layer'], relatedSkills: [], roleRelevance: [clean], demandLevel: 92 }
    ],
    edges: [
      { source: 'core-foundation', target: 'data-modeling', type: 'PREREQUISITE' },
      { source: 'core-foundation', target: 'core-concepts', type: 'PREREQUISITE' },
      { source: 'data-modeling', target: 'framework-layer', type: 'PREREQUISITE' },
      { source: 'core-concepts', target: 'framework-layer', type: 'PREREQUISITE' },
      { source: 'git', target: 'testing-layer', type: 'PREREQUISITE' },
      { source: 'framework-layer', target: 'architecture', type: 'PREREQUISITE' },
      { source: 'testing-layer', target: 'cloud-deploy', type: 'PREREQUISITE' },
      { source: 'architecture', target: 'cloud-deploy', type: 'PREREQUISITE' }
    ]
  }
}

// ---------------------------------------------------------------------------
// Universal Dynamic Role Requirements Synthesizer (For Skill Gap Analysis)
// ---------------------------------------------------------------------------

export function synthesizeRoleRequirements(role: string): RoleSkillRequirement[] {
  const clean = (role || 'Software Engineer').trim()
  const lower = clean.toLowerCase()

  if (lower.includes('data') && (lower.includes('engineer') || lower.includes('etl') || lower.includes('analytics') || lower.includes('big data'))) {
    return [
      { name: 'Python', importance: 'CRITICAL', prerequisites: [] },
      { name: 'SQL', importance: 'CRITICAL', prerequisites: [] },
      { name: 'Apache Spark / PySpark', importance: 'CRITICAL', prerequisites: ['Python', 'SQL'] },
      { name: 'Apache Kafka', importance: 'CRITICAL', prerequisites: [] },
      { name: 'Airflow', importance: 'IMPORTANT', prerequisites: ['Python'] },
      { name: 'Snowflake / BigQuery', importance: 'IMPORTANT', prerequisites: ['SQL'] },
      { name: 'Docker', importance: 'IMPORTANT', prerequisites: [] },
      { name: 'Git', importance: 'IMPORTANT', prerequisites: [] }
    ]
  }

  if (lower.includes('go') || lower.includes('golang')) {
    return [
      { name: 'Go (Golang)', importance: 'CRITICAL', prerequisites: [] },
      { name: 'Goroutines & Concurrency', importance: 'CRITICAL', prerequisites: ['Go (Golang)'] },
      { name: 'REST & gRPC APIs', importance: 'CRITICAL', prerequisites: ['Go (Golang)'] },
      { name: 'SQL & PostgreSQL', importance: 'CRITICAL', prerequisites: [] },
      { name: 'Docker', importance: 'IMPORTANT', prerequisites: [] },
      { name: 'Kubernetes', importance: 'IMPORTANT', prerequisites: ['Docker'] },
      { name: 'Git', importance: 'IMPORTANT', prerequisites: [] }
    ]
  }

  if (lower.includes('security') || lower.includes('cyber')) {
    return [
      { name: 'Linux Systems', importance: 'CRITICAL', prerequisites: [] },
      { name: 'Python Scripting', importance: 'CRITICAL', prerequisites: [] },
      { name: 'Networking & TCP/IP', importance: 'CRITICAL', prerequisites: [] },
      { name: 'OWASP Top 10', importance: 'CRITICAL', prerequisites: [] },
      { name: 'Cryptography & PKI', importance: 'IMPORTANT', prerequisites: [] },
      { name: 'Cloud Security (AWS)', importance: 'IMPORTANT', prerequisites: [] },
      { name: 'Git', importance: 'IMPORTANT', prerequisites: [] }
    ]
  }

  if (lower.includes('frontend') || lower.includes('react')) {
    return [
      { name: 'React', importance: 'CRITICAL', prerequisites: ['JavaScript'] },
      { name: 'TypeScript', importance: 'CRITICAL', prerequisites: ['JavaScript'] },
      { name: 'JavaScript', importance: 'CRITICAL', prerequisites: [] },
      { name: 'HTML5 & CSS3', importance: 'CRITICAL', prerequisites: [] },
      { name: 'Tailwind CSS', importance: 'IMPORTANT', prerequisites: ['HTML5 & CSS3'] },
      { name: 'REST APIs', importance: 'CRITICAL', prerequisites: [] },
      { name: 'Next.js', importance: 'IMPORTANT', prerequisites: ['React'] },
      { name: 'Git', importance: 'IMPORTANT', prerequisites: [] }
    ]
  }

  if (lower.includes('java')) {
    return [
      { name: 'Java', importance: 'CRITICAL', prerequisites: [] },
      { name: 'Spring Boot', importance: 'CRITICAL', prerequisites: ['Java'] },
      { name: 'REST APIs', importance: 'CRITICAL', prerequisites: [] },
      { name: 'SQL', importance: 'CRITICAL', prerequisites: [] },
      { name: 'PostgreSQL', importance: 'IMPORTANT', prerequisites: ['SQL'] },
      { name: 'Spring Security', importance: 'CRITICAL', prerequisites: ['Spring Boot'] },
      { name: 'Git', importance: 'IMPORTANT', prerequisites: [] },
      { name: 'Docker', importance: 'IMPORTANT', prerequisites: [] }
    ]
  }

  // Universal custom fallback
  return [
    { name: `${clean} Core Fundamentals`, importance: 'CRITICAL', prerequisites: [] },
    { name: 'System Architecture & Design', importance: 'CRITICAL', prerequisites: [] },
    { name: 'Data Modeling & Relational Storage', importance: 'CRITICAL', prerequisites: [] },
    { name: 'API & Inter-Service Communication', importance: 'IMPORTANT', prerequisites: [] },
    { name: 'Automated Unit & Integration Testing', importance: 'IMPORTANT', prerequisites: [] },
    { name: 'Git & Version Control', importance: 'IMPORTANT', prerequisites: [] },
    { name: 'Containerization & Cloud Infrastructure', importance: 'IMPORTANT', prerequisites: [] }
  ]
}
