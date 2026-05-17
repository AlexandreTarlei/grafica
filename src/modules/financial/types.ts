export type FinancialGranularity = 'day' | 'week' | 'month'

/** Período em datas ISO `yyyy-MM-dd` (inclusive). */
export type FinancialPeriod = {
  from: string
  to: string
}

export type FinancialKpis = {
  currency: string
  /** Faturamento (receita reconhecida no período). */
  revenue: number
  /** Volume de vendas (soma transações / valor bruto conforme backend). */
  salesTotal: number
  pedidos: number
  estoqueBaixo: number
  clientes: number
  lucro: number
  /** Campos opcionais — derivados no frontend ou futuro backend. */
  contratos?: number
  locacoes?: number
  produtos?: number
  estoqueTotal?: number
  fluxoLiquido?: number
}

export type TimeSeriesPoint = {
  date: string
  value: number
}

export type CashFlowPoint = {
  date: string
  entradas: number
  saidas: number
  saldo: number
}

export type ReceivableStatus = 'aberto' | 'parcial' | 'vencido' | 'liquidado'

export type ReceivableRow = {
  id: string
  documento: string
  cliente: string
  valor: number
  vencimento: string
  status: ReceivableStatus
}

export type PaginatedReceivables = {
  items: ReceivableRow[]
  total: number
}

export type ReceivablesListParams = {
  skip: number
  limit: number
  status?: ReceivableStatus | ''
  search?: string
  dueBefore?: string
}

export type ReportSummary = {
  periodo: FinancialPeriod
  totalFaturamento: number
  totalLucro: number
  totalPedidos: number
  ticketMedio: number
  /** Linhas agregadas por categoria (mock). */
  porCategoria: { categoria: string; valor: number; percentagem: number }[]
}

export type BusinessSegmentId = 'retail' | 'services' | 'wholesale'

export type FinancialWidgetId =
  | 'kpis'
  | 'chartSales'
  | 'chartCashFlow'
  | 'chartOrders'
  | 'chartRevenue'
