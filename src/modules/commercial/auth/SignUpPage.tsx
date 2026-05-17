import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { FormAlert, FormActions, FormField, RhfCheckbox } from '@/components/forms'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { env } from '@/core/env'
import { PERMISSIONS } from '@/core/types/permissions'
import { useAuth } from '@/hooks/useAuth'
import { loginApi, registerApi } from '@/modules/auth/api'
import type { AuthUser } from '@/modules/auth/types'
import { commercialSeo } from '@/modules/commercial/seo/meta'
import { Seo } from '@/modules/commercial/seo/Seo'
import { signUpFormSchema, type SignUpFormInput } from '@/lib/validation/auth'
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

export function SignUpPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<SignUpFormInput>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { full_name: '', email: '', password: '', terms: false },
    mode: 'onBlur',
  })

  const mutation = useMutation({
    meta: { silentGlobalToast: true },
    mutationFn: async (values: SignUpFormInput) => {
      await registerApi({
        email: values.email,
        password: values.password,
        full_name: values.full_name,
      })
      return loginApi({ email: values.email, password: values.password })
    },
    onSuccess: (data) => {
      login(data.accessToken, ensureFallbackPermissions(data.user), data.refreshToken)
      navigate('/conta', { replace: true })
    },
    onError: (error) => setFormError(toApiError(error).message),
  })

  const seo = commercialSeo.signup

  return (
    <>
      <Seo title={seo.title} description={seo.description} canonicalPath={seo.path} noindex />
      <Card className="border-border/80 shadow-lg">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl tracking-tight">Criar conta</CardTitle>
          <CardDescription>
            Junte-se ao <span className="text-foreground font-medium">{env.appName}</span>. Depois do
            registo, guiamos o onboarding da empresa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-5"
            onSubmit={form.handleSubmit((v) => {
              setFormError(null)
              mutation.mutate(v)
            })}
            noValidate
          >
            {formError ? <FormAlert message={formError} /> : null}

            <FormField control={form.control} name="full_name" label="Nome completo">
              {(field) => (
                <Input
                  id={field.id}
                  autoComplete="name"
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
            <FormField control={form.control} name="email" label="E-mail">
              {(field) => (
                <Input
                  id={field.id}
                  type="email"
                  autoComplete="email"
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
            <FormField control={form.control} name="password" label="Senha">
              {(field) => (
                <Input
                  id={field.id}
                  type="password"
                  autoComplete="new-password"
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
            <RhfCheckbox
              control={form.control}
              name="terms"
              label="Aceito os termos de utilização e a política de privacidade (versão demonstração)."
            />

            <FormActions
              submitLabel="Continuar para onboarding"
              loading={mutation.isPending}
              className="border-0 pt-0"
            />
            <p className="text-muted-foreground text-center text-sm">
              Já tem conta?{' '}
              <Link to="/login" className="text-primary font-medium underline-offset-4 hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
