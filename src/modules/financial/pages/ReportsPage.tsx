import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReportsSummaryPanel } from '@/modules/financial/components/ReportsSummaryPanel'
import { useFinancialPeriod } from '@/modules/financial/hooks/useFinancialPeriod'
import { useFinancialReport } from '@/modules/financial/hooks/useFinancialReport'
import { downloadFinancialReportCsv } from '@/modules/financial/utils/csvExport'
import { FinancialErrorState } from '@/modules/financial/widgets/FinancialErrorState'
import { FinancialPageShell } from '@/modules/financial/widgets/FinancialPageShell'

export function ReportsPage() {
  const { period, setPeriod, periodInvalid } = useFinancialPeriod()
  const reportQ = useFinancialReport(period)

  return (
    <FinancialPageShell
      title="Relatórios financeiros"
      subtitle="Resumo agregado e exportação CSV local (sem dados sensíveis do gateway)."
      period={period}
      onPeriodChange={setPeriod}
      periodInvalid={periodInvalid}
    >
      {reportQ.isError ? (
        <FinancialErrorState error={reportQ.error} onRetry={() => void reportQ.refetch()} />
      ) : reportQ.data ? (
        <>
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => downloadFinancialReportCsv(reportQ.data!)}
            >
              <Download className="size-4" />
              Exportar CSV
            </Button>
          </div>
          <ReportsSummaryPanel report={reportQ.data} />
        </>
      ) : reportQ.isLoading ? (
        <p className="text-muted-foreground text-sm">A carregar relatório…</p>
      ) : null}
    </FinancialPageShell>
  )
}
