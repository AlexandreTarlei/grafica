import { Skeleton } from '@/components/ui/skeleton'

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <Skeleton className="mb-6 h-4 w-48" />
      <div className="grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}
