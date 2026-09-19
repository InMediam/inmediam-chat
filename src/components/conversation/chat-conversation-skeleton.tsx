import { cn } from '@inmediam/ui'

export function ChatConversationSkeleton({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-4 border-b border-secondary bg-primary px-4 py-4',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="h-4 w-3/4 animate-pulse rounded bg-quaternary" />
          <div className="h-3.5 w-1/2 animate-pulse rounded bg-tertiary" />
        </div>
        <div className="h-3.5 w-10 shrink-0 animate-pulse rounded bg-tertiary" />
      </div>
      <div className="h-8 w-full animate-pulse rounded bg-tertiary" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-quaternary" />
          <div className="h-3.5 w-20 animate-pulse rounded bg-tertiary" />
        </div>
        <div className="h-5 w-16 animate-pulse rounded-md bg-tertiary" />
      </div>
    </div>
  )
}
