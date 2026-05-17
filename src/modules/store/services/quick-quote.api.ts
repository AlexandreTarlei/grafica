/**
 * Pedido de orçamento público (loja).
 * POST /store/quote-requests
 */
import { http } from '@/services/http/client'
import type { QuickQuoteFormInput } from '@/modules/store/schemas/quickQuote.schema'

const USE_MOCK = import.meta.env.VITE_USE_COMMERCIAL_MOCK !== 'false'

export type QuickQuoteRequestResult = {
  id: string
  message?: string
}

export async function submitQuickQuoteRequest(
  input: QuickQuoteFormInput & { artworkAssetIds?: number[] },
): Promise<QuickQuoteRequestResult> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400))
    return { id: `qr-${Date.now()}`, message: 'Pedido registado.' }
  }
  const { data } = await http.post<{ id: string | number; message?: string }>('/store/quote-requests', {
    contact_name: input.nome,
    contact_email: input.email,
    contact_phone: input.tel || undefined,
    category: input.cat,
    width_cm: input.width,
    height_cm: input.height,
    quantity: input.qty,
    notes: input.notes?.trim() || undefined,
    artwork_asset_ids: input.artworkAssetIds?.length ? input.artworkAssetIds : undefined,
  })
  return { id: String(data.id), message: data.message }
}
