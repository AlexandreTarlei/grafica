import type { StatusTone } from '@/modules/signage/shared/components/StatusBadge'

export const QUOTE_STATUS_LABELS: Record<string, { label: string; tone: StatusTone }> = {
  rascunho: { label: 'Rascunho', tone: 'muted' },
  enviado: { label: 'Enviado', tone: 'info' },
  aprovado: { label: 'Aprovado', tone: 'success' },
  recusado: { label: 'Recusado', tone: 'danger' },
  convertido: { label: 'Convertido', tone: 'success' },
}

export const PRODUCTION_STAGE_LABELS: Record<string, { label: string; tone: StatusTone }> = {
  aguardando_arte: { label: 'Aguardando arte', tone: 'warning' },
  arte_aprovada: { label: 'Arte aprovada', tone: 'info' },
  impressao: { label: 'Impressão', tone: 'info' },
  acabamento: { label: 'Acabamento', tone: 'info' },
  instalacao: { label: 'Instalação', tone: 'warning' },
  entregue: { label: 'Entregue', tone: 'success' },
}

export const INSTALLATION_STATUS_LABELS: Record<string, { label: string; tone: StatusTone }> = {
  agendado: { label: 'Agendado', tone: 'info' },
  em_rota: { label: 'Em rota', tone: 'warning' },
  em_execucao: { label: 'Em execução', tone: 'info' },
  concluido: { label: 'Concluído', tone: 'success' },
  cancelado: { label: 'Cancelado', tone: 'danger' },
}
