import { useContext } from 'react'

import { ChamadosChatContext } from '../contexts/chamados-chat-context'

export const useChamadosChat = () => useContext(ChamadosChatContext)
