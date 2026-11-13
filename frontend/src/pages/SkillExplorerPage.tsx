import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
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
  Sparkles,
  Briefcase,
  Plus,
  ArrowRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn, formatPercent } from '@/lib/utils'
import type { SkillCategory } from '@/types'
import {
  PRESET_ROLES,
  synthesizeRoleGraph,
  type SkillNode,
  type SkillEdge,
} from '@/lib/roleTaxonomy'

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

const VIEWBOX_W = 900
const VIEWBOX_H = 600
const MIN_SCALE = 0.5
const MAX_SCALE = 2.5

export function SkillExplorerPage() {
  const { user } = useAuth()

  // Track custom user roles added dynamically
  const [customRoles, setCustomRoles] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('vetra_custom_roles')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {}
    return []
  })

  // Initialize selectedRole based on the user's active target role
  const [selectedRole, setSelectedRole] = useState<string>(() => {
    const stored = localStorage.getItem('vetra_target_role')
    if (stored && stored.trim()) return stored.trim()
    if (user?.targetRole && user.targetRole.trim()) return user.targetRole.trim()
    return 'Java Backend Developer'
  })

  // Full dynamic list of roles (presets + user custom roles)
  const availableRoles = useMemo(() => {
    const set = new Set([...PRESET_ROLES, ...customRoles])
    if (user?.targetRole && user.targetRole.trim()) set.add(user.targetRole.trim())
    if (selectedRole && selectedRole.trim()) set.add(selectedRole.trim())
    return Array.from(set)
  }, [customRoles, user?.targetRole, selectedRole])

  // Custom role modal state
  const [customDialogOpen, setCustomDialogOpen] = useState(false)
  const [newRoleInput, setNewRoleInput] = useState('')

  // Keep synced if user's profile role or resume sync updates
  useEffect(() => {
    if (user?.targetRole && user.targetRole.trim()) {
      setSelectedRole(user.targetRole.trim())
    }
  }, [user?.targetRole])

  useEffect(() => {
    const handleSync = (e: any) => {
      const roleStr = e?.detail?.detectedRole || ''
      if (roleStr && roleStr.trim()) {
        setSelectedRole(roleStr.trim())
      }
    }
    const handleRoleUpdate = (e: any) => {
      const roleStr = e?.detail?.role || ''
      if (roleStr && roleStr.trim()) {
        setSelectedRole(roleStr.trim())
      }
    }
    window.addEventListener('vetra_resume_synced', handleSync)
    window.addEventListener('vetra_role_updated', handleRoleUpdate)
    return () => {
      window.removeEventListener('vetra_resume_synced', handleSync)
      window.removeEventListener('vetra_role_updated', handleRoleUpdate)
    }
  }, [])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)
  const [highlightMySkills, setHighlightMySkills] = useState(true)

  // Current active DAG for this user's role (synthesized dynamically for ANY role)
  const activeGraph = useMemo(() => {
    return synthesizeRoleGraph(selectedRole)
  }, [selectedRole])

  const currentNodes = activeGraph.nodes
  const currentEdges = activeGraph.edges

  // Retrieve candidate verified skills from uploaded resume
  const candidateSkills = useMemo(() => {
    try {
      const raw = localStorage.getItem('vetra_latest_resume_analysis')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed?.extractedSkills) && parsed.extractedSkills.length > 0) {
          return new Set(parsed.extractedSkills.map((s: string) => s.toLowerCase()))
        }
      }
    } catch {}
    return new Set(['java', 'spring boot', 'rest apis', 'sql', 'git', 'postgresql', 'docker', 'oop'])
  }, [])

  // Calculate demonstrated vs total for this role
  const demonstratedCount = useMemo(() => {
    return currentNodes.filter(n => candidateSkills.has(n.label.toLowerCase()) || candidateSkills.has(n.id.toLowerCase())).length
  }, [currentNodes, candidateSkills])

  const coveragePercent = Math.round((demonstratedCount / Math.max(1, currentNodes.length)) * 100)

  const handleRoleChange = (newRole: string) => {
    if (newRole === '__ADD_CUSTOM__') {
      setCustomDialogOpen(true)
      return
    }
    setSelectedRole(newRole)
    localStorage.setItem('vetra_target_role', newRole)
    window.dispatchEvent(new CustomEvent('vetra_role_updated', { detail: { role: newRole } }))
    setSelectedNodeId(null)
    resetView()
    toast.success(`Loaded Skill Graph for ${newRole}`, {
      description: `Viewing interconnected prerequisites and industry requirements for this career track.`
    })
  }

  const handleCreateCustomRole = () => {
    if (!newRoleInput.trim()) {
      toast.error('Please enter a role name')
      return
    }
    const roleName = newRoleInput.trim()
    const updated = Array.from(new Set([roleName, ...customRoles]))
    setCustomRoles(updated)
    localStorage.setItem('vetra_custom_roles', JSON.stringify(updated))
    handleRoleChange(roleName)
    setNewRoleInput('')
    setCustomDialogOpen(false)
    toast.success(`Dynamic DAG synthesized for ${roleName}!`, {
      description: `Generated 5-layer prerequisite roadmap and market demand.`
    })
  }

  const svgRef = useRef<SVGSVGElement>(null)
  const dragState = useRef<{
    isDragging: boolean
    startX: number
    startY: number
    startTx: number
    startTy: number
  }>({ isDragging: false, startX: 0, startY: 0, startTx: 0, startTy: 0 })

  const selectedNode = useMemo(
    () => currentNodes.find((n) => n.id === selectedNodeId) ?? null,
    [selectedNodeId, currentNodes],
  )

  const matchedNodeIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set(currentNodes.map((n) => n.id))
    const q = searchQuery.toLowerCase()
    return new Set(
      currentNodes.filter((n) => n.label.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)).map((n) => n.id),
    )
  }, [searchQuery, currentNodes])

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
  }

  const transform = `translate(${tx}, ${ty}) scale(${scale})`
  const isSearching = searchQuery.trim() !== ''

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Network className="h-6 w-6 text-violet" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Skill Explorer</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Dynamic Directed Acyclic Graph (DAG) synthesized for any tech role. Click any node to inspect prerequisites and verified proof.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="teal" className="gap-1.5 py-1 text-xs font-semibold shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Live Role Taxonomy
          </Badge>
          <Badge variant="outline" className="border-indigo/30 bg-indigo/10 text-indigo py-1 text-xs font-semibold">
            {selectedRole}
          </Badge>
        </div>
      </div>

      {/* Role Selection & Search Controls */}
      <Card className="border-border">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Target Role Selector + Custom Role Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full md:max-w-lg">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-indigo" />
              Target Role:
            </Label>
            <div className="flex items-center gap-2 w-full">
              <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-full h-9 text-xs font-medium bg-card">
                  <SelectValue placeholder="Select or create career track" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role} className="text-xs">
                      {role}
                    </SelectItem>
                  ))}
                  <Separator className="my-1" />
                  <SelectItem value="__ADD_CUSTOM__" className="text-xs font-semibold text-indigo">
                    + Add Custom Role...
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2.5 text-xs text-indigo border-indigo/30 hover:bg-indigo/10 shrink-0 gap-1"
                onClick={() => setCustomDialogOpen(true)}
                title="Define a new custom career track"
              >
                <Plus className="h-3.5 w-3.5" />
                Custom
              </Button>
            </div>
          </div>

          {/* Search Input & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search skills in this role..."
                className="pl-8 h-9 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              variant={highlightMySkills ? "teal" : "outline"}
              size="sm"
              onClick={() => setHighlightMySkills(h => !h)}
              className="gap-1.5 text-xs font-semibold shadow-xs shrink-0 h-9"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {highlightMySkills ? `Resume Skills: ${demonstratedCount}/${currentNodes.length} (${coveragePercent}%)` : "Overlay Resume Skills"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Graph + Detail Panel */}
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* Graph area */}
        <Card className="overflow-hidden border-border">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <span>{selectedRole} Skill Map</span>
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    {currentNodes.length} Nodes · {currentEdges.length} Edges
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Interactive career roadmap — drag canvas to pan, click any node to view detailed prerequisites
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
              className="relative aspect-[3/2] w-full cursor-grab bg-muted/20 bg-dot select-none"
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
                  {currentEdges.map((edge, idx) => {
                    const source = currentNodes.find((n) => n.id === edge.source)
                    const target = currentNodes.find((n) => n.id === edge.target)
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
                        opacity={active ? (edge.type === 'PREREQUISITE' ? 0.6 : 0.4) : 0.12}
                        className="transition-opacity duration-200"
                      />
                    )
                  })}

                  {/* Nodes */}
                  {currentNodes.map((node) => {
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
                          fontSize={12}
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
                Click node to inspect details · Drag canvas to pan
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detail Panel */}
        <div className="space-y-4">
          {selectedNode ? (
            <Card className="animate-slide-in-right border-border">
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
                            <AlertTriangle className="h-3 w-3" /> Skill Gap for Role
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
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedNode.description}</p>

                <Separator />

                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Link2 className="h-3.5 w-3.5" />
                    Prerequisites
                  </p>
                  {selectedNode.prerequisites.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.prerequisites.map((preId) => {
                        const pre = currentNodes.find((n) => n.id === preId)
                        return pre ? (
                          <Badge
                            key={preId}
                            variant="outline"
                            className="cursor-pointer hover:bg-muted font-medium text-xs"
                            onClick={() => setSelectedNodeId(preId)}
                          >
                            {pre.label}
                          </Badge>
                        ) : (
                          <Badge key={preId} variant="muted" className="text-xs">
                            {preId}
                          </Badge>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No prerequisites — foundational competency.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Network className="h-3.5 w-3.5" />
                    Related Technologies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.relatedSkills.map((related) => {
                      const rn = currentNodes.find(
                        (n) => n.label.toLowerCase() === related.toLowerCase() || n.id === related.toLowerCase().replace(/\s+/g, '-'),
                      )
                      return (
                        <Badge
                          key={related}
                          variant="muted"
                          className={cn('text-xs', rn && 'cursor-pointer hover:bg-border')}
                          onClick={() => rn && setSelectedNodeId(rn.id)}
                        >
                          {related}
                        </Badge>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Role Relevance
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.roleRelevance.map((role) => (
                      <Badge key={role} variant="info" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Market Hiring Demand
                    </Label>
                    <span className="text-sm font-bold text-foreground">
                      {formatPercent(selectedNode.demandLevel)}
                    </span>
                  </div>
                  <Progress value={selectedNode.demandLevel} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-border">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <MousePointerClick className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">Select a skill node</p>
                <p className="mt-1 text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Click any node in the {selectedRole} DAG to inspect prerequisites, candidate proof, and industry market demand.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Layers className="h-3.5 w-3.5" />
                Legend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {LEGEND_ITEMS.map((item) => (
                  <div key={item.category} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
                    />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-5 bg-blue-600 shrink-0" />
                  <span>Solid = prerequisite</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-5 border-t-2 border-dashed border-gray-400 shrink-0" />
                  <span>Dashed = related skill</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full border-2 border-emerald-500 bg-emerald-100 dark:bg-emerald-950 shrink-0" />
                  <span>Green ring = in your resume</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Custom Role Creation Dialog */}
      <Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo" />
              Synthesize Custom Role DAG
            </DialogTitle>
            <DialogDescription>
              Enter any novel tech title (e.g. Data Engineer, Golang Microservices, Cybersecurity Specialist, Blockchain Engineer, SRE). Vetra will dynamically build the prerequisite DAG on the fly.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="custom-role-name">Target Role Title</Label>
              <Input
                id="custom-role-name"
                value={newRoleInput}
                onChange={(e) => setNewRoleInput(e.target.value)}
                placeholder="e.g. Data Engineer"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleCreateCustomRole()
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomDialogOpen(false)}>Cancel</Button>
            <Button variant="gradient" onClick={handleCreateCustomRole} className="gap-1.5">
              Synthesize & Build DAG
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
