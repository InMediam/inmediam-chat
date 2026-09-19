import { cn } from '@inmediam/ui'

interface ChatMessageSkeletonProps {
  isOwner?: boolean
  className?: string
}

export function ChatMessageSkeleton({
  isOwner = false,
  className,
}: ChatMessageSkeletonProps) {
  return (
    <>
      {isOwner && (
        <div className={cn('flex items-start justify-end pl-8', className)}>
          <div className="flex max-w-[330px] flex-col gap-1.5">
            <div className="flex justify-end">
              <div className="h-3.5 w-20 animate-pulse rounded bg-quaternary" />
            </div>
            <div className="h-14 w-56 animate-pulse rounded-bl-lg rounded-br-lg rounded-tl-lg bg-quaternary" />
          </div>
        </div>
      )}

      {!isOwner && (
        <div className={cn('flex items-start pr-8', className)}>
          <div className="flex min-w-0 max-w-[560px] flex-1 gap-3">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-quaternary" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="h-3.5 w-24 animate-pulse rounded bg-quaternary" />
              <div className="h-14 w-full animate-pulse rounded-bl-lg rounded-br-lg rounded-tr-lg bg-tertiary" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
