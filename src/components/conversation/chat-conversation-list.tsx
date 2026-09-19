import { useChamadosChat } from '../../hooks/use-chamados-chat'
import { useChamadosList } from '../../hooks/use-chamados-list'
import { useInfiniteScroll } from '../../hooks/use-infinite-scroll'
import { ChatConversationItem } from './chat-conversation-item'
import { ChatConversationSkeleton } from './chat-conversation-skeleton'

const SKELETON_ROWS = 4

export function ChatConversationList() {
  const { search } = useChamadosChat()
  const {
    chamados,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useChamadosList()

  const { sentinelRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  })

  const isEmpty = !isPending && chamados.length === 0

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="data-[pending=false]:hidden" data-pending={isPending}>
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <ChatConversationSkeleton key={index} />
        ))}
      </div>

      <div
        className="flex h-full items-center justify-center px-6 py-10 text-center data-[empty=false]:hidden"
        data-empty={isEmpty}
      >
        <p className="text-sm text-quaternary">
          {search
            ? 'Nenhum chamado corresponde à sua busca.'
            : 'Nenhum chamado encontrado.'}
        </p>
      </div>

      {chamados.map((chamado) => (
        <ChatConversationItem key={chamado.id} chamado={chamado} />
      ))}

      <div
        className="data-[fetching=false]:hidden"
        data-fetching={isFetchingNextPage}
      >
        <ChatConversationSkeleton />
        <ChatConversationSkeleton />
      </div>

      <div
        ref={sentinelRef}
        className="h-1 data-[empty=true]:hidden"
        data-empty={isEmpty}
      />
    </div>
  )
}
