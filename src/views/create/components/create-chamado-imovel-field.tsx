import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@inmediam/ui'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { useChatAdapter } from '../../../adapter/use-chat-adapter'
import type { LocacaoChamado } from '../../../entities/interface'
import { useChamadosChat } from '../../../hooks/use-chamados-chat'
import { useDebouncedValue } from '../../../hooks/use-debounced-value'
import { formatFullAddress } from '../../../utils/formatter/address-formatter'
import { ChamadoSchema } from '../../../validations/chamado-schema'

const MIN_SEARCH_LENGTH = 3
const SEARCH_DEBOUNCE_MS = 350

export function CreateChamadoImovelField() {
  const { locacaoId } = useChamadosChat()
  const { fetchLocacoes } = useChatAdapter()
  const { setValue, watch } = useFormContext<ChamadoSchema>()

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedLocacao, setSelectedLocacao] = useState<LocacaoChamado | null>(
    null,
  )

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)
  const trimmedSearch = debouncedSearch.trim()
  const effectiveSearch =
    trimmedSearch.length >= MIN_SEARCH_LENGTH ? trimmedSearch : ''

  const {
    data: locacoes,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ['chamados', 'locacoes', locacaoId ?? null, effectiveSearch],
    queryFn: () =>
      fetchLocacoes({ locacaoId, search: effectiveSearch || undefined }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })

  const isLocked = locacaoId !== undefined
  const selectedId = watch('locacao_id')
  const options = locacoes ?? []

  const selected =
    selectedLocacao && String(selectedLocacao.id) === selectedId
      ? selectedLocacao
      : (options.find((locacao) => String(locacao.id) === selectedId) ?? null)

  function handleSelect(locacao: LocacaoChamado) {
    setSelectedLocacao(locacao)
    setValue('locacao_id', String(locacao.id), { shouldValidate: true })
    setValue('destinatario', '')
    setSearch('')
    setIsOpen(false)
  }

  return (
    <Popover modal open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          id="locacao_id"
          type="button"
          disabled={isPending || isLocked}
          className="shadow-xs flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span
            className="h-4 w-2/3 animate-pulse rounded bg-quaternary data-[pending=false]:hidden"
            data-pending={isPending}
          />
          <span
            className="truncate text-muted-foreground data-[pending=true]:hidden data-[selected=true]:text-foreground"
            data-pending={isPending}
            data-selected={!!selected}
          >
            {selected
              ? formatFullAddress({ imovel: selected.imovel })
              : 'Selecione uma opção'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Pesquisar imóvel..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <div
              className="flex-col gap-2 p-3 data-[fetching=true]:flex data-[fetching=false]:hidden"
              data-fetching={isFetching}
            >
              <div className="h-4 w-3/4 animate-pulse rounded bg-quaternary" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-tertiary" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-tertiary" />
            </div>

            {!isFetching && (
              <CommandEmpty>Nenhum imóvel encontrado.</CommandEmpty>
            )}

            {!isFetching &&
              options.map((locacao) => (
                <CommandItem
                  key={locacao.id}
                  className="truncate"
                  value={String(locacao.id)}
                  onSelect={() => handleSelect(locacao)}
                >
                  <Check
                    data-selected={selectedId === String(locacao.id)}
                    className="h-4 w-4 opacity-0 data-[selected=true]:opacity-100"
                  />
                  {formatFullAddress({ imovel: locacao.imovel })}
                </CommandItem>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
