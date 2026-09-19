import { Tabs, TabsList, TabsTrigger } from '@inmediam/ui'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { ChamadoFiltro } from '../entities/enum'
import { CHAMADO_FILTRO } from '../entities/enum'

interface ChatFilterTabsProps {
  value: ChamadoFiltro
  onChange: (value: ChamadoFiltro) => void
}

const FILTERS: { value: ChamadoFiltro; label: string }[] = [
  { value: CHAMADO_FILTRO.TODOS, label: 'Todos' },
  { value: CHAMADO_FILTRO.NAO_LIDOS, label: 'Não lidos' },
  { value: CHAMADO_FILTRO.EM_ABERTO, label: 'Em aberto' },
  { value: CHAMADO_FILTRO.FINALIZADOS, label: 'Finalizados' },
]

export function ChatFilterTabs({ value, onChange }: ChatFilterTabsProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(false)

  const updateFades = useCallback(() => {
    const el = listRef.current
    if (!el) return
    setShowLeftFade(el.scrollLeft > 4)
    setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const active = listRef.current?.querySelector('[data-state="active"]')
    if (active instanceof HTMLElement) {
      active.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
    updateFades()
  }, [value, updateFades])

  useEffect(() => {
    window.addEventListener('resize', updateFades)
    return () => window.removeEventListener('resize', updateFades)
  }, [updateFades])

  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as ChamadoFiltro)}>
      <div className="relative">
        <TabsList
          ref={listRef}
          onScroll={updateFades}
          className="flex w-full scroll-px-6 justify-start overflow-x-auto overflow-y-hidden rounded-lg border border-secondary bg-secondary p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {FILTERS.map((filter) => (
            <TabsTrigger
              key={filter.value}
              value={filter.value}
              className="h-9 shrink-0 whitespace-nowrap rounded-md px-3 text-sm font-semibold text-quaternary data-[state=active]:border data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-secondary data-[state=active]:shadow-sm"
            >
              {filter.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {showLeftFade && (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 rounded-l-lg bg-gradient-to-r from-[hsl(var(--bg-secondary))] to-transparent" />
        )}
        {showRightFade && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 rounded-r-lg bg-gradient-to-l from-[hsl(var(--bg-secondary))] to-transparent" />
        )}
      </div>
    </Tabs>
  )
}
