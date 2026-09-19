import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useChatHttp } from '../adapter/use-chat-http'
import { gerarPresignedUrls } from '../api/gerar-presigned-url'
import type { AnexoRef, SendMensagemBody } from '../api/send-mensagem'
import { sendMensagem } from '../api/send-mensagem'
import { uploadArquivoParaSpaces } from '../api/upload-para-spaces'
import { getHttpErrorMessage } from '../utils/get-http-error-message'
import { useChamadoAnexos } from './use-chamado-anexos'
import { appendMensagemToCache } from './use-chamado-cache'
import { useChamadosChat } from './use-chamados-chat'

export type UploadPhase = 'presigning' | 'uploading' | 'saving'

export const UPLOAD_PHASE_LABEL: Record<UploadPhase, string> = {
  presigning: 'Preparando...',
  uploading: 'Enviando anexos...',
  saving: 'Enviando...',
}

const UPLOAD_START_PERCENT = 8
const UPLOAD_RANGE_PERCENT = 77
const SAVING_CEILING_PERCENT = 97

const TRICKLE_INTERVAL_MS = 200
const TRICKLE_FACTOR = 0.18

export function useChatMessageComposer() {
  const queryClient = useQueryClient()
  const http = useChatHttp()
  const { draft, setDraft, clearDraft, selectedId } = useChamadosChat()
  const anexos = useChamadoAnexos()

  const [progress, setProgress] = useState<number | null>(null)
  const [phase, setPhase] = useState<UploadPhase | null>(null)

  const isSending = progress !== null

  useEffect(
    function trickleWhileWaitingForServer() {
      if (phase === null || phase === 'uploading') return

      const ceiling =
        phase === 'presigning' ? UPLOAD_START_PERCENT : SAVING_CEILING_PERCENT

      const interval = window.setInterval(() => {
        setProgress((current) =>
          current === null
            ? current
            : current + (ceiling - current) * TRICKLE_FACTOR,
        )
      }, TRICKLE_INTERVAL_MS)

      return () => window.clearInterval(interval)
    },
    [phase],
  )

  const { mutateAsync: enviarMensagem } = useMutation({
    mutationFn: (body: SendMensagemBody) => sendMensagem(http, body),
    onSuccess: (response, variables) => {
      appendMensagemToCache(queryClient, variables.chamadoId, response.data)
      clearDraft(variables.chamadoId)
    },
    onError(error) {
      if (!isAxiosError(error)) {
        toast.error('Erro desconhecido, tente novamente mais tarde')
        return
      }
      toast.error(getHttpErrorMessage(error, { 404: 'Chamado não encontrado' }))
    },
  })

  function resetUpload() {
    setProgress(null)
    setPhase(null)
  }

  async function uploadAnexos(chamadoId: number, files: File[]) {
    const presignedUrls = await gerarPresignedUrls(
      http,
      chamadoId,
      files.length,
    )

    setProgress(UPLOAD_START_PERCENT)
    setPhase('uploading')

    const totalBytes = files.reduce((sum, file) => sum + file.size, 0)
    const uploadedBytes = new Array<number>(files.length).fill(0)

    function updateProgress() {
      const sent = uploadedBytes.reduce((sum, bytes) => sum + bytes, 0)
      const percent =
        totalBytes > 0
          ? UPLOAD_START_PERCENT +
            Math.round((sent / totalBytes) * UPLOAD_RANGE_PERCENT)
          : UPLOAD_START_PERCENT + UPLOAD_RANGE_PERCENT
      setProgress(
        Math.min(percent, UPLOAD_START_PERCENT + UPLOAD_RANGE_PERCENT),
      )
    }

    await Promise.all(
      presignedUrls.map((item, index) =>
        uploadArquivoParaSpaces(item.upload_url, files[index], (percent) => {
          uploadedBytes[index] = (percent / 100) * files[index].size
          updateProgress()
        }),
      ),
    )

    return presignedUrls.map<AnexoRef>((item, index) => ({
      path: item.path,
      mime: files[index].type,
      bytes: files[index].size,
    }))
  }

  async function send() {
    if (selectedId === null || isSending) return
    if (draft.trim().length === 0 && anexos.previews.length === 0) return

    const files = anexos.previews.map((preview) => preview.file)

    setProgress(0)
    setPhase(files.length > 0 ? 'presigning' : 'saving')

    let anexosPayload: AnexoRef[] = []

    if (files.length > 0) {
      try {
        anexosPayload = await uploadAnexos(selectedId, files)
      } catch {
        toast.error('Erro ao fazer upload dos anexos. Tente novamente.')
        resetUpload()
        return
      }
    }

    setPhase('saving')

    try {
      const texto = draft.trim()
      await enviarMensagem({
        chamadoId: selectedId,
        texto: texto || undefined,
        anexos: anexosPayload.length > 0 ? anexosPayload : undefined,
      })
    } catch {
      resetUpload()
      return
    }

    anexos.clearPreviews()
    resetUpload()
  }

  return {
    draft,
    setDraft,
    isSending,
    progress,
    phaseLabel: UPLOAD_PHASE_LABEL[phase ?? 'saving'],
    previews: anexos.previews,
    canAddMore: anexos.canAddMore,
    addFiles: anexos.addFiles,
    removeFile: anexos.removeFile,
    send,
  }
}
