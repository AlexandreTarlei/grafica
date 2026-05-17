/**
 * Camada de API do módulo Fiscal (NF-e).
 *
 * Contrato real (FastAPI — `backend/app/modules/fiscal/router.py`):
 * - GET  /companies/{companyId}/invoices?skip&limit&order_id&status
 * - GET  /companies/{companyId}/invoices/{invoiceId}
 * - GET  /companies/{companyId}/invoices/{invoiceId}/xml   (binary application/xml)
 * - GET  /companies/{companyId}/invoices/{invoiceId}/pdf   (binary application/pdf)
 * - POST /companies/{companyId}/invoices/emit              body: { order_id }
 * - POST /companies/{companyId}/invoices/{invoiceId}/cancel body: { justificativa }
 * - GET  /companies/{companyId}/fiscal/settings
 *
 * Mocks: ativados quando `VITE_USE_FISCAL_MOCK === 'true'` (default: API real).
 */
import { http } from '@/services/http/client'
import type {
  CancelInvoiceInput,
  EmitInvoiceInput,
  FiscalInvoiceDetail,
  FiscalInvoiceItem,
  FiscalInvoiceListItem,
  FiscalInvoiceListParams,
  FiscalInvoiceStatus,
  FiscalSettings,
  PaginatedFiscalInvoices,
} from '@/modules/admin/fiscal/types'

const USE_MOCK = import.meta.env.VITE_USE_FISCAL_MOCK === 'true'

function basePath(companyId: number): string {
  return `/companies/${companyId}`
}

function toNumber(v: unknown, fallback = 0): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : fallback
  if (typeof v === 'string') {
    const n = Number(v)
    return Number.isFinite(n) ? n : fallback
  }
  return fallback
}

function asStatus(v: unknown): FiscalInvoiceStatus {
  const known: FiscalInvoiceStatus[] = [
    'pendente',
    'processando',
    'emitida',
    'rejeitada',
    'cancelada',
    'inutilizada',
  ]
  if (typeof v !== 'string') return 'pendente'
  const lower = v.toLowerCase()
  if (known.includes(lower as FiscalInvoiceStatus)) return lower as FiscalInvoiceStatus
  // Aliases comuns vindos do provider:
  if (lower === 'autorizada' || lower === 'authorized') return 'emitida'
  if (lower === 'processing' || lower === 'em_processamento') return 'processando'
  if (lower === 'rejected' || lower === 'erro') return 'rejeitada'
  if (lower === 'cancelled' || lower === 'cancelado') return 'cancelada'
  return 'pendente'
}

function normalizeListItem(raw: unknown): FiscalInvoiceListItem {
  const o = (raw ?? {}) as Record<string, unknown>
  return {
    id: toNumber(o.id),
    orderId: toNumber(o.order_id ?? o.orderId),
    provider: String(o.provider ?? ''),
    providerRef: String(o.provider_ref ?? o.providerRef ?? ''),
    status: asStatus(o.status),
    chaveNfe: (o.chave_nfe ?? o.chaveNfe) as string | null ?? null,
    numeroNota: (o.numero_nota ?? o.numeroNota) as string | null ?? null,
    serie: (o.serie ?? null) as string | null,
    ambiente: String(o.ambiente ?? 'homologation'),
    createdAt: String(o.created_at ?? o.createdAt ?? new Date().toISOString()),
    clienteNome:
      (o.cliente_nome as string | null | undefined) ?? (o.clienteNome as string | null | undefined) ?? null,
    valorTotal:
      o.valor_total !== undefined ? toNumber(o.valor_total) : o.valorTotal !== undefined ? toNumber(o.valorTotal) : null,
  }
}

function normalizeItem(raw: unknown): FiscalInvoiceItem {
  const o = (raw ?? {}) as Record<string, unknown>
  return {
    numeroItem: toNumber(o.numero_item ?? o.numeroItem),
    descricao: String(o.descricao ?? ''),
    ncm: String(o.ncm ?? ''),
    cfop: String(o.cfop ?? ''),
    cstIcms: String(o.cst_icms ?? o.cstIcms ?? ''),
    quantidade: toNumber(o.quantidade),
    valorUnitario: toNumber(o.valor_unitario ?? o.valorUnitario),
    valorBruto: toNumber(o.valor_bruto ?? o.valorBruto),
  }
}

