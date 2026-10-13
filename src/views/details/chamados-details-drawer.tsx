import {
  Button,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@inmediam/ui'

import { ChamadosDetailsContent } from './chamados-details-content'

export function ChamadosDetailsDrawer() {
  return (
    <DrawerContent className="w-full border-none">
      <DrawerHeader className="gap-1 px-4 text-left">
        <DrawerTitle className="text-base/6 font-semibold">
          Detalhes do chamado
        </DrawerTitle>
        <DrawerDescription className="text-sm/5 text-quaternary">
          Acompanhe as informações e o status deste chamado
        </DrawerDescription>
      </DrawerHeader>

      <div className="max-h-[60dvh] overflow-y-auto px-4">
        <ChamadosDetailsContent />
      </div>

      <DrawerFooter className="px-4 pb-6">
        <DrawerClose asChild>
          <Button className="w-full" variant="outline">
            Fechar
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  )
}
