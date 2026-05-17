/**
 * Produtos: API real em /companies/{id}/products (FastAPI).
 * Metadados signage serializados em description com prefixo __signage__: até campo dedicado no backend.
 */
import { http } from '@/services/http/client'
import { companyApiPath } from '@/modules/signage/shared/services/company-path'
import {
  decodeMetadata,
  defaultMetadata,
  encodeMetadata,
  type PaginatedSignageProducts,
  type SignageProduct,
  type SignageProductFormValues,
  type SignageProductListParams,
} from '@/modules/signage/products/types'

const USE_MOCK = import.meta.env.VITE_USE_SIGNAGE_PRODUCTS_MOCK !== 'false'

async function mockDelay(): Promise<void> {
  await new Promise((r) => setTimeout(r, 300))
}

let mockStore: SignageProduct[] = [
  {
    id: 1,
    name: 'Banner 3x1 Promocional',
    sku: 'BNR-3X1',
    description: null,
    salePrice: 450,
    active: true,
    categoryId: null,
    metadata: defaultMetadata('banner'),
    imageUrls: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

function mapApiProduct(raw: Record<string, unknown>): SignageProduct {
  const description = (raw.description as string | null) ?? null
  const meta = decodeMetadata(description) ?? defaultMetadata()
  return {
    id: Number(raw.id),
    name: String(raw.name ?? ''),
    sku: String(raw.sku ?? ''),
    description,
    salePrice: Number(raw.sale_price ?? raw.salePrice ?? 0),
    active: Boolean(raw.active ?? raw.status === 'active'),
    categoryId: raw.category_id != null ? Number(raw.category_id) : null,
    metadata: meta,
    imageUrls: Array.isArray(raw.image_urls) ? (raw.image_urls as string[]) : [],
    createdAt: String(raw.created_at ?? raw.createdAt ?? new Date().toISOString()),
    updatedAt: String(raw.updated_at ?? raw.updatedAt ?? new Date().toISOString()),
  }
}

function toCreateBody(values: SignageProductFormValues) {
  return {
    name: values.name,
    sku: values.sku,
    sale_price: values.salePrice,
    active: values.active,
    category_id: values.categoryId,
    description: encodeMetadata(values.metadata),
    stock_quantity: 0,
    minimum_stock: 0,
  }
}

function filterMock(items: SignageProduct[], params: SignageProductListParams): SignageProduct[] {
  let out = [...items]
  if (params.search) {
    const q = params.search.toLowerCase()
    out = out.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
  }
  if (params.category) out = out.filter((p) => p.metadata.category === params.category)
  if (params.active === true) out = out.filter((p) => p.active)
  if (params.active === false) out = out.filter((p) => !p.active)
  return out
}

export async function listSignageProducts(
  companyId: number,
  params: SignageProductListParams = {},
): Promise<PaginatedSignageProducts> {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 10

  if (USE_MOCK) {
    await mockDelay()
    const filtered = filterMock(mockStore, params)
    const start = (page - 1) * pageSize
    return { items: filtered.slice(start, start + pageSize), total: filtered.length }
  }

  const { data } = await http.get<unknown>(companyApiPath(companyId, 'products'), {
    params: { page, page_size: pageSize, search: params.search || undefined },
  })
  const o = data as Record<string, unknown>
  const items = ((o.items ?? o.data) as unknown[]) ?? []
  const total = Number(o.total ?? items.length)
  return {
    items: items.map((row) => mapApiProduct(row as Record<string, unknown>)),
    total,
  }
}

export async function getSignageProduct(companyId: number, productId: number): Promise<SignageProduct> {
  if (USE_MOCK) {
    await mockDelay()
    const found = mockStore.find((p) => p.id === productId)
    if (!found) throw new Error('Produto não encontrado')
    return found
  }
  const { data } = await http.get<unknown>(`${companyApiPath(companyId, 'products')}/${productId}`)
  return mapApiProduct(data as Record<string, unknown>)
}

export async function createSignageProduct(
  companyId: number,
  values: SignageProductFormValues,
): Promise<SignageProduct> {
  if (USE_MOCK) {
    await mockDelay()
    const created: SignageProduct = {
      id: mockStore.length + 1,
      name: values.name,
      sku: values.sku,
      description: encodeMetadata(values.metadata),
      salePrice: values.salePrice,
      active: values.active,
      categoryId: values.categoryId,
      metadata: values.metadata,
      imageUrls: values.metadata.artworkUrl ? [values.metadata.artworkUrl] : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockStore = [...mockStore, created]
    return created
  }
  const { data } = await http.post<unknown>(companyApiPath(companyId, 'products'), toCreateBody(values))
  return mapApiProduct(data as Record<string, unknown>)
}

export async function updateSignageProduct(
  companyId: number,
  productId: number,
  values: SignageProductFormValues,
): Promise<SignageProduct> {
  if (USE_MOCK) {
    await mockDelay()
    mockStore = mockStore.map((p) =>
      p.id === productId
        ? {
            ...p,
            ...values,
            description: encodeMetadata(values.metadata),
            metadata: values.metadata,
            updatedAt: new Date().toISOString(),
          }
        : p,
    )
    return getSignageProduct(companyId, productId)
  }
  const { data } = await http.patch<unknown>(
    `${companyApiPath(companyId, 'products')}/${productId}`,
    toCreateBody(values),
  )
  return mapApiProduct(data as Record<string, unknown>)
}

export const signageProductsListKey = (companyId: number | null, params: SignageProductListParams) =>
  ['signage', 'products', companyId, params] as const

export const signageProductDetailKey = (companyId: number | null, productId: number) =>
  ['signage', 'products', companyId, productId] as const
