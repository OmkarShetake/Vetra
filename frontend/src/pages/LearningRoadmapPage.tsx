import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import {
  GraduationCap,
  Code2,
  Boxes,
  Database,
  Server,
  ShieldCheck,
  Container,
  FolderGit2,
  Clock,
  ExternalLink,
  CheckCircle2,
  Circle,
  TrendingUp,
  BookOpen,
  PlayCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { cn, formatPercent } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

interface LearningTask {
  id: string
  title: string
  priority: Priority
  estimatedHours: number
  completed: boolean
  resourceUrl?: string
}

interface LearningPhase {
  id: string
  number: number
  title: string
  description: string
  estimatedHours: number
  icon: typeof Code2
  tasks: LearningTask[]
}

// ---------------------------------------------------------------------------
// Multi-Track Curricula
// ---------------------------------------------------------------------------

const TRACK_CURRICULA: Record<string, { roleTitle: string; phases: LearningPhase[] }> = {
  'java-backend': {
    roleTitle: 'Java Backend Developer',
    phases: [
      {
        id: 'phase-1',
        number: 1,
        title: 'Java Core',
        description: 'Master the fundamentals of Java including syntax, data types, control flow, and exception handling.',
        estimatedHours: 40,
        icon: Code2,
        tasks: [
          { id: 't1-1', title: 'Java syntax, variables, and data types', priority: 'HIGH', estimatedHours: 6, completed: true, resourceUrl: 'https://docs.oracle.com/javase/tutorial/' },
          { id: 't1-2', title: 'Control flow and loops', priority: 'HIGH', estimatedHours: 5, completed: true, resourceUrl: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html' },
          { id: 't1-3', title: 'Arrays and strings', priority: 'MEDIUM', estimatedHours: 4, completed: true, resourceUrl: 'https://docs.oracle.com/javase/tutorial/java/data/arrays.html' },
          { id: 't1-4', title: 'Exception handling & custom exceptions', priority: 'HIGH', estimatedHours: 5, completed: false, resourceUrl: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/' },
          { id: 't1-5', title: 'Build a console-based calculator app', priority: 'MEDIUM', estimatedHours: 8, completed: false },
        ],
      },
      {
        id: 'phase-2',
        number: 2,
        title: 'OOP and Collections Framework',
        description: 'Deepen your understanding of object-oriented programming and Java Collections Framework.',
        estimatedHours: 35,
        icon: Boxes,
        tasks: [
          { id: 't2-1', title: 'Classes, objects, constructors, and encapsulation', priority: 'HIGH', estimatedHours: 6, completed: false, resourceUrl: 'https://docs.oracle.com/javase/tutorial/java/concepts/' },
          { id: 't2-2', title: 'Inheritance, polymorphism, and abstract classes', priority: 'HIGH', estimatedHours: 7, completed: false, resourceUrl: 'https://docs.oracle.com/javase/tutorial/java/IandI/' },
          { id: 't2-3', title: 'Collections Framework (List, Set, Map, Queue)', priority: 'HIGH', estimatedHours: 8, completed: false, resourceUrl: 'https://docs.oracle.com/javase/tutorial/collections/' },
          { id: 't2-4', title: 'Generics and lambda expressions (Streams API)', priority: 'MEDIUM', estimatedHours: 5, completed: false },
          { id: 't2-5', title: 'Build a student management system using OOP', priority: 'MEDIUM', estimatedHours: 4, completed: false },
        ],
      },
      {
        id: 'phase-3',
        number: 3,
        title: 'SQL and PostgreSQL Mastery',
        description: 'Learn relational database fundamentals, indexing, transactions, and PostgreSQL.',
        estimatedHours: 30,
        icon: Database,
        tasks: [
          { id: 't3-1', title: 'SQL fundamentals (CRUD, WHERE, GROUP BY)', priority: 'HIGH', estimatedHours: 6, completed: false, resourceUrl: 'https://www.postgresqltutorial.com/' },
          { id: 't3-2', title: 'Joins, subqueries, and window functions', priority: 'HIGH', estimatedHours: 7, completed: false, resourceUrl: 'https://www.postgresqltutorial.com/postgresql-joins/' },
          { id: 't3-3', title: 'Relational schema design and 3NF normalization', priority: 'MEDIUM', estimatedHours: 5, completed: false },
          { id: 't3-4', title: 'B-tree indexes, execution plans, and query optimization', priority: 'MEDIUM', estimatedHours: 5, completed: false },
          { id: 't3-5', title: 'Set up PostgreSQL and build a relational store schema', priority: 'LOW', estimatedHours: 7, completed: false },
        ],
      },
      {
        id: 'phase-4',
        number: 4,
        title: 'Spring Boot & RESTful APIs',
        description: 'Build enterprise backend microservices with Spring Boot and Spring Data JPA.',
        estimatedHours: 50,
        icon: Server,
        tasks: [
          { id: 't4-1', title: 'Spring Boot setup, configuration & dependency injection', priority: 'HIGH', estimatedHours: 6, completed: false, resourceUrl: 'https://spring.io/guides/gs/spring-boot/' },
          { id: 't4-2', title: 'REST controller design, DTOs, and global exception handling', priority: 'HIGH', estimatedHours: 8, completed: false, resourceUrl: 'https://spring.io/guides/gs/rest-service/' },
          { id: 't4-3', title: 'Spring Data JPA repositories, JPQL, and pagination', priority: 'HIGH', estimatedHours: 10, completed: false, resourceUrl: 'https://spring.io/guides/gs/accessing-data-jpa/' },
          { id: 't4-4', title: 'Spring Security with JWT authentication flow', priority: 'HIGH', estimatedHours: 12, completed: false },
          { id: 't4-5', title: 'Build a complete production-grade CRUD REST API project', priority: 'HIGH', estimatedHours: 14, completed: false },
        ],
      },
      {
        id: 'phase-5',
        number: 5,
        title: 'Docker Containerization & Testing',
        description: 'Package microservices with Docker and write rigorous tests with JUnit 5 and Mockito.',
        estimatedHours: 35,
        icon: Container,
        tasks: [
          { id: 't6-1', title: 'Docker containerization & multi-stage Dockerfiles', priority: 'HIGH', estimatedHours: 6, completed: false, resourceUrl: 'https://docs.docker.com/get-started/' },
          { id: 't6-2', title: 'Docker Compose for multi-container apps (App + DB + Redis)', priority: 'MEDIUM', estimatedHours: 6, completed: false },
          { id: 't6-3', title: 'JUnit 5 unit testing & Mockito mocks', priority: 'HIGH', estimatedHours: 7, completed: false, resourceUrl: 'https://junit.org/junit5/docs/current/user-guide/' },
          { id: 't6-4', title: 'MockMvc integration testing with Testcontainers', priority: 'MEDIUM', estimatedHours: 6, completed: false },
          { id: 't6-5', title: 'Containerize and publish backend project on GitHub', priority: 'HIGH', estimatedHours: 10, completed: false },
        ],
      },
    ]
  },
  'frontend': {
    roleTitle: 'Frontend Developer',
    phases: [
      {
        id: 'fe-phase-1',
        number: 1,
        title: 'Modern JavaScript & TypeScript Foundations',
        description: 'Master ES6+ syntax, asynchronous programming, DOM APIs, and strict TypeScript types.',
        estimatedHours: 35,
        icon: Code2,
        tasks: [
          { id: 'fe-1-1', title: 'ES6+ features: destructuring, modules, arrow functions, promises', priority: 'HIGH', estimatedHours: 6, completed: true, resourceUrl: 'https://javascript.info/' },
          { id: 'fe-1-2', title: 'TypeScript interfaces, generics, type aliases, and unions', priority: 'HIGH', estimatedHours: 8, completed: false, resourceUrl: 'https://www.typescriptlang.org/docs/' },
          { id: 'fe-1-3', title: 'Async/Await, fetch API, and JSON serialization', priority: 'HIGH', estimatedHours: 6, completed: false },
          { id: 'fe-1-4', title: 'Build an interactive CLI or pure TS utility library', priority: 'MEDIUM', estimatedHours: 8, completed: false },
        ]
      },
      {
        id: 'fe-phase-2',
        number: 2,
        title: 'React Core & Component Architecture',
        description: 'Build responsive user interfaces using React 18, JSX, custom hooks, and state lifecycles.',
        estimatedHours: 45,
        icon: Boxes,
        tasks: [
          { id: 'fe-2-1', title: 'React component hierarchy, props, and JSX patterns', priority: 'HIGH', estimatedHours: 8, completed: false, resourceUrl: 'https://react.dev/' },
          { id: 'fe-2-2', title: 'Hooks: useState, useEffect, useMemo, useCallback, useRef', priority: 'HIGH', estimatedHours: 10, completed: false },
          { id: 'fe-2-3', title: 'Custom hooks for data fetching and debounce logic', priority: 'HIGH', estimatedHours: 7, completed: false },
          { id: 'fe-2-4', title: 'Modern styling with Tailwind CSS and CSS modules', priority: 'MEDIUM', estimatedHours: 6, completed: false },
          { id: 'fe-2-5', title: 'Build an interactive dashboard component library', priority: 'HIGH', estimatedHours: 14, completed: false },
        ]
      },
      {
        id: 'fe-phase-3',
        number: 3,
        title: 'State Management & API Integration',
        description: 'Manage global application state and integrate REST / GraphQL backend APIs.',
        estimatedHours: 35,
        icon: Server,
        tasks: [
          { id: 'fe-3-1', title: 'Global state with Zustand or Redux Toolkit', priority: 'HIGH', estimatedHours: 8, completed: false },
          { id: 'fe-3-2', title: 'TanStack Query (React Query) for server state caching', priority: 'HIGH', estimatedHours: 8, completed: false },
          { id: 'fe-3-3', title: 'Form handling with React Hook Form and Zod validation', priority: 'HIGH', estimatedHours: 7, completed: false },
          { id: 'fe-3-4', title: 'Routing with React Router v6 or TanStack Router', priority: 'MEDIUM', estimatedHours: 5, completed: false },
        ]
      },
      {
        id: 'fe-phase-4',
        number: 4,
        title: 'Next.js & Production Deployment',
        description: 'Full-stack frontend development with Next.js App Router, SSR, and Vercel deployment.',
        estimatedHours: 40,
        icon: FolderGit2,
        tasks: [
          { id: 'fe-4-1', title: 'Next.js App Router, Server Components & Client Components', priority: 'HIGH', estimatedHours: 10, completed: false, resourceUrl: 'https://nextjs.org/docs' },
          { id: 'fe-4-2', title: 'SEO optimization, metadata, and core web vitals performance', priority: 'MEDIUM', estimatedHours: 6, completed: false },
          { id: 'fe-4-3', title: 'Automated testing with Vitest and React Testing Library', priority: 'HIGH', estimatedHours: 8, completed: false },
          { id: 'fe-4-4', title: 'Deploy a live portfolio showcase web app with CI/CD', priority: 'HIGH', estimatedHours: 16, completed: false },
        ]
      }
    ]
  },
  'fullstack': {
    roleTitle: 'Full Stack Developer',
    phases: [
      {
        id: 'fs-phase-1',
        number: 1,
        title: 'Frontend Foundations (React & TypeScript)',
        description: 'Build dynamic, accessible web frontends with React, TypeScript, and modern styling.',
        estimatedHours: 40,
        icon: Code2,
        tasks: [
          { id: 'fs-1-1', title: 'TypeScript mastery for full-stack developers', priority: 'HIGH', estimatedHours: 8, completed: true },
          { id: 'fs-1-2', title: 'React 18 components, hooks, and responsive design', priority: 'HIGH', estimatedHours: 12, completed: false },
          { id: 'fs-1-3', title: 'Tailwind CSS and component libraries (shadcn/ui)', priority: 'MEDIUM', estimatedHours: 6, completed: false },
        ]
      },
      {
        id: 'fs-phase-2',
        number: 2,
        title: 'Backend Services (Node.js & Express / Spring Boot)',
        description: 'Architect scalable backend APIs, authentication middleware, and business logic.',
        estimatedHours: 45,
        icon: Server,
        tasks: [
          { id: 'fs-2-1', title: 'RESTful API architectural patterns and status conventions', priority: 'HIGH', estimatedHours: 8, completed: false },
          { id: 'fs-2-2', title: 'JWT authentication, refresh tokens, and password hashing', priority: 'HIGH', estimatedHours: 10, completed: false },
          { id: 'fs-2-3', title: 'Database modeling with PostgreSQL & Prisma/JPA', priority: 'HIGH', estimatedHours: 12, completed: false },
        ]
      },
      {
        id: 'fs-phase-3',
        number: 3,
        title: 'End-to-End Capstone & Deployment',
        description: 'Unify frontend and backend into a containerized, production-deployed platform.',
        estimatedHours: 45,
        icon: FolderGit2,
        tasks: [
          { id: 'fs-3-1', title: 'Docker containerization for frontend and backend microservices', priority: 'HIGH', estimatedHours: 8, completed: false },
          { id: 'fs-3-2', title: 'Continuous integration (CI/CD) with GitHub Actions', priority: 'MEDIUM', estimatedHours: 7, completed: false },
          { id: 'fs-3-3', title: 'Deploy full stack platform to cloud (Render / AWS)', priority: 'HIGH', estimatedHours: 15, completed: false },
        ]
      }
    ]
  },
  'devops': {
    roleTitle: 'Cloud & DevOps Engineer',
    phases: [
      {
        id: 'do-phase-1',
        number: 1,
        title: 'Linux Systems & Automation Scripting',
        description: 'Command line mastery, file systems, permissions, shell scripting, and networking.',
        estimatedHours: 35,
        icon: Code2,
        tasks: [
          { id: 'do-1-1', title: 'Linux administration, systemd, bash scripting, and cron', priority: 'HIGH', estimatedHours: 10, completed: false },
          { id: 'do-1-2', title: 'Networking basics: DNS, TCP/IP, TLS/SSL, reverse proxies (Nginx)', priority: 'HIGH', estimatedHours: 8, completed: false },
          { id: 'do-1-3', title: 'Git workflows: branch protections, rebasing, and semantic release', priority: 'MEDIUM', estimatedHours: 6, completed: true },
        ]
      },
      {
        id: 'do-phase-2',
        number: 2,
        title: 'Docker & Kubernetes Orchestration',
        description: 'Container architecture, images, orchestration, pods, services, and ingress.',
        estimatedHours: 45,
        icon: Container,
        tasks: [
          { id: 'do-2-1', title: 'Docker image optimization, multi-stage builds, and non-root users', priority: 'HIGH', estimatedHours: 8, completed: false },
          { id: 'do-2-2', title: 'Kubernetes architecture: Pods, Deployments, Services, ConfigMaps', priority: 'HIGH', estimatedHours: 14, completed: false },
          { id: 'do-2-3', title: 'Ingress controllers, cert-manager, and secret management', priority: 'HIGH', estimatedHours: 8, completed: false },
        ]
      },
      {
        id: 'do-phase-3',
        number: 3,
        title: 'CI/CD Pipelines & Cloud Infrastructure (AWS / Terraform)',
        description: 'Automate build/test/deploy cycles and declare infrastructure as code.',
        estimatedHours: 45,
        icon: FolderGit2,
        tasks: [
          { id: 'do-3-1', title: 'GitHub Actions automated build, test, and container push workflows', priority: 'HIGH', estimatedHours: 10, completed: false },
          { id: 'do-3-2', title: 'Terraform modules for provisioning VPC, EC2, RDS, and S3', priority: 'HIGH', estimatedHours: 14, completed: false },
          { id: 'do-3-3', title: 'Observability: Prometheus metrics, Grafana dashboards, and logging', priority: 'MEDIUM', estimatedHours: 8, completed: false },
        ]
      }
    ]
  },
  'data-ai': {
    roleTitle: 'Data & AI/ML Engineer',
    phases: [
      {
        id: 'ai-phase-1',
        number: 1,
        title: 'Python Mastery & Data Processing',
        description: 'Advanced Python, data structures, Pandas dataframes, NumPy arrays, and SQL analytics.',
        estimatedHours: 40,
        icon: Code2,
        tasks: [
          { id: 'ai-1-1', title: 'Python type hints, generators, context managers, and async IO', priority: 'HIGH', estimatedHours: 8, completed: false },
          { id: 'ai-1-2', title: 'Pandas & NumPy data manipulation, aggregation, and cleaning', priority: 'HIGH', estimatedHours: 12, completed: false },
          { id: 'ai-1-3', title: 'Analytical SQL: window functions, CTEs, and query plans', priority: 'HIGH', estimatedHours: 8, completed: false },
        ]
      },
      {
        id: 'ai-phase-2',
        number: 2,
        title: 'FastAPI & LLM AI Pipeline Engineering',
        description: 'Build low-latency AI microservices, RAG architectures, and vector embeddings.',
        estimatedHours: 50,
        icon: Boxes,
        tasks: [
          { id: 'ai-2-1', title: 'FastAPI REST microservices with Pydantic schemas and dependency injection', priority: 'HIGH', estimatedHours: 10, completed: false },
          { id: 'ai-2-2', title: 'Vector embeddings, chunking strategies, and vector databases (pgvector / Chroma)', priority: 'HIGH', estimatedHours: 12, completed: false },
          { id: 'ai-2-3', title: 'LLM prompt engineering, function calling, and structured JSON output', priority: 'HIGH', estimatedHours: 10, completed: false },
          { id: 'ai-2-4', title: 'Build and deploy an automated RAG document question-answering agent', priority: 'HIGH', estimatedHours: 18, completed: false },
        ]
      }
    ]
  }
}

const initialPhases = TRACK_CURRICULA['java-backend'].phases

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function priorityBadgeVariant(priority: Priority) {
  switch (priority) {
    case 'HIGH':
      return 'coral' as const
    case 'MEDIUM':
      return 'amber' as const
    case 'LOW':
      return 'info' as const
  }
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export function LearningRoadmapPage() {
  const { user } = useAuth()

  // Detect initial track from resume or profile
  const detectInitialTrack = (): string => {
    try {
      const stored = localStorage.getItem('vetra_target_role')
      if (stored) {
        const lower = stored.toLowerCase()
        if (lower.includes('front')) return 'frontend'
        if (lower.includes('full')) return 'fullstack'
        if (lower.includes('devops') || lower.includes('cloud')) return 'devops'
        if (lower.includes('ai') || lower.includes('data')) return 'data-ai'
        if (lower.includes('java') || lower.includes('backend') || lower.includes('spring')) return 'java-backend'
      }
      const raw = localStorage.getItem('vetra_latest_resume_analysis')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.detectedRole) {
          const lower = parsed.detectedRole.toLowerCase()
          if (lower.includes('front')) return 'frontend'
          if (lower.includes('full')) return 'fullstack'
          if (lower.includes('devops') || lower.includes('cloud')) return 'devops'
          if (lower.includes('ai') || lower.includes('data')) return 'data-ai'
          if (lower.includes('java') || lower.includes('backend') || lower.includes('spring')) return 'java-backend'
        }
      }
      if (user?.targetRole) {
        const lower = user.targetRole.toLowerCase()
        if (lower.includes('front')) return 'frontend'
        if (lower.includes('full')) return 'fullstack'
        if (lower.includes('devops') || lower.includes('cloud')) return 'devops'
        if (lower.includes('ai') || lower.includes('data')) return 'data-ai'
        if (lower.includes('java') || lower.includes('backend') || lower.includes('spring')) return 'java-backend'
      }
    } catch {}
    return 'java-backend'
  }

  const [selectedTrack, setSelectedTrack] = useState<string>(detectInitialTrack)
  const currentCurriculum = TRACK_CURRICULA[selectedTrack] || TRACK_CURRICULA['java-backend']
  const [phases, setPhases] = useState<LearningPhase[]>(currentCurriculum.phases)

  // Listen to resume sync events
  useEffect(() => {
    const handleSync = (e: any) => {
      const roleStr = e?.detail?.detectedRole || ''
      if (roleStr) {
        const lower = roleStr.toLowerCase()
        let trackKey = 'java-backend'
        if (lower.includes('front')) trackKey = 'frontend'
        else if (lower.includes('full')) trackKey = 'fullstack'
        else if (lower.includes('devops') || lower.includes('cloud')) trackKey = 'devops'
        else if (lower.includes('ai') || lower.includes('data')) trackKey = 'data-ai'
        setSelectedTrack(trackKey)
        setPhases(TRACK_CURRICULA[trackKey]?.phases || TRACK_CURRICULA['java-backend'].phases)
      }
    }
    window.addEventListener('vetra_resume_synced', handleSync)
    return () => window.removeEventListener('vetra_resume_synced', handleSync)
  }, [])

  const handleTrackChange = (newTrack: string) => {
    setSelectedTrack(newTrack)
    const nextCurriculum = TRACK_CURRICULA[newTrack] || TRACK_CURRICULA['java-backend']
    setPhases(nextCurriculum.phases)
    toast.success(`Loaded personalized curriculum for ${nextCurriculum.roleTitle}`)
  }

  const toggleTask = (phaseId: string, taskId: string) => {
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.id !== phaseId) return phase
        return {
          ...phase,
          tasks: phase.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task,
          ),
        }
      }),
    )
  }

  const totalTasks = useMemo(
    () => phases.reduce((sum, p) => sum + p.tasks.length, 0),
    [phases],
  )
  const completedTasks = useMemo(
    () => phases.reduce((sum, p) => sum + p.tasks.filter((t) => t.completed).length, 0),
    [phases],
  )
  const totalHours = useMemo(
    () => phases.reduce((sum, p) => sum + p.estimatedHours, 0),
    [phases],
  )
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Learning Roadmap</h1>
            <Badge variant="teal">Personalized Plan</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            A personalized, phased curriculum engineered to bridge your specific skill gaps.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground hidden sm:inline">Track:</span>
          <Select value={selectedTrack} onValueChange={handleTrackChange}>
            <SelectTrigger className="w-[230px] bg-card border-border font-medium text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TRACK_CURRICULA).map(([key, item]) => (
                <SelectItem key={key} value={key}>{item.roleTitle}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo/10">
                <GraduationCap className="h-6 w-6 text-indigo" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Target Role</p>
                <p className="text-sm font-semibold text-foreground">{currentCurriculum.roleTitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet/10">
                <Clock className="h-6 w-6 text-violet" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Estimated Hours</p>
                <p className="text-sm font-semibold text-foreground">{totalHours} hours</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal/10">
                <CheckCircle2 className="h-6 w-6 text-teal" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tasks Completed</p>
                <p className="text-sm font-semibold text-foreground">
                  {completedTasks} / {totalTasks}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber/10">
                <TrendingUp className="h-6 w-6 text-amber" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Overall Progress</p>
                <p className="text-sm font-semibold text-foreground">{formatPercent(overallProgress)}</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Learning Progress</span>
              <span className="text-sm font-medium text-amber">{formatPercent(overallProgress)}</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Phases timeline */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Learning Phases</h2>
        </div>

        <Accordion type="multiple" defaultValue={['phase-1']} className="space-y-4">
          {phases.map((phase) => {
            const phaseCompletedTasks = phase.tasks.filter((t) => t.completed).length
            const phaseProgress =
              phase.tasks.length > 0 ? Math.round((phaseCompletedTasks / phase.tasks.length) * 100) : 0
            const isComplete = phaseCompletedTasks === phase.tasks.length && phase.tasks.length > 0

            return (
              <AccordionItem key={phase.id} value={phase.id} className="overflow-hidden">
                <AccordionTrigger className="hover:no-underline px-5 py-4">
                  <div className="flex w-full items-center gap-4 pr-4 text-left">
                    {/* Phase number icon */}
                    <div
                      className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                        isComplete ? 'bg-teal/10' : 'bg-indigo/10',
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="h-6 w-6 text-teal" />
                      ) : (
                        <phase.icon className="h-6 w-6 text-indigo" />
                      )}
                    </div>

                    {/* Phase info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo">PHASE {phase.number}</span>
                        {isComplete && (
                          <Badge variant="teal" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Complete
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                        {phase.title}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {phase.estimatedHours} hours
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {phaseCompletedTasks}/{phase.tasks.length} tasks
                        </span>
                      </div>
                    </div>

                    {/* Phase progress */}
                    <div className="hidden w-24 shrink-0 sm:block">
                      <Progress value={phaseProgress} className="h-2" />
                      <span className="mt-1 block text-right text-xs text-muted-foreground">
                        {formatPercent(phaseProgress)}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-5 pb-5">
                  <p className="mb-4 text-sm text-muted-foreground">{phase.description}</p>

                  {/* Phase progress (mobile) */}
                  <div className="mb-4 sm:hidden">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-medium text-foreground">{formatPercent(phaseProgress)}</span>
                    </div>
                    <Progress value={phaseProgress} className="h-2" />
                  </div>

                  {/* Tasks */}
                  <div className="space-y-2">
                    {phase.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                          task.completed
                            ? 'border-teal/30 bg-teal/5'
                            : 'border-border bg-card hover:bg-muted/50',
                        )}
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(phase.id, task.id)}
                          className="mt-0.5"
                        />
                        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1 space-y-1">
                            <span
                              className={cn(
                                'text-sm font-medium',
                                task.completed ? 'text-muted-foreground line-through' : 'text-foreground',
                              )}
                            >
                              {task.title}
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant={priorityBadgeVariant(task.priority)}>{task.priority}</Badge>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {task.estimatedHours}h
                              </span>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {task.resourceUrl && (
                              <Button
                                variant="ghost"
                                size="iconSm"
                                onClick={() => {
                                  window.open(task.resourceUrl, '_blank', 'noopener,noreferrer')
                                  toast.info('Opening learning resource')
                                }}
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Phase footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <PlayCircle className="h-3.5 w-3.5" />
                      {phaseCompletedTasks} of {phase.tasks.length} tasks completed
                    </span>
                    {phaseProgress === 100 ? (
                      <Badge variant="teal" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Phase complete
                      </Badge>
                    ) : (
                      <span className="text-xs font-medium text-amber">{formatPercent(phaseProgress)} done</span>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </div>
  )
}
