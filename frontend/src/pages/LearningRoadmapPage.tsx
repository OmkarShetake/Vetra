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
// Demo data
// ---------------------------------------------------------------------------

const initialPhases: LearningPhase[] = [
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
      { id: 't1-4', title: 'Exception handling', priority: 'HIGH', estimatedHours: 5, completed: false, resourceUrl: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/' },
      { id: 't1-5', title: 'Build a console-based calculator app', priority: 'MEDIUM', estimatedHours: 8, completed: false },
    ],
  },
  {
    id: 'phase-2',
    number: 2,
    title: 'OOP and Collections',
    description: 'Deepen your understanding of object-oriented programming and Java Collections Framework.',
    estimatedHours: 35,
    icon: Boxes,
    tasks: [
      { id: 't2-1', title: 'Classes, objects, and constructors', priority: 'HIGH', estimatedHours: 6, completed: false, resourceUrl: 'https://docs.oracle.com/javase/tutorial/java/concepts/' },
      { id: 't2-2', title: 'Inheritance, polymorphism, and encapsulation', priority: 'HIGH', estimatedHours: 7, completed: false, resourceUrl: 'https://docs.oracle.com/javase/tutorial/java/IandI/' },
      { id: 't2-3', title: 'Interfaces and abstract classes', priority: 'MEDIUM', estimatedHours: 5, completed: false },
      { id: 't2-4', title: 'Collections Framework (List, Set, Map, Queue)', priority: 'HIGH', estimatedHours: 8, completed: false, resourceUrl: 'https://docs.oracle.com/javase/tutorial/collections/' },
      { id: 't2-5', title: 'Generics and lambda expressions', priority: 'MEDIUM', estimatedHours: 5, completed: false },
      { id: 't2-6', title: 'Build a student management system using OOP', priority: 'MEDIUM', estimatedHours: 4, completed: false },
    ],
  },
  {
    id: 'phase-3',
    number: 3,
    title: 'SQL and PostgreSQL',
    description: 'Learn relational database fundamentals and PostgreSQL for backend development.',
    estimatedHours: 30,
    icon: Database,
    tasks: [
      { id: 't3-1', title: 'SQL fundamentals (SELECT, INSERT, UPDATE, DELETE)', priority: 'HIGH', estimatedHours: 6, completed: false, resourceUrl: 'https://www.postgresqltutorial.com/' },
      { id: 't3-2', title: 'Joins, subqueries, and aggregation', priority: 'HIGH', estimatedHours: 7, completed: false, resourceUrl: 'https://www.postgresqltutorial.com/postgresql-joins/' },
      { id: 't3-3', title: 'Database design and normalization', priority: 'MEDIUM', estimatedHours: 5, completed: false },
      { id: 't3-4', title: 'Indexes and query optimization', priority: 'MEDIUM', estimatedHours: 5, completed: false },
      { id: 't3-5', title: 'Set up PostgreSQL and build a sample schema', priority: 'LOW', estimatedHours: 7, completed: false },
    ],
  },
  {
    id: 'phase-4',
    number: 4,
    title: 'Spring Boot and REST APIs',
    description: 'Build production-ready backend services with Spring Boot and RESTful API design.',
    estimatedHours: 50,
    icon: Server,
    tasks: [
      { id: 't4-1', title: 'Spring Boot project setup and configuration', priority: 'HIGH', estimatedHours: 6, completed: false, resourceUrl: 'https://spring.io/guides/gs/spring-boot/' },
      { id: 't4-2', title: 'REST controller design and best practices', priority: 'HIGH', estimatedHours: 8, completed: false, resourceUrl: 'https://spring.io/guides/gs/rest-service/' },
      { id: 't4-3', title: 'Spring Data JPA and repository patterns', priority: 'HIGH', estimatedHours: 10, completed: false, resourceUrl: 'https://spring.io/guides/gs/accessing-data-jpa/' },
      { id: 't4-4', title: 'DTOs, validation, and exception handling', priority: 'MEDIUM', estimatedHours: 8, completed: false },
      { id: 't4-5', title: 'Build a complete CRUD REST API project', priority: 'HIGH', estimatedHours: 18, completed: false },
    ],
  },
  {
    id: 'phase-5',
    number: 5,
    title: 'Spring Security',
    description: 'Secure your applications with authentication, authorization, and JWT-based tokens.',
    estimatedHours: 25,
    icon: ShieldCheck,
    tasks: [
      { id: 't5-1', title: 'Spring Security basics and filter chain', priority: 'HIGH', estimatedHours: 6, completed: false, resourceUrl: 'https://spring.io/guides/gs/securing-web/' },
      { id: 't5-2', title: 'JWT authentication flow', priority: 'HIGH', estimatedHours: 7, completed: false, resourceUrl: 'https://docs.spring.io/spring-security/reference/' },
      { id: 't5-3', title: 'Role-based authorization', priority: 'MEDIUM', estimatedHours: 5, completed: false },
      { id: 't5-4', title: 'Add JWT auth to your REST API project', priority: 'HIGH', estimatedHours: 7, completed: false },
    ],
  },
  {
    id: 'phase-6',
    number: 6,
    title: 'Docker and Testing',
    description: 'Containerize your applications and write reliable tests with JUnit and MockMvc.',
    estimatedHours: 30,
    icon: Container,
    tasks: [
      { id: 't6-1', title: 'Docker fundamentals and Dockerfile', priority: 'HIGH', estimatedHours: 6, completed: false, resourceUrl: 'https://docs.docker.com/get-started/' },
      { id: 't6-2', title: 'Docker Compose for multi-container apps', priority: 'MEDIUM', estimatedHours: 5, completed: false, resourceUrl: 'https://docs.docker.com/compose/' },
      { id: 't6-3', title: 'JUnit 5 unit testing', priority: 'HIGH', estimatedHours: 7, completed: false, resourceUrl: 'https://junit.org/junit5/docs/current/user-guide/' },
      { id: 't6-4', title: 'MockMvc integration testing', priority: 'MEDIUM', estimatedHours: 6, completed: false },
      { id: 't6-5', title: 'Containerize your REST API with Docker', priority: 'LOW', estimatedHours: 6, completed: false },
    ],
  },
  {
    id: 'phase-7',
    number: 7,
    title: 'Backend Project Development',
    description: 'Build a portfolio-worthy backend project that demonstrates all learned skills.',
    estimatedHours: 40,
    icon: FolderGit2,
    tasks: [
      { id: 't7-1', title: 'Design the project architecture and database schema', priority: 'HIGH', estimatedHours: 6, completed: false },
      { id: 't7-2', title: 'Implement core API endpoints', priority: 'HIGH', estimatedHours: 14, completed: false },
      { id: 't7-3', title: 'Add authentication and authorization', priority: 'HIGH', estimatedHours: 8, completed: false },
      { id: 't7-4', title: 'Write comprehensive tests', priority: 'MEDIUM', estimatedHours: 6, completed: false },
      { id: 't7-5', title: 'Containerize and document the project', priority: 'MEDIUM', estimatedHours: 6, completed: false },
    ],
  },
]

const targetRole = 'Java Backend Developer'

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
  const [phases, setPhases] = useState<LearningPhase[]>(initialPhases)

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
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Learning Roadmap</h1>
          <Badge variant="muted">Demo Data</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          A personalized, phased learning plan based on your skill gaps and target role.
        </p>
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
                <p className="text-sm font-semibold text-foreground">{targetRole}</p>
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
