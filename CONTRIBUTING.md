# Contribuindo para o `@inmediam/chat`

Este documento explica o caminho de uma mudança até o npm — do ambiente local
ao merge do PR e à publicação.

## Índice

- [Configurando localmente](#configurando-localmente)
- [Estratégia de branches](#estratégia-de-branches)
- [Escrevendo um changeset](#escrevendo-um-changeset)
- [Abrindo um Pull Request](#abrindo-um-pull-request)
- [Processo de release](#processo-de-release)
- [Convenções de commit](#convenções-de-commit)

---

## Configurando localmente

**Requisitos:** Node.js 24 (o `.mise.toml` fixa a versão).

```bash
git clone git@github.com:InMediam/inmediam-chat.git
cd inmediam-chat
npm install
```

Antes de abrir um PR, rode:

```bash
npm run tsc
npm run lint
npm run test:run
```

O pacote publica **código-fonte** (não há etapa de build), então o que está em
`src/` é exatamente o que vai para o npm.

---

## Estratégia de branches

Sempre crie uma branch a partir da `main` atualizada:

```bash
git checkout main
git pull origin main
git checkout -b feat/minha-mudanca
```

| Prefixo | Use para |
|---------|----------|
| `feat/` | Novas funcionalidades |
| `fix/` | Correções de bugs |
| `refactor/` | Refatoração sem mudança de comportamento |
| `docs/` | Mudanças apenas de documentação |
| `chore/` | Manutenção, dependências, config |

---

## Escrevendo um changeset

Todo PR que altera o pacote publicado deve incluir um changeset: um arquivo
curto que descreve o que mudou e qual bump de versão ele exige. É dele que saem
a nova versão e a entrada no `CHANGELOG.md`.

```bash
npm run changeset
```

1. **Selecione o pacote** — `@inmediam/chat`
2. **Escolha o tipo de bump:**
   - `patch` — correções de bug, ajustes internos sem mudança visível na API
   - `minor` — nova funcionalidade retrocompatível (novo campo opcional no
     `ChatAdapter`, novo export, nova capability)
   - `major` — mudança que quebra quem consome (campo obrigatório novo ou
     removido no `ChatAdapter`, export renomeado, peer dependency com major
     novo)
3. **Escreva o resumo** — ele vai literalmente para o `CHANGELOG.md`. Escreva
   da perspectiva de quem consome o pacote e, se for breaking, diga o que
   precisa mudar no app.

Commite o arquivo gerado em `.changeset/` junto com as suas mudanças.

> PRs sem changeset não geram release. Tudo bem para `docs/` e `chore/`, mas é
> obrigatório para qualquer mudança em `src/`.

> Enquanto o pacote estiver em `0.x`, o changesets trata `major` como
> `0.x → 1.0.0`. Para uma mudança breaking que ainda deva ficar em `0.x`, use
> `minor`.

---

## Abrindo um Pull Request

1. Faça push da branch e abra o PR contra a `main`.
2. Garanta que o changeset (`.changeset/*.md`) está no diff.
3. **O repositório é público.** Revise o diff com a régua da seção
   [Escopo](README.md#escopo--o-que-não-entra-aqui) do README antes de pedir
   review — o que for mergeado vai para o npm.

---

## Processo de release

Os releases são automatizados e acontecem em dois momentos:

1. **No PR** — o workflow `Version` (`.github/workflows/version.yml`) aplica os
   changesets pendentes e commita `chore: version packages` na própria branch
   do PR: sobe a versão no `package.json`, atualiza o `CHANGELOG.md` e sincroniza
   o `package-lock.json`. Revise esse commit junto com o resto do PR.
2. **No merge na `main`** — o workflow `Release`
   (`.github/workflows/release.yml`) roda `tsc`, `lint` e `test:run` e, se
   passarem, `changeset publish`, que publica no npm
   toda versão do `package.json` que ainda não existe no registry, via
   **Trusted Publishing (OIDC)**, com provenance e sem token armazenado.

Não suba versões nem edite o `CHANGELOG.md` à mão.

> O workflow `Version` não roda em PRs vindos de fork (o token é somente
> leitura). Nesse caso o changeset chega à `main` sem ser aplicado, e o
> `Release` abre um PR **"Version Packages"** — mergeá-lo publica a versão.

> **Configuração única (mantenedor):** o Trusted Publisher fica em
> `npmjs.com → @inmediam/chat → Settings → Trusted Publishing` (provider GitHub
> Actions, organização `InMediam`, repositório `inmediam-chat`, workflow
> `release.yml`). Para o fluxo de fork funcionar, marque também "Allow GitHub
> Actions to create and approve pull requests" em
> `Settings → Actions → General` do repositório.

---

## Convenções de commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo>): <descrição curta>
```

| Tipo | Quando usar |
|------|-------------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `refactor` | Mudança de código sem alterar comportamento |
| `style` | Ajuste visual/formatação sem mudança de comportamento |
| `docs` | Apenas documentação |
| `chore` | Build, tooling, config ou dependências |

Mantenha a linha de assunto com menos de 72 caracteres.
