import { useCallback } from 'react'
import { isFinancialWidgetVisibleInSegment } from '@/modules/financial/config/segments'
import type { FinancialWidgetId } from '@/modules/financial/types'
import { useTenantPlatform } from '@/core/providers/useTenantPlatform'

export function useFinancialWidgetVisibility(): (id: FinancialWidgetId) => boolean {
  const { resolvedSegment } = useTenantPlatform()
  return useCallback(
    (id: FinancialWidgetId) => isFinancialWidgetVisibleInSegment(resolvedSegment, id),
    [resolvedSegment],
  )
}
