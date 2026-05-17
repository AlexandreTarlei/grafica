export type CartLineCustomization = {
  widthCm?: number
  heightCm?: number
  notes?: string
  artworkAssetId?: number
  artworkFilename?: string
}

export type CartLine = {
  id: string
  productId: string
  nome: string
  sku: string
  quantidade: number
  precoUnitario: number
  subtotal: number
  customization?: CartLineCustomization
}

export type Cart = {
  id: string
  linhas: CartLine[]
  subtotal: number
  taxas: number
  total: number
}

export type AddCartItemInput = {
  productId: string
  quantidade: number
  widthCm?: number
  heightCm?: number
  notes?: string
  artworkAssetId?: number
}
