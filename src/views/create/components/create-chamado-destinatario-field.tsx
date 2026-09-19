import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@inmediam/ui'
import { useQuery } from '@tanstack/react-query'
import { Controller, useFormContext } from 'react-hook-form'

import { useChatAdapter } from '../../../adapter/use-chat-adapter'
import { useChatCopy } from '../../../adapter/use-chat-copy'
import { useChatHttp } from '../../../adapter/use-chat-http'
import type { DestinatarioChamado } from '../../../api/get-destinatarios'
import { getDestinatarios } from '../../../api/get-destinatarios'
import { getParticipanteTipoLabel } from '../../../entities/tipo-participante'
import { toDestinatarioValue } from '../../../utils/chat-utils'
import { ChamadoSchema } from '../../../validations/chamado-schema'

interface CreateChamadoDestinatarioFieldProps {
  locacaoId: number | null
}

export function CreateChamadoDestinatarioField({
  locacaoId,
}: CreateChamadoDestinatarioFieldProps) {
  const http = useChatHttp()
  const { destinatariosIndisponiveis = [] } = useChatAdapter()
  const copy = useChatCopy()
  const { control, setValue } = useFormContext<ChamadoSchema>()

  function isIndisponivel(destinatario: DestinatarioChamado) {
    return destinatariosIndisponiveis.includes(destinatario.tipo)
  }

  function getDestinatarioLabel(destinatario: DestinatarioChamado) {
    const nome = destinatario.nome ?? '-'

    if (isIndisponivel(destinatario)) {
      return `${nome} — ${copy.destinatarioIndisponivelSuffix}`
    }

    return `${nome} · ${getParticipanteTipoLabel(destinatario.tipo)}`
  }

  const { data: destinatarios, isPending: isPendingDestinatarios } = useQuery({
    queryKey: ['chamados', 'destinatarios', locacaoId],
    queryFn: () => getDestinatarios(http, locacaoId!),
    enabled: locacaoId !== null,
    staleTime: 1000 * 60 * 5,
  })

  const isEmptyDestinatarios =
    destinatarios?.length === 0 || isPendingDestinatarios

  function handleDestinatarioChange(value: string) {
    setValue('destinatario', value, { shouldValidate: true })
  }

  return (
    <Controller
      name="destinatario"
      control={control}
      render={({ field }) => (
        <Select
          onValueChange={handleDestinatarioChange}
          value={field.value}
          disabled={locacaoId === null}
        >
          <SelectTrigger
            id="destinatario"
            className="w-full"
            disabled={isEmptyDestinatarios}
          >
            <SelectValue placeholder="Selecione uma opção" />
          </SelectTrigger>
          <SelectContent>
            {destinatarios?.map((destinatario) => (
              <SelectItem
                key={toDestinatarioValue(destinatario.tipo, destinatario.id)}
                value={toDestinatarioValue(destinatario.tipo, destinatario.id)}
                disabled={isIndisponivel(destinatario)}
              >
                {getDestinatarioLabel(destinatario)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  )
}
