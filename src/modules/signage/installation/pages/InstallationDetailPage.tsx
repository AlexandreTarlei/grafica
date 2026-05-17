import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import {
  getInstallation,
  installationDetailKey,
  installationsKey,
  saveInstallationSignature,
  toggleChecklistItem,
  updateInstallationStatus,
} from '@/modules/signage/installation/services/installation.api'
import type { InstallationStatus } from '@/modules/signage/installation/types'
import { FileDropzone } from '@/modules/signage/shared/components/FileDropzone'
import { PageShell } from '@/modules/signage/shared/components/PageShell'
import { StatusBadge } from '@/modules/signage/shared/components/StatusBadge'
import { INSTALLATION_STATUS_LABELS } from '@/modules/signage/shared/components/status-labels'
import { formatDatePt } from '@/modules/signage/shared/utils/format'

const STATUSES: InstallationStatus[] = ['agendado', 'em_rota', 'em_execucao', 'concluido', 'cancelado']

export function InstallationDetailPage() {
  const { installationId = '' } = useParams()
  const companyId = useCurrentCompanyId()
  const qc = useQueryClient()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { data, isLoading } = useQuery({
    queryKey: installationDetailKey(companyId, installationId),
    queryFn: () => getInstallation(companyId as number, installationId),
    enabled: companyId != null && Boolean(installationId),
  })

  const statusMut = useMutation({
    mutationFn: (status: InstallationStatus) => updateInstallationStatus(companyId as number, installationId, status),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: installationDetailKey(companyId, installationId) })
      void qc.invalidateQueries({ queryKey: installationsKey(companyId) })
    },
  })

  const checklistMut = useMutation({
    mutationFn: ({ itemId, done }: { itemId: string; done: boolean }) =>
      toggleChecklistItem(companyId as number, installationId, itemId, done),
    onSuccess: () => void qc.invalidateQueries({ queryKey: installationDetailKey(companyId, installationId) }),
  })

  const signMut = useMutation({
    mutationFn: (dataUrl: string) => saveInstallationSignature(companyId as number, installationId, dataUrl),
    onSuccess: () => {
      toast.success('Assinatura registada')
      void qc.invalidateQueries({ queryKey: installationDetailKey(companyId, installationId) })
    },
  })

  if (isLoading || !data) return <p className="text-muted-foreground text-sm">A carregar…</p>

  const meta = INSTALLATION_STATUS_LABELS[data.status]

  return (
    <PageShell
      title={data.clientName}
      subtitle={`${data.address} · ${formatDatePt(data.scheduledAt)}`}
      actions={<StatusBadge label={meta?.label ?? data.status} tone={meta?.tone} />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm">
            <span className="text-muted-foreground">Equipe:</span> {data.teamName}
          </p>
          {data.routeUrl ? (
            <a href={data.routeUrl} target="_blank" rel="noreferrer" className="text-primary text-sm underline">
              Abrir rota no mapa
            </a>
          ) : null}
          <StatusButtons
            statuses={STATUSES}
            current={data.status}
            loading={statusMut.isPending}
            onSelect={(s: InstallationStatus) => statusMut.mutate(s)}
          />
          <div>
            <h3 className="mb-2 text-sm font-medium">Checklist</h3>
            <ul className="space-y-2">
              {data.checklist.map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={item.done}
                    disabled={checklistMut.isPending}
                    onCheckedChange={(v) =>
                      checklistMut.mutate({ itemId: item.id, done: !!v })
                    }
                  />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-medium">Fotos da obra</h3>
            <FileDropzone accept="images" multiple />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium">Assinatura do cliente</h3>
            {data.signatureDataUrl ? (
              <img src={data.signatureDataUrl} alt="Assinatura" className="max-h-32 rounded border" />
            ) : (
              <>
                <canvas ref={canvasRef} width={400} height={120} className="border-border w-full rounded border bg-white" />
                <Button
                  className="mt-2 gap-2"
                  size="sm"
                  disabled={signMut.isPending}
                  onClick={() => {
                    const c = canvasRef.current
                    if (c) signMut.mutate(c.toDataURL('image/png'))
                  }}
                >
                  {signMut.isPending ? (
                    <>
                      <Loader2Icon className="size-4 animate-spin" />
                      A guardar…
                    </>
                  ) : (
                    'Guardar assinatura'
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  )
}

function StatusButtons({
  statuses,
  current,
  loading,
  onSelect,
}: {
  statuses: InstallationStatus[]
  current: InstallationStatus
  loading?: boolean
  onSelect: (s: InstallationStatus) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((s) => (
        <Button
          key={s}
          size="sm"
          variant={current === s ? 'default' : 'outline'}
          disabled={loading}
          onClick={() => onSelect(s)}
        >
          {INSTALLATION_STATUS_LABELS[s]?.label ?? s}
        </Button>
      ))}
    </div>
  )
}
