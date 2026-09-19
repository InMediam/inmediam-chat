import { Textarea } from '@inmediam/ui'
import { KeyboardEvent, useRef, useState } from 'react'

import { ANEXO_ACCEPT, MAX_ANEXOS } from '../../hooks/use-chamado-anexos'
import { useChatMessageComposer } from '../../hooks/use-chat-message-composer'
import { ChatMessageActions } from './chat-message-actions'
import { ChatMessageAttachments } from './chat-message-attachments'
import { ChatMessagePill } from './chat-message-pill'

export function ChatMessageInput() {
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
  const [isFocused, setIsFocused] = useState(false)

  const isExpanded = isFocused || draft.trim().length > 0 || previews.length > 0
  const hasAttachments = previews.length > 0 || isSending

  function handleContainerBlur(event: React.FocusEvent) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(false)
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleAttach() {
    setIsFocused(true)
    fileInputRef.current?.click()
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (
      event.key !== 'Enter' ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return
    }

    event.preventDefault()
    send()
  }

  // No textarea o Enter só envia com o cursor no fim, para não cortar uma
  // edição no meio de uma mensagem de várias linhas.
  function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
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

  const actions = (
    <ChatMessageActions
      canAttach={canAddMore}
      isSending={isSending}
      onAttach={handleAttach}
      onSend={send}
    />
  )

  const attachments = (
    <ChatMessageAttachments
      previews={previews}
      progress={progress}
      phaseLabel={phaseLabel}
      onRemove={removeFile}
    />
  )

  const pill = (
    <ChatMessagePill
      draft={draft}
      actions={actions}
      onDraftChange={setDraft}
      onKeyDown={handleInputKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={handleContainerBlur}
    />
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

      <div className="md:hidden">
        {hasAttachments && (
          <div className="mb-2 rounded-xl border border-secondary bg-primary px-3.5 py-2">
            {attachments}
          </div>
        )}
        {pill}
      </div>

      <div className="hidden md:block">
        {isExpanded && (
          <div
            className="rounded-xl border-2 border-primary bg-primary px-3.5 py-3"
            onBlur={handleContainerBlur}
          >
            {attachments}
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleTextareaKeyDown}
              autoFocus
              className="min-h-[96px] resize-none border-0 bg-transparent p-0 text-sm text-primary shadow-none focus-visible:ring-0"
              placeholder="Escreva sua mensagem..."
            />
            <div className="mt-2 flex justify-end">{actions}</div>
          </div>
        )}

        {!isExpanded && pill}
      </div>
    </div>
  )
}
