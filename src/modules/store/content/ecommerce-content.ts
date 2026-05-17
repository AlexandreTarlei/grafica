import {
  Award,
  Clock,
  MessageCircle,
  Palette,
  Ruler,
  ShieldCheck,
  Sparkles,
  Truck,
  Upload,
} from 'lucide-react'
import type { FeatureItem } from '@/modules/commercial/components/FeatureGrid'
import {
  SIGNAGE_CATEGORY_LABELS,
  SIGNAGE_PRODUCT_CATEGORIES,
  type SignageProductCategory,
} from '@/modules/signage/products/types'

export const STORE_CATEGORIES = SIGNAGE_PRODUCT_CATEGORIES.map((id) => ({
  id,
  label: SIGNAGE_CATEGORY_LABELS[id],
  slug: id,
}))

export type StoreCategoryId = SignageProductCategory

export const storeHomeContent = {
  heroEyebrow: 'Gráfica online & comunicação visual',
  heroTitle: 'Banners, fachadas, envelopamento e impressão sob medida',
  heroSubtitle:
    'Orçamento em minutos, upload de arte, aprovação online e acompanhamento da produção até à instalação.',
  ctaPrimary: { label: 'Ver produtos', to: '/produtos' },
  ctaSecondary: { label: 'Orçamento rápido', to: '/orcamento' },
  servicesTitle: 'O que produzimos',
  servicesSubtitle: 'Soluções para marcas, lojas, frotas e eventos.',
  featuredTitle: 'Destaques da loja',
  featuredSubtitle: 'Os pedidos mais pedidos — personalize medidas e acabamentos.',
  portfolioTitle: 'Trabalhos recentes',
  portfolioSubtitle: 'Qualidade de impressão e acabamento profissional.',
  portfolioItems: [
    { title: 'Envelopamento frota', tag: 'Envelopamento' },
    { title: 'Fachada ACM', tag: 'Fachada' },
    { title: 'Lonas evento', tag: 'Banner' },
    { title: 'Letras caixa LED', tag: 'Letra caixa' },
  ],
  reviewsTitle: 'O que dizem os clientes',
  reviews: [
    { name: 'Marina L.', text: 'Orçamento rápido e entrega dentro do prazo. Arte aprovada online.', stars: 5 },
    { name: 'João P.', text: 'Fachada impecável — equipa atenciosa do projeto à instalação.', stars: 5 },
    { name: 'Studio V.', text: 'Parceiro de confiança para lonas e adesivos em volume.', stars: 4 },
  ],
  differentiatorsTitle: 'Porque comprar connosco',
  steps: [
    { step: '1', t: 'Escolha o produto', d: 'Catálogo visual com medidas e acabamentos.' },
    { step: '2', t: 'Envie a arte', d: 'Upload de ficheiros ou peça revisão da nossa equipa.' },
    { step: '3', t: 'Receba em casa', d: 'Produção rastreável e entrega ou instalação.' },
  ],
  ctaBanner: {
    title: 'Precisa de um orçamento personalizado?',
    description: 'Indique medidas, quantidade e prazo — respondemos em poucas horas.',
    primary: { label: 'Pedir orçamento', to: '/orcamento' },
    secondary: { label: 'Falar no WhatsApp', action: 'whatsapp' as const },
  },
  promoBanners: [
    {
      title: 'Envio rápido',
      description: 'Produção e entrega rastreável em todo o país.',
      to: '/produtos',
      cta: 'Comprar agora',
      gradient: 'from-blue-500/20 to-cyan-500/10',
    },
    {
      title: 'Orçamento em minutos',
      description: 'Medidas personalizadas e upload de arte online.',
      to: '/orcamento',
      cta: 'Pedir orçamento',
      gradient: 'from-violet-500/20 to-purple-500/10',
    },
    {
      title: 'Instalação profissional',
      description: 'Equipa certificada para fachadas e envelopamento.',
      to: '/contato',
      cta: 'Saber mais',
      gradient: 'from-amber-500/20 to-orange-500/10',
    },
  ],
}

export const storeFeatures: FeatureItem[] = [
  {
    icon: Ruler,
    title: 'Medidas à sua mão',
    description: 'Cálculo automático por área para banners, lonas, adesivos e mais.',
  },
  {
    icon: Upload,
    title: 'Upload de arte',
    description: 'PDF, PNG ou AI — preview antes de aprovar a produção.',
  },
  {
    icon: Palette,
    title: 'Acabamentos premium',
    description: 'Laminação, corte especial, ilhós e montagem disponíveis.',
  },
  {
    icon: Clock,
    title: 'Prazos claros',
    description: 'Estimativa de produção visível em cada produto.',
  },
  {
    icon: Truck,
    title: 'Entrega ou instalação',
    description: 'Envio nacional ou equipa no local para fachadas e frotas.',
  },
  {
    icon: ShieldCheck,
    title: 'Compra segura',
    description: 'Pagamento protegido e histórico na sua conta.',
  },
]

export const storeTrust = {
  caption: 'Marcas que confiam na nossa produção',
  brands: ['Retail', 'Automóvel', 'Horeca', 'Eventos', 'Corporate'],
}

export const contactContent = {
  title: 'Contacto',
  subtitle: 'Equipa comercial e suporte técnico para o seu projeto.',
  email: 'comercial@graficaonline.pt',
  phone: '+351 210 000 000',
  hours: 'Seg–Sex, 9h–18h',
  address: 'Lisboa, Portugal',
}

export const partnersContent = {
  title: 'Revendedores & parceiros',
  subtitle: 'White label, margens dedicadas e suporte para gráficas parceiras.',
  benefits: [
    { icon: Sparkles, title: 'Marca própria', description: 'Portal com o seu logótipo e domínio.' },
    { icon: Award, title: 'Tabela parceiro', description: 'Preços diferenciados por volume.' },
    { icon: MessageCircle, title: 'Suporte dedicado', description: 'Linha directa com produção.' },
  ],
}
