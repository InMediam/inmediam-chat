import { Tabs, TabsList, TabsTrigger } from '@inmediam/ui'
import { useState } from 'react'

import type { ChatDetailsTab } from '../../adapter/chat-adapter'
import { CHAT_DETAILS_TAB } from '../../adapter/chat-adapter'
import { useChatAdapter } from '../../adapter/use-chat-adapter'
import { AnimationView } from '../../components/animation-view'
import { useChamadoSelecionado } from '../../hooks/use-chamado-selecionado'
import { ChamadosDetailsImovelTab } from './components/chamados-details-imovel-tab'
import { ChamadosDetailsLocatarioTab } from './components/chamados-details-locatario-tab'
import { ChamadosDetailsTab } from './components/chamados-details-tab'

const DEFAULT_TABS = [
  { value: CHAT_DETAILS_TAB.CHAMADO, label: 'Chamado' },
  { value: CHAT_DETAILS_TAB.LOCATARIO, label: 'Locatário' },
  { value: CHAT_DETAILS_TAB.IMOVEL, label: 'Imóvel' },
]

interface ChamadosDetailsContentProps {
  className?: string
}

export function ChamadosDetailsContent({
  className,
}: ChamadosDetailsContentProps) {
  const { detailsTabs = DEFAULT_TABS } = useChatAdapter()
  const { detalhe: chamado } = useChamadoSelecionado()
  const [activeTab, setActiveTab] = useState<ChatDetailsTab>(
    CHAT_DETAILS_TAB.CHAMADO,
  )

  return (
    <>
      {chamado && (
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ChatDetailsTab)}
          className={className}
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
    </>
  )
}
