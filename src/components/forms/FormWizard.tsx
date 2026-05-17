import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type FormWizardProps = {
  steps: readonly string[]
  currentStep: number
  onPrev?: () => void
  onNext?: () => void
  nextLabel?: string
  prevLabel?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function FormWizard({
  steps,
  currentStep,
  onPrev,
  onNext,
  nextLabel = 'Seguinte',
  prevLabel = 'Anterior',
  children,
  footer,
  className,
}: FormWizardProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <ol className="text-muted-foreground flex flex-wrap gap-2 text-xs">
        {steps.map((label, i) => (
          <li
            key={label}
            className={
              i === currentStep
                ? 'text-foreground font-medium'
                : i < currentStep
                  ? 'text-primary'
                  : ''
            }
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>
      {children}
      <div className="flex flex-wrap gap-2">
        {currentStep > 0 && onPrev ? (
          <Button type="button" variant="outline" onClick={onPrev} className="gap-1">
            <ChevronLeft className="size-4" />
            {prevLabel}
          </Button>
        ) : null}
        {footer}
        {onNext ? (
          <Button type="button" onClick={onNext} className="gap-1">
            {nextLabel}
            <ChevronRight className="size-4" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
