/**
 * Contrato esperado (FastAPI) — ajuste os paths ao backend real:
 * - GET  /admin/orders?skip&limit&search&status&date_from&date_to
 * - GET  /admin/orders/{id}
 * - PATCH /admin/orders/{id}/status  body: { status, nota? }
 */
import { http } from '@/services/http/client'
import { companyApiPath } from '@/modules/signage/shared/services/company-path'
import type {
  AdminOrderDetail,
  AdminOrderListItem,
  AdminOrderListParams,
  AdminOrderStatus,
  PaginatedAdminOrders,
} from '@/modules/admin/orders/types'

const API_STATUS_TO_UI: Record<string, AdminOrderStatus> = {
  pending: 'pendente',
  paid: 'confirmado',
  processing: 'em_preparacao',
  shipped: 'enviado',
  delivered: 'entregue',
  canceled: 'cancelado',
}

const UI_STATUS_TO_API: Record<AdminOrderStatus, string> = {
  pendente: 'pending',
  confirmado: 'paid',
  em_preparacao: 'processing',
  enviado: 'shipped',
  entregue: 'delivered',
  cancelado: 'canceled',
}

function mapListItem(raw: Record<string, unknown>): AdminOrderListItem {
  const statusCode = String(raw.status_code ?? raw.status ?? 'pending')
  return {
    id: String(raw.id),
    numero: String(raw.order_number ?? raw.numero ?? raw.id),
    clienteNome: String(raw.customer_name ?? raw.clienteNome ?? ''),
    total: Number(raw.grand_total ?? raw.total ?? 0),
    status: API_STATUS_TO_UI[statusCode] ?? 'pendente',
    createdAt: String(raw.created_at ?? raw.createdAt ?? new Date().toISOString()),
  }
}

function mapDetail(raw: Record<string, unknown>): AdminOrderDetail {
  const base = mapListItem(raw)
  const items = (raw.items ?? raw.linhas ?? []) as Record<string, unknown>[]
  return {
    ...base,
    linhas: items.map((line, i) => ({
      id: String(line.id ?? i),
      nomeProduto: String(line.product_name_snapshot ?? line.nomeProduto ?? ''),
      sku: String(line.sku_snapshot ?? line.sku ?? ''),
      quantidade: Number(line.quantity ?? line.quantidade ?? 0),
      precoUnitario: Number(line.unit_price ?? line.precoUnitario ?? 0),
      subtotal: Number(line.line_total ?? line.subtotal ?? 0),
    })),
    historico: [
      {
        id: 'h-init',
        status: base.status,
        nota: null,
        createdAt: base.createdAt,
        autor: 'sistema',
      },
    ],
  }
}

const USE_MOCK = import.meta.env.VITE_USE_ORDER_MOCK !== 'false'

const MOCK_ITEMS: PaginatedAdminOrders['items'] = [
  {
    id: '1',
    numero: 'PED-2026-0001',
    clienteNome: 'Ana Silva',
    total: 129.9,
    status: 'pendente',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    numero: 'PED-2026-0002',
    clienteNome: 'Bruno Costa',
    total: 59.5,
    status: 'confirmado',
    createdAt: new Date().toISOString(),
  },
]

async function mockDelay(): Promise<void> {
  await new Promise((r) => setTimeout(r, 350))
}

function filterMock(
  items: PaginatedAdminOrders['items'],
  p: AdminOrderListParams,
): PaginatedAdminOrders['items'] {
  return items.filter((row) => {
    if (p.status && row.status !== p.status) return false
    if (p.search) {
      const q = p.search.toLowerCase()
      if (
        !row.numero.toLowerCase().includes(q) &&
        !row.clienteNome.toLowerCase().includes(q) &&
        !row.id.includes(q)
      ) {
        return false
      }
    }
    return true
  })
}

export async function listAdminOrders(
  companyId: number,
  params: AdminOrderListParams,
): Promise<PaginatedAdminOrders> {
  const skip = (params.page - 1) * params.pageSize
  if (USE_MOCK) {
    await mockDelay()
    const filtered = filterMock(MOCK_ITEMS, params)
    const slice = filtered.slice(skip, skip + params.pageSize)
    return { items: slice, total: filtered.length }
  }
  const { data } = await http.get<unknown>(companyApiPath(companyId, 'orders'), {
    params: {
      page: params.page,
      page_size: params.pageSize,
    },
  })
  const o = data as Record<string, unknown>
  const items = ((o.items ?? o.data) as unknown[]) ?? []
  const total = Number(o.total ?? items.length)
  return {
    items: items.map((row) => mapListItem(row as Record<string, unknown>)),
    total,
  }
}

