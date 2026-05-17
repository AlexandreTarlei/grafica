import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type MetricCardProps = {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  loading?: boolean
  deltaLabel?: string
  className?: string
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  loading,
  deltaLabel,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <span className="text-muted-foreground text-sm font-medium">{title}</span>
        <span className="bg-primary/8 text-primary flex size-9 items-center justify-center rounded-lg">
          <Icon className="size-4" />
        </span>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        ) : (
          <>
            <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
            {deltaLabel ? (
              <p className="text-muted-foreground mt-0.5 text-xs font-medium">{deltaLabel}</p>
            ) : null}
            {description ? (
              <p className="text-muted-foreground mt-1 text-xs">{description}</p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  )
}
