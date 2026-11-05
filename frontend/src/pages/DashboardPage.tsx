import { Link } from 'react-router-dom'
import {
  TrendingUp, ShieldCheck, Target, FileText, GraduationCap,
  ArrowRight, Briefcase, AlertCircle, CheckCircle2, Clock,
  Code2, Database, Server, GitBranch, BarChart3, Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, RadialBarChart, RadialBar,
} from 'recharts'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

// Demo data — clearly labeled
const careerReadiness = 72
const targetRole = 'Java Backend Developer'
const demonstratedSkills = ['Java', 'OOP', 'SQL', 'Git', 'REST APIs', 'PostgreSQL']
const skillsNeedingImprovement = ['Spring Boot', 'Docker', 'Spring Security']

const demandChart = [
  { skill: 'Java', demand: 89 },
  { skill: 'Spring Boot', demand: 76 },
  { skill: 'REST APIs', demand: 82 },
  { skill: 'PostgreSQL', demand: 71 },
  { skill: 'Docker', demand: 68 },
  { skill: 'Git', demand: 95 },
]

const mostDemandedSkills = [
  { name: 'Java', demandScore: 89, trend: 'up' as const },
  { name: 'Spring Boot', demandScore: 76, trend: 'up' as const },
  { name: 'REST APIs', demandScore: 82, trend: 'stable' as const },
  { name: 'PostgreSQL', demandScore: 71, trend: 'stable' as const },
  { name: 'Docker', demandScore: 68, trend: 'up' as const },
  { name: 'Git', demandScore: 95, trend: 'stable' as const },
]

const recentInsights = [
  { id: '1', title: 'Spring Boot appears in 76% of analyzed JDs', description: 'High demand for Spring Boot in backend roles', date: '2024-01-15' },
  { id: '2', title: 'Docker is increasingly required', description: 'Containerization skills trending upward in job postings', date: '2024-01-14' },
  { id: '3', title: 'REST API design is a core requirement', description: '82% of backend jobs require REST API knowledge', date: '2024-01-13' },
]

const recommendedActions = [
  { id: '1', title: 'Upload your resume', description: 'Get a detailed analysis of your resume structure and skill coverage', priority: 'HIGH', link: '/resume-studio' },
  { id: '2', title: 'Complete Spring Boot assessment', description: 'Verify your Spring Boot knowledge with a structured assessment', priority: 'MEDIUM', link: '/assessments' },
  { id: '3', title: 'Add project evidence', description: 'Link your GitHub repos to demonstrate practical skills', priority: 'MEDIUM', link: '/evidence-portfolio' },
  { id: '4', title: 'Import a job description', description: 'Analyze a specific job to see how your skills match', priority: 'HIGH', link: '/job-intelligence' },
]

const learningProgress = { completedTasks: 8, totalTasks: 24, percentage: 33 }

const readinessData = [
  { name: 'Readiness', value: careerReadiness, fill: '#2563EB' },
]