function normalizeDetail(raw: unknown): FiscalInvoiceDetail {
  const o = (raw ?? {}) as Record<string, unknown>
  const items = Array.isArray(o.items) ? o.items.map(normalizeItem) : []
  const valorTotalFromItems = items.reduce((acc, it) => acc + it.valorBruto, 0)
  return {
    id: toNumber(o.id),
    companyId: toNumber(o.company_id ?? o.companyId),
    orderId: toNumber(o.order_id ?? o.orderId),
    sourceType: String(o.source_type ?? o.sourceType ?? 'order'),
    sourceId: (o.source_id ?? o.sourceId) === null ? null : toNumber(o.source_id ?? o.sourceId, 0) || null,
    provider: String(o.provider ?? ''),
    providerRef: String(o.provider_ref ?? o.providerRef ?? ''),
    chaveNfe: (o.chave_nfe ?? o.chaveNfe) as string | null ?? null,
    protocolo: (o.protocolo ?? null) as string | null,
    status: asStatus(o.status),
    numeroNota: (o.numero_nota ?? o.numeroNota) as string | null ?? null,
    serie: (o.serie ?? null) as string | null,
    ambiente: String(o.ambiente ?? 'homologation'),
    xmlUrl: (o.xml_url ?? o.xmlUrl) as string | null ?? null,
    pdfUrl: (o.pdf_url ?? o.pdfUrl) as string | null ?? null,
    hasXmlFile: Boolean(o.has_xml_file ?? o.hasXmlFile),
    hasPdfFile: Boolean(o.has_pdf_file ?? o.hasPdfFile),
    lastError: (o.last_error ?? o.lastError) as string | null ?? null,
    createdAt: String(o.created_at ?? o.createdAt ?? new Date().toISOString()),
    updatedAt: String(o.updated_at ?? o.updatedAt ?? new Date().toISOString()),
    items,
    clienteNome:
      (o.cliente_nome as string | null | undefined) ?? (o.clienteNome as string | null | undefined) ?? null,
    valorTotal:
      o.valor_total !== undefined
        ? toNumber(o.valor_total)
        : o.valorTotal !== undefined
          ? toNumber(o.valorTotal)
          : items.length > 0
            ? valorTotalFromItems
            : null,
  }
}

function normalizeListResponse(data: unknown): PaginatedFiscalInvoices {
  if (!data || typeof data !== 'object') throw new Error('Resposta de listagem inválida.')
  const o = data as Record<string, unknown>
  const itemsRaw = (o.items ?? o.data) as unknown
  const totalRaw = o.total ?? o.count
  if (!Array.isArray(itemsRaw)) throw new Error('Formato de listagem inválido.')
  const items = itemsRaw.map(normalizeListItem)
  const total = typeof totalRaw === 'number' ? totalRaw : items.length
  return { items, total }
}

function normalizeSettings(data: unknown): FiscalSettings {
  const o = (data ?? {}) as Record<string, unknown>
  return {
    environment: String(o.environment ?? 'homologation'),
    cnpjEmitente: String(o.cnpj_emitente ?? o.cnpjEmitente ?? ''),
    ieEmitente: (o.ie_emitente ?? o.ieEmitente) as string | null ?? null,
    crt: toNumber(o.crt, 1),
    nomeEmitente: String(o.nome_emitente ?? o.nomeEmitente ?? ''),
    nomeFantasiaEmitente:
      (o.nome_fantasia_emitente ?? o.nomeFantasiaEmitente) as string | null ?? null,
    ufEmitente: String(o.uf_emitente ?? o.ufEmitente ?? ''),
    serieNfe: String(o.serie_nfe ?? o.serieNfe ?? '1'),
    providerTokenConfigured: Boolean(o.provider_token_configured ?? o.providerTokenConfigured),
  }
}

