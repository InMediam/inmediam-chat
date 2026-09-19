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
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

import type { LocacaoChamado } from '../../../entities/interface'
import { formatFullAddress } from '../../../utils/formatter/address-formatter'
import { ChamadoSchema } from '../../../validations/chamado-schema'

interface CreateChamadoImovelFieldProps {
  locacoes: LocacaoChamado[]
  isLoading: boolean
  isLocked: boolean
}

export function CreateChamadoImovelField({
  locacoes,
  isLoading,
  isLocked,
}: CreateChamadoImovelFieldProps) {
  const { setValue, watch } = useFormContext<ChamadoSchema>()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selectedId = watch('locacao_id')
  const selected = locacoes.find((locacao) => String(locacao.id) === selectedId)

  const filtered = locacoes.filter((locacao) =>
    formatFullAddress({ imovel: locacao.imovel })
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  function handleSelect(locacao: LocacaoChamado) {
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
          disabled={isLoading || isLocked}
          data-selected={!!selected}
          className="shadow-xs flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="truncate text-muted-foreground data-[selected=true]:text-foreground">
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
            <CommandEmpty>Nenhum imóvel encontrado.</CommandEmpty>
            {filtered.map((locacao) => (
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
