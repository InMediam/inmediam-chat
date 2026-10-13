# @inmediam/chat

## 0.2.2

### Patch Changes

- 06e31c4: Ajustes de layout na tela de chamados:

  - O menu de ações do chamado só mostra o separador abaixo de "Detalhes do
    chamado" quando há uma ação de finalizar ou reabrir logo abaixo.
  - A lista de chamados não desenha mais uma linha abaixo do último item nem
    abaixo do estado vazio.
  - No mobile a lista passa a ocupar a altura da tela e rolar por dentro: antes,
    com mais chamados do que cabiam na tela, o fim da lista era cortado e a
    paginação infinita não carregava a página seguinte.
  - O skeleton do endereço no cabeçalho do chamado acompanha a largura
    disponível e não passa mais por cima do badge de status no mobile.

- df59895: No mobile (largura abaixo de 768px, o breakpoint do `useIsMobile` do
  `@inmediam/ui`), os modais de abrir chamado, detalhes do chamado, finalizar e
  reabrir passam a abrir como `Drawer` em vez de `Dialog`. No desktop nada muda.

  Antes, o diálogo de detalhes tinha largura fixa de `30rem` e vazava da tela em
  celulares, e o formulário de abrir chamado ficava espremido junto do teclado.
  No drawer o conteúdo rola por dentro e os botões ocupam a largura toda.

  Não há mudança de API: o app só precisa atualizar a versão.

## 0.2.1

### Patch Changes

- 55a6ae9: Desabilita o campo de mensagem quando o chamado está finalizado: texto, envio,
  emoji e anexo ficam bloqueados, o placeholder vira "Chamado finalizado" e um
  tooltip (no hover ou no foco pelo teclado) explica que o chamado não aceita
  novas mensagens, sugerindo reabrir quando o app tem `capabilities.reopenChamado`.

  O status do chamado aberto na tela passa a ser recarregado quando chega uma
  mensagem de sistema pelo realtime (finalizar/reabrir do outro lado) e quando o
  envio é recusado com 403. O app não precisa mudar nada.

## 0.2.0

### Minor Changes

- f66117e: Passa a exigir React 19 e `@inmediam/ui` 8, e alinha os peers às versões que os
  apps usam na migração para o React 19.

  Os peers mudaram, então o app precisa subir junto (o `npm install` recusa a
  combinação antiga):

  | Peer                 | Antes      | Agora                |
  | -------------------- | ---------- | -------------------- |
  | `react`, `react-dom` | `^18.3.1`  | `^19.0.0`            |
  | `@inmediam/ui`       | `^7.0.0`   | `^8.0.0`             |
  | `framer-motion`      | `^12.34.0` | `^14.0.0`            |
  | `sonner`             | `^1.7.4`   | `^2.0.0`             |
  | `date-fns`           | `^3.6.0`   | `^3.6.0 \|\| ^4.0.0` |

  O `sonner` precisa ser o mesmo do `@inmediam/ui`: o `Toaster` vem do ui 8
  (sonner 2), e os `toast()` do chat só aparecem se os dois usarem a mesma cópia.

  `engines.node` passa para `>=22.12`.

## 0.1.1

### Patch Changes

- 6abbd78: Importa `zod` pelo named export em `search-schema.ts`. O default export só
  existe nos tipos a partir do `zod@3.25`, e o pacote publica source: um app que
  declare `^3.22.4` e resolva uma versão anterior quebrava no próprio `tsc`.

## 0.1.0

### Minor Changes

- Primeira versão publicada: a tela de chamados (`ChamadosChat`) e o
  `ChatProvider`, extraídos do `inmediam_front`. Tudo que varia entre
  instalações entra pelo `ChatAdapter`.
