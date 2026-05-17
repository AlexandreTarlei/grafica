import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

/**
 * Barra fina no topo quando existem queries ou mutations em flight no React Query.
 */
export function GlobalFetchingBar() {
  const isFetching = useIsFetching({
    predicate: (query) =>
      !(query.meta as { silentGlobalBar?: boolean } | undefined)?.silentGlobalBar,
  })
  const isMutating = useIsMutating()

  const active = isFetching > 0 || isMutating > 0

  return (
    <div
      role="progressbar"
      aria-hidden={!active}
      className={cn(
        'pointer-events-none fixed top-0 right-0 left-0 z-[100] h-0.5 transition-opacity duration-300',
        active ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div className="bg-primary h-full w-full animate-pulse shadow-[0_0_12px_var(--color-primary)]" />
    </div>
  )
}
