# @inmediam/chat

Tela de chamados (chat) compartilhada entre os fronts da InMediam. O pacote
publica **código-fonte**: quem consome compila com o próprio Vite, como já
acontece com `@inmediam/ui`.

O pacote não conhece o papel de quem acessa. Tudo que muda entre uma instalação
e outra — instância HTTP, identidade, transporte de realtime, textos e o que a
instalação permite fazer — entra por um `ChatAdapter`.

## Instalação

```bash
npm install @inmediam/chat
```

O Tailwind do app precisa varrer o pacote, porque os content globs do
`@inmediam/ui` só listam ele mesmo:

```js
// tailwind.config.js
import tailwindConfig from '@inmediam/ui/tailwind'

const config = tailwindConfig('*')

config.content.push('./node_modules/@inmediam/chat/src/**/*.{ts,tsx}')

module.exports = config
```

Sem essa linha nenhuma classe da tela é gerada.

## Uso

```tsx
import { ChamadosChat, ChatProvider, PARTICIPANTE_TIPO } from '@inmediam/chat'

// Acima do router e abaixo do QueryClientProvider: o hook de realtime é
// montado no shell do app, fora da página de chamados.
<ChatProvider adapter={adapter}>
  <RouterProvider router={router} />
</ChatProvider>

// Na rota
;<ChamadosChat defaultFilter={CHAMADO_FILTRO.EM_ABERTO} containerClassName="h-full" />
```

### O adapter

| Campo | Para que serve |
| --- | --- |
| `api` | `AxiosInstance` autenticada do app; toda função de `src/api` recebe ela |
| `isAuthenticated` | destrava as queries |
| `currentUser` | `{ tipo, nome, avatar }` — o `tipo` decide o lado da bolha |
| `realtimeChannel` | canal privado da conta (`cliente.{id}.chamados`, `user.{id}.chamados`, …) |
| `getRealtime` | devolve o transporte, ou `null` quando o app não tem realtime |
| `onRealtimeReconnect` | avisa o pacote para revalidar o que se perdeu offline |
| `capabilities` | esconde ações que a instalação não oferece |
| `fetchLocacoes` | a lista de imóveis do formulário; o endpoint difere por app |
| `copy` | sobrescreve textos (`DEFAULT_CHAT_COPY` tem os padrões) |
| `detailsTabs` | quais abas de detalhe aparecem, e com que rótulo |

**`capabilities` é conveniência de UI, não segurança.** Elas escondem um botão;
quem recusa a ação é a policy do backend.

## Escopo — o que não entra aqui

O repositório é público. Fica de fora do pacote:

- regra de elegibilidade (quem pode abrir chamado para quem, quais clientes
  aparecem na lista) — decisão do backend; o pacote renderiza o que a API
  devolveu;
- identificadores internos, hosts, buckets, realms, ids de plano;
- comentário que descreva processo interno de negócio.

Antes de cada publicação, revisar o diff com essa régua.

## Desenvolvimento

```bash
npm run tsc
npm run lint
npm run test:run
```
