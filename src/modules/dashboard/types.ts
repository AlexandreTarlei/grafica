import type { LucideIcon } from 'lucide-react'
import type { FinancialKpis } from '@/modules/financial/types'

export type KpiVariant =
  | 'revenue'
  | 'sales'
  | 'contracts'
  | 'rentals'
  | 'clients'
  | 'products'
  | 'inventory'
  | 'cashflow'

export type KpiTrend = 'up' | 'down' | 'neutral'

export type DashboardKpiItem = {
  id: KpiVariant
  title: string
  value: string
  description?: string
  deltaLabel?: string
  trend?: KpiTrend
  href?: string
  icon: LucideIcon
  variant: KpiVariant
}

export type DashboardSnapshot = FinancialKpis & {
  contratos: number
  locacoes: number
  produtos: number
  estoqueTotal: number
  fluxoLiquido: number
}

export type ActivityItem = {
  id: string
  title: string
  description?: string
  timestamp: string
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

export type RecentTableRow = {
  id: string
  primary: string
  secondary?: string
  meta?: string
  status?: string
  statusTone?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  href?: string
}
