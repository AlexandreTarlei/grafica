import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type LoadingBlockProps = {
  variant?: 'page' | 'cards' | 'table'
  className?: string
}

export function LoadingBlock({ variant = 'page', className }: LoadingBlockProps) {
  if (variant === 'cards') {
    return (
      <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className={cn('space-y-3', className)}>
        <Skeleton className="h-10 w-full rounded-lg" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex min-h-[40vh] flex-col items-center justify-center gap-3 p-6',
        className,
      )}
    >
      <Skeleton className="h-10 w-48 max-w-full rounded-lg" />
      <Skeleton className="h-64 w-full max-w-3xl rounded-xl" />
    </div>
  )
}
