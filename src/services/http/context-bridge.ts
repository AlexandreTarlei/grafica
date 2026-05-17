type GetToken = () => string | null
type GetRefreshToken = () => string | null
type GetTenantId = () => string | null
type OnUnauthorized = () => void
type OnTokensRefreshed = (accessToken: string, refreshToken: string) => void

const state: {
  getToken: GetToken
  getRefreshToken: GetRefreshToken
  getTenantId: GetTenantId
  onUnauthorized: OnUnauthorized
  onTokensRefreshed: OnTokensRefreshed
} = {
  getToken: () => null,
  getRefreshToken: () => null,
  getTenantId: () => null,
  onUnauthorized: () => {},
  onTokensRefreshed: () => {},
}

export function patchHttpContextBridge(
  patch: Partial<{
    getToken: GetToken
    getRefreshToken: GetRefreshToken
    getTenantId: GetTenantId
    onUnauthorized: OnUnauthorized
    onTokensRefreshed: OnTokensRefreshed
  }>,
): void {
  if ('getToken' in patch && patch.getToken) state.getToken = patch.getToken
  if ('getRefreshToken' in patch && patch.getRefreshToken) state.getRefreshToken = patch.getRefreshToken
  if ('getTenantId' in patch && patch.getTenantId) state.getTenantId = patch.getTenantId
  if ('onUnauthorized' in patch && patch.onUnauthorized) state.onUnauthorized = patch.onUnauthorized
  if ('onTokensRefreshed' in patch && patch.onTokensRefreshed) {
    state.onTokensRefreshed = patch.onTokensRefreshed
  }
}

export function readTokenForRequest(): string | null {
  return state.getToken()
}

export function readTenantIdForRequest(): string | null {
  return state.getTenantId()
}

export function notifyUnauthorized(): void {
  state.onUnauthorized()
}

export function readRefreshTokenForRequest(): string | null {
  return state.getRefreshToken()
}

export function notifyTokensRefreshed(accessToken: string, refreshToken: string): void {
  state.onTokensRefreshed(accessToken, refreshToken)
}
