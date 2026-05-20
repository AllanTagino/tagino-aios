---
name: instalar
description: >
  Instala o Tagino_AIOS no negócio do usuário. Lê (ou faz entrevista pra preencher)
  o `intake.md` — source-of-truth das 10 respostas — e deriva `_memoria/*.md`,
  `identidade/design-guide.md` e `CLAUDE.md` a partir dele. Idempotente — rodar
  100 vezes com o mesmo intake = mesmo resultado. Use quando o usuário acabou de
  clonar o repositório, pedir "rodar /instalar", "primeiro setup", ou pra
  **regenerar** os arquivos após editar `intake.md` ("atualizei o intake, roda
  /instalar de novo").
---

# /instalar — Setup do workspace via intake.md (source-of-truth)

Esse é o comando que monta (e re-monta) o workspace a partir do `intake.md` na raiz. O `intake.md` carrega as 10 respostas em formato editável; `/instalar` deriva os arquivos de contexto (`_memoria/*.md`, `identidade/design-guide.md`, `CLAUDE.md`) a partir delas.

Idempotente — editar `intake.md` e re-rodar = workspace regenerado. **Edição direta nos `_memoria/*.md` é sobrescrita na próxima run** (esse é o trade-off do source-of-truth).

---

## Pré-checagem

### 1. Nome da pasta

Conferir `basename "$(pwd)"`. Se for `tagino_aios`, `Tagino_AIOS`, `Tagino_AIOS-main`, ou variação genérica:

> "Notei que a pasta atual ainda tem nome genérico ('<nome-atual>'). O ideal é a pasta ter o nome do seu negócio. Quando terminarmos, te lembro de renomear. Bora seguir?"

Registrar mentalmente pra Fase 5.

### 2. Estado do intake.md

Conferir `intake.md` na raiz:

- **Não existe** → workspace antigo (pré-B2 intake source-of-truth). Cair na **Auto-migration** (ver abaixo).
- **Existe, todas Q1-Q10 com placeholder `_[...]_`** → setup limpo. Ir pra Fase 1 (Interview).
- **Existe, algumas Qs preenchidas** → ir pra Fase 0 (Decide flow).
- **Existe, todas Q1-Q10 preenchidas** → pular Interview, ir direto pra Fase 3 (Derive).

### 3. Auto-migration (workspace pré-intake)

Se `intake.md` não existe MAS algum `_memoria/*.md` tem conteúdo real (não placeholder), fazer migração one-shot:

1. Criar `intake.md` a partir do template (`templates/intake.md` se existir, senão criar do zero)
2. Ler `_memoria/empresa.md`, `_memoria/preferencias.md`, `_memoria/estrategia.md`, `identidade/design-guide.md`
3. Extrair os campos pras Q1-Q10 e gravar no `intake.md`
4. Avisar:
   > "Detectei workspace pré-intake. Migrei dados existentes pra `intake.md` (mantive `_memoria/*.md` intactos). A partir de agora `intake.md` é o source-of-truth — edita ele pra atualizar."

Continuar pra Fase 3 (derive) — vai regenerar os files preservando o conteúdo já migrado.

---

## Fase 0 — Decide flow (só se intake parcialmente preenchido)

Contar Qs com placeholder `_[...]_` (não preenchidas) vs preenchidas.

> "Tenho {N} de 10 respostas no `intake.md`. Quer:
> (a) Completar as {10-N} que faltam agora (entrevista parcial)
> (b) Gerar os arquivos só com as {N} preenchidas (resto fica em placeholder no `_memoria/*`)
> (c) Recomeçar do zero (apaga intake atual e refaz tudo)"

Default = (a). Seguir.

---

## Fase 1 — Escolha do perfil (se frontmatter `perfil:` vazio)

Se `intake.md` frontmatter já tem `perfil:` preenchido, pular essa fase.

Senão, perguntar qual perfil:

1. **Solopreneur / criador solo** — uma pessoa só, mistura marca pessoal + negócio
2. **Freelancer** — atende clientes, organiza por projeto/cliente
3. **Agência / consultoria** — equipe pequena entregando pra vários clientes
4. **Empresa** — empresa estabelecida com setores

Gravar a resposta no frontmatter do `intake.md`:

```yaml
---
perfil: solopreneur
data_intake: 2026-05-20
voice_method:
---
```

---

## Fase 2 — Entrevista (escreve em `intake.md` enquanto rola)

Pra cada pergunta Q1-Q10 que tá com placeholder `_[...]_` no `intake.md`, perguntar uma de cada vez, esperar resposta, **gravar a resposta no `intake.md` antes da próxima pergunta** (assim se for interrompido, retomada via `/instalar` continua de onde parou).

**Sobre o negócio:**

- **Q1:** "Como você chama o que faz? (nome da empresa, ou seu nome se for marca pessoal)"
- **Q2:** "O que sua empresa entrega, em uma frase do jeito que você falaria pro vizinho?"
- **Q3:** "Quem te paga? (perfil de cliente real — descreve em uma ou duas frases, sem persona genérica)"
- **Q4:** "Você toca sozinho ou tem equipe? Se tem, quantos e cada um fazendo o quê?"

**Sobre voz:**

- **Q5:** "Me **cola verbatim** um trecho da tua escrita — um email recente, post, DM, qualquer coisa real que tu já escreveu. **Não digita aqui no chat** — texto digitado agora já tá moldado pela nossa conversa, contamina o sample."
- **Q6:** "O que te dá ranço quando alguém escreve assim? (ex: 'vamos juntos!', emoji em email formal, 'caro cliente', jargão de guru, 'alavancar', 'sinergia')"

### Regra dura da Q5 — anti-contamination

Se o usuário começar a digitar um exemplo no chat (em vez de colar algo real), pausar:

> "Pausa. Cola direto de algo que tu já escreveu (email, post, DM, draft). Se digitar aqui agora, o sample sai filtrado pela nossa conversa e fica inútil pra calibrar a voz. Essa é a regra que não dobro."

Aceitar paste de qualquer fonte. Se o usuário insistir não ter nada salvo:
- Setar `voice_method: typed` no frontmatter do `intake.md`
- Aceitar o texto digitado mas continuar
- Na Fase 3, isso vira flag `voice_sample_contamination_risk: true` em `_memoria/preferencias.md`

Se o usuário colar, setar `voice_method: pasted`.

**Sobre foco:**

- **Q7:** "Qual o gargalo do teu negócio hoje? O que tá segurando ele de crescer?"
- **Q8:** "Se eu pudesse tirar UMA coisa que você repete toda semana das tuas costas, qual seria?"

**Sobre identidade visual:**

- **Q9:** "Tem identidade visual definida ou tá no zero? Se tem, me passa as cores principais (hex se conseguir) e a fonte."
- **Q10:** "Tem logo? Se sim, joga em `identidade/logo-escuro.{png,svg}` (fundo claro) e `identidade/logo-creme.{png,svg}` (fundo escuro) e me confirma."

**Formato no intake.md** — substituir o bloco placeholder `_[...]_` pela resposta literal. Pra Q5 (voice sample), manter o `>` na frente pra blockquote.

---

## Fase 3 — Derive (gera arquivos a partir de `intake.md`)

**Esse é o core do `/instalar` no novo modelo.** Pode ser invocado por:
- Final da Fase 2 (após entrevista nova)
- Pré-checagem detectando `intake.md` já preenchido (skip Fase 1-2)
- Auto-migration completou (skip Fase 1-2)

Ler `intake.md` parseando:
- Frontmatter YAML pra `perfil`, `voice_method`, `data_intake`
- Cada section `## Q<N> — <título>` extraindo o body content (texto após o título, antes do próximo `## ` ou fim)
- Se body começa com `_[` e termina com `]_`, tratar como **não respondido** (placeholder)
- Pra Q5, extrair o conteúdo do blockquote `> ...`

Guardar como objeto `INTAKE = { perfil, voice_method, q1, q2, ..., q10 }`.

### `_memoria/empresa.md`

```markdown
# Empresa

> Memória central do negócio. O Claude lê esse arquivo antes de cada resposta.

**Nome:** {q1}
**O que faz:** {q2}
**Cliente:** {q3}
**Equipe:** {q4}

## Contexto adicional
```

### `_memoria/preferencias.md`

```markdown
# Preferências

> Como o Claude escreve em nome do negócio. Tom, estilo, vícios a evitar.

## Tom de voz

Exemplo da escrita real do cliente:

> {q5}

{se voice_method === "typed"}
**⚠️ voice_sample_contamination_risk: true** — sample digitado em vez de colado de algo real. Calibrar tom com cautela.
{fim se}

## O que evitar

{q6}

## Estilo geral

Direto, alinhado ao exemplo acima. Quando em dúvida, escrever como o exemplo escreve.

## Preferências adicionais
```

### `_memoria/estrategia.md`

```markdown
# Estratégia

> O que importa agora. Prioridades, metas, prazos.

## Fase

Início — workspace recém-gerado/atualizado em {data_intake}.

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

Distribuição de hex de `q9`:

1. **Extrair hex** com regex `#[0-9A-Fa-f]{6}`. Se 0, pular pro fallback texto.
2. **Calcular luminância W3C** (`0.2126*R + 0.7152*G + 0.0722*B` com gamma correction). Ordenar do mais claro pro mais escuro.
3. **Calcular saturação HSL**. Identificar o mais saturado (excluindo extremos L<0.1 ou L>0.9).
4. **Distribuir nos slots:**
   - **Fundo principal** → o mais claro
   - **Texto principal** → o mais escuro
   - **Cor de destaque / CTA** → o mais saturado entre os restantes
   - **Fundo alternativo / cards** → 2º mais claro OU `#FFFFFF`
   - **Cor de detalhe secundária** → o que sobrar (meio-tom)

**Edge cases:** 1 hex = trata como destaque + neutros padrão; 2 hex = mais claro vira fundo + mais escuro texto; 5+ = usa os 5 melhores + warning; tons quase iguais (Δluminância < 0.05) = trata como duplicada.

Tipografia: parsear de `q9` o nome de fonte (regex `(?:fonte|tipografia)[s]?:?\s*([A-Z][a-zA-Z\s,]+)`).

Q10 logo: se mencionar arquivo (`subi logo.svg`, `tem em SVG`), adicionar nota "Pendente — buscar e copiar pra `identidade/logo-escuro.{ext}` e `logo-creme.{ext}`". Se `não tem`, deixar slot vazio com nota.

### `CLAUDE.md`

1. Ler template `templates/perfis/claude-md-{perfil}.md` (perfil do frontmatter)

2. **Mapping de placeholders:**

| Placeholder | Source | Fallback |
|---|---|---|
| `[Seu Nome]` / `[nome]` | q1 | "[a definir]" |
| `[Uma frase...]` / `[O que sua empresa entrega]` | q2 | "[Operação do negócio]" |
| `[O que eu faço...]` | q2 | "[a definir]" |
| `[Quem me acompanha hoje]` / `[Minha audiência]` | q3 | "[a definir]" |
| `[O que diferencia]` / `[Posicionamento]` | inferir de q2+q3+q7 | "[a refinar nas primeiras sessões]" |
| `[Como você escreve]` | resumo 1-frase de q5 | "[ver `_memoria/preferencias.md`]" |
| `[o que destoa]` | resumo de q6 | "[ver `_memoria/preferencias.md`]" |
| `[O que você defende]` | inferir de q3+q7 | "[a refinar com cliente]" |
| `[tipo de conteúdo 1/2/3]` | inferir do contexto | "[a mapear nas primeiras semanas]" |

3. **Sempre adicionar** seção "## Origem desse workspace" no fim do `CLAUDE.md`:
   - Data do intake (`data_intake`)
   - Cliente / perfil
   - Origem (entrevista chat / intake editado manualmente / `/processar-entrevista` da web)
   - Pendências (logo não copiado, etc.)

4. Sobrescrever o `CLAUDE.md` da raiz.

---

## Fase 4 — Resumo

```
✓ Intake processado: 10/10 respostas no `intake.md`
✓ Perfil aplicado: {perfil}
✓ Memória regenerada: _memoria/empresa.md · preferencias.md · estrategia.md
✓ Identidade: identidade/design-guide.md  [completa | parcial — refinar manualmente]
✓ CLAUDE.md adaptado pro perfil {perfil}

{se voice_method === "typed"}
⚠️ Voice sample digitado — flag de contamination registrada em preferencias.md
{fim se}

{se houver pendências (logo, paleta vaga, etc.)}
Pendências:
- [ ] {pendência}
{fim se}

Pra atualizar contexto no futuro:
- Edita `intake.md` na raiz
- Roda `/instalar` de novo (idempotente)
```

---

## Fase 5 — Renomear pasta (se necessário)

Se a pasta atual ainda tem nome genérico (detectado na Pré-checagem), gerar slug do q1:
- minúsculas
- sem acentos
- espaços → hífen
- caracteres especiais removidos

Ex: "Acme Empresa Ltda" → `acme-empresa-ltda`

Mostrar:

> "Última coisa: a pasta ainda tá com nome genérico ('<nome-atual>'). Pra ter cara do teu negócio, recomendo renomear pra '<slug>'.
>
> Como fazer (Windows):
> 1. Fecha o VS Code
> 2. Renomeia a pasta no Explorer — ou no PowerShell: `Rename-Item <nome-atual> <slug>`
> 3. Abre VS Code de novo na pasta renomeada"

Se a pasta já tem nome próprio, pular.

---

## Fase 6 — Próximos passos

> "Pronto. O Tagino_AIOS já te conhece.
>
> No começo de cada sessão de trabalho, roda `/abrir` — eu carrego tudo antes da primeira frase. Quando quiser fazer um carrossel, plano de SEO, campanha ou qualquer outra coisa, é só chamar a skill que cabe.
>
> Pra atualizar contexto depois: **edita `intake.md` e roda `/instalar` de novo**. Idempotente.
>
> Tu mencionou que repete '{q8}' toda semana. Quando quiser tirar das costas, roda `/mapear-rotinas` que eu transformo em skill."

Se quiser publicar no GitHub, mencionar `/salvar`.

---

## Regras

- **`intake.md` é source-of-truth.** Sempre escrever lá primeiro durante entrevista. Derivar arquivos a partir dele.
- **Edição direta em `_memoria/*.md`** é sobrescrita na próxima run. Documentar isso no resumo.
- **Idempotência crítica.** Mesmo intake = mesmo output, sem warnings de "já existe".
- **Não inventar dados.** Se resposta vaga, registrar do jeito que veio (não preencher com palpite). Se vier `_[...]_` placeholder no intake.md (Q ignorada), gerar arquivo com placeholder `[a definir]` claro.
- **Setup deve durar 5-7 min no máximo** na entrevista. Se enrolar numa Q, registrar o que tem e segue.
- **Não fazer perguntas extras** além das 10 listadas. Curiosidade do Claude não vira fluxo de entrevista.
- **Pra alteração pontual sem regen**, sugerir que o usuário fale a correção direto no chat (mecanismo "Aprender com correções" do CLAUDE.md root). Pra alteração estrutural, edita intake.md + roda /instalar.

---

## Verification

- **Cold setup:** workspace recém-clonado, sem intake.md → skill cria intake.md, faz entrevista 10 Qs, deriva 5 arquivos. Score do `/audit` pós: ~40-50.
- **Idempotência:** rodar 2x sem mexer em nada → segundo run termina em <5s ("intake já preenchido, regerando arquivos"). Arquivos finais idênticos.
- **Edit + re-run:** editar Q3 no intake.md, re-rodar `/instalar` → só `_memoria/empresa.md`, `CLAUDE.md` "Quem me acompanha" e potentialmente `estrategia.md` mudam. Outros arquivos idênticos.
- **Migration:** workspace pré-intake (Lisbô) → primeira run detecta, migra `_memoria/*.md` pra intake.md, continua normal. `_memoria/*.md` reescrito mas com mesmo conteúdo (round-trip preserva).
