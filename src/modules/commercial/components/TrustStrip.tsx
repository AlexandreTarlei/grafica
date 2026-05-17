const DEFAULT_CAPTION = 'Equipas que confiam em operações centralizadas'
const DEFAULT_BRANDS = ['Retailer', 'Serviços', 'Wholesale', 'Marketplace', 'Distribuição'] as const

type TrustStripProps = {
  caption?: string
  brands?: readonly string[]
}

export function TrustStrip({ caption = DEFAULT_CAPTION, brands = DEFAULT_BRANDS }: TrustStripProps) {
  const logos = brands
  return (
    <div className="border-border/60 bg-muted/20 border-y py-10">
      <p className="text-muted-foreground text-center text-xs font-medium tracking-wide uppercase">{caption}</p>
      <div className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4">
        {logos.map((name) => (
          <span
            key={name}
            className="text-muted-foreground/80 hover:text-muted-foreground text-sm font-semibold transition-colors"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}
