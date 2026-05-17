import { useState } from 'react'
import { Loader2Icon } from 'lucide-react'
import { MAX_UPLOAD_BYTES } from '@/core/constants'
import { FileDropzone, type DroppedFile } from '@/modules/signage/shared/components/FileDropzone'
import { uploadArtFile, type UploadAsset } from '@/modules/store/services/uploads.api'
import { toApiError } from '@/utils/api-error'

type UploadFieldProps = {
  onUploaded?: (assets: UploadAsset[]) => void
  purpose?: string
  multiple?: boolean
  className?: string
}

export function UploadField({ onUploaded, purpose = 'art', multiple = true, className }: UploadFieldProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [assets, setAssets] = useState<UploadAsset[]>([])

  const handleChange = (files: DroppedFile[]) => {
    if (!files.length) return
    void (async () => {
      setUploading(true)
      setError(null)
      const uploaded: UploadAsset[] = []
      try {
        for (const f of files) {
          const asset = await uploadArtFile(f.file, purpose)
          uploaded.push(asset)
        }
        setAssets((prev) => [...prev, ...uploaded])
        onUploaded?.(uploaded)
      } catch (e) {
        setError(toApiError(e).message)
      } finally {
        setUploading(false)
      }
    })()
  }

  return (
    <div className={className}>
      <FileDropzone
        accept="images-pdf"
        multiple={multiple}
        maxBytes={MAX_UPLOAD_BYTES}
        onChange={handleChange}
      />
      {uploading ? (
        <p className="text-muted-foreground flex items-center gap-2 text-xs">
          <Loader2Icon className="size-3 animate-spin" />A enviar ficheiros…
        </p>
      ) : null}
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
      {assets.length > 0 ? (
        <ul className="text-muted-foreground mt-2 space-y-1 text-xs">
          {assets.map((a) => (
            <li key={a.id}>
              {a.originalFilename ?? `Ficheiro #${a.id}`} — enviado com sucesso
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
