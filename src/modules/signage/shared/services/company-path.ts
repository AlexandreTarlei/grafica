export function companyApiPath(companyId: number, segment: string): string {
  const normalized = segment.replace(/^\/+|\/+$/g, '')
  return `/companies/${companyId}/${normalized}`
}
