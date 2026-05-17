import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type CheckoutStepsProps = {
  steps: readonly string[]
  currentStep: number
  className?: string
}

export function CheckoutSteps({ steps, currentStep, className }: CheckoutStepsProps) {
  return (
    <nav aria-label="Progresso do checkout" className={cn('mb-8', className)}>
      <ol className="flex flex-wrap items-center gap-2 sm:gap-0">
        {steps.map((label, i) => {
          const done = i < currentStep
          const active = i === currentStep
          return (
            <li key={label} className="flex items-center">
              <div
                className={cn(
                  'flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium sm:px-3 sm:text-sm',
                  active && 'bg-primary/10 text-primary',
                  done && 'text-muted-foreground',
                  !active && !done && 'text-muted-foreground/70',
                )}
              >
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold sm:size-7',
                    active && 'bg-primary text-primary-foreground',
                    done && 'bg-primary/20 text-primary',
                    !active && !done && 'bg-muted text-muted-foreground',
                  )}
                  aria-hidden
                >
                  {done ? <Check className="size-3.5" /> : i + 1}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </div>
              {i < steps.length - 1 ? (
                <span
                  className={cn(
                    'mx-1 hidden h-px w-6 bg-border sm:mx-2 sm:inline-block sm:w-10',
                    done && 'bg-primary/40',
                  )}
                  aria-hidden
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
