import { http } from '@/services/http/client'
import { companyApiPath } from '@/modules/signage/shared/services/company-path'

const USE_MOCK = import.meta.env.VITE_USE_SIGNAGE_RESALE_MOCK !== 'false'

export type ResalePartner = {
  id: string
  name: string
  hideBrand: boolean
  discountPercent: number
  activeOrders: number
}

export type ResaleOrder = {
  id: string
  partnerName: string
  total: number
  status: string
  createdAt: string
}

export type ResaleDashboard = {
  partners: ResalePartner[]
  orders: ResaleOrder[]
  revenueMonth: number
}

async function mockDelay(): Promise<void> {
  await new Promise((r) => setTimeout(r, 300))
}

const MOCK: ResaleDashboard = {
  partners: [
    { id: 'p1', name: 'Gráfica Parceira Norte', hideBrand: true, discountPercent: 15, activeOrders: 3 },
    { id: 'p2', name: 'Studio Revenda SP', hideBrand: false, discountPercent: 10, activeOrders: 1 },
  ],
  orders: [
    { id: 'wl1', partnerName: 'Gráfica Parceira Norte', total: 4200, status: 'em_producao', createdAt: new Date().toISOString() },
  ],
  revenueMonth: 28500,
}

export async function getResaleDashboard(companyId: number): Promise<ResaleDashboard> {
  if (USE_MOCK) {
    await mockDelay()
    return MOCK
  }
  const { data } = await http.get<ResaleDashboard>(companyApiPath(companyId, 'resale/dashboard'))
  return data
}

export const resaleDashboardKey = (companyId: number | null) => ['signage', 'resale', companyId] as const
