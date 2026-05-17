import { Link } from 'react-router-dom'
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useConfirmDialog } from '@/components/data-table/confirm-dialog'
import type { RowActionItem } from '@/components/data-table/types'
import { cn } from '@/lib/utils'

const iconMap = {
  view: Eye,
  edit: Pencil,
  delete: Trash2,
} as const

type DataTableRowActionsProps = {
  items: RowActionItem[]
  primaryHref?: string
  primaryLabel?: string
  className?: string
}

export function DataTableRowActions({
  items,
  primaryHref,
  primaryLabel = 'Ver',
  className,
}: DataTableRowActionsProps) {
  const { confirm, dialog } = useConfirmDialog()
  const visible = items.filter((i) => !i.hidden)
  if (visible.length === 0 && !primaryHref) return null

  const runClick = (item: RowActionItem) => {
    if (!item.onClick) return
    const needsConfirm = item.confirm ?? (item.destructive ? { title: item.label } : undefined)
    if (needsConfirm) {
      confirm({
        title: needsConfirm.title,
        description: needsConfirm.description,
        destructive: item.destructive,
        onConfirm: item.onClick,
      })
      return
    }
    item.onClick()
  }

  return (
    <>
      <div className={cn('flex items-center justify-end gap-1', className)}>
        {primaryHref ? (
          <Button
            variant="ghost"
            size="sm"
            render={<Link to={primaryHref} />}
            nativeButton={false}
            className="hidden sm:inline-flex"
          >
            <Eye className="size-4" />
            {primaryLabel}
          </Button>
        ) : null}
        {visible.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted"
              aria-label="Ações"
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {visible.map((item, idx) => {
                const showSep = item.destructive && idx > 0
                const content = (
                  <>
                    {item.icon}
                    {item.label}
                  </>
                )
                return (
                  <span key={item.label}>
                    {showSep ? <DropdownMenuSeparator /> : null}
                    {item.href ? (
                      <DropdownMenuItem
                        variant={item.destructive ? 'destructive' : 'default'}
                        render={<Link to={item.href} />}
                        nativeButton={false}
                      >
                        {content}
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        variant={item.destructive ? 'destructive' : 'default'}
                        onClick={() => runClick(item)}
                      >
                        {content}
                      </DropdownMenuItem>
                    )}
                  </span>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
      {dialog}
    </>
  )
}

export function rowAction(
  label: string,
  opts: Omit<RowActionItem, 'label'> & { kind?: keyof typeof iconMap },
): RowActionItem {
  const Icon = opts.kind ? iconMap[opts.kind] : undefined
  return {
    label,
    icon: Icon ? <Icon className="mr-2 size-4" /> : opts.icon,
    href: opts.href,
    onClick: opts.onClick,
    destructive: opts.destructive,
    hidden: opts.hidden,
    confirm: opts.confirm,
  }
}
