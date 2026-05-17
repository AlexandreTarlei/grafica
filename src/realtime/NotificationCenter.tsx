import { motion, AnimatePresence } from 'framer-motion'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  useNotificationMutations,
  useNotificationsList,
  useUnreadNotificationsCount,
} from '@/realtime/useNotifications'

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat('pt-PT', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function NotificationCenter() {
  const unread = useUnreadNotificationsCount()
  const list = useNotificationsList(20)
  const { markRead, markAll } = useNotificationMutations()
  const count = unread.data ?? 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        aria-label="Notificações"
        className="relative rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Button variant="outline" size="icon" className="shrink-0">
          <Bell className="size-4" />
          <AnimatePresence>
            {count > 0 ? (
              <motion.span
                key={count}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className={cn(
                  'bg-primary text-primary-foreground absolute -top-1 -right-1',
                  'flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold',
                )}
              >
                {count > 99 ? '99+' : count}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between gap-2">
          <span>Notificações</span>
          {count > 0 ? (
            <button
              type="button"
              className="text-primary text-xs font-medium hover:underline"
              onClick={() => markAll.mutate()}
            >
              Marcar todas
            </button>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {list.isLoading ? (
          <div className="text-muted-foreground px-3 py-4 text-sm">A carregar…</div>
        ) : null}
        {!list.isLoading && (list.data?.items.length ?? 0) === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground px-3 py-6 text-center text-sm"
          >
            Sem notificações
          </motion.p>
        ) : null}
        {list.data?.items.map((n) => (
          <DropdownMenuItem
            key={n.id}
            className={cn('flex flex-col items-start gap-0.5 py-2', !n.read_at && 'bg-muted/40')}
            onClick={() => {
              if (!n.read_at) markRead.mutate(n.id)
            }}
          >
            <span className="text-sm font-medium">{n.title}</span>
            {n.body ? <span className="text-muted-foreground line-clamp-2 text-xs">{n.body}</span> : null}
            <span className="text-muted-foreground text-[10px]">{formatWhen(n.created_at)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
