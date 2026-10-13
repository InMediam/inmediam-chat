import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@inmediam/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useChatAdapter } from '../../adapter/use-chat-adapter'
import { useChatHttp } from '../../adapter/use-chat-http'
import type { CreateChamadoBody } from '../../api/create-chamado'
import { createChamado } from '../../api/create-chamado'
import { gerarPresignedUrlsParaChamado } from '../../api/gerar-presigned-url'
import type { AnexoRef } from '../../api/send-mensagem'
import { uploadArquivoParaSpaces } from '../../api/upload-para-spaces'
import { LoadingSpin } from '../../components/loading-spin'
import { useChamadoAnexos } from '../../hooks/use-chamado-anexos'
import { prependChamadoToCache } from '../../hooks/use-chamado-cache'
import { useChamadosChat } from '../../hooks/use-chamados-chat'
import { parseDestinatarioValue } from '../../utils/chat-utils'
import { getHttpErrorMessage } from '../../utils/get-http-error-message'
import type { ChamadoSchema } from '../../validations/chamado-schema'
import { getChamadoSchema } from '../../validations/chamado-schema'
import { CreateChamadoForm } from './components/create-chamado-form'

export function CreateChamadoContent() {
  const queryClient = useQueryClient()
  const { closeDialog, locacaoId, selectChamado } = useChamadosChat()
  const { capabilities } = useChatAdapter()
  const http = useChatHttp()
  const [isUploading, setIsUploading] = useState(false)

  const anexos = useChamadoAnexos({ withPreviewUrls: false })

  const form = useForm<ChamadoSchema>({
    resolver: zodResolver(
      getChamadoSchema({
        requireDestinatario: capabilities.selectDestinatario,
      }),
    ),
    defaultValues: {
      categoria_id: '',
      assunto_id: '',
      locacao_id: locacaoId ? String(locacaoId) : '',
      destinatario: '',
      descricao: '',
    },
  })

  const { setValue } = form

  useEffect(
    function seedLocacaoDaTela() {
      if (locacaoId === undefined) return

      setValue('locacao_id', String(locacaoId))
    },
    [locacaoId, setValue],
  )

  function handleAddAnexos(files: File[]) {
    anexos.addFiles(files)
  }

  function handleRemoveAnexo(index: number) {
    anexos.removeFile(index)
  }

  const { mutateAsync: criarChamado, isPending } = useMutation({
    mutationFn: (body: CreateChamadoBody) => createChamado(http, body),
    onSuccess(response) {
      prependChamadoToCache(queryClient, response.data)
      toast.success('Chamado aberto com sucesso.')
      closeDialog()
      selectChamado(response.data.id)
    },
    onError(error) {
      if (!isAxiosError(error)) {
        toast.error('Erro desconhecido, tente novamente mais tarde')
        return
      }
      toast.error(getHttpErrorMessage(error))
    },
  })

  async function uploadAnexos(files: File[]): Promise<AnexoRef[]> {
    const presignedUrls = await gerarPresignedUrlsParaChamado(
      http,
      files.length,
    )

    await Promise.all(
      presignedUrls.map((item, index) =>
        uploadArquivoParaSpaces(item.upload_url, files[index]),
      ),
    )

    return presignedUrls.map((item, index) => ({
      path: item.path,
      mime: files[index].type,
      bytes: files[index].size,
    }))
  }

  async function handleSubmit(data: ChamadoSchema) {
    const files = anexos.previews.map((preview) => preview.file)
    let anexosPayload: AnexoRef[] | undefined

    if (files.length > 0) {
      setIsUploading(true)
      try {
        anexosPayload = await uploadAnexos(files)
      } catch {
        toast.error('Erro ao enviar anexos. Tente novamente.')
        return
      } finally {
        setIsUploading(false)
      }
    }

    // Sem o campo de destinatário o backend resolve a contraparte pela
    // locação, então os dois campos ficam de fora do payload.
    const destinatario = capabilities.selectDestinatario
      ? parseDestinatarioValue(data.destinatario)
      : null

    await criarChamado({
      assunto_id: Number(data.assunto_id),
      locacao_id: Number(data.locacao_id),
      descricao: data.descricao,
      destinatario_tipo: destinatario?.tipo,
      destinatario_id: destinatario?.id,
      anexos: anexosPayload,
    })
  }

  const isSubmitting = isPending || isUploading

  return (
    <form
      className="relative flex w-full min-w-0 flex-col"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <FormProvider {...form}>
        <CreateChamadoForm
          previews={anexos.previews}
          onAddAnexos={handleAddAnexos}
          onRemoveAnexo={handleRemoveAnexo}
        />
      </FormProvider>

      <div className="relative flex w-full flex-col-reverse gap-3 pt-4 md:flex-row md:gap-5">
        <Button
          className="w-full"
          variant="outline"
          type="button"
          onClick={closeDialog}
        >
          Cancelar
        </Button>
        <Button
          className="w-full"
          type="submit"
          disabled={isSubmitting}
          data-loading-disabled={isSubmitting}
        >
          <LoadingSpin data-pending={isSubmitting} />
          Enviar chamado
        </Button>
      </div>
    </form>
  )
}
