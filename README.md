# Tagino_AIOS

**Read in: [🇺🇸 English](#english) · [🇧🇷 Português](#português)**

> Your business's operating system, inside Claude Code.
> O sistema operacional do seu negócio dentro do Claude Code.

---

## English

Tagino_AIOS installs an AI that **actually knows your business** — your customer, your tone of voice, your visual identity, what's happening this week. It then produces for you: carousels in your palette, posts in your writing style, ad campaigns, landing pages, transcriptions, reports. **23 skills ready to use**, all calibrated by what it learns about you.

You don't need to know how to program. This README will walk you through it step by step.

### Who is this for?

Works for:
- **Personal brand** (creator, realtor, lawyer, dentist, solo architect)
- **Freelancer** serving multiple clients
- **Small agency** of 2-10 people
- **Small company** (up to ~30 people) that wants marketing + operations running consistently

You do NOT need:
- Programming knowledge
- Terminal/git experience
- A GitHub account (we'll create one later if you want)

You DO need:
- A computer (Windows, Mac, or Linux)
- 15 minutes for the first install
- Claude Pro plan (Anthropic, $20/month)

### Before you start — 3-item checklist

**1. Claude Pro account** ($20/month)

Create one here if you don't have it: https://claude.ai/upgrade

(The free plan isn't enough — some skills use heavy processing.)

**2. Claude Code installed on your computer**

It's an app that talks to Claude directly on your PC. Download at:
https://claude.com/claude-code

Follow the installer. **Don't worry if a black terminal appears** during installation — that's normal, just close it when it's done.

**3. 15 minutes without interruption**

The first install has 10 questions (5-7 min). Worth doing with coffee, no rush.

### Step by step — first install

#### Step 1 · Open Claude Code

Search for "Claude Code" in the Start menu (Windows) or Spotlight (Mac), and open it.

A window with a black background and a blinking cursor will appear. Don't be intimidated — that's how it's supposed to look.

#### Step 2 · Copy and paste this command

Select the ENTIRE block below (click the copy icon in the corner of the block if it appears), and paste it into the Claude Code window:

```
Clone https://github.com/AllanTagino/tagino-aios.git into this folder, enter it, and run /instalar.
```

Press **Enter**.

Claude will:
- Download the system (a few seconds)
- Enter the new folder
- Start the installation interview

#### Step 3 · Answer the 10 questions

Claude will ask you about your business. **Answer as if you were chatting with a curious friend.** No need to be formal, no need to overthink it — the more natural, the better.

The 10 questions:

| # | Question | Example answer |
|---|---|---|
| 1 | What do you call what you do? | "Carlos Mendes Realty" |
| 2 | What does your business deliver, in one sentence? | "I sell compact apartments in Pinheiros to first-time buyers" |
| 3 | Who pays you? | "Couples 28-40, first home, income $5-12k/mo" |
| 4 | Solo or with a team? | "Solo, with 1 WhatsApp assistant" |
| 5 | **Paste a sample of your writing** | (see rule below) |
| 6 | What annoys you when someone writes a certain way? | "let's go, leverage, synergy" |
| 7 | What's your business's bottleneck today? | "Answering cold lead WhatsApp takes 3h/day" |
| 8 | What task do you repeat every week? | "Initial lead screening" |
| 9 | Do you have a visual identity? | "Dark green #2C4A3E, sand #E8DCC0, Inter font" |
| 10 | Do you have a logo? | "Uploaded logo.svg to the folder" |

**Strict rule on question 5:** Claude asks you to **paste** a real piece of text you wrote (email, post, DM). Don't type it on the spot — if you type, the sample gets shaped by the conversation and the system calibrates your tone incorrectly. Open an old email of yours, copy 2-3 paragraphs, paste. Done.

Don't have anything saved? Tell Claude. It'll register as "calibrate later" and move on.

#### Step 4 · Rename the folder

When Claude finishes, it'll ask you to rename the folder from `tagino-aios` to your business name. How to do it:

1. Close Claude Code (and VS Code, if open)
2. Open **Explorer** (Windows) or **Finder** (Mac)
3. Go to `C:\Users\<your-user>\` (Windows) or `~/` (Mac)
4. Find the `tagino-aios` folder
5. Right-click → "Rename" → type your business name
6. Open Claude Code again in the renamed folder

Not mandatory — just keeps things organized.

#### Step 5 · Ready. Now open the system

In the Claude Code window, type:

```
/abrir
```

And press Enter. Claude will load everything it learned about you. From here, just ask for what you need.

### And now? Your first 14 days

**Day 1 · First carousel**

Type in Claude:
```
/carrossel about <a topic from your business>
```

Ex: `/carrossel about 5 things no one tells you about buying off-plan in Pinheiros`.

Claude builds the text, generates 6 images 1080×1350 with the palette and tone it learned from you, and writes the post caption. Everything saved in `marketing/`.

**Day 7 · Check the system's score**

Type:
```
/audit
```

It gives you a 0-100 score and the top 3 gaps. Brand new workspace usually scores 40-50. Re-run every Friday — number going up = system improving.

**Day 7-14 · Log your first decision**

Every time you make a business decision (changed focus, switched vendor, decided not to serve X), type:
```
/decidir
```

Claude asks 4 things (decision, context, why, impact) and saves it to the log. Six months from now you'll want to remember why you made each decision — that's the place.

**Day 14 · Find one automation**

Type:
```
/mapear-rotinas
```

It chats with you to discover 1 thing you repeat every week and turns it into a custom skill. **One per week = 50 automations per year.**

### The 23 available skills

**Day-to-day operation** — 10 skills
`/instalar` initial setup · `/abrir` loads context · `/salvar` backs up to GitHub · `/atualizar` scans the project · `/novo-projeto` isolated folder per client · `/mapear-rotinas` discovers what you repeat and turns it into a skill · `/processar-entrevista` pulls client from web hub and creates workspace · `/conectar` configures an API key · `/decidir` logs a decision · `/audit` workspace score 0-100

**Content & SEO** — 5 skills
`/carrossel` 1080×1350 carousel with brand identity · `/publicar-tema` blog article + carousel + 3 captions bundled · `/seo` complete 8-step SEO flow · `/responder-avaliacoes` human-sounding reply to Google reviews · `/aprovar-post` publishes to Instagram + Facebook in one command

**Rich media** — 3 skills
`/apresentacao-pdf` editorial PDF with your brand · `/transcrever-audio` audio to text locally (no API cost) · `/comprimir-video` heavy video to web-ready

**Paid ads** — 2 skills
`/anuncio-google` CSV campaign for Google Ads Editor · `/relatorio-ads` weekly Meta + Google report with alerts

**Launches** — 1 skill
`/premium-website-lancamento-aios` real estate launch landing page

**Production** — 2 skills
`/analisar-dados` executive summary from CSV/XLSX/PDF · `/email-profissional` drafts email from free-form context

### How to update the system when something changes

Client changed focus. You decided to change the palette. Hired an assistant. What used to be your bottleneck isn't anymore. **How to update?**

At the root of your workspace there's a file called `intake.md`. That's the **only file** you need to edit to change context.

1. Open `intake.md` in the editor (or in Claude Code itself, just say "open intake.md")
2. Edit the answer to whatever question changed
3. Save
4. In Claude, type `/instalar` again
5. Done — all memory regenerates with the new info

**Don't edit the other files directly** (`_memoria/*.md`, `CLAUDE.md`) — they're derived from the intake and the next run of `/instalar` will overwrite them.

For a one-off correction without regenerating everything, just tell Claude: *"actually my customer now is XYZ"* — it'll update the right file and move on.

### When something goes wrong

**"The command doesn't work"**
Check that you copied and pasted the exact command. Invisible spaces break it. Try typing manually.

**"Claude is reading but not responding"**
Press Ctrl+C to cancel, then Enter to restart. If it persists, close Claude Code and open it again.

**"A red error with technical words appears"**
Copy the ENTIRE error, paste in Claude's chat and ask: "help me fix this error". It understands and guides you.

**"I can't find the `tagino-aios` folder"**
On Windows it's in `C:\Users\<your-user>\` (or wherever you ran `/instalar`). On Mac/Linux, in `~/`. To confirm: in the Claude window, type `pwd` (current path) — it shows where it is.

**"I need help with something specific"**
Ask Claude directly. It knows all 23 skills and the state of your workspace. Ex: *"how do I publish a carousel to Instagram?"* — it'll guide you.

### For clients who don't use Claude Code

Tagino_AIOS runs inside Claude Code. If you serve clients who **won't use Claude** (and they probably won't — Claude is the tool for whoever operates the system), there's a web interview where the client fills out the 10 questions in their browser:

**URL:** https://tagino-aios-entrevista.netlify.app/?cliente=Name

Client fills it out → you receive the submission in the Netlify Forms panel → run `/processar-entrevista <Name>` in Claude → local workspace is created complete, ready for you to operate on the client's behalf.

Hub repo: [tagino-entrevista-hub](https://github.com/AllanTagino/tagino-entrevista-hub) (private, Allan's setup)

To build your own: clone the hub, customize the `CLIENTES` map in `public/index.html`, run `deploy.ps1` (needs a free Netlify account, any account works).

### How the system thinks (to understand what's going on)

- **`intake.md`** — source-of-truth with the 10 answers. Edit here to update everything. Single source.
- **`_memoria/`** — derived brain. Claude reads it before each response. Don't edit directly.
- **`identidade/`** — face of the brand (colors, font, logo). Derived from `intake.md` Q9-Q10.
- **`decisions/log.md`** — institutional memory. Append-only. Skill `/decidir` adds entries.
- **`marketing/`, `saidas/`, `scripts/`** — where the work lands. All yours.
- **`dashboard.html`** — double-click to open and see the state at a glance.

### The thesis

AI is not a tool your company uses. It's the operating system your company runs on.

The difference isn't speed. It's new capability — one person with AI builds what used to require a whole team. Every critical process that today runs in open loop (decide → execute → don't measure → repeat blind) becomes a closed loop inside Tagino_AIOS (decide → execute → capture → feedback → adjust on its own).

The system doesn't replace you. It becomes part of your company.

### Tech stack (for those who care)

Everything below is managed by Claude Code automatically — you don't need to install manually, except where indicated.

- **Claude Code** — runtime for the skills. Installed in Step 1.
- **Git** — versioning. Comes with Claude Code.
- **Node.js (≥18)** — for dashboard and carousel rendering. Download from [nodejs.org](https://nodejs.org) if you don't have it.
- **Python (≥3.10)** — for audio transcription and data analysis. Download from [python.org](https://python.org) if you don't have it.
- **ffmpeg** — for video compression. On Windows, install via [Chocolatey](https://chocolatey.org) or download from [ffmpeg.org](https://ffmpeg.org). Only needed if you'll use `/comprimir-video`.

**Optional** API keys (configure via `/conectar` when needed):
- `OPENAI_API_KEY` — to generate AI photo in `/carrossel` Type 2
- `KIE_API_KEY` — for Nano Banana Pro image enhancement and miniature generation
- `APIFY_API_TOKEN` — for custom scrapers

MCPs (Claude Code extensions that connect to external services):
- Instagram, WhatsApp, Meta Ads, Google Ads, Google Calendar, Google Drive

Install an MCP via `claude mcp add <name>` when Claude asks. It guides you.

---

## Português

Tagino_AIOS instala uma IA que **conhece seu negócio de verdade** — seu cliente, seu tom de voz, sua identidade visual, o que tá pegando essa semana. Daí ela produz pra você: carrosséis com a sua paleta, posts no seu jeito de escrever, campanhas de ads, landing pages, transcrições, relatórios. **23 skills prontas**, todas calibradas pelo que ela aprende sobre você.

Você não precisa saber programar. Esse README ensina passo a passo.

### Pra quem é isso?

Funciona pra:
- **Marca pessoal** (criador, corretor, advogado, dentista, arquiteto solo)
- **Freelancer** que atende vários clientes
- **Agência pequena** com 2-10 pessoas
- **Empresa pequena** (até ~30 pessoas) que quer marketing + operação rodando consistente

Você NÃO precisa de:
- Saber programar
- Saber usar terminal/git
- Ter conta no GitHub (a gente cria depois se quiser)

Você precisa de:
- Computador (Windows, Mac, ou Linux)
- 15 minutos pra primeira instalação
- Plano Pro do Claude (Anthropic, $20/mês)

### Antes de começar — checklist de 3 itens

**1. Conta no Claude Pro** ($20/mês)

Cria aqui se ainda não tem: https://claude.ai/upgrade

(O plano grátis não dá conta — algumas skills usam muito processamento.)

**2. Claude Code instalado no seu computador**

É um app que conversa com o Claude direto no seu PC. Baixa em:
https://claude.com/claude-code

Segue o instalador. **Não se preocupa se aparecer terminal preto** durante a instalação — é normal, só fecha quando terminar.

**3. 15 minutos sem interrupção**

A primeira instalação tem 10 perguntas (5-7 min). Vale fazer com café, sem pressa.

### Passo a passo — primeira instalação

#### Passo 1 · Abre o Claude Code

Procura "Claude Code" no menu Iniciar (Windows) ou Spotlight (Mac), abre.

Vai aparecer uma janela com fundo preto e um cursor piscando. Não se assusta — é assim mesmo.

#### Passo 2 · Copia e cola esse comando

Seleciona TODO o bloco abaixo (clica no ícone de copiar no canto do bloco se aparecer), e cola na janela do Claude Code:

```
Clona o https://github.com/AllanTagino/tagino-aios.git nessa pasta, entra nela, e roda o /instalar.
```

Aperta **Enter**.

O Claude vai:
- Baixar o sistema (alguns segundos)
- Entrar na pasta nova
- Começar a entrevista de instalação

#### Passo 3 · Responde as 10 perguntas

O Claude vai te perguntar sobre seu negócio. **Responde como se tivesse conversando com um amigo curioso.** Não precisa ser formal, não precisa caprichar — quanto mais natural, melhor.

As 10 perguntas:

| # | Pergunta | Exemplo de resposta |
|---|---|---|
| 1 | Como você chama o que faz? | "Carlos Mendes Imóveis" |
| 2 | O que sua empresa entrega, em uma frase? | "Vendo apto compacto em Pinheiros pra primeiro comprador" |
| 3 | Quem te paga? | "Casal 28-40 anos, primeiro imóvel, renda 12-25k" |
| 4 | Sozinho ou tem equipe? | "Sozinho, com 1 assistente no WhatsApp" |
| 5 | **Cola um exemplo da tua escrita** | (veja regra abaixo) |
| 6 | O que te dá ranço quando alguém escreve assim? | "vamos juntos, alavancar, sinergia" |
| 7 | Qual o gargalo do teu negócio hoje? | "Responder WhatsApp de lead frio toma 3h/dia" |
| 8 | Que tarefa você repete toda semana? | "Triagem de lead inicial" |
| 9 | Tem identidade visual? | "Verde escuro #2C4A3E, areia #E8DCC0, fonte Inter" |
| 10 | Tem logo? | "Subi logo.svg na pasta" |

**Regra dura na pergunta 5:** o Claude pede pra você **colar** um trecho real do que você escreveu (email, post, DM). Não digita na hora — se digitar, o sample fica moldado pela conversa e o sistema calibra errado o teu tom. Abre um email seu antigo, copia 2-3 parágrafos, cola. Pronto.

Se você não tem nada salvo? Avisa o Claude. Ele registra como "calibrar depois" e segue.

#### Passo 4 · Renomeia a pasta

Quando o Claude terminar, ele te diz pra renomear a pasta de `tagino-aios` pro nome do teu negócio. Como fazer:

1. Fecha o Claude Code (e VS Code, se tiver aberto)
2. Abre o **Explorer** (Windows) ou **Finder** (Mac)
3. Vai em `C:\Users\<teu-usuário>\` (Windows) ou `~/` (Mac)
4. Acha a pasta `tagino-aios`
5. Clica com botão direito → "Renomear" → digita o nome do teu negócio
6. Abre o Claude Code de novo na pasta renomeada

Não é obrigatório — só fica mais organizado.

#### Passo 5 · Pronto. Agora abre o sistema

Na janela do Claude Code, digita:

```
/abrir
```

E aperta Enter. O Claude vai carregar tudo que aprendeu de você. A partir daqui é só pedir o que precisa.

### E agora? Os primeiros 14 dias

**Dia 1 · Primeiro carrossel**

Digita no Claude:
```
/carrossel sobre <um tema do teu negócio>
```

Ex: `/carrossel sobre 5 coisas que ninguém te conta sobre comprar planta em Pinheiros`.

O Claude monta o texto, gera 6 imagens 1080×1350 com a paleta e tom de voz que ele aprendeu de você, e escreve a legenda do post. Tudo salvo em `marketing/`.

**Dia 7 · Tira o score do sistema**

Digita:
```
/audit
```

Ele te dá um score 0-100 e os 3 maiores gaps. Workspace recém-criado normalmente fica entre 40-50. Re-roda toda sexta — número que sobe = sistema melhorando.

**Dia 7-14 · Registra a primeira decisão**

Toda vez que tu tomar uma decisão de negócio (mudou foco, trocou fornecedor, decidiu não atender X), digita:
```
/decidir
```

O Claude pergunta 4 coisas (decisão, contexto, por quê, impacto) e salva no histórico. Daqui 6 meses tu vai querer lembrar por que tomou cada decisão — esse é o lugar.

**Dia 14 · Encontra uma automação**

Digita:
```
/mapear-rotinas
```

Ele conversa contigo pra descobrir 1 coisa que tu repete toda semana e transforma em skill personalizada. **Uma por semana = 50 automações por ano.**

### As 23 skills disponíveis

**Operação do dia a dia** — 10 skills
`/instalar` setup inicial · `/abrir` carrega contexto · `/salvar` faz backup no GitHub · `/atualizar` varre o projeto · `/novo-projeto` pasta isolada por cliente · `/mapear-rotinas` descobre o que repete e vira skill · `/processar-entrevista` puxa cliente do hub web e cria workspace · `/conectar` configura chave de API · `/decidir` registra decisão em log · `/audit` score do workspace 0-100

**Conteúdo e SEO** — 5 skills
`/carrossel` carrossel 1080×1350 com identidade da marca · `/publicar-tema` artigo de blog + carrossel + 3 legendas amarrados · `/seo` fluxo completo SEO em 8 passos · `/responder-avaliacoes` resposta humana pras reviews do Google · `/aprovar-post` publica no Instagram + Facebook num comando

**Mídia rica** — 3 skills
`/apresentacao-pdf` PDF editorial com a marca · `/transcrever-audio` áudio pra texto local (sem custo de API) · `/comprimir-video` vídeo pesado pra web-ready

**Anúncios pagos** — 2 skills
`/anuncio-google` campanha em CSV pro Google Ads Editor · `/relatorio-ads` relatório semanal Meta + Google com alertas

**Lançamentos** — 1 skill
`/premium-website-lancamento-aios` landing page de lançamento imobiliário

**Produção** — 2 skills
`/analisar-dados` resumo executivo de CSV/XLSX/PDF · `/email-profissional` rascunha email a partir de contexto livre

### Como atualizar o sistema quando algo mudar

Cliente mudou foco. Você decidiu mudar a paleta. Contratou um assistente. O que era seu gargalo deixou de ser. **Como atualizar?**

Na raiz do teu workspace tem um arquivo `intake.md`. Esse é o **único arquivo** que você precisa editar pra mudar contexto.

1. Abre `intake.md` no editor (ou no Claude Code mesmo, fala "abre intake.md")
2. Edita a resposta da pergunta que mudou
3. Salva
4. No Claude, digita `/instalar` de novo
5. Pronto — toda a memória regenera com a info nova

**Não edita os outros arquivos diretos** (`_memoria/*.md`, `CLAUDE.md`) — eles são derivados do intake e a próxima run do `/instalar` sobrescreve.

Pra correção pontual sem regenerar nada, só fala com o Claude: *"na verdade meu cliente agora é XYZ"* — ele atualiza o arquivo certo e segue.

### Quando algo der errado

**"O comando não funciona"**
Verifica que tu copiou e colou o comando exato. Espaços invisíveis quebram. Tenta digitar manualmente.

**"O Claude tá lendo mas não responde"**
Aperta Ctrl+C pra cancelar, depois Enter pra recomeçar. Se persistir, fecha o Claude Code e abre de novo.

**"Aparece um erro vermelho com palavras técnicas"**
Copia o erro INTEIRO, cola no chat do Claude e pede: "me ajuda a resolver esse erro". Ele entende e te orienta.

**"Não acho a pasta `tagino-aios`"**
No Windows ela tá em `C:\Users\<seu-usuário>\` (ou onde tu rodou o `/instalar`). No Mac/Linux, em `~/`. Pra confirmar: na janela do Claude, digita `pwd` (current path) — mostra onde ele tá.

**"Preciso de ajuda pra alguma coisa específica"**
Pergunta direto pro Claude. Ele conhece todas as 23 skills e o estado do teu workspace. Ex: *"como faço pra publicar carrossel no Instagram?"* — ele te orienta.

### Pra cliente que não usa Claude Code

Tagino_AIOS funciona dentro do Claude Code. Se você atende clientes que **não vão usar Claude** (e provavelmente não vão — Claude é ferramenta de quem opera o sistema), tem uma entrevista web onde o cliente preenche as 10 perguntas no navegador:

**URL:** https://tagino-aios-entrevista.netlify.app/?cliente=Nome

Cliente preenche → você recebe a submissão no painel Netlify Forms → roda `/processar-entrevista <Nome>` no Claude → workspace local é criado completo, pronto pra você operar pelo cliente.

Repo do hub: [tagino-entrevista-hub](https://github.com/AllanTagino/tagino-entrevista-hub) (privado, é o setup do Allan)

Pra montar o seu próprio: clone o hub, customiza o map `CLIENTES` no `public/index.html`, roda `deploy.ps1` (precisa de conta Netlify free, qualquer conta serve).

### Como o sistema pensa (pra entender o que tá rolando)

- **`intake.md`** — source-of-truth com as 10 respostas. Edita aqui pra atualizar tudo. Source único.
- **`_memoria/`** — cérebro derivado. O Claude lê antes de cada resposta. Não edita direto.
- **`identidade/`** — rosto da marca (cores, fonte, logo). Derivado do `intake.md` Q9-Q10.
- **`decisions/log.md`** — memória institucional. Append-only. Skill `/decidir` adiciona entries.
- **`marketing/`, `saidas/`, `scripts/`** — onde sai o trabalho. Tudo seu.
- **`dashboard.html`** — abre num duplo-clique pra ver o estado num olhar.

### A tese

IA não é uma ferramenta que sua empresa usa. É o sistema operacional em que ela roda.

A diferença não é velocidade. É capacidade nova — uma pessoa com IA constrói o que antes exigia time inteiro. Cada processo crítico que hoje roda em open loop (decide → executa → não mede → repete cego) vira closed loop dentro do Tagino_AIOS (decide → executa → captura → realimenta → ajusta sozinho).

O sistema não substitui você. Vira parte da sua empresa.

### Stack técnica (pra quem se interessa)

Tudo abaixo é gerenciado pelo Claude Code automaticamente — você não precisa instalar manualmente, exceto onde indicado.

- **Claude Code** — runtime das skills. Instalado no Passo 1.
- **Git** — versionamento. Vem com Claude Code.
- **Node.js (≥18)** — pra dashboard e renderização de carrosséis. Baixa de [nodejs.org](https://nodejs.org) se não tiver.
- **Python (≥3.10)** — pra transcrição de áudio e análise de dados. Baixa de [python.org](https://python.org) se não tiver.
- **ffmpeg** — pra compressão de vídeo. No Windows, instala via [Chocolatey](https://chocolatey.org) ou baixa de [ffmpeg.org](https://ffmpeg.org). Só precisa se for usar `/comprimir-video`.

Chaves de API **opcionais** (configura via `/conectar` quando precisar):
- `OPENAI_API_KEY` — pra gerar foto IA no `/carrossel` Tipo 2
- `KIE_API_KEY` — pra Nano Banana Pro (enhance de imagem e geração de miniaturas)
- `APIFY_API_TOKEN` — pra scrapers customizados

MCPs (extensões do Claude Code que conectam com serviços externos):
- Instagram, WhatsApp, Meta Ads, Google Ads, Google Calendar, Google Drive

Instala um MCP via `claude mcp add <nome>` quando o Claude pedir. Ele te guia.

---

**Questions, suggestions, found a bug?** · **Dúvidas, sugestões, achou um bug?**

Open an issue at / Abre uma issue em [github.com/AllanTagino/tagino-aios/issues](https://github.com/AllanTagino/tagino-aios/issues) · DM [@allantagino](https://instagram.com/allantagino)
