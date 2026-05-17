import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/realtime/notifications.api'
import { useAuth } from '@/hooks/useAuth'

export const notificationsQueryKey = ['notifications'] as const

export function useUnreadNotificationsCount() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: [...notificationsQueryKey, 'unread'],
    queryFn: fetchUnreadCount,
    enabled: isAuthenticated,
    staleTime: 15_000,
    refetchInterval: (q) => (q.state.data != null ? 60_000 : false),
  })
}

export function useNotificationsList(limit = 30) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: [...notificationsQueryKey, 'list', limit],
    queryFn: () => fetchNotifications(0, limit),
    enabled: isAuthenticated,
    staleTime: 10_000,
  })
}

export function useNotificationMutations() {
  const qc = useQueryClient()
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: notificationsQueryKey })
  }

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: invalidate,
  })

  const markAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: invalidate,
  })

  return { markRead, markAll }
}
