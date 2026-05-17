import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toApiError } from '@/utils/api-error'

function reportGlobalError(error: unknown): void {
  const { message } = toApiError(error)
  toast.error(message)
}

function isSilentGlobalToast(meta: unknown): boolean {
  return Boolean((meta as { silentGlobalToast?: boolean } | undefined)?.silentGlobalToast)
}

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (isSilentGlobalToast(query.meta)) return
        reportGlobalError(error)
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _v, _c, mutation) => {
        if (isSilentGlobalToast(mutation.meta)) return
        reportGlobalError(error)
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })
}
