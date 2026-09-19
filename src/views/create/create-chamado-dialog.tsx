import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@inmediam/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { MessageCirclePlus } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useChatAdapter } from '../../adapter/use-chat-adapter'
import { useChatCopy } from '../../adapter/use-chat-copy'
import { useChatHttp } from '../../adapter/use-chat-http'
import type { CreateChamadoBody } from '../../api/create-chamado'
import { createChamado } from '../../api/create-chamado'
import { gerarPresignedUrlsParaChamado } from '../../api/gerar-presigned-url'
import type { AnexoRef } from '../../api/send-mensagem'
import { uploadArquivoParaSpaces } from '../../api/upload-para-spaces'
import { LoadingSpin } from '../../components/loading-spin'
import { Waves } from '../../components/waves'
import { CHAMADO_DIALOG } from '../../contexts/chamados-chat-context'
import { useChamadoAnexos } from '../../hooks/use-chamado-anexos'
import { prependChamadoToCache } from '../../hooks/use-chamado-cache'
import { useChamadosChat } from '../../hooks/use-chamados-chat'
import { parseDestinatarioValue } from '../../utils/chat-utils'
import { getHttpErrorMessage } from '../../utils/get-http-error-message'
import type { ChamadoSchema } from '../../validations/chamado-schema'
import { getChamadoSchema } from '../../validations/chamado-schema'
import { CreateChamadoForm } from './components/create-chamado-form'

export function CreateChamadoDialog() {
  const queryClient = useQueryClient()
  const { dialog, closeDialog, locacaoId, selectChamado } = useChamadosChat()
  const { capabilities } = useChatAdapter()
  const http = useChatHttp()
  const copy = useChatCopy()
  const [isUploading, setIsUploading] = useState(false)

  const anexos = useChamadoAnexos({ withPreviewUrls: false })

  const defaultValues: ChamadoSchema = {
    categoria_id: '',
    assunto_id: '',
    locacao_id: locacaoId ? String(locacaoId) : '',
    destinatario: '',
    descricao: '',
  }

  const form = useForm<ChamadoSchema>({
    resolver: zodResolver(
      getChamadoSchema({
        requireDestinatario: capabilities.selectDestinatario,
      }),
    ),
    defaultValues,
  })

  function handleAddAnexos(files: File[]) {
    anexos.addFiles(files)
  }

  function handleRemoveAnexo(index: number) {
    anexos.removeFile(index)
  }

  function handleClose() {
    form.reset(defaultValues)
    anexos.clearPreviews()
    closeDialog()
  }

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) return
    handleClose()
  }

  const { mutateAsync: criarChamado, isPending } = useMutation({
    mutationFn: (body: CreateChamadoBody) => createChamado(http, body),
    onSuccess(response) {
      prependChamadoToCache(queryClient, response.data)
      toast.success('Chamado aberto com sucesso.')
      handleClose()
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
    <Dialog
      open={dialog === CHAMADO_DIALOG.NOVO}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="max-h-[95%] max-w-[640px] overflow-auto">
        <DialogHeader className="z-0 flex flex-col pb-3">
          <div className="flex h-12 w-full items-center justify-start">
            <Waves shape="square" className="h-12 w-12 rounded-xl bg-primary">
              <MessageCirclePlus className="h-6 w-6 text-fg-secondary" />
            </Waves>
          </div>
        </DialogHeader>

        <div className="z-10 flex flex-col gap-1 pb-3">
          <DialogTitle className="text-lg font-semibold text-primary">
            {copy.createTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-tertiary">
            {copy.createDescription}
          </DialogDescription>
        </div>

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

          <DialogFooter className="relative flex w-full gap-3 pt-4">
            <DialogClose asChild>
              <Button
                className="w-full"
                variant="outline"
                type="button"
                onClick={handleClose}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              className="w-full"
              type="submit"
              disabled={isSubmitting}
              data-loading-disabled={isSubmitting}
            >
              <LoadingSpin data-pending={isSubmitting} />
              Enviar chamado
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
