---
'@inmediam/chat': patch
---

Desabilita o campo de mensagem quando o chamado está finalizado: texto, envio,
emoji e anexo ficam bloqueados, o placeholder vira "Chamado finalizado" e um
tooltip (no hover ou no foco pelo teclado) explica que o chamado não aceita
novas mensagens, sugerindo reabrir quando o app tem `capabilities.reopenChamado`.

O status do chamado aberto na tela passa a ser recarregado quando chega uma
mensagem de sistema pelo realtime (finalizar/reabrir do outro lado) e quando o
envio é recusado com 403. O app não precisa mudar nada.
