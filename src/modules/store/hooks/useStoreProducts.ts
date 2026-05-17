import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  listStoreCatalogProducts,
  storeCatalogListKey,
} from '@/modules/store/services/store-catalog.api'
import type { SignageProductListParams } from '@/modules/signage/products/types'

export function useStoreProducts(params: SignageProductListParams = {}) {
  return useQuery({
    queryKey: storeCatalogListKey({ ...params, active: true }),
    queryFn: () =>
      listStoreCatalogProducts({
        ...params,
        active: true,
        pageSize: params.pageSize ?? 24,
        page: params.page ?? 1,
      }),
    placeholderData: keepPreviousData,
  })
}
