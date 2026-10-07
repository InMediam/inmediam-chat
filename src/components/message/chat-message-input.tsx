import { Tooltip, TooltipContent, TooltipTrigger } from '@inmediam/ui'
import { KeyboardEvent, useRef } from 'react'

import { useChatAdapter } from '../../adapter/use-chat-adapter'
import { isChamadoFinalizado } from '../../entities/status'
import { ANEXO_ACCEPT, MAX_ANEXOS } from '../../hooks/use-chamado-anexos'
import { useChamadoSelecionado } from '../../hooks/use-chamado-selecionado'
import { useChatMessageComposer } from '../../hooks/use-chat-message-composer'
import { ChatMessageActions } from './chat-message-actions'
import { ChatMessageAttachments } from './chat-message-attachments'
import { ChatMessageTextarea } from './chat-message-textarea'

const FINALIZADO_TOOLTIP =
  'Este chamado foi finalizado e não aceita novas mensagens.'
const FINALIZADO_REABRIR_TOOLTIP = `${FINALIZADO_TOOLTIP} Reabra o chamado para continuar a conversa.`

export function ChatMessageInput() {
  const { capabilities } = useChatAdapter()
  const { chamado } = useChamadoSelecionado()
  const isFinalizado = isChamadoFinalizado(chamado?.status)

  const {
    draft,
    setDraft,
    isSending,
    progress,
    phaseLabel,
    previews,
    canAddMore,
    addFiles,
    removeFile,
    send,
  } = useChatMessageComposer()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const hasAttachments = !isFinalizado && (previews.length > 0 || isSending)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleAttach() {
    fileInputRef.current?.click()
  }

  // O Enter só envia com o cursor no fim, para não cortar uma edição no meio de
  // uma mensagem de várias linhas.
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key !== 'Enter' ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return
    }

    const target = event.currentTarget
    const isCaretAtEnd =
      target.selectionStart === target.value.length &&
      target.selectionEnd === target.value.length

    if (!isCaretAtEnd) return

    event.preventDefault()
    send()
  }

  const composer = (
    <div
      className="rounded-xl border border-secondary bg-primary px-3.5 py-3 focus-within:border-primary data-[finalizado=true]:cursor-not-allowed"
      data-finalizado={isFinalizado}
      tabIndex={isFinalizado ? 0 : undefined}
    >
      {hasAttachments && (
        <ChatMessageAttachments
          previews={previews}
          progress={progress}
          phaseLabel={phaseLabel}
          onRemove={removeFile}
        />
      )}

      <div className="flex items-center gap-3">
        <ChatMessageTextarea
          value={draft}
          onChange={setDraft}
          onKeyDown={handleKeyDown}
          placeholder={
            isFinalizado ? 'Chamado finalizado' : 'Escreva sua mensagem...'
          }
          disabled={isFinalizado}
        />
        <div className="shrink-0">
          <ChatMessageActions
            canAttach={canAddMore}
            isSending={isSending}
            disabled={isFinalizado}
            onAttach={handleAttach}
            onSend={send}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-secondary px-4 pb-5 pt-3 md:px-6">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ANEXO_ACCEPT}
        max={MAX_ANEXOS}
        className="hidden"
        onChange={handleFileChange}
      />

      <Tooltip open={isFinalizado ? undefined : false}>
        <TooltipTrigger asChild>{composer}</TooltipTrigger>
        <TooltipContent className="mb-2">
          {capabilities.reopenChamado
            ? FINALIZADO_REABRIR_TOOLTIP
            : FINALIZADO_TOOLTIP}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
