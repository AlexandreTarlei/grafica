import type { SignageProduct } from '@/modules/signage/products/types'
import type { CatalogSort } from '@/modules/store/components/ProductFilters'

export function sortCatalogProducts(items: SignageProduct[], sort: CatalogSort): SignageProduct[] {
  const copy = [...items]
  switch (sort) {
    case 'name-desc':
      return copy.sort((a, b) => b.name.localeCompare(a.name, 'pt'))
    case 'price-asc':
      return copy.sort((a, b) => a.salePrice - b.salePrice)
    case 'price-desc':
      return copy.sort((a, b) => b.salePrice - a.salePrice)
    case 'name-asc':
    default:
      return copy.sort((a, b) => a.name.localeCompare(b.name, 'pt'))
  }
}
