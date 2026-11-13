import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import {
  Network,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize,
  X,
  Lightbulb,
  Link2,
  TrendingUp,
  Layers,
  MousePointerClick,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Briefcase,
  Layers2,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn, formatPercent } from '@/lib/utils'
import type { SkillCategory } from '@/types'

// ---------------------------------------------------------------------------
// Types & Taxonomy definitions
// ---------------------------------------------------------------------------

interface SkillNode {
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

interface SkillEdge {
  source: string
  target: string
  type: 'PREREQUISITE' | 'RELATED' | 'REQUIRES'
}

export const AVAILABLE_ROLES = [
  'Java Backend Developer',
  'Frontend Developer',
  'Full Stack Developer',
  'Cloud / DevOps Engineer',
  'AI / Machine Learning Engineer',
  'Software Engineer',
  'Spring Boot Developer',
  'Mobile Developer (Android/Flutter)',
] as const

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  LANGUAGE: '#2563EB', // indigo
  FRAMEWORK: '#0284C7', // violet
  DATABASE: '#0F9D8A', // teal
  TOOL: '#E9A23B', // amber
  CONCEPT: '#3296D8', // sky
  PLATFORM: '#0284C7',
  SOFT_SKILL: '#667085',
}

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  LANGUAGE: 'Language',
  FRAMEWORK: 'Framework',
  DATABASE: 'Database',
  TOOL: 'Tool',
  CONCEPT: 'Concept',
  PLATFORM: 'Platform',
  SOFT_SKILL: 'Soft Skill',
}

const LEGEND_ITEMS: { category: SkillCategory; label: string }[] = [
  { category: 'LANGUAGE', label: 'Language' },
  { category: 'FRAMEWORK', label: 'Framework' },
  { category: 'DATABASE', label: 'Database' },
  { category: 'TOOL', label: 'Tool' },
  { category: 'CONCEPT', label: 'Concept' },
]

// ---------------------------------------------------------------------------
// Role-Specific DAG Graphs (Tailored to candidate roles)
// ---------------------------------------------------------------------------

