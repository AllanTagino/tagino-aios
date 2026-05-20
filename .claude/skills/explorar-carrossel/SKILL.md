---
name: explorar-carrossel
description: >
  Skill premium de brainstorm de carrossel. Pega um tema e gera 4 directions
  criativas distintas (Conservative explainer / Controversial take / Data-heavy /
  Story-driven) cada uma com headline, risk profile, premise, tension, e "o que
  funciona / o que falha pra esse ICP". Usuário escolhe uma e a skill chama
  `/carrossel` automaticamente com a direction selecionada. Pra quando vale gastar
  tempo escolhendo o ângulo (cliente premium, lançamento crítico, tema sensível,
  ou quando o tema é vago e tem N abordagens possíveis). Use quando o usuário
  disser "/explorar-carrossel", "preciso de ideias pra carrossel", "me dá ângulos
  pra X", "brainstorm de carrossel", "qual o melhor jeito de falar de X",
  "não sei como abordar Y".
---

# /explorar-carrossel — Brainstorm de 4 directions antes de produzir

Skill premium de pré-produção. Em vez de gerar 1 carrossel direto, gera **4 ângulos criativos distintos** sobre o tema. Usuário escolhe um → skill chama `/carrossel` automaticamente com o ângulo escolhido como briefing extra.

**Quando vale usar (vs `/carrossel` direto):**
- ✅ Tema vago ou abre muitas possibilidades ("falar sobre HIS-2", "post sobre o lançamento")
- ✅ Trabalho premium pra cliente que paga por brainstorm explícito
- ✅ Tema sensível/controverso onde direction errado custa caro (legal, médico, financeiro regulado)
- ✅ Quando o output anterior caiu no óbvio e quer forçar ângulos mais arriscados
- ❌ Tema super específico já com ângulo claro ("carrossel comparando taxa SBPE 2025 vs 2026") → vai direto pro `/carrossel`
- ❌ Quando tempo é mais valioso que variedade → vai direto

Inspirado pelo `aiGenerateDirections` do creator-ai-app, adaptado pro Tagino_AIOS.

---

## Dependências

- **Identidade visual:** `identidade/design-guide.md` — pra calibrar tom dos directions à marca
- **Contexto do negócio:** `_memoria/empresa.md` — ICP (q3) influencia "o que funciona / o que falha"
- **Tom de voz:** `_memoria/preferencias.md` — directions respeitam vocabulário/ranço do cliente
- **Estratégia:** `_memoria/estrategia.md` — gargalo + foco influenciam quais ângulos priorizar
- **Decisões:** `decisions/log.md` — se houver decisão sobre paleta/posicionamento, considerar
- **Skill chamada no fim:** `/carrossel`

---

## Workflow

### Passo 1 — Coletar o tema

Se o usuário invocou com argumento (`/explorar-carrossel <tema>`), usar direto.

Se não, perguntar:
> "Qual o tema do carrossel que tu quer explorar?"

Aceitar tema em qualquer formato. Se vier vago demais ("alguma coisa sobre imóvel"), pedir 1 vez mais concretude:
> "Pode ser mais específico? Ex: 'taxa SBPE 2026', '5 erros ao comprar planta', 'comparativo HIS-2 vs SBPE', 'estudo de caso Tellus Pinheiros'"

### Passo 2 — Ler contexto

Antes de gerar directions, ler:
- `_memoria/empresa.md` → quem é o cliente, ICP
- `_memoria/preferencias.md` → tom, ranço (evitar palavras específicas)
- `_memoria/estrategia.md` → gargalo atual (pode influenciar ângulo)
- `identidade/design-guide.md` → vibe da marca (sóbria? agressiva? técnica?)

Guardar contexto pra calibrar directions.

### Passo 3 — Gerar 4 directions distintas

Pensar em **4 ângulos genuinamente diferentes** (não 4 versões da mesma coisa). Cada direction deve ter:

| Campo | Conteúdo |
|---|---|
| **Direction name** | Slug curto: "Conservative explainer", "Controversial take", "Data-heavy", "Story-driven" (ou nome custom se fizer mais sentido) |
| **Risk profile** | `low` (seguro, didático) · `medium` (ângulo menos óbvio) · `high` (controverso, polarizador) |
| **Headline proposta** | Frase concreta que poderia virar Slide 1 (capa). Máximo 8 palavras. |
| **Premise** | 1 frase: qual a tese central desse direction |
| **Tension** | O que cria engagement (curiosidade, conflito, validação, descoberta) |
| **O que funciona pra esse ICP** | Por que esse direction encaixa com o ICP (q3 do empresa.md) |
| **O que falha pra esse ICP** | Risco real desse direction com esse público — ser honesto |

**Defaults dos 4 directions:**

