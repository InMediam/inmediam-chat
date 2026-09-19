import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
} from '@inmediam/ui'
import {
  ChevronLeft,
  CircleCheck,
  Info,
  MoreVertical,
  RotateCcw,
} from 'lucide-react'

import { useChatAdapter } from '../adapter/use-chat-adapter'
import { CHAMADO_DIALOG } from '../contexts/chamados-chat-context'
import { isChamadoFinalizado } from '../entities/status'
import { getParticipanteTipoLabel } from '../entities/tipo-participante'
import { useChamadoSelecionado } from '../hooks/use-chamado-selecionado'
import { useChamadosChat } from '../hooks/use-chamados-chat'
import { getInitialsName } from '../utils/get-initials-name'

export function ChatHeader() {
  const { backToList, openDialog } = useChamadosChat()
  const { capabilities } = useChatAdapter()
  const { chamado } = useChamadoSelecionado()

  const isFinalized = isChamadoFinalizado(chamado?.status)
  const nome = chamado?.participante?.nome ?? ''
  const foto = chamado?.participante?.foto ?? undefined
  const tipo = getParticipanteTipoLabel(chamado?.participante?.tipo)

  return (
    <header className="flex items-center justify-between border-b border-secondary bg-primary px-4 py-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={backToList}
          className="-ml-1 shrink-0 p-1 text-fg-quaternary-hover hover:text-fg-secondary md:hidden"
          aria-label="Voltar para lista de chamados"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="relative h-10 w-10 shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={foto} />
            <AvatarFallback className="bg-quaternary text-xs font-semibold text-secondary">
              {getInitialsName({ name: nome })}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-primary md:text-base">
            {nome}
          </h2>
          <p className="truncate text-xs text-quaternary md:text-sm">{tipo}</p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-fg-quaternary-hover hover:text-fg-secondary"
            aria-label="Mais ações do chamado"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="p-0">
          <DropdownMenuItem
            className="h-10 gap-2 px-4 text-sm/5 font-medium text-secondary"
            onSelect={() => openDialog(CHAMADO_DIALOG.DETAILS)}
          >
            <Info className="h-4 w-4" />
            Detalhes do chamado
          </DropdownMenuItem>
          <Separator />
          {isFinalized && capabilities.reopenChamado && (
            <DropdownMenuItem
              className="h-10 gap-2 px-4 text-sm/5 font-medium text-secondary"
              onSelect={() => openDialog(CHAMADO_DIALOG.REABRIR)}
            >
              <RotateCcw className="h-4 w-4" />
              Reabrir chamado
            </DropdownMenuItem>
          )}
          {!isFinalized && capabilities.finalizeChamado && (
            <DropdownMenuItem
              className="h-10 gap-2 px-4 text-sm/5 font-medium text-secondary"
              onSelect={() => openDialog(CHAMADO_DIALOG.FINALIZAR)}
            >
              <CircleCheck className="h-4 w-4" />
              Finalizar chamado
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
