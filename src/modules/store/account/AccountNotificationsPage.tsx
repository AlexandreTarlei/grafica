import { Bell } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const PLACEHOLDER = [
  { id: '1', title: 'Pedido em produção', body: 'O seu pedido entrou na fila de impressão.', when: 'Há 2 h' },
  { id: '2', title: 'Arte recebida', body: 'A equipa está a rever os ficheiros enviados.', when: 'Ontem' },
]

export function AccountNotificationsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Notificações</h2>
      <p className="text-muted-foreground text-sm">
        Alertas de pedidos, produção e aprovação de arte (sincronização em tempo real em breve).
      </p>
      <ul className="space-y-3">
        {PLACEHOLDER.map((n) => (
          <li key={n.id}>
            <Card>
              <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
                <Bell className="text-primary mt-0.5 size-5 shrink-0" />
                <div>
                  <CardTitle className="text-base">{n.title}</CardTitle>
                  <CardDescription>{n.when}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0 text-sm">{n.body}</CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
