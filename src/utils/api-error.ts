import { isAxiosError } from 'axios'

export type ApiErrorShape = {
  message: string
  status?: number
  code?: string
}

/**
 * Normaliza falhas de rede / Axios em mensagem única para toast ou UI.
 */
export function toApiError(error: unknown): ApiErrorShape {
  if (isAxiosError(error)) {
    const status = error.response?.status
    if (status === 403) {
      return {
        message: 'Sem permissão para esta operação.',
        status,
        code: error.code,
      }
    }
    const data = error.response?.data as
      | { message?: string; error?: string | { message?: string; code?: string } }
      | undefined
    const nested =
      data?.error && typeof data.error === 'object' && 'message' in data.error
        ? String((data.error as { message?: string }).message ?? '')
        : ''
    const msg =
      (typeof data?.message === 'string' && data.message) ||
      nested ||
      (typeof data?.error === 'string' && data.error) ||
      error.message ||
      'Erro ao comunicar com o servidor.'
    return {
      message: msg,
      status,
      code: error.code,
    }
  }
  if (error instanceof Error) {
    return { message: error.message }
  }
  return { message: 'Ocorreu um erro inesperado.' }
}
