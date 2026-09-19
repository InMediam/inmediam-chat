import { Skeleton } from '@inmediam/ui'

import { useChamadoSelecionado } from '../hooks/use-chamado-selecionado'
import { formatFullAddress } from '../utils/formatter/address-formatter'
import { ChatStatusBadge } from './chat-status-badge'

export function ChatSubHeader() {
  const { chamado, isPending } = useChamadoSelecionado()

  const imovel = chamado?.imovel

  return (
    <div className="flex items-center justify-between gap-3 border-b border-secondary px-4 py-3 md:px-6 md:py-4">
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-primary">
          {chamado?.titulo ?? ''}
        </h3>
        {imovel && (
          <p className="truncate text-xs text-quaternary md:text-sm">
            {formatFullAddress({ imovel })}
          </p>
        )}

        {!imovel && isPending && <Skeleton className="h-5 w-96" />}
      </div>

      {chamado && <ChatStatusBadge status={chamado.status} />}
    </div>
  )
}
