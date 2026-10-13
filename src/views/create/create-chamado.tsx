import { Dialog, Drawer, useIsMobile } from '@inmediam/ui'

import { CHAMADO_DIALOG } from '../../contexts/chamados-chat-context'
import { useChamadosChat } from '../../hooks/use-chamados-chat'
import { CreateChamadoDialog } from './create-chamado-dialog'
import { CreateChamadoDrawer } from './create-chamado-drawer'

export function CreateChamado() {
  const isMobile = useIsMobile()
  const { dialog, closeDialog } = useChamadosChat()

  const isOpen = dialog === CHAMADO_DIALOG.NOVO

  function handleOpenChange(open: boolean) {
    if (open) return
    closeDialog()
  }

  return (
    <>
      <Dialog open={isOpen && !isMobile} onOpenChange={handleOpenChange}>
        <CreateChamadoDialog />
      </Dialog>
      <Drawer open={isOpen && isMobile} onOpenChange={handleOpenChange}>
        <CreateChamadoDrawer />
      </Drawer>
    </>
  )
}
