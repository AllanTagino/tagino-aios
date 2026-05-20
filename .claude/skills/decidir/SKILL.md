---
name: decidir
description: >
  Registra uma decisão de negócio em `decisions/log.md` (append-only) com estrutura
  contexto + decisão + por quê + impacto. Use quando o usuário disser "decidi X",
  "vou parar de fazer Y", "mudei de fornecedor", "trocamos a paleta", "essa
  estratégia não funciona mais", "registra essa decisão", "/decidir", ou quando ele
  fechar uma escolha que vale preservar em memória institucional (não só git history,
  não só chat que vai compactar).
---

# /decidir — Registrar decisão importante no log append-only

Skill que preserva memória institucional: decisões de negócio (mudou paleta, descontinuou serviço, trocou fornecedor, mudou pricing, fechou estratégia) ficam num arquivo append-only que toda skill futura pode ler. Resolve o problema de "tomamos essa decisão há 3 meses e agora ninguém lembra por quê".

Inspirado pelo `decisions/log.md` do AIS-OS de Nate Herk, adaptado ao tom do Tagino_AIOS.

---

## Quando usar / não usar

### USE quando:
- Decisão muda algo permanente no negócio (paleta, ICP, posicionamento, preço, fornecedor, processo, ferramenta core)
- Trade-off explícito foi avaliado e uma direção escolhida ("considerei A e B, vou de B porque...")
- A reversão dessa decisão seria visível e custosa
- Múltiplos contextos no futuro vão depender de saber por que foi feito assim

### NÃO use quando:
- Decisão é técnica trivial (escolhi `Set` vs `Map` num script) — vai pro código + git commit
- Decisão é pontual sem impacto permanente (pediu um carrossel sobre tema X)
- "Decisão" é só uma preferência pontual (Aprender com correções via CLAUDE.md já cobre)
- O usuário tá só pensando alto sem fechar nada

**Quando em dúvida, perguntar:** *"Isso é uma decisão que tu vai querer relembrar daqui 6 meses, ou só uma escolha pontual?"*

---

## Pré-checagem

### 1. `decisions/log.md` existe?

Se não existe (workspace antigo, anterior a essa skill), criar com o cabeçalho padrão:

```markdown
# Decisions log

> Decisões importantes do negócio. Append-only.
> Skill `/decidir` adiciona entries com estrutura contexto + decisão + por quê + impacto.
>
> **Não editar entries antigas.** Se uma decisão for revertida, adicionar nova entry mencionando "revoga decisão de YYYY-MM-DD".

---
```

E avisar: *"Criei `decisions/log.md` — primeira decisão do workspace. A partir de agora todo `/decidir` adiciona aqui."*

### 2. Data atual

Pegar data em formato `YYYY-MM-DD` (zona local do usuário). Usar na entry.

---

## Workflow

### Caso A — usuário deu tudo de uma vez

Se o usuário escreveu uma decisão clara em uma mensagem só (formato livre), tentar extrair os 4 campos automaticamente:

- **Contexto** — o que motivou (situação, gatilho, problema)
- **Decisão** — a escolha feita, em uma frase
- **Por quê** — razão concreta (não "porque sim")
- **Impacto** — o que muda (retrabalho, próximos passos, dependências)

Se conseguiu extrair 3 dos 4, prosseguir e perguntar só o que falta. Se faltar 2+, ir pro Caso B.

### Caso B — interview curto

Perguntar em sequência, uma de cada vez, esperando resposta antes da próxima:

1. **"Qual a decisão, em uma frase?"** — frase curta, ativa. Ex: "Trocar paleta de verde pra terracota."
2. **"O que motivou? (contexto)"** — o que rolou que trouxe pra essa decisão. Pode ser feedback de cliente, dado de uso, mudança de mercado, restrição nova.
3. **"Por quê essa escolha e não outra?"** — alternativa considerada + razão concreta pra escolher essa. Se o usuário disser "porque sim" ou "achei melhor", **pedir concretude uma vez**: *"Que dado/intuição/experiência tá embasando isso?"*. Se vier vago de novo, registrar do jeito que tá.
4. **"Qual o impacto? (o que muda agora)"** — retrabalho, próximos passos, dependências. Se o usuário não souber: registrar "impacto a avaliar".

**Hard cap: 4 perguntas.** Não estender. Se a decisão tá vaga, registrar como tá.

### Caso C — decisão revoga uma anterior

Se o usuário sinalizar reversão ("voltei atrás", "decidi o oposto", "aquilo não rolou"):

1. Procurar no `decisions/log.md` a entry original (por data ou conteúdo aproximado).
2. **Não editar a entry antiga.** Criar nova entry referenciando.
3. Estrutura da entry de reversão:
   - Decisão: o que tá sendo decidido AGORA
   - **Revoga:** entry de `YYYY-MM-DD · <decisão original>`
   - Contexto/por quê: o que mudou desde a original
   - Impacto: o que volta atrás, o que segue

