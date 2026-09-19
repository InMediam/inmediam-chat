import { FileText } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import type { MensagemView } from '../../entities/interface'
import { useAnexoUrl } from '../../hooks/use-anexo-url'
import { getMimeExtension } from '../../utils/chat-utils'

interface ChatAnexoThumbProps {
  anexo: MensagemView['anexos'][number]
  onClick: () => void
}

export function ChatAnexoThumb({ anexo, onClick }: ChatAnexoThumbProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const isImage = anexo.mime.startsWith('image/')
  const { data: resolvedUrl } = useAnexoUrl(anexo.url, isVisible)

  // Só resolve a URL assinada quando a miniatura entra em viewport: um chamado
  // longo tem dezenas de anexos e cada um custa uma requisição.
  useEffect(() => {
    const element = buttonRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={
        isImage
          ? 'Visualizar imagem'
          : `Visualizar arquivo ${getMimeExtension(anexo.mime)}`
      }
      onClick={onClick}
      className="group relative h-16 w-16 overflow-hidden rounded-md border border-secondary"
    >
      {isImage && resolvedUrl && (
        <img
          src={resolvedUrl}
          alt=""
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      )}

      {isImage && !resolvedUrl && (
        <div className="flex h-full w-full items-center justify-center bg-secondary">
          <div className="border-t-fg-quaternary h-4 w-4 animate-spin rounded-full border-2 border-secondary" />
        </div>
      )}

      {!isImage && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-primary group-hover:bg-secondary">
          <FileText className="h-6 w-6 text-fg-quaternary" />
          <span className="max-w-full truncate px-1 text-[9px] text-quaternary">
            {getMimeExtension(anexo.mime)}
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
    </button>
  )
}
