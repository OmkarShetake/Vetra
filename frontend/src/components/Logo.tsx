import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  const iconSize = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-9 w-9' : 'h-8 w-8'
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg'
  const padding = size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-2' : 'p-1.5'

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'rounded-lg bg-slate-900 text-blue-500 flex items-center justify-center shadow-xs dark:bg-blue-600 dark:text-white',
          iconSize,
          padding,
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 4L12 20L20 4"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 4L12 14L17 4"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          />
        </svg>
      </div>
      {showText && (
        <span className={cn('font-bold tracking-tight text-foreground flex items-center gap-1', textSize)}>
          Vetra
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 inline-block mb-1" />
        </span>
      )}
    </div>
  )
}
