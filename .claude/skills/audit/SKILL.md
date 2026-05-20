---
name: audit
description: >
  Roda auditoria estrutural do workspace Tagino_AIOS em 4 eixos (Memória,
  Identidade, Operação, Cadência), 25 pontos cada, total 100. Imprime scoreboard
  + top 3 gaps ranqueados por leverage com next-step concreto. Read-only por
  default (única escrita opcional é salvar o relatório). Use quando o usuário
  disser "audit do meu workspace", "score do Tagino", "como tá a operação",
  "/audit", "auditoria", ou pra check periódico (recomendado semanal — número
  sobe = sistema melhorando).
---

# /audit — Auditoria do workspace em 4 eixos

Roda check estrutural do workspace Tagino_AIOS. Score 0-100 em 4 eixos. Top 3 gaps com comando concreto pra cada. Primeira run = baseline. Re-rodar semanal = ver evolução. Inspirado pelo `/audit` do AIS-OS de Nate Herk.

**Escopo é estrutural** — "o workspace tá montado certo?". NÃO avalia qualidade do output ou estratégia. Capability gaps ("podia ter skill de X") são responsabilidade do `/mapear-rotinas`. Esse aqui é o check de fundação.

---

## Hoje

- **Data:** !`date +%Y-%m-%d`
- **Workspace:** cwd atual (raiz do Tagino_AIOS)

---

## Os 4 eixos (25 pts cada = 100 total)

| Eixo | O que mede |
|---|---|
| **Memória** | Quanto o sistema conhece o negócio (empresa, voz, foco, decisões) |
| **Identidade** | Quão pronta tá a marca pra output visual (paleta, tipografia, logo, regras) |
| **Operação** | Quanto o sistema tá rodando (skills usadas, output produzido, git ativo, keys conectadas) |
| **Cadência** | Quanto roda sozinho (MCPs, publicação automática, rituais, hooks) |

---

## Algoritmo de scoring

### Memória (25 pts)

| Critério | Pts | Como detectar |
|---|---|---|
| `_memoria/empresa.md` preenchido | 5 | Read empresa.md. Tem `**Nome:**` com valor + `**O que faz:**` >20 chars + `**Cliente:**` >20 chars. Os 3 = 5; 2 = 3; 1 = 1; 0 = 0 |
| `_memoria/preferencias.md` com tom + ranço | 5 | "Tom de voz" section >50 chars + "O que evitar" >20 chars. Ambos = 5; um = 3; nenhum = 0 |
| `_memoria/estrategia.md` com gargalo + foco | 5 | "Prioridade principal" ou "Gargalo identificado" >20 chars + "O que tirar das costas" >20 chars. Ambos = 5; um = 3; nenhum = 0 |
| Voice sample real (não contaminado) | 5 | Bloco `> ...` em preferencias.md `## Tom de voz` com >100 chars. Se `voice_sample_contamination_risk: true` no arquivo → max 2pts. Senão >100 chars = 5; <100 = 2; missing = 0 |
| `decisions/log.md` tem 1+ entry | 5 | Contar linhas com regex `^## \d{4}-\d{2}-\d{2}` em decisions/log.md. 1+ = 5; 0 = 0 |

### Identidade (25 pts)

| Critério | Pts | Como detectar |
|---|---|---|
| Paleta 3+ cores | 6 | Contar hex `#[0-9A-Fa-f]{6}` em design-guide.md. 4+ = 6; 3 = 4; 2 = 2; 0-1 = 0 |
| Tipografia definida | 5 | Section "Tipografia" tem nome de fonte real (não vazio nem placeholder). Definido = 5; parcial = 2; missing = 0 |
| Logo presente | 6 | `identidade/logo*.{png,svg}` existe. 2+ arquivos (escuro+claro) = 6; 1 = 3; 0 = 0 |
| Regras de uso (NUNCA fazer) | 4 | Section "O que NUNCA fazer" em design-guide.md >50 chars. = 4; weak = 2; missing = 0 |
| Sem warnings "refinar manualmente" | 4 | Grep em design-guide.md por `refinar manualmente`, `_pendente_`, `[a definir]`, `(definir`. 0 = 4; 1-2 = 2; 3+ = 0 |

### Operação (25 pts)

| Critério | Pts | Como detectar |
|---|---|---|
| 3+ subpastas em marketing/ ou saidas/ últimos 30d | 5 | Glob `marketing/**/2026-*` e `saidas/**/2026-*` filtrar por mtime <30d. 3+ = 5; 1-2 = 2; 0 = 0 |
| Output (arquivos) últimos 30d | 10 | Contar arquivos em `marketing/`, `saidas/`, `site/` recursivo com mtime <30d. 10+ = 10; 5-9 = 6; 1-4 = 3; 0 = 0 |
| Git commits regulares | 5 | `git log --since="30 days ago" --oneline | wc -l`. 8+ = 5; 4-7 = 3; 1-3 = 1; 0 ou no .git = 0 |
| `.env` com 1+ chave conectada | 5 | Read `.env` se existir, contar linhas `^[A-Z_]+=.+` (não vazias). 2+ = 5; 1 = 3; 0 ou no .env = 0 |

