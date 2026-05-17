export type InstallationStatus = 'agendado' | 'em_rota' | 'em_execucao' | 'concluido' | 'cancelado'

export type InstallationAppointment = {
  id: string
  clientName: string
  address: string
  scheduledAt: string
  teamName: string
  status: InstallationStatus
  routeUrl?: string
  checklist: { id: string; label: string; done: boolean }[]
  photoUrls: string[]
  signatureDataUrl?: string
}
