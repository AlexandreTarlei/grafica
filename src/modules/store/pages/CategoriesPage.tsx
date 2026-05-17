import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { Seo } from '@/modules/commercial/seo/Seo'
import { STORE_CATEGORIES } from '@/modules/store/content/ecommerce-content'
import { cn } from '@/lib/utils'

const GRADIENTS = [
  'from-primary/20 to-primary/5',
  'from-sky-500/20 to-sky-500/5',
  'from-violet-500/20 to-violet-500/5',
  'from-amber-500/20 to-amber-500/5',
  'from-emerald-500/20 to-emerald-500/5',
  'from-rose-500/20 to-rose-500/5',
]

export function CategoriesPage() {
  if (STORE_CATEGORIES.length === 0) {
    return (
      <PageContainer>
        <Seo title="Categorias" description="Categorias de produtos." canonicalPath="/categorias" />
        <p className="text-muted-foreground py-12 text-center">Nenhuma categoria disponível.</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Seo title="Categorias" description="Categorias de produtos de comunicação visual." canonicalPath="/categorias" />
      <PageHeader
        noMotion
        title="Categorias"
        description="Escolha o tipo de produto para o seu projeto."
        className="mb-8"
      />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {STORE_CATEGORIES.map((cat, i) => (
          <Link
            key={cat.id}
            to={`/produtos?categoria=${cat.id}`}
            className={cn(
              'store-card-hover border-border group rounded-2xl border p-6 ring-1 ring-border/60',
              `bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`,
            )}
          >
            <h2 className="text-lg font-semibold group-hover:text-primary">{cat.label}</h2>
            <p className="text-muted-foreground mt-2 text-sm">Ver produtos →</p>
          </Link>
        ))}
      </div>
    </PageContainer>
  )
}
