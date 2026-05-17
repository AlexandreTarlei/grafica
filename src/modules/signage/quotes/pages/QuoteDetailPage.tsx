import { useRef, type RefObject } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import {
  approveQuote,
  buildWhatsAppLink,
  convertQuoteToOrder,
  getQuote,
  getQuotePdfUrl,
  quoteDetailKey,
  saveQuoteSignature,
} from '@/modules/signage/quotes/services/quotes.api'
import { ArtworkPreview } from '@/modules/signage/shared/components/ArtworkPreview'
import { PageShell } from '@/modules/signage/shared/components/PageShell'
import { StatusBadge } from '@/modules/signage/shared/components/StatusBadge'
import { QUOTE_STATUS_LABELS } from '@/modules/signage/shared/components/status-labels'
import { formatCurrency, formatDatePt } from '@/modules/signage/shared/utils/format'
import { cn } from '@/lib/utils'

export function QuoteDetailPage() {
  const { quoteId = '' } = useParams()
  const companyId = useCurrentCompanyId()
  const qc = useQueryClient()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { data, isLoading } = useQuery({
    queryKey: quoteDetailKey(companyId, quoteId),
    queryFn: () => getQuote(companyId as number, quoteId),
    enabled: companyId != null && Boolean(quoteId),
  })

  const approveMut = useMutation({
    mutationFn: () => approveQuote(companyId as number, quoteId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: quoteDetailKey(companyId, quoteId) })
      toast.success('Orçamento aprovado')
    },
  })

  const convertMut = useMutation({
    mutationFn: () => convertQuoteToOrder(companyId as number, quoteId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: quoteDetailKey(companyId, quoteId) })
      toast.success('Convertido em pedido')
    },
  })

  const pdfMut = useMutation({
    mutationFn: () => getQuotePdfUrl(companyId as number, quoteId),
    onSuccess: (url) => {
      if (url.startsWith('#')) toast.message('PDF mock — integrar endpoint real')
      else window.open(url, '_blank')
    },
  })

  const signMut = useMutation({
    mutationFn: (dataUrl: string) => saveQuoteSignature(companyId as number, quoteId, dataUrl),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: quoteDetailKey(companyId, quoteId) })
      toast.success('Assinatura guardada')
    },
  })

  if (isLoading || !data) return <p className="text-muted-foreground text-sm">A carregar…</p>

  const statusMeta = QUOTE_STATUS_LABELS[data.status]

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    signMut.mutate(canvas.toDataURL('image/png'))
  }

  return (
    <PageShell
      title={data.number}
      subtitle={`${data.clientName} · ${formatDatePt(data.updatedAt)}`}
      actions={
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={statusMeta?.label ?? data.status} tone={statusMeta?.tone} />
          <Button size="sm" variant="outline" onClick={() => approveMut.mutate()} disabled={approveMut.isPending}>
            Aprovar
          </Button>
          <Button size="sm" variant="outline" onClick={() => pdfMut.mutate()} disabled={pdfMut.isPending}>
            Gerar PDF
          </Button>
          <Button size="sm" variant="outline" onClick={() => convertMut.mutate()} disabled={convertMut.isPending}>
            Converter em pedido
          </Button>
          <a
            href={buildWhatsAppLink(data)}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}
          >
            WhatsApp
          </a>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          {data.lines.map((line) => (
            <QuoteLineCard key={line.id} line={line} />
          ))}
          <p className="text-lg font-semibold">Total: {formatCurrency(data.total)}</p>
          {data.orderId ? (
            <Link to="/admin/pedidos" className={cn(buttonVariants({ variant: 'link', size: 'sm' }), 'px-0')}>
              Ver pedidos ({data.orderId})
            </Link>
          ) : null}
        </div>
        <SignatureBlock canvasRef={canvasRef} onSave={saveSignature} signature={data.signatureDataUrl} />
      </div>
    </PageShell>
  )
}

function QuoteLineCard({ line }: { line: { productName: string; widthCm: number; heightCm: number; subtotal: number; artworkUrl?: string } }) {
  return (
    <div className="border-border rounded-lg border p-4">
      <p className="font-medium">{line.productName}</p>
      <p className="text-muted-foreground text-sm">
        {line.widthCm}×{line.heightCm} cm — {formatCurrency(line.subtotal)}
      </p>
      <ArtworkPreview widthCm={line.widthCm} heightCm={line.heightCm} imageUrl={line.artworkUrl} className="mt-2" />
    </div>
  )
}

function SignatureBlock({
  canvasRef,
  onSave,
  signature,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>
  onSave: () => void
  signature?: string
}) {
  return (
    <div className="border-border space-y-2 rounded-lg border p-4">
      <h3 className="font-medium">Assinatura do cliente</h3>
      {signature ? (
        <img src={signature} alt="Assinatura" className="border-border max-h-32 rounded border" />
      ) : (
        <canvas ref={canvasRef} width={400} height={120} className="border-border w-full rounded border bg-white" />
      )}
      {!signature ? (
        <Button size="sm" onClick={onSave}>
          Guardar assinatura
        </Button>
      ) : null}
    </div>
  )
}
