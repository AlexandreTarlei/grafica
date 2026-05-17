export type ClientContact = {
  id: string
  name: string
  email?: string
  phone?: string
  role?: string
}

export type CorporateClient = {
  id: string
  legalName: string
  tradeName?: string
  cnpj: string
  contacts: ClientContact[]
  recurring: boolean
  projectsCount: number
  quotesCount: number
  ordersCount: number
  createdAt: string
}
