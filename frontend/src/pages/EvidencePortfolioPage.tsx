import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { Github } from '@/components/ui/github-icon'
import {
  FolderCheck, Plus, Award, Code2, ClipboardCheck,
  Briefcase, CheckCircle2, ExternalLink, Calendar, Trash2,
  Sparkles, Check, Filter, Search
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type EvidenceType = 'PROJECT' | 'CERTIFICATION' | 'ASSESSMENT' | 'GITHUB_REPO' | 'WORK_EXPERIENCE'

interface EvidenceItem {
  id: string
  type: EvidenceType
  title: string
  description: string
  url?: string
  linkedSkills: string[]
  verified: boolean
  createdAt: string
}

const typeConfig: Record<EvidenceType, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; label: string }> = {
  PROJECT: { icon: Code2, color: 'text-indigo', bg: 'bg-indigo/10', label: 'Project' },
  CERTIFICATION: { icon: Award, color: 'text-teal', bg: 'bg-teal/10', label: 'Certification' },
  ASSESSMENT: { icon: ClipboardCheck, color: 'text-violet', bg: 'bg-violet/10', label: 'Assessment' },
  GITHUB_REPO: { icon: Github, color: 'text-foreground', bg: 'bg-muted', label: 'GitHub Repo' },
  WORK_EXPERIENCE: { icon: Briefcase, color: 'text-sky', bg: 'bg-sky/10', label: 'Work Experience' },
}

const initialEvidence: EvidenceItem[] = [
  { id: '1', type: 'PROJECT', title: 'E-Commerce Microservices REST API', description: 'Built an enterprise-style Spring Boot REST API for an e-commerce platform with JWT auth, product catalog, inventory tracking, and order management. Leverages PostgreSQL, Redis caching, and Docker Compose.', url: 'https://github.com/example/ecommerce-api', linkedSkills: ['Java', 'Spring Boot', 'PostgreSQL', 'REST APIs', 'Docker', 'Redis'], verified: true, createdAt: '2025-01-10' },
  { id: '2', type: 'CERTIFICATION', title: 'Oracle Certified Associate Java Programmer (OCAJP)', description: 'OCAJP 8 certification demonstrating core Java proficiency, memory management, and OOP.', linkedSkills: ['Java', 'OOP'], verified: true, createdAt: '2024-12-15' },
  { id: '3', type: 'GITHUB_REPO', title: 'spring-boot-task-manager', description: 'Production-ready task tracking backend featuring role-based access control, Flyway migrations, and comprehensive JUnit 5 / Mockito unit test suites.', url: 'https://github.com/example/task-manager', linkedSkills: ['Spring Boot', 'Testing', 'Git', 'SQL'], verified: true, createdAt: '2025-01-20' },
  { id: '4', type: 'ASSESSMENT', title: 'Java Fundamentals Standardized Test', description: 'Scored 85% on the Vetra Java technical assessment covering syntax, JVM memory, collections, and multi-threading.', linkedSkills: ['Java', 'OOP', 'Collections'], verified: true, createdAt: '2025-01-05' },
  { id: '5', type: 'PROJECT', title: 'Library Catalog & Reservation System', description: 'Full-stack application with Spring Boot backend, JPA repository, and responsive React frontend. Features book catalog search and fine calculation logic.', url: 'https://github.com/example/library-sys', linkedSkills: ['Java', 'Spring Boot', 'REST APIs', 'PostgreSQL'], verified: false, createdAt: '2024-11-30' },
  { id: '6', type: 'CERTIFICATION', title: 'PostgreSQL Relational Schema Design', description: 'Verified completion covering normalized schema design, B-tree indexes, execution plans, and ACID transactions.', linkedSkills: ['SQL', 'PostgreSQL'], verified: true, createdAt: '2024-10-12' },
]

const formatExternalUrl = (url?: string): string => {
  if (!url) return '#'
  const trimmed = url.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  return `https://${trimmed}`
}

