import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FeatureItem = {
  icon: LucideIcon
  title: string
  description: string
}

type FeatureGridProps = {
  items: FeatureItem[]
  columns?: 2 | 3
}

export function FeatureGrid({ items, columns = 3 }: FeatureGridProps) {
  return (
    <ul
      className={cn(
        'grid gap-6 md:gap-8',
        columns === 2 ? 'md:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3',
      )}
    >
      {items.map((item) => {
        const Icon = item.icon
        return (
          <li
            key={item.title}
            className="border-border/80 bg-card/50 hover:border-primary/20 rounded-2xl border p-6 shadow-sm transition-colors"
          >
            <div className="bg-primary/10 text-primary mb-4 inline-flex size-11 items-center justify-center rounded-xl">
              <Icon className="size-5" />
            </div>
            <h3 className="text-foreground text-lg font-semibold">{item.title}</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.description}</p>
          </li>
        )
      })}
    </ul>
  )
}
