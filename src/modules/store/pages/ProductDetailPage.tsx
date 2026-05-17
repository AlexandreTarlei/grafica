import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MessageCircle, ShoppingCart, Star } from 'lucide-react'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { env } from '@/core/env'
import { Section } from '@/modules/commercial/components/Section'
import { useCartMutations } from '@/modules/ecommerce/cart/hooks/useCartMutations'
import { SIGNAGE_CATEGORY_LABELS } from '@/modules/signage/products/types'
import { ArtworkPreview } from '@/modules/signage/shared/components/ArtworkPreview'
import {
  FileDropzone,
  type DroppedFile,
} from '@/modules/signage/shared/components/FileDropzone'
import { formatCurrency } from '@/modules/signage/shared/utils/format'
import { calculateLineSubtotal } from '@/modules/signage/shared/utils/pricing'
import { useCartDrawer } from '@/modules/store/components/cart-drawer-context'
import { ProductDetailSkeleton } from '@/modules/store/components/ProductDetailSkeleton'
import { ProductGallery } from '@/modules/store/components/ProductGallery'
import { ProductGrid } from '@/modules/store/components/ProductGrid'
import { storeHomeContent } from '@/modules/store/content/ecommerce-content'
import { useStoreProducts } from '@/modules/store/hooks/useStoreProducts'
import {
  getStoreCatalogProduct,
  storeCatalogDetailKey,
} from '@/modules/store/services/store-catalog.api'
import { uploadArtFile } from '@/modules/store/services/uploads.api'
import { cn } from '@/lib/utils'

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const id = Number(productId)
  const { addItem } = useCartMutations()
  const { openCart } = useCartDrawer()
  const [width, setWidth] = useState(100)
  const [height, setHeight] = useState(100)
  const [qty, setQty] = useState(1)
  const [notes, setNotes] = useState('')
  const [artFiles, setArtFiles] = useState<DroppedFile[]>([])
  const [uploadingArt, setUploadingArt] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: storeCatalogDetailKey(id),
    queryFn: () => getStoreCatalogProduct(id),
    enabled: Number.isFinite(id) && id > 0,
  })

  const relatedParams = useMemo(
    () => ({
      category: data?.metadata.category,
      pageSize: 5,
    }),
    [data?.metadata.category],
  )
  const { data: relatedData, isLoading: relatedLoading } = useStoreProducts(relatedParams)

  const related = useMemo(
    () => (relatedData?.items ?? []).filter((p) => p.id !== id).slice(0, 4),
    [relatedData?.items, id],
  )

  const livePrice = useMemo(() => {
    if (!data) return 0
    if (data.metadata.dynamicPricing) {
      return calculateLineSubtotal({
        category: data.metadata.category,
        widthCm: width,
        heightCm: height,
        quantity: qty,
        unitPrice: data.salePrice,
      })
    }
    return data.salePrice * qty
  }, [data, width, height, qty])

  const artPreviewUrl = useMemo(() => {
    const first = artFiles[0]
    if (!first?.previewUrl || first.previewUrl === 'pdf') return data?.metadata.artworkUrl
    return first.previewUrl
  }, [artFiles, data?.metadata.artworkUrl])

  const handleAddToCart = async () => {
    if (!data) return
    let artworkAssetId: number | undefined
    if (artFiles.length > 0) {
      setUploadingArt(true)
      try {
        const uploaded = await uploadArtFile(artFiles[0].file, 'cart_line')
        artworkAssetId = uploaded.id
      } catch {
        if (import.meta.env.VITE_USE_CART_MOCK === 'false') {
          toast.error('Não foi possível enviar a arte. Tente novamente.')
          setUploadingArt(false)
          return
        }
        toast.message('Arte não enviada (modo demo); item adicionado sem ficheiro.')
      }
      setUploadingArt(false)
    }
    addItem.mutate(
      {
        productId: String(data.id),
        quantidade: qty,
        widthCm: data.metadata.dynamicPricing ? width : undefined,
        heightCm: data.metadata.dynamicPricing ? height : undefined,
        notes: notes.trim() || undefined,
        artworkAssetId,
      },
      {
        onSuccess: () => {
          toast.success('Adicionado ao carrinho')
          openCart()
        },
      },
    )
  }

  const cartBusy = addItem.isPending || uploadingArt

  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center md:px-6">
        <p className="text-muted-foreground">Produto não encontrado.</p>
        <Link to="/produtos" className={cn(buttonVariants({ variant: 'link' }), 'mt-4')}>
          Voltar
        </Link>
      </div>
    )
  }

  const images = [
    ...data.imageUrls,
    ...(data.metadata.artworkUrl && !data.imageUrls.includes(data.metadata.artworkUrl)
      ? [data.metadata.artworkUrl]
      : []),
  ]
  const waPhone = env.whatsappPhone?.replace(/\D/g, '')
  const waHref = waPhone
    ? `https://wa.me/${waPhone}?text=${encodeURIComponent(`Olá! Interesse em: ${data.name}`)}`
    : null

  return (
    <div className="pb-24 lg:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <nav className="text-muted-foreground mb-6 text-sm">
          <Link to="/produtos" className="hover:text-foreground">
            Produtos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{data.name}</span>
        </nav>
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={images} alt={data.name} />
          <div className="space-y-6">
            <div>
              <p className="text-primary text-sm font-medium">
                {SIGNAGE_CATEGORY_LABELS[data.metadata.category]}
              </p>
              <h1 className="text-3xl font-bold">{data.name}</h1>
              <p className="text-muted-foreground text-sm">SKU {data.sku}</p>
            </div>
            <p className="text-3xl font-bold text-primary">{formatCurrency(livePrice)}</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Largura (cm)</Label>
                <Input type="number" min={1} value={width} onChange={(e) => setWidth(Number(e.target.value))} />
              </div>
              <div>
                <Label>Altura (cm)</Label>
                <Input type="number" min={1} value={height} onChange={(e) => setHeight(Number(e.target.value))} />
              </div>
              <div>
                <Label>Qtd</Label>
                <Input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
              </div>
            </div>
            {data.metadata.materials.length > 0 && (
              <p className="text-sm">
                <strong>Materiais:</strong> {data.metadata.materials.join(', ')}
              </p>
            )}
            {data.metadata.finishes.length > 0 && (
              <p className="text-sm">
                <strong>Acabamentos:</strong> {data.metadata.finishes.join(', ')}
              </p>
            )}
            <div>
              <Label>Observações</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            </div>
            <div>
              <Label>Upload de arte</Label>
              <FileDropzone
                accept="images-pdf"
                multiple={false}
                value={artFiles}
                onChange={setArtFiles}
              />
            </div>
            {(data.metadata.dynamicPricing || artPreviewUrl) && (
              <div>
                <Label className="mb-2 block">Pré-visualização</Label>
                <ArtworkPreview
                  widthCm={width}
                  heightCm={height}
                  imageUrl={artPreviewUrl}
                  className="max-w-md"
                />
              </div>
            )}
            <div className="hidden flex-wrap gap-3 lg:flex">
              <Button type="button" onClick={() => void handleAddToCart()} disabled={cartBusy}>
                <ShoppingCart className="size-4" /> Adicionar ao carrinho
              </Button>
              <Link to="/orcamento" className={cn(buttonVariants({ variant: 'outline' }))}>
                Pedir orçamento
              </Link>
              {waHref ? (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: 'secondary' }), 'gap-2')}
                >
                  <MessageCircle className="size-4" /> WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <Section title="Também pode gostar" className="mt-16">
          <ProductGrid products={related} loading={relatedLoading} skeletonCount={4} />
        </Section>

        <Section title={storeHomeContent.reviewsTitle} className="mt-12">
          <div className="grid gap-4 md:grid-cols-3">
            {storeHomeContent.reviews.map((r) => (
              <blockquote key={r.name} className="border-border bg-card rounded-xl border p-5 shadow-card">
                <div className="mb-2 flex gap-0.5">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <footer className="mt-3 text-sm font-medium">{r.name}</footer>
              </blockquote>
            ))}
          </div>
        </Section>
      </div>

      <div className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t p-3 backdrop-blur-md lg:hidden">
        <Button type="button" className="flex-1" onClick={() => void handleAddToCart()} disabled={cartBusy}>
          <ShoppingCart className="size-4" /> Adicionar
        </Button>
        {waHref ? (
          <a href={waHref} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: 'outline' }), 'shrink-0')}>
            <MessageCircle className="size-4" />
          </a>
        ) : null}
      </div>
    </div>
  )
}
