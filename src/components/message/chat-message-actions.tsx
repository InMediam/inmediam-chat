import { ArrowUp, Paperclip, Smile } from 'lucide-react'

interface ChatMessageActionsProps {
  canAttach: boolean
  isSending: boolean
  onAttach: () => void
  onSend: () => void
}

export function ChatMessageActions({
  canAttach,
  isSending,
  onAttach,
  onSend,
}: ChatMessageActionsProps) {
  // onMouseDown em vez de onClick: o clique no clipe não pode roubar o foco do
  // campo, senão o composer colapsa antes de abrir o seletor de arquivos.
  function handleAttachMouseDown(event: React.MouseEvent) {
    event.preventDefault()
    onAttach()
  }

  return (
    <div className="flex items-center gap-1">
      {canAttach && !isSending && (
        <button
          type="button"
          className="rounded-md p-1.5 text-fg-quaternary hover:text-fg-tertiary"
          aria-label="Adicionar anexo"
          onMouseDown={handleAttachMouseDown}
        >
          <Paperclip className="h-4 w-4" />
        </button>
      )}
      <button
        type="button"
        className="rounded-md p-1.5 text-fg-quaternary hover:text-fg-tertiary"
        aria-label="Emoji"
      >
        <Smile className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={isSending}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-tertiary shadow-sm hover:bg-brand-primary disabled:opacity-50"
        aria-label="Enviar mensagem"
        onClick={onSend}
      >
        <ArrowUp className="h-4 w-4 text-fg-primary-solid" />
      </button>
    </div>
  )
}
