import { Badge } from '@/components/ui/badge'
import { SIGNAGE_CATEGORY_LABELS } from '@/modules/signage/products/types'
import type { SignageProductCategory } from '@/modules/signage/products/types'
import { cn } from '@/lib/utils'

type ProductBadgeProps = {
  category: SignageProductCategory
  dynamicPricing?: boolean
  variant?: 'category' | 'new' | 'area'
  className?: string
}

export function ProductBadge({ category, dynamicPricing, variant = 'category', className }: ProductBadgeProps) {
  if (variant === 'new') {
    return (
      <Badge className={cn('absolute top-2 right-2', className)} variant="default">
        Novo
      </Badge>
    )
  }
  if (variant === 'area' || dynamicPricing) {
    return (
      <Badge className={cn('absolute top-2 right-2', className)} variant="outline">
        Por área
      </Badge>
    )
  }
  return (
    <Badge className={cn('absolute top-2 left-2', className)} variant="secondary">
      {SIGNAGE_CATEGORY_LABELS[category]}
    </Badge>
  )
}
