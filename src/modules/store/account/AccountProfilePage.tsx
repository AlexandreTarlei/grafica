import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormActions, FormField, FormSection, MaskedInput } from '@/components/forms'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { http } from '@/services/http/client'
import { toast } from 'sonner'
import {
  accountProfileFormSchema,
  type AccountProfileFormInput,
} from '@/lib/validation/profile'
import { toApiError } from '@/utils/api-error'

type CustomerProfile = {
  id: number
  name: string
  email: string | null
  phone: string | null
}

async function fetchCustomerProfile(): Promise<CustomerProfile> {
  const { data } = await http.post<CustomerProfile>('/store/me/customer')
  return data
}

export function AccountProfilePage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['account', 'profile'],
    queryFn: fetchCustomerProfile,
  })

  const form = useForm<AccountProfileFormInput>({
    resolver: zodResolver(accountProfileFormSchema),
    values: {
      name: data?.name ?? user?.name ?? '',
      email: data?.email ?? user?.email ?? '',
      phone: data?.phone ?? '',
    },
    mode: 'onBlur',
  })

  const mutation = useMutation({
    mutationFn: async (values: AccountProfileFormInput) => {
      await http.post('/store/me/customer', {
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
      })
    },
    onSuccess: () => {
      toast.success('Perfil actualizado.')
      void qc.invalidateQueries({ queryKey: ['account', 'profile'] })
    },
    onError: (e) => toast.error(toApiError(e).message),
  })

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Perfil</h2>
      <form
        className="max-w-md"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        <FormSection>
          <FormField control={form.control} name="name" label="Nome">
            {(field) => (
              <Input
                id={field.id}
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
                aria-invalid={field['aria-invalid']}
                value={String(field.value ?? '')}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          </FormField>
          <FormField control={form.control} name="phone" label="Telefone">
            {(field) => (
              <MaskedInput
                mask="phone"
                id={field.id}
                aria-invalid={field['aria-invalid']}
                value={String(field.value ?? '')}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          </FormField>
          <FormActions submitLabel="Guardar" loading={mutation.isPending} className="border-0 pt-0" />
        </FormSection>
      </form>
    </div>
  )
}
