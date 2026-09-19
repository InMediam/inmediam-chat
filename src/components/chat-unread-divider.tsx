interface ChatUnreadDividerProps {
  count: number
}

export function ChatUnreadDivider({ count }: ChatUnreadDividerProps) {
  const label =
    count > 1 ? `${count} mensagens não lidas` : '1 mensagem não lida'

  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-brand-tertiary" />
      <span className="shrink-0 text-sm font-semibold tracking-wide text-brand-tertiary">
        {label}
      </span>
      <div className="h-px flex-1 bg-brand-tertiary" />
    </div>
  )
}
