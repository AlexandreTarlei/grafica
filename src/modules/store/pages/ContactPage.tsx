import { contactContent } from '@/modules/store/content/ecommerce-content'
import { Seo } from '@/modules/commercial/seo/Seo'
import { Mail, MapPin, Phone } from 'lucide-react'

export function ContactPage() {
  const C = contactContent
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <Seo title="Contato" description={C.subtitle} canonicalPath="/contato" />
      <h1 className="text-3xl font-bold tracking-tight">{C.title}</h1>
      <p className="text-muted-foreground mt-2 mb-10">{C.subtitle}</p>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="border-border bg-card rounded-xl border p-6">
          <Mail className="text-primary mb-3 size-6" />
          <p className="font-medium">E-mail</p>
          <p className="text-muted-foreground text-sm">{C.email}</p>
        </div>
        <div className="border-border bg-card rounded-xl border p-6">
          <Phone className="text-primary mb-3 size-6" />
          <p className="font-medium">Telefone</p>
          <p className="text-muted-foreground text-sm">{C.phone}</p>
          <p className="text-muted-foreground text-xs">{C.hours}</p>
        </div>
        <div className="border-border bg-card rounded-xl border p-6">
          <MapPin className="text-primary mb-3 size-6" />
          <p className="font-medium">Morada</p>
          <p className="text-muted-foreground text-sm">{C.address}</p>
        </div>
      </div>
    </div>
  )
}
