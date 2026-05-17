import { formatDistanceToNow } from 'date-fns'
import { pt } from 'date-fns/locale'
import { EmptyState } from '@/components/layout/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import type { ActivityItem } from '@/modules/dashboard/types'
import { cn } from '@/lib/utils'

const toneDot: Record<NonNullable<ActivityItem['tone']>, string> = {
  default: 'bg-muted-foreground',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  info: 'bg-blue-500',
}

type ActivityFeedProps = {
  items: ActivityItem[]
  loading?: boolean
}

export function ActivityFeed({ items, loading }: ActivityFeedProps) {
  return (
    <Card className="shadow-card ring-1 ring-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Atividades recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="Sem atividade recente" className="py-6" />
        ) : (
          <ScrollArea className="h-[220px] pr-3">
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-lg border border-transparent p-2 transition-base hover:bg-muted/40"
                >
                  <span
                    className={cn('mt-1.5 size-2 shrink-0 rounded-full', toneDot[item.tone ?? 'default'])}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug">{item.title}</p>
                    {item.description ? (
                      <p className="text-muted-foreground truncate text-xs">{item.description}</p>
                    ) : null}
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale: pt })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
