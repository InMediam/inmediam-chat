---
"@inmediam/chat": patch
---

O `useChamadosRealtime` passa a recarregar o detalhe do chamado quando chega uma mensagem de sistema (finalizado ou reaberto). Antes, se o chamado era finalizado enquanto o usuário estava em outra conversa, ao abri-lo ele aparecia com o status antigo e o envio liberado até o cache vencer.