### Cadência (25 pts)

| Critério | Pts | Como detectar |
|---|---|---|
| MCPs conectados | 10 | Read `.mcp.json` ou `.claude/settings.json` (key `mcpServers`). Contar tier-1 (Instagram, WhatsApp, Meta Ads, Google Ads, Calendar). 3+ = 10; 2 = 6; 1 = 3; 0 = 0 |
| Publicação automática rodada | 5 | Glob `marketing/**/.published` ou check git log por `aprovar-post` nos últimos 30d. 1+ ocorrência = 5; 0 = 0 |
| Ritual semanal definido | 5 | Grep em estrategia.md por `semanal`, `toda sexta`, `weekly`, `mapear-rotinas`. Mencionado = 5; não = 0 |
| Hooks ativos | 5 | `.claude/settings.json` tem key `hooks` com 1+ entry. = 5; 0 ou file missing = 0 |

---

## Leverage multipliers (peso dos gaps)

Pra cada critério que perdeu pts: **leverage = (pts perdidos) × (multiplicador de impacto)**.

| Condição | Multiplicador |
|---|---|
| 0 output em 30d (workspace abandonado) | **4x** |
| Memória < 10 pts (sistema não conhece o negócio) | **3x** |
| Identidade < 8 pts (sem brand = output genérico) | **3x** |
| 0 MCPs conectados (workspace isolado) | **2.5x** |
| 0 git commits em 30d (trabalho não versionado) | **2x** |
| 0 entries em decisions/log.md (sem memória institucional) | **1.5x** |
| Voice sample contaminado | **1.5x** |
| Outros | **1x** |

Ordenar gaps por leverage descending. Pegar top 3. Pra cada, escrever 1 linha de **next-step concreto** (comando exato, não abstrato):

- **Memória vazia** → "Roda `/instalar` (ou edita `_memoria/empresa.md` direto)"
- **Identidade vazia** → "Preenche `identidade/design-guide.md` com paleta + tipografia. Mais rápido: roda `/instalar` de novo com o flag `--so-identidade` (se existir) ou edita direto."
- **Logo ausente** → "Sobe `logo-escuro.svg` e `logo-creme.svg` em `identidade/`."
- **0 skills em 30d** → "Roda uma skill — `/carrossel`, `/publicar-tema`, `/anuncio-google`, qualquer uma."
- **0 MCPs** → "Conecta 1 MCP via `claude mcp add <nome>` (Instagram/Calendar/etc.) OU configura chave API via `/conectar`."
- **0 decisions** → "Próxima decisão de negócio (paleta, ICP, fornecedor) roda `/decidir`."
- **Voice contaminado** → "Pede pra cliente colar (não digitar) 1-2 trechos reais. Edita `_memoria/preferencias.md` à mão."
- **0 git commits 30d** → "Roda `/salvar` pra commitar e pushar pro GitHub."
- **0 chaves .env** → "Roda `/conectar openai` (ou outro serviço) pra destravar skills que dependem de API."
- **0 hooks** → "Configura hook em `.claude/settings.json` — ex: hook Stop que dispara /salvar automático após cada skill."

---

## Stage thresholds

| Score | Stage | Significado |
|---|---|---|
| 0-39 | **Stage 0: Foundation** | Montando o workspace. Próximas semanas focar em popular Memória + Identidade. |
| 40-69 | **Stage 1: Built** | Workspace usável. Foco agora é começar a Operar com regularidade. |
| 70-89 | **Stage 2: Compounding** | Uso recorrente gera valor. Foco em Cadência — automatizar publicação e ritmo. |
| 90-100 | **Stage 3: Autonomous** | Rodando bem sem supervisão. Manter, refinar, escalar. |

---

## Output (imprimir em chat)

```
# Tagino_AIOS Audit — {data}
**Score: {total}/100** (Stage {N}: {nome})

## Scoreboard

Memória         {bar}  {n}/25  {label}
Identidade      {bar}  {n}/25  {label}
Operação        {bar}  {n}/25  {label}
Cadência        {bar}  {n}/25  {label}

(bar = ██ por 5 pts vazio + ░░ por 5 pts faltando, total 14 chars de largura)
(label = "Strong" ≥20 | "Solid" 15-19 | "Thin" 8-14 | "Missing" <8)

## Forças
- {1-3 bullets curtos dos critérios com score maior — ressaltar o que tá bom}

## Top 3 Gaps (ranqueados por leverage)

1. **{nome do gap}** (-{pts} × {mult}x = -{leverage} leverage)
   → {next-step concreto com comando exato}

2. **{nome do gap}** (-{pts} × {mult}x = -{leverage} leverage)
   → {next-step concreto}

3. **{nome do gap}** (-{pts} × {mult}x = -{leverage} leverage)
   → {next-step concreto}

## Próximo movimento sugerido

{single most leveraged action — a primeira do top 3, dita em frase ativa}

---
Gaps estruturais apenas. Pra explorar CAPABILITY gaps (o que o workspace
podia FAZER que não faz), roda `/mapear-rotinas` depois desse audit.
```

