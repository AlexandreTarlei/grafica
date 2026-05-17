import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

type LoadingTableProps = {
  columns?: number
  rows?: number
  className?: string
  dense?: boolean
}

export function LoadingTable({ columns = 5, rows = 6, className, dense }: LoadingTableProps) {
  const cellPy = dense ? 'py-2' : 'py-3'
  return (
    <div
      className={cn('shadow-card overflow-hidden rounded-xl ring-1 ring-border/60', className)}
      aria-busy="true"
      aria-label="A carregar tabela"
    >
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i} className="px-4">
                <Skeleton className="h-3 w-16" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, ri) => (
            <TableRow key={ri}>
              {Array.from({ length: columns }).map((_, ci) => (
                <TableCell key={ci} className={cn('px-4', cellPy)}>
                  <Skeleton className="h-4 w-full max-w-[12rem]" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
