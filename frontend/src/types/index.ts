// ============================================================================
// VETRA TYPE DEFINITIONS
// ============================================================================

// --- Auth Types ---
export interface User {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  onboardingCompleted: boolean
  targetRole?: string
  experienceLevel?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
}

export interface LoginRequest {
  email: string
  password: string
}

// --- Onboarding Types ---
export interface OnboardingData {
  fullName: string
  education: string
  graduationYear: string
  experienceLevel: string
  targetJobRole: string
  preferredTechStack: string[]
  currentSkills: string[]
  careerObjectives: string
}

// --- Profile Types ---
export interface UserProfile {
  id: string
  fullName: string
  email: string
  education: string
  graduationYear: string
  experienceLevel: string
  targetRole: string
  preferredTechStack: string[]
  careerObjectives: string
  githubUsername?: string
  linkedinUrl?: string
  portfolioUrl?: string
  careerReadinessScore: number
}

// --- Job Types ---
export type JobSource = 'USER_SUBMITTED' | 'COMPANY_CAREER_PAGE' | 'AGGREGATOR_API' | 'PUBLIC_POSTING'

export interface Job {
  id: string
  title: string
  company: string
  location: string
  experienceLevel: string
  employmentType: string
  source: JobSource
  sourceUrl?: string
  collectedDate: string
  description: string
  requiredSkills: string[]
  preferredSkills: string[]
  responsibilities: string[]
  qualifications: string[]
  companyType?: 'PRODUCT' | 'STARTUP' | 'SERVICE'
  salaryRange?: string
  situationAdvice?: string
}

export interface JobImportRequest {
  title: string
  company: string
  description: string
  location?: string
  employmentType?: string
  experienceLevel?: string
}

// --- Skill Types ---
export type SkillCategory = 'LANGUAGE' | 'FRAMEWORK' | 'DATABASE' | 'TOOL' | 'CONCEPT' | 'PLATFORM' | 'SOFT_SKILL'
export type EvidenceStatus = 'NOT_ASSESSED' | 'SELF_DECLARED' | 'EVIDENCE_SUBMITTED' | 'ASSESSMENT_VERIFIED'

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  description: string
  prerequisites: string[]
  relatedSkills: string[]
  roleRelevance: string[]
  demandLevel?: number
}

export interface SkillGraphData {
  nodes: SkillGraphNode[]
  edges: SkillGraphEdge[]
}

export interface SkillGraphNode {
  id: string
  label: string
  category: SkillCategory
  level: number
  evidenceStatus?: EvidenceStatus
}

export interface SkillGraphEdge {
  source: string
  target: string
  type: 'PREREQUISITE' | 'RELATED' | 'REQUIRES'
}

// --- User Skill Types ---
export interface UserSkill {
  id: string
  skillId: string
  skillName: string
  category: SkillCategory
  evidenceStatus: EvidenceStatus
  evidenceCount: number
  selfRatedLevel?: number
}

// --- Resume Types ---
export type ResumeSectionType =
  | 'PERSONAL_DETAILS'
  | 'SUMMARY'
  | 'EDUCATION'
  | 'TECHNICAL_SKILLS'
  | 'WORK_EXPERIENCE'
  | 'INTERNSHIPS'
  | 'PROJECTS'
  | 'CERTIFICATIONS'
  | 'ACHIEVEMENTS'

export interface Resume {
  id: string
  fileName: string
  uploadedAt: string
  status: 'UPLOADED' | 'PARSED' | 'ANALYZED'
  analysisStatus?: string
  overallScore?: number
}

export interface ResumeSection {
  type: ResumeSectionType
  content: string
  present: boolean
}

export interface ResumeAnalysis {
  resumeId: string
  overallScore: number
  structureCompleteness: number
  skillCoverage: number
  keywordCoverage: number
  projectQuality: number
  experienceClarity: number
  readability: number
  evidenceAlignment: number
  sections: ResumeSection[]
  suggestions: ResumeSuggestion[]
}

export interface ResumeSuggestion {
  id: string
  category: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  title: string
  description: string
  actionable: boolean
}

export interface ResumeJobMatch {
  resumeId: string
  jobId: string
  matchScore: number
  matchedSkills: string[]
  missingKeywords: string[]
  indirectSkills: string[]
  weakEvidenceSkills: string[]
  missingSections: string[]
  weakProjectDescriptions: string[]
  genericBulletPoints: string[]
}

export interface ResumeRecommendation {
  id: string
  section: ResumeSectionType
  currentText: string
  suggestedText: string
  explanation: string
  accepted: boolean
}

// --- Skill Gap Analysis ---
export type SkillGapStatus = 'DEMONSTRATED' | 'PARTIALLY_DEMONSTRATED' | 'NOT_DEMONSTRATED'

export interface SkillGapAnalysis {
  id: string
  targetRole: string
  overallScore: number
  skills: SkillGapItem[]
  generatedAt: string
}

export interface SkillGapItem {
  skillName: string
  status: SkillGapStatus
  importance: 'CRITICAL' | 'IMPORTANT' | 'BENEFICIAL'
  evidenceCount: number
  evidenceDescription: string
  explanation: string
  prerequisites: string[]
}

// --- Learning Roadmap ---
export interface LearningPlan {
  id: string
  targetRole: string
  totalEstimatedHours: number
  phases: LearningPhase[]
}

export interface LearningPhase {
  id: string
  title: string
  order: number
  estimatedHours: number
  description: string
  tasks: LearningTask[]
}

export interface LearningTask {
  id: string
  title: string
  description: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  estimatedHours: number
  completed: boolean
  resourceUrl?: string
  exerciseDescription?: string
}

// --- Evidence Types ---
export interface Evidence {
  id: string
  skillId: string
  skillName: string
  type: 'PROJECT' | 'CERTIFICATION' | 'ASSESSMENT' | 'GITHUB_REPO' | 'WORK_EXPERIENCE'
  title: string
  description: string
  url?: string
  verified: boolean
  createdAt: string
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  linkedSkillIds: string[]
}

// --- Assessment Types ---
export interface Assessment {
  id: string
  title: string
  description: string
  skillArea: string
  questionCount: number
  durationMinutes: number
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
}

export interface AssessmentAttempt {
  id: string
  assessmentId: string
  score: number
  passed: boolean
  completedAt: string
}

// --- Dashboard Types ---
export interface DashboardData {
  careerReadinessScore: number
  targetRole: string
  demonstratedSkillsCount: number
  skillsNeedingImprovement: string[]
  mostDemandedSkills: { name: string; demandScore: number }[]
  recentInsights: { id: string; title: string; description: string; date: string }[]
  recommendedActions: { id: string; title: string; description: string; priority: string }[]
  recentResumeAnalyses: { id: string; fileName: string; score: number; date: string }[]
  learningProgress: { completedTasks: number; totalTasks: number; percentage: number }
}

// --- API Response Wrapper ---
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiErrorResponse {
  error: string
  message: string
  details?: Record<string, string>
}

export interface PaginatedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
