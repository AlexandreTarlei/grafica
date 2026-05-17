/**
 * Contratos esperados (FastAPI) — ajuste os paths ao backend real:
 *
 * - GET  /admin/financial/kpis?from&to
 * - GET  /admin/financial/series/sales?from&to&granularity=day|week|month
 * - GET  /admin/financial/series/cash-flow?from&to
 * - GET  /admin/financial/series/orders?from&to
 * - GET  /admin/financial/series/revenue?from&to
 * - GET  /admin/financial/receivables?skip&limit&status&search&due_before
 * - GET  /admin/financial/reports/summary?from&to
 */
import { eachDayOfInterval, format, parseISO } from 'date-fns'
import { http } from '@/services/http/client'
import { companyApiPath } from '@/modules/signage/shared/services/company-path'
import type {
  CashFlowPoint,
  FinancialGranularity,
  FinancialKpis,
  FinancialPeriod,
  PaginatedReceivables,
  ReceivableRow,
  ReceivablesListParams,
  ReportSummary,
  TimeSeriesPoint,
} from '@/modules/financial/types'

const USE_MOCK = import.meta.env.VITE_USE_FINANCIAL_MOCK !== 'false'

async function mockDelay(): Promise<void> {
  await new Promise((r) => setTimeout(r, 320))
}

function periodDays(p: FinancialPeriod): number {
  const a = parseISO(p.from)
  const b = parseISO(p.to)
  const ms = Math.max(0, b.getTime() - a.getTime())
  return Math.max(1, Math.floor(ms / 86_400_000) + 1)
}

function scaleForPeriod(p: FinancialPeriod): number {
  return periodDays(p) / 30
}

function mockKpis(p: FinancialPeriod): FinancialKpis {
  const s = scaleForPeriod(p)
  const estoqueBaixo = Math.max(0, Math.round(14 + 3 * Math.sin(s)))
  return {
    currency: 'EUR',
    revenue: Math.round(96_200 * s * 100) / 100,
    salesTotal: Math.round(128_430.5 * s * 100) / 100,
    pedidos: Math.max(1, Math.round(1842 * s)),
    estoqueBaixo,
    clientes: Math.max(1, Math.round(512 * s)),
    lucro: Math.round(24_800 * s * 100) / 100,
    contratos: Math.max(1, Math.round(48 * s)),
    locacoes: Math.max(0, Math.round(12 * s)),
    produtos: Math.max(24, Math.round(186 + 10 * s)),
    estoqueTotal: estoqueBaixo + Math.round(420 * s),
    fluxoLiquido: Math.round(42_500 * s * 100) / 100,
  }
}

function dailyDates(p: FinancialPeriod): string[] {
  const start = parseISO(p.from)
  const end = parseISO(p.to)
  return eachDayOfInterval({ start, end }).map((d) => format(d, 'yyyy-MM-dd'))
}

function mockSalesSeries(p: FinancialPeriod, g: FinancialGranularity): TimeSeriesPoint[] {
  const dates = dailyDates(p)
  if (g !== 'day') {
    const step = g === 'week' ? 7 : 15
    const out: TimeSeriesPoint[] = []
    for (let i = 0; i < dates.length; i += step) {
      const slice = dates.slice(i, i + step)
      if (!slice.length) break
      const v = slice.reduce((acc, _, j) => acc + 1200 + j * 80 + i * 10, 0)
      out.push({ date: slice[0]!, value: Math.round(v) })
    }
    return out.length ? out : [{ date: dates[0]!, value: 5000 }]
  }
  return dates.map((date, i) => ({
    date,
    value: Math.round(2000 + i * 120 + 400 * Math.sin(i / 3)),
  }))
}

function mockOrdersSeries(p: FinancialPeriod): TimeSeriesPoint[] {
  return dailyDates(p).map((date, i) => ({
    date,
    value: Math.max(2, Math.round(8 + 4 * Math.sin(i / 2) + (i % 5))),
  }))
}

