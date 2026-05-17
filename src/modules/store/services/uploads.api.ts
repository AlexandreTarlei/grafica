import { http } from '@/services/http/client'

export type UploadAsset = {
  id: number
  originalFilename: string | null
  mimeType: string
  sizeBytes: number
  purpose: string
  createdAt: string
}

type UploadReadApi = {
  id: number
  original_filename: string | null
  mime_type: string
  size_bytes: number
  purpose: string
  created_at: string
}

function mapUpload(raw: UploadReadApi): UploadAsset {
  return {
    id: raw.id,
    originalFilename: raw.original_filename,
    mimeType: raw.mime_type,
    sizeBytes: raw.size_bytes,
    purpose: raw.purpose,
    createdAt: raw.created_at,
  }
}

export async function uploadArtFile(file: File, purpose = 'art'): Promise<UploadAsset> {
  const form = new FormData()
  form.append('file', file)
  form.append('purpose', purpose)
  const { data } = await http.post<UploadReadApi>('/uploads', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapUpload(data)
}

export function uploadAssetDownloadUrl(assetId: number): string {
  const base = http.defaults.baseURL ?? ''
  const path = `/uploads/${assetId}`
  if (!base) return path
  return `${base.replace(/\/$/, '')}${path}`
}
