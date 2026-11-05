import { useState } from 'react'
import {
  Target,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Link2,
  FileText,
  TrendingUp,
  Award,
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from 'recharts'
import { cn, formatPercent } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SkillGapStatus = 'DEMONSTRATED' | 'PARTIALLY_DEMONSTRATED' | 'NOT_DEMONSTRATED'
type Importance = 'CRITICAL' | 'IMPORTANT' | 'BENEFICIAL'

interface SkillGapItem {
  skillName: string
  status: SkillGapStatus
  importance: Importance
  evidenceCount: number
  evidenceDescription: string
  explanation: string
  prerequisites: string[]
}

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------

const targetRoles = [
  'Java Backend Developer',
  'Software Engineer',
  'Spring Boot Developer',
]

const demoSkills: SkillGapItem[] = [
  {
    skillName: 'Java',
    status: 'DEMONSTRATED',
    importance: 'CRITICAL',
    evidenceCount: 3,
    evidenceDescription: 'Library Management System, REST API project, coursework',
    explanation: 'Strong evidence from multiple projects and verified assessment. Core Java proficiency is clearly demonstrated.',
    prerequisites: [],
  },
  {
    skillName: 'Spring Boot',
    status: 'PARTIALLY_DEMONSTRATED',
    importance: 'CRITICAL',
    evidenceCount: 1,
    evidenceDescription: 'Basic REST API with Spring Boot (incomplete)',
    explanation: 'One project shows basic usage, but lacks depth in configuration, security, and production patterns. More comprehensive projects needed.',
    prerequisites: ['Java', 'Maven'],
  },
  {
    skillName: 'PostgreSQL',
    status: 'PARTIALLY_DEMONSTRATED',
    importance: 'IMPORTANT',
    evidenceCount: 1,
    evidenceDescription: 'Used in coursework database project',
    explanation: 'Basic CRUD operations demonstrated, but no evidence of complex queries, indexing, or performance optimization.',
    prerequisites: ['SQL'],
  },
  {
    skillName: 'REST APIs',
    status: 'DEMONSTRATED',
    importance: 'CRITICAL',
    evidenceCount: 2,
    evidenceDescription: 'REST API project, Spring Boot REST endpoints',
    explanation: 'Multiple projects demonstrate RESTful design principles, proper status codes, and API documentation.',
    prerequisites: ['Java', 'HTTP'],
  },
  {
    skillName: 'Docker',
    status: 'NOT_DEMONSTRATED',
    importance: 'IMPORTANT',
    evidenceCount: 0,
    evidenceDescription: 'No evidence found',
    explanation: 'No projects or coursework mention Docker or containerization. This is increasingly required in backend roles.',
    prerequisites: ['Linux basics'],
  },
  {
    skillName: 'Git',
    status: 'DEMONSTRATED',
    importance: 'IMPORTANT',
    evidenceCount: 2,
    evidenceDescription: 'GitHub profile with 8 repositories, branching workflow',
    explanation: 'Active GitHub presence with consistent commit history and proper branching strategy demonstrates version control proficiency.',
    prerequisites: [],
  },
  {
    skillName: 'Spring Security',
    status: 'NOT_DEMONSTRATED',
    importance: 'CRITICAL',
    evidenceCount: 0,
    evidenceDescription: 'No evidence found',
    explanation: 'No projects implement authentication or authorization. Security is a critical requirement for backend roles.',
    prerequisites: ['Spring Boot', 'Java'],
  },
  {
    skillName: 'Hibernate',
    status: 'PARTIALLY_DEMONSTRATED',
    importance: 'BENEFICIAL',
    evidenceCount: 1,
    evidenceDescription: 'Basic entity mapping in coursework project',
    explanation: 'Simple entity relationships are shown, but no evidence of complex mappings, caching, or query optimization.',
    prerequisites: ['Java', 'SQL'],
  },
  {
    skillName: 'JUnit',
    status: 'PARTIALLY_DEMONSTRATED',
    importance: 'IMPORTANT',
    evidenceCount: 1,
    evidenceDescription: 'Basic unit tests in one project',
    explanation: 'Unit tests exist but coverage is limited and no integration or mock testing is demonstrated.',
    prerequisites: ['Java'],
  },
  {
    skillName: 'Microservices',
    status: 'NOT_DEMONSTRATED',
    importance: 'BENEFICIAL',
    evidenceCount: 0,
    evidenceDescription: 'No evidence found',
    explanation: 'No projects demonstrate microservices architecture. Beneficial for scaling knowledge but not always required at entry level.',
    prerequisites: ['Spring Boot', 'Docker'],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function statusBadgeVariant(status: SkillGapStatus) {
  switch (status) {
    case 'DEMONSTRATED':
      return 'teal' as const
    case 'PARTIALLY_DEMONSTRATED':
      return 'amber' as const
    case 'NOT_DEMONSTRATED':
      return 'coral' as const
  }
}

function statusIcon(status: SkillGapStatus) {
  switch (status) {
    case 'DEMONSTRATED':
      return <CheckCircle2 className="h-4 w-4 text-teal" />
    case 'PARTIALLY_DEMONSTRATED':
      return <AlertTriangle className="h-4 w-4 text-amber" />
    case 'NOT_DEMONSTRATED':
      return <XCircle className="h-4 w-4 text-coral" />
  }
}

function statusLabel(status: SkillGapStatus) {
  switch (status) {
    case 'DEMONSTRATED':
      return 'Demonstrated'
    case 'PARTIALLY_DEMONSTRATED':
      return 'Partial'
    case 'NOT_DEMONSTRATED':
      return 'Missing'
  }
}

function importanceBadgeVariant(importance: Importance) {
  switch (importance) {
    case 'CRITICAL':
      return 'coral' as const
    case 'IMPORTANT':
      return 'amber' as const
    case 'BENEFICIAL':
      return 'info' as const
  }
}

// Weighted score: Critical=3x, Important=2x, Beneficial=1x
// Demonstrated=full weight, Partial=0.5, Missing=0
function calculateScore(skills: SkillGapItem[]): number {
  let totalWeight = 0
  let earnedWeight = 0
  for (const skill of skills) {
    const weight = skill.importance === 'CRITICAL' ? 3 : skill.importance === 'IMPORTANT' ? 2 : 1
    totalWeight += weight
    if (skill.status === 'DEMONSTRATED') earnedWeight += weight
    else if (skill.status === 'PARTIALLY_DEMONSTRATED') earnedWeight += weight * 0.5
  }
  return totalWeight === 0 ? 0 : Math.round((earnedWeight / totalWeight) * 100)
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export function SkillGapAnalysisPage() {
  const [selectedRole, setSelectedRole] = useState<string>(targetRoles[0])
  const [hasRun, setHasRun] = useState(true) // show demo data by default

  const overallScore = calculateScore(demoSkills)
  const demonstratedCount = demoSkills.filter((s) => s.status === 'DEMONSTRATED').length
  const partialCount = demoSkills.filter((s) => s.status === 'PARTIALLY_DEMONSTRATED').length
  const notDemonstratedCount = demoSkills.filter((s) => s.status === 'NOT_DEMONSTRATED').length

  const radialData = [{ name: 'score', value: overallScore, fill: '#2563EB' }]

  const handleRunAnalysis = () => {
    setHasRun(true)
    toast.success('Analysis complete', {
      description: `Skill gap analysis for ${selectedRole} is ready.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Skill Gap Analysis</h1>
          <Badge variant="muted">Demo Data</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Compare your demonstrated skills against your target role requirements.
        </p>
      </div>

      {/* Role selector + run button */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2 sm:max-w-md">
            <label className="text-sm font-medium text-foreground">Target Role</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a target role" />
              </SelectTrigger>
              <SelectContent>
                {targetRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleRunAnalysis}>
            <Play className="h-4 w-4" />
            Run Analysis
          </Button>
        </CardContent>
      </Card>

      {hasRun && (
        <>
          {/* Overall score + summary cards */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Overall match score with RadialBarChart */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base">Overall Match Score</CardTitle>
                <CardDescription>Weighted by skill importance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="relative h-48 w-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="100%"
                        data={radialData}
                        startAngle={90}
                        endAngle={90 - (overallScore / 100) * 360}
                      >
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'var(--color-muted)' }} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-foreground">{overallScore}</span>
                      <span className="text-sm text-muted-foreground">out of 100</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4 text-indigo" />
                  Target: {selectedRole}
                </div>
              </CardContent>
            </Card>

            {/* Summary cards */}
            <div className="grid gap-4 lg:col-span-2 sm:grid-cols-3">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10">
                      <CheckCircle2 className="h-5 w-5 text-teal" />
                    </div>
                    <span className="text-3xl font-bold text-teal">{demonstratedCount}</span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-foreground">Demonstrated</p>
                  <p className="text-xs text-muted-foreground">Skills with verified evidence</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10">
                      <AlertTriangle className="h-5 w-5 text-amber" />
                    </div>
                    <span className="text-3xl font-bold text-amber">{partialCount}</span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-foreground">Partially Demonstrated</p>
                  <p className="text-xs text-muted-foreground">Skills needing more evidence</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-coral/10">
                      <XCircle className="h-5 w-5 text-coral" />
                    </div>
                    <span className="text-3xl font-bold text-coral">{notDemonstratedCount}</span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-foreground">Not Demonstrated</p>
                  <p className="text-xs text-muted-foreground">Skills with no evidence</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Info card */}
          <Card className="border-sky/30 bg-sky/5">
            <CardContent className="flex items-start gap-3 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky/10">
                <Info className="h-5 w-5 text-sky" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">How the match score is calculated</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  The match score is calculated by weighting each skill by its importance level. Critical skills
                  contribute 3x, Important 2x, Beneficial 1x. The score represents the proportion of required skill
                  weight you have demonstrated with evidence.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed skill gaps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Detailed Skill Analysis</h2>
              <Badge variant="muted">{demoSkills.length} skills</Badge>
            </div>
            <div className="space-y-3">
              {demoSkills.map((skill, index) => (
                <Card key={skill.skillName}>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      {/* Left: skill name + badges */}
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-2">
                            {statusIcon(skill.status)}
                            <span className="text-base font-semibold text-foreground">{skill.skillName}</span>
                          </div>
                          <Badge variant={statusBadgeVariant(skill.status)}>
                            {statusLabel(skill.status)}
                          </Badge>
                          <Badge variant={importanceBadgeVariant(skill.importance)}>
                            {skill.importance}
                          </Badge>
                        </div>

                        {/* Evidence */}
                        <div className="flex items-start gap-6">
                          <div className="flex items-center gap-1.5">
                            <Award className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Evidence:</span>
                            <span className="text-sm font-medium text-foreground">{skill.evidenceCount}</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                            <span className="text-sm text-muted-foreground">{skill.evidenceDescription}</span>
                          </div>
                        </div>

                        <Separator />

                        {/* Explanation */}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Explanation</p>
                          <p className="mt-1 text-sm text-foreground">{skill.explanation}</p>
                        </div>

                        {/* Prerequisites */}
                        {skill.prerequisites.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Prerequisites:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {skill.prerequisites.map((prereq) => (
                                <Badge key={prereq} variant="outline">{prereq}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: evidence count visual */}
                      <div className="flex shrink-0 flex-col items-center gap-1 rounded-lg border border-border bg-muted/50 px-4 py-3">
                        <span className="text-2xl font-bold text-foreground">{skill.evidenceCount}</span>
                        <span className="text-xs text-muted-foreground">
                          {skill.evidenceCount === 1 ? 'piece of' : 'pieces of'} evidence
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
