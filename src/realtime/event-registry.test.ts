import { describe, expect, it, vi } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { applyRealtimeInvalidations, listRegisteredRealtimeEvents } from '@/realtime/event-registry'
import type { RealtimeEvent } from '@/realtime/types'

describe('event-registry', () => {
  it('registers core domain events', () => {
    const names = listRegisteredRealtimeEvents()
    expect(names).toContain('orders.order.status_changed')
    expect(names).toContain('fiscal.invoice.updated')
    expect(names).toContain('financial.dashboard.updated')
  })

  it('invalidates fiscal detail query on invoice update', () => {
    const qc = new QueryClient()
    const spy = vi.spyOn(qc, 'invalidateQueries')
    const event: RealtimeEvent = {
      id: '1',
      name: 'fiscal.invoice.updated',
      module: 'fiscal',
      company_id: 1,
      occurred_at: new Date().toISOString(),
      payload: { invoice_id: 99, status: 'authorized' },
    }
    applyRealtimeInvalidations(qc, event, 1)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
