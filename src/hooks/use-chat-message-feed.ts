import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import type { MensagemView, MensagemViewGroup } from '../entities/interface'

const BOTTOM_THRESHOLD_PX = 80

function isOwnerMessage(message: MensagemView) {
  return message.isMe
}

function isUnreadIncoming(message: MensagemView) {
  return !isOwnerMessage(message) && !message.read
}

interface UseChatMessageFeedParams {
  chamadoId: number | null
  groups: MensagemViewGroup[]
  hasMoreMessages: boolean
  isFetchingMore: boolean
  onLoadOlder?: () => void
  onSeen?: () => void
}

export function useChatMessageFeed({
  chamadoId,
  groups,
  hasMoreMessages,
  isFetchingMore,
  onLoadOlder,
  onSeen,
}: UseChatMessageFeedParams) {
  const feedRef = useRef<HTMLDivElement>(null)
  const topSentinelRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<{ scrollHeight: number; scrollTop: number } | null>(
    null,
  )
  const lastMessageIdRef = useRef<string | null>(null)
  const scannedChamadoRef = useRef<number | null>(null)

  /**
   * Posição do usuário *antes* de a mensagem nova entrar no DOM. Medir dentro
   * do layout effect não serve: ele roda com o `scrollHeight` já crescido, e
   * uma mensagem mais alta que o limite faria o feed concluir que o usuário
   * tinha saído do fim — deixando de acompanhar e de avisar.
   */
  const wasAtBottomRef = useRef(true)

  const onSeenRef = useRef(onSeen)
  useEffect(function keepOnSeenCallbackFresh() {
    onSeenRef.current = onSeen
  })

  const [firstUnreadId, setFirstUnreadId] = useState<string | null>(null)
  const [dividerCount, setDividerCount] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [snapshotChamadoId, setSnapshotChamadoId] = useState<number | null>(
    null,
  )

  const flatMessages = useMemo(
    () => groups.flatMap((group) => group.messages),
    [groups],
  )

  // Snapshot das não lidas ao abrir um chamado: deriva direto das mensagens
  // recebidas, sem effect. O scroll/markSeen fica no layout effect abaixo.
  if (snapshotChamadoId !== chamadoId && flatMessages.length > 0) {
    const unreadIncoming = flatMessages.filter(isUnreadIncoming)

    setSnapshotChamadoId(chamadoId)
    setFirstUnreadId(unreadIncoming[0]?.id ?? null)
    setDividerCount(unreadIncoming.length)
    setUnreadCount(0)
    setIsAtBottom(true)
  }

  const measureIsAtBottom = useCallback(() => {
    const feed = feedRef.current
    if (!feed) return true
    return (
      feed.scrollHeight - feed.scrollTop - feed.clientHeight <
      BOTTOM_THRESHOLD_PX
    )
  }, [])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    const feed = feedRef.current
    if (!feed) return
    feed.scrollTo({ top: feed.scrollHeight, behavior })
  }, [])

  const markSeen = useCallback(() => {
    onSeenRef.current?.()
  }, [])

  const handleScroll = useCallback(() => {
    const atBottom = measureIsAtBottom()
    wasAtBottomRef.current = atBottom
    setIsAtBottom(atBottom)
    if (atBottom) {
      setUnreadCount(0)
      markSeen()
    }
  }, [measureIsAtBottom, markSeen])

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom('smooth')
    wasAtBottomRef.current = true
    setIsAtBottom(true)
    setFirstUnreadId(null)
    setDividerCount(0)
    setUnreadCount(0)
    markSeen()
  }, [scrollToBottom, markSeen])

  useLayoutEffect(
    function restoreScrollPositionAfterPrepend() {
      const feed = feedRef.current
      if (!feed || !anchorRef.current) return
      const delta = feed.scrollHeight - anchorRef.current.scrollHeight
      feed.scrollTop = anchorRef.current.scrollTop + delta
      anchorRef.current = null
    },
    [groups],
  )

  useLayoutEffect(
    function snapshotUnreadMessagesOnOpen() {
      const feed = feedRef.current
      if (!feed) return
      if (scannedChamadoRef.current === chamadoId) return
      if (flatMessages.length === 0) return

      scannedChamadoRef.current = chamadoId
      anchorRef.current = null

      lastMessageIdRef.current =
        flatMessages[flatMessages.length - 1]?.id ?? null
      feed.scrollTop = feed.scrollHeight
      wasAtBottomRef.current = true
      markSeen()
    },
    [chamadoId, flatMessages, markSeen],
  )

  useLayoutEffect(
    function trackIncomingMessages() {
      const feed = feedRef.current
      if (!feed) return
      if (scannedChamadoRef.current !== chamadoId) return

      const lastId = flatMessages[flatMessages.length - 1]?.id ?? null
      if (!lastId || lastId === lastMessageIdRef.current) return

      const wasAtBottom = wasAtBottomRef.current
      const prevIndex = lastMessageIdRef.current
        ? flatMessages.findIndex((m) => m.id === lastMessageIdRef.current)
        : -1
      const newMessages = flatMessages.slice(prevIndex + 1)
      const newIncoming = newMessages.filter((m) => !isOwnerMessage(m))
      const sentByCurrentUser = newMessages.some(isOwnerMessage)

      if (wasAtBottom || sentByCurrentUser) {
        feed.scrollTop = feed.scrollHeight
        wasAtBottomRef.current = true
        setFirstUnreadId(null)
        setDividerCount(0)
        setUnreadCount(0)
        setIsAtBottom(true)
        markSeen()
      } else if (newIncoming.length > 0) {
        // O conteúdo cresce abaixo, então não mexemos no scroll: o usuário
        // permanece na mensagem atual e só sinalizamos as não lidas.
        setFirstUnreadId((prev) => prev ?? newIncoming[0].id)
        setDividerCount((count) => count + newIncoming.length)
        setUnreadCount((count) => count + newIncoming.length)
        setIsAtBottom(false)
      }

      lastMessageIdRef.current = lastId
    },
    [chamadoId, flatMessages, markSeen],
  )

  useEffect(
    function observeTopSentinelForOlderMessages() {
      const sentinel = topSentinelRef.current
      const feed = feedRef.current
      if (!sentinel || !feed || !hasMoreMessages || !onLoadOlder) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isFetchingMore) {
            anchorRef.current = {
              scrollHeight: feed.scrollHeight,
              scrollTop: feed.scrollTop,
            }
            onLoadOlder()
          }
        },
        { root: feed, rootMargin: '200px 0px 0px 0px', threshold: 0 },
      )

      observer.observe(sentinel)
      return () => observer.disconnect()
    },
    [hasMoreMessages, isFetchingMore, onLoadOlder],
  )

  return {
    feedRef,
    topSentinelRef,
    firstUnreadId,
    dividerCount,
    unreadCount,
    showScrollButton: !isAtBottom && unreadCount > 0,
    handleScroll,
    handleScrollToBottom,
  }
}
