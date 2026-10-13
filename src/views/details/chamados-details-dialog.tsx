import {
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@inmediam/ui'

import { ChamadosDetailsContent } from './chamados-details-content'

export function ChamadosDetailsDialog() {
  return (
    <DialogContent
      className="w-[30rem] min-w-[30rem] max-w-[30rem] px-0"
      aria-describedby={undefined}
    >
      <DialogHeader className="space-y-0 px-6">
        <DialogTitle className="text-lg/7 font-semibold">
          Detalhes do chamado
        </DialogTitle>
        <p className="text-sm/5 text-quaternary">
          Acompanhe as informações e o status deste chamado
        </p>
      </DialogHeader>

      <ChamadosDetailsContent className="px-6" />

      <DialogFooter className="px-6">
        <DialogClose className="w-full" asChild>
          <Button className="w-full" variant="outline">
            Fechar
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
