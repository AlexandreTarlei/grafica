import { describe, expect, it } from 'vitest'
import { AxiosError } from 'axios'
import { toApiError } from '@/utils/api-error'

describe('toApiError', () => {
  it('maps 403 to permission message', () => {
    const err = new AxiosError('Forbidden', 'ERR', undefined, undefined, {
      status: 403,
      statusText: 'Forbidden',
      headers: {},
      config: {} as never,
      data: {},
    })
    expect(toApiError(err).message).toBe('Sem permissão para esta operação.')
    expect(toApiError(err).status).toBe(403)
  })

  it('reads nested API message', () => {
    const err = new AxiosError('Bad', 'ERR', undefined, undefined, {
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
      data: { message: 'SKU duplicado' },
    })
    expect(toApiError(err).message).toBe('SKU duplicado')
  })

  it('falls back for unknown errors', () => {
    expect(toApiError(null).message).toBe('Ocorreu um erro inesperado.')
  })
})
