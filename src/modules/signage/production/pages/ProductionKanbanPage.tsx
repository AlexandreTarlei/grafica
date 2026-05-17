import { memo, useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import {
  addProductionComment,
  listProductionJobs,
  productionJobsKey,
  updateProductionPriority,
  updateProductionStage,
} from '@/modules/signage/production/services/production.api'
import {
  PRODUCTION_STAGES,
  type ProductionJob,
  type ProductionPriority,
  type ProductionStage,
} from '@/modules/signage/production/types'
import { PageShell } from '@/modules/signage/shared/components/PageShell'
import { StatusBadge } from '@/modules/signage/shared/components/StatusBadge'
import { PRODUCTION_STAGE_LABELS } from '@/modules/signage/shared/components/status-labels'
import { Timeline } from '@/modules/signage/shared/components/Timeline'
import { formatDatePt } from '@/modules/signage/shared/utils/format'

export function ProductionKanbanPage() {
  const companyId = useCurrentCompanyId()
  const qc = useQueryClient()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selected, setSelected] = useState<ProductionJob | null>(null)
  const [comment, setComment] = useState('')

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: productionJobsKey(companyId),
    queryFn: () => listProductionJobs(companyId as number),
    enabled: companyId != null,
  })

  const moveMut = useMutation({
    mutationFn: ({ jobId, stage }: { jobId: string; stage: ProductionStage }) =>
      updateProductionStage(companyId as number, jobId, stage),
    onSuccess: () => void qc.invalidateQueries({ queryKey: productionJobsKey(companyId) }),
    onError: () => toast.error('Erro ao mover card'),
  })

  const priorityMut = useMutation({
    mutationFn: ({ jobId, priority }: { jobId: string; priority: ProductionPriority }) =>
      updateProductionPriority(companyId as number, jobId, priority),
    onSuccess: (job) => {
      setSelected(job)
      void qc.invalidateQueries({ queryKey: productionJobsKey(companyId) })
    },
  })

  const commentMut = useMutation({
    mutationFn: () => addProductionComment(companyId as number, selected!.id, comment),
    onSuccess: (job) => {
      setComment('')
      setSelected(job)
      void qc.invalidateQueries({ queryKey: productionJobsKey(companyId) })
    },
  })

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const byStage = useMemo(() => {
    const map = Object.fromEntries(PRODUCTION_STAGES.map((s) => [s, [] as ProductionJob[]])) as Record<
      ProductionStage,
      ProductionJob[]
    >
    for (const job of jobs) map[job.stage].push(job)
    return map
  }, [jobs])

  const activeJob = jobs.find((j) => j.id === activeId)

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id))
  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const jobId = String(e.active.id)
    const overId = e.over?.id
    if (!overId) return
    const stage = PRODUCTION_STAGES.includes(overId as ProductionStage)
      ? (overId as ProductionStage)
      : jobs.find((j) => j.id === overId)?.stage
    if (!stage) return
    const job = jobs.find((j) => j.id === jobId)
    if (job && job.stage !== stage) moveMut.mutate({ jobId, stage })
  }

  return (
    <PageShell title="Produção" subtitle="Kanban — arraste os cards entre etapas.">
      {isLoading ? (
        <p className="text-muted-foreground text-sm">A carregar…</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <KanbanBoard byStage={byStage} onSelect={setSelected} />
          <DragOverlay>{activeJob ? <JobCard job={activeJob} /> : null}</DragOverlay>
        </DndContext>
      )}
      {selected ? (
        <JobDrawer
          job={selected}
          comment={comment}
          setComment={setComment}
          onClose={() => setSelected(null)}
          onPriority={(p) => priorityMut.mutate({ jobId: selected.id, priority: p })}
          onComment={() => commentMut.mutate()}
        />
      ) : null}
    </PageShell>
  )
}

function KanbanBoard({
  byStage,
  onSelect,
}: {
  byStage: Record<ProductionStage, ProductionJob[]>
  onSelect: (j: ProductionJob) => void
}) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {PRODUCTION_STAGES.map((stage) => (
        <KanbanColumn key={stage} stage={stage} jobs={byStage[stage]} onSelect={onSelect} />
      ))}
    </div>
  )
}

function KanbanColumn({
  stage,
  jobs,
  onSelect,
}: {
  stage: ProductionStage
  jobs: ProductionJob[]
  onSelect: (j: ProductionJob) => void
}) {
  const meta = PRODUCTION_STAGE_LABELS[stage]
  return (
    <div className="bg-muted/30 flex w-72 shrink-0 flex-col rounded-lg border p-2" id={stage}>
      <div className="mb-2 flex items-center justify-between px-1">
        <StatusBadge label={meta?.label ?? stage} tone={meta?.tone ?? 'default'} />
        <span className="text-muted-foreground text-xs">{jobs.length}</span>
      </div>
      <SortableContext id={stage} items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-[120px] flex-col gap-2">
          {jobs.map((job) => (
            <SortableJobCard key={job.id} job={job} onSelect={onSelect} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

const SortableJobCard = memo(function SortableJobCard({
  job,
  onSelect,
}: {
  job: ProductionJob
  onSelect: (j: ProductionJob) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: job.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <button type="button" className="w-full text-left" onClick={() => onSelect(job)}>
        <JobCard job={job} />
      </button>
    </div>
  )
})

const JobCard = memo(function JobCard({ job }: { job: ProductionJob }) {
  return (
    <div className="bg-card border-border rounded-md border p-3 shadow-sm">
      <p className="text-sm font-medium leading-tight">{job.title}</p>
      <p className="text-muted-foreground mt-1 text-xs">{job.clientName}</p>
      <p className="text-muted-foreground text-xs">{job.productLabel}</p>
      <div className="mt-2 flex items-center justify-between">
        <StatusBadge label={job.priority} tone={job.priority === 'urgente' ? 'danger' : 'muted'} />
        <span className="text-muted-foreground text-[10px]">{formatDatePt(job.dueAt)}</span>
      </div>
    </div>
  )
})

function JobDrawer({
  job,
  comment,
  setComment,
  onClose,
  onPriority,
  onComment,
}: {
  job: ProductionJob
  comment: string
  setComment: (v: string) => void
  onClose: () => void
  onPriority: (p: ProductionPriority) => void
  onComment: () => void
}) {
  return (
    <div className="bg-card border-border mt-4 grid gap-4 rounded-lg border p-4 lg:grid-cols-2">
      <div>
        <DrawerHeader job={job} onClose={onClose} />
        <div className="mt-2 flex flex-wrap gap-2">
          {(['baixa', 'normal', 'alta', 'urgente'] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={job.priority === p ? 'default' : 'outline'}
              onClick={() => onPriority(p)}
            >
              {p}
            </Button>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Novo comentário…" rows={2} />
          <Button size="sm" onClick={onComment} disabled={!comment.trim()}>
            Comentar
          </Button>
        </div>
      </div>
      <Timeline
        entries={job.comments.map((c) => ({
          id: c.id,
          title: c.author,
          description: c.text,
          at: c.at,
        }))}
      />
    </div>
  )
}

function DrawerHeader({ job, onClose }: { job: ProductionJob; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <h3 className="font-semibold">{job.title}</h3>
        <p className="text-muted-foreground text-sm">{job.clientName}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onClose}>
        Fechar
      </Button>
    </div>
  )
}