1. **Conservative explainer** (risk: low)
   - Premise: didático, "5 coisas sobre X"
   - Tension: curiosidade (gap de conhecimento)
   - Funciona com: ICP que tá no início da jornada, primeiro comprador, leigo
   - Falha com: público experiente (parece básico demais)

2. **Controversial take** (risk: high)
   - Premise: ângulo contra-corrente, opinião forte
   - Tension: conflito (chama atenção, divide)
   - Funciona com: ICP que valoriza autoridade, "alguém que fala a verdade"
   - Falha com: cliente regulado (legal/médico/financeiro), pode prejudicar reputação

3. **Data-heavy** (risk: medium)
   - Premise: número primeiro, autoridade técnica
   - Tension: validação ("é mesmo X% — eu não sabia")
   - Funciona com: ICP analítico, profissional, faixa de renda alta
   - Falha com: ICP que precisa ser convencido emocionalmente, ou quando o dado é arido

4. **Story-driven** (risk: medium)
   - Premise: case real ou personagem, narrativa
   - Tension: identificação ("isso poderia ser eu")
   - Funciona com: ICP que se vê na história contada
   - Falha com: tema técnico que story-telling deixa raso

**Adaptação por contexto:**

Se o cliente é **regulado** (advogado, médico, financeiro): substituir "Controversial take" por **"Provocative framing"** (provocador mas não polarizador) OU **"Myth-busting"** (desconstruir mito específico). Reduz risco de problema regulatório.

Se o cliente é **B2B**: substituir "Story-driven" por **"Case study"** (estrutura formal: problema → solução → resultado mensurável).

Se o tema é **sensível** (saúde, dinheiro, política): **NUNCA** marcar nenhum direction como "Controversial high risk" sem flag explícito de "validar com cliente antes de publicar".

### Passo 4 — Apresentar pro usuário

Formato:

```markdown
## 4 directions pra "<tema>"

### Direction 1 · Conservative explainer
**Risk:** 🟢 baixo
**Headline:** "5 coisas sobre comprar planta em Pinheiros"
**Premise:** Didático, lista de pontos que primeiro comprador precisa saber
**Tension:** Curiosidade — leitor sente que tá ganhando conhecimento útil
**✓ Funciona pra teu ICP** (casal 28-40 primeiro imóvel): perfeito — eles querem entender antes de comprar
**✗ Pode falhar**: corretor experiente pode achar raso

---

### Direction 2 · Controversial take
**Risk:** 🔴 alto
**Headline:** "Por que SBPE 5,5% é cilada disfarçada"
**Premise:** Desafia consenso de que SBPE é sempre boa escolha
**Tension:** Conflito — gera comentário ("não concordo", "depende"), aumenta alcance
**✓ Funciona pra teu ICP**: cria autoridade técnica, separa "vendedor de imóvel" de "consultor sério"
**✗ Pode falhar**: cliente potencial que confia em SBPE pode rejeitar de cara. Concorrente pode usar pra desqualificar.

---

### Direction 3 · Data-heavy
**Risk:** 🟡 médio
**Headline:** "+12% INCC: o número escondido do teu apto"
**Premise:** Calcular impacto real do INCC sobre o valor pago final
**Tension:** Validação ("eu não sabia que era tanto") — repost-friendly
**✓ Funciona pra teu ICP**: casal renda 12-25k é analítico, faz planilha, valoriza número
**✗ Pode falhar**: pode assustar lead na decisão final ("então não vou comprar")

---

### Direction 4 · Story-driven
**Risk:** 🟡 médio
**Headline:** "A história do João: comprou planta em 2022, recebe em 2026"
**Premise:** Acompanha 1 cliente real (anonimizado) pela jornada de 4 anos
**Tension:** Identificação ("isso vai acontecer comigo") + curiosidade ("como terminou?")
**✓ Funciona pra teu ICP**: gente que tá pensando em comprar planta agora se vê na história
**✗ Pode falhar**: se o "fim" da história não for satisfatório, mensagem fica ambígua

---

**Qual direction tu quer levar pro `/carrossel`?**

- `1` Conservative · `2` Controversial · `3` Data-heavy · `4` Story-driven
- `outras` — gera 4 directions novas (rotação)
- `combinar` — descreve o mix que tu quer (ex: "1 + 3 mas mais emocional")
- `cancelar` — sai sem produzir
```

### Passo 5 — Processar escolha do usuário

**Se usuário escolheu 1-4 por número:**
- Chamar `/carrossel` com tema original + direction selecionada como briefing extra
- Passar como contexto: headline proposta, premise, tension, risk profile
- `/carrossel` produz o carrossel completo seguindo essa direction

