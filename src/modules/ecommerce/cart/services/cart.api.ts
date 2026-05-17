/**
 * Contrato esperado (FastAPI):
 * - GET    /cart
 * - POST   /cart/items        { product_id, quantidade, width_cm?, height_cm?, notes?, artwork_asset_id? }
 * - PATCH  /cart/items/{id}   { quantidade }
 * - DELETE /cart/items/{id}
 */
import { http } from '@/services/http/client'
import type { AddCartItemInput, Cart, CartLine } from '@/modules/ecommerce/cart/types'

const USE_MOCK = import.meta.env.VITE_USE_CART_MOCK !== 'false'

let mockCart: Cart = {
  id: 'cart-local',
  linhas: [],
  subtotal: 0,
  taxas: 0,
  total: 0,
}

function recalc(c: Cart): Cart {
  const linhas = c.linhas.map((l) => ({
    ...l,
    subtotal: l.precoUnitario * l.quantidade,
  }))
  const subtotal = linhas.reduce((s, l) => s + l.subtotal, 0)
  const taxas = 0
  return { ...c, linhas, subtotal, taxas, total: subtotal + taxas }
}

function mapCustomization(input: AddCartItemInput): CartLine['customization'] | undefined {
  const { widthCm, heightCm, notes, artworkAssetId } = input
  if (
    widthCm == null &&
    heightCm == null &&
    !notes?.trim() &&
    artworkAssetId == null
  ) {
    return undefined
  }
  return {
    widthCm,
    heightCm,
    notes: notes?.trim() || undefined,
    artworkAssetId,
  }
}

async function delay(): Promise<void> {
  await new Promise((r) => setTimeout(r, 250))
}

export async function getCart(): Promise<Cart> {
  if (USE_MOCK) {
    await delay()
    return { ...mockCart, linhas: mockCart.linhas.map((l) => ({ ...l })) }
  }
  const { data } = await http.get<Cart>('/cart')
  return data
}

export async function addCartItem(input: AddCartItemInput): Promise<Cart> {
  const customization = mapCustomization(input)
  if (USE_MOCK) {
    await delay()
    const line: CartLine = {
      id: `line-${Date.now()}`,
      productId: input.productId,
      nome: `Produto ${input.productId}`,
      sku: `SKU-${input.productId}`,
      quantidade: input.quantidade,
      precoUnitario: 25,
      subtotal: 25 * input.quantidade,
      customization,
    }
    mockCart = recalc({ ...mockCart, linhas: [...mockCart.linhas, line] })
    return getCart()
  }
  const { data } = await http.post<Cart>('/cart/items', {
    product_id: input.productId,
    quantidade: input.quantidade,
    width_cm: input.widthCm,
    height_cm: input.heightCm,
    notes: input.notes?.trim() || undefined,
    artwork_asset_id: input.artworkAssetId,
  })
  return data
}

export async function updateCartLine(lineId: string, quantidade: number): Promise<Cart> {
  if (USE_MOCK) {
    await delay()
    mockCart = recalc({
      ...mockCart,
      linhas: mockCart.linhas.map((l) =>
        l.id === lineId
          ? {
              ...l,
              quantidade,
              subtotal: l.precoUnitario * quantidade,
            }
          : l,
      ),
    })
    return getCart()
  }
  const { data } = await http.patch<Cart>(`/cart/items/${lineId}`, { quantidade })
  return data
}

/** Limpa o carrinho mock após checkout concluído (dev). */
export async function clearCartAfterCheckout(): Promise<void> {
  if (!USE_MOCK) return
  await delay()
  mockCart = recalc({ ...mockCart, linhas: [] })
}

export async function removeCartLine(lineId: string): Promise<Cart> {
  if (USE_MOCK) {
    await delay()
    mockCart = recalc({
      ...mockCart,
      linhas: mockCart.linhas.filter((l) => l.id !== lineId),
    })
    return getCart()
  }
  const { data } = await http.delete<Cart>(`/cart/items/${lineId}`)
  return data
}
