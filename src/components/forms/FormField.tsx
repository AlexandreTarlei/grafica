import type { ReactElement, ReactNode } from 'react'
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { cn } from '@/lib/utils'

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: ReactNode
  description?: string
  className?: string
  children: (field: {
    value: unknown
    onChange: (...event: unknown[]) => void
    onBlur: () => void
    name: string
    ref: (instance: HTMLElement | null) => void
    id: string
    'aria-invalid': boolean
  }) => ReactElement
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  children,
}: FormFieldProps<T>) {
  const id = String(name).replace(/\./g, '-')

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className={cn(className)} data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          {children({
            ...field,
            id,
            'aria-invalid': fieldState.invalid,
          })}
          {description ? <FieldDescription>{description}</FieldDescription> : null}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )
}

/** Campo simples sem RHF (filtros, etc.) */
export function StaticFormField({
  label,
  description,
  error,
  children,
  className,
  htmlFor,
}: {
  label: string
  description?: string
  error?: string
  children: ReactNode
  className?: string
  htmlFor?: string
}) {
  return (
    <Field className={className} data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children}
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  )
}
