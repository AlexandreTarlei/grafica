import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type ChartCardProps = {
  title?: string
  description?: string
  loading?: boolean
  error?: ReactNode
  children: ReactNode
  className?: string
}

export function ChartCard({ title, description, loading, error, children, className }: ChartCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      {title || description ? (
        <CardHeader className="pb-2">
          {title ? <CardTitle className="text-base font-semibold">{title}</CardTitle> : null}
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
      ) : null}
      <CardContent className="pt-0">
        {error ? (
          error
        ) : loading ? (
          <Skeleton className="h-64 w-full rounded-md md:h-72" />
        ) : (
          <div className="text-muted-foreground h-64 w-full min-w-0 md:h-72">{children}</div>
        )}
      </CardContent>
    </Card>
  )
}
