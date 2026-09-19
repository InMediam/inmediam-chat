import { Avatar, AvatarFallback, AvatarImage } from '@inmediam/ui'

import { useChatAdapter } from '../../../adapter/use-chat-adapter'
import { ChatStatusBadge } from '../../../components/chat-status-badge'
import type { Chamado } from '../../../entities/interface'
import { getChamadoSolicitante } from '../../../utils/chat-utils'
import { formatDateStringToBrTZ } from '../../../utils/formatter/date-formatter'
import { getInitialsName } from '../../../utils/get-initials-name'
import { ChamadosDetailsInfoRow } from './chamados-details-info-row'

interface ChamadosDetailsTabProps {
  chamado: Chamado
}

export function ChamadosDetailsTab({ chamado }: ChamadosDetailsTabProps) {
  const { currentUser } = useChatAdapter()
  const solicitante = getChamadoSolicitante(chamado, currentUser)
  const nome = solicitante.nome
  const foto = solicitante.foto ?? undefined

  return (
    <div className="flex flex-col">
      <ChamadosDetailsInfoRow label="Protocolo" value={chamado.protocolo} />
      <ChamadosDetailsInfoRow
        label="Solicitado por"
        value={
          nome ? (
            <div className="flex items-center justify-end gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={foto} />
                <AvatarFallback className="bg-quaternary text-[10px] font-semibold text-secondary">
                  {getInitialsName({ name: nome })}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{nome}</span>
            </div>
          ) : null
        }
      />
      <ChamadosDetailsInfoRow
        label="Tipo de solicitação"
        value={chamado.subtitulo}
      />
      <ChamadosDetailsInfoRow
        label="Motivo da solicitação"
        value={chamado.titulo}
      />
      <ChamadosDetailsInfoRow
        label="Status"
        value={<ChatStatusBadge status={chamado.status} />}
      />
      <ChamadosDetailsInfoRow
        label="Data de abertura"
        value={
          chamado.created_at
            ? formatDateStringToBrTZ({ date: chamado.created_at })
            : null
        }
      />
    </div>
  )
}
