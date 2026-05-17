import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, ClipboardCopy, Loader2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { InvoiceActionsBar } from '@/modules/admin/fiscal/components/InvoiceActionsBar'
import { InvoiceItemsTable } from '@/modules/admin/fiscal/components/InvoiceItemsTable'
import { InvoiceStatusBadge } from '@/modules/admin/fiscal/components/InvoiceStatusBadge'
import { InvoiceSummaryCard } from '@/modules/admin/fiscal/components/InvoiceSummaryCard'
import { InvoiceTaxesPanel } from '@/modules/admin/fiscal/components/InvoiceTaxesPanel'
import { InvoiceTimeline } from '@/modules/admin/fiscal/components/InvoiceTimeline'
import { useFiscalInvoiceDetail } from '@/modules/admin/fiscal/hooks/useFiscalInvoiceDetail'
import { downloadInvoiceXml } from '@/modules/admin/fiscal/services/fiscal.api'
import { cn } from '@/lib/utils'

function XmlTab({ invoiceId, hasXml }: { invoiceId: number; hasXml: boolean }) {
  const companyId = useCurrentCompanyId()
  const [xml, setXml] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadXml() {
    if (companyId == null) return
    setLoading(true)
    setError(null)
    try {
      const blob = await downloadInvoiceXml(companyId, invoiceId)
      const text = await blob.text()
      setXml(text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar XML.')
    } finally {
      setLoading(false)
    }
  }

  async function copyXml() {
    if (!xml) return
    try {
      await navigator.clipboard.writeText(xml)
      toast.success('XML copiado para a área de transferência.')
    } catch {
      toast.error('Falha ao copiar XML.')
    }
  }

  if (!hasXml) {
    return (
      <p className="text-muted-foreground border-muted-foreground/30 rounded-xl border border-dashed p-10 text-center text-sm">
        XML ainda não disponível. Será preenchido após a autorização da SEFAZ.
      </p>
    )
  }

  if (!xml && !loading && !error) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-muted-foreground text-sm">
          O conteúdo do XML não é carregado por defeito (pode ser grande).
        </p>
        <Button type="button" size="sm" onClick={() => void loadXml()}>
          Carregar XML
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className="size-4 animate-spin" />A carregar XML…
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive text-base">Erro ao carregar XML</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" size="sm" variant="outline" onClick={() => void loadXml()}>
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between gap-2">
        <span className="text-muted-foreground text-xs">{xml?.length ?? 0} caracteres</span>
        <Button type="button" size="sm" variant="outline" className="gap-1" onClick={() => void copyXml()}>
          <ClipboardCopy className="size-4" />
          Copiar XML
        </Button>
      </div>
      <ScrollArea className="h-[420px] rounded-xl border">
        <pre className="text-foreground/90 p-4 font-mono text-xs whitespace-pre-wrap break-all">
          {xml}
        </pre>
      </ScrollArea>
    </div>
  )
}

export function FiscalInvoiceDetailPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>()
  const id = invoiceId ? Number(invoiceId) : NaN
  const enabledId = Number.isFinite(id) && id > 0 ? id : undefined

  const { data, isLoading, isError, error, refetch, isFetching } = useFiscalInvoiceDetail(enabledId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive text-base">Nota indisponível</CardTitle>
          <CardDescription>
            {error instanceof Error ? error.message : 'Não foi possível carregar a nota fiscal.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Link
            to="/admin/fiscal/notas"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            Voltar à lista
          </Link>
          <Button type="button" size="sm" variant="secondary" onClick={() => void refetch()}>
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/fiscal/notas"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1')}
          >
            <ArrowLeft className="size-4" />
            Notas
          </Link>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {data.numeroNota ? `NF-e Nº ${data.numeroNota}` : `Nota #${data.id}`}
          </h2>
          <InvoiceStatusBadge status={data.status} />
          {isFetching && data.status === 'processando' ? (
            <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
              <Loader2 className="size-3 animate-spin" />A actualizar…
            </span>
          ) : null}
        </div>
        <InvoiceActionsBar invoice={data} onAfterAction={() => void refetch()} />
      </div>

      <InvoiceSummaryCard invoice={data} />

      <Tabs defaultValue="produtos">
        <TabsList variant="line" className="w-full justify-start">
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="impostos">Impostos</TabsTrigger>
          <TabsTrigger value="xml">XML</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>
        <TabsContent value="produtos" className="mt-4">
          <InvoiceItemsTable items={data.items} />
        </TabsContent>
        <TabsContent value="impostos" className="mt-4">
          <InvoiceTaxesPanel items={data.items} />
        </TabsContent>
        <TabsContent value="xml" className="mt-4">
          <XmlTab invoiceId={data.id} hasXml={data.hasXmlFile} />
        </TabsContent>
        <TabsContent value="historico" className="mt-4">
          <InvoiceTimeline invoice={data} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
