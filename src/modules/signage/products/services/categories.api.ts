import { http } from '@/services/http/client'
import { companyApiPath } from '@/modules/signage/shared/services/company-path'
import type { SignageCategory } from '@/modules/signage/products/types'

const USE_MOCK = import.meta.env.VITE_USE_SIGNAGE_PRODUCTS_MOCK !== 'false'

const MOCK_CATEGORIES: SignageCategory[] = [
  { id: 1, name: 'Banners', slug: 'banners' },
  { id: 2, name: 'Fachadas', slug: 'fachadas' },
]

async function mockDelay(): Promise<void> {
  await new Promise((r) => setTimeout(r, 200))
}

function mapCategory(raw: Record<string, unknown>): SignageCategory {
  return {
    id: Number(raw.id),
    name: String(raw.name ?? ''),
    slug: String(raw.slug ?? ''),
  }
}

export async function listSignageCategories(companyId: number): Promise<SignageCategory[]> {
  if (USE_MOCK) {
    await mockDelay()
    return MOCK_CATEGORIES
  }
  const { data } = await http.get<unknown>(companyApiPath(companyId, 'categories'))
  const o = data as Record<string, unknown>
  const items = ((o.items ?? o.data) as unknown[]) ?? []
  return items.map((row) => mapCategory(row as Record<string, unknown>))
}

export async function createSignageCategory(
  companyId: number,
  body: { name: string; slug?: string },
): Promise<SignageCategory> {
  if (USE_MOCK) {
    await mockDelay()
    const created = { id: MOCK_CATEGORIES.length + 1, name: body.name, slug: body.slug ?? body.name.toLowerCase() }
    MOCK_CATEGORIES.push(created)
    return created
  }
  const { data } = await http.post<unknown>(companyApiPath(companyId, 'categories'), {
    name: body.name,
    slug: body.slug,
  })
  return mapCategory(data as Record<string, unknown>)
}

export const signageCategoriesKey = (companyId: number | null) => ['signage', 'categories', companyId] as const
