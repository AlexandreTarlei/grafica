import { useCallback, useId, useState, type DragEvent } from 'react'
import { FileUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const PDF_TYPE = 'application/pdf'

export type DroppedFile = {
  id: string
  file: File
  previewUrl: string | null
}

type FileDropzoneProps = {
  accept?: 'images' | 'images-pdf' | 'all'
  multiple?: boolean
  maxBytes?: number
  value?: DroppedFile[]
  onChange?: (files: DroppedFile[]) => void
  className?: string
}

function acceptMime(accept: FileDropzoneProps['accept']): string[] {
  if (accept === 'images') return IMAGE_TYPES
  if (accept === 'images-pdf') return [...IMAGE_TYPES, PDF_TYPE]
  return []
}

function isAllowed(file: File, allowed: string[]): boolean {
  if (!allowed.length) return true
  return allowed.includes(file.type)
}

function toDropped(file: File): DroppedFile {
  const previewUrl =
    file.type.startsWith('image/') ? URL.createObjectURL(file) : file.type === PDF_TYPE ? 'pdf' : null
  return { id: `${file.name}-${file.size}-${file.lastModified}`, file, previewUrl }
}

export function FileDropzone({
  accept = 'images-pdf',
  multiple = true,
  maxBytes = DEFAULT_MAX_BYTES,
  value,
  onChange,
  className,
}: FileDropzoneProps) {
  const inputId = useId()
  const [internal, setInternal] = useState<DroppedFile[]>([])
  const [error, setError] = useState<string | null>(null)
  const files = value ?? internal
  const setFiles = onChange ?? setInternal
  const allowed = acceptMime(accept)

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      setError(null)
      const next: DroppedFile[] = [...files]
      for (const file of Array.from(incoming)) {
        if (file.size > maxBytes) {
          setError(`Ficheiro demasiado grande (máx. ${Math.round(maxBytes / 1024 / 1024)} MB).`)
          continue
        }
        if (!isAllowed(file, allowed)) {
          setError('Tipo de ficheiro não permitido.')
          continue
        }
        const dropped = toDropped(file)
        if (!multiple) next.length = 0
        if (!next.some((f) => f.id === dropped.id)) next.push(dropped)
      }
      setFiles(next)
    },
    [allowed, files, maxBytes, multiple, setFiles],
  )

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
  }

  const remove = (id: string) => {
    const target = files.find((f) => f.id === id)
    if (target?.previewUrl && target.previewUrl !== 'pdf') URL.revokeObjectURL(target.previewUrl)
    setFiles(files.filter((f) => f.id !== id))
  }

  return (
    <div className={cn('space-y-3', className)}>
      <label
        htmlFor={inputId}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="border-border hover:border-primary/40 hover:bg-muted/30 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center transition-colors"
      >
        <FileUp className="text-muted-foreground size-8" />
        <span className="text-sm font-medium">Arraste ficheiros ou clique para selecionar</span>
        <span className="text-muted-foreground text-xs">Imagens e PDF até {Math.round(maxBytes / 1024 / 1024)} MB</span>
        <input
          id={inputId}
          type="file"
          className="sr-only"
          multiple={multiple}
          accept={allowed.join(',')}
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </label>
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
      {files.length > 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((f) => (
            <li key={f.id} className="bg-muted/40 relative flex items-center gap-2 rounded-md border p-2 text-sm">
              {f.previewUrl === 'pdf' ? (
                <span className="bg-background flex size-12 items-center justify-center rounded text-xs font-bold">PDF</span>
              ) : f.previewUrl ? (
                <img src={f.previewUrl} alt="" className="size-12 rounded object-cover" />
              ) : (
                <span className="bg-background flex size-12 items-center justify-center rounded text-xs">FILE</span>
              )}
              <span className="min-w-0 flex-1 truncate">{f.file.name}</span>
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(f.id)} aria-label="Remover">
                <X className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
