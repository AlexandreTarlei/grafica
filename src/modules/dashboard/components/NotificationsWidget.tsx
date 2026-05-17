import { Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/modules/signage/shared/components/StatusBadge'

type NotificationsWidgetProps = {
  items?: { label: string; tone: 'success' | 'warning' | 'danger' | 'info' }[]
}

export function NotificationsWidget({ items = [] }: NotificationsWidgetProps) {
  const list =
    items.length > 0
      ? items
      : [{ label: 'Sem notificações novas', tone: 'info' as const }]

  return (
    <Card className="shadow-card ring-1 ring-border/50">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Bell className="text-muted-foreground size-4" />
        <CardTitle className="text-base font-semibold">Notificações</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-wrap gap-2">
          {list.map((item) => (
            <li key={item.label}>
              <StatusBadge label={item.label} tone={item.tone} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
