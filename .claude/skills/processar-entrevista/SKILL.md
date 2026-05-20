---
name: processar-entrevista
description: >
  Pega uma submissão da entrevista web (tagino-aios-entrevista.netlify.app), cria
  o workspace local do cliente em `~/CLAUDE/tagino-<slug>/`, popula `_memoria/*.md`
  + `identidade/design-guide.md` + `CLAUDE.md` por perfil. Fecha o loop entre a
  entrevista do cliente e o workspace pronto pra uso. Use quando o usuário
  disser "processar entrevista da <Nome>", "criar workspace da <Nome>",
  "/processar-entrevista <Nome>" ou pedir pra montar a pasta de um cliente novo
  que já preencheu o form. Aceita flag opcional `--site <url>` pra enriquecer
  os arquivos com info do site existente do cliente via WebFetch.
---

# /processar-entrevista — Fechar o loop entrevista → workspace

Entrevista web captura as respostas via Netlify Forms. Essa skill puxa a
submissão, transforma os 10 campos em arquivos `.md` do Tagino_AIOS, monta a
estrutura de pasta e deixa pronto pra abrir com `claude`. Substitui o
copy/paste do markdown.

---

## Pré-checagem

### 1. netlify-cli instalado e logado

```bash
netlify status
```

Se não estiver logado, parar e instruir:
> "Roda `netlify login` antes — preciso de acesso à API pra buscar a submissão."

### 2. Argumentos

Esperar pelo menos `<nome-cliente>`. Aceita também:

- `--site <url>` → faz WebFetch do site pra enriquecer os campos depois de parsear o form
- `--id <submission-id>` → força uma submissão específica (caso tenha mais de uma do mesmo cliente)
- `--dry-run` → mostra o que ia escrever sem criar arquivo

Exemplos válidos:
```
/processar-entrevista Liege
/processar-entrevista Liege --site https://liege.com.br
/processar-entrevista "Carlos Mendes" --site https://carlosmendes.imb.br --dry-run
```

### 3. Slug + caminho destino

Derivar slug do nome do cliente (mesma regra da Fase 5 do `/instalar`):
- minúsculas, sem acentos, espaços → hífen, especiais removidos
- Ex: "Carlos Mendes" → `carlos-mendes`

