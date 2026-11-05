import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="relative mb-8 flex h-32 w-32 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-indigo/10 blur-xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-border bg-card shadow-elevated">
          <Compass className="h-10 w-10 text-indigo" />
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo">404</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Looks like this page went off the career track. The route you're looking for doesn't exist
          or may have moved.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="gradient" asChild>
            <Link to="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
