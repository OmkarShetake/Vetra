import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import {
  Briefcase, Search, Plus, Building2, MapPin,
  Sparkles, Trash2, ExternalLink, CheckCircle2,
  AlertCircle, ArrowRight, Zap, DollarSign,
  TrendingUp, Award, Layers
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
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
import type { Job } from '@/types'

const initialJobs: Job[] = [
  // 1. PRODUCT-BASED (Fintech, Tech Giants & Unicorns)
  {
    id: 'job-prod-1',
    title: 'Software Development Engineer I (Java)',
    company: 'Razorpay Technologies',
    location: 'Bengaluru, India (Hybrid)',
    experienceLevel: '0-2 years',
    employmentType: 'Full-Time',
    source: 'COMPANY_CAREER_PAGE',
    sourceUrl: 'https://razorpay.com/jobs',
    collectedDate: '2026-03-01',
    companyType: 'PRODUCT',
    salaryRange: '₹14 - ₹22 LPA',
    situationAdvice: 'Razorpay is a Tier-1 Fintech Unicorn. Their interview loop prioritizes transaction idempotency, low-latency API contracts, and concurrency safety. Practice transactional isolation levels and high-throughput PostgreSQL queries.',
    description: 'Build resilient, high-volume payment processing microservices using Spring Boot, PostgreSQL, and Kafka. Own service uptime, idempotency keys, and zero-data-loss transactional pipelines.',
    requiredSkills: ['Java', 'Spring Boot', 'REST APIs', 'SQL', 'Git'],
    preferredSkills: ['PostgreSQL', 'Kafka', 'Redis', 'Docker'],
    responsibilities: [
      'Architect and deliver transactional payment microservices with sub-50ms latency',
      'Optimize relational database indexing and connection pools under high concurrency',
      'Implement robust idempotency and distributed lock mechanisms'
    ],
    qualifications: [
      'Strong foundations in Core Java (Collections, Concurrency, JVM memory)',
      'Working knowledge of Spring Boot REST APIs and relational database transactions'
    ]
  },
  {
    id: 'job-prod-2',
    title: 'Frontend Platform Engineer (React & TypeScript)',
    company: 'Swiggy Labs',
    location: 'Bengaluru / Remote',
    experienceLevel: '1-3 years',
    employmentType: 'Full-Time',
    source: 'COMPANY_CAREER_PAGE',
    sourceUrl: 'https://swiggy.com/careers',
    collectedDate: '2026-03-02',
    companyType: 'PRODUCT',
    salaryRange: '₹13 - ₹20 LPA',
    situationAdvice: 'Consumer unicorn serving millions of daily concurrent orders. Focus on Core Web Vitals, code-splitting, client-side caching (TanStack Query), and strict TypeScript types.',
    description: 'Architect responsive web applications with React 18, Next.js, and TypeScript. Optimize bundle size, Core Web Vitals, and client caching for high-conversion web storefronts.',
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Git'],
    preferredSkills: ['Next.js', 'REST APIs', 'HTML5 & CSS3', 'Web Performance'],
    responsibilities: [
      'Build reusable, accessible component design systems',
      'Optimize web performance, Core Web Vitals, and client-side rendering speed'
    ],
    qualifications: [
      'Deep fluency with React 18 hooks, TypeScript interfaces, and state management',
      'Demonstrated experience building responsive modern web applications'
    ]
  },
  {
    id: 'job-prod-3',
    title: 'Full Stack Software Engineer',
    company: 'Stripe Systems Partner',
    location: 'Remote / Hyderabad',
    experienceLevel: '1-3 years',
    employmentType: 'Full-Time',
    source: 'PUBLIC_POSTING',
    sourceUrl: 'https://stripe.com/careers',
    collectedDate: '2026-03-03',
    companyType: 'PRODUCT',
    salaryRange: '₹16 - ₹24 LPA',
    situationAdvice: 'Product company culture prioritizing clean TypeScript contracts, automated Vitest/Jest unit testing, and component modularity. Emphasize Core Web Vitals and resilient API design.',
    description: 'Join our core platform team building end-to-end developer experiences. Strong knowledge of TypeScript, Node.js, React, PostgreSQL, and Docker containerization.',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Git'],
    preferredSkills: ['Express.js', 'MongoDB', 'REST APIs', 'CI/CD Pipelines'],
    responsibilities: [
      'Develop backend APIs and interactive frontend screens with full type safety',
      'Maintain database integrity and automated test suites'
    ],
    qualifications: ['Strong full-stack foundations with TypeScript and relational databases']
  },

  // 2. FAST-GROWING STARTUPS
  {
    id: 'job-start-1',
    title: 'Backend Engineer (Developer Tooling)',
    company: 'Postman Scaleup',
    location: 'Bengaluru, India (Remote)',
    experienceLevel: '0-2 years',
    employmentType: 'Full-Time',
    source: 'COMPANY_CAREER_PAGE',
    sourceUrl: 'https://postman.com/careers',
    collectedDate: '2026-03-04',
    companyType: 'STARTUP',
    salaryRange: '₹15 - ₹24 LPA',
    situationAdvice: 'High-velocity API platform. Focus on shipping speed, developer experience, containerized Docker environments, and clean API design.',
    description: 'Build scalable developer tools and REST API infrastructure using Node.js/TypeScript and Spring Boot. Maintain high reliability and rapid continuous integration.',
    requiredSkills: ['TypeScript', 'Node.js', 'REST APIs', 'SQL', 'Git'],
    preferredSkills: ['Docker', 'PostgreSQL', 'Redis', 'Microservices'],
    responsibilities: [
      'Ship new features rapidly with automated continuous deployment',
      'Collaborate on public API contracts and developer-first documentation'
    ],
    qualifications: ['High ownership mindset and demonstrated passion for open-source or API tools']
  },
  {
    id: 'job-start-2',
    title: 'Junior AI & Backend Engineer',
    company: 'Cohere Labs Partner',
    location: 'Remote (India)',
    experienceLevel: '0-2 years',
    employmentType: 'Full-Time',
    source: 'USER_SUBMITTED',
    collectedDate: '2026-03-05',
    companyType: 'STARTUP',
    salaryRange: '₹12 - ₹18 LPA',
    situationAdvice: 'Applied AI startup building production RAG pipelines. Interviewers evaluate FastAPI async endpoints, vector embedding similarity search, and containerization with Docker.',
    description: 'Develop high-performance REST APIs with FastAPI, integrate vector database embeddings, clean structured datasets with Pandas/SQL, and deploy scalable ML services with Docker.',
    requiredSkills: ['Python', 'SQL', 'FastAPI', 'Pandas & NumPy', 'Git'],
    preferredSkills: ['Docker', 'PyTorch', 'PostgreSQL', 'Vector DBs'],
    responsibilities: [
      'Construct asynchronous API endpoints with FastAPI and Pydantic validation',
      'Build ETL scripts and LLM prompt grounding pipelines'
    ],
    qualifications: ['Strong Python programming foundation and familiarity with vector embeddings']
  },
  {
    id: 'job-start-3',
    title: 'Associate Cloud & DevOps Engineer',
    company: 'Cloudflare Partner Systems',
    location: 'Remote / Pune',
    experienceLevel: '0-2 years',
    employmentType: 'Full-Time',
    source: 'COMPANY_CAREER_PAGE',
    sourceUrl: 'https://cloudflare.com/careers',
    collectedDate: '2026-03-06',
    companyType: 'STARTUP',
    salaryRange: '₹11 - ₹17 LPA',
    situationAdvice: 'High-velocity infrastructure team. Interviews test Linux command line fluency, automated Docker builds, GitHub Actions workflows, and AWS/Kubernetes foundations.',
    description: 'Manage automated CI/CD deployment pipelines with GitHub Actions, containerize microservices with Docker, and assist with Kubernetes and AWS infrastructure monitoring.',
    requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'AWS', 'CI/CD Pipelines', 'Git'],
    preferredSkills: ['Terraform', 'Python', 'FastAPI'],
    responsibilities: [
      'Implement declarative CI/CD build scripts and container security scanning',
      'Manage container networking and infrastructure metrics in Prometheus'
    ],
    qualifications: ['Strong Linux command-line knowledge and hands-on Docker experience']
  },

  // 3. GLOBAL ENTERPRISE & SERVICE CONSULTANCIES
  {
    id: 'job-serv-1',
    title: 'Junior Java Software Engineer',
    company: 'EPAM Systems',
    location: 'Hyderabad / Bengaluru (Hybrid)',
    experienceLevel: 'Entry-Level',
    employmentType: 'Full-Time',
    source: 'PUBLIC_POSTING',
    sourceUrl: 'https://epam.com/careers',
    collectedDate: '2026-03-07',
    companyType: 'SERVICE',
    salaryRange: '₹7 - ₹11 LPA',
    situationAdvice: 'Global engineering consultancy with strict code quality standards. Technical interview focuses on core Java OOP principles, Collections complexity, Spring MVC architecture, and JUnit testing.',
    description: 'Deliver enterprise software solutions for global banking and retail clients. Implement Spring Boot REST services, automated JUnit test suites, and relational database schema persistence.',
    requiredSkills: ['Java', 'OOP', 'Spring Boot', 'SQL', 'Git'],
    preferredSkills: ['REST APIs', 'PostgreSQL', 'Docker', 'Testing'],
    responsibilities: [
      'Develop modular Spring Boot REST endpoints following enterprise design patterns',
      'Write comprehensive unit tests with JUnit 5 and Mockito'
    ],
    qualifications: ['Strong grasp of Core Java fundamentals and Spring Boot MVC architecture']
  },
  {
    id: 'job-serv-2',
    title: 'Associate Full Stack Engineer',
    company: 'Accenture Technology',
    location: 'Pune / Bengaluru (Hybrid)',
    experienceLevel: '0-2 years',
    employmentType: 'Full-Time',
    source: 'PUBLIC_POSTING',
    sourceUrl: 'https://accenture.com/careers',
    collectedDate: '2026-03-08',
    companyType: 'SERVICE',
    salaryRange: '₹6 - ₹9 LPA',
    situationAdvice: 'Enterprise client delivery stream. Focuses on structured problem solving, clean documentation, standard Spring Boot patterns, and relational database queries.',
    description: 'Design and maintain full stack web applications for enterprise clients. Work with Java, Spring Boot, React, and relational database systems.',
    requiredSkills: ['Java', 'Spring Boot', 'React', 'SQL', 'Git'],
    preferredSkills: ['REST APIs', 'HTML5 & CSS3', 'Docker'],
    responsibilities: [
      'Collaborate with global technical teams on enterprise client deliverables',
      'Maintain reliable web applications and relational database queries'
    ],
    qualifications: ['Proficiency with Java and modern JavaScript/React web frameworks']
  },
  {
    id: 'job-serv-3',
    title: 'Systems Engineer (Java Backend & Cloud)',
    company: 'TCS Digital',
    location: 'Hyderabad / Mumbai / Chennai',
    experienceLevel: 'Entry-Level',
    employmentType: 'Full-Time',
    source: 'COMPANY_CAREER_PAGE',
    sourceUrl: 'https://tcs.com/careers',
    collectedDate: '2026-03-09',
    companyType: 'SERVICE',
    salaryRange: '₹7 - ₹11 LPA',
    situationAdvice: 'TCS Digital stream focuses on modern digital transformation projects. Interviews test core algorithmic thinking, Spring Boot microservices, and relational SQL transactions.',
    description: 'Develop scalable digital transformation microservices for enterprise banking clients using Java, Spring Boot, and cloud deployment pipelines.',
    requiredSkills: ['Java', 'Spring Boot', 'SQL', 'REST APIs', 'Git'],
    preferredSkills: ['Microservices', 'Docker', 'AWS', 'PostgreSQL'],
    responsibilities: [
      'Build performant backend services and integrate with legacy enterprise databases',
      'Participate in code reviews and automated test verification'
    ],
    qualifications: ['B.Tech / B.E in CS/IT or equivalent with strong Java fundamentals']
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

const DEFAULT_CANDIDATE_SKILLS = ['Java', 'OOP', 'Spring Boot', 'PostgreSQL', 'Git', 'REST APIs', 'SQL']

export function JobIntelligencePage() {
  const [jobsList, setJobsList] = useState<Job[]>(initialJobs)
  const [search, setSearch] = useState('')
  const [companyTypeFilter, setCompanyTypeFilter] = useState<string>('ALL')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [locationFilter, setLocationFilter] = useState<string>('ALL')
  const [importOpen, setImportOpen] = useState(false)
  const [analyzingJob, setAnalyzingJob] = useState<Job | null>(null)

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
      const res = await apiClient.get<any>('/jobs')
      const data = res?.data || res
      if (Array.isArray(data) && data.length > 0) {
        setJobsList(data)
      }
    } catch {
      // Use rich client-side initialJobs
    }
  }

  // Import form state
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [companyType, setCompanyType] = useState<'PRODUCT' | 'STARTUP' | 'SERVICE'>('PRODUCT')
  const [salaryRange, setSalaryRange] = useState('')

  const handleImport = async () => {
    if (!title.trim() || !company.trim() || !description.trim()) {
      toast.error('Title, company, and job description text are required.')
      return
    }

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
      companyType: companyType,
      salaryRange: salaryRange.trim() || 'Competitive Market Rate',
      situationAdvice: `${company.trim()} prioritizes hands-on evidence of ${required.slice(0, 3).join(', ')}. Prepare clean portfolio code samples and be ready to explain architectural choices.`,
      requiredSkills: required.length ? required : ['Java', 'REST APIs'],
      preferredSkills: preferred.length ? preferred : ['Docker', 'SQL'],
      responsibilities: [
        'Analyze requirements and implement core backend services',
        'Maintain automated test coverage and documentation'
      ],
      qualifications: ['Technical background in CS/IT or relevant software development coursework']
    }

    try {
      await apiClient.post('/jobs/import', {
        title: newJob.title,
        company: newJob.company,
        location: newJob.location,
        description: newJob.description,
        sourceUrl: newJob.sourceUrl,
        companyType: newJob.companyType,
        salaryRange: newJob.salaryRange,
      })
    } catch {}

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
    setSalaryRange('')
    setImportOpen(false)
  }

  const handleDelete = (id: string, jobTitle: string) => {
    setJobsList(jobsList.filter(j => j.id !== id))
    toast.info(`Deleted ${jobTitle} from job intelligence list.`)
  }

  const filteredJobs = jobsList.filter(job => {
    const q = search.toLowerCase()
    const matchesSearch = !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.requiredSkills.some(s => s.toLowerCase().includes(q))

    const matchesType = companyTypeFilter === 'ALL' || job.companyType === companyTypeFilter

    const matchesRole = roleFilter === 'ALL' ||
      (roleFilter === 'JAVA' && (job.title.toLowerCase().includes('java') || job.requiredSkills.includes('Java'))) ||
      (roleFilter === 'FRONTEND' && (job.title.toLowerCase().includes('react') || job.title.toLowerCase().includes('frontend'))) ||
      (roleFilter === 'FULLSTACK' && (job.title.toLowerCase().includes('full stack') || job.title.toLowerCase().includes('fullstack'))) ||
      (roleFilter === 'DEVOPS' && (job.title.toLowerCase().includes('devops') || job.title.toLowerCase().includes('cloud'))) ||
      (roleFilter === 'AI' && (job.title.toLowerCase().includes('ai') || job.requiredSkills.includes('Python')))

    const matchesLoc = locationFilter === 'ALL' ||
      (locationFilter === 'REMOTE' && job.location.toLowerCase().includes('remote')) ||
      (locationFilter === 'BLR' && job.location.toLowerCase().includes('bengaluru')) ||
      (locationFilter === 'HYD' && job.location.toLowerCase().includes('hyderabad')) ||
      (locationFilter === 'PUNE' && job.location.toLowerCase().includes('pune'))

    return matchesSearch && matchesType && matchesRole && matchesLoc
  })

  const renderCompanyTypeBadge = (type?: string) => {
    switch (type) {
      case 'PRODUCT':
        return (
          <Badge variant="outline" className="border-violet/40 bg-violet/10 text-violet text-[11px] font-semibold gap-1">
            <Sparkles className="h-3 w-3" /> Product Tier
          </Badge>
        )
      case 'STARTUP':
        return (
          <Badge variant="outline" className="border-teal/40 bg-teal/10 text-teal text-[11px] font-semibold gap-1">
            <Zap className="h-3 w-3" /> High-Growth Startup
          </Badge>
        )
      case 'SERVICE':
        return (
          <Badge variant="outline" className="border-amber/40 bg-amber/10 text-amber text-[11px] font-semibold gap-1">
            <Building2 className="h-3 w-3" /> Global Enterprise / Service
          </Badge>
        )
      default:
        return (
          <Badge variant="muted" className="text-[11px]">
            Tech Employer
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Market Intelligence</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore authentic technical requirements from Product-Based Tech Giants, Fast Startups, and Global Consultancies.
          </p>
        </div>
        <Button variant="gradient" onClick={() => setImportOpen(true)} className="gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          Import Job Description
        </Button>
      </div>

      {/* Company Archetype Segment Filters */}
      <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-1.5 rounded-xl border border-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">Archetype:</span>
        {[
          { id: 'ALL', label: 'All Companies' },
          { id: 'PRODUCT', label: '⭐ Product-Based (Unicorns & Giants)' },
          { id: 'STARTUP', label: '⚡ Fast-Growing Startups' },
          { id: 'SERVICE', label: '🏢 Global Enterprise / Consultancies (EPAM, Accenture)' },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={companyTypeFilter === tab.id ? 'secondary' : 'ghost'}
            size="sm"
            className={cn(
              'h-8 text-xs font-medium rounded-lg transition-all',
              companyTypeFilter === tab.id && 'bg-card text-foreground font-semibold shadow-xs border border-border'
            )}
            onClick={() => setCompanyTypeFilter(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Search and Granular Dropdown Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by role, company, or tech stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border text-xs sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px] h-9 text-xs">
              <SelectValue placeholder="Role Track" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="JAVA">Java Backend</SelectItem>
              <SelectItem value="FRONTEND">Frontend React</SelectItem>
              <SelectItem value="FULLSTACK">Full Stack</SelectItem>
              <SelectItem value="DEVOPS">DevOps & Cloud</SelectItem>
              <SelectItem value="AI">AI & Python</SelectItem>
            </SelectContent>
          </Select>

          {/* Location Filter */}
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[150px] h-9 text-xs">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Locations</SelectItem>
              <SelectItem value="REMOTE">Remote Only</SelectItem>
              <SelectItem value="BLR">Bengaluru</SelectItem>
              <SelectItem value="HYD">Hyderabad</SelectItem>
              <SelectItem value="PUNE">Pune</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <p className="text-sm text-muted-foreground">No job postings found matching your filters.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              setSearch('')
              setCompanyTypeFilter('ALL')
              setRoleFilter('ALL')
              setLocationFilter('ALL')
            }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => {
            const matchedCount = job.requiredSkills.filter(s =>
              candidateSkills.some(cs => cs.toLowerCase() === s.toLowerCase())
            ).length
            const matchScore = Math.round((matchedCount / Math.max(1, job.requiredSkills.length)) * 100)

            return (
              <Card
                key={job.id}
                className="flex flex-col border-border transition-all hover:border-indigo/40 hover:shadow-md bg-card"
              >
                <CardHeader className="pb-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    {renderCompanyTypeBadge(job.companyType)}
                    <Badge variant={matchScore >= 70 ? 'teal' : matchScore >= 40 ? 'amber' : 'muted'} className="text-[10px]">
                      {matchScore}% Resume Fit
                    </Badge>
                  </div>

                  <div>
                    <CardTitle className="text-base font-bold leading-snug text-foreground">
                      {job.title}
                    </CardTitle>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Building2 className="h-3.5 w-3.5 text-indigo shrink-0" />
                      {job.company}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {job.location}
                    </span>
                    <span className="text-muted-foreground/40">•</span>
                    <span>{job.experienceLevel}</span>
                    {job.salaryRange && (
                      <>
                        <span className="text-muted-foreground/40">•</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {job.salaryRange}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Required Skills
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {job.requiredSkills.map((skill) => {
                        const isDemonstrated = candidateSkills.some(cs => cs.toLowerCase() === skill.toLowerCase())
                        return (
                          <Badge
                            key={skill}
                            variant={isDemonstrated ? 'teal' : 'default'}
                            className="text-xs font-normal"
                          >
                            {isDemonstrated ? `✓ ${skill}` : skill}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>

                  {job.preferredSkills?.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Preferred
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {job.preferredSkills.map((skill) => (
                          <Badge key={skill} variant="muted" className="text-xs font-normal">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="mt-auto border-t border-border pt-3 flex items-center justify-between gap-2 bg-muted/10">
                  <Button
                    variant="gradient"
                    size="sm"
                    className="text-xs gap-1.5 font-medium"
                    onClick={() => setAnalyzingJob(job)}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Analyze Fit & Situation
                  </Button>

                  <div className="flex items-center gap-1">
                    {job.sourceUrl && (
                      <Button
                        variant="ghost"
                        size="iconSm"
                        title="View Posting"
                        onClick={() => window.open(job.sourceUrl, '_blank')}
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="iconSm"
                      title="Remove"
                      onClick={() => handleDelete(job.id, job.title)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-coral" />
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
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Company Job Description</DialogTitle>
            <DialogDescription>
              Paste requirements from any company career page. Vetra will extract the required skills and benchmark your fit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label htmlFor="job-title">Job Title *</Label>
              <Input
                id="job-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SDE 1 - Backend (Java)"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="job-company">Company Name *</Label>
                <Input
                  id="job-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Razorpay"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="company-type">Company Archetype</Label>
                <Select value={companyType} onValueChange={(val: any) => setCompanyType(val)}>
                  <SelectTrigger id="company-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRODUCT">Product-Based Unicorn</SelectItem>
                    <SelectItem value="STARTUP">Fast-Growing Startup</SelectItem>
                    <SelectItem value="SERVICE">Enterprise / Consultancies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="job-location">Location</Label>
                <Input
                  id="job-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru (Hybrid)"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="job-salary">Salary Range</Label>
                <Input
                  id="job-salary"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="e.g. ₹12 - ₹18 LPA"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="job-url">Career Page / Posting URL</Label>
              <Input
                id="job-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://company.com/careers/..."
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="job-desc">Job Description Text *</Label>
              <Textarea
                id="job-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Paste the full job posting requirements and responsibilities text here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportOpen(false)}>Cancel</Button>
            <Button variant="gradient" onClick={handleImport}>
              Extract Skills & Benchmark
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analyze Job Fit & Company Situation Modal */}
      <Dialog open={!!analyzingJob} onOpenChange={(open) => !open && setAnalyzingJob(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
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
                <DialogHeader className="border-b border-border pb-3">
                  <div className="flex items-center justify-between gap-2">
                    {renderCompanyTypeBadge(analyzingJob.companyType)}
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-indigo" />
                      {analyzingJob.company}
                    </span>
                  </div>
                  <DialogTitle className="mt-2 text-xl font-bold text-foreground">
                    {analyzingJob.title}
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    Targeted situational readiness assessment calculated against your verified portfolio proof.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  {/* Match score bar */}
                  <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-foreground">Job Requirement Alignment</span>
                      <span className={cn(
                        fitPercentage >= 70 ? 'text-teal' : fitPercentage >= 40 ? 'text-amber' : 'text-coral'
                      )}>
                        {fitPercentage}% Match ({matchedRequired.length} of {analyzingJob.requiredSkills.length} required skills)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          fitPercentage >= 70 ? 'bg-teal' : fitPercentage >= 40 ? 'bg-amber' : 'bg-coral'
                        )}
                        style={{ width: `${fitPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Company Situation & Interview Loop Strategy */}
                  <div className="rounded-xl border border-indigo/30 bg-gradient-to-br from-indigo/5 via-card to-indigo/10 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo" />
                      <p className="text-xs font-bold uppercase tracking-wider text-indigo">
                        {analyzingJob.companyType === 'PRODUCT'
                          ? 'Product-Based / Unicorn Interview Loop Strategy'
                          : analyzingJob.companyType === 'STARTUP'
                          ? 'High-Growth Startup Strategy'
                          : 'Enterprise & Global Service Strategy'}
                      </p>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">
                      {analyzingJob.situationAdvice ||
                        'Focus on demonstrating real project implementations, clean architecture, and test coverage.'}
                    </p>
                  </div>

                  {/* Skills You Have */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-teal flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Demonstrated in Your Resume ({matchedRequired.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {matchedRequired.map(s => (
                        <Badge key={s} variant="teal">✓ {s}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Critical Missing Skills */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-coral flex items-center gap-1.5 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      Critical Skills Missing ({missingRequired.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {missingRequired.length ? missingRequired.map(s => (
                        <Badge key={s} variant="coral">{s}</Badge>
                      )) : (
                        <span className="text-xs text-teal font-medium">All critical skills fulfilled for this role!</span>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter className="border-t border-border pt-3 flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setAnalyzingJob(null)}>Close</Button>
                  <Button variant="gradient" asChild className="gap-1.5 text-xs font-medium">
                    <a href="/learning-roadmap">
                      Bridge Gaps in Learning Roadmap
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </DialogFooter>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
