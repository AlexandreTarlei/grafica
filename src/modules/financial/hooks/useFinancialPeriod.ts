import { format, subDays } from 'date-fns'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { financialPeriodQuerySchema } from '@/modules/financial/schemas/financialPeriod.schema'
import type { FinancialPeriod } from '@/modules/financial/types'

function defaultPeriod(): FinancialPeriod {
  const to = new Date()
  return {
    from: format(subDays(to, 29), 'yyyy-MM-dd'),
    to: format(to, 'yyyy-MM-dd'),
  }
}

export function useFinancialPeriod() {
  const [searchParams, setSearchParams] = useSearchParams()
  const defaults = useMemo(() => defaultPeriod(), [])
  const didNormalize = useRef(false)

  const raw = useMemo(
    () => ({
      from: searchParams.get('from') ?? defaults.from,
      to: searchParams.get('to') ?? defaults.to,
    }),
    [searchParams, defaults.from, defaults.to],
  )

  const parsed = financialPeriodQuerySchema.safeParse(raw)
  const period: FinancialPeriod = parsed.success ? parsed.data : defaults

  useEffect(() => {
    if (parsed.success || didNormalize.current) return
    didNormalize.current = true
    setSearchParams({ from: defaults.from, to: defaults.to }, { replace: true })
  }, [parsed.success, defaults.from, defaults.to, setSearchParams])

  const setPeriod = useCallback(
    (next: FinancialPeriod) => {
      const v = financialPeriodQuerySchema.safeParse(next)
      if (!v.success) return
      setSearchParams({ from: v.data.from, to: v.data.to }, { replace: true })
    },
    [setSearchParams],
  )

  return {
    period,
    setPeriod,
    periodInvalid: !parsed.success,
  }
}

export function financialPeriodQueryKey(period: FinancialPeriod): readonly [string, string] {
  return [period.from, period.to] as const
}
