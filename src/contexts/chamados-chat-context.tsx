import { createContext, useCallback, useDeferredValue, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { ChamadoFiltro } from '../entities/enum'
import { CHAMADO_FILTRO } from '../entities/enum'

export const CHAMADO_DIALOG = {
  NOVO: 'novo',
  DETAILS: 'details',
  FINALIZAR: 'finalizar',
  REABRIR: 'reabrir',
} as const

export type ChamadoDialog = (typeof CHAMADO_DIALOG)[keyof typeof CHAMADO_DIALOG]

export const CHAMADOS_CHAT_MOBILE_VIEW = {
  LIST: 'list',
  CHAT: 'chat',
} as const

export type ChamadosChatMobileView =
  (typeof CHAMADOS_CHAT_MOBILE_VIEW)[keyof typeof CHAMADOS_CHAT_MOBILE_VIEW]

const FILTER_VALUES: ChamadoFiltro[] = [
  CHAMADO_FILTRO.TODOS,
  CHAMADO_FILTRO.EM_ABERTO,
  CHAMADO_FILTRO.FINALIZADOS,
  CHAMADO_FILTRO.NAO_LIDOS,
]

const MIN_SEARCH_LENGTH = 3

interface ChamadosChatContextProps {
  locacaoId?: number
  emptyStateDescription?: string
  filter: ChamadoFiltro
  search: string
  effectiveSearch: string
  selectedId: number | null
  mobileView: ChamadosChatMobileView
  dialog: ChamadoDialog | null
  draft: string
  setFilter: (filter: ChamadoFiltro) => void
  setSearch: (search: string) => void
  selectChamado: (id: number) => void
  clearSelection: () => void
  backToList: () => void
  openDialog: (dialog: ChamadoDialog) => void
  closeDialog: () => void
  setDraft: (value: string) => void
  clearDraft: (chamadoId: number) => void
}

interface ChamadosChatProviderProps {
  children: React.ReactNode
  locacaoId?: number
  defaultFilter?: ChamadoFiltro
  emptyStateDescription?: string
}

export const ChamadosChatContext = createContext<ChamadosChatContextProps>(
  {} as ChamadosChatContextProps,
)

function readFilterFromParams(
  params: URLSearchParams,
  fallback: ChamadoFiltro,
): ChamadoFiltro {
  const status = params.get('status')
  return status && FILTER_VALUES.includes(status as ChamadoFiltro)
    ? (status as ChamadoFiltro)
    : fallback
}

function readSelectedIdFromParams(params: URLSearchParams): number | null {
  const value = Number(params.get('chamado'))
  return Number.isInteger(value) && value > 0 ? value : null
}

export function ChamadosChatProvider({
  children,
  locacaoId,
  defaultFilter = CHAMADO_FILTRO.EM_ABERTO,
  emptyStateDescription,
}: ChamadosChatProviderProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileView, setMobileView] = useState<ChamadosChatMobileView>(
    CHAMADOS_CHAT_MOBILE_VIEW.LIST,
  )
  const [dialog, setDialog] = useState<ChamadoDialog | null>(null)
  const [drafts, setDrafts] = useState<Record<number, string>>({})

  const filter = readFilterFromParams(searchParams, defaultFilter)
  const selectedId = readSelectedIdFromParams(searchParams)
  const search = searchParams.get('search') ?? ''

  // O termo efetivo é derivado aqui, e não em cada consumidor, para que todos
  // os `useChamadosList` compartilhem a mesma query key e uma única requisição.
  const deferredSearch = useDeferredValue(search)
  const trimmedSearch = deferredSearch.trim()
  const effectiveSearch =
    trimmedSearch.length >= MIN_SEARCH_LENGTH ? trimmedSearch : ''

  const setSearch = useCallback(
    (next: string) => {
      setSearchParams(
        (state) => {
          const value = next.trim()
          if (value) state.set('search', value)
          else state.delete('search')
          return state
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setFilter = useCallback(
    (next: ChamadoFiltro) => {
      setSearchParams(
        (state) => {
          state.set('status', next)
          return state
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setSelectedId = useCallback(
    (next: number | null) => {
      setSearchParams(
        (state) => {
          if (next === null) state.delete('chamado')
          else state.set('chamado', String(next))
          return state
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const selectChamado = useCallback(
    (id: number) => {
      setSelectedId(id)
      setMobileView(CHAMADOS_CHAT_MOBILE_VIEW.CHAT)
    },
    [setSelectedId],
  )

  const clearSelection = useCallback(() => setSelectedId(null), [setSelectedId])

  const backToList = useCallback(
    () => setMobileView(CHAMADOS_CHAT_MOBILE_VIEW.LIST),
    [],
  )

  const openDialog = useCallback((next: ChamadoDialog) => setDialog(next), [])

  const closeDialog = useCallback(() => setDialog(null), [])

  const setDraft = useCallback(
    (value: string) => {
      if (selectedId === null) return
      setDrafts((prev) => ({ ...prev, [selectedId]: value }))
    },
    [selectedId],
  )

  const clearDraft = useCallback((chamadoId: number) => {
    setDrafts((prev) => {
      const next = { ...prev }
      delete next[chamadoId]
      return next
    })
  }, [])

  const draft = selectedId === null ? '' : (drafts[selectedId] ?? '')

  return (
    <ChamadosChatContext.Provider
      value={{
        locacaoId,
        emptyStateDescription,
        filter,
        search,
        effectiveSearch,
        selectedId,
        mobileView,
        dialog,
        draft,
        setFilter,
        setSearch,
        selectChamado,
        clearSelection,
        backToList,
        openDialog,
        closeDialog,
        setDraft,
        clearDraft,
      }}
    >
      {children}
    </ChamadosChatContext.Provider>
  )
}
