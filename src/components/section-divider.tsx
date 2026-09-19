import { cn } from '@inmediam/ui'
import { ComponentProps } from 'react'

export function SectionDivider({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex items-center justify-between gap-4', className)}
      {...props}
    >
      <div className="w-full border-t border-secondary" />
      <p className="inline w-fit whitespace-nowrap text-sm font-medium text-quinary">
        {children}
      </p>
      <div className="w-full border-t border-secondary" />
    </div>
  )
}
