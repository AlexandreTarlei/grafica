import { http } from '@/services/http/client'

export type StoreOrderListItem = {
  id: string
  numero: string
  status: string
  total: number
  currency: string
  createdAt: string
}

export type StoreOrderLine = {
  id: string
  productName: string
  sku: string | null
  quantity: number
  unitPrice: number
  subtotal: number
  widthCm?: number
  heightCm?: number
  notes?: string
  artworkAssetId?: number
}

export type StoreOrderDetail = StoreOrderListItem & {
  items: StoreOrderLine[]
  notes?: string | null
  shippingAddress?: string | null
}

export type PaginatedStoreOrders = {
  items: StoreOrderListItem[]
  total: number
  page: number
  pageSize: number
}

type OrderListItemApi = {
  id: number
  order_number: string
  status_code: string
  customer_name: string
  grand_total: number | string
  currency_code: string
  created_at: string
}

type OrderLineApi = {
  id?: number | string
  product_name?: string
  name?: string
  sku?: string | null
  quantity?: number
  quantidade?: number
  unit_price?: number | string
  subtotal?: number | string
  width_cm?: number
  height_cm?: number
  notes?: string | null
  artwork_asset_id?: number
}

type PageApi<T> = {
  items: T[]
  total: number
  skip?: number
  limit?: number
  page?: number
  page_size?: number
}

function mapOrderItem(raw: OrderListItemApi): StoreOrderListItem {
  return {
    id: String(raw.id),
    numero: raw.order_number,
    status: raw.status_code,
    total: Number(raw.grand_total),
    currency: raw.currency_code,
    createdAt: raw.created_at,
  }
}

function mapOrderLine(raw: OrderLineApi): StoreOrderLine {
  const qty = Number(raw.quantity ?? raw.quantidade ?? 1)
  const unit = Number(raw.unit_price ?? 0)
  return {
    id: String(raw.id ?? `${raw.product_name}-${qty}`),
    productName: String(raw.product_name ?? raw.name ?? 'Item'),
    sku: raw.sku ?? null,
    quantity: qty,
    unitPrice: unit,
    subtotal: Number(raw.subtotal ?? unit * qty),
    widthCm: raw.width_cm,
    heightCm: raw.height_cm,
    notes: raw.notes ?? undefined,
    artworkAssetId: raw.artwork_asset_id,
  }
}

export async function listStoreOrders(params?: {
  skip?: number
  limit?: number
}): Promise<PaginatedStoreOrders> {
  const skip = params?.skip ?? 0
  const limit = params?.limit ?? 20
  const { data } = await http.get<PageApi<OrderListItemApi>>('/orders', {
    params: { skip, limit },
  })
  return {
    items: data.items.map(mapOrderItem),
    total: data.total,
    page: Math.floor(skip / limit) + 1,
    pageSize: limit,
  }
}

export async function getStoreOrder(orderId: string): Promise<StoreOrderDetail> {
  const { data } = await http.get<Record<string, unknown>>(`/orders/${orderId}`)
  const rawLines = (data.items ?? data.lines ?? []) as OrderLineApi[]
  return {
    id: String(data.id),
    numero: String(data.order_number ?? data.id),
    status: String(data.status_code ?? 'pending'),
    total: Number(data.grand_total ?? 0),
    currency: String(data.currency_code ?? 'EUR'),
    createdAt: String(data.created_at ?? new Date().toISOString()),
    items: rawLines.map(mapOrderLine),
    notes: (data.notes as string | null) ?? null,
    shippingAddress: (data.shipping_address as string | null) ?? null,
  }
}

export const storeOrderDetailKey = (orderId: string) => ['account', 'orders', orderId] as const
