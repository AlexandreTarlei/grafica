import { useState } from 'react'
import { endOfMonth, format, startOfMonth, subDays } from 'date-fns'
import { DateField, FormSection, StaticFormField } from '@/components/forms'
import { Button } from '@/components/ui/button'
import { financialPeriodQuerySchema } from '@/modules/financial/schemas/financialPeriod.schema'
import type { FinancialPeriod } from '@/modules/financial/types'
import { cn } from '@/lib/utils'

type PeriodRangePickerProps = {
  period: FinancialPeriod
  onChange: (next: FinancialPeriod) => void
  invalid?: boolean
  className?: string
}

export function PeriodRangePicker({ period, onChange, invalid, className }: PeriodRangePickerProps) {
  const [draft, setDraft] = useState<FinancialPeriod>(() => ({ ...period }))
  const [error, setError] = useState<string | null>(null)

  function apply(next: FinancialPeriod) {
    const r = financialPeriodQuerySchema.safeParse(next)
    if (!r.success) {
      const msg =
        r.error.flatten().fieldErrors.from?.[0] ??
        r.error.flatten().fieldErrors.to?.[0] ??
        r.error.flatten().formErrors[0] ??
        'Período inválido.'
      setError(msg)
      return
    }
    setError(null)
    onChange(r.data)
  }

  return (
    <FormSection
      title="Período"
      description="Selecione um intervalo ou use um atalho."
      className={cn('p-4 sm:min-w-[280px]', className)}
    >
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => apply(lastDays(7))}>
          7 dias
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => apply(lastDays(30))}>
          30 dias
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => apply(thisMonth())}>
          Este mês
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <StaticFormField label="De" htmlFor="fin-period-from" error={error ?? undefined}>
          <DateField
            id="fin-period-from"
            value={draft.from}
            onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value }))}
            className={cn(invalid && 'border-destructive')}
          />
        </StaticFormField>
        <StaticFormField label="Até" htmlFor="fin-period-to">
          <DateField
            id="fin-period-to"
            value={draft.to}
            onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))}
            className={cn(invalid && 'border-destructive')}
          />
        </StaticFormField>
      </div>
      <Button type="button" size="sm" onClick={() => apply(draft)}>
        Aplicar período
      </Button>
    </FormSection>
  )
}

function lastDays(n: number): FinancialPeriod {
  const to = new Date()
  return {
    from: format(subDays(to, n - 1), 'yyyy-MM-dd'),
    to: format(to, 'yyyy-MM-dd'),
  }
}

function thisMonth(): FinancialPeriod {
  const now = new Date()
  return {
    from: format(startOfMonth(now), 'yyyy-MM-dd'),
    to: format(endOfMonth(now), 'yyyy-MM-dd'),
  }
}
