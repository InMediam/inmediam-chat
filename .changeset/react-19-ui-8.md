---
"@inmediam/chat": minor
---

Passa a exigir React 19 e `@inmediam/ui` 8, e alinha os peers às versões que os
apps usam na migração para o React 19.

Os peers mudaram, então o app precisa subir junto (o `npm install` recusa a
combinação antiga):

| Peer | Antes | Agora |
| --- | --- | --- |
| `react`, `react-dom` | `^18.3.1` | `^19.0.0` |
| `@inmediam/ui` | `^7.0.0` | `^8.0.0` |
| `framer-motion` | `^12.34.0` | `^14.0.0` |
| `sonner` | `^1.7.4` | `^2.0.0` |
| `date-fns` | `^3.6.0` | `^3.6.0 \|\| ^4.0.0` |

O `sonner` precisa ser o mesmo do `@inmediam/ui`: o `Toaster` vem do ui 8
(sonner 2), e os `toast()` do chat só aparecem se os dois usarem a mesma cópia.

`engines.node` passa para `>=22.12`.