const ROLE_GRAPHS: Record<string, { nodes: SkillNode[]; edges: SkillEdge[] }> = {
  'Java Backend Developer': {
    nodes: [
      {
        id: 'java',
        label: 'Java',
        category: 'LANGUAGE',
        x: 120,
        y: 300,
        description: 'Core Java programming language: syntax, OOP, Collections, JVM memory model, and concurrency.',
        prerequisites: [],
        relatedSkills: ['OOP', 'Collections', 'JDBC', 'Testing'],
        roleRelevance: ['Java Backend Developer', 'Spring Boot Developer'],
        demandLevel: 94,
      },
      {
        id: 'git',
        label: 'Git',
        category: 'TOOL',
        x: 120,
        y: 150,
        description: 'Distributed version control, branch workflows, pull requests, and commit hygiene.',
        prerequisites: [],
        relatedSkills: ['Java', 'CI/CD Pipelines'],
        roleRelevance: ['Java Backend Developer', 'Software Engineer'],
        demandLevel: 90,
      },
      {
        id: 'sql',
        label: 'SQL',
        category: 'DATABASE',
        x: 120,
        y: 460,
        description: 'Relational data modeling, ACID transactions, complex JOINs, indexing, and query optimization.',
        prerequisites: [],
        relatedSkills: ['JDBC', 'PostgreSQL', 'Hibernate'],
        roleRelevance: ['Java Backend Developer', 'Full Stack Developer'],
        demandLevel: 92,
      },
      {
        id: 'oop',
        label: 'OOP',
        category: 'CONCEPT',
        x: 280,
        y: 220,
        description: 'Object-oriented programming principles: encapsulation, inheritance, polymorphism, and abstraction.',
        prerequisites: ['java'],
        relatedSkills: ['Java', 'Spring Framework'],
        roleRelevance: ['Java Backend Developer'],
        demandLevel: 88,
      },
      {
        id: 'collections',
        label: 'Collections',
        category: 'CONCEPT',
        x: 280,
        y: 330,
        description: 'Java Collections Framework: List, Set, Map implementations, time complexity, and memory characteristics.',
        prerequisites: ['java'],
        relatedSkills: ['Java', 'JDBC'],
        roleRelevance: ['Java Backend Developer'],
        demandLevel: 85,
      },
      {
        id: 'jdbc',
        label: 'JDBC',
        category: 'CONCEPT',
        x: 310,
        y: 470,
        description: 'Java Database Connectivity API for executing SQL statements and managing database connections.',
        prerequisites: ['java', 'sql'],
        relatedSkills: ['SQL', 'Hibernate'],
        roleRelevance: ['Java Backend Developer'],
        demandLevel: 80,
      },
      {
        id: 'testing',
        label: 'JUnit 5 & Mockito',
        category: 'TOOL',
        x: 320,
        y: 120,
        description: 'Automated unit and integration testing frameworks for Java backend microservices.',
        prerequisites: ['java'],
        relatedSkills: ['Spring Boot'],
        roleRelevance: ['Java Backend Developer', 'Software Engineer'],
        demandLevel: 85,
      },
      {
        id: 'spring-framework',
        label: 'Spring Framework',
        category: 'FRAMEWORK',
        x: 480,
        y: 260,
        description: 'Core Spring: Dependency Injection (DI), Inversion of Control (IoC), and Aspect-Oriented Programming (AOP).',
        prerequisites: ['oop'],
        relatedSkills: ['Spring Boot'],
        roleRelevance: ['Java Backend Developer', 'Spring Boot Developer'],
        demandLevel: 92,
      },
      {
        id: 'hibernate',
        label: 'Hibernate / JPA',
        category: 'FRAMEWORK',
        x: 480,
        y: 420,
        description: 'Object-Relational Mapping (ORM) and Java Persistence API for enterprise database persistence.',
        prerequisites: ['jdbc', 'sql'],
        relatedSkills: ['Spring Boot', 'PostgreSQL'],
        roleRelevance: ['Java Backend Developer'],
        demandLevel: 89,
      },
      {
        id: 'postgresql',
        label: 'PostgreSQL',
        category: 'DATABASE',
        x: 480,
        y: 530,
        description: 'Production open-source relational database with advanced JSONB, indexing, and connection pooling.',
        prerequisites: ['sql'],
        relatedSkills: ['Hibernate', 'Spring Boot'],
        roleRelevance: ['Java Backend Developer'],
        demandLevel: 88,
      },
      {
        id: 'spring-boot',
        label: 'Spring Boot',
        category: 'FRAMEWORK',
        x: 650,
        y: 290,
        description: 'Convention-over-configuration enterprise microservices platform, embedded servers, and production actuators.',
        prerequisites: ['spring-framework'],
        relatedSkills: ['REST APIs', 'Spring Security', 'Docker'],
        roleRelevance: ['Java Backend Developer', 'Spring Boot Developer'],
        demandLevel: 96,
      },
      {
        id: 'rest-apis',
        label: 'REST APIs',
        category: 'CONCEPT',
        x: 750,
        y: 180,
        description: 'RESTful architectural design, HTTP status codes, stateless communication, and OpenAPI contracts.',
        prerequisites: ['spring-boot'],
        relatedSkills: ['Spring Security', 'Kafka'],
        roleRelevance: ['Java Backend Developer'],
        demandLevel: 95,
      },
      {
        id: 'spring-security',
        label: 'Spring Security & JWT',
        category: 'FRAMEWORK',
        x: 770,
        y: 330,
        description: 'Authentication, RBAC authorization, CSRF protection, and stateless JWT token verification.',
        prerequisites: ['spring-boot'],
        relatedSkills: ['REST APIs'],
        roleRelevance: ['Java Backend Developer'],
        demandLevel: 91,
      },
      {
        id: 'docker',
        label: 'Docker',
        category: 'TOOL',
        x: 650,
        y: 480,
        description: 'Containerization, multi-stage Dockerfiles, Docker Compose networking, and cloud deployment.',
        prerequisites: ['git'],
        relatedSkills: ['Spring Boot', 'PostgreSQL'],
        roleRelevance: ['Java Backend Developer', 'DevOps'],
        demandLevel: 89,
      },
      {
        id: 'redis',
        label: 'Redis',
        category: 'DATABASE',
        x: 820,
        y: 460,
        description: 'In-memory distributed key-value cache, session store, rate limiting, and pub/sub messaging.',
        prerequisites: ['spring-boot'],
        relatedSkills: ['Spring Boot'],
        roleRelevance: ['Java Backend Developer'],
        demandLevel: 84,
      },
      {
        id: 'kafka',
        label: 'Kafka',
        category: 'TOOL',
        x: 820,
        y: 260,
        description: 'Distributed event streaming platform for high-throughput decoupled microservice architectures.',
        prerequisites: ['spring-boot'],
        relatedSkills: ['REST APIs'],
        roleRelevance: ['Java Backend Developer'],
        demandLevel: 86,
      },
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
      { source: 'git', target: 'testing', type: 'RELATED' },
    ],
  },

  'Frontend Developer': {
    nodes: [
      {
        id: 'html-css',
        label: 'HTML5 & CSS3',
        category: 'CONCEPT',
        x: 120,
        y: 200,
        description: 'Semantic markup, modern layout models (Flexbox, CSS Grid), responsive design, and accessibility (a11y).',
        prerequisites: [],
        relatedSkills: ['Tailwind CSS', 'JavaScript'],
        roleRelevance: ['Frontend Developer'],
        demandLevel: 92,
      },
      {
        id: 'javascript',
        label: 'JavaScript ES6+',
        category: 'LANGUAGE',
        x: 120,
        y: 350,
        description: 'Modern JavaScript: closures, asynchronous event loop, Promises, async/await, and DOM manipulation.',
        prerequisites: [],
        relatedSkills: ['TypeScript', 'React'],
        roleRelevance: ['Frontend Developer'],
        demandLevel: 96,
      },
      {
        id: 'git',
        label: 'Git & GitHub',
        category: 'TOOL',
        x: 120,
        y: 500,
        description: 'Branch management, feature branches, pull requests, code reviews, and merge conflict resolution.',
        prerequisites: [],
        relatedSkills: ['CI/CD'],
        roleRelevance: ['Frontend Developer'],
        demandLevel: 89,
      },
      {
        id: 'typescript',
        label: 'TypeScript',
        category: 'LANGUAGE',
        x: 290,
        y: 280,
        description: 'Static type checking, interfaces, generics, utility types, and strict type safety for enterprise apps.',
        prerequisites: ['javascript'],
        relatedSkills: ['React', 'Next.js'],
        roleRelevance: ['Frontend Developer'],
        demandLevel: 94,
      },
      {
        id: 'tailwind',
        label: 'Tailwind CSS',
        category: 'FRAMEWORK',
        x: 290,
        y: 150,
        description: 'Utility-first modern CSS framework, responsive design tokens, and dark-mode styling systems.',
        prerequisites: ['html-css'],
        relatedSkills: ['React'],
        roleRelevance: ['Frontend Developer'],
        demandLevel: 90,
      },
      {
        id: 'dom-apis',
        label: 'Browser APIs & Fetch',
        category: 'CONCEPT',
        x: 290,
        y: 430,
        description: 'HTTP requests, REST endpoints, WebSockets, LocalStorage, and browser security contexts (CORS).',
        prerequisites: ['javascript'],
        relatedSkills: ['REST APIs'],
        roleRelevance: ['Frontend Developer'],
        demandLevel: 86,
      },
      {
        id: 'react',
        label: 'React 18',
        category: 'FRAMEWORK',
        x: 480,
        y: 290,
        description: 'Component architecture, Hooks (useState, useEffect, useMemo), Virtual DOM, and Concurrent mode.',
        prerequisites: ['javascript', 'typescript'],
        relatedSkills: ['Next.js', 'State Management'],
        roleRelevance: ['Frontend Developer'],
        demandLevel: 97,
      },
      {
        id: 'rest-apis',
        label: 'REST & GraphQL APIs',
        category: 'CONCEPT',
        x: 480,
        y: 150,
        description: 'Consuming backend API contracts, TanStack React Query, data fetching caching, and mutation state.',
        prerequisites: ['dom-apis'],
        relatedSkills: ['React'],
        roleRelevance: ['Frontend Developer'],
        demandLevel: 92,
      },
      {
        id: 'testing',
        label: 'Vitest / React Testing Library',
        category: 'TOOL',
        x: 480,
        y: 450,
        description: 'Component testing, DOM rendering assertions, user event simulations, and test coverage suites.',
        prerequisites: ['react'],
        relatedSkills: ['React'],
        roleRelevance: ['Frontend Developer'],
        demandLevel: 82,
      },
      {
        id: 'state-management',
        label: 'Zustand / Redux Toolkit',
        category: 'FRAMEWORK',
        x: 670,
        y: 220,
        description: 'Global client-side application state, persistent stores, unidirectional data flow, and selectors.',
        prerequisites: ['react'],
        relatedSkills: ['Next.js'],
        roleRelevance: ['Frontend Developer'],
        demandLevel: 88,
      },
      {
        id: 'nextjs',
        label: 'Next.js & App Router',
        category: 'FRAMEWORK',
        x: 670,
        y: 360,
        description: 'React Server Components (RSC), SSR, Static Site Generation (SSG), and Edge API routes.',
        prerequisites: ['react', 'typescript'],
        relatedSkills: ['Performance'],
        roleRelevance: ['Frontend Developer'],
        demandLevel: 93,
      },
      {
        id: 'performance',
        label: 'Core Web Vitals',
        category: 'CONCEPT',
        x: 670,
        y: 490,
        description: 'LCP, FID, CLS metrics optimization, code-splitting, lazy loading, and modern bundle optimization.',
        prerequisites: ['react'],
        relatedSkills: ['Next.js'],
        roleRelevance: ['Frontend Developer'],
        demandLevel: 85,
      },
      {
        id: 'ci-cd',
        label: 'Vercel / GitHub Actions',
        category: 'TOOL',
        x: 830,
        y: 330,
        description: 'Automated preview deployments, pull request validation checks, and production CI/CD pipelines.',
        prerequisites: ['git'],
        relatedSkills: ['Next.js'],
        roleRelevance: ['Frontend Developer'],
        demandLevel: 87,
      },
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
      { source: 'nextjs', target: 'ci-cd', type: 'RELATED' },
    ],
  },

  'Full Stack Developer': {
    nodes: [
      {
        id: 'javascript',
        label: 'JavaScript / TypeScript',
        category: 'LANGUAGE',
        x: 120,
        y: 260,
        description: 'Full-stack language parity across client applications and Node.js or polyglot backends.',
        prerequisites: [],
        relatedSkills: ['React', 'Node.js'],
        roleRelevance: ['Full Stack Developer'],
        demandLevel: 96,
      },
      {
        id: 'sql',
        label: 'SQL & Relational DBs',
        category: 'DATABASE',
        x: 120,
        y: 430,
        description: 'Relational data modeling, table normalization, indexing, and transactional guarantees.',
        prerequisites: [],
        relatedSkills: ['PostgreSQL', 'Prisma'],
        roleRelevance: ['Full Stack Developer'],
        demandLevel: 92,
      },
      {
        id: 'git',
        label: 'Git Version Control',
        category: 'TOOL',
        x: 120,
        y: 130,
        description: 'Full-stack repository management, monorepo tooling, and branch deployment strategies.',
        prerequisites: [],
        relatedSkills: ['CI/CD'],
        roleRelevance: ['Full Stack Developer'],
        demandLevel: 90,
      },
      {
        id: 'react',
        label: 'React Frontend',
        category: 'FRAMEWORK',
        x: 300,
        y: 220,
        description: 'Interactive UI components, state management, form validation, and reactive client architecture.',
        prerequisites: ['javascript'],
        relatedSkills: ['Next.js'],
        roleRelevance: ['Full Stack Developer'],
        demandLevel: 95,
      },
      {
        id: 'nodejs',
        label: 'Node.js / Express / Spring',
        category: 'FRAMEWORK',
        x: 300,
        y: 370,
        description: 'Server runtime environments, asynchronous request pipelines, middleware, and business logic execution.',
        prerequisites: ['javascript'],
        relatedSkills: ['REST APIs', 'PostgreSQL'],
        roleRelevance: ['Full Stack Developer'],
        demandLevel: 91,
      },
      {
        id: 'postgresql',
        label: 'PostgreSQL Database',
        category: 'DATABASE',
        x: 300,
        y: 500,
        description: 'Primary relational data storage, migrations, connection pools, and query optimization.',
        prerequisites: ['sql'],
        relatedSkills: ['Prisma / ORM'],
        roleRelevance: ['Full Stack Developer'],
        demandLevel: 90,
      },
      {
        id: 'nextjs',
        label: 'Next.js Full Stack',
        category: 'FRAMEWORK',
        x: 490,
        y: 210,
        description: 'Unified full-stack framework with Server Actions, API routes, and hybrid rendering.',
        prerequisites: ['react'],
        relatedSkills: ['REST APIs', 'Authentication'],
        roleRelevance: ['Full Stack Developer'],
        demandLevel: 93,
      },
      {
        id: 'rest-apis',
        label: 'RESTful API Engineering',
        category: 'CONCEPT',
        x: 490,
        y: 350,
        description: 'Designing robust API contracts, status codes, DTO validation, and error payload schemas.',
        prerequisites: ['nodejs'],
        relatedSkills: ['Authentication'],
        roleRelevance: ['Full Stack Developer'],
        demandLevel: 94,
      },
      {
        id: 'orm',
        label: 'ORM (Prisma / Hibernate)',
        category: 'FRAMEWORK',
        x: 490,
        y: 480,
        description: 'Type-safe database abstraction, automated schema migrations, and relation querying.',
        prerequisites: ['postgresql'],
        relatedSkills: ['REST APIs'],
        roleRelevance: ['Full Stack Developer'],
        demandLevel: 87,
      },
      {
        id: 'auth',
        label: 'JWT & OAuth Authentication',
        category: 'CONCEPT',
        x: 670,
        y: 260,
        description: 'Stateless session tokens, HttpOnly cookies, password hashing (bcrypt), and RBAC access control.',
        prerequisites: ['rest-apis'],
        relatedSkills: ['Docker'],
        roleRelevance: ['Full Stack Developer'],
        demandLevel: 91,
      },
      {
        id: 'docker',
        label: 'Docker Containers',
        category: 'TOOL',
        x: 670,
        y: 420,
        description: 'Reproducible container environments for client, backend server, and local database services.',
        prerequisites: ['git'],
        relatedSkills: ['Cloud Deployment'],
        roleRelevance: ['Full Stack Developer'],
        demandLevel: 89,
      },
      {
        id: 'cloud-deploy',
        label: 'Cloud Deployment (AWS/Vercel)',
        category: 'PLATFORM',
        x: 830,
        y: 330,
        description: 'Production hosting, managed databases, environment variables, DNS, and TLS certificates.',
        prerequisites: ['docker', 'auth'],
        relatedSkills: [],
        roleRelevance: ['Full Stack Developer'],
        demandLevel: 88,
      },
    ],
    edges: [
      { source: 'javascript', target: 'react', type: 'PREREQUISITE' },
      { source: 'javascript', target: 'nodejs', type: 'PREREQUISITE' },
      { source: 'sql', target: 'postgresql', type: 'PREREQUISITE' },
      { source: 'react', target: 'nextjs', type: 'PREREQUISITE' },
      { source: 'nodejs', target: 'rest-apis', type: 'PREREQUISITE' },
      { source: 'postgresql', target: 'orm', type: 'PREREQUISITE' },
      { source: 'orm', target: 'rest-apis', type: 'RELATED' },
      { source: 'rest-apis', target: 'auth', type: 'PREREQUISITE' },
      { source: 'nextjs', target: 'auth', type: 'RELATED' },
      { source: 'git', target: 'docker', type: 'RELATED' },
      { source: 'docker', target: 'cloud-deploy', type: 'PREREQUISITE' },
      { source: 'auth', target: 'cloud-deploy', type: 'RELATED' },
    ],
  },

  'Cloud / DevOps Engineer': {
    nodes: [
      {
        id: 'linux',
        label: 'Linux Systems & Shell',
        category: 'CONCEPT',
        x: 120,
        y: 230,
        description: 'POSIX command-line, file permissions, process supervision (systemd), SSH, and shell scripting.',
        prerequisites: [],
        relatedSkills: ['Docker', 'Networking'],
        roleRelevance: ['Cloud / DevOps Engineer'],
        demandLevel: 95,
      },
      {
        id: 'git',
        label: 'Git & GitOps',
        category: 'TOOL',
        x: 120,
        y: 390,
        description: 'Version control for infrastructure-as-code, pull-request automation, and trunk-based deployment.',
        prerequisites: [],
        relatedSkills: ['CI/CD'],
        roleRelevance: ['Cloud / DevOps Engineer'],
        demandLevel: 92,
      },
      {
        id: 'networking',
        label: 'Networking & DNS',
        category: 'CONCEPT',
        x: 120,
        y: 520,
        description: 'TCP/IP, HTTP/HTTPS, SSL/TLS certificates, reverse proxies (Nginx), VPCs, subnets, and routing tables.',
        prerequisites: [],
        relatedSkills: ['AWS Cloud'],
        roleRelevance: ['Cloud / DevOps Engineer'],
        demandLevel: 88,
      },
      {
        id: 'docker',
        label: 'Docker & Containers',
        category: 'TOOL',
        x: 300,
        y: 270,
        description: 'Multi-stage image builds, OCI container standards, non-root security, and container networking.',
        prerequisites: ['linux'],
        relatedSkills: ['Kubernetes', 'CI/CD'],
        roleRelevance: ['Cloud / DevOps Engineer'],
        demandLevel: 97,
      },
      {
        id: 'python-bash',
        label: 'Python & Bash Automation',
        category: 'LANGUAGE',
        x: 300,
        y: 430,
        description: 'Scripting infrastructure automation, AWS SDK (boto3), custom CLI tooling, and cron utilities.',
        prerequisites: ['linux'],
        relatedSkills: ['Terraform'],
        roleRelevance: ['Cloud / DevOps Engineer'],
        demandLevel: 88,
      },
      {
        id: 'ci-cd',
        label: 'CI/CD (GitHub Actions)',
        category: 'TOOL',
        x: 480,
        y: 210,
        description: 'Automated test runners, vulnerability scanning, semantic releases, and container registry publishing.',
        prerequisites: ['docker', 'git'],
        relatedSkills: ['Kubernetes', 'AWS'],
        roleRelevance: ['Cloud / DevOps Engineer'],
        demandLevel: 94,
      },
      {
        id: 'kubernetes',
        label: 'Kubernetes (K8s)',
        category: 'PLATFORM',
        x: 480,
        y: 350,
        description: 'Deployments, Pods, Services, Ingress, ConfigMaps, Helm charts, and horizontal pod autoscaling.',
        prerequisites: ['docker'],
        relatedSkills: ['AWS Cloud', 'Terraform'],
        roleRelevance: ['Cloud / DevOps Engineer'],
        demandLevel: 96,
      },
      {
        id: 'terraform',
        label: 'Terraform / IaC',
        category: 'TOOL',
        x: 480,
        y: 490,
        description: 'Declarative infrastructure as code, state management, reusable modules, and multi-environment setup.',
        prerequisites: ['python-bash'],
        relatedSkills: ['AWS Cloud'],
        roleRelevance: ['Cloud / DevOps Engineer'],
        demandLevel: 93,
      },
      {
        id: 'aws',
        label: 'AWS Cloud Services',
        category: 'PLATFORM',
        x: 670,
        y: 280,
        description: 'EC2, ECS, EKS, S3, RDS, Lambda, CloudWatch, and IAM least-privilege security policies.',
        prerequisites: ['kubernetes', 'terraform'],
        relatedSkills: ['Monitoring'],
        roleRelevance: ['Cloud / DevOps Engineer'],
        demandLevel: 95,
      },
      {
        id: 'monitoring',
        label: 'Prometheus & Grafana',
        category: 'TOOL',
        x: 670,
        y: 440,
        description: 'Observability metrics, custom service dashboards, SLO/SLA tracking, and PagerDuty alert rules.',
        prerequisites: ['kubernetes'],
        relatedSkills: ['DevSecOps'],
        roleRelevance: ['Cloud / DevOps Engineer'],
        demandLevel: 87,
      },
      {
        id: 'devsecops',
        label: 'DevSecOps & Zero Trust',
        category: 'CONCEPT',
        x: 830,
        y: 350,
        description: 'Secret management (Vault/AWS Secrets Manager), container image scanning, and IAM governance.',
        prerequisites: ['aws'],
        relatedSkills: [],
        roleRelevance: ['Cloud / DevOps Engineer'],
        demandLevel: 90,
      },
    ],
    edges: [
      { source: 'linux', target: 'docker', type: 'PREREQUISITE' },
      { source: 'linux', target: 'python-bash', type: 'PREREQUISITE' },
      { source: 'git', target: 'ci-cd', type: 'PREREQUISITE' },
      { source: 'docker', target: 'ci-cd', type: 'PREREQUISITE' },
      { source: 'docker', target: 'kubernetes', type: 'PREREQUISITE' },
      { source: 'python-bash', target: 'terraform', type: 'RELATED' },
      { source: 'kubernetes', target: 'aws', type: 'PREREQUISITE' },
      { source: 'terraform', target: 'aws', type: 'PREREQUISITE' },
      { source: 'networking', target: 'aws', type: 'RELATED' },
      { source: 'kubernetes', target: 'monitoring', type: 'PREREQUISITE' },
      { source: 'aws', target: 'devsecops', type: 'PREREQUISITE' },
      { source: 'monitoring', target: 'devsecops', type: 'RELATED' },
    ],
  },

  'AI / Machine Learning Engineer': {
    nodes: [
      {
        id: 'python',
        label: 'Python',
        category: 'LANGUAGE',
        x: 120,
        y: 280,
        description: 'Core Python for AI/ML: type hinting, generators, memory management, and package packaging.',
        prerequisites: [],
        relatedSkills: ['NumPy & Pandas', 'FastAPI'],
        roleRelevance: ['AI / Machine Learning Engineer'],
        demandLevel: 98,
      },
      {
        id: 'math',
        label: 'Linear Algebra & Stats',
        category: 'CONCEPT',
        x: 120,
        y: 440,
        description: 'Matrix decompositions, vector spaces, gradient descent optimization, probability, and loss functions.',
        prerequisites: [],
        relatedSkills: ['PyTorch'],
        roleRelevance: ['AI / Machine Learning Engineer'],
        demandLevel: 89,
      },
      {
        id: 'git',
        label: 'Git & Versioning',
        category: 'TOOL',
        x: 120,
        y: 140,
        description: 'Experiment versioning, code reviews, and reproducible ML codebase workflows.',
        prerequisites: [],
        relatedSkills: [],
        roleRelevance: ['AI / Machine Learning Engineer'],
        demandLevel: 88,
      },
      {
        id: 'numpy-pandas',
        label: 'NumPy & Pandas',
        category: 'TOOL',
        x: 290,
        y: 230,
        description: 'High-performance numerical multidimensional arrays, data manipulation, cleaning, and feature engineering.',
        prerequisites: ['python'],
        relatedSkills: ['Scikit-Learn'],
        roleRelevance: ['AI / Machine Learning Engineer'],
        demandLevel: 94,
      },
      {
        id: 'sql',
        label: 'SQL Data Extraction',
        category: 'DATABASE',
        x: 290,
        y: 390,
        description: 'Data warehouse query extraction, aggregation pipelines, and big data preparation.',
        prerequisites: [],
        relatedSkills: ['Vector DBs'],
        roleRelevance: ['AI / Machine Learning Engineer'],
        demandLevel: 91,
      },
      {
        id: 'fastapi',
        label: 'FastAPI / Inference',
        category: 'FRAMEWORK',
        x: 470,
        y: 170,
        description: 'High-throughput asynchronous model serving, Pydantic schemas, and RESTful inference endpoints.',
        prerequisites: ['python'],
        relatedSkills: ['Docker'],
        roleRelevance: ['AI / Machine Learning Engineer'],
        demandLevel: 90,
      },
      {
        id: 'scikit',
        label: 'Scikit-Learn',
        category: 'FRAMEWORK',
        x: 470,
        y: 300,
        description: 'Classical ML models: Random Forests, Gradient Boosting (XGBoost), regression, and clustering.',
        prerequisites: ['numpy-pandas', 'math'],
        relatedSkills: ['PyTorch'],
        roleRelevance: ['AI / Machine Learning Engineer'],
        demandLevel: 92,
      },
      {
        id: 'vector-dbs',
        label: 'Vector DBs (pgvector)',
        category: 'DATABASE',
        x: 470,
        y: 440,
        description: 'Vector similarity search (HNSW, Cosine), embeddings indexing, pgvector, Chroma, and Pinecone.',
        prerequisites: ['sql'],
        relatedSkills: ['LLMs & RAG'],
        roleRelevance: ['AI / Machine Learning Engineer'],
        demandLevel: 93,
      },
      {
        id: 'pytorch',
        label: 'PyTorch / Deep Learning',
        category: 'FRAMEWORK',
        x: 660,
        y: 250,
        description: 'Tensors, autograd, Neural Network architectures (Transformers, CNNs), and fine-tuning pipelines.',
        prerequisites: ['scikit', 'math'],
        relatedSkills: ['LLMs & RAG'],
        roleRelevance: ['AI / Machine Learning Engineer'],
        demandLevel: 95,
      },
      {
        id: 'llms-rag',
        label: 'LLMs & RAG Architectures',
        category: 'CONCEPT',
        x: 660,
        y: 390,
        description: 'Retrieval-Augmented Generation, prompt grounding, context chunking, LangChain, and evaluation benchmarks.',
        prerequisites: ['vector-dbs', 'pytorch'],
        relatedSkills: ['MLOps'],
        roleRelevance: ['AI / Machine Learning Engineer'],
        demandLevel: 97,
      },
      {
        id: 'mlops',
        label: 'Docker & MLOps Deployment',
        category: 'TOOL',
        x: 830,
        y: 320,
        description: 'Containerized model packaging, GPU inference deployment, model registry, and latency optimization.',
        prerequisites: ['fastapi', 'llms-rag'],
        relatedSkills: [],
        roleRelevance: ['AI / Machine Learning Engineer'],
        demandLevel: 91,
      },
    ],
    edges: [
      { source: 'python', target: 'numpy-pandas', type: 'PREREQUISITE' },
      { source: 'python', target: 'fastapi', type: 'PREREQUISITE' },
      { source: 'numpy-pandas', target: 'scikit', type: 'PREREQUISITE' },
      { source: 'math', target: 'scikit', type: 'PREREQUISITE' },
      { source: 'sql', target: 'vector-dbs', type: 'PREREQUISITE' },
      { source: 'scikit', target: 'pytorch', type: 'PREREQUISITE' },
      { source: 'vector-dbs', target: 'llms-rag', type: 'PREREQUISITE' },
      { source: 'pytorch', target: 'llms-rag', type: 'RELATED' },
      { source: 'fastapi', target: 'mlops', type: 'PREREQUISITE' },
      { source: 'llms-rag', target: 'mlops', type: 'RELATED' },
    ],
  },

  'Software Engineer': {
    nodes: [
      {
        id: 'core-lang',
        label: 'Core Language (Java/Python)',
        category: 'LANGUAGE',
        x: 120,
        y: 250,
        description: 'Syntax, memory management, standard libraries, and compile/execution runtime characteristics.',
        prerequisites: [],
        relatedSkills: ['DSA', 'OOP'],
        roleRelevance: ['Software Engineer'],
        demandLevel: 95,
      },
      {
        id: 'git',
        label: 'Git & Versioning',
        category: 'TOOL',
        x: 120,
        y: 410,
        description: 'Feature branching, pull requests, automated merge checks, and commit hygiene.',
        prerequisites: [],
        relatedSkills: ['Testing'],
        roleRelevance: ['Software Engineer'],
        demandLevel: 90,
      },
      {
        id: 'dsa',
        label: 'Data Structures & Algorithms',
        category: 'CONCEPT',
        x: 290,
        y: 210,
        description: 'Arrays, Trees, Graphs, Hash Tables, dynamic programming, and Big-O asymptotic analysis.',
        prerequisites: ['core-lang'],
        relatedSkills: ['System Design'],
        roleRelevance: ['Software Engineer'],
        demandLevel: 98,
      },
      {
        id: 'oop',
        label: 'OOP & Design Patterns',
        category: 'CONCEPT',
        x: 290,
        y: 350,
        description: 'SOLID principles, Factory, Singleton, Strategy, Observer, and modular component isolation.',
        prerequisites: ['core-lang'],
        relatedSkills: ['REST APIs'],
        roleRelevance: ['Software Engineer'],
        demandLevel: 92,
      },
      {
        id: 'sql',
        label: 'Relational SQL',
        category: 'DATABASE',
        x: 290,
        y: 480,
        description: 'Database normalization, indexing, execution plans, transactions, and ACID compliance.',
        prerequisites: [],
        relatedSkills: ['System Design'],
        roleRelevance: ['Software Engineer'],
        demandLevel: 91,
      },
      {
        id: 'system-design',
        label: 'System Design Fundamentals',
        category: 'CONCEPT',
        x: 480,
        y: 240,
        description: 'Scalability, load balancing, stateless services, CAP theorem, replication, and caching tiers.',
        prerequisites: ['dsa', 'oop'],
        relatedSkills: ['Distributed Systems'],
        roleRelevance: ['Software Engineer'],
        demandLevel: 96,
      },
      {
        id: 'rest-apis',
        label: 'REST API Architecture',
        category: 'CONCEPT',
        x: 480,
        y: 380,
        description: 'Stateless HTTP APIs, idempotency, rate-limiting, authentication tokens, and serialization.',
        prerequisites: ['oop'],
        relatedSkills: ['Docker'],
        roleRelevance: ['Software Engineer'],
        demandLevel: 93,
      },
      {
        id: 'testing',
        label: 'Automated Testing Suites',
        category: 'TOOL',
        x: 480,
        y: 510,
        description: 'Test-Driven Development (TDD), unit mock isolation, and end-to-end integration verification.',
        prerequisites: ['git'],
        relatedSkills: ['CI/CD'],
        roleRelevance: ['Software Engineer'],
        demandLevel: 87,
      },
      {
        id: 'docker',
        label: 'Docker & Containers',
        category: 'TOOL',
        x: 670,
        y: 300,
        description: 'Containerized packaging, environment parity, Docker compose, and microservice isolation.',
        prerequisites: ['rest-apis'],
        relatedSkills: ['CI/CD'],
        roleRelevance: ['Software Engineer'],
        demandLevel: 90,
      },
      {
        id: 'distributed',
        label: 'Distributed Caching (Redis/Kafka)',
        category: 'TOOL',
        x: 670,
        y: 440,
        description: 'In-memory caching tiers, asynchronous message streaming, and decoupled pub/sub events.',
        prerequisites: ['system-design', 'sql'],
        relatedSkills: [],
        roleRelevance: ['Software Engineer'],
        demandLevel: 88,
      },
      {
        id: 'ci-cd',
        label: 'CI/CD & Cloud Deployments',
        category: 'PLATFORM',
        x: 830,
        y: 360,
        description: 'Automated build pipelines, containerized rollouts, health checks, and zero-downtime deployment.',
        prerequisites: ['docker', 'testing'],
        relatedSkills: [],
        roleRelevance: ['Software Engineer'],
        demandLevel: 89,
      },
    ],
    edges: [
      { source: 'core-lang', target: 'dsa', type: 'PREREQUISITE' },
      { source: 'core-lang', target: 'oop', type: 'PREREQUISITE' },
      { source: 'dsa', target: 'system-design', type: 'PREREQUISITE' },
      { source: 'oop', target: 'system-design', type: 'PREREQUISITE' },
      { source: 'oop', target: 'rest-apis', type: 'PREREQUISITE' },
      { source: 'sql', target: 'system-design', type: 'RELATED' },
      { source: 'git', target: 'testing', type: 'PREREQUISITE' },
      { source: 'rest-apis', target: 'docker', type: 'PREREQUISITE' },
      { source: 'system-design', target: 'distributed', type: 'PREREQUISITE' },
      { source: 'docker', target: 'ci-cd', type: 'PREREQUISITE' },
      { source: 'testing', target: 'ci-cd', type: 'PREREQUISITE' },
    ],
  },

  'Spring Boot Developer': {
    nodes: [
      {
        id: 'java',
        label: 'Java SE 17/21',
        category: 'LANGUAGE',
        x: 120,
        y: 280,
        description: 'Modern Java features: records, pattern matching, virtual threads, streams, and garbage collection.',
        prerequisites: [],
        relatedSkills: ['Spring Framework', 'OOP'],
        roleRelevance: ['Spring Boot Developer'],
        demandLevel: 96,
      },
      {
        id: 'git-maven',
        label: 'Git & Maven / Gradle',
        category: 'TOOL',
        x: 120,
        y: 430,
        description: 'Dependency management, multi-module project builds, plugins, and version control.',
        prerequisites: [],
        relatedSkills: ['Spring Boot'],
        roleRelevance: ['Spring Boot Developer'],
        demandLevel: 89,
      },
      {
        id: 'oop',
        label: 'OOP & Enterprise Patterns',
        category: 'CONCEPT',
        x: 290,
        y: 220,
        description: 'SOLID, Repository pattern, Service layer pattern, DTO mappings, and exception hierarchies.',
        prerequisites: ['java'],
        relatedSkills: ['Spring Framework'],
        roleRelevance: ['Spring Boot Developer'],
        demandLevel: 91,
      },
      {
        id: 'sql',
        label: 'SQL & Database Design',
        category: 'DATABASE',
        x: 290,
        y: 380,
        description: 'Schema modeling, foreign keys, index strategies, transaction isolation levels, and explain plans.',
        prerequisites: [],
        relatedSkills: ['Hibernate'],
        roleRelevance: ['Spring Boot Developer'],
        demandLevel: 92,
      },
      {
        id: 'spring-framework',
        label: 'Spring Framework Core',
        category: 'FRAMEWORK',
        x: 480,
        y: 230,
        description: 'Inversion of Control container, Bean lifecycles, @Autowired, @Configuration, and Spring AOP.',
        prerequisites: ['oop'],
        relatedSkills: ['Spring Boot'],
        roleRelevance: ['Spring Boot Developer'],
        demandLevel: 94,
      },
      {
        id: 'hibernate',
        label: 'Hibernate / Spring Data JPA',
        category: 'FRAMEWORK',
        x: 480,
        y: 380,
        description: 'Entity relationships (@OneToMany, @ManyToMany), dirty checking, JPQL queries, and N+1 prevention.',
        prerequisites: ['sql', 'oop'],
        relatedSkills: ['Spring Boot', 'PostgreSQL'],
        roleRelevance: ['Spring Boot Developer'],
        demandLevel: 93,
      },
      {
        id: 'postgresql',
        label: 'PostgreSQL Engine',
        category: 'DATABASE',
        x: 480,
        y: 510,
        description: 'Production relational engine, HikariCP connection pooling, and Flyway/Liquibase migrations.',
        prerequisites: ['sql'],
        relatedSkills: ['Hibernate'],
        roleRelevance: ['Spring Boot Developer'],
        demandLevel: 90,
      },
      {
        id: 'spring-boot',
        label: 'Spring Boot 3',
        category: 'FRAMEWORK',
        x: 660,
        y: 240,
        description: 'Auto-configuration starters, Actuator health endpoints, Profiles, and GraalVM native images.',
        prerequisites: ['spring-framework'],
        relatedSkills: ['REST APIs', 'Spring Security'],
        roleRelevance: ['Spring Boot Developer'],
        demandLevel: 98,
      },
      {
        id: 'rest-apis',
        label: 'RESTful Microservices',
        category: 'CONCEPT',
        x: 660,
        y: 380,
        description: '@RestController, ResponseEntity, validation constraints (@Valid), and OpenAPI Swagger documentation.',
        prerequisites: ['spring-boot'],
        relatedSkills: ['Spring Security'],
        roleRelevance: ['Spring Boot Developer'],
        demandLevel: 95,
      },
      {
        id: 'spring-security',
        label: 'Spring Security 6 & OAuth2',
        category: 'FRAMEWORK',
        x: 830,
        y: 220,
        description: 'SecurityFilterChain filters, stateless JWT token authentication, and method security (@PreAuthorize).',
        prerequisites: ['spring-boot', 'rest-apis'],
        relatedSkills: [],
        roleRelevance: ['Spring Boot Developer'],
        demandLevel: 92,
      },
      {
        id: 'docker-microservices',
        label: 'Docker & Testcontainers',
        category: 'TOOL',
        x: 830,
        y: 370,
        description: 'Spring Boot Dockerfiles, layered JARs, Testcontainers for real PostgreSQL integration tests.',
        prerequisites: ['spring-boot', 'git-maven'],
        relatedSkills: [],
        roleRelevance: ['Spring Boot Developer'],
        demandLevel: 91,
      },
      {
        id: 'kafka-redis',
        label: 'Kafka & Redis Caching',
        category: 'TOOL',
        x: 830,
        y: 500,
        description: 'Spring Kafka producers/consumers and @Cacheable Redis caching for low-latency queries.',
        prerequisites: ['spring-boot'],
        relatedSkills: [],
        roleRelevance: ['Spring Boot Developer'],
        demandLevel: 87,
      },
    ],
    edges: [
      { source: 'java', target: 'oop', type: 'PREREQUISITE' },
      { source: 'java', target: 'spring-framework', type: 'PREREQUISITE' },
      { source: 'oop', target: 'spring-framework', type: 'PREREQUISITE' },
      { source: 'sql', target: 'hibernate', type: 'PREREQUISITE' },
      { source: 'sql', target: 'postgresql', type: 'PREREQUISITE' },
      { source: 'spring-framework', target: 'spring-boot', type: 'PREREQUISITE' },
      { source: 'spring-boot', target: 'rest-apis', type: 'PREREQUISITE' },
      { source: 'spring-boot', target: 'hibernate', type: 'RELATED' },
      { source: 'rest-apis', target: 'spring-security', type: 'PREREQUISITE' },
      { source: 'spring-boot', target: 'docker-microservices', type: 'RELATED' },
      { source: 'git-maven', target: 'docker-microservices', type: 'PREREQUISITE' },
      { source: 'spring-boot', target: 'kafka-redis', type: 'RELATED' },
    ],
  },

  'Mobile Developer (Android/Flutter)': {
    nodes: [
      {
        id: 'kotlin-dart',
        label: 'Kotlin / Dart',
        category: 'LANGUAGE',
        x: 120,
        y: 260,
        description: 'Modern mobile languages: null-safety, coroutines/async streams, lambdas, and OOP.',
        prerequisites: [],
        relatedSkills: ['UI Layouts', 'Android SDK'],
        roleRelevance: ['Mobile Developer (Android/Flutter)'],
        demandLevel: 93,
      },
      {
        id: 'git',
        label: 'Git & Mobile Versioning',
        category: 'TOOL',
        x: 120,
        y: 420,
        description: 'Release branching, submodule management, and automated Git-based release tagging.',
        prerequisites: [],
        relatedSkills: [],
        roleRelevance: ['Mobile Developer (Android/Flutter)'],
        demandLevel: 88,
      },
      {
        id: 'ui-layouts',
        label: 'Jetpack Compose / Flutter UI',
        category: 'CONCEPT',
        x: 290,
        y: 230,
        description: 'Declarative UI programming, stateful widgets, modifier chains, animations, and responsive screens.',
        prerequisites: ['kotlin-dart'],
        relatedSkills: ['State Management'],
        roleRelevance: ['Mobile Developer (Android/Flutter)'],
        demandLevel: 94,
      },
      {
        id: 'network-apis',
        label: 'REST APIs & Retrofit',
        category: 'CONCEPT',
        x: 290,
        y: 390,
        description: 'HTTP client integration, JSON deserialization, error interceptors, and offline network policies.',
        prerequisites: ['kotlin-dart'],
        relatedSkills: ['Local DB'],
        roleRelevance: ['Mobile Developer (Android/Flutter)'],
        demandLevel: 91,
      },
      {
        id: 'local-db',
        label: 'Room DB / SQLite / Hive',
        category: 'DATABASE',
        x: 480,
        y: 380,
        description: 'On-device local persistence, caching repositories, database migrations, and offline sync.',
        prerequisites: ['network-apis'],
        relatedSkills: ['Architecture'],
        roleRelevance: ['Mobile Developer (Android/Flutter)'],
        demandLevel: 87,
      },
      {
        id: 'state-mgmt',
        label: 'State Management (Bloc/ViewModel)',
        category: 'FRAMEWORK',
        x: 480,
        y: 230,
        description: 'MVVM architecture, Unidirectional Data Flow (UDF), StateFlow, LiveData, and Bloc patterns.',
        prerequisites: ['ui-layouts'],
        relatedSkills: ['Architecture'],
        roleRelevance: ['Mobile Developer (Android/Flutter)'],
        demandLevel: 92,
      },
      {
        id: 'testing-mobile',
        label: 'Unit & UI Espresso Testing',
        category: 'TOOL',
        x: 670,
        y: 250,
        description: 'Mocking repositories, testing state flows, and automated UI integration tests on emulators.',
        prerequisites: ['state-mgmt'],
        relatedSkills: ['CI/CD'],
        roleRelevance: ['Mobile Developer (Android/Flutter)'],
        demandLevel: 84,
      },
      {
        id: 'ci-cd-store',
        label: 'Play Store / CI/CD (Fastlane)',
        category: 'PLATFORM',
        x: 830,
        y: 340,
        description: 'Automated APK/AAB signing, Fastlane pipelines, Firebase App Distribution, and Play Console releases.',
        prerequisites: ['testing-mobile', 'git'],
        relatedSkills: [],
        roleRelevance: ['Mobile Developer (Android/Flutter)'],
        demandLevel: 89,
      },
    ],
    edges: [
      { source: 'kotlin-dart', target: 'ui-layouts', type: 'PREREQUISITE' },
      { source: 'kotlin-dart', target: 'network-apis', type: 'PREREQUISITE' },
      { source: 'ui-layouts', target: 'state-mgmt', type: 'PREREQUISITE' },
      { source: 'network-apis', target: 'local-db', type: 'PREREQUISITE' },
      { source: 'state-mgmt', target: 'testing-mobile', type: 'PREREQUISITE' },
      { source: 'testing-mobile', target: 'ci-cd-store', type: 'PREREQUISITE' },
      { source: 'git', target: 'ci-cd-store', type: 'RELATED' },
    ],
  },
}

