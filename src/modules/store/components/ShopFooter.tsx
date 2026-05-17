import { Link } from 'react-router-dom'
import { env } from '@/core/env'
import { useTenantPlatform } from '@/core/providers/useTenantPlatform'
import { contactContent } from '@/modules/store/content/ecommerce-content'

export function ShopFooter() {
  const { brandName } = useTenantPlatform()
  const displayName = brandName || env.appName

  return (
    <footer className="border-border bg-muted/40 mt-auto border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <p className="text-foreground text-lg font-semibold tracking-tight">{displayName}</p>
          <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
            Gráfica online — banners, fachadas, envelopamento e impressão personalizada com entrega em
            todo o país.
          </p>
        </div>
        <div>
          <p className="text-foreground mb-3 text-sm font-semibold uppercase tracking-wide">Loja</p>
          <ul className="text-muted-foreground flex flex-col gap-2.5 text-sm">
            <li>
              <Link to="/produtos" className="transition-base hover:text-foreground">
                Produtos
              </Link>
            </li>
            <li>
              <Link to="/orcamento" className="transition-base hover:text-foreground">
                Orçamento
              </Link>
            </li>
            <li>
              <Link to="/carrinho" className="transition-base hover:text-foreground">
                Carrinho
              </Link>
            </li>
            <li>
              <Link to="/conta" className="transition-base hover:text-foreground">
                Minha conta
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-foreground mb-3 text-sm font-semibold uppercase tracking-wide">Contacto</p>
          <ul className="text-muted-foreground flex flex-col gap-1.5 text-sm">
            <li>{contactContent.email}</li>
            <li>{contactContent.phone}</li>
            <li>{contactContent.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-border text-muted-foreground border-t px-4 py-5 text-center text-xs md:px-6">
        © {new Date().getFullYear()} {displayName}. Todos os direitos reservados.
      </div>
    </footer>
  )
}
