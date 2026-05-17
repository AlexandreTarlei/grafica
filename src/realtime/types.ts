export type RealtimeEventMeta = {
  show_toast?: boolean
  toast_title?: string | null
  severity?: string | null
}

export type RealtimeEvent = {
  id: string
  name: string
  module: string
  company_id: number
  occurred_at: string
  payload: Record<string, unknown>
  meta?: RealtimeEventMeta
  target_user_id?: number | null
}

export type RealtimeWsMessage =
  | { op: 'connected'; user_id: number; rooms: string[] }
  | { op: 'subscribed'; rooms: string[] }
  | { op: 'event'; event: RealtimeEvent }
  | { op: 'ping' }
  | { op: 'pong' }
  | { op: 'error'; code: string; message: string }
