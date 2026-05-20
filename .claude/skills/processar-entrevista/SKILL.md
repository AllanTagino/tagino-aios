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
cliente, perfil, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
voice_method (opcional — 'pasted'|'typed'|'' — desde 2026-05-20 em diante),
markdown, timestamp, origem
```

Guardar como `ENTREVISTA` pra usar nas próximas fases.

> **Nota sobre `voice_method`:** submissões anteriores a 2026-05-20 (ex: Liege #1) não têm esse campo. Tratar como `""` (desconhecido). Quando vier `"typed"`, marcar contaminação no `preferencias.md` (ver Fase 4).

> **Nota sobre submissões via teste automatizado:** submit via `curl` sem headers de browser (`User-Agent`, `Referer`, `Origin`) cai no Akismet do Netlify e fica invisível pro `listSiteSubmissions` default. Pra teste E2E programático, incluir esses headers. Submissões de cliente real via browser sempre passam — esse cuidado é só pra automação.

---

## Fase 2 — Enriquecimento via multi-source brand research (se --site)

Se `--site <url>` foi passado, fazer **research paralelo em 4 fontes** + síntese.

Inspirado pelo `aiAnalyzeBrandUrl` do [creator-ai-app](https://github.com/AllanTagino/creator-ai-app) — substituiu o single-fetch anterior por uma pipeline que captura significativamente mais sinal sobre a marca.

### 2.1 — Identificar as 4 fontes pra pesquisar

A partir do `<url>` passado:

1. **Home page** = `<url>` original
2. **About/mission pages** — tentar variações comuns em paralelo:
   - `<url>/sobre`
   - `<url>/about`
   - `<url>/about-us`
   - `<url>/quem-somos`
   - `<url>/empresa`
   - `<url>/company`
   - `<url>/mission`
   Usar a primeira que retorna 200. Se todas 404, pular essa fonte.
3. **Wikipedia REST summary** — se a marca tiver nome próprio identificável (extrair do título da home), tentar:
   - `https://pt.wikipedia.org/api/rest_v1/page/summary/<nome-da-marca>`
   - Fallback: `https://en.wikipedia.org/api/rest_v1/page/summary/<nome-da-marca>`
4. **DuckDuckGo instant answer** — `https://api.duckduckgo.com/?q=<nome-da-marca>&format=json&no_html=1`
   - Boa fonte pra marcas que tem fact box ou descrição curta

### 2.2 — Disparar WebFetch das 4 fontes EM PARALELO

Importante: 4 chamadas WebFetch numa única response (paralelas), não sequenciais. Cada uma com prompt específico:

**Home page WebFetch:**
> "Extraia dessa home page: (1) descrição em 1 frase do que a empresa faz (procura por hero/header), (2) perfil de cliente sugerido pelo design e copy (formal/casual, premium/popular), (3) tom de voz (vocabulário, jargão usado), (4) cores principais visíveis (hex se conseguir ler de CSS inline ou descrever as cores dominantes), (5) tipografia se identificável (nome de fonte em CSS, ou descrever 'serif elegante' / 'sans bold'), (6) contato (email, telefone, WhatsApp em E.164, endereço, redes sociais). Responda JSON: {oferta, cliente_perfil, tom, cores, fontes, contato, social_links}."

**About page WebFetch (na URL que retornou 200):**
> "Extraia dessa página About: (1) missão/propósito da empresa, (2) ano de fundação, (3) tamanho da equipe se mencionado, (4) história curta, (5) valores listados, (6) fundadores se nomeados. Responda JSON: {missao, fundacao, tamanho_equipe, historia, valores, fundadores}."

**Wikipedia WebFetch (se tentou):**
> "Extraia: descrição da empresa, setor, sede, fundação, número de funcionários, fundadores. Responda JSON: {descricao, setor, sede, fundacao, funcionarios, fundadores}."
> (Se Wikipedia retornar 404 ou disambiguation page, marcar como `null`.)

**DuckDuckGo WebFetch (se tentou):**
> "Extraia o 'Abstract' e 'AbstractText' do JSON retornado. Se vazio, marcar como `null`. Responda JSON: {abstract, source_url}."

### 2.3 — Sintetizar as 4 fontes em SITE_INFO único

Após as 4 fontes responderem (algumas podem ter falhado — OK), consolidar:

