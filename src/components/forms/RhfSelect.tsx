import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormField } from '@/components/forms/FormField'

type Option = { value: string; label: string }

type RhfSelectProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  description?: string
  options: Option[]
  placeholder?: string
  className?: string
  triggerClassName?: string
}

export function RhfSelect<T extends FieldValues>({
  control,
  name,
  label,
  description,
  options,
  placeholder = 'Selecionar…',
  className,
  triggerClassName,
}: RhfSelectProps<T>) {
  return (
    <FormField control={control} name={name} label={label} description={description} className={className}>
      {(field) => (
        <Select
          value={String(field.value ?? '')}
          onValueChange={field.onChange}
        >
          <SelectTrigger className={triggerClassName ?? 'w-full'} id={field.id} aria-invalid={field['aria-invalid']}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  )
}
