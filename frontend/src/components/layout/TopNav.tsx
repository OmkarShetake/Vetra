import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  PanelLeft,
  LogOut,
  User,
  Settings,
  CheckCheck,
  FileText,
  Target,
  Award,
  Compass,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useAuth } from '@/hooks/useAuth'
import { getInitials, cn } from '@/lib/utils'
import { toast } from 'sonner'

export interface VetraNotification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: 'resume' | 'skill' | 'assessment' | 'roadmap' | 'system'
  link?: string
}

const STORAGE_NOTIFICATIONS_KEY = 'vetra_notifications_store'

const DEFAULT_NOTIFICATIONS: VetraNotification[] = [
  {
    id: 'notif-1',
    title: 'Resume Intelligence Ready',
    description: 'Upload your latest CV to benchmark your verified skills against live recruiter ATS requirements.',
    time: '10m ago',
    read: false,
    type: 'resume',
    link: '/resume-studio',
  },
  {
    id: 'notif-2',
    title: 'Live Skill Gap Analysis',
    description: 'Calculated demonstrated skills and critical gaps for your target engineering career track.',
    time: '1h ago',
    read: false,
    type: 'skill',
    link: '/skill-gap-analysis',
  },
  {
    id: 'notif-3',
    title: 'Diagnostic Assessment Available',
    description: 'Complete the 15-question benchmark to earn proof-backed evidence badges.',
    time: '3h ago',
    read: true,
    type: 'assessment',
    link: '/assessments',
  },
  {
    id: 'notif-4',
    title: 'Role-Specific Skill DAG Active',
    description: 'Interactive roadmap graphs available for Java Backend, Frontend, DevOps, and Full Stack tracks.',
    time: '1d ago',
    read: true,
    type: 'system',
    link: '/skill-explorer',
  },
]

interface TopNavProps {
  onToggleSidebar: () => void
  onToggleMobile: () => void
}

