import { Link } from 'react-router-dom'
import {
  Briefcase,
  Network,
  FileText,
  Target,
  FolderCheck,
  GraduationCap,
  ArrowRight,
  Check,
  Search,
  BarChart3,
  Sparkles,
  TrendingUp,
  Code2,
  Database,
  Server,
  GitBranch,
  ShieldCheck,
  Lightbulb,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Logo } from '@/components/Logo'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: Briefcase,
    title: 'Job Market Intelligence',
    description: 'Search and analyze real job descriptions. Import any job posting and extract required and preferred skills automatically.',
    color: 'text-indigo bg-indigo/10',
  },
  {
    icon: Network,
    title: 'Skill Graph',
    description: 'Explore an interactive graph of how technologies connect. Understand prerequisites, dependencies, and learning paths.',
    color: 'text-violet bg-violet/10',
  },
  {
    icon: FileText,
    title: 'Resume Intelligence',
    description: 'Upload your resume and get structured analysis on skill coverage, keyword gaps, project quality, and evidence alignment.',
    color: 'text-teal bg-teal/10',
  },
  {
    icon: Target,
    title: 'Skill Gap Analysis',
    description: 'See exactly where you stand against job requirements. Every classification comes with evidence and a clear explanation.',
    color: 'text-amber bg-amber/10',
  },
  {
    icon: FolderCheck,
    title: 'Evidence Portfolio',
    description: 'Connect GitHub, add projects, upload certifications. Show proof behind every skill claim, not just self-declaration.',
    color: 'text-sky bg-sky/10',
  },
  {
    icon: GraduationCap,
    title: 'Personalized Learning Roadmap',
    description: 'Get a practical, phased learning plan based on your current skills, missing skills, and actual job market demands.',
    color: 'text-coral bg-coral/10',
  },
]

const howItWorks = [
  {
    step: '01',
    title: 'Discover',
    description: 'Search real job descriptions and explore the skill graph to understand what companies actually require.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Analyze',
    description: 'Upload your resume and connect your evidence. See how your skills align with your target role.',
    icon: BarChart3,
  },
  {
    step: '03',
    title: 'Improve',
    description: 'Get actionable recommendations for your resume and a personalized learning roadmap for missing skills.',
    icon: Lightbulb,
  },
  {
    step: '04',
    title: 'Prove',
    description: 'Build an evidence portfolio, complete assessments, and demonstrate your capabilities with proof.',
    icon: ShieldCheck,
  },
]

const dashboardPreviewStats = [
  { label: 'Career Readiness', value: '72%', color: 'text-teal' },
  { label: 'Skills Demonstrated', value: '14', color: 'text-indigo' },
  { label: 'Skill Gaps', value: '6', color: 'text-amber' },
  { label: 'Learning Tasks', value: '8', color: 'text-sky' },
]

const skillTrends = [
  { name: 'Java', demand: 89, trend: 'up' },
  { name: 'Spring Boot', demand: 76, trend: 'up' },
  { name: 'PostgreSQL', demand: 71, trend: 'stable' },
  { name: 'Docker', demand: 68, trend: 'up' },
  { name: 'REST APIs', demand: 82, trend: 'stable' },
  { name: 'Git', demand: 95, trend: 'stable' },
]

