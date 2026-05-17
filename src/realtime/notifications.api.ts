import { http } from '@/services/http/client'

export type NotificationItem = {
  id: number
  company_id: number
  user_id: number | null
  category: string
  severity: string
  title: string
  body: string
  payload: Record<string, unknown> | null
  read_at: string | null
  created_at: string
}

export type NotificationsPage = {
  items: NotificationItem[]
  total: number
  skip: number
  limit: number
  has_more: boolean
}

export async function fetchNotifications(skip = 0, limit = 30): Promise<NotificationsPage> {
  const { data } = await http.get<NotificationsPage>('/notifications', {
    params: { skip, limit },
  })
  return data
}

export async function fetchUnreadCount(): Promise<number> {
  const { data } = await http.get<{ count: number }>('/notifications/unread-count')
  return data.count
}

export async function markNotificationRead(id: number): Promise<NotificationItem> {
  const { data } = await http.patch<NotificationItem>(`/notifications/${id}/read`)
  return data
}

export async function markAllNotificationsRead(): Promise<number> {
  const { data } = await http.post<{ count: number }>('/notifications/read-all')
  return data.count
}
