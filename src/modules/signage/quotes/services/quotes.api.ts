/**
 * Contrato esperado:
 * GET/POST/PATCH /companies/{id}/quotes
 * POST .../quotes/{id}/approve | convert-to-order | send-whatsapp | signature
 * GET .../quotes/{id}/pdf
 */
import { http } from '@/services/http/client'
import { companyApiPath } from '@/modules/signage/shared/services/company-path'
import { calculateLineSubtotal, calculateQuoteTotals } from '@/modules/signage/shared/utils/pricing'
import type { PaginatedQuotes, Quote, QuoteFormLine, QuoteListParams, QuoteStatus } from '@/modules/signage/quotes/types'

const USE_MOCK = import.meta.env.VITE_USE_SIGNAGE_QUOTES_MOCK !== 'false'
const STORAGE_KEY = 'signage_quotes_mock'

async function mockDelay(): Promise<void> {
  await new Promise((r) => setTimeout(r, 280))
}

function loadStore(): Quote[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Quote[]
  } catch {
    /* ignore */
  }
  return [
    {
      id: '1',
      number: 'ORC-2026-001',
      clientName: 'Loja Centro Ltda',
      status: 'enviado',
      lines: [
        {
          id: 'l1',
          productName: 'Fachada ACM',
          category: 'fachada',
          widthCm: 300,
          heightCm: 120,
          quantity: 1,
          unitPrice: 12000,
          subtotal: 12000,
        },
      ],
      subtotal: 12000,
      tax: 0,
      discount: 0,
      total: 12000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}

function saveStore(items: Quote[]): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function recalcQuote(partial: Omit<Quote, 'subtotal' | 'tax' | 'discount' | 'total'> & { lines: Quote['lines'] }): Quote {
  const totals = calculateQuoteTotals(
    partial.lines.map((l) => ({
      category: l.category,
      widthCm: l.widthCm,
      heightCm: l.heightCm,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
    })),
  )
  return { ...partial, ...totals, updatedAt: new Date().toISOString() }
}

export async function listQuotes(companyId: number, params: QuoteListParams = {}): Promise<PaginatedQuotes> {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 10
  if (USE_MOCK) {
    await mockDelay()
    let items = loadStore()
    if (params.search) {
      const q = params.search.toLowerCase()
      items = items.filter((x) => x.clientName.toLowerCase().includes(q) || x.number.toLowerCase().includes(q))
    }
    if (params.status) items = items.filter((x) => x.status === params.status)
    const start = (page - 1) * pageSize
    return { items: items.slice(start, start + pageSize), total: items.length }
  }
  const { data } = await http.get<unknown>(companyApiPath(companyId, 'quotes'), { params })
  const o = data as Record<string, unknown>
  return {
    items: (o.items as Quote[]) ?? [],
    total: Number(o.total ?? 0),
  }
}

export async function getQuote(companyId: number, quoteId: string): Promise<Quote> {
  if (USE_MOCK) {
    await mockDelay()
    const found = loadStore().find((q) => q.id === quoteId)
    if (!found) throw new Error('Orçamento não encontrado')
    return found
  }
  const { data } = await http.get<Quote>(`${companyApiPath(companyId, 'quotes')}/${quoteId}`)
  return data
}

export async function createQuote(
  companyId: number,
  body: { clientName: string; lines: QuoteFormLine[]; notes?: string },
): Promise<Quote> {
  const lines = body.lines.map((l, i) => ({
    ...l,
    id: `l-${Date.now()}-${i}`,
    subtotal: calculateLineSubtotal({
      category: l.category,
      widthCm: l.widthCm,
      heightCm: l.heightCm,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
    }),
  }))
  const base = recalcQuote({
    id: String(Date.now()),
    number: `ORC-${new Date().getFullYear()}-${String(loadStore().length + 1).padStart(3, '0')}`,
    clientName: body.clientName,
    status: 'rascunho',
    lines,
    notes: body.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  if (USE_MOCK) {
    await mockDelay()
    const next = [...loadStore(), base]
    saveStore(next)
    return base
  }
  const { data } = await http.post<Quote>(companyApiPath(companyId, 'quotes'), body)
  return data
}

export async function updateQuoteStatus(
  companyId: number,
  quoteId: string,
  status: QuoteStatus,
): Promise<Quote> {
  if (USE_MOCK) {
    await mockDelay()
    const next = loadStore().map((q) => (q.id === quoteId ? { ...q, status, updatedAt: new Date().toISOString() } : q))
    saveStore(next)
    return getQuote(companyId, quoteId)
  }
  const { data } = await http.patch<Quote>(`${companyApiPath(companyId, 'quotes')}/${quoteId}`, { status })
  return data
}

export async function approveQuote(companyId: number, quoteId: string): Promise<Quote> {
  return updateQuoteStatus(companyId, quoteId, 'aprovado')
}

export async function convertQuoteToOrder(companyId: number, quoteId: string): Promise<Quote> {
  if (USE_MOCK) {
    await mockDelay()
    const next = loadStore().map((q) =>
      q.id === quoteId
        ? { ...q, status: 'convertido' as const, orderId: `PED-${quoteId}`, updatedAt: new Date().toISOString() }
        : q,
    )
    saveStore(next)
    return getQuote(companyId, quoteId)
  }
  const { data } = await http.post<Quote>(`${companyApiPath(companyId, 'quotes')}/${quoteId}/convert-to-order`)
  return data
}

export async function getQuotePdfUrl(companyId: number, quoteId: string): Promise<string> {
  if (USE_MOCK) {
    await mockDelay()
    return `#mock-pdf-${quoteId}`
  }
  const { data } = await http.get<{ url: string }>(`${companyApiPath(companyId, 'quotes')}/${quoteId}/pdf`)
  return data.url
}

export function buildWhatsAppLink(quote: Quote, phone = ''): string {
  const text = encodeURIComponent(
    `Orçamento ${quote.number} — ${quote.clientName}\nTotal: R$ ${quote.total.toFixed(2)}\nAguardamos aprovação.`,
  )
  const digits = phone.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}?text=${text}` : `https://wa.me/?text=${text}`
}

export async function saveQuoteSignature(
  companyId: number,
  quoteId: string,
  signatureDataUrl: string,
): Promise<Quote> {
  if (USE_MOCK) {
    await mockDelay()
    const next = loadStore().map((q) =>
      q.id === quoteId ? { ...q, signatureDataUrl, updatedAt: new Date().toISOString() } : q,
    )
    saveStore(next)
    return getQuote(companyId, quoteId)
  }
  const { data } = await http.post<Quote>(`${companyApiPath(companyId, 'quotes')}/${quoteId}/signature`, {
    signature_data_url: signatureDataUrl,
  })
  return data
}

export const quotesListKey = (companyId: number | null, params: QuoteListParams) =>
  ['signage', 'quotes', companyId, params] as const

export const quoteDetailKey = (companyId: number | null, quoteId: string) =>
  ['signage', 'quotes', companyId, quoteId] as const
