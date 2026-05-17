import type { CatalogSortOption } from '@/modules/signage/products/types'
import type { CatalogSort } from '@/modules/store/components/ProductFilters'

export function catalogSortToApi(sort: CatalogSort): CatalogSortOption {
  const map: Record<CatalogSort, CatalogSortOption> = {
    'name-asc': 'name_asc',
    'name-desc': 'name_desc',
    'price-asc': 'price_asc',
    'price-desc': 'price_desc',
  }
  return map[sort]
}
