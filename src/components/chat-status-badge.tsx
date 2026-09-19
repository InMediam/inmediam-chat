import { cn } from '@inmediam/ui'

import { ChamadoStatus, getChamadoStatusLabel } from '../entities/status'

interface ChatStatusBadgeProps {
  status: ChamadoStatus
  className?: string
}

export function ChatStatusBadge({ status, className }: ChatStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-md border border-primary bg-card px-2 py-0.5 text-xs font-medium text-primary shadow-sm',
        className,
      )}
    >
      {getChamadoStatusLabel(status)}
    </span>
  )
}
