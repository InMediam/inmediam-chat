import { useState } from 'react'

import type { MensagemView } from '../../entities/interface'
import { ChatAnexoGallery } from './chat-anexo-gallery'
import { ChatAnexoThumb } from './chat-anexo-thumb'

interface ChatAnexoListProps {
  anexos: MensagemView['anexos']
}

export function ChatAnexoList({ anexos }: ChatAnexoListProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null)

  const visibleAnexos = isExpanded ? anexos : anexos.slice(0, 1)
  const hiddenCount = anexos.length - 1

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {visibleAnexos.map((anexo, index) => (
        <ChatAnexoThumb
          key={anexo.url + index}
          anexo={anexo}
          onClick={() => setGalleryIndex(isExpanded ? index : 0)}
        />
      ))}

      {anexos.length > 1 && !isExpanded && (
        <button
          type="button"
          aria-label={`Ver mais ${hiddenCount} anexo(s)`}
          onClick={() => setIsExpanded(true)}
          className="flex h-16 w-16 flex-col items-center justify-center rounded-md border border-secondary bg-secondary text-sm font-semibold text-tertiary hover:bg-secondary-hover"
        >
          +{hiddenCount}
        </button>
      )}

      {galleryIndex !== null && (
        <ChatAnexoGallery
          anexos={anexos}
          startIndex={galleryIndex}
          onClose={() => setGalleryIndex(null)}
        />
      )}
    </div>
  )
}
