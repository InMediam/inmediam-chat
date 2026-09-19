import { MENSAGEM_TIPO } from '../entities/enum'
import type { MensagemView, Participante } from '../entities/interface'
import { ChatMessageIncoming } from './message/chat-message-incoming'
import { ChatMessageOwn } from './message/chat-message-own'
import { ChatMessageSistema } from './message/chat-message-sistema'

interface ChatMessageProps {
  message: MensagemView
  participante: Participante
}

export function ChatMessage({ message, participante }: ChatMessageProps) {
  const isSistema = message.tipo === MENSAGEM_TIPO.SISTEMA
  const isOwner = message.isMe

  return (
    <>
      {isSistema && <ChatMessageSistema message={message} />}
      {!isSistema && isOwner && <ChatMessageOwn message={message} />}
      {!isSistema && !isOwner && (
        <ChatMessageIncoming message={message} participante={participante} />
      )}
    </>
  )
}
