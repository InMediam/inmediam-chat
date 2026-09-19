import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

import { useChatHttp } from '../adapter/use-chat-http'
import type { UpdateChamadoStatusBody } from '../api/update-chamado-status'
import { updateChamadoStatus } from '../api/update-chamado-status'
import type { Chamado } from '../entities/interface'
import { getHttpErrorMessage } from '../utils/get-http-error-message'
import { updateChamadoInCache } from './use-chamado-cache'
import { chamadoMensagensQueryKey } from './use-chamado-mensagens'

interface UseUpdateChamadoStatusParams {
  successMessage: string
  onUpdated?: (chamado: Chamado) => void
}

export function useUpdateChamadoStatus({
  successMessage,
  onUpdated,
}: UseUpdateChamadoStatusParams) {
  const queryClient = useQueryClient()
  const http = useChatHttp()

  return useMutation({
    mutationFn: (body: UpdateChamadoStatusBody) =>
      updateChamadoStatus(http, body),
    onSuccess: (response) => {
      updateChamadoInCache(queryClient, response.data)
      // A mensagem de sistema ("chamado finalizado") é gerada no back, então o
      // feed precisa refazer a busca em vez de ser atualizado localmente.
      queryClient.invalidateQueries({
        queryKey: chamadoMensagensQueryKey(response.data.id),
      })
      toast.success(successMessage)
      onUpdated?.(response.data)
    },
    onError(error: AxiosError) {
      toast.error(
        getHttpErrorMessage(error, {
          404: 'Chamado não encontrado',
        }),
      )
    },
  })
}
