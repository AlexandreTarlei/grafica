/**
 * Catálogo público da loja — GET /catalog/products (sem JWT).
 */
import { http } from '@/services/http/client'
import {
  decodeMetadata,
  defaultMetadata,
  type PaginatedSignageProducts,
  type SignageProduct,
  type SignageProductListParams,
} from '@/modules/signage/products/types'

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

export async function listStoreCatalogProducts(
  params: SignageProductListParams = {},
): Promise<PaginatedSignageProducts> {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 10
  const skip = (page - 1) * pageSize

  const { data } = await http.get<unknown>('/catalog/products', {
    params: {
      skip,
      limit: pageSize,
      q: params.search || undefined,
      category: params.category || undefined,
      sort: params.sort && params.sort !== 'relevance' ? params.sort : undefined,
      active: true,
    },
  })
  const o = data as Record<string, unknown>
  const items = ((o.items ?? o.data) as unknown[]) ?? []
  const total = Number(o.total ?? items.length)
  return {
    items: items.map((row) => mapApiProduct(row as Record<string, unknown>)),
    total,
  }
}

export async function getStoreCatalogProduct(productId: number): Promise<SignageProduct> {
  const { data } = await http.get<unknown>(`/catalog/products/${productId}`)
  return mapApiProduct(data as Record<string, unknown>)
}

export const storeCatalogListKey = (params: SignageProductListParams) =>
  ['store', 'catalog', params] as const

export const storeCatalogDetailKey = (productId: number) => ['store', 'catalog', productId] as const