export function DashboardPage() {
  const { user } = useAuth()
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="text-2xl font-bold text-foreground">{user?.fullName || 'Welcome'}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's your career intelligence overview for <span className="font-medium text-foreground">{targetRole}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/job-intelligence">
              <Briefcase className="h-4 w-4" />
              Import JD
            </Link>
          </Button>
          <Button variant="gradient" size="sm" asChild>
            <Link to="/resume-studio">
              <FileText className="h-4 w-4" />
              Analyze Resume
            </Link>
          </Button>
        </div>
      </div>

      {/* Career Readiness Overview */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Career Readiness Overview</CardTitle>
                <CardDescription>How your evidence-backed skills align with your target role</CardDescription>
              </div>
              <Badge variant="default" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Demo Data
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid items-center gap-6 sm:grid-cols-[200px_1fr]">
              {/* Radial chart */}
              <div className="relative flex items-center justify-center">
                <ResponsiveContainer width={200} height={200}>
                  <RadialBarChart
                    data={readinessData}
                    startAngle={90}
                    endAngle={90 - 360}
                    innerRadius="70%"
                    outerRadius="100%"
                  >
                    <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'var(--color-muted)' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold text-foreground">{careerReadiness}</span>
                  <span className="text-xs text-muted-foreground">out of 100</span>
                </div>
              </div>

              {/* Explanation */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground">How this score is calculated</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    The readiness score is a weighted measure of your demonstrated skills against the
                    requirements of your target role. Critical skills (like Java and Spring Boot) carry
                    more weight than beneficial ones. Only skills with verified evidence contribute fully.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-border p-2">
                    <p className="text-xs text-muted-foreground">Demonstrated</p>
                    <p className="text-lg font-bold text-teal">{demonstratedSkills.length}</p>
                  </div>
                  <div className="rounded-lg border border-border p-2">
                    <p className="text-xs text-muted-foreground">Partial</p>
                    <p className="text-lg font-bold text-amber">2</p>
                  </div>
                  <div className="rounded-lg border border-border p-2">
                    <p className="text-xs text-muted-foreground">Missing</p>
                    <p className="text-lg font-bold text-coral">4</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target Role Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Target Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo" />
                <p className="font-medium text-foreground">{targetRole}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Demonstrated Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {demonstratedSkills.map((skill) => (
                  <Badge key={skill} variant="teal" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Needs Improvement</p>
              <div className="flex flex-wrap gap-1.5">
                {skillsNeedingImprovement.map((skill) => (
                  <Badge key={skill} variant="amber" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Skills Demonstrated', value: '14', icon: ShieldCheck, color: 'text-teal', bg: 'bg-teal/10' },
          { label: 'Skills Needing Work', value: '6', icon: Target, color: 'text-amber', bg: 'bg-amber/10' },
          { label: 'Resume Analyses', value: '2', icon: FileText, color: 'text-indigo', bg: 'bg-indigo/10' },
          { label: 'Learning Tasks Done', value: '8/24', icon: GraduationCap, color: 'text-sky', bg: 'bg-sky/10' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', stat.bg)}>
                <stat.icon className={cn('h-5 w-5', stat.color)} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Industry Demand Chart */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Industry Demand</CardTitle>
                <CardDescription>Skill demand from analyzed job descriptions</CardDescription>
              </div>
              <Badge variant="info" className="gap-1">
                <BarChart3 className="h-3 w-3" />
                Demo Data
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={demandChart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="skill" tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="demand" radius={[6, 6, 0, 0]}>
                  {demandChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563EB' : '#3B82F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most Demanded Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most Demanded Technical Skills</CardTitle>
            <CardDescription>For your target role: {targetRole}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mostDemandedSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      {skill.trend === 'up' && <TrendingUp className="h-3.5 w-3.5 text-teal" />}
                      <span className="text-sm font-medium text-muted-foreground">{skill.demandScore}%</span>
                    </div>
                  </div>
                  <Progress value={skill.demandScore} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Insights & Recommended Actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Job Market Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Job Market Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentInsights.map((insight) => (
              <div key={insight.id} className="flex gap-3 rounded-lg border border-border p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo/10">
                  <Briefcase className="h-4 w-4 text-indigo" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{insight.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{insight.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{insight.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended Next Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recommended Next Actions</CardTitle>
            <CardDescription>Steps to improve your career readiness</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendedActions.map((action) => (
              <Link
                key={action.id}
                to={action.link}
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
              >
                <div className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  action.priority === 'HIGH' ? 'bg-coral/10' : 'bg-amber/10',
                )}>
                  {action.priority === 'HIGH' ? (
                    <AlertCircle className="h-4 w-4 text-coral" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{action.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress & Recent Resume Analyses */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Learning Progress</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/learning-roadmap">
                  View Roadmap
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="var(--color-muted)" strokeWidth="6" />
                  <circle
                    cx="40" cy="40" r="34" fill="none" stroke="#2563EB" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 34 * learningProgress.percentage / 100} ${2 * Math.PI * 34}`}
                  />
                </svg>
                <span className="absolute text-lg font-bold text-foreground">{learningProgress.percentage}%</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {learningProgress.completedTasks} of {learningProgress.totalTasks} tasks completed
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  You're making good progress on your Java Backend Developer roadmap.
                  Keep going to improve your readiness score.
                </p>
                <div className="mt-3 flex gap-2">
                  <Badge variant="teal" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Java Core
                  </Badge>
                  <Badge variant="amber" className="gap-1">
                    <Clock className="h-3 w-3" />
                    OOP & Collections
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Resume Analyses</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/resume-studio">
                  Open Studio
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { id: '1', fileName: 'resume_v2.pdf', score: 68, date: 'Jan 15, 2024' },
              { id: '2', fileName: 'resume_v1.pdf', score: 54, date: 'Jan 10, 2024' },
            ].map((analysis) => (
              <div key={analysis.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{analysis.fileName}</p>
                  <p className="text-xs text-muted-foreground">{analysis.date}</p>
                </div>
                <Badge variant={analysis.score >= 70 ? 'teal' : analysis.score >= 50 ? 'amber' : 'coral'}>
                  {analysis.score}/100
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
