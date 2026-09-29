---
'@inmediam/chat': patch
---

Importa `zod` pelo named export em `search-schema.ts`. O default export só
existe nos tipos a partir do `zod@3.25`, e o pacote publica source: um app que
declare `^3.22.4` e resolva uma versão anterior quebrava no próprio `tsc`.