**Se usuário pediu `outras`:**
- Gerar 4 directions completamente novas (não repetir os 4 anteriores). Rotacionar:
  - Substituir Conservative por "Counterintuitive insight"
  - Substituir Controversial por "Polarizing question"
  - Substituir Data-heavy por "Visual comparison"
  - Substituir Story-driven por "Behind-the-scenes"
- Apresentar de novo

**Se usuário pediu `combinar`:**
- Pedir descrição do mix
- Sintetizar uma 5ª direction custom baseada na descrição
- Apresentar, perguntar se aprova
- Aprovado → chama `/carrossel`

**Se usuário pediu `cancelar`:**
- Sair sem produzir nada
- Sugerir: "Quer salvar essas 4 directions em `marketing/explorar-<tema>-<data>.md` pra retomar depois?"

### Passo 6 — Registro opcional em decisions/log

Se a escolha do direction representa decisão de posicionamento (ex: cliente conservador escolhendo direction "Controversial"), perguntar:

> "Esse direction muda o jeito que a marca normalmente fala. Quer registrar em `decisions/log.md` via `/decidir`?"

Não perguntar se for escolha óbvia (conservative pra cliente conservador).

---

## Output salvo

Sempre salvar as 4 directions geradas em:
```
marketing/explorar-<tema-slug>-<YYYY-MM-DD>/directions.md
```

Mesmo que o usuário não escolha nenhuma — fica como histórico de brainstorm. Se rodar `/explorar-carrossel` de novo no mesmo tema, lê o histórico e propõe **directions diferentes dos já gerados**.

---

## Regras

- **4 directions GENUINAMENTE distintos** — não 4 versões da mesma coisa. Cada um deve ter premise, tension, e headline visivelmente diferentes.
- **Honest "what fails"** — não fingir que o direction é perfeito. Listar risco real. O valor da skill é forçar reflexão, não vender direction.
- **Calibrar risco ao cliente regulado** — nunca propor "high risk controversial" pra advogado/médico/financeiro sem flag de "valida antes de publicar".
- **Não rodar /carrossel sem aprovação explícita** — direction é proposta, não execução automática.
- **Limite de rounds de "outras"** — 2 rounds (8 directions totais). Após isso, sugerir mudar o tema.
- **Headline tem que caber em 8 palavras** — se não cabe, é descrição, não headline.
- **Tension obrigatória** — toda direction tem que articular o que cria engagement. "Conteúdo útil" não é tension.

---

## Exemplos de uso

### Exemplo 1 — tema vago, gera variedade

```
> /explorar-carrossel sobre o lançamento Tellus Pinheiros

[skill lê contexto: ICP = casal jovem primeiro imóvel · tom direto · paleta sóbria]

[Gera 4 directions:]
1. Conservative · "5 motivos pra olhar Tellus Pinheiros"
2. Controversial · "Tellus Pinheiros vai estourar — ou vai fracassar?"
3. Data-heavy · "R$ 580k em 28m² — vale ou não vale?"
4. Story-driven · "Conheça a Marina: comprou planta no Tellus há 1 ano"

[Usuário escolhe 3]

[Skill chama /carrossel com tema "Lançamento Tellus Pinheiros" + direction "Data-heavy: R$ 580k em 28m² — vale ou não vale?"]
```

### Exemplo 2 — cliente regulado (advogado), adapta directions

```
> /explorar-carrossel sobre divórcio consensual

[skill detecta: ICP advocacia familiar, tema legal sensível]

[Adapta defaults: substitui Controversial por Myth-busting; mantém Conservative; adapta Story-driven pra Case study]

1. Conservative · "Divórcio consensual: o passo a passo"
2. Myth-busting · "3 mitos sobre divórcio consensual que custam caro"  [risk: medium, não high]
3. Data-heavy · "Tempo médio: divórcio consensual vs litigioso"
4. Case study · "Como o casal X resolveu em 45 dias" [anonimizado]

[Note no Direction 2: ⚠️ valida texto exato com cliente antes de publicar — desmistificar pode atrair crítica de colega advogado]
```

### Exemplo 3 — usuário pede outras

```
> /explorar-carrossel sobre HIS-2
[... gera 4 ...]
[Usuário: "outras"]
[Skill rotaciona: gera 4 novas (Counterintuitive insight / Polarizing question / Visual comparison / Behind-the-scenes)]
[Usuário escolhe 2]
[Chama /carrossel]
```

### Exemplo 4 — usuário pede combinar

```
> /explorar-carrossel sobre financiamento SBPE
[... gera 4 ...]
[Usuário: "combinar — quero 1 e 3 mas com tom mais emocional"]
[Skill sintetiza Direction 5 custom: "Conservative + Data-heavy + emotional appeal" — headline "O que ninguém te conta sobre os 5,5% do SBPE"]
[Usuário aprova]
[Chama /carrossel]
```
