import { ArrowUp, Paperclip, Smile } from 'lucide-react'

interface ChatMessageActionsProps {
  canAttach: boolean
  isSending: boolean
  disabled: boolean
  onAttach: () => void
  onSend: () => void
}

export function ChatMessageActions({
  canAttach,
  isSending,
  disabled,
  onAttach,
  onSend,
}: ChatMessageActionsProps) {
  function handleAttachMouseDown(event: React.MouseEvent) {
    event.preventDefault()
    onAttach()
  }

  return (
    <div className="flex items-center gap-1">
      {canAttach && !isSending && (
        <button
          type="button"
          disabled={disabled}
          className="rounded-md p-1.5 text-fg-quaternary hover:text-fg-tertiary disabled:pointer-events-none disabled:opacity-50"
          aria-label="Adicionar anexo"
          onMouseDown={handleAttachMouseDown}
        >
          <Paperclip className="h-4 w-4" />
        </button>
      )}
      <button
        type="button"
        disabled={disabled}
        className="rounded-md p-1.5 text-fg-quaternary hover:text-fg-tertiary disabled:pointer-events-none disabled:opacity-50"
        aria-label="Emoji"
      >
        <Smile className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={isSending || disabled}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-tertiary shadow-sm hover:bg-brand-primary disabled:pointer-events-none disabled:opacity-50"
        aria-label="Enviar mensagem"
        onClick={onSend}
      >
        <ArrowUp className="h-4 w-4 text-fg-primary-solid" />
      </button>
    </div>
  )
}
