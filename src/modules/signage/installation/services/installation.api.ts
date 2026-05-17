import { http } from '@/services/http/client'
import { companyApiPath } from '@/modules/signage/shared/services/company-path'
import type { InstallationAppointment, InstallationStatus } from '@/modules/signage/installation/types'

const USE_MOCK = import.meta.env.VITE_USE_SIGNAGE_INSTALLATION_MOCK !== 'false'
const STORAGE_KEY = 'signage_installation_mock'

async function mockDelay(): Promise<void> {
  await new Promise((r) => setTimeout(r, 250))
}

function load(): InstallationAppointment[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as InstallationAppointment[]
  } catch {
    /* ignore */
  }
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return [
    {
      id: 'i1',
      clientName: 'Rede Farmácias Sul',
      address: 'Av. Paulista, 1000 — São Paulo',
      scheduledAt: tomorrow.toISOString(),
      teamName: 'Equipe Alpha',
      status: 'agendado',
      routeUrl: 'https://maps.google.com/?q=Av+Paulista+1000',
      checklist: [
        { id: 'c1', label: 'Material conferido', done: false },
        { id: 'c2', label: 'EPI completo', done: false },
        { id: 'c3', label: 'Fotos antes/depois', done: false },
      ],
      photoUrls: [],
    },
  ]
}

function save(items: InstallationAppointment[]): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export async function listInstallations(companyId: number): Promise<InstallationAppointment[]> {
  if (USE_MOCK) {
    await mockDelay()
    return load()
  }
  const { data } = await http.get<InstallationAppointment[]>(companyApiPath(companyId, 'installations'))
  return data
}

export async function getInstallation(companyId: number, id: string): Promise<InstallationAppointment> {
  if (USE_MOCK) {
    await mockDelay()
    const found = load().find((x) => x.id === id)
    if (!found) throw new Error('Instalação não encontrada')
    return found
  }
  const { data } = await http.get<InstallationAppointment>(`${companyApiPath(companyId, 'installations')}/${id}`)
  return data
}

export async function updateInstallationStatus(
  companyId: number,
  id: string,
  status: InstallationStatus,
): Promise<InstallationAppointment> {
  if (USE_MOCK) {
    await mockDelay()
    const next = load().map((x) => (x.id === id ? { ...x, status } : x))
    save(next)
    return getInstallation(companyId, id)
  }
  const { data } = await http.patch<InstallationAppointment>(
    `${companyApiPath(companyId, 'installations')}/${id}`,
    { status },
  )
  return data
}

export async function toggleChecklistItem(
  companyId: number,
  id: string,
  itemId: string,
  done: boolean,
): Promise<InstallationAppointment> {
  if (USE_MOCK) {
    await mockDelay()
    const next = load().map((x) =>
      x.id === id
        ? { ...x, checklist: x.checklist.map((c) => (c.id === itemId ? { ...c, done } : c)) }
        : x,
    )
    save(next)
    return getInstallation(companyId, id)
  }
  const { data } = await http.patch<InstallationAppointment>(
    `${companyApiPath(companyId, 'installations')}/${id}/checklist/${itemId}`,
    { done },
  )
  return data
}

export async function saveInstallationSignature(
  companyId: number,
  id: string,
  signatureDataUrl: string,
): Promise<InstallationAppointment> {
  if (USE_MOCK) {
    await mockDelay()
    const next = load().map((x) => (x.id === id ? { ...x, signatureDataUrl } : x))
    save(next)
    return getInstallation(companyId, id)
  }
  const { data } = await http.post<InstallationAppointment>(
    `${companyApiPath(companyId, 'installations')}/${id}/signature`,
    { signature_data_url: signatureDataUrl },
  )
  return data
}

export const installationsKey = (companyId: number | null) => ['signage', 'installations', companyId] as const

export const installationDetailKey = (companyId: number | null, id: string) =>
  ['signage', 'installations', companyId, id] as const
