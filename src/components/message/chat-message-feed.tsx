import { Button } from '@inmediam/ui'
import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { ChevronDown } from 'lucide-react'
import { Fragment, useCallback, useMemo, useRef } from 'react'
import { toast } from 'sonner'

import { useChatAdapter } from '../../adapter/use-chat-adapter'
import { useChatHttp } from '../../adapter/use-chat-http'
import { marcarMensagensLidas } from '../../api/marcar-mensagens-lidas'
import { isChamadoLido } from '../../entities/read-state'
import { marcarChamadoLidoNoCache } from '../../hooks/use-chamado-cache'
import { useChamadoMensagens } from '../../hooks/use-chamado-mensagens'
import { useChamadoMensagensRealtime } from '../../hooks/use-chamado-mensagens-realtime'
import { useChamadoSelecionado } from '../../hooks/use-chamado-selecionado'
import { useChamadosChat } from '../../hooks/use-chamados-chat'
import { useChamadosList } from '../../hooks/use-chamados-list'
import { useChatMessageFeed } from '../../hooks/use-chat-message-feed'
import { groupMensagensByDate } from '../../utils/chat-utils'
import { getHttpErrorMessage } from '../../utils/get-http-error-message'
import { ChatDateDivider } from '../chat-date-divider'
import { ChatMessage } from '../chat-message'
import { ChatUnreadDivider } from '../chat-unread-divider'
import { ChatMessageSkeleton } from './chat-message-skeleton'

export function ChatMessageFeed() {
  const queryClient = useQueryClient()
  const { selectedId } = useChamadosChat()
  const { chamados } = useChamadosList()
  const { isAuthenticated } = useChatAdapter()
  const http = useChatHttp()
  const { chamado, isPending: isPendingDetail } = useChamadoSelecionado()
  const {
    messages,
    isLoading: isLoadingMensagens,
    isFetchingMore,
    hasMoreMessages,
    fetchOlderMessages,
  } = useChamadoMensagens(selectedId, isAuthenticated)

  // O canal por chamado é o que entrega a mensagem do outro lado no feed
  // aberto; `useChamadosRealtime` só cuida da lista.
  useChamadoMensagensRealtime(selectedId)

  const groups = useMemo(() => groupMensagensByDate(messages), [messages])
  const isLoadingDetail = isPendingDetail || isLoadingMensagens

  const { mutate: marcarLidas } = useMutation({
    mutationFn: (chamadoId: number) => marcarMensagensLidas(http, chamadoId),
    onSuccess: (_, chamadoId) => {
      marcarChamadoLidoNoCache(queryClient, chamadoId)
    },
    onError(error) {
      if (!isAxiosError(error)) {
        toast.error('Erro desconhecido, tente novamente mais tarde')
        return
      }
      toast.error(getHttpErrorMessage(error))
    },
  })

  // Evita disparar a mutation repetidamente enquanto ela está em andamento.
  const markingRef = useRef<number | null>(null)
  const handleMessagesSeen = useCallback(() => {
    if (selectedId === null) return
    const readState = chamados.find(
      (item) => item.id === selectedId,
    )?.read_state
    if (
      readState &&
      !isChamadoLido(readState) &&
      markingRef.current !== selectedId
    ) {
      markingRef.current = selectedId
      marcarLidas(selectedId, {
        onSettled: () => {
          if (markingRef.current === selectedId) markingRef.current = null
        },
      })
    }
  }, [selectedId, chamados, marcarLidas])

  const handleLoadOlder = useCallback(() => {
    if (hasMoreMessages && !isFetchingMore) fetchOlderMessages()
  }, [hasMoreMessages, isFetchingMore, fetchOlderMessages])

  const {
    feedRef,
    topSentinelRef,
    firstUnreadId,
    dividerCount,
    unreadCount,
    showScrollButton,
    handleScroll,
    handleScrollToBottom,
  } = useChatMessageFeed({
    chamadoId: chamado?.id ?? null,
    groups,
    hasMoreMessages,
    isFetchingMore,
    onLoadOlder: handleLoadOlder,
    onSeen: handleMessagesSeen,
  })

  return (
    <div className="relative min-h-0 flex-1">
      <div
        className="h-full overflow-y-auto bg-primary px-6 py-6 data-[pending=false]:hidden"
        data-pending={isLoadingDetail}
      >
        <div className="flex w-full flex-col gap-6">
          <ChatMessageSkeleton />
          <ChatMessageSkeleton isOwner />
          <ChatMessageSkeleton />
          <ChatMessageSkeleton isOwner />
          <ChatMessageSkeleton />
        </div>
      </div>

      <div
        ref={feedRef}
        onScroll={handleScroll}
        data-pending={isLoadingDetail}
        className="h-full overflow-y-auto bg-primary px-6 py-6 data-[pending=true]:hidden"
      >
        {hasMoreMessages && <div ref={topSentinelRef} className="h-1" />}

        <div
          className="flex-col gap-4 pb-4 data-[fetching=true]:flex data-[fetching=false]:hidden"
          data-fetching={isFetchingMore}
        >
          <ChatMessageSkeleton />
          <ChatMessageSkeleton isOwner />
        </div>

        <div className="flex w-full flex-col gap-6">
          {groups.map((group) => (
            <div key={group.id} className="flex flex-col gap-4">
              <ChatDateDivider label={group.label} />
              {group.messages.map((message) => (
                <Fragment key={message.id}>
                  {message.id === firstUnreadId && (
                    <ChatUnreadDivider count={dividerCount} />
                  )}
                  <ChatMessage
                    message={message}
                    participante={chamado?.participante ?? null}
                  />
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {showScrollButton && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleScrollToBottom}
          className="absolute bottom-4 right-4 gap-2 rounded-full shadow-md duration-300 animate-in fade-in slide-in-from-bottom-4"
        >
          {unreadCount > 1 ? `${unreadCount} novas mensagens` : 'Nova mensagem'}
          <ChevronDown className="h-4 w-4" aria-hidden />
        </Button>
      )}
    </div>
  )
}
