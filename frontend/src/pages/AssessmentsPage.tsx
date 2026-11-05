import { useState } from 'react'
import {
  ClipboardCheck, Play, Clock, CheckCircle2, XCircle, Award,
  Code2, Database, Server, GitBranch, Brain, BarChart3, ChevronRight,
  RotateCcw, Sparkles, Check, HelpCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AssessmentItem {
  id: string
  title: string
  description: string
  skillArea: string
  questionCount: number
  durationMinutes: number
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
}

interface Question {
  id: number
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface AttemptItem {
  id: string
  assessmentTitle: string
  score: number
  passed: boolean
  completedAt: string
}

const difficultyConfig = {
  BEGINNER: { label: 'Beginner', variant: 'teal' as const },
  INTERMEDIATE: { label: 'Intermediate', variant: 'amber' as const },
  ADVANCED: { label: 'Advanced', variant: 'coral' as const },
}

const skillIcons: Record<string, typeof Code2> = {
  'Java Fundamentals': Code2,
  'OOP Concepts': Brain,
  'SQL Basics': Database,
  'Spring Boot Fundamentals': Server,
  'REST API Concepts': GitBranch,
}

const assessments: AssessmentItem[] = [
  { id: '1', title: 'Java Fundamentals', description: 'Test your knowledge of Java syntax, variables, control flow, memory model, and collections.', skillArea: 'Java', questionCount: 5, durationMinutes: 10, difficulty: 'BEGINNER' },
  { id: '2', title: 'OOP Concepts', description: 'Assessment covering encapsulation, inheritance, polymorphism, and abstraction in Java.', skillArea: 'OOP', questionCount: 5, durationMinutes: 10, difficulty: 'BEGINNER' },
  { id: '3', title: 'SQL Basics', description: 'Test SQL queries, JOINs, GROUP BY, indexes, and relational database constraints.', skillArea: 'SQL', questionCount: 5, durationMinutes: 10, difficulty: 'BEGINNER' },
  { id: '4', title: 'Spring Boot Fundamentals', description: 'Core concepts: auto-configuration, dependency injection, and REST controllers.', skillArea: 'Spring Boot', questionCount: 5, durationMinutes: 15, difficulty: 'INTERMEDIATE' },
  { id: '5', title: 'REST API Concepts', description: 'Test HTTP methods, status codes, idempotency, and RESTful API architecture.', skillArea: 'REST APIs', questionCount: 5, durationMinutes: 10, difficulty: 'INTERMEDIATE' },
]

const assessmentQuestions: Record<string, Question[]> = {
  'Java Fundamentals': [
    {
      id: 1,
      prompt: 'Which memory area in the JVM holds object instances created during runtime?',
      options: ['Heap Memory', 'Stack Memory', 'Method Area', 'Program Counter Register'],
      correctIndex: 0,
      explanation: 'All class instances and arrays are allocated on the Java Heap, managed by the Garbage Collector.'
    },
    {
      id: 2,
      prompt: 'What is the default value of a boolean variable declared as a class field in Java?',
      options: ['true', 'false', 'null', '0'],
      correctIndex: 1,
      explanation: 'Uninitialized boolean primitive instance/class variables default to false in Java.'
    },
    {
      id: 3,
      prompt: 'Which collection implementation does not allow duplicate elements and guarantees insertion order?',
      options: ['HashSet', 'TreeSet', 'LinkedHashSet', 'ArrayList'],
      correctIndex: 2,
      explanation: 'LinkedHashSet maintains a doubly-linked list running through all of its entries, preserving insertion order without allowing duplicates.'
    },
    {
      id: 4,
      prompt: 'What happens if you attempt to modify an element while iterating with an Iterator without using iterator.remove()?',
      options: ['IndexOutOfBoundsException', 'ConcurrentModificationException', 'NullPointerException', 'IllegalStateException'],
      correctIndex: 1,
      explanation: 'Java collections with fail-fast iterators detect structural modifications outside the iterator and throw ConcurrentModificationException.'
    },
    {
      id: 5,
      prompt: 'Which interface in Java is a Functional Interface suitable for lambda expressions that take no argument and return a value?',
      options: ['Consumer<T>', 'Predicate<T>', 'Function<T, R>', 'Supplier<T>'],
      correctIndex: 3,
      explanation: 'Supplier<T> has a single abstract method T get() which accepts no parameters and returns an object of type T.'
    }
  ],
  'Spring Boot Fundamentals': [
    {
      id: 1,
      prompt: 'Which annotation combines @Configuration, @EnableAutoConfiguration, and @ComponentScan in Spring Boot?',
      options: ['@SpringBootApplication', '@EnableSpringBoot', '@SpringBootConfiguration', '@SpringCloudApplication'],
      correctIndex: 0,
      explanation: '@SpringBootApplication is a meta-annotation that bundles @Configuration, @EnableAutoConfiguration, and @ComponentScan.'
    },
    {
      id: 2,
      prompt: 'What is the default scope of a Spring Bean if none is specified?',
      options: ['prototype', 'singleton', 'request', 'session'],
      correctIndex: 1,
      explanation: 'Spring beans are singletons by default; exactly one instance exists per ApplicationContext.'
    },
    {
      id: 3,
      prompt: 'Which Spring Boot starter dependency includes embedded Tomcat, Spring MVC, and REST validation?',
      options: ['spring-boot-starter-tomcat', 'spring-boot-starter-web', 'spring-boot-starter-actuator', 'spring-boot-starter-data-jpa'],
      correctIndex: 1,
      explanation: 'spring-boot-starter-web pulls in Spring MVC, Jackson for JSON parsing, and embedded Tomcat by default.'
    },
    {
      id: 4,
      prompt: 'Which HTTP status code is typically returned by a REST API when a resource is successfully created?',
      options: ['200 OK', '201 Created', '202 Accepted', '204 No Content'],
      correctIndex: 1,
      explanation: 'HTTP 201 Created indicates that the request succeeded and led to the creation of a new resource.'
    },
    {
      id: 5,
      prompt: 'How do you read a property "app.timeout" from application.yml in a Spring service?',
      options: ['@Inject("app.timeout")', '@Value("${app.timeout}")', '@PropertySource("app.timeout")', '@ConfigProperty("app.timeout")'],
      correctIndex: 1,
      explanation: '@Value("${property.name}") injects configuration values from Spring Environment into bean fields.'
    }
  ]
}

const initialAttempts: AttemptItem[] = [
  { id: '1', assessmentTitle: 'Java Fundamentals', score: 80, passed: true, completedAt: 'Jan 15, 2025' },
  { id: '2', assessmentTitle: 'SQL Basics', score: 100, passed: true, completedAt: 'Jan 20, 2025' },
  { id: '3', assessmentTitle: 'OOP Concepts', score: 80, passed: true, completedAt: 'Feb 1, 2025' },
]

export function AssessmentsPage() {
  const [attemptsList, setAttemptsList] = useState<AttemptItem[]>(initialAttempts)
  const [activeAssessment, setActiveAssessment] = useState<AssessmentItem | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [finalScore, setFinalScore] = useState<number | null>(null)

  const startAssessment = (assessment: AssessmentItem) => {
    setActiveAssessment(assessment)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setIsSubmitted(false)
    setFinalScore(null)
  }

  const currentQuestions = activeAssessment
    ? assessmentQuestions[activeAssessment.title] || assessmentQuestions['Java Fundamentals']
    : []

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }))
  }

  const handleSubmitTest = () => {
    let correct = 0
    currentQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++
      }
    })
    const scorePct = Math.round((correct / currentQuestions.length) * 100)
    setFinalScore(scorePct)
    setIsSubmitted(true)

    const passed = scorePct >= 70
    const newAttempt: AttemptItem = {
      id: Date.now().toString(),
      assessmentTitle: activeAssessment!.title,
      score: scorePct,
      passed,
      completedAt: 'Just now'
    }

    setAttemptsList([newAttempt, ...attemptsList])

    if (passed) {
      toast.success(`Congratulations! You passed with ${scorePct}%`, {
        description: `Verified badge added to your evidence portfolio for ${activeAssessment!.skillArea}.`
      })
    } else {
      toast.error(`Score: ${scorePct}%. Passing score is 70%`, {
        description: 'Review the explanations below and feel free to retake when ready.'
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Technical Assessments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Prove your capabilities through standardized assessments. Passing adds verified evidence badges directly to your profile.
          </p>
        </div>
        <Badge variant="teal" className="h-fit px-3 py-1.5 text-xs font-semibold">
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          Passing Threshold: 70%
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Available Tests', value: assessments.length, icon: ClipboardCheck, color: 'text-indigo', bg: 'bg-indigo/10' },
          { label: 'Tests Taken', value: attemptsList.length, icon: CheckCircle2, color: 'text-teal', bg: 'bg-teal/10' },
          { label: 'Verified Passed', value: attemptsList.filter(a => a.passed).length, icon: Award, color: 'text-violet', bg: 'bg-violet/10' },
          {
            label: 'Average Score',
            value: attemptsList.length ? `${Math.round(attemptsList.reduce((s, a) => s + a.score, 0) / attemptsList.length)}%` : '0%',
            icon: BarChart3,
            color: 'text-sky',
            bg: 'bg-sky/10'
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-border shadow-sm">
            <CardContent className="flex items-center gap-3.5 p-4">
              <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', stat.bg)}>
                <stat.icon className={cn('h-5 w-5', stat.color)} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Assessments */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Available Technical Tests</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assessments.map((assessment) => {
            const hasAttempt = attemptsList.find(a => a.assessmentTitle === assessment.title)
            const diff = difficultyConfig[assessment.difficulty]
            const IconComponent = skillIcons[assessment.title] || Code2

            return (
              <Card key={assessment.id} className="flex flex-col border-border transition-all hover:border-indigo/40 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo/10 text-indigo">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <Badge variant={diff.variant}>{diff.label}</Badge>
                  </div>
                  <CardTitle className="mt-3 text-base">{assessment.title}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">{assessment.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="h-3.5 w-3.5" />
                      {assessment.questionCount} Questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {assessment.durationMinutes} min
                    </span>
                  </div>

                  {hasAttempt && (
                    <div className="mt-3 rounded-lg border border-border bg-muted/40 p-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">Best Attempt</span>
                        <Badge variant={hasAttempt.passed ? 'teal' : 'coral'} className="gap-1">
                          {hasAttempt.passed ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {hasAttempt.score}% {hasAttempt.passed ? 'Passed' : 'Failed'}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <Button
                    className="mt-4 w-full gap-2 font-medium"
                    variant={hasAttempt?.passed ? 'outline' : 'gradient'}
                    size="sm"
                    onClick={() => startAssessment(assessment)}
                  >
                    <Play className="h-3.5 w-3.5" />
                    {hasAttempt ? 'Retake Assessment' : 'Start Assessment'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Assessment History */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Verified Assessment History</h2>
        {attemptsList.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No completed assessments yet. Pick an assessment above to verify your skills.
          </Card>
        ) : (
          <div className="space-y-3">
            {attemptsList.map((attempt) => (
              <Card key={attempt.id} className="border-border p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                      attempt.passed ? 'bg-teal/10 text-teal' : 'bg-coral/10 text-coral'
                    )}>
                      {attempt.passed ? <Award className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{attempt.assessmentTitle}</p>
                      <p className="text-xs text-muted-foreground">Completed: {attempt.completedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <Badge variant={attempt.passed ? 'teal' : 'coral'}>
                      Score: {attempt.score}%
                    </Badge>
                    <Badge variant="muted">
                      {attempt.passed ? 'Verified Skill Added' : 'No Credential'}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Active Assessment Interactive Runner Dialog */}
      <Dialog open={!!activeAssessment} onOpenChange={(open) => !open && setActiveAssessment(null)}>
        <DialogContent className="max-w-2xl sm:max-h-[85vh] overflow-y-auto">
          {activeAssessment && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="info">{activeAssessment.skillArea}</Badge>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {currentQuestions.length}
                  </span>
                </div>
                <DialogTitle className="mt-2 text-xl font-bold">
                  {activeAssessment.title} Assessment
                </DialogTitle>
                <DialogDescription>
                  {isSubmitted ? 'Test completed! Review your results and answer explanations.' : 'Select the best answer for each question. You need 70% to pass.'}
                </DialogDescription>
              </DialogHeader>

              {/* Progress bar */}
              <div className="space-y-1">
                <Progress
                  value={((currentQuestionIndex + 1) / currentQuestions.length) * 100}
                  className="h-1.5"
                />
              </div>

              {/* Result Banner if submitted */}
              {isSubmitted && finalScore !== null && (
                <div className={cn(
                  'rounded-xl border p-4 text-center',
                  finalScore >= 70 ? 'border-teal bg-teal/10 text-teal' : 'border-coral bg-coral/10 text-coral'
                )}>
                  <p className="text-lg font-bold">
                    {finalScore >= 70 ? '🎉 Test Passed!' : 'Needs Improvement'}
                  </p>
                  <p className="text-sm">
                    You scored <span className="font-extrabold">{finalScore}%</span> ({Math.round((finalScore / 100) * currentQuestions.length)} / {currentQuestions.length} correct).
                  </p>
                </div>
              )}

              {/* Question Body */}
              <div className="space-y-4 py-2">
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-semibold text-foreground">
                    {currentQuestions[currentQuestionIndex]?.prompt}
                  </p>
                </div>

                {/* Options list */}
                <div className="space-y-2">
                  {currentQuestions[currentQuestionIndex]?.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === optIdx
                    const isCorrect = currentQuestions[currentQuestionIndex].correctIndex === optIdx
                    const showCorrectness = isSubmitted

                    return (
                      <button
                        key={optIdx}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm font-medium transition-all',
                          !showCorrectness && isSelected
                            ? 'border-indigo bg-indigo/10 text-indigo ring-1 ring-indigo'
                            : !showCorrectness
                            ? 'border-border hover:border-border hover:bg-muted/50 text-foreground'
                            : isCorrect
                            ? 'border-teal bg-teal/10 text-teal font-semibold'
                            : isSelected && !isCorrect
                            ? 'border-coral bg-coral/10 text-coral'
                            : 'border-border opacity-60 text-muted-foreground'
                        )}
                      >
                        <span>{opt}</span>
                        {showCorrectness && isCorrect && <CheckCircle2 className="h-4 w-4 text-teal" />}
                        {showCorrectness && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-coral" />}
                      </button>
                    )
                  })}
                </div>

                {/* Explanation if submitted */}
                {isSubmitted && (
                  <div className="rounded-lg border border-border bg-muted/60 p-3.5 text-xs text-muted-foreground space-y-1">
                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                      <Brain className="h-3.5 w-3.5 text-indigo" />
                      Explanation:
                    </p>
                    <p>{currentQuestions[currentQuestionIndex]?.explanation}</p>
                  </div>
                )}
              </div>

              {/* Footer navigation */}
              <DialogFooter className="flex items-center justify-between sm:justify-between border-t border-border pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                >
                  Previous
                </Button>

                <div className="flex gap-2">
                  {currentQuestionIndex < currentQuestions.length - 1 ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    >
                      Next Question
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  ) : !isSubmitted ? (
                    <Button
                      variant="gradient"
                      size="sm"
                      disabled={Object.keys(selectedAnswers).length < currentQuestions.length}
                      onClick={handleSubmitTest}
                    >
                      Submit Assessment
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveAssessment(null)}
                    >
                      Close Results
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
