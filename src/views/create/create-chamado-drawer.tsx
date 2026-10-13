import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@inmediam/ui'

import { useChatCopy } from '../../adapter/use-chat-copy'
import { CreateChamadoContent } from './create-chamado-content'

export function CreateChamadoDrawer() {
  const copy = useChatCopy()

  return (
    <DrawerContent className="w-full border-none">
      <DrawerHeader className="gap-1 px-4 text-left">
        <DrawerTitle className="text-base/6 font-semibold text-primary">
          {copy.createTitle}
        </DrawerTitle>
        <DrawerDescription className="text-sm text-tertiary">
          {copy.createDescription}
        </DrawerDescription>
      </DrawerHeader>

      <div className="max-h-[75dvh] overflow-y-auto px-4 pb-6">
        <CreateChamadoContent />
      </div>
    </DrawerContent>
  )
}
