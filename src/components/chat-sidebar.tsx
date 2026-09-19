import { Badge, Button, cn } from '@inmediam/ui'
import { Plus } from 'lucide-react'

import { useChatAdapter } from '../adapter/use-chat-adapter'
import { useChatCopy } from '../adapter/use-chat-copy'
import { CHAMADO_DIALOG } from '../contexts/chamados-chat-context'
import { useChamadosChat } from '../hooks/use-chamados-chat'
import { useChamadosList } from '../hooks/use-chamados-list'
import { ChatFilterTabs } from './chat-filter-tabs'
import { ChatSearchInput } from './chat-search-input'
import { ChatConversationList } from './conversation/chat-conversation-list'

interface ChatSidebarProps {
  className?: string
}

export function ChatSidebar({ className }: ChatSidebarProps) {
  const { search, setSearch, filter, setFilter, openDialog } = useChamadosChat()
  const { capabilities } = useChatAdapter()
  const copy = useChatCopy()
  const { totalCount } = useChamadosList()

  return (
    <aside
      className={cn(
        'flex w-full shrink-0 flex-col border-b border-secondary bg-primary md:max-w-[22.5rem] md:border-b-0 md:border-r',
        className,
      )}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-primary">
            {copy.listTitle}
          </h1>
          <Badge
            className="rounded-md border-primary bg-primary px-1.5 py-0.5 text-xs font-medium text-secondary"
            variant="outline"
          >
            {totalCount}
          </Badge>
        </div>

        {capabilities.createChamado && (
          <Button
            type="button"
            size="sm"
            className="shrink-0 gap-1.5"
            onClick={() => openDialog(CHAMADO_DIALOG.NOVO)}
          >
            <Plus className="h-4 w-4" />
            {copy.createAction}
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4 px-4 pb-3">
        <ChatSearchInput
          value={search}
          onSearch={setSearch}
          placeholder={copy.searchPlaceholder}
          tooltipContent={copy.searchTooltip}
        />
        <ChatFilterTabs value={filter} onChange={setFilter} />
      </div>

      <ChatConversationList />
    </aside>
  )
}
