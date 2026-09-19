import {
  HintText,
  InputItemsWrapper,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@inmediam/ui'
import { useQuery } from '@tanstack/react-query'
import { Controller, useFormContext } from 'react-hook-form'

import { useChatAdapter } from '../../../adapter/use-chat-adapter'
import { useChatCopy } from '../../../adapter/use-chat-copy'
import { useChatHttp } from '../../../adapter/use-chat-http'
import { getCategorias } from '../../../api/get-categorias'
import type { AnexoPreview } from '../../../hooks/use-chamado-anexos'
import { upperCaseFirstLetter } from '../../../utils/formatter/text-formatter'
import { ChamadoSchema } from '../../../validations/chamado-schema'
import { CreateChamadoAnexosField } from './create-chamado-anexos-field'
import { CreateChamadoDestinatarioField } from './create-chamado-destinatario-field'
import { CreateChamadoImovelField } from './create-chamado-imovel-field'

interface CreateChamadoFormProps {
  previews: AnexoPreview[]
  onAddAnexos: (files: File[]) => void
  onRemoveAnexo: (index: number) => void
}

export function CreateChamadoForm({
  previews,
  onAddAnexos,
  onRemoveAnexo,
}: CreateChamadoFormProps) {
  const { capabilities } = useChatAdapter()
  const http = useChatHttp()
  const copy = useChatCopy()
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ChamadoSchema>()

  const { data: categorias, isPending: isLoadingCategorias } = useQuery({
    queryKey: ['chamados', 'categorias'],
    queryFn: () => getCategorias(http),
    staleTime: Infinity,
  })

  const isEmptyCategorias = isLoadingCategorias || categorias?.data.length === 0

  const categoriaId = watch('categoria_id')
  const locacaoSelecionadaId = Number(watch('locacao_id')) || null
  const assuntos =
    categorias?.data.find((categoria) => String(categoria.id) === categoriaId)
      ?.assuntos ?? []

  function handleAssuntoChange(value: string) {
    setValue('assunto_id', value, { shouldValidate: true })
  }

  function handleCategoriaChange(value: string) {
    setValue('categoria_id', value, { shouldValidate: true })
    setValue('assunto_id', '')
  }

  return (
    <div className="relative flex flex-col gap-[14px]">
      <InputItemsWrapper className="w-full">
        <Label required htmlFor="categoria_id">
          Categoria
        </Label>
        <Controller
          name="categoria_id"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={handleCategoriaChange}
              value={field.value}
              disabled={isEmptyCategorias}
            >
              <SelectTrigger id="categoria_id" className="w-full">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {categorias?.data.map((categoria) => (
                  <SelectItem key={categoria.id} value={String(categoria.id)}>
                    {upperCaseFirstLetter({
                      text: categoria.nome,
                      mode: 'only',
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoria_id && (
          <HintText>{errors.categoria_id.message}</HintText>
        )}
      </InputItemsWrapper>

      <InputItemsWrapper className="w-full">
        <Label required htmlFor="assunto_id">
          Assunto
        </Label>
        <Controller
          name="assunto_id"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={handleAssuntoChange}
              value={field.value}
              disabled={!categoriaId}
            >
              <SelectTrigger id="assunto_id" className="w-full">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {assuntos.map((assunto) => (
                  <SelectItem key={assunto.id} value={String(assunto.id)}>
                    {upperCaseFirstLetter({
                      text: assunto.descricao,
                      mode: 'only',
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.assunto_id && <HintText>{errors.assunto_id.message}</HintText>}
      </InputItemsWrapper>

      <InputItemsWrapper className="w-full">
        <Label required htmlFor="locacao_id">
          Imóvel
        </Label>
        <CreateChamadoImovelField />
        {errors.locacao_id && <HintText>{errors.locacao_id.message}</HintText>}
      </InputItemsWrapper>

      {capabilities.selectDestinatario && (
        <InputItemsWrapper className="w-full">
          <Label required htmlFor="destinatario">
            Destinatário
          </Label>
          <CreateChamadoDestinatarioField locacaoId={locacaoSelecionadaId} />
          {errors.destinatario && (
            <HintText>{errors.destinatario.message}</HintText>
          )}
        </InputItemsWrapper>
      )}

      <InputItemsWrapper className="w-full">
        <Label required htmlFor="descricao">
          Escreva sua mensagem
        </Label>
        <Textarea
          id="descricao"
          className="max-h-[90px] resize-y"
          placeholder={copy.messagePlaceholder}
          maxLength={2500}
          {...register('descricao')}
        />
        {errors.descricao && <HintText>{errors.descricao.message}</HintText>}
      </InputItemsWrapper>

      <InputItemsWrapper className="w-full">
        <Label htmlFor="anexos">Anexos</Label>
        <CreateChamadoAnexosField
          previews={previews}
          onAdd={onAddAnexos}
          onRemove={onRemoveAnexo}
        />
      </InputItemsWrapper>
    </div>
  )
}