---

## Format da entry

Sempre **append no final** do `decisions/log.md`, separado por `---`:

```markdown
## YYYY-MM-DD · <Decisão em frase curta>

**Contexto:** <o que motivou>

**Decisão:** <a escolha feita, expandida>

**Por quê:** <razão concreta, alternativa considerada>

**Impacto:** <o que muda agora — retrabalho, próximos passos, dependências>

[Se revogação]
**Revoga:** entry de `YYYY-MM-DD · <decisão original>`

---
```

**Regra de título:** primeira linha é cabeçalho `## YYYY-MM-DD · <frase>`. Frase é a decisão em ativo, máx 80 chars. Ex: `## 2026-05-20 · Mudou paleta de verde pra terracota`.

---

## Confirmação final

Mostrar a entry adicionada pro usuário:

```
✓ Decisão registrada em decisions/log.md:

  ## 2026-05-20 · <frase>
  Contexto: ...
  Decisão: ...
  Por quê: ...
  Impacto: ...

Daqui pra frente, qualquer skill que ler decisions/log.md vai conhecer essa decisão.
```

Não perguntar "quer ajustar?". Se o usuário quiser ajustar, ele fala — e nesse caso, em vez de editar a entry, **adicionar nova entry de refinamento** (preserva a história).

---

## Regras

- **Append-only.** Nunca editar entry antiga. Reversão = nova entry com `**Revoga:**`.
- **Data sempre em ISO** `YYYY-MM-DD` (zona local do usuário).
- **Frase do título em ativo.** "Trocar paleta", não "Decisão sobre paleta".
- **Hard cap em 4 perguntas no Caso B.** Se vier vago, registrar do jeito que tá. Não insistir.
- **Concretude só uma vez.** Se a resposta veio vaga, perguntar uma vez por concretude. Não duas.
- **Não criar `decisions/` em workspace que claramente não é Tagino_AIOS.** Checar que existe `CLAUDE.md` na raiz antes.
- **Não duplicar decisões.** Se a entry nova tem texto muito similar a uma recente (últimos 7 dias), perguntar: *"Essa é a mesma decisão de DD/MM ou uma nova?"*

---

## Exemplos

### Exemplo 1 — Caso B (interview)

```
> /decidir
"Qual a decisão, em uma frase?"
[Trocar paleta do Carlos Mendes de verde pra terracota.]
"O que motivou?"
[Feedback do Carlos: disse que verde escuro tava lembrando 'imobiliária popular'.]
"Por quê essa cor e não outra?"
[Terracota carrega 'design editorial brasileiro contemporâneo' — Casa Vogue, AU, revistas que ele consome. Verde só funcionaria se a marca dele fosse mais 'agro/sustentabilidade'.]
"Qual o impacto?"
[Refazer 8 carrosséis já produzidos, atualizar design-guide.md, próxima sessão de carrossel já com paleta nova.]

✓ Decisão registrada em decisions/log.md:

  ## 2026-05-20 · Trocar paleta do Carlos Mendes de verde pra terracota
  ...
```

### Exemplo 2 — Caso A (tudo de uma vez)

```
> /decidir vou parar de aceitar projeto de marcenaria abaixo de R$ 30k. Cliente disse mais 3 vezes "mas pra mim só preciso de um closet pequeno" e eu perco 4h no orçamento que dá margem zero.

[skill extrai 3 dos 4 campos automaticamente]
"Decidi extrair: decisão = 'Não aceitar projetos < R$ 30k'. Contexto = '3 clientes recentes pedindo escopo mini que dá margem zero'. Impacto = 'precisa filtrar lead inicial via mensagem padrão.'"
"Falta só: por quê essa linha em R$ 30k especificamente?"
[Porque abaixo disso o tempo de orçamento + execução não cobre o custo fixo do estúdio.]

✓ Decisão registrada.
```

### Exemplo 3 — Caso C (revogação)

```
> /decidir voltei atrás na paleta — vou ficar com verde escuro mesmo, terracota não bateu com material institucional do empreendimento.

"Achei a entry original: '2026-05-20 · Trocar paleta de verde pra terracota'. Vou criar nova entry de reversão (não vou editar a original)."

✓ Nova entry registrada:

  ## 2026-05-25 · Voltar paleta do Carlos Mendes pra verde escuro
  **Revoga:** entry de 2026-05-20 · Trocar paleta de verde pra terracota
  Contexto: material institucional do empreendimento (Tellus/Benx) usa verde nas peças oficiais; terracota brigou visualmente nos materiais combinados.
  ...
```
