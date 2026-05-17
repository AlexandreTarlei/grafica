import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { FileDropzone, type DroppedFile } from '@/modules/signage/shared/components/FileDropzone'
import { cn } from '@/lib/utils'

type RhfFileUploadProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  description?: string
  multiple?: boolean
  className?: string
  /** Map dropped files to field value (e.g. preview URL string) */
  mapValue?: (files: DroppedFile[]) => unknown
}

export function RhfFileUpload<T extends FieldValues>({
  control,
  name,
  label,
  description,
  multiple = false,
  className,
  mapValue,
}: RhfFileUploadProps<T>) {
  const id = String(name).replace(/\./g, '-')

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className={cn(className)} data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <FileDropzone
            multiple={multiple}
            onChange={(files) => {
              const mapped = mapValue
                ? mapValue(files)
                : files[0]?.previewUrl && files[0].previewUrl !== 'pdf'
                  ? files[0].previewUrl
                  : field.value
              field.onChange(mapped)
            }}
          />
          {description ? <FieldDescription>{description}</FieldDescription> : null}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )
}
