import { Avatar, AvatarFallback, AvatarImage } from '@inmediam/ui'

import type { MensagemView, Participante } from '../../entities/interface'
import { getInitialsName } from '../../utils/get-initials-name'
import { ChatAnexoList } from '../anexo/chat-anexo-list'

interface ChatMessageIncomingProps {
  message: MensagemView
  participante: Participante
}

export function ChatMessageIncoming({
  message,
  participante,
}: ChatMessageIncomingProps) {
  const nome = participante?.nome ?? ''

  return (
    <div className="flex items-start pr-8">
      <div className="flex min-w-0 max-w-[560px] flex-1 gap-3">
        <div className="relative h-10 w-10 shrink-0">
          <Avatar className="h-10 w-10 border border-[hsl(var(--border-primary)/0.08)]">
            <AvatarImage src={participante?.foto ?? undefined} />
            <AvatarFallback className="bg-quaternary text-xs font-semibold text-secondary">
              {getInitialsName({ name: nome })}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <p className="min-w-0 flex-1 overflow-hidden text-ellipsis text-sm font-medium text-secondary">
              {message.author}
            </p>
            <span className="shrink-0 text-xs text-quaternary">
              {message.time}
            </span>
          </div>
          <div className="w-full rounded-bl-lg rounded-br-lg rounded-tr-lg border border-secondary bg-tertiary px-3 py-2">
            <p className="whitespace-pre-wrap text-base font-normal leading-6 text-primary [overflow-wrap:anywhere]">
              {message.body}
            </p>
            {message.anexos.length > 0 && (
              <ChatAnexoList anexos={message.anexos} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
