import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import {
  Briefcase, Search, Plus, Building2, MapPin, Calendar,
  Sparkles, Trash2, ExternalLink, Filter, CheckCircle2,
  AlertCircle, ChevronRight, Layers, ArrowUpRight
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Job, JobSource } from '@/types'

const initialJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Junior Java Backend Developer',
    company: 'TechNova Cloud Systems',
    location: 'Bengaluru, India (Hybrid)',
    experienceLevel: 'Entry-Level',
    employmentType: 'Full-Time',
    source: 'COMPANY_CAREER_PAGE',
    sourceUrl: 'https://example.com/careers/backend-java',
    collectedDate: '2025-01-20',
    description: 'Develop resilient RESTful microservices using Spring Boot and PostgreSQL. Experience with Docker, Git, and automated testing is highly desirable.',
    requiredSkills: ['Java', 'Spring Boot', 'REST APIs', 'SQL', 'Git'],
    preferredSkills: ['Docker', 'PostgreSQL', 'Redis', 'Kafka'],
    responsibilities: ['Design and maintain performant REST endpoints using Spring Boot', 'Collaborate on relational schema design in PostgreSQL'],
    qualifications: ['B.Tech in CS/IT or equivalent experience', 'Strong foundation in Java OOP and Collections']
  },
  {
    id: 'job-fe-1',
    title: 'Frontend React Developer',
    company: 'Vercel Partner Labs',
    location: 'Remote / Bengaluru',
    experienceLevel: '0-2 years',
    employmentType: 'Full-Time',
    source: 'COMPANY_CAREER_PAGE',
    sourceUrl: 'https://example.com/careers/frontend-react',
    collectedDate: '2025-02-10',
    description: 'Build fast, responsive interfaces using React 18, TypeScript, Tailwind CSS, and REST API consumption. Strong component design sense required.',
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Git'],
    preferredSkills: ['Next.js', 'Redux', 'REST APIs', 'HTML5 & CSS3'],
    responsibilities: ['Build modular reusable UI components', 'Optimize web performance and client-side caching'],
    qualifications: ['Proficiency with modern ES6+ and TypeScript', 'Experience building web applications in React']
  },
  {
    id: 'job-fs-1',
    title: 'Full Stack Software Engineer',
    company: 'Stripe Systems Partner',
    location: 'Remote / Hyderabad',
    experienceLevel: '1-3 years',
    employmentType: 'Full-Time',
    source: 'PUBLIC_POSTING',
    sourceUrl: 'https://example.com/careers/fullstack-eng',
    collectedDate: '2025-02-12',
    description: 'Join our core platform team building end-to-end developer experiences. Strong knowledge of TypeScript, Node.js, React, PostgreSQL, and Docker containerization.',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Git'],
    preferredSkills: ['Express.js', 'MongoDB', 'REST APIs', 'CI/CD Pipelines'],
    responsibilities: ['Develop backend APIs and interactive frontend screens', 'Maintain database integrity and automated test suites'],
    qualifications: ['Strong full-stack foundations with TypeScript and relational databases']
  },
  {
    id: 'job-do-1',
    title: 'Associate Cloud & DevOps Engineer',
    company: 'Cloudflare Partner Systems',
    location: 'Remote / Pune',
    experienceLevel: '0-2 years',
    employmentType: 'Full-Time',
    source: 'COMPANY_CAREER_PAGE',
    sourceUrl: 'https://example.com/careers/devops-cloud',
    collectedDate: '2025-02-08',
    description: 'Manage automated CI/CD deployment pipelines with GitHub Actions, containerize microservices with Docker, and assist with Kubernetes and AWS infrastructure monitoring.',
    requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'AWS', 'CI/CD Pipelines', 'Git'],
    preferredSkills: ['Terraform', 'Python', 'FastAPI'],
    responsibilities: ['Implement declarative CI/CD build scripts', 'Manage container networking and infrastructure security'],
    qualifications: ['Strong Linux command-line knowledge', 'Hands-on experience with Docker containerization']
  },
  {
    id: 'job-ai-1',
    title: 'Junior AI & Python Backend Developer',
    company: 'Cohere Labs Partner',
    location: 'Remote / Mumbai',
    experienceLevel: '0-2 years',
    employmentType: 'Full-Time',
    source: 'USER_SUBMITTED',
    collectedDate: '2025-02-14',
    description: 'Develop high-performance REST APIs with FastAPI, integrate LLM embeddings, clean structured datasets with Pandas/SQL, and deploy scalable ML services with Docker.',
    requiredSkills: ['Python', 'SQL', 'FastAPI', 'Pandas & NumPy', 'Docker', 'Git'],
    preferredSkills: ['PyTorch', 'LLMs & Prompt Engineering', 'PostgreSQL'],
    responsibilities: ['Construct asynchronous API endpoints with FastAPI', 'Build ETL scripts and LLM prompt pipelines'],
    qualifications: ['Strong Python programming foundation', 'Demonstrated personal projects in AI/ML or API development']
  }
]

