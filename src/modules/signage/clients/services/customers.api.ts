import { http } from '@/services/http/client'
import { companyApiPath } from '@/modules/signage/shared/services/company-path'
import type { CorporateClient } from '@/modules/signage/clients/types'

const USE_MOCK = import.meta.env.VITE_USE_SIGNAGE_CUSTOMERS_MOCK !== 'false'
const STORAGE_KEY = 'signage_customers_mock'

async function mockDelay(): Promise<void> {
  await new Promise((r) => setTimeout(r, 280))
}

function load(): CorporateClient[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as CorporateClient[]
  } catch {
    /* ignore */
  }
  return [
    {
      id: '1',
      legalName: 'Comunicação Visual Ltda',
      tradeName: 'CV Sul',
      cnpj: '12.345.678/0001-90',
      contacts: [{ id: 'c1', name: 'Maria Gestora', email: 'maria@cv.com', phone: '11999990000', role: 'Compras' }],
      recurring: true,
      projectsCount: 4,
      quotesCount: 12,
      ordersCount: 8,
      createdAt: new Date().toISOString(),
    },
  ]
}

function save(items: CorporateClient[]): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export async function listCorporateClients(companyId: number, search?: string): Promise<CorporateClient[]> {
  if (USE_MOCK) {
    await mockDelay()
    let items = load()
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(
        (c) =>
          c.legalName.toLowerCase().includes(q) ||
          c.cnpj.includes(q) ||
          c.tradeName?.toLowerCase().includes(q),
      )
    }
    return items
  }
  const { data } = await http.get<CorporateClient[]>(companyApiPath(companyId, 'customers'), {
    params: { search },
  })
  return data
}

export async function createCorporateClient(
  companyId: number,
  body: Omit<CorporateClient, 'id' | 'projectsCount' | 'quotesCount' | 'ordersCount' | 'createdAt'>,
): Promise<CorporateClient> {
  if (USE_MOCK) {
    await mockDelay()
    const created: CorporateClient = {
      ...body,
      id: String(Date.now()),
      projectsCount: 0,
      quotesCount: 0,
      ordersCount: 0,
      createdAt: new Date().toISOString(),
    }
    save([...load(), created])
    return created
  }
  const { data } = await http.post<CorporateClient>(companyApiPath(companyId, 'customers'), body)
  return data
}

export async function updateCorporateClient(
  companyId: number,
  id: string,
  body: Partial<CorporateClient>,
): Promise<CorporateClient> {
  if (USE_MOCK) {
    await mockDelay()
    const next = load().map((c) => (c.id === id ? { ...c, ...body } : c))
    save(next)
    return next.find((c) => c.id === id)!
  }
  const { data } = await http.patch<CorporateClient>(`${companyApiPath(companyId, 'customers')}/${id}`, body)
  return data
}

export const corporateClientsKey = (companyId: number | null, search?: string) =>
  ['signage', 'customers', companyId, search] as const
