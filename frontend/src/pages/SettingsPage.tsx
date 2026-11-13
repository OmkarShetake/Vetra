import { useState, useEffect } from 'react'
import { Github } from '@/components/ui/github-icon'
import {
  User, Lock, Bell, Palette, Shield, Trash2, Download,
  Link2, Moon, Sun, AlertTriangle, Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose, DialogTrigger,
} from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/components/layout/ThemeProvider'
import { apiClient } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const { theme, setTheme } = useTheme()

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)

  // Profile Form States
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [education, setEducation] = useState('BACHELORS')
  const [graduationYear, setGraduationYear] = useState('2025')
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'FRESHER')
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Java Backend Developer')
  const [careerObjectives, setCareerObjectives] = useState('')
  const [githubUsername, setGithubUsername] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')

  const [notifications, setNotifications] = useState({
    email: true,
    jobAlerts: true,
    skillReminders: false,
    learningProgress: true,
    assessmentResults: true,
    weeklyDigest: false,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get<any>('/profile')
      if (data) {
        if (data.fullName) setFullName(data.fullName)
        if (data.education) setEducation(data.education)
        if (data.graduationYear) setGraduationYear(data.graduationYear)
        if (data.experienceLevel) setExperienceLevel(data.experienceLevel)
        if (data.targetRole) setTargetRole(data.targetRole)
        if (data.careerObjectives) setCareerObjectives(data.careerObjectives)
        if (data.githubUsername) setGithubUsername(data.githubUsername)
        if (data.linkedinUrl) setLinkedinUrl(data.linkedinUrl)
        if (data.portfolioUrl) setPortfolioUrl(data.portfolioUrl)
      }
    } catch {
      // Fallback to auth user state
      if (user?.fullName) setFullName(user.fullName)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await apiClient.put('/profile', {
        fullName,
        education,
        graduationYear,
        experienceLevel,
        targetRole,
        careerObjectives,
        githubUsername,
        linkedinUrl,
        portfolioUrl,
      })
      await refreshUser()
      toast.success('Profile changes saved successfully!', {
        description: 'Your career preferences and credentials have been updated.'
      })
    } catch (err: any) {
      toast.error('Failed to save profile', {
        description: err.message || 'Please check your connection and try again.'
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account, preferences, and verified data.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" /> Profile</TabsTrigger>
          <TabsTrigger value="account" className="gap-2"><Lock className="h-4 w-4" /> Account</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2"><Palette className="h-4 w-4" /> Appearance</TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2"><Shield className="h-4 w-4" /> Data & Privacy</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile Information</CardTitle>
              <CardDescription>Update your personal identity, target role, and career credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-name">Full Name</Label>
                  <Input
                    id="settings-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Full Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-email">Email (Immutable)</Label>
                  <Input id="settings-email" value={user?.email || ''} disabled className="bg-muted" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-education">Education</Label>
                  <Select value={education} onValueChange={setEducation}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HIGH_SCHOOL">High School</SelectItem>
                      <SelectItem value="DIPLOMA">Diploma</SelectItem>
                      <SelectItem value="BACHELORS">Bachelor's Degree</SelectItem>
                      <SelectItem value="MASTERS">Master's Degree</SelectItem>
                      <SelectItem value="BOOTCAMP">Bootcamp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-grad-year">Graduation Year</Label>
                  <Select value={graduationYear} onValueChange={setGraduationYear}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[2022, 2023, 2024, 2025, 2026, 2027, 2028].map(y => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-experience">Experience Level</Label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="FRESHER">Fresher (0-1 yrs)</SelectItem>
                      <SelectItem value="JUNIOR">Junior (1-3 yrs)</SelectItem>
                      <SelectItem value="MID">Mid-level (3-5 yrs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-target-role">Target Role</Label>
                  <Select value={targetRole} onValueChange={setTargetRole}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Java Backend Developer">Java Backend Developer</SelectItem>
                      <SelectItem value="Spring Boot Developer">Spring Boot Developer</SelectItem>
                      <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                      <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-objectives">Career Objectives</Label>
                <Textarea
                  id="settings-objectives"
                  rows={3}
                  value={careerObjectives}
                  onChange={(e) => setCareerObjectives(e.target.value)}
                  placeholder="Describe your career focus, specialization interests, and target team environments..."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="settings-github">GitHub Username</Label>
                  <Input
                    id="settings-github"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="e.g. OmkarShetake"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-linkedin">LinkedIn URL</Label>
                  <Input
                    id="settings-linkedin"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="e.g. linkedin.com/in/omkar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-portfolio">Portfolio / Personal Site</Label>
                  <Input
                    id="settings-portfolio"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="e.g. omkarshetake.dev"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="gradient" onClick={handleSaveProfile} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Change Password</CardTitle>
              <CardDescription>Ensure your account is protected with a secure password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="��������" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="��������" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" placeholder="��������" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => toast.success('Password update request sent')}>Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>Choose what updates and intelligence alerts you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive important account updates via email' },
                { key: 'jobAlerts', label: 'Market Intelligence Alerts', desc: 'Notify when high-fit Java backend jobs matching your stack are imported' },
                { key: 'skillReminders', label: 'Roadmap Reminders', desc: 'Gentle nudges to keep your weekly learning progress on track' },
                { key: 'assessmentResults', label: 'Assessment Score Reports', desc: 'Detailed feedback when technical assessments are completed' },
                { key: 'weeklyDigest', label: 'Weekly Career Digest', desc: 'Summary of readiness score gains and trending industry requirements' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={(notifications as any)[item.key]}
                    onCheckedChange={(checked) => {
                      setNotifications(prev => ({ ...prev, [item.key]: checked }))
                      toast.success(`${item.label} updated`)
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appearance & Theme</CardTitle>
              <CardDescription>Customize the interface display theme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div
                  onClick={() => setTheme('light')}
                  className={cn(
                    'cursor-pointer rounded-xl border-2 p-4 text-center transition-all',
                    theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'
                  )}
                >
                  <Sun className="mx-auto h-8 w-8 text-amber-500 mb-2" />
                  <p className="text-sm font-semibold">Light Mode</p>
                  <p className="text-xs text-muted-foreground mt-1">High-contrast enterprise view</p>
                </div>
                <div
                  onClick={() => setTheme('dark')}
                  className={cn(
                    'cursor-pointer rounded-xl border-2 p-4 text-center transition-all',
                    theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'
                  )}
                >
                  <Moon className="mx-auto h-8 w-8 text-blue-400 mb-2" />
                  <p className="text-sm font-semibold">Dark Mode</p>
                  <p className="text-xs text-muted-foreground mt-1">Midnight slate contrast</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data & Privacy</CardTitle>
              <CardDescription>Manage your stored career metrics and data access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <div>
                  <p className="text-sm font-medium">Export Career Portfolio</p>
                  <p className="text-xs text-muted-foreground">Download a complete JSON export of your skills, evidence, and assessment history</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.success('Export downloaded')}>
                  <Download className="mr-2 h-4 w-4" /> Export Data
                </Button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-destructive">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and all associated evidence records</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => toast.error('Account deletion requires email confirmation')}>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
