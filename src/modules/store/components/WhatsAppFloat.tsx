import { MessageCircle } from 'lucide-react'
import { env } from '@/core/env'
import { cn } from '@/lib/utils'

const DEFAULT_MSG = 'Olá! Gostaria de um orçamento para comunicação visual.'

export function WhatsAppFloat({ className }: { className?: string }) {
  const phone = env.whatsappPhone?.replace(/\D/g, '')
  if (!phone) return null

  const href = `https://wa.me/${phone}?text=${encodeURIComponent(DEFAULT_MSG)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar via WhatsApp"
      className={cn(
        'fixed right-4 bottom-4 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 active:scale-95',
        className,
      )}
    >
      <MessageCircle className="size-7" />
    </a>
  )
}
