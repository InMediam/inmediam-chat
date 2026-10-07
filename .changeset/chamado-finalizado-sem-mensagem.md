---
'@inmediam/chat': patch
---

Desabilita o campo de mensagem quando o chamado está finalizado: texto, envio,
emoji e anexo ficam bloqueados, o placeholder vira "Chamado finalizado" e um
tooltip explica que o chamado não aceita novas mensagens (sugerindo reabrir
quando o app tem `capabilities.reopenChamado`). A API passa a recusar a
mensagem com 403, então o app não precisa mudar nada.
