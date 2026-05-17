import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FormAlert, FormField } from '@/components/forms'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { env } from '@/core/env'
import { PERMISSIONS } from '@/core/types/permissions'
import { useAuth } from '@/hooks/useAuth'
import { loginApi } from '@/modules/auth/api'
import type { AuthUser } from '@/modules/auth/types'
import { loginFormSchema, type LoginFormInput } from '@/lib/validation/auth'
import { toApiError } from '@/utils/api-error'

function ensureFallbackPermissions(user: AuthUser): AuthUser {
  if (user.permissions?.length || !import.meta.env.DEV) return user
  return {
    ...user,
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.ORDERS_ADMIN_VIEW,
      PERMISSIONS.ORDERS_ADMIN_EDIT_STATUS,
      PERMISSIONS.FINANCIAL_ADMIN_VIEW,
      PERMISSIONS.FINANCIAL_ADMIN_REPORTS,
      PERMISSIONS.AUTOMATIONS_READ,
      PERMISSIONS.AUTOMATIONS_WRITE,
      PERMISSIONS.REPORTS_READ,
      PERMISSIONS.REPORTS_EXPORT,
      PERMISSIONS.ANALYTICS_READ,
      PERMISSIONS.FISCAL_VIEW,
      PERMISSIONS.FISCAL_WRITE,
      PERMISSIONS.CATALOG_READ,
      PERMISSIONS.CATALOG_WRITE,
      PERMISSIONS.QUOTES_READ,
      PERMISSIONS.QUOTES_WRITE,
      PERMISSIONS.PRODUCTION_READ,
      PERMISSIONS.PRODUCTION_WRITE,
      PERMISSIONS.INSTALLATION_READ,
      PERMISSIONS.INSTALLATION_WRITE,
      PERMISSIONS.PARTNERS_READ,
      PERMISSIONS.PARTNERS_WRITE,
    ],
  }
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)

  const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname

  const form = useForm<LoginFormInput>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate(fromPath && fromPath !== '/login' ? fromPath : '/conta', { replace: true })
    }
  }, [fromPath, isAuthenticated, navigate])

  const mutation = useMutation({
    meta: { silentGlobalToast: true },
    mutationFn: loginApi,
    onMutate: () => setFormError(null),
    onSuccess: (data) => {
      login(data.accessToken, ensureFallbackPermissions(data.user), data.refreshToken)
      navigate(fromPath && fromPath !== '/login' ? fromPath : '/conta', { replace: true })
    },
    onError: (error) => setFormError(toApiError(error).message),
  })

  return (
    <Card className="border-border/80 shadow-lg">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl tracking-tight">Entrar</CardTitle>
        <CardDescription>
          Aceda ao painel de <span className="text-foreground font-medium">{env.appName}</span> com
          a sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-5"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          noValidate
        >
          {formError ? <FormAlert message={formError} /> : null}

          <FormField control={form.control} name="email" label="E-mail">
            {(field) => (
              <Input
                id={field.id}
                type="email"
                autoComplete="username"
                disabled={mutation.isPending}
                className="h-10"
                aria-invalid={field['aria-invalid']}
                value={String(field.value ?? '')}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="password"
            label={
              <span className="flex w-full items-center justify-between gap-2">
                Senha
                <Link
                  to="#"
                  className="text-muted-foreground hover:text-foreground text-xs font-normal underline-offset-4 hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Esqueci-me da senha
                </Link>
              </span>
            }
          >
            {(field) => (
              <Input
                id={field.id}
                type="password"
                autoComplete="current-password"
                disabled={mutation.isPending}
                className="h-10"
                aria-invalid={field['aria-invalid']}
                value={String(field.value ?? '')}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          </FormField>

          <Button type="submit" className="h-10 w-full gap-2" disabled={mutation.isPending}>
            {mutation.isPending ? 'A entrar…' : 'Entrar'}
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            Novo por aqui?{' '}
            <Link to="/cadastro" className="text-primary font-medium underline-offset-4 hover:underline">
              Criar conta
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
