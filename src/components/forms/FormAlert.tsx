type FormAlertProps = {
  message: string
}

export function FormAlert({ message }: FormAlertProps) {
  return (
    <div
      role="alert"
      className="border-destructive/30 bg-destructive/5 text-destructive rounded-lg border px-3 py-2 text-sm"
    >
      {message}
    </div>
  )
}