```json
{
  "oferta": "<derivada de home.oferta + about.missao + wiki.descricao, escolhendo a mais específica>",
  "cliente_perfil": "<de home.cliente_perfil>",
  "tom": "<de home.tom>",
  "cores": ["<hex>", "<hex>"],
  "fontes": ["<nome de fonte>"],
  "contato": {
    "email": "...",
    "telefone": "...",
    "whatsapp": "...",
    "endereco": "...",
    "social": ["...", "..."]
  },
  "extras": {
    "missao": "<de about.missao>",
    "fundacao": "<de about.fundacao ou wiki.fundacao>",
    "tamanho": "<de about.tamanho_equipe ou wiki.funcionarios>",
    "historia_curta": "<de about.historia>",
    "valores": ["<...>"],
    "fundadores": ["<...>"],
    "setor": "<de wiki.setor>",
    "sede": "<de wiki.sede>"
  },
  "fontes_consultadas": ["home", "about?", "wikipedia?", "duckduckgo?"],
  "fontes_falhadas": ["<lista das que retornaram null/erro>"]
}
```

Guardar como `SITE_INFO`.

### 2.4 — Regras de fallback

- Se **0 das 4 fontes** retornaram dados úteis → SITE_INFO fica vazio, avisar no resumo final: "Não consegui extrair info do site (provável CORS ou site SPA). Workspace gerado só com dados da entrevista."
- Se **só Home retornou** → seguir como antes (single-source — graceful degradation pro pattern antigo)
- Se **About falhou mas Wikipedia tem entry** → priorizar Wikipedia pra missão/história
- Se múltiplas fontes têm o mesmo campo (ex: missão) → preferir a mais longa/específica

### 2.5 — Regra de mesclagem com a entrevista

**O que veio do form (entrevista do cliente) SEMPRE tem prioridade.** SITE_INFO só:
- Preenche o que o cliente deixou em branco
- Adiciona campos que a entrevista não cobre (`extras` — missão, fundação, etc.)
- Enriquece contato/cores quando o cliente não detalhou

**Nunca sobrescreve resposta humana.** Se cliente disse "atendemos casais 28-40" e site sugere "atendemos PMEs", manter o do cliente.

### 2.6 — Custo

4 WebFetches paralelos ≈ ~5-15s wall-clock (gargalo = mais lento dos 4). ~3-5× input pro Claude na fase de síntese (vira ~$0.05-0.10 por workspace, vs $0.02 anterior). Trivial, ganho de qualidade compensa.

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

## Fase 4 — Escrever `intake.md` (source-of-truth)

**Antes de derivar qualquer `_memoria/*.md`, escrever o `intake.md` a partir dos dados da submission.** Isso preserva as respostas originais como source-of-truth editável — Allan/cliente pode editar `intake.md` depois e rodar `/instalar` pra regenerar.

Template do intake.md já vem no clone (`intake.md` na raiz, com placeholders). Sobrescrever cada Q com a resposta correspondente.

**Mapping:**

```yaml
---
perfil: {ENTREVISTA.perfil}
data_intake: {ENTREVISTA.timestamp} (só a parte YYYY-MM-DD)
voice_method: {ENTREVISTA.voice_method || ""}
---

## Q1 — Como você chama o que faz?
{ENTREVISTA.q1}

## Q2 — O que sua empresa entrega, em uma frase?
{ENTREVISTA.q2}

(...e assim por diante até Q10)

## Q5 — Cola um exemplo da tua escrita (paste verbatim, não digita)
> {ENTREVISTA.q5}
```

Q5 fica em blockquote (`>`). Outras Qs são texto plano. Pra Q9 (cores) e Q6 (ranço), manter formato original (texto livre com itens separados por vírgula).

---

## Fase 5 — Derivar `_memoria/*.md` + `identidade/design-guide.md` + `CLAUDE.md`

**A partir desse ponto, a lógica de derivação é IDÊNTICA à Fase 3 do `/instalar`.** Em vez de duplicar tudo aqui, segue o mesmo algoritmo descrito em `.claude/skills/instalar/SKILL.md` seção "Fase 3 — Derive".

Resumo da derivação (referência rápida, fonte canônica é `/instalar`):

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

{se voice_method === "typed"}
**⚠️ voice_sample_contamination_risk: true** — cliente digitou esse exemplo dentro do form em vez de colar de algo real (email, post, DM). Sample pode estar moldado pela tela do form em vez do registro natural. Calibrar tom com cautela e pedir refinamento depois da primeira semana de uso real.
{fim se}

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

Se `q9` tem hex codes parsáveis (`#RRGGBB`), distribuir nos slots via algoritmo:

