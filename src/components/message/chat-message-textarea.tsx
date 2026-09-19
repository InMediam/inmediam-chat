import { Textarea } from '@inmediam/ui'
import type { KeyboardEvent } from 'react'
import { useLayoutEffect, useRef } from 'react'

interface ChatMessageTextareaProps {
  value: string
  onChange: (value: string) => void
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
}

export function ChatMessageTextarea({
  value,
  onChange,
  onKeyDown,
}: ChatMessageTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(
    function growWithContent() {
      const textarea = textareaRef.current
      if (!textarea) return

      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    },
    [value],
  )

  return (
    <Textarea
      ref={textareaRef}
      rows={1}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
      placeholder="Escreva sua mensagem..."
      className="max-h-40 min-h-0 resize-none overflow-y-auto border-0 bg-transparent p-0.5 text-sm leading-5 text-primary shadow-none transition-[height] duration-150 focus-visible:ring-0"
    />
  )
}
