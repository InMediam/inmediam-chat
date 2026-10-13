import { Dialog, Drawer, useIsMobile } from '@inmediam/ui'

import { CHAMADO_DIALOG } from '../../contexts/chamados-chat-context'
import { useChamadosChat } from '../../hooks/use-chamados-chat'
import { ChamadoReabrirDialog } from './chamado-reabrir-dialog'
import { ChamadoReabrirDrawer } from './chamado-reabrir-drawer'

export function ChamadoReabrir() {
  const isMobile = useIsMobile()
  const { dialog, closeDialog } = useChamadosChat()

  const isOpen = dialog === CHAMADO_DIALOG.REABRIR

  function handleOpenChange(open: boolean) {
    if (open) return
    closeDialog()
  }

  return (
    <>
      <Dialog open={isOpen && !isMobile} onOpenChange={handleOpenChange}>
        <ChamadoReabrirDialog />
      </Dialog>
      <Drawer open={isOpen && isMobile} onOpenChange={handleOpenChange}>
        <ChamadoReabrirDrawer />
      </Drawer>
    </>
  )
}
