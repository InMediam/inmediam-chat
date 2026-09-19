import { ChatWorkspace } from './components/chat-workspace'
import { ChamadosChatProvider } from './contexts/chamados-chat-context'
import type { ChamadoFiltro } from './entities/enum'
import { CHAMADO_FILTRO } from './entities/enum'

interface ChamadosChatProps {
  locacaoId?: number
  defaultFilter?: ChamadoFiltro
  containerClassName?: string
  emptyStateDescription?: string
}

export function ChamadosChat({
  locacaoId,
  defaultFilter = CHAMADO_FILTRO.EM_ABERTO,
  containerClassName,
  emptyStateDescription,
}: ChamadosChatProps) {
  return (
    <ChamadosChatProvider
      locacaoId={locacaoId}
      defaultFilter={defaultFilter}
      emptyStateDescription={emptyStateDescription}
    >
      <ChatWorkspace className={containerClassName} />
    </ChamadosChatProvider>
  )
}
