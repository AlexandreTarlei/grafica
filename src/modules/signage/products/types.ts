export const SIGNAGE_PRODUCT_CATEGORIES = [
  'banner',
  'lona',
  'fachada',
  'acm',
  'adesivo',
  'cartao',
  'envelopamento',
  'wind_banner',
  'luminoso',
  'letra_caixa',
  'brindes',
] as const

export type SignageProductCategory = (typeof SIGNAGE_PRODUCT_CATEGORIES)[number]

export const SIGNAGE_CATEGORY_LABELS: Record<SignageProductCategory, string> = {
  banner: 'Banner',
  lona: 'Lona',
  fachada: 'Fachada',
  acm: 'ACM',
  adesivo: 'Adesivo',
  cartao: 'Cartão',
  envelopamento: 'Envelopamento',
  wind_banner: 'Wind banner',
  luminoso: 'Luminoso',
  letra_caixa: 'Letra caixa',
  brindes: 'Brindes',
}

export type SignageProductMetadata = {
  category: SignageProductCategory
  widthCm: number
  heightCm: number
  depthCm?: number
  materials: string[]
  finishes: string[]
  artworkUrl?: string
  dynamicPricing?: boolean
}

export type SignageProduct = {
  id: number
  name: string
  sku: string
  description: string | null
  salePrice: number
  active: boolean
  categoryId: number | null
  metadata: SignageProductMetadata
  imageUrls: string[]
  createdAt: string
  updatedAt: string
}

export type CatalogSortOption = 'relevance' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'

export type SignageProductListParams = {
  search?: string
  category?: SignageProductCategory | ''
  active?: boolean | ''
  page?: number
  pageSize?: number
  sort?: CatalogSortOption
}

export type PaginatedSignageProducts = {
  items: SignageProduct[]
  total: number
}

export type SignageCategory = {
  id: number
  name: string
  slug: string
}

export type SignageProductFormValues = {
  name: string
  sku: string
  salePrice: number
  active: boolean
  categoryId: number | null
  metadata: SignageProductMetadata
}

export const METADATA_PREFIX = '__signage__:'

export function encodeMetadata(meta: SignageProductMetadata): string {
  return `${METADATA_PREFIX}${JSON.stringify(meta)}`
}

export function decodeMetadata(description: string | null | undefined): SignageProductMetadata | null {
  if (!description?.startsWith(METADATA_PREFIX)) return null
  try {
    return JSON.parse(description.slice(METADATA_PREFIX.length)) as SignageProductMetadata
  } catch {
    return null
  }
}

export function defaultMetadata(category: SignageProductCategory = 'banner'): SignageProductMetadata {
  return {
    category,
    widthCm: 100,
    heightCm: 50,
    materials: [],
    finishes: [],
    dynamicPricing: true,
  }
}
