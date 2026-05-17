import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type DashboardChartCardProps = {
  title?: string
  description?: string
  loading?: boolean
  error?: ReactNode
  children: ReactNode
  className?: string
  headerExtra?: ReactNode
}

export function DashboardChartCard({
  title,
  description,
  loading,
  error,
  children,
  className,
  headerExtra,
}: DashboardChartCardProps) {
  return (
    <Card className={cn('shadow-card overflow-hidden ring-1 ring-border/50', className)}>
      {title || description || headerExtra ? (
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 pb-2">
          <div>
            {title ? <CardTitle className="section-title text-base">{title}</CardTitle> : null}
            {description ? <CardDescription className="mt-0.5">{description}</CardDescription> : null}
          </div>
          {headerExtra}
        </CardHeader>
      ) : null}
      <CardContent className="pt-0">
        {error ? (
          error
        ) : loading ? (
          <Skeleton className="h-64 w-full rounded-lg md:h-72" />
        ) : (
          <div className="h-64 w-full min-w-0 md:h-72">{children}</div>
        )}
      </CardContent>
    </Card>
  )
}
