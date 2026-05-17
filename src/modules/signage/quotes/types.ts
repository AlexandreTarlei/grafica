import type { SignageProductCategory } from '@/modules/signage/products/types'

export type QuoteStatus = 'rascunho' | 'enviado' | 'aprovado' | 'recusado' | 'convertido'

export type QuoteLine = {
  id: string
  productName: string
  category: SignageProductCategory
  widthCm: number
  heightCm: number
  quantity: number
  unitPrice: number
  subtotal: number
  artworkUrl?: string
}

export type Quote = {
  id: string
  number: string
  clientName: string
  status: QuoteStatus
  lines: QuoteLine[]
  subtotal: number
  tax: number
  discount: number
  total: number
  notes?: string
  createdAt: string
  updatedAt: string
  orderId?: string
  signatureDataUrl?: string
}

export type QuoteFormLine = Omit<QuoteLine, 'id' | 'subtotal'>

export type QuoteListParams = {
  search?: string
  status?: QuoteStatus | ''
  page?: number
  pageSize?: number
}

export type PaginatedQuotes = { items: Quote[]; total: number }
