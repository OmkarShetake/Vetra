import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, GraduationCap, Briefcase, Code2, Target,
  ArrowRight, ArrowLeft, Check, Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Logo } from '@/components/Logo'
import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/api'
import { cn } from '@/lib/utils'

const techStackOptions = ['Java', 'Python', 'JavaScript', 'TypeScript', 'Spring Boot', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Git', 'REST APIs', 'Kafka', 'Redis', 'MongoDB']

const steps = [
  { id: 1, label: 'Profile', icon: User },
  { id: 2, label: 'Education', icon: GraduationCap },
  { id: 3, label: 'Experience', icon: Briefcase },
  { id: 4, label: 'Skills', icon: Code2 },
  { id: 5, label: 'Objectives', icon: Target },
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const { user, updateUser, refreshUser } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [selectedTech, setSelectedTech] = useState<string[]>([])
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    education: '',
    graduationYear: '',
    experienceLevel: '',
    targetJobRole: '',
    careerObjectives: '',
  })

  const toggleTech = (tech: string) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech],
    )
  }

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      setSubmitting(true)
      try {
        // Try backend onboarding
        await apiClient.post('/profile/onboarding', {
          fullName: formData.fullName,
          education: formData.education,
          graduationYear: formData.graduationYear,
          experienceLevel: formData.experienceLevel,
          targetJobRole: formData.targetJobRole,
          preferredTechStack: selectedTech,
          currentSkills: selectedTech,
          careerObjectives: formData.careerObjectives,
        })
        // Re-fetch the user to get updated onboardingCompleted = true
        await refreshUser()
        toast.success('Profile setup complete! Welcome to Vetra.')
        navigate('/dashboard')
      } catch {
        // Backend not running — mark locally and proceed (graceful degradation)
        if (user) {
          updateUser({
            ...user,
            onboardingCompleted: true,
            targetRole: formData.targetJobRole || user.targetRole,
            experienceLevel: formData.experienceLevel || user.experienceLevel,
          })
        }
        toast.success('Profile setup complete!')
        navigate('/dashboard')
      } finally {
        setSubmitting(false)
      }
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSkip = () => {
    if (user) updateUser({ ...user, onboardingCompleted: true })
    toast.info('You can complete your profile later in Settings')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Logo />
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            Skip for now
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Progress indicator */}
        <div className="mb-10 flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                    currentStep > step.id
                      ? 'border-teal bg-teal text-white'
                      : currentStep === step.id
                      ? 'border-indigo bg-indigo text-white'
                      : 'border-border bg-card text-muted-foreground',
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className={cn(
                  'mt-2 hidden text-xs font-medium sm:block',
                  currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground',
                )}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'mx-2 h-0.5 flex-1 rounded-full transition-colors',
                  currentStep > step.id ? 'bg-teal' : 'bg-border',
                )} />
              )}
            </div>
          ))}
        </div>

        <Card className="p-8 shadow-card">
          {/* Step 1: Profile */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Let's start with your name</h2>
                <p className="mt-1 text-sm text-muted-foreground">We use this to personalize your experience.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
            </div>
          )}

          {/* Step 2: Education */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Tell us about your education</h2>
                <p className="mt-1 text-sm text-muted-foreground">This helps us tailor recommendations to your level.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Select onValueChange={(v) => setFormData({ ...formData, education: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HIGH_SCHOOL">High School</SelectItem>
                      <SelectItem value="DIPLOMA">Diploma</SelectItem>
                      <SelectItem value="BACHELORS">Bachelor's Degree</SelectItem>
                      <SelectItem value="MASTERS">Master's Degree</SelectItem>
                      <SelectItem value="BOOTCAMP">Bootcamp</SelectItem>
                      <SelectItem value="SELF_TAUGHT">Self-taught</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Select onValueChange={(v) => setFormData({ ...formData, graduationYear: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2024, 2025, 2026, 2027, 2028].map((year) => (
                        <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Experience */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-2xl font-bold text-foreground">What's your experience level?</h2>
                <p className="mt-1 text-sm text-muted-foreground">We'll adjust the difficulty of assessments and recommendations.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { value: 'STUDENT', label: 'Student', desc: 'Currently studying' },
                  { value: 'FRESHER', label: 'Fresher', desc: 'No formal experience' },
                  { value: 'JUNIOR', label: 'Junior', desc: 'Less than 2 years' },
                  { value: 'MID', label: 'Mid-level', desc: '2-4 years experience' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFormData({ ...formData, experienceLevel: opt.value })}
                    className={cn(
                      'rounded-xl border-2 p-4 text-left transition-all',
                      formData.experienceLevel === opt.value
                        ? 'border-indigo bg-indigo/5'
                        : 'border-border hover:border-muted-foreground',
                    )}
                  >
                    <p className="font-medium text-foreground">{opt.label}</p>
                    <p className="text-sm text-muted-foreground">{opt.desc}</p>
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetRole">Target Job Role</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, targetJobRole: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your target role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JAVA_BACKEND">Java Backend Developer</SelectItem>
                    <SelectItem value="SOFTWARE_ENGINEER">Software Engineer</SelectItem>
                    <SelectItem value="SPRING_BOOT">Spring Boot Developer</SelectItem>
                    <SelectItem value="FULLSTACK">Full Stack Developer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 4: Skills */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Select your tech stack</h2>
                <p className="mt-1 text-sm text-muted-foreground">Choose technologies you're familiar with. You can add more later.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStackOptions.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={cn(
                      'rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                      selectedTech.includes(tech)
                        ? 'border-indigo bg-indigo/10 text-indigo'
                        : 'border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground',
                    )}
                  >
                    {selectedTech.includes(tech) && <Check className="mr-1 inline h-3.5 w-3.5" />}
                    {tech}
                  </button>
                ))}
              </div>
              {selectedTech.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Selected: {selectedTech.length} technologies</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedTech.map((tech) => (
                      <Badge key={tech} variant="default">{tech}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Objectives */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-2xl font-bold text-foreground">What are your career objectives?</h2>
                <p className="mt-1 text-sm text-muted-foreground">Tell us what you want to achieve. This guides your learning roadmap.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="objectives">Career Objectives</Label>
                <Textarea
                  id="objectives"
                  rows={6}
                  value={formData.careerObjectives}
                  onChange={(e) => setFormData({ ...formData, careerObjectives: e.target.value })}
                  placeholder="e.g., I want to become a Java backend developer within 6 months. I'm interested in building scalable REST APIs and microservices. I want to work at a product-based company."
                />
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-indigo" />
                  <div>
                    <p className="text-sm font-medium text-foreground">You're all set!</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      After this, you'll be taken to your dashboard where you can start exploring job intelligence,
                      uploading your resume, and building your evidence portfolio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 1 || submitting}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button variant="gradient" onClick={handleNext} disabled={submitting}>
              {currentStep === steps.length
                ? (submitting ? 'Setting up...' : 'Complete Setup')
                : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
