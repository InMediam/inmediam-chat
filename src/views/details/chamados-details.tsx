import { Dialog, Drawer, useIsMobile } from '@inmediam/ui'

import { CHAMADO_DIALOG } from '../../contexts/chamados-chat-context'
import { useChamadosChat } from '../../hooks/use-chamados-chat'
import { ChamadosDetailsDialog } from './chamados-details-dialog'
import { ChamadosDetailsDrawer } from './chamados-details-drawer'

export function ChamadosDetails() {
  const isMobile = useIsMobile()
  const { dialog, closeDialog } = useChamadosChat()

  const isOpen = dialog === CHAMADO_DIALOG.DETAILS

  function handleOpenChange(open: boolean) {
    if (open) return
    closeDialog()
  }

  return (
    <>
      <Dialog open={isOpen && !isMobile} onOpenChange={handleOpenChange}>
        <ChamadosDetailsDialog />
      </Dialog>
      <Drawer open={isOpen && isMobile} onOpenChange={handleOpenChange}>
        <ChamadosDetailsDrawer />
      </Drawer>
    </>
  )
}
