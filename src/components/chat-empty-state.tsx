import { cn } from '@inmediam/ui'
import { MessagesSquare } from 'lucide-react'

interface ChatEmptyStateProps {
  className?: string
  title: string
  description: string
}

export function ChatEmptyState({
  className,
  title,
  description,
}: ChatEmptyStateProps) {
  return (
    <section
      className={cn(
        'flex min-h-0 flex-1 flex-col items-center justify-center bg-primary px-6 py-10 text-center',
        className,
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-sm ring-1 ring-secondary">
        <MessagesSquare className="h-8 w-8 text-fg-quaternary" />
      </div>
      <h2 className="mt-5 text-base font-semibold text-primary">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-quaternary">{description}</p>
    </section>
  )
}