const MOCK_DETAILS: Record<string, AdminOrderDetail> = {
  '1': {
    id: '1',
    numero: 'PED-2026-0001',
    clienteNome: 'Ana Silva',
    total: 129.9,
    status: 'pendente',
    createdAt: new Date().toISOString(),
    linhas: [
      {
        id: 'l1',
        nomeProduto: 'Camisola básica',
        sku: 'SKU-001',
        quantidade: 2,
        precoUnitario: 49.95,
        subtotal: 99.9,
      },
      {
        id: 'l2',
        nomeProduto: 'Portes',
        sku: 'ENVIO',
        quantidade: 1,
        precoUnitario: 30,
        subtotal: 30,
      },
    ],
    historico: [
      {
        id: 'h1',
        status: 'pendente',
        nota: null,
        createdAt: new Date().toISOString(),
        autor: 'sistema',
      },
    ],
  },
  '2': {
    id: '2',
    numero: 'PED-2026-0002',
    clienteNome: 'Bruno Costa',
    total: 59.5,
    status: 'confirmado',
    createdAt: new Date().toISOString(),
    linhas: [
      {
        id: 'l3',
        nomeProduto: 'Boné',
        sku: 'SKU-044',
        quantidade: 1,
        precoUnitario: 59.5,
        subtotal: 59.5,
      },
    ],
    historico: [
      {
        id: 'h2',
        status: 'pendente',
        nota: null,
        createdAt: new Date().toISOString(),
        autor: 'sistema',
      },
      {
        id: 'h3',
        status: 'confirmado',
        nota: 'Pagamento confirmado',
        createdAt: new Date().toISOString(),
        autor: 'admin',
      },
    ],
  },
}

export async function getAdminOrder(companyId: number, id: string): Promise<AdminOrderDetail> {
  if (USE_MOCK) {
    await mockDelay()
    const hit = MOCK_DETAILS[id]
    if (hit) return { ...hit }
    const row = MOCK_ITEMS.find((x) => x.id === id)
    if (row) {
      return {
        ...row,
        linhas: [],
        historico: [
          {
            id: 'h0',
            status: row.status,
            nota: null,
            createdAt: row.createdAt,
            autor: 'sistema',
          },
        ],
      }
    }
    throw new Error('Pedido não encontrado')
  }
  const { data } = await http.get<unknown>(`${companyApiPath(companyId, 'orders')}/${id}`)
  return mapDetail(data as Record<string, unknown>)
}

export async function patchAdminOrderStatus(
  companyId: number,
  id: string,
  body: { status: AdminOrderStatus; nota?: string },
): Promise<AdminOrderDetail> {
  if (USE_MOCK) {
    await mockDelay()
    let base = MOCK_DETAILS[id]
    if (!base) {
      const row = MOCK_ITEMS.find((x) => x.id === id)
      if (!row) throw new Error('Pedido não encontrado')
      base = {
        ...row,
        linhas: [],
        historico: [
          {
            id: 'h0',
            status: row.status,
            nota: null,
            createdAt: row.createdAt,
            autor: 'sistema',
          },
        ],
      }
      MOCK_DETAILS[id] = base
    }
    const updated: AdminOrderDetail = {
      ...base,
      status: body.status,
      historico: [
        {
          id: `h-${Date.now()}`,
          status: body.status,
          nota: body.nota ?? null,
          createdAt: new Date().toISOString(),
          autor: 'admin',
        },
        ...base.historico,
      ],
    }
    MOCK_DETAILS[id] = updated
    const idx = MOCK_ITEMS.findIndex((x) => x.id === id)
    if (idx >= 0) MOCK_ITEMS[idx] = { ...MOCK_ITEMS[idx], status: body.status }
    return updated
  }
  const { data } = await http.put<unknown>(`${companyApiPath(companyId, 'orders')}/${id}/status`, {
    status: UI_STATUS_TO_API[body.status],
    note: body.nota,
  })
  return mapDetail(data as Record<string, unknown>)
}
