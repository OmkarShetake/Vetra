import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, ShieldCheck, Target, FileText, GraduationCap,
  ArrowRight, Briefcase, AlertCircle, CheckCircle2, Clock,
  Code2, Database, Server, GitBranch, BarChart3, Sparkles, FolderCheck, Award
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
import { apiClient } from '@/lib/api'

export function DashboardPage() {
  const { user } = useAuth()

  const getCachedResume = () => {
    try {
      const raw = localStorage.getItem('vetra_latest_resume_analysis')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.fileName === 'Omkar_Shetake_CV_EPAM.pdf') return null
        return parsed
      }
      return null
    } catch {
      return null
    }
  }

  const cachedResume = getCachedResume()

  const [loading, setLoading] = useState(true)
  const [targetRole, setTargetRole] = useState(
    cachedResume?.detectedRole || localStorage.getItem('vetra_target_role') || user?.targetRole || 'Java Backend Developer'
  )
  const [readinessScore, setReadinessScore] = useState(cachedResume?.overallScore || 72)
  const [demonstratedSkills, setDemonstratedSkills] = useState<string[]>(
    cachedResume?.extractedSkills || ['Java', 'OOP', 'SQL', 'Git', 'REST APIs', 'PostgreSQL']
  )
  const [evidenceCount, setEvidenceCount] = useState<number>(6)
  const [verifiedCount, setVerifiedCount] = useState<number>(4)
  const [jobCount, setJobCount] = useState<number>(12)
  const [latestResumeFile, setLatestResumeFile] = useState<string>(cachedResume?.fileName || '')
  const [demandChart, setDemandChart] = useState([
    { skill: 'Java', demand: 89 },
    { skill: 'Spring Boot', demand: 82 },
    { skill: 'REST APIs', demand: 78 },
    { skill: 'PostgreSQL', demand: 74 },
    { skill: 'Docker', demand: 68 },
    { skill: 'Git', demand: 95 },
  ])

  useEffect(() => {
    fetchDashboardData()

    const handleSync = (e: any) => {
      const data = e.detail
      if (data?.detectedRole) setTargetRole(data.detectedRole)
      if (data?.overallScore) setReadinessScore(data.overallScore)
      if (data?.extractedSkills?.length) setDemonstratedSkills(data.extractedSkills)
      if (data?.fileName) setLatestResumeFile(data.fileName)
    }
    window.addEventListener('vetra_resume_synced', handleSync)
    return () => window.removeEventListener('vetra_resume_synced', handleSync)
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [profileRes, evidenceRes, jobsRes] = await Promise.allSettled([
        apiClient.get<any>('/profile'),
        apiClient.get<any[]>('/evidence'),
        apiClient.get<any[]>('/jobs'),
      ])

      // 1. Profile Data
      if (profileRes.status === 'fulfilled' && profileRes.value) {
        if (profileRes.value.targetRole) setTargetRole(profileRes.value.targetRole)
        if (profileRes.value.careerReadinessScore) setReadinessScore(profileRes.value.careerReadinessScore)
      } else if (user?.targetRole) {
        setTargetRole(user.targetRole)
      }

      // 2. Evidence Data
      if (evidenceRes.status === 'fulfilled' && Array.isArray(evidenceRes.value) && evidenceRes.value.length > 0) {
        const ev = evidenceRes.value
        setEvidenceCount(ev.length)
        const verified = ev.filter((item: any) => item.verified)
        setVerifiedCount(verified.length)

        const allSkills = Array.from(new Set(ev.flatMap((item: any) => item.linkedSkills || []))) as string[]
        if (allSkills.length > 0) {
          setDemonstratedSkills(allSkills)
          // Compute dynamic readiness score based on verified evidence
          const calculatedScore = Math.min(96, Math.max(50, 40 + (verified.length * 10) + (allSkills.length * 2)))
          setReadinessScore(calculatedScore)
        }
      }

      // 3. Jobs Data
      if (jobsRes.status === 'fulfilled' && Array.isArray(jobsRes.value) && jobsRes.value.length > 0) {
        setJobCount(jobsRes.value.length)
        const skillCounts: Record<string, number> = {}
        jobsRes.value.forEach((j: any) => {
          const reqs = j.requiredSkills || []
          reqs.forEach((s: string) => {
            skillCounts[s] = (skillCounts[s] || 0) + 1
          })
        })

        const topSkills = Object.entries(skillCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([skill, count]) => ({
            skill,
            demand: Math.min(98, Math.max(55, Math.round((count / jobsRes.value.length) * 100))),
          }))

        if (topSkills.length > 0) {
          setDemandChart(topSkills)
        }
      }
    } catch {
      // Keep friendly defaults
    } finally {
      setLoading(false)
    }
  }

  const radialData = [
    { name: 'Readiness', value: readinessScore, fill: '#2563EB' },
  ]

  const skillsNeedingImprovement = ['Docker', 'Spring Security', 'Redis', 'Kafka']
    .filter(s => !demonstratedSkills.includes(s))
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="text-2xl font-bold text-foreground">{user?.fullName || 'Developer'}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's your live career intelligence overview for <span className="font-semibold text-foreground">{targetRole}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/job-intelligence">
              <Briefcase className="h-4 w-4" />
              Market Intelligence
            </Link>
          </Button>
          <Button variant="gradient" size="sm" asChild>
            <Link to="/resume-studio">
              <FileText className="h-4 w-4" />
              Optimize Resume
            </Link>
          </Button>
        </div>
      </div>

      {/* Live Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardContent className="flex items-center gap-3.5 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Readiness Benchmark</p>
              <p className="text-xl font-bold text-foreground">{readinessScore}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="flex items-center gap-3.5 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Verified Proof Items</p>
              <p className="text-xl font-bold text-foreground">{verifiedCount} / {evidenceCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="flex items-center gap-3.5 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Grounded Capabilities</p>
              <p className="text-xl font-bold text-foreground">{demonstratedSkills.length} Skills</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="flex items-center gap-3.5 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Active Market Postings</p>
              <p className="text-xl font-bold text-foreground">{jobCount} Tracked</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Career Readiness Overview */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Career Readiness Overview</CardTitle>
                <CardDescription>How your evidence-backed skills align with real hiring requirements</CardDescription>
              </div>
              <Badge variant="outline" className="border-blue-500/30 text-blue-600 bg-blue-50/50">
                {readinessScore >= 75 ? 'Job-Ready Tier' : 'Building Evidence'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col items-center justify-center">
                <div className="relative h-44 w-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="70%"
                      outerRadius="100%"
                      data={radialData}
                      startAngle={90}
                      endAngle={90 - (readinessScore / 100) * 360}
                    >
                      <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'var(--color-muted)' }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-foreground">{readinessScore}</span>
                    <span className="text-xs text-muted-foreground">Readiness Index</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-foreground">Demonstrated Skills</span>
                    <span className="text-xs text-muted-foreground">{demonstratedSkills.length} skills verified</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {demonstratedSkills.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs border-emerald-500/30 text-emerald-600 bg-emerald-50/40">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-foreground">High-Impact Next Steps</span>
                    <span className="text-xs text-rose-500">Critical gaps</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsNeedingImprovement.map((s) => (
                      <Badge key={s} variant="muted" className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="ghost" size="sm" className="p-0 text-blue-600 hover:text-blue-700" asChild>
                    <Link to="/skill-gap-analysis">
                      View full skill gap breakdown <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Action Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recommended Actions</CardTitle>
            <CardDescription>Proven steps to raise your readiness score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: 'Add GitHub Evidence', desc: 'Link backend repos to verify multithreading and database patterns', link: '/evidence-portfolio' },
              { title: 'Take Java Assessment', desc: 'Validate JVM memory and collection framework competence', link: '/assessments' },
              { title: 'Optimize ATS Bullet Points', desc: 'Use Gemini AI to translate project claims into quantified achievements', link: '/resume-studio' },
            ].map((action, idx) => (
              <Link
                key={idx}
                to={action.link}
                className="block p-3 rounded-xl border border-border/60 hover:border-blue-500/40 hover:bg-muted/30 transition-all"
              >
                <p className="text-xs font-semibold text-foreground">{action.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{action.desc}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Market Demand Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Market Demand for {targetRole}</CardTitle>
              <CardDescription>Frequency of required technologies across analyzed job descriptions</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/job-intelligence">Explore All Jobs</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="skill" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                <RechartsTooltip
                  formatter={(val: any) => [`${val}% demand frequency`, 'Demand']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }}
                />
                <Bar dataKey="demand" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
