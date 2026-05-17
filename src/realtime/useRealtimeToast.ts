import { toast } from 'sonner'
import type { RealtimeEvent } from '@/realtime/types'

export function maybeShowRealtimeToast(event: RealtimeEvent): void {
  if (!event.meta?.show_toast) return
  const rawTitle = event.meta.toast_title ?? event.payload.title
  const title = typeof rawTitle === 'string' ? rawTitle : 'Atualização'
  const description =
    typeof event.payload.body === 'string'
      ? event.payload.body
      : typeof event.payload.message === 'string'
        ? event.payload.message
        : undefined

  if (event.meta.severity === 'critical' || event.meta.severity === 'warning') {
    toast.warning(title, { description })
    return
  }
  toast.info(title, { description })
}
