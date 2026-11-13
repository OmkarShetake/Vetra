import { useState, useRef, useCallback, useMemo } from 'react'
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
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn, formatPercent } from '@/lib/utils'
import type { SkillCategory } from '@/types'

// ---------------------------------------------------------------------------
// Types & demo data
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

const skillNodes: SkillNode[] = [
  {
    id: 'java',
    label: 'Java',
    category: 'LANGUAGE',
    x: 130,
    y: 300,
    description:
      'Core Java programming language: syntax, types, control flow, and the JVM ecosystem. The foundation of the Java backend path.',
    prerequisites: [],
    relatedSkills: ['OOP', 'Collections', 'Exception Handling', 'Multithreading', 'JDBC'],
    roleRelevance: ['Java Backend Developer', 'Software Engineer', 'Spring Boot Developer'],
    demandLevel: 92,
  },
  {
    id: 'oop',
    label: 'OOP',
    category: 'CONCEPT',
    x: 280,
    y: 215,
    description:
      'Object-oriented programming principles: encapsulation, inheritance, polymorphism, and abstraction applied in Java.',
    prerequisites: ['java'],
    relatedSkills: ['Java', 'Collections', 'Spring Framework'],
    roleRelevance: ['Java Backend Developer', 'Software Engineer'],
    demandLevel: 88,
  },
  {
    id: 'collections',
    label: 'Collections',
    category: 'CONCEPT',
    x: 280,
    y: 370,
    description:
      'Java Collections Framework: List, Set, Map, Queue, and their implementations, performance characteristics, and use cases.',
    prerequisites: ['java'],
    relatedSkills: ['Java', 'OOP', 'JDBC'],
    roleRelevance: ['Java Backend Developer', 'Software Engineer'],
    demandLevel: 85,
  },
  {
    id: 'exception-handling',
    label: 'Exception Handling',
    category: 'CONCEPT',
    x: 130,
    y: 470,
    description:
      'Try-catch-finally, checked vs unchecked exceptions, custom exceptions, and robust error handling strategies.',
    prerequisites: ['java'],
    relatedSkills: ['Java', 'Multithreading'],
    roleRelevance: ['Java Backend Developer', 'Software Engineer'],
    demandLevel: 78,
  },
  {
    id: 'multithreading',
    label: 'Multithreading',
    category: 'CONCEPT',
    x: 290,
    y: 500,
    description:
      'Concurrency in Java: threads, synchronization, executors, concurrent collections, and thread safety.',
    prerequisites: ['java'],
    relatedSkills: ['Java', 'Exception Handling', 'Collections'],
    roleRelevance: ['Java Backend Developer', 'Software Engineer'],
    demandLevel: 80,
  },
  {
    id: 'jdbc',
    label: 'JDBC',
    category: 'TOOL',
    x: 430,
    y: 300,
    description:
      'Java Database Connectivity API for connecting Java applications to relational databases and executing SQL.',
    prerequisites: ['java', 'sql'],
    relatedSkills: ['Java', 'SQL', 'Spring Framework', 'PostgreSQL'],
    roleRelevance: ['Java Backend Developer', 'Software Engineer'],
    demandLevel: 72,
  },
  {
    id: 'sql',
    label: 'SQL',
    category: 'LANGUAGE',
    x: 130,
    y: 120,
    description:
      'Structured Query Language for querying and managing relational databases: joins, aggregates, subqueries, and indexing.',
    prerequisites: [],
    relatedSkills: ['JDBC', 'PostgreSQL'],
    roleRelevance: ['Java Backend Developer', 'Software Engineer', 'Data Engineer'],
    demandLevel: 90,
  },
  {
    id: 'spring-framework',
    label: 'Spring Framework',
    category: 'FRAMEWORK',
    x: 560,
    y: 230,
    description:
      'Spring core concepts: IoC, DI, AOP, and the application context for building enterprise Java applications.',
    prerequisites: ['java', 'oop'],
    relatedSkills: ['Spring Boot', 'JDBC', 'REST APIs', 'Spring Security'],
    roleRelevance: ['Spring Boot Developer', 'Java Backend Developer'],
    demandLevel: 86,
  },
  {
    id: 'spring-boot',
    label: 'Spring Boot',
    category: 'FRAMEWORK',
    x: 700,
    y: 320,
    description:
      'Opinionated framework on top of Spring for building stand-alone, production-grade applications with auto-configuration.',
    prerequisites: ['spring-framework'],
    relatedSkills: ['Spring Framework', 'REST APIs', 'Spring Security', 'PostgreSQL', 'Redis', 'Kafka'],
    roleRelevance: ['Spring Boot Developer', 'Java Backend Developer'],
    demandLevel: 84,
  },
  {
    id: 'rest-apis',
    label: 'REST APIs',
    category: 'CONCEPT',
    x: 830,
    y: 225,
    description:
      'Designing and building RESTful web services: HTTP methods, status codes, resource modeling, and API versioning.',
    prerequisites: ['spring-boot'],
    relatedSkills: ['Spring Boot', 'Spring Security', 'Spring Framework'],
    roleRelevance: ['Java Backend Developer', 'Spring Boot Developer', 'Software Engineer'],
    demandLevel: 87,
  },
  {
    id: 'spring-security',
    label: 'Spring Security',
    category: 'FRAMEWORK',
    x: 830,
    y: 380,
    description:
      'Authentication and authorization for Spring applications: filters, security context, JWT, OAuth2, and role-based access.',
    prerequisites: ['spring-boot', 'rest-apis'],
    relatedSkills: ['Spring Boot', 'REST APIs'],
    roleRelevance: ['Spring Boot Developer', 'Java Backend Developer'],
    demandLevel: 74,
  },
  {
    id: 'postgresql',
    label: 'PostgreSQL',
    category: 'DATABASE',
    x: 560,
    y: 440,
    description:
      'Powerful open-source relational database with advanced features: JSON support, indexing, transactions, and concurrency.',
    prerequisites: ['sql'],
    relatedSkills: ['SQL', 'Spring Boot', 'JDBC', 'Redis'],
    roleRelevance: ['Java Backend Developer', 'Software Engineer'],
    demandLevel: 79,
  },
  {
    id: 'redis',
    label: 'Redis',
    category: 'DATABASE',
    x: 710,
    y: 470,
    description:
      'In-memory data structure store used as a cache, message broker, and session store for high-performance applications.',
    prerequisites: [],
    relatedSkills: ['Spring Boot', 'PostgreSQL', 'Kafka'],
    roleRelevance: ['Spring Boot Developer', 'Java Backend Developer'],
    demandLevel: 68,
  },
  {
    id: 'kafka',
    label: 'Kafka',
    category: 'TOOL',
    x: 430,
    y: 130,
    description:
      'Distributed event streaming platform for building real-time data pipelines and event-driven microservices.',
    prerequisites: [],
    relatedSkills: ['Spring Boot', 'Redis', 'Docker'],
    roleRelevance: ['Java Backend Developer', 'Spring Boot Developer'],
    demandLevel: 65,
  },
  {
    id: 'docker',
    label: 'Docker',
    category: 'TOOL',
    x: 830,
    y: 500,
    description:
      'Containerization platform for packaging, shipping, and running applications consistently across environments.',
    prerequisites: [],
    relatedSkills: ['Spring Boot', 'Kafka', 'Git'],
    roleRelevance: ['Java Backend Developer', 'Spring Boot Developer', 'Software Engineer', 'Cloud & DevOps'],
    demandLevel: 70,
  },
  {
    id: 'git',
    label: 'Git',
    category: 'TOOL',
    x: 120,
    y: 200,
    description:
      'Distributed version control system: branching, merging, rebasing, and collaborative workflows.',
    prerequisites: [],
    relatedSkills: ['Docker', 'Java', 'React'],
    roleRelevance: ['Java Backend Developer', 'Software Engineer', 'Frontend Developer', 'Cloud & DevOps'],
    demandLevel: 95,
  },
  {
    id: 'testing',
    label: 'Testing',
    category: 'CONCEPT',
    x: 290,
    y: 130,
    description:
      'Software testing practices in Java: unit testing with JUnit, mocking with Mockito, and integration testing.',
    prerequisites: ['java'],
    relatedSkills: ['Java', 'Spring Boot', 'Git'],
    roleRelevance: ['Java Backend Developer', 'Software Engineer'],
    demandLevel: 82,
  },
  // Multi-Track Additions
  {
    id: 'react',
    label: 'React',
    category: 'FRAMEWORK',
    x: 430,
    y: 40,
    description: 'Component-based UI library for modern web applications: hooks, virtual DOM, and component composition.',
    prerequisites: ['javascript'],
    relatedSkills: ['TypeScript', 'Next.js', 'Tailwind CSS', 'REST APIs'],
    roleRelevance: ['Frontend Developer', 'Full Stack Developer'],
    demandLevel: 94,
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    category: 'LANGUAGE',
    x: 280,
    y: 40,
    description: 'Typed superset of JavaScript providing static types, interfaces, generics, and compiler safety.',
    prerequisites: [],
    relatedSkills: ['React', 'Next.js', 'REST APIs'],
    roleRelevance: ['Frontend Developer', 'Full Stack Developer'],
    demandLevel: 91,
  },
  {
    id: 'kubernetes',
    label: 'Kubernetes',
    category: 'PLATFORM',
    x: 700,
    y: 570,
    description: 'Container orchestration platform for automating deployment, scaling, and operations of application containers.',
    prerequisites: ['docker'],
    relatedSkills: ['Docker', 'AWS', 'CI/CD Pipelines'],
    roleRelevance: ['Cloud / DevOps Engineer', 'Software Engineer'],
    demandLevel: 86,
  },
  {
    id: 'python',
    label: 'Python',
    category: 'LANGUAGE',
    x: 560,
    y: 40,
    description: 'General-purpose programming language dominant in AI/ML, data engineering, automation, and backend APIs.',
    prerequisites: [],
    relatedSkills: ['FastAPI', 'Pandas', 'SQL'],
    roleRelevance: ['AI / Machine Learning Engineer', 'Data Engineer'],
    demandLevel: 93,
  },
]