// ───────────────────────── Mock dataset ─────────────────────────

const MOCK_ITEMS: FiscalInvoiceListItem[] = [
  {
    id: 1001,
    orderId: 1,
    provider: 'focus_nfe',
    providerRef: 'mock-ref-1001',
    status: 'emitida',
    chaveNfe: '35260114200166000187550010000010011234567890',
    numeroNota: '1001',
    serie: '1',
    ambiente: 'homologation',
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
    clienteNome: 'Ana Silva',
    valorTotal: 129.9,
  },
  {
    id: 1002,
    orderId: 2,
    provider: 'focus_nfe',
    providerRef: 'mock-ref-1002',
    status: 'pendente',
    chaveNfe: null,
    numeroNota: '1002',
    serie: '1',
    ambiente: 'homologation',
    createdAt: new Date(Date.now() - 3_600_000).toISOString(),
    clienteNome: 'Bruno Costa',
    valorTotal: 59.5,
  },
  {
    id: 1003,
    orderId: 3,
    provider: 'focus_nfe',
    providerRef: 'mock-ref-1003',
    status: 'rejeitada',
    chaveNfe: null,
    numeroNota: null,
    serie: '1',
    ambiente: 'homologation',
    createdAt: new Date(Date.now() - 7_200_000).toISOString(),
    clienteNome: 'Carla Mendes',
    valorTotal: 240,
  },
  {
    id: 1004,
    orderId: 4,
    provider: 'focus_nfe',
    providerRef: 'mock-ref-1004',
    status: 'processando',
    chaveNfe: null,
    numeroNota: '1004',
    serie: '1',
    ambiente: 'homologation',
    createdAt: new Date(Date.now() - 600_000).toISOString(),
    clienteNome: 'Daniel Pinto',
    valorTotal: 78.4,
  },
  {
    id: 1005,
    orderId: 5,
    provider: 'focus_nfe',
    providerRef: 'mock-ref-1005',
    status: 'cancelada',
    chaveNfe: '35260114200166000187550010000010051234567890',
    numeroNota: '1005',
    serie: '1',
    ambiente: 'homologation',
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    clienteNome: 'Eduarda Lopes',
    valorTotal: 199.9,
  },
  {
    id: 1006,
    orderId: 6,
    provider: 'focus_nfe',
    providerRef: 'mock-ref-1006',
    status: 'emitida',
    chaveNfe: '35260114200166000187550010000010061234567890',
    numeroNota: '1006',
    serie: '1',
    ambiente: 'homologation',
    createdAt: new Date(Date.now() - 4 * 86_400_000).toISOString(),
    clienteNome: 'Fábio Rocha',
    valorTotal: 350,
  },
]

const MOCK_DETAILS: Record<number, FiscalInvoiceDetail> = Object.fromEntries(
  MOCK_ITEMS.map((row) => [
    row.id,
    {
      id: row.id,
      companyId: 1,
      orderId: row.orderId,
      sourceType: 'order',
      sourceId: row.orderId,
      provider: row.provider,
      providerRef: row.providerRef,
      chaveNfe: row.chaveNfe,
      protocolo:
        row.status === 'emitida' || row.status === 'cancelada' ? '135260000123456' : null,
      status: row.status,
      numeroNota: row.numeroNota,
      serie: row.serie,
      ambiente: row.ambiente,
      xmlUrl: null,
      pdfUrl: null,
      hasXmlFile: row.status === 'emitida' || row.status === 'cancelada',
      hasPdfFile: row.status === 'emitida' || row.status === 'cancelada',
      lastError:
        row.status === 'rejeitada'
          ? 'Rejeição 539: Duplicidade de NF-e (mock).'
          : null,
      createdAt: row.createdAt,
      updatedAt: row.createdAt,
      items: [
        {
          numeroItem: 1,
          descricao: 'Camisola básica',
          ncm: '61091000',
          cfop: '5102',
          cstIcms: '00',
          quantidade: 2,
          valorUnitario: 49.95,
          valorBruto: 99.9,
        },
        {
          numeroItem: 2,
          descricao: 'Portes',
          ncm: '00000000',
          cfop: '5949',
          cstIcms: '40',
          quantidade: 1,
          valorUnitario: 30,
          valorBruto: 30,
        },
      ],
      clienteNome: row.clienteNome,
      valorTotal: row.valorTotal,
    },
  ]),
)

