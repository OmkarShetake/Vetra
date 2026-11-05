import { useState } from 'react'
import { Github } from '@/components/ui/github-icon'
import {
  User, Lock, Bell, Palette, Shield, Trash2, Download,
  Link2, Moon, Sun, AlertTriangle,
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
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function SettingsPage() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    email: true,
    jobAlerts: true,
    skillReminders: false,
    learningProgress: true,
    assessmentResults: true,
    weeklyDigest: false,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account, preferences, and data.</p>
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
              <CardDescription>Update your personal and career information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-name">Full Name</Label>
                  <Input id="settings-name" defaultValue={user?.fullName || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-email">Email</Label>
                  <Input id="settings-email" defaultValue={user?.email || ''} disabled className="bg-muted" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-education">Education</Label>
                  <Select defaultValue="BACHELORS">
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
                  <Select defaultValue="2025">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[2024, 2025, 2026, 2027, 2028].map(y => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-experience">Experience Level</Label>
                  <Select defaultValue="FRESHER">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="FRESHER">Fresher</SelectItem>
                      <SelectItem value="JUNIOR">Junior</SelectItem>
                      <SelectItem value="MID">Mid-level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-target-role">Target Role</Label>
                  <Select defaultValue="JAVA_BACKEND">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JAVA_BACKEND">Java Backend Developer</SelectItem>
                      <SelectItem value="SOFTWARE_ENGINEER">Software Engineer</SelectItem>
                      <SelectItem value="SPRING_BOOT">Spring Boot Developer</SelectItem>
                      <SelectItem value="FULLSTACK">Full Stack Developer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-tech-stack">Preferred Tech Stack (comma-separated)</Label>
                <Input id="settings-tech-stack" defaultValue="Java, Spring Boot, PostgreSQL, Docker" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-objectives">Career Objectives</Label>
                <Textarea id="settings-objectives" rows={4} placeholder="Describe your career goals..." />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="settings-github">GitHub Username</Label>
                  <Input id="settings-github" placeholder="username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-linkedin">LinkedIn URL</Label>
                  <Input id="settings-linkedin" placeholder="linkedin.com/in/username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-portfolio">Portfolio URL</Label>
                  <Input id="settings-portfolio" placeholder="yourportfolio.com" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="gradient" onClick={() => toast.success('Profile saved successfully')}>
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
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                  <Input id="confirm-new-password" type="password" />
                </div>
              </div>
              <Button variant="gradient" onClick={() => toast.success('Password updated')}>
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Connected Accounts</CardTitle>
              <CardDescription>Manage your third-party connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">GitHub</p>
                    <p className="text-xs text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.info('GitHub OAuth coming soon')}>
                  Connect
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-coral/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-coral">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete your account?</DialogTitle>
                    <DialogDescription>
                      This action is permanent and cannot be undone. All your data, including
                      resumes, evidence, and assessments, will be permanently deleted.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={() => toast.error('Account deletion requires confirmation')}>
                      Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>Choose what updates you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'email' as const, label: 'Email Notifications', desc: 'Receive emails about your account activity' },
                { key: 'jobAlerts' as const, label: 'Job Alerts', desc: 'Notifications when new jobs match your profile' },
                { key: 'skillReminders' as const, label: 'Skill Gap Reminders', desc: 'Reminders about skills you need to work on' },
                { key: 'learningProgress' as const, label: 'Learning Progress', desc: 'Updates on your learning roadmap progress' },
                { key: 'assessmentResults' as const, label: 'Assessment Results', desc: 'Notifications when assessment results are ready' },
                { key: 'weeklyDigest' as const, label: 'Weekly Digest', desc: 'A weekly summary of your career progress' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(checked) => {
                      setNotifications({ ...notifications, [item.key]: checked })
                      toast.success(`${item.label} ${checked ? 'enabled' : 'disabled'}`)
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
              <CardTitle className="text-base">Appearance</CardTitle>
              <CardDescription>Customize how Vetra looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Theme</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={cn(
                      'rounded-xl border-2 p-4 transition-all',
                      theme === 'light' ? 'border-indigo bg-indigo/5' : 'border-border',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="h-5 w-5 text-amber" />
                      <span className="text-sm font-medium text-foreground">Light</span>
                    </div>
                    <div className="mt-2 flex gap-1">
                      <div className="h-8 w-full rounded bg-offwhite" />
                    </div>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={cn(
                      'rounded-xl border-2 p-4 transition-all',
                      theme === 'dark' ? 'border-indigo bg-indigo/5' : 'border-border',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="h-5 w-5 text-violet" />
                      <span className="text-sm font-medium text-foreground">Dark</span>
                    </div>
                    <div className="mt-2 flex gap-1">
                      <div className="h-8 w-full rounded bg-midnight" />
                    </div>
                  </button>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="mb-2 block">Interface Density</Label>
                <Select defaultValue="comfortable">
                  <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Privacy Tab */}
        <TabsContent value="privacy" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data Management</CardTitle>
              <CardDescription>Export or manage your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Export Your Data</p>
                  <p className="text-xs text-muted-foreground">Download all your data including resumes, evidence, and assessments</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.info('Data export will be available soon')}>
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Resume Retention</p>
                  <p className="text-xs text-muted-foreground">How long to keep uploaded resumes</p>
                </div>
                <Select defaultValue="90">
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="never">Never delete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Clear Cache</p>
                  <p className="text-xs text-muted-foreground">Clear locally stored data</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                  localStorage.clear()
                  toast.success('Cache cleared')
                }}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Privacy</CardTitle>
              <CardDescription>Your data is private and never shared with third parties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Your resume contains personal information. It is protected with authentication and authorization checks.</p>
              <p>We do not share your personal data, resume content, or assessment results with any third party.</p>
              <p>You can delete your data at any time. Deletion is permanent and cannot be undone.</p>
              <div className="flex gap-2 pt-2">
                <Button variant="link" size="sm" className="px-0" onClick={() => toast.info('Privacy policy coming soon')}>
                  <Link2 className="h-3.5 w-3.5" />
                  Read full privacy policy
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