const skillEdges: SkillEdge[] = [
  { source: 'java', target: 'oop', type: 'PREREQUISITE' },
  { source: 'java', target: 'collections', type: 'PREREQUISITE' },
  { source: 'java', target: 'exception-handling', type: 'PREREQUISITE' },
  { source: 'java', target: 'multithreading', type: 'PREREQUISITE' },
  { source: 'java', target: 'jdbc', type: 'REQUIRES' },
  { source: 'java', target: 'testing', type: 'PREREQUISITE' },
  { source: 'oop', target: 'spring-framework', type: 'PREREQUISITE' },
  { source: 'collections', target: 'jdbc', type: 'RELATED' },
  { source: 'sql', target: 'jdbc', type: 'PREREQUISITE' },
  { source: 'jdbc', target: 'spring-framework', type: 'RELATED' },
  { source: 'spring-framework', target: 'spring-boot', type: 'PREREQUISITE' },
  { source: 'spring-boot', target: 'rest-apis', type: 'PREREQUISITE' },
  { source: 'spring-boot', target: 'spring-security', type: 'PREREQUISITE' },
  { source: 'rest-apis', target: 'spring-security', type: 'RELATED' },
  { source: 'sql', target: 'postgresql', type: 'PREREQUISITE' },
  { source: 'spring-boot', target: 'postgresql', type: 'RELATED' },
  { source: 'spring-boot', target: 'redis', type: 'RELATED' },
  { source: 'spring-boot', target: 'kafka', type: 'RELATED' },
  { source: 'docker', target: 'spring-boot', type: 'RELATED' },
  { source: 'git', target: 'java', type: 'RELATED' },
  { source: 'testing', target: 'spring-boot', type: 'RELATED' },
  // Multi-track edges
  { source: 'typescript', target: 'react', type: 'PREREQUISITE' },
  { source: 'react', target: 'rest-apis', type: 'RELATED' },
  { source: 'docker', target: 'kubernetes', type: 'PREREQUISITE' },
  { source: 'python', target: 'sql', type: 'RELATED' },
]

