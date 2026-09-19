import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export const MAX_ANEXOS = 4
export const MAX_ANEXO_BYTES = 20 * 1024 * 1024
export const ANEXO_ACCEPT = '.png,.jpg,.jpeg,.pdf,.doc,.docx'

const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

export interface AnexoPreview {
  file: File
  previewUrl: string | null
}

function createPreview(file: File, withPreviewUrl: boolean): AnexoPreview {
  return {
    file,
    previewUrl:
      withPreviewUrl && file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : null,
  }
}

interface UseChamadoAnexosOptions {
  withPreviewUrls?: boolean
}

export function useChamadoAnexos({
  withPreviewUrls = true,
}: UseChamadoAnexosOptions = {}) {
  const [previews, setPreviews] = useState<AnexoPreview[]>([])

  // Espelha os previews na ref para que o cleanup de desmontagem consiga
  // revogar as object URLs que estavam ativas.
  const previewsRef = useRef<AnexoPreview[]>([])
  useEffect(() => {
    previewsRef.current = previews
  })

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((preview) => {
        if (preview.previewUrl) URL.revokeObjectURL(preview.previewUrl)
      })
    }
  }, [])

  const addFiles = useCallback(
    (selected: File[]) => {
      const wrongType = selected.filter(
        (file) => !ALLOWED_MIME_TYPES.has(file.type),
      )
      if (wrongType.length > 0) {
        toast.error(
          `Tipo não suportado: ${wrongType.map((file) => file.name).join(', ')}. Use PNG, JPG, PDF, DOC ou DOCX.`,
        )
      }

      const validType = selected.filter((file) =>
        ALLOWED_MIME_TYPES.has(file.type),
      )
      const oversized = validType.filter((file) => file.size > MAX_ANEXO_BYTES)
      if (oversized.length > 0) {
        toast.error(
          `Arquivo(s) muito grande(s): ${oversized.map((file) => file.name).join(', ')}. Máximo: 20MB.`,
        )
      }

      const valid = validType.filter((file) => file.size <= MAX_ANEXO_BYTES)
      const merged = [
        ...previewsRef.current,
        ...valid.map((file) => createPreview(file, withPreviewUrls)),
      ]

      if (merged.length > MAX_ANEXOS) {
        toast.warning(
          `Apenas os ${MAX_ANEXOS} primeiros anexos foram selecionados.`,
        )
      }

      setPreviews(merged.slice(0, MAX_ANEXOS))
    },
    [withPreviewUrls],
  )

  const removeFile = useCallback((index: number) => {
    setPreviews((current) => {
      const removed = current[index]
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl)
      return current.filter((_, position) => position !== index)
    })
  }, [])

  const clearPreviews = useCallback(() => {
    previewsRef.current.forEach((preview) => {
      if (preview.previewUrl) URL.revokeObjectURL(preview.previewUrl)
    })
    setPreviews([])
  }, [])

  return {
    previews,
    addFiles,
    removeFile,
    clearPreviews,
    canAddMore: previews.length < MAX_ANEXOS,
  }
}
