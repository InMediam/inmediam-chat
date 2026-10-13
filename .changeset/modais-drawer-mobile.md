---
'@inmediam/chat': patch
---

No mobile (largura abaixo de 768px, o breakpoint do `useIsMobile` do
`@inmediam/ui`), os modais de abrir chamado, detalhes do chamado, finalizar e
reabrir passam a abrir como `Drawer` em vez de `Dialog`. No desktop nada muda.

Antes, o diálogo de detalhes tinha largura fixa de `30rem` e vazava da tela em
celulares, e o formulário de abrir chamado ficava espremido junto do teclado.
No drawer o conteúdo rola por dentro e os botões ocupam a largura toda.

Não há mudança de API: o app só precisa atualizar a versão.
