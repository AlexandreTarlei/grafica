import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toApiError } from '@/utils/api-error'

type FinancialErrorStateProps = {
  title?: string
  error: unknown
  onRetry?: () => void
}

export function FinancialErrorState({
  title = 'Não foi possível carregar os dados',
  error,
  onRetry,
}: FinancialErrorStateProps) {
  const { message } = toApiError(error)
  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-destructive text-base">{title}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      {onRetry ? (
        <CardContent>
          <button
            type="button"
            className="text-primary text-sm font-medium underline-offset-4 hover:underline"
            onClick={() => onRetry()}
          >
            Tentar novamente
          </button>
        </CardContent>
      ) : null}
    </Card>
  )
}
