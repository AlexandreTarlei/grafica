import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ImageIcon } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import type { SignageProduct } from '@/modules/signage/products/types'
import { formatCurrency } from '@/modules/signage/shared/utils/format'
import { ProductBadge } from '@/modules/store/components/ProductBadge'
import { cn } from '@/lib/utils'

type ProductCardProps = {
  product: SignageProduct
  className?: string
}

function ProductCardInner({ product, className }: ProductCardProps) {
  const img = product.imageUrls[0] ?? product.metadata.artworkUrl

  return (
    <Card className={cn('store-card-hover group overflow-hidden shadow-card ring-1 ring-border/60', className)}>
      <Link to={`/produtos/${product.id}`} className="block">
        <div className="bg-muted relative aspect-[4/3] overflow-hidden">
          {img ? (
            <img
              src={img}
              alt=""
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
              loading="lazy"
              decoding="async"
              width={400}
              height={300}
            />
          ) : (
            <div className="text-muted-foreground flex size-full items-center justify-center">
              <ImageIcon className="size-12 opacity-40" />
            </div>
          )}
          <ProductBadge category={product.metadata.category} />
          {product.metadata.dynamicPricing ? (
            <ProductBadge category={product.metadata.category} dynamicPricing variant="area" />
          ) : null}
        </div>
        <CardContent className="space-y-1 pt-4">
          <h3 className="text-foreground line-clamp-2 font-semibold">{product.name}</h3>
          <p className="text-muted-foreground text-xs">
            {product.metadata.widthCm}×{product.metadata.heightCm} cm
            {product.metadata.dynamicPricing ? ' · preço por área' : ''}
          </p>
        </CardContent>
        <CardFooter className="pt-0">
          <p className="text-primary text-lg font-bold">{formatCurrency(product.salePrice)}</p>
        </CardFooter>
      </Link>
    </Card>
  )
}

export const ProductCard = memo(ProductCardInner)
