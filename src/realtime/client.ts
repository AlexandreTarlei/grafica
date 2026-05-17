import { env } from '@/core/env'
import type { RealtimeWsMessage } from '@/realtime/types'

export type RealtimeClientOptions = {
  token: string
  onMessage: (msg: RealtimeWsMessage) => void
  onStateChange?: (state: 'connecting' | 'open' | 'closed') => void
}

function buildWsUrl(token: string): string {
  const apiBase = (env.apiUrl || '/api/v1').replace(/\/$/, '')
  const path = `${apiBase}/realtime/ws`
  const params = `token=${encodeURIComponent(token)}`

  if (path.startsWith('http://') || path.startsWith('https://')) {
    const url = new URL(path)
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
    url.search = params
    return url.toString()
  }

  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${window.location.host}${path}?${params}`
}

export class RealtimeClient {
  private ws: WebSocket | null = null
  private reconnectAttempt = 0
  private stopped = false
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null

  constructor(private readonly options: RealtimeClientOptions) {}

  connect(): void {
    if (!env.realtimeEnabled || this.stopped) return
    this.options.onStateChange?.('connecting')
    const url = buildWsUrl(this.options.token)
    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      this.reconnectAttempt = 0
      this.options.onStateChange?.('open')
    }

    this.ws.onmessage = (ev) => {
      try {
        const parsed = JSON.parse(String(ev.data)) as RealtimeWsMessage
        if (parsed.op === 'ping') {
          this.send({ op: 'pong' })
          return
        }
        this.options.onMessage(parsed)
      } catch {
        /* ignore malformed */
      }
    }

    this.ws.onclose = () => {
      this.options.onStateChange?.('closed')
      this.scheduleReconnect()
    }

    this.ws.onerror = () => {
      this.ws?.close()
    }
  }

  private scheduleReconnect(): void {
    if (this.stopped) return
    const delay = Math.min(30_000, 1_000 * 2 ** this.reconnectAttempt)
    this.reconnectAttempt += 1
    this.reconnectTimer = setTimeout(() => this.connect(), delay)
  }

  send(payload: Record<string, unknown>): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload))
    }
  }

  disconnect(): void {
    this.stopped = true
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.ws?.close()
    this.ws = null
  }
}
