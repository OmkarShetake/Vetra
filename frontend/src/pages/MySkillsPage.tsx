import { useState } from 'react'
import { Github } from '@/components/ui/github-icon'
import {
  ShieldCheck, Plus, Code2, Database, Server, GitBranch,
  Wrench, Brain, Trash2, Search, CheckCircle2, AlertCircle,
  Filter, Sparkles, Star
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type EvidenceStatus = 'ASSESSMENT_VERIFIED' | 'EVIDENCE_SUBMITTED' | 'SELF_DECLARED' | 'NOT_ASSESSED'

interface SkillItem {
  id: string
  name: string
  category: string
  evidenceStatus: EvidenceStatus
  evidenceCount: number
  selfRatedLevel?: number
}

const categoryIcons: Record<string, typeof Code2> = {
  LANGUAGE: Code2,
  FRAMEWORK: Server,
  DATABASE: Database,
  TOOL: Wrench,
  CONCEPT: Brain,
  PLATFORM: Server,
}

const statusConfig: Record<EvidenceStatus, { label: string; variant: 'teal' | 'default' | 'amber' | 'muted' }> = {
  ASSESSMENT_VERIFIED: { label: 'Verified', variant: 'teal' },
  EVIDENCE_SUBMITTED: { label: 'Evidence', variant: 'default' },
  SELF_DECLARED: { label: 'Self-declared', variant: 'amber' },
  NOT_ASSESSED: { label: 'Not assessed', variant: 'muted' },
}

const initialSkills: SkillItem[] = [
  { id: '1', name: 'Java', category: 'LANGUAGE', evidenceStatus: 'ASSESSMENT_VERIFIED', evidenceCount: 4, selfRatedLevel: 8 },
  { id: '2', name: 'OOP', category: 'CONCEPT', evidenceStatus: 'ASSESSMENT_VERIFIED', evidenceCount: 3, selfRatedLevel: 9 },
  { id: '3', name: 'Spring Boot', category: 'FRAMEWORK', evidenceStatus: 'EVIDENCE_SUBMITTED', evidenceCount: 2, selfRatedLevel: 7 },
  { id: '4', name: 'PostgreSQL', category: 'DATABASE', evidenceStatus: 'EVIDENCE_SUBMITTED', evidenceCount: 2, selfRatedLevel: 7 },
  { id: '5', name: 'Git', category: 'TOOL', evidenceStatus: 'ASSESSMENT_VERIFIED', evidenceCount: 5, selfRatedLevel: 8 },
  { id: '6', name: 'REST APIs', category: 'CONCEPT', evidenceStatus: 'EVIDENCE_SUBMITTED', evidenceCount: 3, selfRatedLevel: 8 },
  { id: '7', name: 'Docker', category: 'TOOL', evidenceStatus: 'SELF_DECLARED', evidenceCount: 1, selfRatedLevel: 5 },
  { id: '8', name: 'Spring Security', category: 'FRAMEWORK', evidenceStatus: 'NOT_ASSESSED', evidenceCount: 0, selfRatedLevel: 4 },
  { id: '9', name: 'Kafka', category: 'TOOL', evidenceStatus: 'SELF_DECLARED', evidenceCount: 0, selfRatedLevel: 3 },
  { id: '10', name: 'Redis', category: 'DATABASE', evidenceStatus: 'EVIDENCE_SUBMITTED', evidenceCount: 1, selfRatedLevel: 6 },
  { id: '11', name: 'Hibernate / JPA', category: 'FRAMEWORK', evidenceStatus: 'EVIDENCE_SUBMITTED', evidenceCount: 2, selfRatedLevel: 7 },
  { id: '12', name: 'JUnit 5 & Mockito', category: 'TOOL', evidenceStatus: 'ASSESSMENT_VERIFIED', evidenceCount: 2, selfRatedLevel: 7 },
]

export function MySkillsPage() {
  const [skillsList, setSkillsList] = useState<SkillItem[]>(initialSkills)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  // Form states
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillCategory, setNewSkillCategory] = useState('LANGUAGE')
  const [newSkillLevel, setNewSkillLevel] = useState('6')

  const handleAddSkill = () => {
    if (!newSkillName.trim()) {
      toast.error('Skill name is required')
      return
    }

    const existing = skillsList.find(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())
    if (existing) {
      toast.error('This skill is already in your profile')
      return
    }

    const level = parseInt(newSkillLevel, 10) || 5
    const newSkill: SkillItem = {
      id: Date.now().toString(),
      name: newSkillName.trim(),
      category: newSkillCategory,
      evidenceStatus: 'SELF_DECLARED',
      evidenceCount: 0,
      selfRatedLevel: Math.min(10, Math.max(1, level))
    }

    setSkillsList([newSkill, ...skillsList])
    toast.success(`Added ${newSkill.name} to your skills!`, {
      description: 'You can now link GitHub repos or take an assessment to verify it.'
    })

    setNewSkillName('')
    setNewSkillCategory('LANGUAGE')
    setNewSkillLevel('6')
    setAddDialogOpen(false)
  }

  const handleDeleteSkill = (id: string, name: string) => {
    setSkillsList(skillsList.filter(s => s.id !== id))
    toast.info(`Removed ${name} from your profile`)
  }

  const handleCycleStatus = (id: string) => {
    setSkillsList(skillsList.map(s => {
      if (s.id === id) {
        let next: EvidenceStatus = 'NOT_ASSESSED'
        if (s.evidenceStatus === 'NOT_ASSESSED') next = 'SELF_DECLARED'
        else if (s.evidenceStatus === 'SELF_DECLARED') next = 'EVIDENCE_SUBMITTED'
        else if (s.evidenceStatus === 'EVIDENCE_SUBMITTED') next = 'ASSESSMENT_VERIFIED'
        else next = 'NOT_ASSESSED'

        toast.success(`Updated ${s.name} status to ${statusConfig[next].label}`)
        return { ...s, evidenceStatus: next }
      }
      return s
    }))
  }

  const filteredSkills = skillsList.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'ALL' || s.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const stats = {
    total: skillsList.length,
    verified: skillsList.filter((s) => s.evidenceStatus === 'ASSESSMENT_VERIFIED').length,
    evidence: skillsList.filter((s) => s.evidenceStatus === 'EVIDENCE_SUBMITTED').length,
    selfDeclared: skillsList.filter((s) => s.evidenceStatus === 'SELF_DECLARED').length,
    notAssessed: skillsList.filter((s) => s.evidenceStatus === 'NOT_ASSESSED').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Technical Skills</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A verified profile of technical abilities backed by tangible evidence and test results.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="gradient" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Tracked Skills', value: stats.total, color: 'text-indigo', bg: 'bg-indigo/10' },
          { label: 'Verified by Tests', value: stats.verified, color: 'text-teal', bg: 'bg-teal/10' },
          { label: 'Evidence Attached', value: stats.evidence, color: 'text-violet', bg: 'bg-violet/10' },
          { label: 'Self-Declared / Pending', value: stats.selfDeclared + stats.notAssessed, color: 'text-amber', bg: 'bg-amber/10' },
        ].map((stat) => (
          <Card key={stat.label} className="border-border shadow-sm">
            <CardContent className="flex items-center gap-3.5 p-4">
              <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl font-bold text-lg', stat.bg, stat.color)}>
                {stat.value}
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-sm font-semibold text-foreground">
                  {Math.round((stat.value / Math.max(1, stats.total)) * 100)}% of profile
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls: Search and Category Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search skills by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>

        <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
          <TabsList className="bg-muted">
            <TabsTrigger value="ALL">All ({skillsList.length})</TabsTrigger>
            <TabsTrigger value="LANGUAGE">Languages</TabsTrigger>
            <TabsTrigger value="FRAMEWORK">Frameworks</TabsTrigger>
            <TabsTrigger value="DATABASE">Databases</TabsTrigger>
            <TabsTrigger value="TOOL">Tools</TabsTrigger>
            <TabsTrigger value="CONCEPT">Concepts</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <p className="text-sm text-muted-foreground">No skills match the current search or category filter.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => { setSearch(''); setCategoryFilter('ALL'); }}>
            Reset Filter
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => {
            const Icon = categoryIcons[skill.category] || Code2
            const status = statusConfig[skill.evidenceStatus]

            return (
              <Card key={skill.id} className="group border-border transition-all hover:border-indigo/40 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo/10 text-indigo">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">{skill.name}</CardTitle>
                        <p className="text-xs text-muted-foreground capitalize">{skill.category.toLowerCase()}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCycleStatus(skill.id)}
                      title="Click to cycle verification state"
                      className="transition-transform hover:scale-105"
                    >
                      <Badge variant={status.variant} className="cursor-pointer">
                        {status.label}
                      </Badge>
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  {skill.selfRatedLevel !== undefined && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Proficiency Level</span>
                        <span className="font-semibold text-foreground">{skill.selfRatedLevel} / 10</span>
                      </div>
                      <Progress value={skill.selfRatedLevel * 10} className="h-1.5" />
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
                    <span>
                      {skill.evidenceCount > 0
                        ? `${skill.evidenceCount} verified proof item${skill.evidenceCount > 1 ? 's' : ''}`
                        : 'No evidence attached'}
                    </span>

                    <Button
                      variant="ghost"
                      size="iconSm"
                      className="h-7 w-7 text-muted-foreground hover:text-coral hover:bg-coral/10"
                      onClick={() => handleDeleteSkill(skill.id, skill.name)}
                      title="Remove skill"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add Skill Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add a Technical Skill</DialogTitle>
            <DialogDescription>
              Add a skill to your profile. You can later link code repositories or take assessments to verify it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="skill-name">Skill Name *</Label>
              <Input
                id="skill-name"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="e.g. Apache Kafka, Docker, Redis"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="skill-category">Taxonomy Category</Label>
              <Select value={newSkillCategory} onValueChange={setNewSkillCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LANGUAGE">Programming Language</SelectItem>
                  <SelectItem value="FRAMEWORK">Framework / Library</SelectItem>
                  <SelectItem value="DATABASE">Database / Storage</SelectItem>
                  <SelectItem value="TOOL">Tool / DevOps</SelectItem>
                  <SelectItem value="CONCEPT">Engineering Concept</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="skill-level">Estimated Proficiency (1 - 10)</Label>
              <Input
                id="skill-level"
                type="number"
                min={1}
                max={10}
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button variant="gradient" onClick={handleAddSkill}>
              Add to Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
