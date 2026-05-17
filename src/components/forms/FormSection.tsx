import type { ReactNode } from 'react'
import { FieldGroup } from '@/components/ui/field'
import { cn } from '@/lib/utils'

type FormSectionProps = {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <section
      className={cn(
        'bg-card shadow-card rounded-xl border p-6 ring-1 ring-border/60',
        className,
      )}
    >
      {title ? (
        <header className="mb-5 space-y-1">
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
        </header>
      ) : null}
      <FieldGroup>{children}</FieldGroup>
    </section>
  )
}
