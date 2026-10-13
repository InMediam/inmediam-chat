import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@inmediam/ui'
import { MessageCirclePlus } from 'lucide-react'

import { useChatCopy } from '../../adapter/use-chat-copy'
import { Waves } from '../../components/waves'
import { CreateChamadoContent } from './create-chamado-content'

export function CreateChamadoDialog() {
  const copy = useChatCopy()

  return (
    <DialogContent className="max-h-[95%] max-w-[640px] overflow-auto">
      <DialogHeader className="z-0 flex flex-col pb-3">
        <div className="flex h-12 w-full items-center justify-start">
          <Waves shape="square" className="h-12 w-12 rounded-xl bg-primary">
            <MessageCirclePlus className="h-6 w-6 text-fg-secondary" />
          </Waves>
        </div>
      </DialogHeader>

      <div className="z-10 flex flex-col gap-1 pb-3">
        <DialogTitle className="text-lg font-semibold text-primary">
          {copy.createTitle}
        </DialogTitle>
        <DialogDescription className="text-sm text-tertiary">
          {copy.createDescription}
        </DialogDescription>
      </div>

      <CreateChamadoContent />
    </DialogContent>
  )
}
