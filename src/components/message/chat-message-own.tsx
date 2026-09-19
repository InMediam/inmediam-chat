import { Check, CheckCheck } from 'lucide-react'

import type { MensagemView } from '../../entities/interface'
import { ChatAnexoList } from '../anexo/chat-anexo-list'

interface ChatMessageOwnProps {
  message: MensagemView
}

export function ChatMessageOwn({ message }: ChatMessageOwnProps) {
  return (
    <div className="flex items-start justify-end pl-8">
      <div className="flex max-w-[560px] flex-col gap-1.5">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <p className="min-w-0 flex-1 overflow-hidden text-ellipsis text-sm font-medium text-secondary">
            Você
          </p>
          <div className="flex shrink-0 items-center gap-0.5">
            <span className="text-xs text-quaternary">{message.time}</span>
            {message.read && (
              <CheckCheck className="h-4 w-4 text-blue-500" aria-label="Lida" />
            )}
            {!message.read && (
              <Check
                className="h-4 w-4 text-fg-quaternary"
                aria-label="Enviada"
              />
            )}
          </div>
        </div>
        <div className="rounded-bl-lg rounded-br-lg rounded-tl-lg border border-secondary bg-tertiary px-3 py-2">
          <p className="whitespace-pre-wrap text-base font-normal leading-6 text-primary [overflow-wrap:anywhere]">
            {message.body}
          </p>
          {message.anexos.length > 0 && (
            <ChatAnexoList anexos={message.anexos} />
          )}
        </div>
      </div>
    </div>
  )
}
