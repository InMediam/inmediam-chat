import { cn } from '@inmediam/ui'
import { ReactNode } from 'react'

// Exceção consciente à regra de "sem wrapper genérico de apresentação"
// (component-patterns.md): são 30 linhas label/valor nas três abas de detalhe,
// e mantê-las inline tornaria cada aba ilegível por repetição.
interface ChamadosDetailsInfoRowProps {
  label: string
  value?: ReactNode
  className?: string
  labelClassName?: string
  valueClassName?: string
}

export function ChamadosDetailsInfoRow({
  label,
  value,
  className,
  labelClassName,
  valueClassName,
}: ChamadosDetailsInfoRowProps) {
  const hasValue =
    value !== null &&
    value !== undefined &&
    value !== '' &&
    !(typeof value === 'string' && value.trim() === '')

  return (
    <div className={cn('flex h-9 items-center gap-2', className)}>
      <span
        className={cn(
          'shrink-0 text-sm/5 font-medium text-quaternary',
          labelClassName,
        )}
      >
        {label}
      </span>
      <div
        className={cn(
          'min-w-0 flex-1 truncate text-right text-sm/5 font-medium text-primary',
          valueClassName,
        )}
      >
        {hasValue ? value : '-'}
      </div>
    </div>
  )
}
