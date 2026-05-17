import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { Seo } from '@/modules/commercial/seo/Seo'
import { partnersContent } from '@/modules/store/content/ecommerce-content'
import { cn } from '@/lib/utils'

export function PartnersPage() {
  const C = partnersContent
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <Seo title={C.title} description={C.subtitle} canonicalPath="/parceiros" />
      <h1 className="text-3xl font-bold tracking-tight">{C.title}</h1>
      <p className="text-muted-foreground mt-2 mb-10 max-w-2xl">{C.subtitle}</p>
      <div className="grid gap-6 md:grid-cols-3">
        {C.benefits.map((b) => (
        <div key={b.title} className="border-border bg-card rounded-xl border p-6">
          <b.icon className="text-primary mb-4 size-8" />
          <h2 className="text-lg font-semibold">{b.title}</h2>
          <p className="text-muted-foreground mt-2 text-sm">{b.description}</p>
        </div>
        ))}
        <div className="md:col-span-3">
          <Link to="/contato" className={cn(buttonVariants({ size: 'lg' }))}>
            Tornar-se parceiro
          </Link>
        </div>
      </div>
    </div>
  )
}
