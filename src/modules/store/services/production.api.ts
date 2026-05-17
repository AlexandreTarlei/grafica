import { http } from '@/services/http/client'

export type ProductionJobItem = {
  id: string
  orderId: string | null
  status: string
  dueAt: string | null
  createdAt: string
  updatedAt: string
}

export type ProductionTimelineEvent = {
  id: string
  fromStatus: string | null
  toStatus: string
  note: string | null
  createdAt: string
}

type ProductionJobApi = {
  id: number
  order_id: number | null
  status: string
  due_at: string | null
  created_at: string
  updated_at: string
}

type ProductionEventApi = {
  id: number
  from_status: string | null
  to_status: string
  note: string | null
  created_at: string
}

type PageApi<T> = {
  items: T[]
  total: number
}

function mapJob(raw: ProductionJobApi): ProductionJobItem {
  return {
    id: String(raw.id),
    orderId: raw.order_id != null ? String(raw.order_id) : null,
    status: raw.status,
    dueAt: raw.due_at,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function mapEvent(raw: ProductionEventApi): ProductionTimelineEvent {
  return {
    id: String(raw.id),
    fromStatus: raw.from_status,
    toStatus: raw.to_status,
    note: raw.note,
    createdAt: raw.created_at,
  }
}

export async function listProductionJobs(params?: {
  skip?: number
  limit?: number
  status?: string
}): Promise<ProductionJobItem[]> {
  const { data } = await http.get<PageApi<ProductionJobApi> | ProductionJobApi[]>('/production/jobs', {
    params: {
      skip: params?.skip ?? 0,
      limit: params?.limit ?? 50,
      status: params?.status,
    },
  })
  const items = Array.isArray(data) ? data : data.items
  return items.map(mapJob)
}

export async function getProductionJobTimeline(jobId: string): Promise<ProductionTimelineEvent[]> {
  const { data } = await http.get<ProductionEventApi[]>(`/production/jobs/${jobId}/timeline`)
  return data.map(mapEvent)
}