export function TopNav({ onToggleSidebar, onToggleMobile }: TopNavProps) {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchFocused, setSearchFocused] = useState(false)

  // Initialize notifications from localStorage or defaults
  const [notifications, setNotifications] = useState<VetraNotification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return DEFAULT_NOTIFICATIONS
  })

  // Persist notifications on update
  const persistNotifications = (updated: VetraNotification[]) => {
    setNotifications(updated)
    try {
      localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated))
    } catch {}
  }

  // Reactive listeners for dynamic system events
  useEffect(() => {
    const handleNewNotif = (e: any) => {
      const detail = e?.detail
      if (!detail) return
      const newNotif: VetraNotification = {
        id: `notif-${Date.now()}`,
        title: detail.title || 'New Notification',
        description: detail.description || '',
        time: 'Just now',
        read: false,
        type: detail.type || 'system',
        link: detail.link || '/dashboard',
      }
      setNotifications((prev) => {
        const updated = [newNotif, ...prev]
        try {
          localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated))
        } catch {}
        return updated
      })
      toast.info(newNotif.title, { description: newNotif.description })
    }

    const handleResumeSync = (e: any) => {
      const fileName = e?.detail?.fileName || 'Resume'
      const newNotif: VetraNotification = {
        id: `notif-resume-${Date.now()}`,
        title: 'Resume Analyzed Successfully',
        description: `Verified skills extracted from ${fileName}. ATS scores and role fit updated.`,
        time: 'Just now',
        read: false,
        type: 'resume',
        link: '/resume-studio',
      }
      setNotifications((prev) => {
        const updated = [newNotif, ...prev.filter((n) => n.id !== newNotif.id)]
        try {
          localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated))
        } catch {}
        return updated
      })
    }

    window.addEventListener('vetra_new_notification', handleNewNotif)
    window.addEventListener('vetra_resume_synced', handleResumeSync)
    return () => {
      window.removeEventListener('vetra_new_notification', handleNewNotif)
      window.removeEventListener('vetra_resume_synced', handleResumeSync)
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    persistNotifications(updated)
    toast.success('All notifications marked as read')
  }

  const handleNotificationClick = (notif: VetraNotification) => {
    const updated = notifications.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    persistNotifications(updated)
    if (notif.link) {
      navigate(notif.link)
    }
  }

  const dismissNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id)
    persistNotifications(updated)
  }

  const clearAllNotifications = () => {
    persistNotifications([])
    toast.info('All notifications cleared')
  }

  const renderNotificationIcon = (type: VetraNotification['type']) => {
    switch (type) {
      case 'resume':
        return <FileText className="h-4 w-4 text-teal" />
      case 'skill':
        return <Target className="h-4 w-4 text-indigo" />
      case 'assessment':
        return <Award className="h-4 w-4 text-amber" />
      case 'roadmap':
        return <Compass className="h-4 w-4 text-violet" />
      default:
        return <Sparkles className="h-4 w-4 text-blue-500" />
    }
  }

  const getIconBg = (type: VetraNotification['type']) => {
    switch (type) {
      case 'resume':
        return 'bg-teal/10 border-teal/20 text-teal'
      case 'skill':
        return 'bg-indigo/10 border-indigo/20 text-indigo'
      case 'assessment':
        return 'bg-amber/10 border-amber/20 text-amber'
      case 'roadmap':
        return 'bg-violet/10 border-violet/20 text-violet'
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-500'
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-sm lg:px-6">
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onToggleMobile}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Desktop sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:flex"
        onClick={onToggleSidebar}
      >
        <PanelLeft className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search skills, jobs, assessments..."
          className="pl-9 bg-muted/50 border-transparent focus:bg-card focus:border-input text-xs sm:text-sm"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>

        {/* Dynamic Interactive Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5 text-foreground/80 hover:text-foreground transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-coral text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 shadow-lg border-border">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/80 px-4 py-3 bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">Notifications</span>
                {unreadCount > 0 ? (
                  <Badge variant="coral" className="text-[10px] px-1.5 py-0">
                    {unreadCount} new
                  </Badge>
                ) : (
                  <Badge variant="muted" className="text-[10px] px-1.5 py-0">
                    All caught up
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-indigo hover:text-indigo/80 px-2 gap-1 font-medium"
                  onClick={markAllAsRead}
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </Button>
              )}
            </div>

            {/* Notification items list */}
            <ScrollArea className="max-h-[340px] divide-y divide-border/60">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={cn(
                      'group relative flex items-start gap-3 p-3.5 transition-colors cursor-pointer hover:bg-muted/50',
                      !notif.read && 'bg-indigo/5 dark:bg-indigo/10'
                    )}
                  >
                    <div className={cn(
                      'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border shadow-xs',
                      getIconBg(notif.type)
                    )}>
                      {renderNotificationIcon(notif.type)}
                    </div>

                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn(
                          'text-xs font-semibold truncate',
                          !notif.read ? 'text-foreground' : 'text-muted-foreground'
                        )}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground shrink-0 font-medium">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {notif.description}
                      </p>
                    </div>

                    {!notif.read && (
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-coral shrink-0" />
                    )}

                    <Button
                      variant="ghost"
                      size="iconSm"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 shrink-0 text-muted-foreground hover:text-coral transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        dismissNotification(notif.id)
                      }}
                      title="Dismiss"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No notifications
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-border/60 p-2 bg-muted/20 flex justify-between items-center text-xs text-muted-foreground px-3">
                <span className="text-[11px]">{notifications.length} alerts saved</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[11px] text-muted-foreground hover:text-coral gap-1"
                  onClick={clearAllNotifications}
                >
                  <Trash2 className="h-3 w-3" />
                  Clear all
                </Button>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 text-xs font-semibold">
                  {user ? getInitials(user.fullName) : '?'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-foreground sm:inline">
                {user?.fullName?.split(' ')[0] || 'User'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{user?.fullName}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="text-coral focus:text-coral"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
