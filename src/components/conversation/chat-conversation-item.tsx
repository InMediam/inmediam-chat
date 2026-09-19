import { Avatar, AvatarFallback, AvatarImage, Badge, cn } from '@inmediam/ui'

import type { Chamado } from '../../entities/interface'
import { CHAMADO_READ_STATE } from '../../entities/read-state'
import { useChamadosChat } from '../../hooks/use-chamados-chat'
import { formatDateStringToBrTZ } from '../../utils/formatter/date-formatter'
import { getInitialsName } from '../../utils/get-initials-name'
import { ChatStatusBadge } from '../chat-status-badge'

interface ChatConversationItemProps {
  chamado: Chamado
}

export function ChatConversationItem({ chamado }: ChatConversationItemProps) {
  const { selectedId, selectChamado } = useChamadosChat()

  const nome = chamado.participante?.nome ?? ''
  const isActive = chamado.id === selectedId

  return (
    <button
      type="button"
      onClick={() => selectChamado(chamado.id)}
      data-active={isActive}
      className={cn(
        'relative flex w-full min-w-0 flex-col gap-4 overflow-hidden border-b border-secondary bg-primary px-4 py-4 text-left transition-colors hover:bg-secondary',
        'data-[active=true]:bg-secondary',
      )}
      aria-label={chamado.titulo ?? ''}
    >
      <span
        className="absolute bottom-0 left-0 top-0 w-1 bg-brand-quaterary data-[active=false]:hidden"
        data-active={isActive}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-primary">
            {chamado.titulo ?? ''}
          </p>
          <p className="truncate text-sm text-quaternary">
            {chamado.subtitulo ?? ''}
          </p>
        </div>
        <span className="shrink-0 text-sm text-quaternary">
          {formatDateStringToBrTZ({ date: chamado.created_at })}
        </span>
      </div>

      <p className="line-clamp-2 w-full min-w-0 hyphens-auto text-sm text-tertiary [overflow-wrap:anywhere]">
        {chamado.preview ?? ''}
      </p>

      <div className="flex w-full items-center justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="relative h-6 w-6 shrink-0">
            <Avatar className="h-6 w-6">
              <AvatarImage src={chamado.participante?.foto ?? undefined} />
              <AvatarFallback className="bg-quaternary text-[10px] font-semibold text-secondary">
                {getInitialsName({ name: nome })}
              </AvatarFallback>
            </Avatar>
          </div>
          <span className="min-w-0 flex-1 truncate text-xs font-medium text-secondary">
            {nome}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {chamado.read_state === CHAMADO_READ_STATE.NOVO && (
            <Badge
              className="shrink-0 whitespace-nowrap rounded-md border-secondary bg-warning-secondary px-2 py-0.5 text-xs font-medium text-warning-primary"
              variant="outline"
            >
              Novo
            </Badge>
          )}
          {chamado.read_state === CHAMADO_READ_STATE.NAO_LIDO && (
            <Badge
              className="shrink-0 whitespace-nowrap rounded-md border-primary bg-transparent px-2 py-0.5 text-xs font-medium text-secondary"
              variant="outline"
            >
              Não lido
            </Badge>
          )}
          <ChatStatusBadge status={chamado.status} />
        </div>
      </div>
    </button>
  )
}
