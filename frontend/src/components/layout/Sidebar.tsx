import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  Network,
  ShieldCheck,
  FileText,
  Target,
  GraduationCap,
  FolderCheck,
  ClipboardCheck,
  Settings,
  type LucideIcon,
  Sparkles,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { cn } from '@/lib/utils'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  description: string
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, description: 'Career intelligence dashboard' },
  { to: '/job-intelligence', label: 'Job Intelligence', icon: Briefcase, description: 'Job market insights and analysis' },
  { to: '/skill-explorer', label: 'Skill Explorer', icon: Network, description: 'Interactive skill graph' },
  { to: '/my-skills', label: 'My Skills', icon: ShieldCheck, description: 'Your skill profile and evidence' },
  { to: '/resume-studio', label: 'Resume Studio', icon: FileText, description: 'Resume analysis and improvement' },
  { to: '/skill-gap-analysis', label: 'Skill Gap Analysis', icon: Target, description: 'Compare your skills to job requirements' },
  { to: '/learning-roadmap', label: 'Learning Roadmap', icon: GraduationCap, description: 'Personalized learning plan' },
  { to: '/evidence-portfolio', label: 'Evidence Portfolio', icon: FolderCheck, description: 'Projects and certifications' },
  { to: '/assessments', label: 'Assessments', icon: ClipboardCheck, description: 'Skill assessments' },
  { to: '/settings', label: 'Settings', icon: Settings, description: 'Account and preferences' },
]

interface SidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  onClose: () => void
}

export function Sidebar({ collapsed, mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-200',
          collapsed ? 'w-[72px]' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-5">
          {collapsed ? (
            <Logo showText={false} />
          ) : (
            <Logo />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white'
                      : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800/60',
                    collapsed && 'justify-center px-2',
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="border-t border-border p-3.5">
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>Vetra Enterprise</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                Evidence-based intelligence for early-career software developers.
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