const faqs = [
  {
    question: 'Is Vetra a job board?',
    answer: 'No. Vetra is a career intelligence platform. It helps you understand job requirements, identify your skill gaps, improve your resume with evidence, and prove your capabilities. You can import job descriptions from any source to analyze them.',
  },
  {
    question: 'Does Vetra invent skills or experience I do not have?',
    answer: 'Never. Vetra analyzes your actual resume and evidence. AI-generated suggestions are always grounded in your original content and verified information. We do not fabricate work experience, projects, or achievements.',
  },
  {
    question: 'How does the skill gap analysis work?',
    answer: 'Vetra compares job requirements against your demonstrated skills. Each skill is classified as demonstrated, partially demonstrated, or not demonstrated, with the underlying evidence and a clear explanation for every classification.',
  },
  {
    question: 'Can I use Vetra if I am still a student?',
    answer: 'Yes. Vetra is designed for CS and IT students, fresh graduates, and early-career developers. You can start building your evidence portfolio from your coursework and personal projects.',
  },
  {
    question: 'Is my data private?',
    answer: 'Yes. Your resume and personal data are protected with authentication and authorization. We do not share your data with third parties. You can delete your data at any time.',
  },
  {
    question: 'What roles does Vetra currently support?',
    answer: 'We are starting with entry-level software engineering roles including Java Backend Developer, Software Engineer, and Spring Boot Developer. The architecture is designed to add other IT roles without major restructuring.',
  },
]

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#students" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">For Students</a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button variant="gradient" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-card px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#students" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>For Students</a>
              <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="gradient" className="flex-1" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-indigo/5 blur-[120px]" />
        <div className="absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-violet/5 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          {/* Left content */}
          <div className="animate-fade-in-up">
            <Badge variant="default" className="mb-6 gap-1.5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" />
              Evidence-Based Career Intelligence
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Turn Your Skills Into{' '}
              <span className="gradient-text">Career Opportunities</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground text-balance">
              Vetra connects real job requirements with your actual skills and evidence.
              Understand what companies demand, identify your gaps, improve your resume,
              and prove your capabilities.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="gradient" size="xl" asChild>
                <Link to="/register">
                  Build My Career Profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/login">
                  Explore Skill Intelligence
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-teal" />
                Free for students
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-teal" />
                No fake data
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-teal" />
                Privacy-first
              </div>
            </div>
          </div>

          {/* Right: Dashboard Preview */}
          <div className="relative animate-scale-in">
            <div className="absolute -inset-4 rounded-3xl gradient-brand opacity-10 blur-2xl" />
            <div className="relative rounded-2xl border border-border bg-card p-1 shadow-elevated">
              {/* Mock browser bar */}
              <div className="flex items-center gap-2 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-coral/60" />
                  <div className="h-3 w-3 rounded-full bg-amber/60" />
                  <div className="h-3 w-3 rounded-full bg-teal/60" />
                </div>
                <div className="ml-3 flex-1 rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground">
                  vetra.app/dashboard
                </div>
              </div>

              {/* Mock dashboard */}
              <div className="space-y-4 rounded-xl bg-background p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Welcome back,</p>
                    <p className="text-lg font-semibold text-foreground">Alex Chen</p>
                  </div>
                  <Badge variant="teal" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% this week
                  </Badge>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {dashboardPreviewStats.map((stat) => (
                    <div key={stat.label} className="rounded-lg border border-border bg-card p-3">
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className={cn('mt-1 text-2xl font-bold', stat.color)}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Skill bar chart */}
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="mb-3 text-sm font-medium text-foreground">Most Demanded Skills</p>
                  <div className="space-y-2.5">
                    {skillTrends.map((skill) => (
                      <div key={skill.name} className="flex items-center gap-3">
                        <span className="w-24 text-xs text-muted-foreground">{skill.name}</span>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full gradient-brand"
                            style={{ width: `${skill.demand}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground">{skill.demand}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target role card */}
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Target Role</p>
                      <p className="text-sm font-medium text-foreground">Java Backend Developer</p>
                    </div>
                    <div className="flex -space-x-2">
                      {[Code2, Database, Server, GitBranch].map((Icon, i) => (
                        <div key={i} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Demand Section */}
      <section className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <Badge variant="info" className="mb-4">
              <TrendingUp className="h-3.5 w-3.5" />
              Industry Demand
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              What the market is looking for
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Demonstration data based on common entry-level Java backend developer requirements.
              Real demand data updates as job descriptions are imported and analyzed.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Most Required Languages', items: ['Java', 'Python', 'JavaScript', 'SQL'], icon: Code2 },
              { title: 'Most Required Frameworks', items: ['Spring Boot', 'React', 'Hibernate', 'Express'], icon: Server },
              { title: 'Most Required Tools', items: ['Git', 'Docker', 'PostgreSQL', 'Redis'], icon: Database },
            ].map((section) => (
              <Card key={section.title} className="hover:shadow-float transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo/10">
                      <section.icon className="h-5 w-5 text-indigo" />
                    </div>
                    <CardTitle className="text-base">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {section.items.map((item) => (
                      <Badge key={item} variant="muted">{item}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              From skills to opportunities in four steps
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Vetra guides you through a clear process: understand the market, analyze your position,
              improve your profile, and prove your capabilities.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="absolute top-8 left-full hidden w-full h-px bg-border lg:block" style={{ left: 'calc(50% + 40px)', width: 'calc(100% - 80px)' }} />
                )}
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand text-white shadow-md">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <span className="mt-4 block text-xs font-bold text-indigo">{step.step}</span>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="border-t border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <Badge variant="default" className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Everything you need to build a strong career profile
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Six interconnected modules that work together to turn your skills into evidence-based career opportunities.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group hover:shadow-float transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', feature.color)}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 text-lg">{feature.title}</CardTitle>
                  <CardDescription className="mt-2">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Career Transformation Section */}
      <section id="students" className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="teal" className="mb-4">For Students</Badge>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Stop guessing. Start proving.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Most students apply to jobs without knowing what companies actually want.
                Vetra changes that by giving you a clear, evidence-based picture of where you stand
                and what to do next.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { title: 'Know exactly what to learn next', description: 'Your learning roadmap is based on real job requirements and your actual skill gaps, not generic advice.' },
                  { title: 'Show proof, not just claims', description: 'Connect your GitHub, add projects, and complete assessments. Every verified skill has evidence behind it.' },
                  { title: 'Improve your resume honestly', description: 'Get suggestions grounded in your actual experience. We never invent work history or fake achievements.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/10">
                      <Check className="h-4 w-4 text-teal" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="gradient" size="lg" className="mt-8" asChild>
                <Link to="/register">
                  Start Building Your Profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-teal/5 blur-2xl" />
              <Card className="relative shadow-elevated">
                <CardHeader>
                  <CardTitle>Skill Gap Analysis Example</CardTitle>
                  <CardDescription>Target Role: Java Backend Developer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Java', status: 'DEMONSTRATED', icon: Code2, color: 'teal' },
                      { name: 'Spring Boot', status: 'PARTIALLY_DEMONSTRATED', icon: Server, color: 'amber' },
                      { name: 'Docker', status: 'NOT_DEMONSTRATED', icon: Database, color: 'coral' },
                      { name: 'REST APIs', status: 'DEMONSTRATED', icon: GitBranch, color: 'teal' },
                      { name: 'Spring Security', status: 'NOT_DEMONSTRATED', icon: ShieldCheck, color: 'coral' },
                    ].map((skill) => (
                      <div key={skill.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div className="flex items-center gap-3">
                          <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', `bg-${skill.color}/10`)}>
                            <skill.icon className={cn('h-4 w-4', `text-${skill.color}`)} />
                          </div>
                          <span className="text-sm font-medium text-foreground">{skill.name}</span>
                        </div>
                        <Badge variant={
                          skill.status === 'DEMONSTRATED' ? 'teal'
                          : skill.status === 'PARTIALLY_DEMONSTRATED' ? 'amber'
                          : 'coral'
                        }>
                          {skill.status === 'DEMONSTRATED' ? 'Demonstrated'
                           : skill.status === 'PARTIALLY_DEMONSTRATED' ? 'Partial'
                           : 'Missing'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border bg-card py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="text-center">
            <Badge variant="muted" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-12">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl gradient-brand p-12 text-center shadow-elevated">
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to prove what you can do?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/80">
                Join Vetra today. Build your career profile, analyze real jobs, improve your resume,
                and demonstrate your skills with evidence.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button size="xl" className="bg-white text-indigo hover:bg-white/90" asChild>
                  <Link to="/register">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="xl" className="bg-white/10 text-white border border-white/20 hover:bg-white/20" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <Logo />
              <p className="mt-4 text-sm text-muted-foreground">
                Evidence-based career intelligence for students and early-career developers.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Product</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a></li>
                <li><Link to="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Company</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Connect</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">LinkedIn</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Vetra. From job requirements to proven capabilities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
