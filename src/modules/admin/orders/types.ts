export type AdminOrderStatus =
  | 'pendente'
  | 'confirmado'
  | 'em_preparacao'
  | 'enviado'
  | 'entregue'
  | 'cancelado'

export type AdminOrderListItem = {
  id: string
  numero: string
  clienteNome: string
  total: number
  status: AdminOrderStatus
  createdAt: string
}

export type AdminOrderLine = {
  id: string
  nomeProduto: string
  sku: string
  quantidade: number
  precoUnitario: number
  subtotal: number
}

export type AdminOrderStatusEvent = {
  id: string
  status: AdminOrderStatus
  nota: string | null
  createdAt: string
  autor?: string | null
}

export type AdminOrderDetail = AdminOrderListItem & {
  linhas: AdminOrderLine[]
  historico: AdminOrderStatusEvent[]
}

export type AdminOrderListParams = {
  page: number
  pageSize: number
  search: string
  status: AdminOrderStatus | ''
  dateFrom: string
  dateTo: string
}

export type PaginatedAdminOrders = {
  items: AdminOrderListItem[]
  total: number
}
