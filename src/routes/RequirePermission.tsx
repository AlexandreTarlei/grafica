import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Permission } from '@/core/types/permissions'
import { useAuth } from '@/hooks/useAuth'
import { hasAnyPermission } from '@/utils/permissions'

type RequirePermissionProps = {
  anyOf: Permission[]
  children: ReactNode
}

export function RequirePermission({ anyOf, children }: RequirePermissionProps) {
  const { user } = useAuth()

  if (!hasAnyPermission(user, anyOf)) {
    return (
      <Card className="border-destructive/40 max-w-lg">
        <CardHeader>
          <CardTitle>Sem permissão</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Você não tem permissão para acessar este recurso. Solicite acesso ao administrador da
          empresa.
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}
