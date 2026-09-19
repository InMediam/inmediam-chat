import { CloudUpload, X } from 'lucide-react'
import { useRef } from 'react'

import type { AnexoPreview } from '../../../hooks/use-chamado-anexos'
import { ANEXO_ACCEPT, MAX_ANEXOS } from '../../../hooks/use-chamado-anexos'

interface CreateChamadoAnexosFieldProps {
  previews: AnexoPreview[]
  onAdd: (files: File[]) => void
  onRemove: (index: number) => void
}

export function CreateChamadoAnexosField({
  previews,
  onAdd,
  onRemove,
}: CreateChamadoAnexosFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const remaining = MAX_ANEXOS - previews.length

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    onAdd(Array.from(event.target.files ?? []))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    onAdd(Array.from(event.dataTransfer.files))
  }

  return (
    <>
      {remaining > 0 && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary bg-primary px-6 py-6 text-center hover:border-brand hover:bg-secondary"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-primary shadow-sm">
            <CloudUpload className="h-5 w-5 text-fg-quaternary" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-tertiary">
              <span className="font-semibold text-brand-secondary">
                Clique ou arraste
              </span>{' '}
              um arquivo para adicionar
            </p>
            <p className="text-xs text-quaternary">
              PNG, JPG, PDF ou DOC (max. 20MB) — {remaining} restante(s)
            </p>
          </div>
        </button>
      )}

      <input
        ref={fileInputRef}
        id="anexos"
        type="file"
        multiple
        accept={ANEXO_ACCEPT}
        className="hidden"
        onChange={handleFileChange}
      />

      {previews.length > 0 && (
        <ul className="flex flex-col gap-1">
          {previews.map((preview, index) => (
            <li
              key={preview.file.name + index}
              className="flex items-center justify-between rounded-md border border-secondary bg-secondary px-3 py-1.5 text-sm text-secondary"
            >
              <span className="truncate">{preview.file.name}</span>
              <button
                type="button"
                aria-label={`Remover anexo ${preview.file.name}`}
                onClick={() => onRemove(index)}
                className="ml-2 shrink-0 text-fg-quaternary hover:text-fg-tertiary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
