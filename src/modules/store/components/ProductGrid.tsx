import type { ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import type { SignageProduct } from '@/modules/signage/products/types'
import { ProductCard } from '@/modules/store/components/ProductCard'
import { cn } from '@/lib/utils'

const GRID = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

type ProductGridProps = {
  products?: SignageProduct[]
  loading?: boolean
  skeletonCount?: number
  empty?: ReactNode
  className?: string
}

export function ProductGrid({
  products,
  loading,
  skeletonCount = 8,
  empty,
  className,
}: ProductGridProps) {
  if (loading) {
    return <ProductGridSkeleton count={skeletonCount} className={className} />
  }
  if (!products?.length) {
    return empty ? <>{empty}</> : null
  }
  return (
    <div className={cn(GRID, className)}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}


export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div className={cn(GRID, className)} aria-busy aria-label="A carregar produtos">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      ))}
    </div>
  )
}
