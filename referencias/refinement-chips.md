# Padrão: Refinement chips no output de skills

> Inspirado pelo `aiRefine` chips do [creator-ai-app](https://github.com/AllanTagino/creator-ai-app). Adaptado pro CLI (Claude Code).

## O que é

Todo output de skill que pode ter variação (texto, visual, lista) termina com **4-6 "chips"** — eixos clicáveis de refinement. Usuário digita o número OU texto livre se quiser combinar/customizar.

## Por que existe

**Sem chips:** usuário recebe carrossel → quer ajustar → tem que articular "humm, deixa mais X mas mantém Y, e talvez Z". Trabalho cognitivo alto, fricção.

**Com chips:** usuário recebe carrossel → vê 6 eixos pré-articulados → clica/digita o número → skill sabe exatamente qual transformação fazer.

UX win pra:
- Usuário não-técnico (não precisa virar copywriter pra refinar)
- Operador power-user (atalho mais rápido que reescrever briefing inteiro)
- Iteração — cada round fica mais alinhado sem perder a base

## Quando aplicar

✅ **Sempre que produzir output que possa variar em eixos discretos:**
- Texto (carrossel, email, post, legenda, copy)
- Visual (paleta, mockup, layout)
- Lista (sugestões, candidatos, opções)
- Mídia (script, storyboard, prompt de imagem)

❌ **NÃO aplicar quando:**
- Output é determinístico (relatório de dados, CSV, transcrição literal)
- Output é binário (sim/não, exists/not)
- Skill é diagnóstico (`/audit`, `/atualizar` scan)

## Como implementar (em qualquer skill)

### Estrutura na SKILL.md

Adicionar seção **"Refinement chips"** próximo ao final da skill, depois do "Output" e antes de "Regras":

```markdown
## Refinement chips

Após produzir o output, sempre listar os chips de refinement. Formato:

> **Refinements rápidos** (digita o número ou texto livre):
>
> `1` <eixo 1> · `2` <eixo 2> · `3` <eixo 3> · `4` <eixo 4> · `5` <eixo 5> · `6` outra angle

Se o usuário digitar 1-5, aplicar o refinement correspondente e regerar o output (mantendo base). Se digitar `6` (outra angle) ou texto livre, tratar como novo briefing parcial e regerar do zero.
```

### Regras pra escolher chips

Cada chip deve ser **um eixo de variação claro**, não uma opção genérica:

✅ **Bons chips:**
- "Mais direto" (eixo: verbosidade)
- "Mais emocional" (eixo: tom)
- "Foco em número X" (eixo: ângulo de prova)
- "Hook diferente" (eixo: estrutura)
- "Outra angle" (escape hatch: refazer)

❌ **Chips ruins:**
- "Make it better" (vago)
- "Improve" (vago)
- "Try again" (sem direção)
- "I want changes" (não acionável)

### Quantidade

- **Mínimo 4**, máximo 6
- Último chip SEMPRE é "outra angle" (escape pra refazer do zero)
- Chip de extremo oposto vale (ex: "mais formal" + "mais casual" presentes na mesma lista)

### Eixos comuns por tipo de output

| Tipo de output | Eixos típicos |
|---|---|
| **Texto curto** (legenda, email) | verbosidade · tom (formal/casual) · CTA · hook · refazer |
| **Texto longo** (artigo, script) | extensão · técnico/leigo · estrutura · ângulo · refazer |
| **Visual** (carrossel, slide) | densidade · paleta · tipografia · layout · refazer |
| **Lista** (opções, candidatos) | quantidade · critério de ordenação · filtro · refazer |
| **Mídia** (foto IA, vídeo) | mood · framing · luz · cor · refazer |

## Hotkeys

O usuário pode digitar:
- **Número** (`1`, `2`, etc.) — aplica o chip correspondente
- **Múltiplos números** (`1 e 3`) — aplica os eixos combinados
- **Texto livre** — interpreta como briefing custom de refinement
- **`não` / `tá bom` / `aprovo`** — encerra refinement (output final)

## Loop de iteração

Cada round de refinement:
1. Skill produz output
2. Skill lista chips
3. Usuário escolhe (número, combo, texto livre, ou aprova)
4. Se refinement: skill regera **mantendo a base** + aplicando o eixo, lista chips de novo
5. Se aprova: para
6. **Limite de rounds:** após 5 iterações, sugerir "Quer mudar completamente o briefing? Roda a skill de novo com novo input"

## Exemplos por skill

### `/carrossel`
```
1 mais direto · 2 mais emocional · 3 mais curto (menos slides)
4 mais técnico (mais dado) · 5 hook diferente · 6 outra angle
```

### `/email-profissional`
```
1 mais formal · 2 mais casual · 3 mais curto · 4 CTA mais forte · 5 outra abordagem
```

### `/responder-avaliacoes`
```
1 mais empático · 2 mais firme · 3 mais curto · 4 oferece solução concreta · 5 outra abordagem
```

### `/apresentacao-pdf`
```
1 mais conciso (menos páginas) · 2 mais visual (mais imagens) · 3 mais técnico
4 outro layout · 5 outra estrutura completa
```

## Nota pra futuro

Quando Tagino_AIOS ganhar interface web (Cloud Console), os chips viram **botões clicáveis** literalmente — UX upgrade automático. Por enquanto no CLI funciona via número/texto. Mesma estrutura conceitual, fidelidade diferente.
