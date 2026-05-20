---
perfil:
data_intake:
voice_method:
---

# Intake

> **Source-of-truth** das respostas da entrevista. Edita aqui pra atualizar o contexto
> do workspace. Roda `/instalar` depois — os arquivos `_memoria/*.md`, `identidade/design-guide.md`
> e `CLAUDE.md` regeneram a partir dessas respostas.
>
> Idempotente — rodar `/instalar` 100 vezes com o mesmo intake = mesmo resultado.
>
> ⚠️ Não editar `_memoria/*.md` direto — próxima run do `/instalar` sobrescreve a edição.
> Pra atualizar, edita aqui e roda `/instalar`. Pra correção pontual sem regeneração,
> conversa com o Claude (mecanismo "Aprender com correções" do `CLAUDE.md`).

---

## Q1 — Como você chama o que faz?

_[Nome da empresa, ou seu nome se for marca pessoal]_

---

## Q2 — O que sua empresa entrega, em uma frase?

_[Do jeito que você falaria pro vizinho. Sem buzzword.]_

---

## Q3 — Quem te paga?

_[Perfil real de cliente. Uma ou duas frases, sem persona genérica.]_

---

## Q4 — Você toca sozinho ou tem equipe?

_[Se tem, quantos e cada um fazendo o quê.]_

---

## Q5 — Cola um exemplo da tua escrita (paste verbatim, não digita)

> _[Cola aqui um email recente, post, DM real — qualquer coisa que você escreveu fora dessa conversa. Não digita aqui: texto digitado direto no form/chat sai moldado pela tela e contamina o sample. Se realmente não tiver nada salvo, escreve `voice_sample_contamination_risk: true` no frontmatter acima.]_

---

## Q6 — O que te dá ranço quando alguém escreve assim?

_[Ex: "vamos juntos!", emoji em email formal, "caro cliente", jargão de guru, "alavancar", "sinergia"]_

---

## Q7 — Qual o gargalo do teu negócio hoje?

_[O que tá segurando ele de crescer.]_

---

## Q8 — Se eu pudesse tirar UMA coisa que você repete toda semana das tuas costas, qual seria?

_[Uma tarefa específica. Quanto mais concreta, melhor.]_

---

## Q9 — Identidade visual

_[Tem paleta/fonte definida? Cores principais (preferência por hex `#RRGGBB`) e fonte. Se zero, escreve "zero".]_

---

## Q10 — Logo

_[Tem logo? Se sim, joga em `identidade/logo-escuro.{png,svg}` (versão pra fundo claro) e `identidade/logo-creme.{png,svg}` (pra fundo escuro), e confirma aqui. Se não tem, escreve "não tem".]_
