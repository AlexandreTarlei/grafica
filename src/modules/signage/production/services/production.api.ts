import { http } from '@/services/http/client'
import { companyApiPath } from '@/modules/signage/shared/services/company-path'
import type { ProductionJob, ProductionPriority, ProductionStage } from '@/modules/signage/production/types'

const USE_MOCK = import.meta.env.VITE_USE_SIGNAGE_PRODUCTION_MOCK !== 'false'
const STORAGE_KEY = 'signage_production_mock'

async function mockDelay(): Promise<void> {
  await new Promise((r) => setTimeout(r, 250))
}

function loadJobs(): ProductionJob[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ProductionJob[]
  } catch {
    /* ignore */
  }
  return [
    {
      id: 'j1',
      title: 'Banner promo verão',
      clientName: 'Supermercado Norte',
      productLabel: 'Banner 4x1',
      stage: 'aguardando_arte',
      priority: 'alta',
      dueAt: new Date(Date.now() + 86400000).toISOString(),
      comments: [],
    },
    {
      id: 'j2',
      title: 'Fachada ACM',
      clientName: 'Clínica Vida',
      productLabel: 'ACM cinza',
      stage: 'impressao',
      priority: 'normal',
      dueAt: new Date(Date.now() + 172800000).toISOString(),
      comments: [{ id: 'c1', author: 'Ops', text: 'Arte aprovada pelo cliente', at: new Date().toISOString() }],
    },
  ]
}

function saveJobs(jobs: ProductionJob[]): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
}

export async function listProductionJobs(companyId: number): Promise<ProductionJob[]> {
  if (USE_MOCK) {
    await mockDelay()
    return loadJobs()
  }
  const { data } = await http.get<ProductionJob[]>(companyApiPath(companyId, 'production/jobs'))
  return data
}

export async function updateProductionStage(
  companyId: number,
  jobId: string,
  stage: ProductionStage,
): Promise<ProductionJob> {
  if (USE_MOCK) {
    await mockDelay()
    const next = loadJobs().map((j) => (j.id === jobId ? { ...j, stage } : j))
    saveJobs(next)
    const found = next.find((j) => j.id === jobId)
    if (!found) throw new Error('Job não encontrado')
    return found
  }
  const { data } = await http.patch<ProductionJob>(
    `${companyApiPath(companyId, 'production/jobs')}/${jobId}/stage`,
    { stage },
  )
  return data
}

export async function updateProductionPriority(
  companyId: number,
  jobId: string,
  priority: ProductionPriority,
): Promise<ProductionJob> {
  if (USE_MOCK) {
    await mockDelay()
    const next = loadJobs().map((j) => (j.id === jobId ? { ...j, priority } : j))
    saveJobs(next)
    return next.find((j) => j.id === jobId)!
  }
  const { data } = await http.patch<ProductionJob>(
    `${companyApiPath(companyId, 'production/jobs')}/${jobId}`,
    { priority },
  )
  return data
}

export async function addProductionComment(
  companyId: number,
  jobId: string,
  text: string,
  author = 'Utilizador',
): Promise<ProductionJob> {
  if (USE_MOCK) {
    await mockDelay()
    const next = loadJobs().map((j) =>
      j.id === jobId
        ? {
            ...j,
            comments: [
              ...j.comments,
              { id: `c-${Date.now()}`, author, text, at: new Date().toISOString() },
            ],
          }
        : j,
    )
    saveJobs(next)
    return next.find((j) => j.id === jobId)!
  }
  const { data } = await http.post<ProductionJob>(
    `${companyApiPath(companyId, 'production/jobs')}/${jobId}/comments`,
    { text },
  )
  return data
}

export const productionJobsKey = (companyId: number | null) => ['signage', 'production', companyId] as const