export function EvidencePortfolioPage() {
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(initialEvidence)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState<string>('')
  const [addOpen, setAddOpen] = useState(false)

  // Form states
  const [formType, setFormType] = useState<EvidenceType>('PROJECT')
  const [formTitle, setFormTitle] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formUrl, setFormUrl] = useState('')
  const [formSkills, setFormSkills] = useState('')

  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchEvidence()
  }, [])

  const fetchEvidence = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get<EvidenceItem[]>('/evidence')
      if (Array.isArray(data) && data.length > 0) {
        setEvidenceList(data)
      }
    } catch {
      // Keep initial evidence as fallback
    } finally {
      setLoading(false)
    }
  }

  const handleAddEvidence = async () => {
    if (!formTitle.trim()) {
      toast.error('Title is required')
      return
    }

    const skillsArray = formSkills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    const payload = {
      type: formType,
      title: formTitle.trim(),
      description: formDesc.trim() || 'Demonstrated technical competence through implementation and testing.',
      url: formUrl.trim() || undefined,
      linkedSkills: skillsArray.length ? skillsArray : ['Java', 'Backend'],
    }

    setIsSubmitting(true)
    try {
      const created = await apiClient.post<EvidenceItem>('/evidence', payload)
      setEvidenceList(prev => [created, ...prev])
      toast.success('Evidence successfully added to your portfolio!', {
        description: `${created.title} is now linked to your demonstrated skills.`
      })
      setFormTitle('')
      setFormDesc('')
      setFormUrl('')
      setFormSkills('')
      setAddOpen(false)
    } catch {
      const fallbackItem: EvidenceItem = {
        id: Date.now().toString(),
        type: formType,
        title: formTitle.trim(),
        description: formDesc.trim() || 'Demonstrated technical competence through implementation and testing.',
        url: formUrl.trim() || undefined,
        linkedSkills: skillsArray.length ? skillsArray : ['Java', 'Backend'],
        verified: formType === 'GITHUB_REPO' || formType === 'CERTIFICATION',
        createdAt: new Date().toISOString().split('T')[0]
      }
      setEvidenceList(prev => [fallbackItem, ...prev])
      toast.success('Evidence added!')
      setFormTitle('')
      setFormDesc('')
      setFormUrl('')
      setFormSkills('')
      setAddOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/evidence/${id}`)
    } catch {
      // Ignored for local fallback
    }
    setEvidenceList(prev => prev.filter(e => e.id !== id))
    toast.info('Evidence item removed from portfolio')
  }

  const handleToggleVerify = async (id: string) => {
    try {
      const updated = await apiClient.patch<EvidenceItem>(`/evidence/${id}/toggle-verify`)
      setEvidenceList(prev => prev.map(e => e.id === id ? updated : e))
      toast.success(updated.verified ? 'Marked as verified' : 'Unmarked verified status')
    } catch {
      setEvidenceList(prev => prev.map(e => {
        if (e.id === id) {
          const next = !e.verified
          toast.success(next ? 'Marked as verified' : 'Unmarked verified status')
          return { ...e, verified: next }
        }
        return e
      }))
    }
  }

  const filtered = evidenceList.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.linkedSkills.some(s => s.toLowerCase().includes(search.toLowerCase()))

    if (!matchesSearch) return false

    if (filter === 'all') return true
    if (filter === 'projects') return e.type === 'PROJECT'
    if (filter === 'certifications') return e.type === 'CERTIFICATION'
    if (filter === 'github') return e.type === 'GITHUB_REPO'
    if (filter === 'assessments') return e.type === 'ASSESSMENT'
    return true
  })

  const stats = {
    total: evidenceList.length,
    verified: evidenceList.filter((e) => e.verified).length,
    linkedSkills: new Set(evidenceList.flatMap((e) => e.linkedSkills)).size,
    projects: evidenceList.filter((e) => e.type === 'PROJECT').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Evidence Portfolio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Prove every skill claim through verifiable code repositories, project demos, and technical certifications.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="gradient" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Evidence
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Evidence Items', value: stats.total, icon: FolderCheck, color: 'text-indigo', bg: 'bg-indigo/10' },
          { label: 'Verified Proof', value: stats.verified, icon: CheckCircle2, color: 'text-teal', bg: 'bg-teal/10' },
          { label: 'Skills Grounded', value: stats.linkedSkills, icon: Award, color: 'text-violet', bg: 'bg-violet/10' },
          { label: 'Projects Built', value: stats.projects, icon: Code2, color: 'text-sky', bg: 'bg-sky/10' },
        ].map((stat) => (
          <Card key={stat.label} className="border-border shadow-sm">
            <CardContent className="flex items-center gap-3.5 p-4">
              <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', stat.bg)}>
                <stat.icon className={cn('h-5 w-5', stat.color)} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, description or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>

        {/* Tabs for filtering */}
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="bg-muted">
            <TabsTrigger value="all">All ({evidenceList.length})</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Evidence Grid */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FolderCheck className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">No evidence items found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {search ? 'Try clearing your search query.' : 'Click "Add Evidence" above to attach proof for your skills.'}
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => { setSearch(''); setFilter('all'); }}>
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const config = typeConfig[item.type]
            const Icon = config.icon

            return (
              <Card key={item.id} className="group flex flex-col border-border transition-all hover:border-indigo/40 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', config.bg)}>
                        <Icon className={cn('h-4 w-4', config.color)} />
                      </div>
                      <Badge variant="muted" className="text-xs">{config.label}</Badge>
                    </div>

                    <button
                      onClick={() => handleToggleVerify(item.id)}
                      title="Click to toggle verified status"
                      className="transition-transform hover:scale-105"
                    >
                      {item.verified ? (
                        <Badge variant="teal" className="gap-1 cursor-pointer">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 cursor-pointer text-muted-foreground hover:text-foreground">
                          Pending
                        </Badge>
                      )}
                    </button>
                  </div>

                  <CardTitle className="mt-3 text-base leading-snug">{item.title}</CardTitle>
                  <CardDescription className="text-xs line-clamp-3 mt-1.5 leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-auto space-y-3 pt-0">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Demonstrated Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.linkedSkills.map((skill) => (
                        <Badge key={skill} variant="default" className="text-xs font-normal">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.createdAt}
                    </span>

                    <div className="flex items-center gap-1">
                      {item.url && (
                        <a
                          href={formatExternalUrl(item.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-7 w-7 rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                          title="Open external link"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="iconSm"
                        className="h-7 w-7 text-muted-foreground hover:text-coral hover:bg-coral/10"
                        onClick={() => handleDelete(item.id)}
                        title="Remove evidence"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add Evidence Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Evidence Item</DialogTitle>
            <DialogDescription>
              Link a project, code repository, or certification to validate your real-world technical skills.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="evidence-type">Type of Evidence</Label>
              <Select value={formType} onValueChange={(v) => setFormType(v as EvidenceType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROJECT">Project Implementation</SelectItem>
                  <SelectItem value="GITHUB_REPO">GitHub Repository</SelectItem>
                  <SelectItem value="CERTIFICATION">Technical Certification</SelectItem>
                  <SelectItem value="WORK_EXPERIENCE">Internship / Work Experience</SelectItem>
                  <SelectItem value="ASSESSMENT">Course Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="evidence-title">Title / Name *</Label>
              <Input
                id="evidence-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Distributed Task Queue Service"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="evidence-desc">Description & Architecture</Label>
              <Textarea
                id="evidence-desc"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                rows={3}
                placeholder="Built using Spring Boot, PostgreSQL, and Redis. Features idempotency keys and asynchronous message dispatching..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="evidence-url">Verification URL (GitHub / Live Link)</Label>
              <Input
                id="evidence-url"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="https://github.com/username/project"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="evidence-skills">Associated Skills (Comma separated)</Label>
              <Input
                id="evidence-skills"
                value={formSkills}
                onChange={(e) => setFormSkills(e.target.value)}
                placeholder="Java, Spring Boot, Redis, Docker"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button variant="gradient" onClick={handleAddEvidence}>
              Add to Portfolio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


