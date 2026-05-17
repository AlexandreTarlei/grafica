import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { FiscalInvoiceItem } from '@/modules/admin/fiscal/types'

function formatMoney(n: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

/**
 * Agregados de impostos calculados a partir dos itens da nota.
 * Limitação: os totais reais (ICMS, PIS, COFINS) ainda não chegam por item no
 * `InvoiceItemRead` do backend — mostramos o que é possível derivar.
 */
function aggregate(items: FiscalInvoiceItem[]) {
  const totals = {
    base: items.reduce((acc, it) => acc + it.valorBruto, 0),
    quantidade: items.reduce((acc, it) => acc + it.quantidade, 0),
    porCfop: new Map<string, number>(),
    porCst: new Map<string, number>(),
  }
  for (const it of items) {
    totals.porCfop.set(it.cfop, (totals.porCfop.get(it.cfop) ?? 0) + it.valorBruto)
    totals.porCst.set(it.cstIcms, (totals.porCst.get(it.cstIcms) ?? 0) + it.valorBruto)
  }
  return totals
}

export function InvoiceTaxesPanel({ items }: { items: FiscalInvoiceItem[] }) {
  const totals = useMemo(() => aggregate(items), [items])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Impostos e totais</CardTitle>
        <CardDescription>
          Agregados derivados dos itens. Valores oficiais ficam no XML da SEFAZ.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2">
          <h4 className="text-muted-foreground text-xs uppercase tracking-wide">Totais</h4>
          <div className="flex justify-between text-sm">
            <span>Valor bruto</span>
            <span className="tabular-nums font-medium">{formatMoney(totals.base)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Itens</span>
            <span className="tabular-nums font-medium">{items.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Quantidade total</span>
            <span className="tabular-nums font-medium">{totals.quantidade}</span>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-muted-foreground text-xs uppercase tracking-wide">Por CFOP</h4>
          {totals.porCfop.size === 0 ? (
            <p className="text-muted-foreground text-sm">Sem dados.</p>
          ) : (
            [...totals.porCfop.entries()].map(([cfop, valor]) => (
              <div key={cfop} className="flex justify-between text-sm">
                <span className="font-mono text-xs">{cfop}</span>
                <span className="tabular-nums">{formatMoney(valor)}</span>
              </div>
            ))
          )}
        </div>
        <div className="space-y-2">
          <h4 className="text-muted-foreground text-xs uppercase tracking-wide">Por CST ICMS</h4>
          {totals.porCst.size === 0 ? (
            <p className="text-muted-foreground text-sm">Sem dados.</p>
          ) : (
            [...totals.porCst.entries()].map(([cst, valor]) => (
              <div key={cst} className="flex justify-between text-sm">
                <span className="font-mono text-xs">{cst}</span>
                <span className="tabular-nums">{formatMoney(valor)}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
