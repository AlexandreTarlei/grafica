import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { FeatureGrid } from '@/modules/commercial/components/FeatureGrid'
import { Section } from '@/modules/commercial/components/Section'
import { TrustStrip } from '@/modules/commercial/components/TrustStrip'
import { Seo } from '@/modules/commercial/seo/Seo'
import { env } from '@/core/env'
import { ProductGrid } from '@/modules/store/components/ProductGrid'
import {
  STORE_CATEGORIES,
  storeFeatures,
  storeHomeContent,
  storeTrust,
} from '@/modules/store/content/ecommerce-content'
import { useStoreProducts } from '@/modules/store/hooks/useStoreProducts'
import { cn } from '@/lib/utils'

const CATEGORY_GRADIENTS = [
  'from-primary/15 to-primary/5',
  'from-blue-500/15 to-blue-500/5',
  'from-violet-500/15 to-violet-500/5',
  'from-amber-500/15 to-amber-500/5',
  'from-emerald-500/15 to-emerald-500/5',
  'from-rose-500/15 to-rose-500/5',
]

export function StoreHomePage() {
  const C = storeHomeContent
  const { data, isLoading } = useStoreProducts({ pageSize: 8 })

  const portfolioFromCatalog = useMemo(
    () =>
      (data?.items ?? [])
        .filter((p) => p.imageUrls[0])
        .slice(0, 4)
        .map((p) => ({
          title: p.name,
          tag: STORE_CATEGORIES.find((c) => c.id === p.metadata.category)?.label ?? 'Projeto',
          imageUrl: p.imageUrls[0],
          to: `/produtos/${p.id}`,
        })),
    [data?.items],
  )
  const portfolioItems =
    portfolioFromCatalog.length >= 2 ? portfolioFromCatalog : C.portfolioItems.map((item) => ({ ...item, imageUrl: null as string | null, to: '/produtos' }))

  return (
    <>
      <Seo title={`${env.appName} — Gráfica online`} description={C.heroSubtitle} canonicalPath="/" />

      <section className="store-hero relative overflow-hidden">
        <div className="from-primary/25 via-background to-muted/40 pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_-10%,var(--color-primary)_0%,transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="max-w-2xl">
            <p className="text-primary mb-3 text-sm font-semibold tracking-wide uppercase">{C.heroEyebrow}</p>
            <h1 className="text-foreground page-title text-balance md:text-5xl lg:text-6xl">{C.heroTitle}</h1>
            <p className="text-muted-foreground mt-5 text-lg leading-relaxed">{C.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={C.ctaPrimary.to} className={cn(buttonVariants({ size: 'lg' }))}>
                {C.ctaPrimary.label}
              </Link>
              <Link to={C.ctaSecondary.to} className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
                {C.ctaSecondary.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip caption={storeTrust.caption} brands={storeTrust.brands} />

      <Section title="Categorias" subtitle="Encontre o produto certo para o seu projeto.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {STORE_CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/produtos?categoria=${cat.id}`}
              className={cn(
                'store-card-hover border-border bg-card rounded-xl border p-4 text-center text-sm font-medium ring-1 ring-border/60',
                `bg-gradient-to-br ${CATEGORY_GRADIENTS[i % CATEGORY_GRADIENTS.length]}`,
              )}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </Section>

      {'promoBanners' in C && C.promoBanners ? (
        <Section className="py-8">
          <div className="grid gap-4 md:grid-cols-3">
            {C.promoBanners.map((banner) => (
              <Link
                key={banner.title}
                to={banner.to}
                className={cn(
                  'store-card-hover border-border rounded-2xl border p-6 ring-1 ring-border/60',
                  `bg-gradient-to-br ${banner.gradient}`,
                )}
              >
                <h3 className="font-semibold">{banner.title}</h3>
                <p className="text-muted-foreground mt-1 text-sm">{banner.description}</p>
                <span className="text-primary mt-3 inline-block text-sm font-medium">{banner.cta} →</span>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title={C.featuredTitle} subtitle={C.featuredSubtitle} className="bg-muted/20">
        <ProductGrid products={data?.items} loading={isLoading} skeletonCount={4} />
        <div className="mt-8 text-center">
          <Link to="/produtos" className={cn(buttonVariants({ variant: 'outline' }))}>
            Ver catálogo completo
          </Link>
        </div>
      </Section>

      <Section title={C.servicesTitle} subtitle={C.servicesSubtitle}>
        <FeatureGrid items={storeFeatures} columns={3} />
      </Section>

      <Section title={C.portfolioTitle} subtitle={C.portfolioSubtitle}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {portfolioItems.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="border-border bg-muted/50 store-card-hover relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-xl border p-4 ring-1 ring-border/60"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt=""
                  className="absolute inset-0 size-full object-cover opacity-90"
                  loading="lazy"
                />
              ) : null}
              <span className="text-primary relative text-xs font-semibold uppercase">{item.tag}</span>
              <p className="text-foreground relative mt-1 font-medium">{item.title}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section title={C.reviewsTitle}>
        <div className="grid gap-4 md:grid-cols-3">
          {C.reviews.map((r) => (
            <blockquote key={r.name} className="border-border bg-card rounded-xl border p-5 shadow-card ring-1 ring-border/60">
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

      <Section className="bg-primary/5">
        <div className="border-border bg-card mx-auto max-w-3xl rounded-2xl border p-8 text-center shadow-card ring-1 ring-border/60">
          <h2 className="text-2xl font-semibold">{C.ctaBanner.title}</h2>
          <p className="text-muted-foreground mt-2">{C.ctaBanner.description}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to={C.ctaBanner.primary.to} className={cn(buttonVariants({ size: 'lg' }))}>
              {C.ctaBanner.primary.label}
            </Link>
            <Link to="/contato" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
              Falar connosco
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
