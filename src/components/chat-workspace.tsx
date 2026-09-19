import { cn } from '@inmediam/ui'
import { useEffect } from 'react'

import { useChatAdapter } from '../adapter/use-chat-adapter'
import { useChatCopy } from '../adapter/use-chat-copy'
import { CHAMADOS_CHAT_MOBILE_VIEW } from '../contexts/chamados-chat-context'
import { useChamadoSelecionado } from '../hooks/use-chamado-selecionado'
import { useChamadosChat } from '../hooks/use-chamados-chat'
import { useChamadosList } from '../hooks/use-chamados-list'
import { CreateChamadoDialog } from '../views/create/create-chamado-dialog'
import { ChamadosDetailsDialog } from '../views/details/chamados-details-dialog'
import { ChamadoFinalizarDialog } from '../views/finalizar/chamado-finalizar-dialog'
import { ChamadoReabrirDialog } from '../views/reabrir/chamado-reabrir-dialog'
import { ChatEmptyState } from './chat-empty-state'
import { ChatPanel } from './chat-panel'
import { ChatSidebar } from './chat-sidebar'

interface ChatWorkspaceProps {
  className?: string
}

export function ChatWorkspace({ className }: ChatWorkspaceProps) {
  const { mobileView, selectedId, clearSelection, emptyStateDescription } =
    useChamadosChat()
  const { capabilities } = useChatAdapter()
  const copy = useChatCopy()
  const { chamados, isPending } = useChamadosList()
  const { chamado, isError } = useChamadoSelecionado()

  // Chamado inválido/de outro cliente na URL: limpa a seleção.
  useEffect(() => {
    if (isError && selectedId !== null) {
      clearSelection()
    }
  }, [isError, selectedId, clearSelection])

  const panelClassName = cn(
    mobileView === CHAMADOS_CHAT_MOBILE_VIEW.LIST && 'hidden md:flex',
  )
  const hasChamados = chamados.length > 0
  const showNoChamados = !isPending && !hasChamados && !chamado
  const showSelectPrompt = !isPending && hasChamados && !chamado

  return (
    <>
      <div
        className={cn(
          'flex min-h-0 w-full flex-col overflow-hidden bg-primary md:flex-row',
          className,
        )}
      >
        <ChatSidebar
          className={cn(
            mobileView === CHAMADOS_CHAT_MOBILE_VIEW.CHAT && 'hidden md:flex',
          )}
        />

        {showNoChamados && (
          <ChatEmptyState
            className={panelClassName}
            title={copy.emptyListTitle}
            description={emptyStateDescription ?? copy.emptyListDescription}
          />
        )}

        {showSelectPrompt && (
          <ChatEmptyState
            className={panelClassName}
            title={copy.noSelectionTitle}
            description={copy.noSelectionDescription}
          />
        )}

        {chamado && <ChatPanel key={chamado.id} className={panelClassName} />}
      </div>

      {capabilities.createChamado && <CreateChamadoDialog />}
      <ChamadosDetailsDialog />
      <ChamadoFinalizarDialog />
      <ChamadoReabrirDialog />
    </>
  )
}
