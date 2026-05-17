import type { QueryClient } from '@tanstack/react-query'
import { fiscalInvoiceDetailQueryKey } from '@/modules/admin/fiscal/hooks/useFiscalInvoiceDetail'
import type { RealtimeEvent } from '@/realtime/types'

type InvalidationRule = {
  queryKeys: (event: RealtimeEvent, companyId: number | null) => readonly unknown[][]
}

const rules: Record<string, InvalidationRule> = {
  'orders.order.created': {
    queryKeys: () => [['admin', 'orders', 'list']],
  },
  'orders.order.status_changed': {
    queryKeys: (event, companyId) => {
      const orderId = event.payload.order_id
      const keys: readonly unknown[][] = [['admin', 'orders', 'list']]
      if (typeof orderId === 'number' && companyId != null) {
        return [...keys, ['admin', 'orders', 'detail', companyId, orderId]]
      }
      return keys
    },
  },
  'orders.payment.status_changed': {
    queryKeys: (event, companyId) => {
      const orderId = event.payload.order_id
      const keys: readonly unknown[][] = [['admin', 'orders', 'list']]
      if (typeof orderId === 'number' && companyId != null) {
        return [...keys, ['admin', 'orders', 'detail', companyId, orderId]]
      }
      return keys
    },
  },
  'financial.dashboard.updated': {
    queryKeys: (_event, companyId) => {
      if (companyId == null) return [['admin', 'financial']]
      return [['admin', 'financial', 'kpis', companyId]]
    },
  },
  'financial.receivable.paid': {
    queryKeys: (_event, companyId) => {
      if (companyId == null) return [['admin', 'financial']]
      return [
        ['admin', 'financial', 'kpis', companyId],
        ['admin', 'financial', 'receivables', companyId],
      ]
    },
  },
  'contracts.contract.created': {
    queryKeys: () => [['admin', 'contracts']],
  },
  'inventory.stock.updated': {
    queryKeys: () => [
      ['admin', 'products'],
      ['signage', 'products'],
      ['catalog', 'products'],
    ],
  },
  'fiscal.invoice.updated': {
    queryKeys: (event, companyId) => {
      const invoiceId = event.payload.invoice_id
      const keys: readonly unknown[][] = [['admin', 'fiscal', 'invoices']]
      if (typeof invoiceId === 'number' && companyId != null) {
        return [...keys, [...fiscalInvoiceDetailQueryKey(companyId, invoiceId)]]
      }
      return keys
    },
  },
  'notifications.notification.created': {
    queryKeys: () => [['notifications']],
  },
}

export function applyRealtimeInvalidations(
  queryClient: QueryClient,
  event: RealtimeEvent,
  companyId: number | null,
): void {
  const rule = rules[event.name]
  if (!rule) return
  for (const key of rule.queryKeys(event, companyId)) {
    void queryClient.invalidateQueries({ queryKey: key })
  }
}

export function listRegisteredRealtimeEvents(): string[] {
  return Object.keys(rules)
}
