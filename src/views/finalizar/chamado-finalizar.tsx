import { Dialog, Drawer, useIsMobile } from '@inmediam/ui'

import { CHAMADO_DIALOG } from '../../contexts/chamados-chat-context'
import { useChamadosChat } from '../../hooks/use-chamados-chat'
import { ChamadoFinalizarDialog } from './chamado-finalizar-dialog'
import { ChamadoFinalizarDrawer } from './chamado-finalizar-drawer'

export function ChamadoFinalizar() {
  const isMobile = useIsMobile()
  const { dialog, closeDialog } = useChamadosChat()

  const isOpen = dialog === CHAMADO_DIALOG.FINALIZAR

  function handleOpenChange(open: boolean) {
    if (open) return
    closeDialog()
  }

  return (
    <>
      <Dialog open={isOpen && !isMobile} onOpenChange={handleOpenChange}>
        <ChamadoFinalizarDialog />
      </Dialog>
      <Drawer open={isOpen && isMobile} onOpenChange={handleOpenChange}>
        <ChamadoFinalizarDrawer />
      </Drawer>
    </>
  )
}