function filterMock(
  items: FiscalInvoiceListItem[],
  p: FiscalInvoiceListParams,
): FiscalInvoiceListItem[] {
  return items.filter((row) => {
    if (p.status && row.status !== p.status) return false
    if (p.orderId != null && row.orderId !== p.orderId) return false
    if (p.search) {
      const q = p.search.toLowerCase()
      const haystack = `${row.numeroNota ?? ''} ${row.chaveNfe ?? ''} ${row.clienteNome ?? ''}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    if (p.dateFrom) {
      if (row.createdAt < p.dateFrom) return false
    }
    if (p.dateTo) {
      if (row.createdAt > `${p.dateTo}T23:59:59.999Z`) return false
    }
    return true
  })
}

async function mockDelay(ms = 350): Promise<void> {
  await new Promise((r) => setTimeout(r, ms))
}

// ───────────────────────── API pública ─────────────────────────

export async function listInvoices(
  companyId: number,
  params: FiscalInvoiceListParams,
): Promise<PaginatedFiscalInvoices> {
  const skip = (params.page - 1) * params.pageSize
  if (USE_MOCK) {
    await mockDelay()
    const filtered = filterMock(MOCK_ITEMS, params)
    const slice = filtered.slice(skip, skip + params.pageSize)
    return { items: slice, total: filtered.length }
  }
  const { data } = await http.get<unknown>(`${basePath(companyId)}/invoices`, {
    params: {
      skip,
      limit: params.pageSize,
      order_id: params.orderId ?? undefined,
      status: params.status || undefined,
      search: params.search || undefined,
      date_from: params.dateFrom || undefined,
      date_to: params.dateTo || undefined,
    },
  })
  return normalizeListResponse(data)
}

export async function getInvoice(
  companyId: number,
  invoiceId: number,
): Promise<FiscalInvoiceDetail> {
  if (USE_MOCK) {
    await mockDelay()
    const hit = MOCK_DETAILS[invoiceId]
    if (!hit) throw new Error('Nota não encontrada (mock).')
    return { ...hit }
  }
  const { data } = await http.get<unknown>(`${basePath(companyId)}/invoices/${invoiceId}`)
  return normalizeDetail(data)
}

export async function emitInvoice(
  companyId: number,
  input: EmitInvoiceInput,
): Promise<{ status: string; orderId: number }> {
  if (USE_MOCK) {
    await mockDelay(500)
    const existing = MOCK_ITEMS.find((x) => x.orderId === input.orderId)
    if (existing) {
      existing.status = 'processando'
      const detail = MOCK_DETAILS[existing.id]
      if (detail) {
        detail.status = 'processando'
        detail.updatedAt = new Date().toISOString()
        detail.lastError = null
      }
      // Simular emissão depois de alguns segundos:
      setTimeout(() => {
        existing.status = 'emitida'
        if (detail) {
          detail.status = 'emitida'
          detail.protocolo = `135${Date.now()}`
          detail.chaveNfe = detail.chaveNfe ?? `35260114200166000187550010000010${existing.id}1234567890`
          detail.hasXmlFile = true
          detail.hasPdfFile = true
          detail.updatedAt = new Date().toISOString()
        }
      }, 4000)
    } else {
      const id = 2000 + MOCK_ITEMS.length + 1
      const created: FiscalInvoiceListItem = {
        id,
        orderId: input.orderId,
        provider: 'focus_nfe',
        providerRef: `mock-ref-${id}`,
        status: 'processando',
        chaveNfe: null,
        numeroNota: String(id),
        serie: '1',
        ambiente: 'homologation',
        createdAt: new Date().toISOString(),
        clienteNome: null,
        valorTotal: null,
      }
      MOCK_ITEMS.unshift(created)
      MOCK_DETAILS[id] = {
        id,
        companyId,
        orderId: input.orderId,
        sourceType: 'order',
        sourceId: input.orderId,
        provider: created.provider,
        providerRef: created.providerRef,
        chaveNfe: null,
        protocolo: null,
        status: 'processando',
        numeroNota: created.numeroNota,
        serie: created.serie,
        ambiente: created.ambiente,
        xmlUrl: null,
        pdfUrl: null,
        hasXmlFile: false,
        hasPdfFile: false,
        lastError: null,
        createdAt: created.createdAt,
        updatedAt: created.createdAt,
        items: [],
        clienteNome: null,
        valorTotal: null,
      }
    }
    return { status: 'queued', orderId: input.orderId }
  }
  const { data } = await http.post<{ status: string; order_id: number; company_id?: number }>(
    `${basePath(companyId)}/invoices/emit`,
    { order_id: input.orderId },
  )
  return { status: String(data?.status ?? 'queued'), orderId: toNumber(data?.order_id, input.orderId) }
}

export async function cancelInvoice(
  companyId: number,
  input: CancelInvoiceInput,
): Promise<{ status: string }> {
  if (USE_MOCK) {
    await mockDelay(450)
    const detail = MOCK_DETAILS[input.invoiceId]
    if (!detail) throw new Error('Nota não encontrada (mock).')
    detail.status = 'cancelada'
    detail.updatedAt = new Date().toISOString()
    const idx = MOCK_ITEMS.findIndex((x) => x.id === input.invoiceId)
    if (idx >= 0) MOCK_ITEMS[idx] = { ...MOCK_ITEMS[idx], status: 'cancelada' }
    return { status: 'ok' }
  }
  const { data } = await http.post<{ status: string }>(
    `${basePath(companyId)}/invoices/${input.invoiceId}/cancel`,
    { justificativa: input.justificativa },
  )
  return { status: String(data?.status ?? 'ok') }
}

export async function downloadInvoiceXml(companyId: number, invoiceId: number): Promise<Blob> {
  if (USE_MOCK) {
    await mockDelay(200)
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<nfeProc>\n  <NFe>\n    <infNFe id="${invoiceId}">\n      <ide>\n        <nNF>${invoiceId}</nNF>\n      </ide>\n      <emit>\n        <xNome>Emitente Mock</xNome>\n      </emit>\n    </infNFe>\n  </NFe>\n</nfeProc>\n`
    return new Blob([xml], { type: 'application/xml' })
  }
  const { data } = await http.get<Blob>(
    `${basePath(companyId)}/invoices/${invoiceId}/xml`,
    { responseType: 'blob' },
  )
  return data
}

export async function downloadInvoicePdf(companyId: number, invoiceId: number): Promise<Blob> {
  if (USE_MOCK) {
    await mockDelay(200)
    const pdf = `%PDF-1.4\n%mock danfe ${invoiceId}\n`
    return new Blob([pdf], { type: 'application/pdf' })
  }
  const { data } = await http.get<Blob>(
    `${basePath(companyId)}/invoices/${invoiceId}/pdf`,
    { responseType: 'blob' },
  )
  return data
}

export async function getFiscalSettings(companyId: number): Promise<FiscalSettings> {
  if (USE_MOCK) {
    await mockDelay(120)
    return {
      environment: 'homologation',
      cnpjEmitente: '14.200.166/0001-87',
      ieEmitente: null,
      crt: 1,
      nomeEmitente: 'Empresa Mock LTDA',
      nomeFantasiaEmitente: 'Mock Store',
      ufEmitente: 'SP',
      serieNfe: '1',
      providerTokenConfigured: true,
    }
  }
  const { data } = await http.get<unknown>(`${basePath(companyId)}/fiscal/settings`)
  return normalizeSettings(data)
}
