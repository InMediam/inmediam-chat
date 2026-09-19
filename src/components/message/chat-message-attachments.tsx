import { FileText, X } from 'lucide-react'

import type { AnexoPreview } from '../../hooks/use-chamado-anexos'
import { MAX_ANEXOS } from '../../hooks/use-chamado-anexos'
import { getMimeExtension } from '../../utils/chat-utils'

interface ChatMessageAttachmentsProps {
  previews: AnexoPreview[]
  progress: number | null
  phaseLabel: string
  onRemove: (index: number) => void
}

export function ChatMessageAttachments({
  previews,
  progress,
  phaseLabel,
  onRemove,
}: ChatMessageAttachmentsProps) {
  const isSending = progress !== null

  return (
    <>
      {previews.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {previews.map((preview, index) => (
            <div
              key={preview.file.name + index}
              className="group relative h-16 w-16 shrink-0"
            >
              {preview.previewUrl && (
                <img
                  src={preview.previewUrl}
                  alt={preview.file.name}
                  className="h-full w-full rounded-md border border-secondary object-cover"
                />
              )}

              {!preview.previewUrl && (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-md border border-secondary bg-secondary">
                  <FileText className="h-6 w-6 text-fg-quaternary" />
                  <span className="max-w-full truncate px-1 text-[9px] text-quaternary">
                    {getMimeExtension(preview.file.type)}
                  </span>
                </div>
              )}

              <button
                type="button"
                aria-label={`Remover anexo ${preview.file.name}`}
                onClick={() => onRemove(index)}
                className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-solid text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {previews.length > 0 && (
        <p className="px-1 text-[10px] text-quaternary">
          {previews.length}/{MAX_ANEXOS} anexos
        </p>
      )}

      {isSending && (
        <div className="mb-1 flex items-center gap-2 px-1">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-quaternary">
            <div
              className="h-full rounded-full bg-brand-tertiary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="shrink-0 text-[10px] text-quaternary">
            {phaseLabel}
          </span>
        </div>
      )}
    </>
  )
}
