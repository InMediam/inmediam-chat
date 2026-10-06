# @inmediam/chat

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
