import type { FinancialWidgetId } from '@/modules/financial/types'

/** Metadados para títulos e ordem do dashboard (componentes resolvem em pages). */
export const FINANCIAL_WIDGET_ORDER: readonly FinancialWidgetId[] = [
  'kpis',
  'chartSales',
  'chartCashFlow',
  'chartOrders',
  'chartRevenue',
]

export const FINANCIAL_WIDGET_LABELS: Record<FinancialWidgetId, string> = {
  kpis: 'Indicadores',
  chartSales: 'Vendas por período',
  chartCashFlow: 'Fluxo de caixa',
  chartOrders: 'Pedidos',
  chartRevenue: 'Faturamento',
}