function mockRevenueSeries(p: FinancialPeriod): TimeSeriesPoint[] {
  return dailyDates(p).map((date, i) => ({
    date,
    value: Math.round(3200 + i * 95 + 600 * Math.cos(i / 4)),
  }))
}

function mockCashFlow(p: FinancialPeriod): CashFlowPoint[] {
  let saldo = 12_000
  return dailyDates(p).map((date, i) => {
    const entradas = Math.round(2800 + i * 40 + 500 * Math.sin(i / 3))
    const saidas = Math.round(2100 + i * 35 + 400 * Math.cos(i / 2))
    saldo += entradas - saidas
    return { date, entradas, saidas, saldo }
  })
}

const MOCK_RECEIVABLES_ALL: ReceivableRow[] = Array.from({ length: 48 }, (_, i) => {
  const due = new Date()
  due.setDate(due.getDate() + (i % 9) - 5)
  const status: ReceivableRow['status'] =
    i % 7 === 0 ? 'vencido' : i % 5 === 0 ? 'parcial' : i % 11 === 0 ? 'liquidado' : 'aberto'
  return {
    id: `r-${i + 1}`,
    documento: `FT 2026/${1000 + i}`,
    cliente: ['Acme Lda', 'Beta SA', 'Gamma Unipessoal', 'Delta & Filhos'][i % 4]!,
    valor: Math.round((150 + i * 37.5) * 100) / 100,
    vencimento: format(due, 'yyyy-MM-dd'),
    status,
  }
})

function filterReceivables(params: ReceivablesListParams): ReceivableRow[] {
  let rows = [...MOCK_RECEIVABLES_ALL]
  if (params.status) {
    rows = rows.filter((r) => r.status === params.status)
  }
  if (params.search?.trim()) {
    const q = params.search.trim().toLowerCase()
    rows = rows.filter(
      (r) =>
        r.cliente.toLowerCase().includes(q) ||
        r.documento.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q),
    )
  }
  if (params.dueBefore) {
    rows = rows.filter((r) => r.vencimento <= params.dueBefore!)
  }
  return rows
}

function mockReportSummary(p: FinancialPeriod): ReportSummary {
  const kpis = mockKpis(p)
  const total = kpis.revenue
  const cat = [
    { categoria: 'Produto', valor: total * 0.55, percentagem: 55 },
    { categoria: 'Serviço', valor: total * 0.28, percentagem: 28 },
    { categoria: 'Outros', valor: total * 0.17, percentagem: 17 },
  ].map((c) => ({
    ...c,
    valor: Math.round(c.valor * 100) / 100,
  }))
  return {
    periodo: p,
    totalFaturamento: kpis.revenue,
    totalLucro: kpis.lucro,
    totalPedidos: kpis.pedidos,
    ticketMedio: Math.round((kpis.revenue / Math.max(1, kpis.pedidos)) * 100) / 100,
    porCategoria: cat,
  }
}

function assertKpis(data: unknown): FinancialKpis {
  if (!data || typeof data !== 'object') throw new Error('Resposta KPI inválida')
  const o = data as Record<string, unknown>
  const num = (k: string) => (typeof o[k] === 'number' ? (o[k] as number) : Number(o[k]))
  return {
    currency: String(o.currency ?? 'EUR'),
    revenue: num('revenue'),
    salesTotal: num('salesTotal'),
    pedidos: num('pedidos'),
    estoqueBaixo: num('estoqueBaixo'),
    clientes: num('clientes'),
    lucro: num('lucro'),
  }
}

function assertSeries(data: unknown): TimeSeriesPoint[] {
  if (!Array.isArray(data)) throw new Error('Série inválida')
  return data.map((row) => {
    const r = row as Record<string, unknown>
    return { date: String(r.date), value: Number(r.value) }
  })
}

function assertCashFlow(data: unknown): CashFlowPoint[] {
  if (!Array.isArray(data)) throw new Error('Fluxo de caixa inválido')
  return data.map((row) => {
    const r = row as Record<string, unknown>
    return {
      date: String(r.date),
      entradas: Number(r.entradas ?? r.inflow),
      saidas: Number(r.saidas ?? r.outflow),
      saldo: Number(r.saldo ?? r.balance),
    }
  })
}