Destino padrão: `~/CLAUDE/tagino-<slug>/` (em Windows: `C:\Users\<user>\CLAUDE\tagino-<slug>\`).

Se a pasta já existe, perguntar:
> "Já existe `~/CLAUDE/tagino-<slug>/`. Sobrescrever, adicionar sufixo `-2`, ou cancelar?"

---

## Fase 1 — Buscar a submissão na Netlify

### 1.1. Listar submissões do site

O hub está em `tagino-aios-entrevista.netlify.app` (site ID
`f103dcf9-a217-4184-ad9e-07902d2af67c`).

```bash
netlify api listSiteSubmissions --data '{"site_id":"f103dcf9-a217-4184-ad9e-07902d2af67c"}'
```

Retorna array de submissões. Cada uma tem `data` (campos do form, incluindo
`cliente`, `perfil`, `q1`..`q10`, `markdown`, `timestamp`, `origem`) e
`created_at`.

> **Nota:** `listSiteForms` retorna 404 nesse site (provável quirk do Netlify
> com forms detectados dinamicamente). `listSiteSubmissions` pula a busca de
> form ID e funciona direto.

### 1.2. Filtrar a do cliente

Filtrar onde `data.cliente` faz match case-insensitive com `<nome-cliente>`.

- 0 matches → erro: "Nenhuma submissão de '<nome>' encontrada. Confere o nome (na URL `?cliente=Nome`) ou se a entrevista foi enviada de fato."
- 1 match → seguir
- Mais de 1 → listar com `created_at` formatado, perguntar qual usar (ou se passou `--id`, filtrar por `number` primeiro)

### 1.3. Extrair os campos

Da submissão escolhida, pegar `data`:

```
cliente, perfil, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, markdown, timestamp, origem
```

Guardar como `ENTREVISTA` pra usar nas próximas fases.

---

## Fase 2 — Enriquecimento via WebFetch (se --site)

Se `--site <url>` foi passado, usar o tool **WebFetch** nativo com prompt:

> "Extraia dessa página de negócio: (1) descrição do que a empresa faz em 1
> frase, (2) perfil de cliente (quem eles atendem), (3) tom de voz percebido
> (formal/informal, técnico/leigo), (4) cores principais visíveis no design
> (hex se conseguir, ou descrição), (5) tipografia se identificável,
> (6) contato (email, telefone, WhatsApp, endereço) se houver. Responda em
> JSON com chaves: oferta, cliente_perfil, tom, cores, fontes, contato."

Guardar como `SITE_INFO`. Se WebFetch falhar (404, timeout, CORS), continuar
sem enriquecimento e avisar no resumo final.

**Regra de mesclagem:** o que veio do form **sempre tem prioridade**. Site só
preenche o que o cliente deixou em branco ou enriquece com contato/cores que
o cliente não mencionou. Nunca sobrescreve resposta humana.

---

## Fase 3 — Clonar o template

```bash
git clone https://github.com/AllanTagino/tagino-aios.git "$HOME/CLAUDE/tagino-<slug>"
```

Em Windows (PowerShell):
```powershell
git clone https://github.com/AllanTagino/tagino-aios.git "$env:USERPROFILE\CLAUDE\tagino-<slug>"
```

Remover o `.git` do clone (cliente vai começar do zero):
```bash
rm -rf "$HOME/CLAUDE/tagino-<slug>/.git"
```

---

## Fase 4 — Popular os arquivos

### `_memoria/empresa.md`

```markdown
# Empresa

> Memória central do negócio. O Claude lê esse arquivo antes de cada resposta.

**Nome:** {q1}
**O que faz:** {q2}
**Cliente:** {q3}
**Equipe:** {q4}

{se SITE_INFO.contato existir}
**Contato (do site):** {contato}
{fim se}

{se SITE_INFO.oferta existir e q2 vazio}
**Oferta detalhada (do site):** {oferta}
{fim se}

## Contexto adicional
```

### `_memoria/preferencias.md`

```markdown
# Preferências

> Como o Claude escreve em nome do seu negócio. Tom, estilo, vícios a evitar.

## Tom de voz

Exemplo da escrita real do cliente:

> {q5}

{se SITE_INFO.tom existir}
Tom percebido no site: {tom}
{fim se}

## O que evitar

{q6}

## Estilo geral

Direto, alinhado ao exemplo acima. Quando em dúvida, escrever como o exemplo
escreve, não como o site institucional fala.

## Preferências adicionais
```

### `_memoria/estrategia.md`

```markdown
# Estratégia

> O que importa agora. Prioridades, metas, prazos.

## Fase

Início — workspace recém-criado.

## Prioridade principal

**Gargalo identificado:** {q7}

## O que tirar das costas (toda semana)

{q8}

— candidata a virar skill via `/mapear-rotinas`.

## O que pode esperar

(definir depois com o cliente)

## Contexto com prazo
```

### `identidade/design-guide.md`

Pegar o template existente (já no clone) e preencher os campos com base em
`q9` (texto livre sobre cores/fontes), `q10` (logo) e `SITE_INFO.cores` /
`SITE_INFO.fontes` se disponíveis.

Se `q9` tem hex codes parsáveis (`#RRGGBB`), distribuir nos slots:
- Fundo principal: o mais claro
- Cor de destaque / CTA: o mais saturado
- Texto principal: o mais escuro
- Fundo alternativo: secundário claro

Se `q9` é só descrição vaga ("preto e laranja"), preencher como string e
avisar no resumo final que o design-guide precisa de refinamento manual.

Se `SITE_INFO.cores` tem hex específicos, usar como sugestão prioritária
sobre o vago do form.

Se `q10` menciona arquivo subido ("subi logo.svg"), adicionar nota:
> Logo declarado pelo cliente — buscar no Drive (`{CLIENTE.materiaisUrl}` se
> disponível) e copiar pra `identidade/logo.{ext}`.

### `CLAUDE.md`

1. Ler o template do perfil correspondente:
   `templates/perfis/claude-md-{perfil}.md` (perfil vem de `ENTREVISTA.perfil`,
   um de: `solopreneur`, `freelancer`, `agencia`, `empresa`)
2. Substituir os placeholders `[Seu Nome]`, `[nome]`, `[Uma frase...]` etc.
   com os dados de `ENTREVISTA`
3. Sobrescrever o `CLAUDE.md` da raiz do workspace recém-criado

---

## Fase 5 — Limpeza e checks

- Deletar `_memoria/.gitkeep` se existir (não precisa mais, arquivos populados)
- Confirmar que cada arquivo populado tem conteúdo real (não placeholder)
- Listar pendências:
  - Logo físico não copiado (cliente subiu no Drive)
  - Design-guide com texto vago
  - Campos vazios da entrevista (cliente pulou)

---

## Fase 6 — Resumo final

```
✓ Workspace criado: ~/CLAUDE/tagino-<slug>/
✓ Perfil aplicado: <perfil>
✓ Memória populada: empresa.md · preferencias.md · estrategia.md
✓ Identidade: design-guide.md  [completo | parcial — refinar manualmente]
✓ CLAUDE.md adaptado pro perfil <perfil>

{se --site usado}
✓ Site lido: {url}
  ↳ Enriquecimento aplicado em: {lista de campos}
{fim se}

Pendências:
{lista, ex:}
- [ ] Logo: cliente subiu no Drive (<link>) — baixar e copiar pra identidade/logo.{ext}
- [ ] Q8 ("o que tirar das costas") vazio — perguntar pro cliente na primeira call

Pra começar a trabalhar:
  cd ~/CLAUDE/tagino-<slug>
  claude
  /abrir

Quando quiser publicar o workspace no GitHub do cliente: /salvar
```

---

## Regras

- **Nunca inventar dados.** Se o cliente pulou pergunta, deixar placeholder claro no `.md` (`_(não respondido)_`), não preencher com palpite.
- **Form > Site.** Resposta humana sempre ganha. Site só enriquece o que ficou em branco ou adiciona contato/cor que ficou de fora.
- **Sem commit automático.** Não rodar `git init` + `git add` + `git commit` no workspace. Cliente (ou Allan via `/salvar`) decide quando publicar.
- **Idempotência.** Rodar 2x com o mesmo nome → perguntar se sobrescreve. Não destruir trabalho silenciosamente.
- **Site ID hardcoded** (`f103dcf9-a217-4184-ad9e-07902d2af67c`) — se mudar o hub no futuro, editar essa skill.
- **Pasta destino é convenção do Allan** (`~/CLAUDE/tagino-<slug>/`). Se o user rodar isso noutro setup, oferecer flag `--destino <path>` (não no MVP).

---

## Exemplos de uso

**Caso 1 — cliente sem site:**
```
/processar-entrevista Liege
```
Resultado: `~/CLAUDE/tagino-liege/` populada com as respostas da Liege.

**Caso 2 — cliente com site:**
```
/processar-entrevista Liege --site https://liege.com.br
```
Resultado: idem + WebFetch enriquece contato/cores/oferta onde faltou.

**Caso 3 — dry run pra ver o que vai escrever:**
```
/processar-entrevista Liege --dry-run
```
Mostra cada arquivo que ia criar, sem mexer no disco.

**Caso 4 — múltiplas submissões da mesma cliente:**
```
/processar-entrevista Liege
> Achei 3 submissões da Liege:
>   1) 2026-05-19 14:32  (mais recente)
>   2) 2026-05-18 09:11
>   3) 2026-05-17 21:55
> Qual usar? [1]
```
