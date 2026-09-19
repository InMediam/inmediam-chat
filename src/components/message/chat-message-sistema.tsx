import type { MensagemView } from '../../entities/interface'

interface ChatMessageSistemaProps {
  message: MensagemView
}

export function ChatMessageSistema({ message }: ChatMessageSistemaProps) {
  return (
    <div className="flex justify-center">
      <div className="max-w-[80%] rounded-md border border-brand bg-brand-primary px-3 py-1.5 text-center text-xs font-medium text-brand-primary">
        {message.body}
        <span className="ml-2 text-[10px] font-normal text-brand-secondary">
          {message.time}
        </span>
      </div>
    </div>
  )
}
