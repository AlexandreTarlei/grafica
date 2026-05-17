import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { KpiTrend, KpiVariant } from '@/modules/dashboard/types'
import { cn } from '@/lib/utils'

const variantStyles: Record<
  KpiVariant,
  { tile: string; icon: string }
> = {
  revenue: { tile: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', icon: '' },
  sales: { tile: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', icon: '' },
  contracts: { tile: 'bg-violet-500/10 text-violet-600 dark:text-violet-400', icon: '' },
  rentals: { tile: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', icon: '' },
  clients: { tile: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400', icon: '' },
  products: { tile: 'bg-orange-500/10 text-orange-600 dark:text-orange-400', icon: '' },
  inventory: { tile: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', icon: '' },
  cashflow: { tile: 'bg-primary/10 text-primary', icon: '' },
}

export type KpiStatCardProps = {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  variant?: KpiVariant
  loading?: boolean
  deltaLabel?: string
  trend?: KpiTrend
  href?: string
  className?: string
}

export function KpiStatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = 'revenue',
  loading,
  deltaLabel,
  trend = 'neutral',
  href,
  className,
}: KpiStatCardProps) {
  const styles = variantStyles[variant]

  const inner = (
    <Card
      className={cn(
        'shadow-card transition-base overflow-hidden ring-1 ring-border/50 hover:shadow-elevated',
        href && 'hover:border-primary/20 cursor-pointer',
        className,
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <span className="text-muted-foreground text-sm font-medium">{title}</span>
        <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', styles.tile)}>
          <Icon className="size-4" aria-hidden />
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
              <p
                className={cn(
                  'mt-1 flex items-center gap-1 text-xs font-medium',
                  trend === 'up' && 'text-emerald-600 dark:text-emerald-400',
                  trend === 'down' && 'text-rose-600 dark:text-rose-400',
                  trend === 'neutral' && 'text-muted-foreground',
                )}
              >
                {trend === 'up' ? <ArrowUpRight className="size-3.5" /> : null}
                {trend === 'down' ? <ArrowDownRight className="size-3.5" /> : null}
                {deltaLabel}
              </p>
            ) : null}
            {description ? (
              <p className="text-muted-foreground mt-1 text-xs">{description}</p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  )

  if (href && !loading) {
    return (
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
        <Link to={href} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
          {inner}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      {inner}
    </motion.div>
  )
}