const VIEWBOX_W = 900
const VIEWBOX_H = 600
const MIN_SCALE = 0.5
const MAX_SCALE = 2.5

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SkillExplorerPage() {
  const { user } = useAuth()

  // Initialize selectedRole based on the user's active target role
  const [selectedRole, setSelectedRole] = useState<string>(() => {
    const stored = localStorage.getItem('vetra_target_role')
    if (stored && AVAILABLE_ROLES.includes(stored as any)) return stored
    if (user?.targetRole && AVAILABLE_ROLES.includes(user.targetRole as any)) return user.targetRole
    return 'Java Backend Developer'
  })

  // Keep synced if user's profile role or resume sync updates
  useEffect(() => {
    if (user?.targetRole && AVAILABLE_ROLES.includes(user.targetRole as any)) {
      setSelectedRole(user.targetRole)
    }
  }, [user?.targetRole])

  useEffect(() => {
    const handleSync = (e: any) => {
      const roleStr = e?.detail?.detectedRole || ''
      if (roleStr && AVAILABLE_ROLES.includes(roleStr as any)) {
        setSelectedRole(roleStr)
      }
    }
    window.addEventListener('vetra_resume_synced', handleSync)
    return () => window.removeEventListener('vetra_resume_synced', handleSync)
  }, [])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)
  const [highlightMySkills, setHighlightMySkills] = useState(true)

  // Current active DAG for this user's role
  const activeGraph = useMemo(() => {
    return ROLE_GRAPHS[selectedRole] || ROLE_GRAPHS['Java Backend Developer']
  }, [selectedRole])

  const currentNodes = activeGraph.nodes
  const currentEdges = activeGraph.edges

  // Retrieve candidate verified skills from uploaded resume
  const candidateSkills = useMemo(() => {
    try {
      const raw = localStorage.getItem('vetra_latest_resume_analysis')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed?.extractedSkills) && parsed.extractedSkills.length > 0) {
          return new Set(parsed.extractedSkills.map((s: string) => s.toLowerCase()))
        }
      }
    } catch {}
    return new Set(['java', 'spring boot', 'rest apis', 'sql', 'git', 'postgresql', 'docker', 'oop'])
  }, [])

  // Calculate demonstrated vs total for this role
  const demonstratedCount = useMemo(() => {
    return currentNodes.filter(n => candidateSkills.has(n.label.toLowerCase()) || candidateSkills.has(n.id.toLowerCase())).length
  }, [currentNodes, candidateSkills])

  const coveragePercent = Math.round((demonstratedCount / currentNodes.length) * 100)

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole)
    localStorage.setItem('vetra_target_role', newRole)
    setSelectedNodeId(null)
    resetView()
    toast.success(`Loaded Skill Graph for ${newRole}`, {
      description: `Viewing interconnected prerequisites and industry requirements for this career track.`
    })
  }

  const svgRef = useRef<SVGSVGElement>(null)
  const dragState = useRef<{
    isDragging: boolean
    startX: number
    startY: number
    startTx: number
    startTy: number
  }>({ isDragging: false, startX: 0, startY: 0, startTx: 0, startTy: 0 })

  const selectedNode = useMemo(
    () => currentNodes.find((n) => n.id === selectedNodeId) ?? null,
    [selectedNodeId, currentNodes],
  )

  const matchedNodeIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set(currentNodes.map((n) => n.id))
    const q = searchQuery.toLowerCase()
    return new Set(
      currentNodes.filter((n) => n.label.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)).map((n) => n.id),
    )
  }, [searchQuery, currentNodes])

  const zoomBy = useCallback(
    (factor: number) => {
      setScale((prevScale) => {
        const newScale = Math.min(Math.max(prevScale * factor, MIN_SCALE), MAX_SCALE)
        const focalX = VIEWBOX_W / 2
        const focalY = VIEWBOX_H / 2
        setTx((prevTx) => prevTx + (prevScale - newScale) * focalX)
        setTy((prevTy) => prevTy + (prevScale - newScale) * focalY)
        return newScale
      })
    },
    [],
  )

  const resetView = useCallback(() => {
    setScale(1)
    setTx(0)
    setTy(0)
  }, [])

  const handleBackgroundDown = useCallback(
    (e: React.MouseEvent<SVGRectElement>) => {
      dragState.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startTx: tx,
        startTy: ty,
      }
    },
    [tx, ty],
  )

  const handleWindowMove = useCallback((e: MouseEvent) => {
    const ds = dragState.current
    if (!ds.isDragging || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const factorX = VIEWBOX_W / rect.width
    const factorY = VIEWBOX_H / rect.height
    const dx = (e.clientX - ds.startX) * factorX
    const dy = (e.clientY - ds.startY) * factorY
    setTx(ds.startTx + dx)
    setTy(ds.startTy + dy)
  }, [])

  const handleWindowUp = useCallback(() => {
    dragState.current.isDragging = false
  }, [])

  // Attach window listeners while dragging
  if (typeof window !== 'undefined') {
    if (dragState.current.isDragging) {
      window.addEventListener('mousemove', handleWindowMove)
      window.addEventListener('mouseup', handleWindowUp)
    } else {
      window.removeEventListener('mousemove', handleWindowMove)
      window.removeEventListener('mouseup', handleWindowUp)
    }
  }

  function handleNodeClick(node: SkillNode) {
    setSelectedNodeId(node.id)
  }

  const transform = `translate(${tx}, ${ty}) scale(${scale})`
  const isSearching = searchQuery.trim() !== ''

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Network className="h-6 w-6 text-violet" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Skill Explorer</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Dynamic Directed Acyclic Graph (DAG) mapped to your target career role. Click any node to inspect prerequisites and verified proof.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="teal" className="gap-1.5 py-1 text-xs font-semibold shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Live Role Taxonomy
          </Badge>
          <Badge variant="outline" className="border-indigo/30 bg-indigo/10 text-indigo py-1 text-xs font-semibold">
            {selectedRole}
          </Badge>
        </div>
      </div>

      {/* Role Selection & Search Controls */}
      <Card className="border-border">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Target Role Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:max-w-md">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-indigo" />
              Target Role:
            </Label>
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full h-9 text-xs font-medium bg-card">
                <SelectValue placeholder="Select career track" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ROLES.map((role) => (
                  <SelectItem key={role} value={role} className="text-xs">
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Input & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search skills in this role..."
                className="pl-8 h-9 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              variant={highlightMySkills ? "teal" : "outline"}
              size="sm"
              onClick={() => setHighlightMySkills(h => !h)}
              className="gap-1.5 text-xs font-semibold shadow-xs shrink-0 h-9"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {highlightMySkills ? `Resume Skills: ${demonstratedCount}/${currentNodes.length} (${coveragePercent}%)` : "Overlay Resume Skills"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Graph + Detail Panel */}
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* Graph area */}
        <Card className="overflow-hidden border-border">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <span>{selectedRole} Skill Map</span>
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    {currentNodes.length} Nodes · {currentEdges.length} Edges
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Interactive career roadmap — drag canvas to pan, click any node to view detailed prerequisites
                </CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="iconSm" onClick={() => zoomBy(1.2)} title="Zoom in">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="iconSm" onClick={() => zoomBy(0.8)} title="Zoom out">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="iconSm" onClick={resetView} title="Reset view">
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div
              className="relative aspect-[3/2] w-full cursor-grab bg-muted/20 bg-dot select-none"
              onMouseLeave={handleWindowUp}
            >
              <svg
                ref={svgRef}
                viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
                width="100%"
                height="100%"
                className="block"
              >
                {/* Background capture for panning */}
                <rect
                  x={0}
                  y={0}
                  width={VIEWBOX_W}
                  height={VIEWBOX_H}
                  fill="transparent"
                  onMouseDown={handleBackgroundDown}
                  style={{ cursor: 'grab' }}
                />

                <g transform={transform}>
                  {/* Edges */}
                  {currentEdges.map((edge, idx) => {
                    const source = currentNodes.find((n) => n.id === edge.source)
                    const target = currentNodes.find((n) => n.id === edge.target)
                    if (!source || !target) return null

                    const active =
                      !isSearching ||
                      matchedNodeIds.has(source.id) ||
                      matchedNodeIds.has(target.id)

                    return (
                      <line
                        key={`${edge.source}-${edge.target}-${idx}`}
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={edge.type === 'PREREQUISITE' ? '#2563EB' : '#C9CCD4'}
                        strokeWidth={edge.type === 'PREREQUISITE' ? 2 : 1.5}
                        strokeDasharray={edge.type === 'RELATED' ? '6 4' : undefined}
                        opacity={active ? (edge.type === 'PREREQUISITE' ? 0.6 : 0.4) : 0.12}
                        className="transition-opacity duration-200"
                      />
                    )
                  })}

                  {/* Nodes */}
                  {currentNodes.map((node) => {
                    const color = CATEGORY_COLORS[node.category]
                    const isMatched = matchedNodeIds.has(node.id)
                    const isSelected = selectedNodeId === node.id
                    const isDemonstrated = candidateSkills.has(node.label.toLowerCase()) || candidateSkills.has(node.id.toLowerCase())
                    const dimmed = isSearching && !isMatched
                    const r = isSelected ? 26 : 22

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        onClick={() => handleNodeClick(node)}
                        className="cursor-pointer"
                        style={{ opacity: dimmed ? 0.25 : 1, transition: 'opacity 200ms' }}
                      >
                        {/* Candidate verified skills glow */}
                        {highlightMySkills && isDemonstrated && (
                          <circle r={r + 6} fill="none" stroke="#10B981" strokeWidth={2.5} opacity={0.85} strokeDasharray={isSelected ? undefined : "4 2"} />
                        )}
                        {/* Selection ring */}
                        {isSelected && (
                          <circle r={r + 9} fill="none" stroke={color} strokeWidth={2} opacity={0.5} />
                        )}
                        {/* Glow for matched search */}
                        {isSearching && isMatched && (
                          <circle r={r + 4} fill={color} opacity={0.15} />
                        )}
                        <circle r={r} fill={color} opacity={0.92} />
                        <circle r={r} fill="none" stroke="#FFFFFF" strokeWidth={2} opacity={0.6} />

                        {/* Demonstrated check badge */}
                        {highlightMySkills && isDemonstrated && (
                          <g transform={`translate(${r - 3}, ${-r + 3})`}>
                            <circle r={6} fill="#10B981" stroke="#FFFFFF" strokeWidth={1.5} />
                            <text y={3} textAnchor="middle" fontSize={8} fontWeight="bold" fill="#FFFFFF">✓</text>
                          </g>
                        )}

                        <text
                          y={r + 14}
                          textAnchor="middle"
                          fontSize={12}
                          fontWeight={600}
                          fill="currentColor"
                          className="pointer-events-none fill-foreground"
                        >
                          {node.label}
                        </text>
                      </g>
                    )
                  })}
                </g>
              </svg>

              {/* Hint overlay */}
              <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-card/90 px-2.5 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur">
                <MousePointerClick className="h-3.5 w-3.5" />
                Click node to inspect details · Drag canvas to pan
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detail Panel */}
        <div className="space-y-4">
          {selectedNode ? (
            <Card className="animate-slide-in-right border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${CATEGORY_COLORS[selectedNode.category]}20` }}
                    >
                      <Lightbulb
                        className="h-5 w-5"
                        style={{ color: CATEGORY_COLORS[selectedNode.category] }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base">{selectedNode.label}</CardTitle>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <Badge
                          variant="outline"
                          style={{
                            color: CATEGORY_COLORS[selectedNode.category],
                            borderColor: `${CATEGORY_COLORS[selectedNode.category]}40`,
                          }}
                        >
                          {CATEGORY_LABELS[selectedNode.category]}
                        </Badge>

                        {candidateSkills.has(selectedNode.label.toLowerCase()) || candidateSkills.has(selectedNode.id.toLowerCase()) ? (
                          <Badge variant="teal" className="gap-1 text-[11px]">
                            <CheckCircle2 className="h-3 w-3" /> In Your Resume
                          </Badge>
                        ) : (
                          <Badge variant="amber" className="gap-1 text-[11px]">
                            <AlertTriangle className="h-3 w-3" /> Skill Gap for Role
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="iconSm"
                    onClick={() => setSelectedNodeId(null)}
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedNode.description}</p>

                <Separator />

                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Link2 className="h-3.5 w-3.5" />
                    Prerequisites
                  </p>
                  {selectedNode.prerequisites.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.prerequisites.map((preId) => {
                        const pre = currentNodes.find((n) => n.id === preId)
                        return pre ? (
                          <Badge
                            key={preId}
                            variant="outline"
                            className="cursor-pointer hover:bg-muted font-medium text-xs"
                            onClick={() => setSelectedNodeId(preId)}
                          >
                            {pre.label}
                          </Badge>
                        ) : (
                          <Badge key={preId} variant="muted" className="text-xs">
                            {preId}
                          </Badge>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No prerequisites — foundational competency.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Network className="h-3.5 w-3.5" />
                    Related Technologies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.relatedSkills.map((related) => {
                      const rn = currentNodes.find(
                        (n) => n.label.toLowerCase() === related.toLowerCase() || n.id === related.toLowerCase().replace(/\s+/g, '-'),
                      )
                      return (
                        <Badge
                          key={related}
                          variant="muted"
                          className={cn('text-xs', rn && 'cursor-pointer hover:bg-border')}
                          onClick={() => rn && setSelectedNodeId(rn.id)}
                        >
                          {related}
                        </Badge>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Role Relevance
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.roleRelevance.map((role) => (
                      <Badge key={role} variant="info" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Market Hiring Demand
                    </Label>
                    <span className="text-sm font-bold text-foreground">
                      {formatPercent(selectedNode.demandLevel)}
                    </span>
                  </div>
                  <Progress value={selectedNode.demandLevel} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-border">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <MousePointerClick className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">Select a skill node</p>
                <p className="mt-1 text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Click any node in the {selectedRole} DAG to inspect prerequisites, candidate proof, and industry market demand.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Layers className="h-3.5 w-3.5" />
                Legend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {LEGEND_ITEMS.map((item) => (
                  <div key={item.category} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
                    />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-5 bg-blue-600 shrink-0" />
                  <span>Solid = prerequisite</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-5 border-t-2 border-dashed border-gray-400 shrink-0" />
                  <span>Dashed = related skill</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full border-2 border-emerald-500 bg-emerald-100 dark:bg-emerald-950 shrink-0" />
                  <span>Green ring = in your resume</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
