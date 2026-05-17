import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/layout/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArtworkPreview } from '@/modules/signage/shared/components/ArtworkPreview'
import { UploadField } from '@/modules/store/components/UploadField'
import {
  approveArtworkProof,
  artworkProofsKey,
  listArtworkProofs,
  submitArtworkForReview,
  type ArtworkProof,
} from '@/modules/store/services/artwork.api'

const STATUS_LABEL: Record<ArtworkProof['status'], string> = {
  pending_review: 'Em revisão',
  awaiting_client: 'Aguarda a sua aprovação',
  approved: 'Aprovada',
  rejected: 'Recusada',
}

function ProofCard({ proof }: { proof: ArtworkProof }) {
  const qc = useQueryClient()
  const submit = useMutation({
    mutationFn: () => submitArtworkForReview(proof.id),
    onSuccess: () => {
      toast.success('Arte submetida para revisão.')
      void qc.invalidateQueries({ queryKey: artworkProofsKey })
    },
    onError: () => toast.error('Não foi possível submeter a arte.'),
  })
  const approve = useMutation({
    mutationFn: () => approveArtworkProof(proof.id),
    onSuccess: () => {
      toast.success('Arte aprovada para produção.')
      void qc.invalidateQueries({ queryKey: artworkProofsKey })
    },
    onError: () => toast.error('Não foi possível aprovar a prova.'),
  })

  return (
    <Card className="shadow-card ring-1 ring-border/60">
      <CardContent className="grid gap-4 p-4 sm:grid-cols-[minmax(0,200px)_1fr]">
        <ArtworkPreview
          widthCm={proof.widthCm ?? 100}
          heightCm={proof.heightCm ?? 50}
          imageUrl={proof.previewUrl}
        />
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium">{proof.title}</p>
              {proof.orderNumber ? (
                <p className="text-muted-foreground text-xs">Pedido #{proof.orderNumber}</p>
              ) : null}
            </div>
            <Badge variant={proof.status === 'approved' ? 'default' : 'secondary'}>
              {STATUS_LABEL[proof.status]}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {proof.status === 'awaiting_client' ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  disabled={submit.isPending}
                  onClick={() => submit.mutate()}
                >
                  Submeter para revisão
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={approve.isPending}
                  onClick={() => approve.mutate()}
                >
                  Aprovar prova
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AccountArtworkPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: artworkProofsKey,
    queryFn: listArtworkProofs,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Aprovação de arte</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Envie revisões ou aprove a prova final antes da impressão.
        </p>
      </div>

      <UploadField
        onUploaded={() => {
          toast.success('Ficheiro enviado. A equipa gráfica irá associá-lo ao seu pedido.')
        }}
      />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ) : isError ? (
        <p className="text-muted-foreground text-sm">Não foi possível carregar as provas de arte.</p>
      ) : (data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="Sem provas pendentes"
          description="Quando a equipa enviar uma prova, poderá aprová-la aqui."
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {data!.map((proof) => (
            <li key={proof.id}>
              <ProofCard proof={proof} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
