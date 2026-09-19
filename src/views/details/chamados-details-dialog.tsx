import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@inmediam/ui'
import { useState } from 'react'

import type { ChatDetailsTab } from '../../adapter/chat-adapter'
import { CHAT_DETAILS_TAB } from '../../adapter/chat-adapter'
import { useChatAdapter } from '../../adapter/use-chat-adapter'
import { AnimationView } from '../../components/animation-view'
import { CHAMADO_DIALOG } from '../../contexts/chamados-chat-context'
import { useChamadoSelecionado } from '../../hooks/use-chamado-selecionado'
import { useChamadosChat } from '../../hooks/use-chamados-chat'
import { ChamadosDetailsImovelTab } from './components/chamados-details-imovel-tab'
import { ChamadosDetailsLocatarioTab } from './components/chamados-details-locatario-tab'
import { ChamadosDetailsTab } from './components/chamados-details-tab'

const DEFAULT_TABS = [
  { value: CHAT_DETAILS_TAB.CHAMADO, label: 'Chamado' },
  { value: CHAT_DETAILS_TAB.LOCATARIO, label: 'Locatário' },
  { value: CHAT_DETAILS_TAB.IMOVEL, label: 'Imóvel' },
]

export function ChamadosDetailsDialog() {
  const { dialog, closeDialog } = useChamadosChat()
  const { detailsTabs = DEFAULT_TABS } = useChatAdapter()
  const { detalhe: chamado } = useChamadoSelecionado()
  const [activeTab, setActiveTab] = useState<ChatDetailsTab>(
    CHAT_DETAILS_TAB.CHAMADO,
  )

  return (
    <Dialog open={dialog === CHAMADO_DIALOG.DETAILS} onOpenChange={closeDialog}>
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

        {chamado && (
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as ChatDetailsTab)}
            className="px-6"
          >
            <TabsList className="h-9 rounded-[0.625rem] border border-secondary bg-secondary px-0">
              {detailsTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  className="h-9 rounded-lg transition-all data-[state=active]:border data-[state=active]:border-primary data-[state=active]:bg-primary"
                  value={tab.value}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-4">
              <AnimationView view={activeTab}>
                {activeTab === CHAT_DETAILS_TAB.CHAMADO && (
                  <ChamadosDetailsTab chamado={chamado} />
                )}
                {activeTab === CHAT_DETAILS_TAB.LOCATARIO && (
                  <ChamadosDetailsLocatarioTab chamado={chamado} />
                )}
                {activeTab === CHAT_DETAILS_TAB.IMOVEL && (
                  <ChamadosDetailsImovelTab chamado={chamado} />
                )}
              </AnimationView>
            </div>
          </Tabs>
        )}

        <DialogFooter className="px-6">
          <DialogClose className="w-full" asChild>
            <Button className="w-full" variant="outline">
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
