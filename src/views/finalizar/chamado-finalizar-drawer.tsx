import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@inmediam/ui'
import { CircleCheck } from 'lucide-react'

import { ChamadoFinalizarContent } from './chamado-finalizar-content'

export function ChamadoFinalizarDrawer() {
  return (
    <DrawerContent className="w-full border-none">
      <DrawerHeader className="flex flex-col items-start gap-4 px-4 text-left">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary">
          <CircleCheck className="h-6 w-6 text-fg-brand-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <DrawerTitle className="text-base/6 font-semibold">
            Tem certeza que deseja finalizar este chamado?
          </DrawerTitle>
          <DrawerDescription className="text-sm/5 font-normal text-quaternary">
            Após a finalização, o chamado será encerrado e não receberá mais
            mensagens. Essa ação não pode ser desfeita.
          </DrawerDescription>
        </div>
      </DrawerHeader>

      <div className="max-h-[70dvh] overflow-y-auto px-4 pb-6">
        <ChamadoFinalizarContent />
      </div>
    </DrawerContent>
  )
}