// Multi-domain skills catalog for extraction
const SKILL_KEYWORDS = [
  'Java', 'Spring Boot', 'Spring Security', 'REST APIs', 'SQL',
  'PostgreSQL', 'Docker', 'Git', 'OOP', 'Redis', 'Kafka', 'JUnit', 'Hibernate', 'Microservices',
  'React', 'TypeScript', 'JavaScript', 'HTML5 & CSS3', 'Tailwind CSS', 'Next.js',
  'Node.js', 'Express.js', 'MongoDB', 'GraphQL',
  'Linux', 'Kubernetes', 'AWS', 'CI/CD Pipelines', 'Terraform',
  'Python', 'FastAPI', 'Pandas & NumPy', 'PyTorch', 'LLMs & Prompt Engineering',
  'Kotlin', 'Android SDK', 'Flutter'
]

// Initial fallback candidate skills
const DEFAULT_CANDIDATE_SKILLS = ['Java', 'OOP', 'Spring Boot', 'PostgreSQL', 'Git', 'REST APIs']

export function JobIntelligencePage() {
  const [jobsList, setJobsList] = useState<Job[]>(initialJobs)
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('ALL')
  const [importOpen, setImportOpen] = useState(false)
  const [analyzingJob, setAnalyzingJob] = useState<Job | null>(null)
  const [importing, setImporting] = useState(false)

  const [candidateSkills, setCandidateSkills] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('vetra_latest_resume_analysis')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed?.extractedSkills) && parsed.extractedSkills.length > 0) {
          return parsed.extractedSkills
        }
      }
    } catch {}
    return DEFAULT_CANDIDATE_SKILLS
  })

  useEffect(() => {
    fetchJobs()

    const handleSync = (e: any) => {
      if (Array.isArray(e?.detail?.extractedSkills) && e.detail.extractedSkills.length > 0) {
        setCandidateSkills(e.detail.extractedSkills)
      }
    }
    window.addEventListener('vetra_resume_synced', handleSync)
    return () => window.removeEventListener('vetra_resume_synced', handleSync)
  }, [])

  const fetchJobs = async () => {
    try {
      const data = await apiClient.get<any[]>('/jobs')
      if (Array.isArray(data) && data.length > 0) {
        setJobsList(data)
      }
    } catch {
      // Keep initialJobs fallback
    }
  }

  // Import form state
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')

  const handleImport = () => {
    if (!title.trim() || !company.trim() || !description.trim()) {
      toast.error('Title, company, and job description text are required.')
      return
    }

    // Auto extract skills from description
    const descLower = description.toLowerCase()
    const extracted = SKILL_KEYWORDS.filter(skill =>
      descLower.includes(skill.toLowerCase())
    )

    const split = Math.max(1, Math.ceil(extracted.length * 0.6))
    const required = extracted.slice(0, split)
    const preferred = extracted.slice(split)

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      company: company.trim(),
      location: location.trim() || 'Remote / Hybrid',
      experienceLevel: 'Entry-Level',
      employmentType: 'Full-Time',
      source: 'USER_SUBMITTED',
      sourceUrl: url.trim() || undefined,
      collectedDate: new Date().toISOString().split('T')[0],
      description: description.trim(),
      requiredSkills: required.length ? required : ['Java', 'REST APIs'],
      preferredSkills: preferred.length ? preferred : ['Docker', 'SQL'],
      responsibilities: [
        'Analyze requirements and implement core backend services',
        'Maintain automated test coverage and documentation'
      ],
      qualifications: ['Technical background in CS/IT or relevant software development coursework']
    }

    setJobsList([newJob, ...jobsList])
    toast.success(`Job imported successfully!`, {
      description: `Extracted ${extracted.length} skill requirements from the job description.`
    })

    // Reset
    setTitle('')
    setCompany('')
    setLocation('')
    setDescription('')
    setUrl('')
    setImportOpen(false)
  }

  const handleDelete = (id: string, jobTitle: string) => {
    setJobsList(jobsList.filter(j => j.id !== id))
    toast.info(`Deleted ${jobTitle} from job intelligence list.`)
  }

  const filteredJobs = jobsList.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.requiredSkills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchesLoc = locationFilter === 'ALL' ||
      (locationFilter === 'REMOTE' && job.location.toLowerCase().includes('remote')) ||
      (locationFilter === 'INDIA' && (job.location.toLowerCase().includes('india') || job.location.toLowerCase().includes('bengaluru') || job.location.toLowerCase().includes('hyderabad')))
    return matchesSearch && matchesLoc
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Market Intelligence</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore authentic technical requirements from real job postings or paste your own job description to analyze your fit.
          </p>
        </div>
        <Button variant="gradient" onClick={() => setImportOpen(true)}>
          <Plus className="h-4 w-4" />
          Import Job Description
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by role, company, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Locations</SelectItem>
              <SelectItem value="REMOTE">Remote Only</SelectItem>
              <SelectItem value="INDIA">India (On-site/Hybrid)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <p className="text-sm text-muted-foreground">No job postings found matching your search.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => { setSearch(''); setLocationFilter('ALL'); }}>
            Clear Search
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => {
            return (
              <Card key={job.id} className="flex flex-col border-border transition-all hover:border-indigo/40 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge variant="muted" className="text-[11px] font-normal mb-1">
                        {job.source.replace('_', ' ')}
                      </Badge>
                      <CardTitle className="text-base font-semibold leading-snug">{job.title}</CardTitle>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        {job.company}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                    <span>â€¢</span>
                    <span>{job.experienceLevel}</span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Required Skills
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {job.requiredSkills.map(skill => (
                        <Badge key={skill} variant="default" className="text-xs font-normal">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {job.preferredSkills?.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Preferred
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {job.preferredSkills.map(skill => (
                          <Badge key={skill} variant="muted" className="text-xs font-normal">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="mt-auto border-t border-border pt-3 flex items-center justify-between">
                  <Button
                    variant="gradient"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => setAnalyzingJob(job)}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Analyze Fit
                  </Button>

                  <div className="flex items-center gap-1">
                    {job.sourceUrl && (
                      <Button
                        variant="ghost"
                        size="iconSm"
                        className="h-8 w-8 text-muted-foreground hover:text-indigo"
                        onClick={() => window.open(job.sourceUrl, '_blank')}
                        title="Original job listing"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="iconSm"
                      className="h-8 w-8 text-muted-foreground hover:text-coral"
                      onClick={() => handleDelete(job.id, job.title)}
                      title="Delete job"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {/* Import Job Modal */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import a Job Description</DialogTitle>
            <DialogDescription>
              Paste any job posting text from LinkedIn, Indeed, or career sites. Vetra extracts requirements and maps your skills against it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="job-title">Job Title *</Label>
                <Input
                  id="job-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Junior Backend Engineer"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="job-company">Company Name *</Label>
                <Input
                  id="job-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Razorpay"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="job-location">Location</Label>
                <Input
                  id="job-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote or Bengaluru"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="job-url">Listing URL (Optional)</Label>
                <Input
                  id="job-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="job-desc">Job Description Text *</Label>
              <Textarea
                id="job-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Paste the full job posting requirements and responsibilities text here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportOpen(false)}>Cancel</Button>
            <Button variant="gradient" onClick={handleImport}>
              Extract Skills & Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analyze Job Fit Modal */}
      <Dialog open={!!analyzingJob} onOpenChange={(open) => !open && setAnalyzingJob(null)}>
        <DialogContent className="max-w-lg">
          {analyzingJob && (() => {
            const matchedRequired = analyzingJob.requiredSkills.filter(s =>
              candidateSkills.some(us => us.toLowerCase() === s.toLowerCase())
            )
            const missingRequired = analyzingJob.requiredSkills.filter(s =>
              !candidateSkills.some(us => us.toLowerCase() === s.toLowerCase())
            )
            const fitPercentage = Math.round((matchedRequired.length / Math.max(1, analyzingJob.requiredSkills.length)) * 100)

            return (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={fitPercentage >= 70 ? 'teal' : 'amber'}>
                      {fitPercentage}% Requirements Match
                    </Badge>
                    <span className="text-xs text-muted-foreground">{analyzingJob.company}</span>
                  </div>
                  <DialogTitle className="mt-2 text-xl font-bold">{analyzingJob.title}</DialogTitle>
                  <DialogDescription>
                    Real-time alignment comparison based on your evidence portfolio.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Requirement Match Confidence</span>
                      <span className="text-indigo">{fitPercentage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-indigo rounded-full transition-all" style={{ width: `${fitPercentage}%` }} />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Skills You Already Have ({matchedRequired.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {matchedRequired.map(s => (
                        <Badge key={s} variant="teal">{s}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-coral flex items-center gap-1.5 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      Critical Skills Missing ({missingRequired.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {missingRequired.length ? missingRequired.map(s => (
                        <Badge key={s} variant="coral">{s}</Badge>
                      )) : (
                        <span className="text-xs text-muted-foreground">No missing critical skills! Excellent fit.</span>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setAnalyzingJob(null)}>Close</Button>
                </DialogFooter>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