const VIEWBOX_W = 900
const VIEWBOX_H = 600
const MIN_SCALE = 0.5
const MAX_SCALE = 2.5

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SkillExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)
  const [highlightMySkills, setHighlightMySkills] = useState(true)

  const candidateSkills = useMemo(() => {
    try {
      const raw = localStorage.getItem('vetra_latest_resume_analysis')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed?.extractedSkills)) {
          return new Set(parsed.extractedSkills.map((s: string) => s.toLowerCase()))
        }
      }
    } catch {}
    return new Set(['java', 'spring boot', 'rest apis', 'sql', 'git', 'postgresql', 'docker', 'oop'])
  }, [])

  const svgRef = useRef<SVGSVGElement>(null)
  const dragState = useRef<{
    isDragging: boolean
    startX: number
    startY: number
    startTx: number
    startTy: number
  }>({ isDragging: false, startX: 0, startY: 0, startTx: 0, startTy: 0 })

  const selectedNode = useMemo(
    () => skillNodes.find((n) => n.id === selectedNodeId) ?? null,
    [selectedNodeId],
  )

  const matchedNodeIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set(skillNodes.map((n) => n.id))
    const q = searchQuery.toLowerCase()
    return new Set(
      skillNodes.filter((n) => n.label.toLowerCase().includes(q)).map((n) => n.id),
    )
  }, [searchQuery])

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
    toast.info('Reset graph view')
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
    toast.success(`Selected "${node.label}"`, { description: node.description.slice(0, 90) + '…' })
  }

  const transform = `translate(${tx}, ${ty}) scale(${scale})`
  const isSearching = searchQuery.trim() !== ''

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Network className="h-6 w-6 text-violet" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Skill Explorer</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Explore how technologies connect. Click a node to see prerequisites, related skills, and
          demand.
        </p>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search skills to highlight…"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={highlightMySkills ? "teal" : "outline"}
            size="sm"
            onClick={() => setHighlightMySkills(h => !h)}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {highlightMySkills ? "My Verified Skills: ON" : "Overlay My Skills"}
          </Button>
          <Badge variant="outline" className="border-indigo/30 bg-indigo/10 text-indigo text-xs">
            Interactive DAG
          </Badge>
        </div>
      </div>

      {/* Graph + Detail Panel */}
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* Graph area */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Skill Graph</CardTitle>
                <CardDescription className="text-xs">
                  Java Backend learning path — drag to pan, click nodes to inspect
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
              className="relative aspect-[3/2] w-full cursor-grab bg-muted/30 bg-dot select-none"
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
                  {skillEdges.map((edge, idx) => {
                    const source = skillNodes.find((n) => n.id === edge.source)
                    const target = skillNodes.find((n) => n.id === edge.target)
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
                        opacity={active ? (edge.type === 'PREREQUISITE' ? 0.55 : 0.4) : 0.12}
                        className="transition-opacity duration-200"
                      />
                    )
                  })}

                  {/* Nodes */}
                  {skillNodes.map((node) => {
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
                          fontSize={13}
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
                Click a node · drag to pan
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detail Panel */}
        <div className="space-y-4">
          {selectedNode ? (
            <Card className="animate-slide-in-right">
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
                            <AlertTriangle className="h-3 w-3" /> Skill Gap
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
                <p className="text-sm text-muted-foreground">{selectedNode.description}</p>

                <Separator />

                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <Link2 className="h-3.5 w-3.5" />
                    Prerequisites
                  </p>
                  {selectedNode.prerequisites.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.prerequisites.map((preId) => {
                        const pre = skillNodes.find((n) => n.id === preId)
                        return pre ? (
                          <Badge
                            key={preId}
                            variant="outline"
                            className="cursor-pointer hover:bg-muted"
                            onClick={() => setSelectedNodeId(preId)}
                          >
                            {pre.label}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No prerequisites — a foundational skill.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <Network className="h-3.5 w-3.5" />
                    Related Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.relatedSkills.map((related) => {
                      const rn = skillNodes.find(
                        (n) => n.label === related || n.id === related.toLowerCase().replace(/\s+/g, '-'),
                      )
                      return (
                        <Badge
                          key={related}
                          variant="muted"
                          className={cn(rn && 'cursor-pointer hover:bg-border')}
                          onClick={() => rn && setSelectedNodeId(rn.id)}
                        >
                          {related}
                        </Badge>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Role Relevance
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.roleRelevance.map((role) => (
                      <Badge key={role} variant="info">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Market Demand
                    </Label>
                    <span className="text-sm font-semibold text-foreground">
                      {formatPercent(selectedNode.demandLevel)}
                    </span>
                  </div>
                  <Progress value={selectedNode.demandLevel} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet/10">
                  <MousePointerClick className="h-7 w-7 text-violet" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">Select a skill node</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Click any node in the graph to see its details, prerequisites, and demand.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {LEGEND_ITEMS.map((item) => (
                <div key={item.category} className="flex items-center gap-2.5">
                  <span
                    className="h-3.5 w-3.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
                  />
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-block h-0.5 w-6" style={{ backgroundColor: '#2563EB' }} />
                <span>Solid = prerequisite</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className="inline-block h-0.5 w-6"
                  style={{ backgroundColor: '#C9CCD4', backgroundImage: 'repeating-linear-gradient(90deg,#C9CCD4 0 4px,transparent 4px 8px)' }}
                />
                <span>Dashed = related</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