function assertReceivables(data: unknown): PaginatedReceivables {
  if (!data || typeof data !== 'object') throw new Error('Contas a receber inválidas')
  const o = data as Record<string, unknown>
  const items = (o.items ?? o.data) as unknown
  const total = o.total ?? o.count
  if (!Array.isArray(items) || typeof total !== 'number') throw new Error('Formato inválido')
  return { items: items as ReceivableRow[], total }
}

export async function getFinancialKpis(companyId: number, period: FinancialPeriod): Promise<FinancialKpis> {
  if (USE_MOCK) {
    await mockDelay()
    return mockKpis(period)
  }
  const { data } = await http.get<unknown>(companyApiPath(companyId, 'financial/dashboard'), {
    params: { from: period.from, to: period.to },
  })
  const o = data as Record<string, unknown>
  try {
    return assertKpis(data)
  } catch {
    return {
      currency: String(o.currency_code ?? 'BRL'),
      revenue: Number(o.revenue ?? 0),
      salesTotal: Number(o.sales_total ?? o.revenue ?? 0),
      pedidos: Number(o.orders_count ?? 0),
      estoqueBaixo: Number(o.low_stock_count ?? 0),
      clientes: Number(o.customers_count ?? 0),
      lucro: Number(o.profit ?? 0),
    }
  }
}

export async function getSalesSeries(
  period: FinancialPeriod,
  granularity: FinancialGranularity,
): Promise<TimeSeriesPoint[]> {
  if (USE_MOCK) {
    await mockDelay()
    return mockSalesSeries(period, granularity)
  }
  const { data } = await http.get<unknown>('/admin/financial/series/sales', {
    params: { from: period.from, to: period.to, granularity },
  })
  return assertSeries(data)
}

export async function getOrdersSeries(period: FinancialPeriod): Promise<TimeSeriesPoint[]> {
  if (USE_MOCK) {
    await mockDelay()
    return mockOrdersSeries(period)
  }
  const { data } = await http.get<unknown>('/admin/financial/series/orders', {
    params: { from: period.from, to: period.to },
  })
  return assertSeries(data)
}

export async function getRevenueSeries(period: FinancialPeriod): Promise<TimeSeriesPoint[]> {
  if (USE_MOCK) {
    await mockDelay()
    return mockRevenueSeries(period)
  }
  const { data } = await http.get<unknown>('/admin/financial/series/revenue', {
    params: { from: period.from, to: period.to },
  })
  return assertSeries(data)
}

export async function getCashFlowSeries(period: FinancialPeriod): Promise<CashFlowPoint[]> {
  if (USE_MOCK) {
    await mockDelay()
    return mockCashFlow(period)
  }
  const { data } = await http.get<unknown>('/admin/financial/series/cash-flow', {
    params: { from: period.from, to: period.to },
  })
  return assertCashFlow(data)
}

export async function listReceivables(params: ReceivablesListParams): Promise<PaginatedReceivables> {
  if (USE_MOCK) {
    await mockDelay()
    const filtered = filterReceivables(params)
    const slice = filtered.slice(params.skip, params.skip + params.limit)
    return { items: slice, total: filtered.length }
  }
  const { data } = await http.get<unknown>('/admin/financial/receivables', {
    params: {
      skip: params.skip,
      limit: params.limit,
      status: params.status || undefined,
      search: params.search || undefined,
      due_before: params.dueBefore || undefined,
    },
  })
  return assertReceivables(data)
}

export async function getReportSummary(period: FinancialPeriod): Promise<ReportSummary> {
  if (USE_MOCK) {
    await mockDelay()
    return mockReportSummary(period)
  }
  const { data } = await http.get<unknown>('/admin/financial/reports/summary', {
    params: { from: period.from, to: period.to },
  })
  if (!data || typeof data !== 'object') throw new Error('Relatório inválido')
  return data as ReportSummary
}
