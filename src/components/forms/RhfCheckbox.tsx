import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Controller } from 'react-hook-form'
import { cn } from '@/lib/utils'

type RhfCheckboxProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  description?: string
  className?: string
}

export function RhfCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
}: RhfCheckboxProps<T>) {
  const id = String(name).replace(/\./g, '-')

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" className={cn('items-start gap-3', className)} data-invalid={fieldState.invalid}>
          <Checkbox
            id={id}
            checked={Boolean(field.value)}
            onCheckedChange={(v) => field.onChange(!!v)}
          />
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor={id} className="font-normal">
              {label}
            </FieldLabel>
            {description ? <FieldDescription>{description}</FieldDescription> : null}
            <FieldError errors={[fieldState.error]} />
          </div>
        </Field>
      )}
    />
  )
}
