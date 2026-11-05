import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppLayout } from '@/components/layout/AppLayout'
import { Loader2 } from 'lucide-react'

// Eagerly loaded (critical path)
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// Lazy loaded (dashboard routes — loaded after auth)
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const JobIntelligencePage = lazy(() => import('@/pages/JobIntelligencePage').then(m => ({ default: m.JobIntelligencePage })))
const SkillExplorerPage = lazy(() => import('@/pages/SkillExplorerPage').then(m => ({ default: m.SkillExplorerPage })))
const MySkillsPage = lazy(() => import('@/pages/MySkillsPage').then(m => ({ default: m.MySkillsPage })))
const ResumeStudioPage = lazy(() => import('@/pages/ResumeStudioPage').then(m => ({ default: m.ResumeStudioPage })))
const SkillGapAnalysisPage = lazy(() => import('@/pages/SkillGapAnalysisPage').then(m => ({ default: m.SkillGapAnalysisPage })))
const LearningRoadmapPage = lazy(() => import('@/pages/LearningRoadmapPage').then(m => ({ default: m.LearningRoadmapPage })))
const EvidencePortfolioPage = lazy(() => import('@/pages/EvidencePortfolioPage').then(m => ({ default: m.EvidencePortfolioPage })))
const AssessmentsPage = lazy(() => import('@/pages/AssessmentsPage').then(m => ({ default: m.AssessmentsPage })))
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })))

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-indigo" />
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (!user.onboardingCompleted) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (user) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (user.onboardingCompleted) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/onboarding" element={<OnboardingRoute><OnboardingPage /></OnboardingRoute>} />

        {/* Protected dashboard routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>
        } />
        <Route path="/job-intelligence" element={
          <ProtectedRoute><AppLayout><JobIntelligencePage /></AppLayout></ProtectedRoute>
        } />
        <Route path="/skill-explorer" element={
          <ProtectedRoute><AppLayout><SkillExplorerPage /></AppLayout></ProtectedRoute>
        } />
        <Route path="/my-skills" element={
          <ProtectedRoute><AppLayout><MySkillsPage /></AppLayout></ProtectedRoute>
        } />
        <Route path="/resume-studio" element={
          <ProtectedRoute><AppLayout><ResumeStudioPage /></AppLayout></ProtectedRoute>
        } />
        <Route path="/skill-gap-analysis" element={
          <ProtectedRoute><AppLayout><SkillGapAnalysisPage /></AppLayout></ProtectedRoute>
        } />
        <Route path="/learning-roadmap" element={
          <ProtectedRoute><AppLayout><LearningRoadmapPage /></AppLayout></ProtectedRoute>
        } />
        <Route path="/evidence-portfolio" element={
          <ProtectedRoute><AppLayout><EvidencePortfolioPage /></AppLayout></ProtectedRoute>
        } />
        <Route path="/assessments" element={
          <ProtectedRoute><AppLayout><AssessmentsPage /></AppLayout></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
