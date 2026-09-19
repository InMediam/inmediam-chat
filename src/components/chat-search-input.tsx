import { zodResolver } from '@hookform/resolvers/zod'
import {
  Badge,
  Button,
  Input,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@inmediam/ui'
import { CornerDownLeft, HelpCircle, Search, X } from 'lucide-react'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { SearchSchema, searchSchema } from '../validations/search-schema'

interface ChatSearchInputProps {
  value: string
  onSearch: (search: string) => void
  placeholder: string
  tooltipContent: string
}

export function ChatSearchInput({
  value,
  onSearch,
  placeholder,
  tooltipContent,
}: ChatSearchInputProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search: value },
  })

  const search = useWatch({ control, name: 'search' })

  // O termo mora na URL: uma navegação (voltar/avançar) muda a prop sem passar
  // pelo submit, e o campo precisa acompanhar.
  useEffect(() => {
    reset({ search: value })
  }, [value, reset])

  function handleSearch(data: SearchSchema) {
    onSearch(data.search.trim())
  }

  function handleClear() {
    reset({ search: '' })
    if (value !== '') onSearch('')
  }

  return (
    <form className="flex flex-col gap-1" onSubmit={handleSubmit(handleSearch)}>
      <div className="relative flex w-full items-center">
        <Input
          {...register('search')}
          placeholder={placeholder}
          aria-invalid={!!errors.search}
          className="h-10 w-full pl-10 pr-[7.3rem]"
        />
        <Button
          className="absolute ml-1 h-8 w-8 border-none bg-transparent px-2"
          type="submit"
          variant="outline"
        >
          <Search className="h-5 w-5 text-fg-quaternary" />
        </Button>
        <Button
          className="absolute right-14 h-fit px-0 data-[search=false]:hidden"
          variant="ghost"
          data-search={!!search}
          type="submit"
        >
          <Badge className="h-5 gap-1 rounded-sm px-1" variant="outline">
            <CornerDownLeft className="h-3 w-3 text-fg-quaternary-hover" />
            <span className="text-xs font-medium text-quaternary">Enter</span>
          </Badge>
        </Button>

        <Button
          className="absolute right-7 flex h-fit w-fit items-center justify-center p-1 data-[search=false]:hidden"
          variant="ghost"
          data-search={!!search}
          type="button"
          aria-label="Limpar busca"
          onClick={handleClear}
        >
          <X className="h-4 w-4 text-fg-quaternary" />
        </Button>
        <Tooltip>
          <TooltipTrigger asChild type="button">
            <span className="absolute right-0 flex items-center justify-center">
              <HelpCircle className="absolute right-0 mr-2 h-4 w-4 text-fg-quaternary" />
            </span>
          </TooltipTrigger>
          <TooltipContent className="mb-2">{tooltipContent}</TooltipContent>
        </Tooltip>
      </div>
      {errors.search && (
        <span role="alert" className="px-1 text-xs text-error-primary">
          {errors.search.message}
        </span>
      )}
    </form>
  )
}
