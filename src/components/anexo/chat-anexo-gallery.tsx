import { ChevronLeft, ChevronRight, Download, FileText, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import type { MensagemView } from '../../entities/interface'
import { useAnexoUrl } from '../../hooks/use-anexo-url'
import { getMimeExtension } from '../../utils/chat-utils'

interface ChatAnexoGalleryProps {
  anexos: MensagemView['anexos']
  startIndex: number
  onClose: () => void
}

export function ChatAnexoGallery({
  anexos,
  startIndex,
  onClose,
}: ChatAnexoGalleryProps) {
  const [index, setIndex] = useState(startIndex)
  const [loadedIndex, setLoadedIndex] = useState<number | null>(null)

  const anexo = anexos[index]
  const { data: resolvedUrl } = useAnexoUrl(anexo.url)
  const isImage = anexo.mime.startsWith('image/')
  const hasMany = anexos.length > 1
  const isImageLoaded = loadedIndex === index

  const goToPrevious = useCallback(() => {
    setIndex((current) => (current - 1 + anexos.length) % anexos.length)
  }, [anexos.length])

  const goToNext = useCallback(() => {
    setIndex((current) => (current + 1) % anexos.length)
  }, [anexos.length])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') goToPrevious()
      else if (event.key === 'ArrowRight') goToNext()
      else if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevious, goToNext, onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-full max-w-full flex-col items-center gap-3"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex w-full items-center justify-between gap-4">
          <span
            className="text-sm text-white/60 data-[many=false]:invisible"
            data-many={hasMany}
          >
            {index + 1} / {anexos.length}
          </span>
          <div className="flex items-center gap-2">
            {resolvedUrl && (
              <a
                href={resolvedUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
                onClick={(event) => event.stopPropagation()}
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            )}
            <button
              type="button"
              aria-label="Fechar galeria"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasMany && (
            <button
              type="button"
              aria-label="Anexo anterior"
              onClick={goToPrevious}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <div className="flex max-h-[80vh] max-w-[80vw] items-center justify-center">
            {isImage && (
              <div className="relative flex min-h-64 min-w-64 items-center justify-center">
                <div
                  className="absolute inset-0 flex items-center justify-center data-[loaded=true]:hidden"
                  data-loaded={!!resolvedUrl && isImageLoaded}
                >
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
                </div>
                {resolvedUrl && (
                  <img
                    src={resolvedUrl}
                    alt=""
                    onLoad={() => setLoadedIndex(index)}
                    data-loaded={isImageLoaded}
                    className="max-h-[80vh] max-w-[80vw] rounded-lg object-contain opacity-0 transition-opacity duration-300 data-[loaded=true]:opacity-100"
                  />
                )}
              </div>
            )}

            {!isImage && (
              <div className="flex flex-col items-center gap-3 rounded-xl bg-white/10 px-12 py-10">
                <FileText className="h-16 w-16 text-white/70" />
                <span className="text-lg font-semibold text-white">
                  {getMimeExtension(anexo.mime)}
                </span>
                {!resolvedUrl && (
                  <div className="h-3 w-24 animate-pulse rounded-full bg-white/20" />
                )}
              </div>
            )}
          </div>

          {hasMany && (
            <button
              type="button"
              aria-label="Próximo anexo"
              onClick={goToNext}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
