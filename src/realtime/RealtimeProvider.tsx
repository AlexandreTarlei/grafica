import { useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { env } from '@/core/env'
import { useAuth } from '@/hooks/useAuth'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { RealtimeClient } from '@/realtime/client'
import { applyRealtimeInvalidations } from '@/realtime/event-registry'
import { maybeShowRealtimeToast } from '@/realtime/useRealtimeToast'
import type { RealtimeEvent, RealtimeWsMessage } from '@/realtime/types'

type RealtimeContextValue = {
  connected: boolean
}

const RealtimeContext = createContext<RealtimeContextValue>({ connected: false })

export function useRealtime() {
  return useContext(RealtimeContext)
}

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated } = useAuth()
  const companyId = useCurrentCompanyId()
  const queryClient = useQueryClient()
  const clientRef = useRef<RealtimeClient | null>(null)
  const connectedRef = useRef(false)

  useEffect(() => {
    if (!env.realtimeEnabled || !isAuthenticated || !token) {
      clientRef.current?.disconnect()
      clientRef.current = null
      connectedRef.current = false
      return
    }

    const client = new RealtimeClient({
      token,
      onStateChange: (state) => {
        connectedRef.current = state === 'open'
      },
      onMessage: (msg: RealtimeWsMessage) => {
        if (msg.op !== 'event') return
        const event = msg.event as RealtimeEvent
        applyRealtimeInvalidations(queryClient, event, companyId)
        maybeShowRealtimeToast(event)
        if (event.name === 'notifications.notification.created') {
          void queryClient.invalidateQueries({ queryKey: ['notifications'] })
        }
      },
    })

    clientRef.current = client
    client.connect()

    return () => {
      client.disconnect()
      clientRef.current = null
      connectedRef.current = false
    }
  }, [token, isAuthenticated, companyId, queryClient])

  return (
    <RealtimeContext.Provider value={{ connected: connectedRef.current }}>
      {children}
    </RealtimeContext.Provider>
  )
}