---

## Passo opcional — salvar o relatório

Depois de imprimir o scoreboard, perguntar:

> "Salvar esse audit em `_auditoria/audit-{data}.md` pra trackear score ao longo do tempo?"

Se sim, criar pasta `_auditoria/` se não existir + escrever o arquivo. **Essa é a única escrita opcional** — fora isso, o audit é read-only.

---

## Regras

- **Read-only por default.** Nunca modificar empresa.md, preferencias.md, estrategia.md, design-guide.md, skills, ou qualquer arquivo do workspace. Única escrita: arquivo do audit em `_auditoria/`.
- **Flexível com nome de arquivo.** Se algum arquivo tiver nome não-canonical mas com intent equivalente, não penalizar. Ex: `_memoria/sobre.md` em vez de `empresa.md` — read e tratar.
- **Speed importa.** Relatório em <60s wall-clock. Read targeted, não tudo. Pra contar skills, listar `.claude/skills/*/` sem ler conteúdo.
- **Honesto, não generoso.** 95/100 é um flex muito alto — quase ninguém merece. Workspace bem usado tipicamente cai 40-70 nos primeiros meses.
- **Sugestões só apontam pra coisas que existem.** Se o workspace não tem skill X, não sugerir "use a skill X". Sugerir o que está disponível ou pode ser instalado via comando concreto.
- **Cadence detection é fuzzy.** Se `.claude/settings.json` não tem hooks ou mcpServers, pode estar OK (cliente novo). Não penalizar como "abandonado" — só pontuar baixo na cadência.

---

## Verification (pra implementador da skill testar)

- **Cold test:** rodar em workspace recém-criado pelo `/processar-entrevista`. Esperado: score ~40-50 (Memória + Identidade altas, Operação + Cadência baixas).
- **Mature test:** rodar em workspace com 30d de uso. Esperado: score 65-85.
- **Empty test:** rodar em workspace recém-clonado, antes de `/instalar`. Esperado: score <20, gap principal "rodar /instalar".
- **Lying test:** rodar em workspace com `_memoria/empresa.md` cheio de placeholder ("[a definir]"). Esperado: detectar e pontuar baixo, não generoso.

---

## Output exemplo (pra Marina Costa, workspace recém-gerado pelo /processar-entrevista)

```
# Tagino_AIOS Audit — 2026-05-20
**Score: 47/100** (Stage 1: Built)

## Scoreboard

Memória         ██████████████  20/25  Strong
Identidade      ████████████░░  18/25  Solid
Operação        ████░░░░░░░░░░   6/25  Missing
Cadência        ████░░░░░░░░░░   3/25  Missing

## Forças
- Memória completa (empresa + preferências + estratégia + voz real pasted + 1 decisão)
- Paleta `#F0EAD6/#B85C3D/#2A2826/#FAFAF7` + tipografia (Marcellus + Karla) definidas

## Top 3 Gaps (ranqueados por leverage)

1. **0 MCPs conectados** (-10 × 2.5x = -25 leverage)
   → Conecta MCP do Instagram via `claude mcp add instagram` OU configura chave Meta Graph via `/conectar`.

2. **0 output em 30 dias** (-10 × 4x = -40 leverage)
   → Roda primeira skill — sugiro `/carrossel` com tema "5 coisas sobre orçamento de interiores" (alinhado ao gargalo no `estrategia.md`).

3. **Logo ausente** (-6 × 1x = -6 leverage)
   → Sobe `logo-escuro.svg` e `logo-creme.svg` em `identidade/` (Marina declarou ter na entrevista).

## Próximo movimento sugerido

Roda `/carrossel` agora — primeira peça gera tração, valida tom de voz, popula `marketing/`. Sem output, todo o resto fica em hipótese.

---
Gaps estruturais apenas. Pra explorar CAPABILITY gaps, roda `/mapear-rotinas` depois.
```

---

## Quando re-rodar

- **Dia 1** (post-`/instalar`): baseline. Score deve cair 35-50.
- **Dia 7:** primeira verificação. Esperado +10-15 pts (output começou).
- **Toda sexta:** ritual semanal. Score deve subir 3-8 pts/semana.
- **Quando algo der errado:** "tá meio quebrado, não sei o que olhar primeiro" → `/audit` aponta.
