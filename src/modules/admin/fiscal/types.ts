/**
 * Tipos do módulo Fiscal (NF-e) — espelham `backend/app/modules/fiscal/schemas.py`.
 *
 * Convenções:
 * - API real devolve snake_case; o service normaliza para camelCase aqui definido.
 * - Decimais chegam como string ou number — guardamos como `number` na UI (parse no service).
 */

/** Estados possíveis duma nota fiscal na UI. */
export type FiscalInvoiceStatus =
  | 'pendente'
  | 'processando'
  | 'emitida'
  | 'rejeitada'
  | 'cancelada'
  | 'inutilizada'

/** Linha de listagem (resumida) — espelho de `InvoiceListItem`. */
export type FiscalInvoiceListItem = {
  id: number
  orderId: number
  provider: string
  providerRef: string
  status: FiscalInvoiceStatus
  chaveNfe: string | null
  numeroNota: string | null
  serie: string | null
  ambiente: string
  createdAt: string
  /** Cliente — opcional; backend pode juntar via JOIN futuramente. */
  clienteNome?: string | null
  /** Total fiscal — opcional; preenchido pelo backend se disponível. */
  valorTotal?: number | null
}

/** Item (produto) duma nota — espelho de `InvoiceItemRead`. */
export type FiscalInvoiceItem = {
  numeroItem: number
  descricao: string
  ncm: string
  cfop: string
  cstIcms: string
  quantidade: number
  valorUnitario: number
  valorBruto: number
}

/** Detalhe completo — espelho de `InvoiceDetailRead`. */
export type FiscalInvoiceDetail = {
  id: number
  companyId: number
  orderId: number
  sourceType: string
  sourceId: number | null
  provider: string
  providerRef: string
  chaveNfe: string | null
  protocolo: string | null
  status: FiscalInvoiceStatus
  numeroNota: string | null
  serie: string | null
  ambiente: string
  xmlUrl: string | null
  pdfUrl: string | null
  hasXmlFile: boolean
  hasPdfFile: boolean
  lastError: string | null
  createdAt: string
  updatedAt: string
  items: FiscalInvoiceItem[]
  clienteNome?: string | null
  valorTotal?: number | null
}

export type FiscalInvoiceListParams = {
  page: number
  pageSize: number
  search: string
  status: FiscalInvoiceStatus | ''
  orderId?: number | null
  dateFrom: string
  dateTo: string
}

export type PaginatedFiscalInvoices = {
  items: FiscalInvoiceListItem[]
  total: number
}

/** Configurações fiscais (subset usado na UI) — espelho de `FiscalSettingsRead`. */
export type FiscalSettings = {
  environment: 'homologation' | 'production' | string
  cnpjEmitente: string
  ieEmitente: string | null
  crt: number
  nomeEmitente: string
  nomeFantasiaEmitente: string | null
  ufEmitente: string
  serieNfe: string
  providerTokenConfigured: boolean
}

/** Evento derivado para a timeline da nota. */
export type FiscalEvent = {
  id: string
  kind: 'created' | 'authorized' | 'rejected' | 'cancelled' | 'updated'
  label: string
  description?: string | null
  at: string
}

/** KPIs do painel fiscal (agregados client-side enquanto não há endpoint dedicado). */
export type FiscalDashboardKpis = {
  total: number
  emitidas: number
  pendentes: number
  rejeitadas: number
  canceladas: number
  faturamento: number
  sefazHealth: 'operational' | 'degraded' | 'homologation' | 'offline' | 'unknown'
}

export type EmitInvoiceInput = {
  orderId: number
}

export type CancelInvoiceInput = {
  invoiceId: number
  justificativa: string
}
