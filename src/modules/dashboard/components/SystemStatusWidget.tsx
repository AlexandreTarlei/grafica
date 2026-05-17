import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { env } from '@/core/env'

export function SystemStatusWidget() {
  const mockFinancial = import.meta.env.VITE_USE_FINANCIAL_MOCK !== 'false'
  const mockSignage = import.meta.env.VITE_USE_SIGNAGE_DASHBOARD_MOCK !== 'false'

  return (
    <Card className="shadow-card ring-1 ring-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Status do sistema</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
          API online
        </Badge>
        <Badge variant="outline">Tenant ativo</Badge>
        {import.meta.env.DEV ? (
          <>
            <Badge variant="secondary">Fin: {mockFinancial ? 'mock' : 'live'}</Badge>
            <Badge variant="secondary">Signage: {mockSignage ? 'mock' : 'live'}</Badge>
          </>
        ) : null}
        <p className="text-muted-foreground w-full text-xs">{env.appName} · painel operacional</p>
      </CardContent>
    </Card>
  )
}
