import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@inmediam/ui'
import { RotateCcw } from 'lucide-react'

import { ChamadoReabrirContent } from './chamado-reabrir-content'

export function ChamadoReabrirDialog() {
  return (
    <DialogContent className="max-w-2xl" aria-describedby={undefined}>
      <div className="flex w-full flex-col gap-5">
        <DialogHeader className="flex flex-col gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary">
            <RotateCcw className="h-6 w-6 text-fg-brand-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <DialogTitle className="mx-0 px-0">
              Tem certeza que deseja reabrir este chamado?
            </DialogTitle>
            <DialogDescription className="py-0 text-sm/5 font-normal text-quaternary">
              Após a reabertura, o chamado voltará a aceitar mensagens e ficará
              disponível na listagem de chamados em aberto.
            </DialogDescription>
          </div>
        </DialogHeader>

        <ChamadoReabrirContent />
      </div>
    </DialogContent>
  )
}
