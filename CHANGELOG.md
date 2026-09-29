# @inmediam/chat

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
