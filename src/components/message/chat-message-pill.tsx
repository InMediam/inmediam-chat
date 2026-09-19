import type { KeyboardEvent, ReactNode } from 'react'

interface ChatMessagePillProps {
  draft: string
  actions: ReactNode
  onDraftChange: (value: string) => void
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  onFocus: () => void
  onBlur: (event: React.FocusEvent) => void
}

export function ChatMessagePill({
  draft,
  actions,
  onDraftChange,
  onKeyDown,
  onFocus,
  onBlur,
}: ChatMessagePillProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-secondary bg-primary px-3.5 py-3"
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <input
        type="text"
        value={draft}
        onChange={(event) => onDraftChange(event.target.value)}
        onKeyDown={onKeyDown}
        className="flex-1 border-0 bg-transparent p-0 text-sm text-primary outline-none placeholder:text-placeholder"
        placeholder="Escreva sua mensagem..."
      />
      <div className="shrink-0">{actions}</div>
    </div>
  )
}