1. **Extrair todos os hex** com regex `#[0-9A-Fa-f]{6}`. Se 0, pular pro fallback.
2. **Calcular luminância relativa** de cada (fórmula W3C: `0.2126*R + 0.7152*G + 0.0722*B`, R/G/B normalizados 0-1 com gamma correction). Ordenar do mais claro pro mais escuro.
3. **Calcular saturação HSL** (`S = (max - min) / (1 - |2L - 1|)` com L = luminância simples). Identificar o mais saturado (excluindo extremos near-black L<0.1 ou near-white L>0.9).
4. **Distribuir nos slots:**
   - **Fundo principal** → o mais claro (maior luminância)
   - **Texto principal** → o mais escuro (menor luminância)
   - **Cor de destaque / CTA** → o mais saturado entre os restantes
   - **Fundo alternativo / cards** → 2º mais claro, OU `#FFFFFF` se só tiver 1 claro
   - **Cor de detalhe secundária** → o que sobrar (geralmente um meio-tom)

**Edge cases:**
- **1 hex** → tratar como cor de destaque. Resto: fundo `#FAFAF7`, texto `#1A1A1A`, alternativo `#FFFFFF`. Mencionar no resumo: "paleta extraída de 1 cor só — complementares foram preenchidas com neutros, refinar manualmente."
- **2 hex** → o mais claro vira fundo, o mais escuro vira texto OU destaque (se for saturado). Outros slots: neutros padrão.
- **5+ hex** → usar os 5 que melhor encaixam (mais claro, mais escuro, mais saturado, 2º mais claro, meio-tom). Ignorar resto e mencionar no resumo final.
- **Tons quase iguais** (diferença de luminância < 0.05): tratar como duplicada, usar uma só.

Se `q9` é só descrição vaga ("preto e laranja"), preencher como string e avisar no resumo final que o design-guide precisa de refinamento manual.

Se `SITE_INFO.cores` tem hex específicos, usar como sugestão prioritária
sobre o vago do form.

Se `q10` menciona arquivo subido ("subi logo.svg"), adicionar nota:
> Logo declarado pelo cliente — buscar no Drive (`{CLIENTE.materiaisUrl}` se
> disponível) e copiar pra `identidade/logo.{ext}`.

### `CLAUDE.md`

1. Ler o template do perfil correspondente: `templates/perfis/claude-md-{perfil}.md` (perfil vem de `ENTREVISTA.perfil`, um de: `solopreneur`, `freelancer`, `agencia`, `empresa`)

2. **Mapping explícito de placeholders** (substituir cada ocorrência):

| Placeholder no template | Fonte (ENTREVISTA) | Fallback se vazio |
|---|---|---|
| `[Seu Nome]` (título) | `q1` | "[a definir]" |
| `[nome]` (em "Sou [nome]") | `q1` | "[a definir]" |
| `[Uma frase...]` / `[Uma frase do que essa pasta representa.]` | derivar de `q2` (oferta) | "[Operação do negócio]" |
| `[O que eu faço em uma frase]` / `[O que sua empresa entrega]` | `q2` | "[a definir]" |
| `[O que diferencia o meu jeito...]` / `[Posicionamento]` | inferir de `q2` + `q3` (qual gap do mercado o ICP enfrenta) | "[a refinar com cliente nas primeiras sessões]" |
| `[Quem me acompanha hoje]` / `[Minha audiência]` | `q3` | "[a definir]" |
| `[tipo de conteúdo 1/2/3]` / `[Principais entregas]` | inferir do contexto (corretor → carrossel + ads + WhatsApp; arquiteto → projeto + render + Insta; etc.) | "[a mapear nas primeiras semanas]" |
| `[Como você escreve...]` | resumo curto de `q5` (1 frase) | "[ver `_memoria/preferencias.md`]" |
| `[o que destoa de você]` | resumo curto de `q6` (lista) | "[ver `_memoria/preferencias.md`]" |
| `[O que você defende. Sua tese.]` | inferir de `q3` + `q7` (qual problema do ICP a oferta resolve) | "[a refinar com cliente]" |

3. **Sempre adicionar** uma seção "## Origem desse workspace" no final do `CLAUDE.md` com:
   - Data de geração
   - Cliente e perfil aplicado
   - URL da submissão (origem)
   - Pendências conhecidas (logo não copiado, design-guide com warnings, etc.)

4. Sobrescrever o `CLAUDE.md` da raiz do workspace recém-criado.

---

## Fase 6 — Limpeza e checks

- Deletar `_memoria/.gitkeep` se existir (não precisa mais, arquivos populados)
- Confirmar que cada arquivo populado tem conteúdo real (não placeholder)
- Listar pendências:
  - Logo físico não copiado (cliente subiu no Drive)
  - Design-guide com texto vago
  - Campos vazios da entrevista (cliente pulou)

---

## Fase 7 — Resumo final

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
