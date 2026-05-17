import { http } from '@/services/http/client'
import { companyApiPath } from '@/modules/signage/shared/services/company-path'

const USE_MOCK = import.meta.env.VITE_USE_SIGNAGE_DASHBOARD_MOCK !== 'false'

export type SignageOperationalDashboard = {
  ordersInProduction: number
  installationsToday: number
  pendingQuotes: number
  revenueToday: number
  productionToday: number
  overdueOrders: number
  productionFunnel: { stage: string; count: number }[]
  quotesByStatus: { status: string; count: number }[]
  operationalStatus: { label: string; tone: 'success' | 'warning' | 'danger' | 'info' }[]
}

async function mockDelay(): Promise<void> {
  await new Promise((r) => setTimeout(r, 280))
}

const MOCK: SignageOperationalDashboard = {
  ordersInProduction: 14,
  installationsToday: 3,
  pendingQuotes: 7,
  revenueToday: 8420,
  productionToday: 9,
  overdueOrders: 2,
  productionFunnel: [
    { stage: 'Aguardando arte', count: 4 },
    { stage: 'Impressão', count: 5 },
    { stage: 'Acabamento', count: 3 },
    { stage: 'Instalação', count: 2 },
  ],
  quotesByStatus: [
    { status: 'Rascunho', count: 3 },
    { status: 'Enviado', count: 4 },
    { status: 'Aprovado', count: 2 },
  ],
  operationalStatus: [
    { label: 'Impressoras OK', tone: 'success' },
    { label: '2 entregas atrasadas', tone: 'warning' },
    { label: 'Equipe Beta em rota', tone: 'info' },
  ],
}

export async function fetchSignageDashboard(companyId: number): Promise<SignageOperationalDashboard> {
  if (USE_MOCK) {
    await mockDelay()
    return MOCK
  }
  const { data } = await http.get<SignageOperationalDashboard>(companyApiPath(companyId, 'signage/dashboard'))
  return data
}

export const signageDashboardKey = (companyId: number | null) => ['signage', 'dashboard', companyId] as const
