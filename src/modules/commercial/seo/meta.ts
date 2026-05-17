import { env } from '@/core/env'

/** Textos SEO por rota (marketing). */

export const commercialSeo = {
  home: {
    title: 'Plataforma multiempresa para operações e crescimento',
    description:
      'Centralize pedidos, financeiro, automações e relatórios num único painel SaaS com segurança e escala.',
    path: '/',
  },
  pricing: {
    title: 'Planos e preços',
    description: 'Escolha o plano Starter, Business ou Enterprise. Mensal ou anual. Experimente o ecossistema completo.',
    path: '/planos',
  },
  signup: {
    title: 'Criar conta',
    description: 'Registe-se para começar o onboarding da sua empresa na plataforma.',
    path: '/cadastro',
  },
  onboarding: {
    title: 'Onboarding da empresa',
    description: 'Complete os dados da sua organização para activar o painel.',
    path: '/onboarding',
  },
  checkout: {
    title: 'Checkout da assinatura',
    description: 'Finalize a sua subscrição ao plano seleccionado.',
    path: '/checkout/assinatura',
  },
  billing: {
    title: 'Faturação e subscrição',
    description: 'Gerir plano, facturas e renovação da sua conta.',
    path: '/conta/faturacao',
  },
  upgrade: {
    title: 'Upgrade de plano',
    description: 'Suba de plano para desbloquear mais capacidades e utilizadores.',
    path: '/conta/plano/upgrade',
  },
  downgrade: {
    title: 'Downgrade de plano',
    description: 'Altere para um plano inferior com aviso de funcionalidades.',
    path: '/conta/plano/downgrade',
  },
} as const

export type CommercialSeoBlock = { title: string; description: string; path: string }

/** Home: variante demo vertical «signage» quando `VITE_COMMERCIAL_VERTICAL=signage`. */
export function commercialSeoHome(): CommercialSeoBlock {
  if (env.commercialVertical === 'signage') {
    return {
      title: 'Software para envelopamento, lonas e sinalética — operação e margem',
      description:
        'Demo SaaS multiempresa: orçamentos, produção, instalação e financeiro num fluxo — ideal para oficinas de wrap e comunicação visual.',
      path: '/',
    }
  }
  return commercialSeo.home
}
