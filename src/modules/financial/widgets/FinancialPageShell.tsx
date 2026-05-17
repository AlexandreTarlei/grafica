import type { ReactNode } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PeriodRangePicker } from '@/modules/financial/components/PeriodRangePicker'
import type { FinancialPeriod } from '@/modules/financial/types'

type FinancialPageShellProps = {
  title: string
  subtitle?: string
  period: FinancialPeriod
  onPeriodChange: (next: FinancialPeriod) => void
  periodInvalid?: boolean
  children: ReactNode
}

export function FinancialPageShell({
  title,
  subtitle,
  period,
  onPeriodChange,
  periodInvalid,
  children,
}: FinancialPageShellProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={title}
        description={subtitle}
        noMotion
        actions={
          <PeriodRangePicker
            key={`${period.from}-${period.to}`}
            period={period}
            onChange={onPeriodChange}
            invalid={periodInvalid}
          />
        }
      />
      {children}
    </div>
  )
}
