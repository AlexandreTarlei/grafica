import { env } from '@/core/env'
import type { BusinessSegmentId, FinancialWidgetId } from '@/modules/financial/types'

const VALID_SEGMENTS: readonly BusinessSegmentId[] = ['retail', 'services', 'wholesale']

export function getResolvedBusinessSegment(): BusinessSegmentId {
  const raw = env.businessSegment.toLowerCase()
  if (VALID_SEGMENTS.includes(raw as BusinessSegmentId)) {
    return raw as BusinessSegmentId
  }
  return 'retail'
}

/** Widgets visíveis por segmento (preparar evolução por tenant/API). */
const SEGMENT_WIDGETS: Record<BusinessSegmentId, readonly FinancialWidgetId[]> = {
  retail: ['kpis', 'chartSales', 'chartCashFlow', 'chartOrders', 'chartRevenue'],
  services: ['kpis', 'chartSales', 'chartCashFlow', 'chartRevenue'],
  wholesale: ['kpis', 'chartOrders', 'chartRevenue', 'chartCashFlow'],
}

export function isFinancialWidgetVisibleInSegment(
  segment: BusinessSegmentId,
  id: FinancialWidgetId,
): boolean {
  return SEGMENT_WIDGETS[segment].includes(id)
}

/** @deprecated Prefer `useFinancialWidgetVisibility` com segmento da plataforma. */
export function isFinancialWidgetVisible(id: FinancialWidgetId): boolean {
  const seg = getResolvedBusinessSegment()
  return isFinancialWidgetVisibleInSegment(seg, id)
}
