import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionProps = {
  id?: string
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
  innerClassName?: string
}

export function Section({ id, title, subtitle, children, className, innerClassName }: SectionProps) {
  return (
    <section id={id} className={cn('py-16 md:py-24', className)}>
      <div className={cn('mx-auto max-w-6xl px-4 md:px-6', innerClassName)}>
        {title ? (
          <div className="mb-10 max-w-2xl md:mb-14">
            <h2 className="text-foreground text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
            {subtitle ? (
              <p className="text-muted-foreground mt-3 text-base leading-relaxed md:text-lg">{subtitle}</p>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  )
}
