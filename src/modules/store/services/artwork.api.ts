/**
 * Aprovação de arte na área do cliente.
 * GET  /store/artwork/proofs
 * POST /store/artwork/proofs/{id}/submit
 * POST /store/artwork/proofs/{id}/approve
 */
import { http } from '@/services/http/client'

const USE_MOCK = import.meta.env.VITE_USE_ORDER_MOCK !== 'false'

export type ArtworkProofStatus = 'pending_review' | 'awaiting_client' | 'approved' | 'rejected'

export type ArtworkProof = {
  id: string
  orderId: string | null
  orderNumber: string | null
  title: string
  status: ArtworkProofStatus
  previewUrl: string | null
  uploadedAt: string
  widthCm?: number
  heightCm?: number
}

type ProofApi = {
  id: number | string
  order_id?: number | string | null
  order_number?: string | null
  title?: string
  status?: string
  preview_url?: string | null
  uploaded_at?: string
  width_cm?: number
  height_cm?: number
}

function mapProof(raw: ProofApi): ArtworkProof {
  const status = (raw.status ?? 'awaiting_client') as ArtworkProofStatus
  return {
    id: String(raw.id),
    orderId: raw.order_id != null ? String(raw.order_id) : null,
    orderNumber: raw.order_number ?? null,
    title: raw.title ?? `Prova #${raw.id}`,
    status,
    previewUrl: raw.preview_url ?? null,
    uploadedAt: raw.uploaded_at ?? new Date().toISOString(),
    widthCm: raw.width_cm,
    heightCm: raw.height_cm,
  }
}

const MOCK_PROOFS: ArtworkProof[] = [
  {
    id: '1',
    orderId: '101',
    orderNumber: 'PED-2026-0101',
    title: 'Banner fachada — prova 1',
    status: 'awaiting_client',
    previewUrl: null,
    uploadedAt: new Date().toISOString(),
    widthCm: 300,
    heightCm: 100,
  },
]

export async function listArtworkProofs(): Promise<ArtworkProof[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200))
    return MOCK_PROOFS.map((p) => ({ ...p }))
  }
  const { data } = await http.get<{ items?: ProofApi[] } | ProofApi[]>('/store/artwork/proofs')
  const items = Array.isArray(data) ? data : (data.items ?? [])
  return items.map(mapProof)
}

export async function submitArtworkForReview(proofId: string): Promise<ArtworkProof> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250))
    const idx = MOCK_PROOFS.findIndex((p) => p.id === proofId)
    if (idx >= 0) {
      MOCK_PROOFS[idx] = { ...MOCK_PROOFS[idx], status: 'pending_review' }
      return { ...MOCK_PROOFS[idx] }
    }
    return { ...MOCK_PROOFS[0], status: 'pending_review' }
  }
  const { data } = await http.post<ProofApi>(`/store/artwork/proofs/${proofId}/submit`)
  return mapProof(data)
}

export async function approveArtworkProof(proofId: string): Promise<ArtworkProof> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250))
    const idx = MOCK_PROOFS.findIndex((p) => p.id === proofId)
    if (idx >= 0) {
      MOCK_PROOFS[idx] = { ...MOCK_PROOFS[idx], status: 'approved' }
      return { ...MOCK_PROOFS[idx] }
    }
    return { ...MOCK_PROOFS[0], status: 'approved' }
  }
  const { data } = await http.post<ProofApi>(`/store/artwork/proofs/${proofId}/approve`)
  return mapProof(data)
}

export const artworkProofsKey = ['account', 'artwork', 'proofs'] as const
