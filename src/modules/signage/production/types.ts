export const PRODUCTION_STAGES = [
  'aguardando_arte',
  'arte_aprovada',
  'impressao',
  'acabamento',
  'instalacao',
  'entregue',
] as const

export type ProductionStage = (typeof PRODUCTION_STAGES)[number]

export type ProductionPriority = 'baixa' | 'normal' | 'alta' | 'urgente'

export type ProductionJob = {
  id: string
  title: string
  clientName: string
  productLabel: string
  stage: ProductionStage
  priority: ProductionPriority
  dueAt: string
  artworkUrl?: string
  comments: { id: string; author: string; text: string; at: string }[]
}
