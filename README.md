# Tagino_AIOS

> O sistema operacional do seu negócio dentro do Claude Code.

Tagino_AIOS instala uma IA que **conhece seu negócio de verdade** — seu cliente, seu tom de voz, sua identidade visual, o que tá pegando essa semana. Daí ela produz pra você: carrosséis com a sua paleta, posts no seu jeito de escrever, campanhas de ads, landing pages, transcrições, relatórios. **23 skills prontas**, todas calibradas pelo que ela aprende sobre você.

Você não precisa saber programar. Esse README ensina passo a passo.

---

## Pra quem é isso?

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

---

## Antes de começar — checklist de 3 itens

**1. Conta no Claude Pro** ($20/mês)

Cria aqui se ainda não tem: https://claude.ai/upgrade

(O plano grátis não dá conta — algumas skills usam muito processamento.)

**2. Claude Code instalado no seu computador**

É um app que conversa com o Claude direto no seu PC. Baixa em:
https://claude.com/claude-code

Segue o instalador. **Não se preocupa se aparecer terminal preto** durante a instalação — é normal, só fecha quando terminar.

**3. 15 minutos sem interrupção**

A primeira instalação tem 10 perguntas (5-7 min). Vale fazer com café, sem pressa.

---

## Passo a passo — primeira instalação

### Passo 1 · Abre o Claude Code

Procura "Claude Code" no menu Iniciar (Windows) ou Spotlight (Mac), abre.

Vai aparecer uma janela com fundo preto e um cursor piscando. Não se assusta — é assim mesmo.

### Passo 2 · Copia e cola esse comando

Seleciona TODO o bloco abaixo (clica no ícone de copiar no canto do bloco se aparecer), e cola na janela do Claude Code:

```
Clona o https://github.com/AllanTagino/tagino-aios.git nessa pasta, entra nela, e roda o /instalar.
```

Aperta **Enter**.

O Claude vai:
- Baixar o sistema (alguns segundos)
- Entrar na pasta nova
- Começar a entrevista de instalação

### Passo 3 · Responde as 10 perguntas

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

### Passo 4 · Renomeia a pasta

Quando o Claude terminar, ele te diz pra renomear a pasta de `tagino-aios` pro nome do teu negócio. Como fazer:

1. Fecha o Claude Code (e VS Code, se tiver aberto)
2. Abre o **Explorer** (Windows) ou **Finder** (Mac)
3. Vai em `C:\Users\<teu-usuário>\` (Windows) ou `~/` (Mac)
4. Acha a pasta `tagino-aios`
5. Clica com botão direito → "Renomear" → digita o nome do teu negócio
6. Abre o Claude Code de novo na pasta renomeada

Não é obrigatório — só fica mais organizado.

### Passo 5 · Pronto. Agora abre o sistema

Na janela do Claude Code, digita:

```
/abrir
```

E aperta Enter. O Claude vai carregar tudo que aprendeu de você. A partir daqui é só pedir o que precisa.

---

## E agora? Os primeiros 14 dias

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

---

## As 23 skills disponíveis

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

---

## Como atualizar o sistema quando algo mudar

Cliente mudou foco. Você decidiu mudar a paleta. Contratou um assistente. O que era seu gargalo deixou de ser. **Como atualizar?**

Na raiz do teu workspace tem um arquivo `intake.md`. Esse é o **único arquivo** que você precisa editar pra mudar contexto.

1. Abre `intake.md` no editor (ou no Claude Code mesmo, fala "abre intake.md")
2. Edita a resposta da pergunta que mudou
3. Salva
4. No Claude, digita `/instalar` de novo
5. Pronto — toda a memória regenera com a info nova

**Não edita os outros arquivos diretos** (`_memoria/*.md`, `CLAUDE.md`) — eles são derivados do intake e a próxima run do `/instalar` sobrescreve.

Pra correção pontual sem regenerar nada, só fala com o Claude: *"na verdade meu cliente agora é XYZ"* — ele atualiza o arquivo certo e segue.

---

## Quando algo der errado

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

---

## Pra cliente que não usa Claude Code

Tagino_AIOS funciona dentro do Claude Code. Se você atende clientes que **não vão usar Claude** (e provavelmente não vão — Claude é ferramenta de quem opera o sistema), tem uma entrevista web onde o cliente preenche as 10 perguntas no navegador:

**URL:** https://tagino-aios-entrevista.netlify.app/?cliente=Nome

Cliente preenche → você recebe a submissão no painel Netlify Forms → roda `/processar-entrevista <Nome>` no Claude → workspace local é criado completo, pronto pra você operar pelo cliente.

Repo do hub: [tagino-entrevista-hub](https://github.com/AllanTagino/tagino-entrevista-hub) (privado, é o setup do Allan)

Pra montar o seu próprio: clone o hub, customiza o map `CLIENTES` no `public/index.html`, roda `deploy.ps1` (precisa de conta Netlify free, qualquer conta serve).

---

## Como o sistema pensa (pra entender o que tá rolando)

- **`intake.md`** — source-of-truth com as 10 respostas. Edita aqui pra atualizar tudo. Source único.
- **`_memoria/`** — cérebro derivado. O Claude lê antes de cada resposta. Não edita direto.
- **`identidade/`** — rosto da marca (cores, fonte, logo). Derivado do `intake.md` Q9-Q10.
- **`decisions/log.md`** — memória institucional. Append-only. Skill `/decidir` adiciona entries.
- **`marketing/`, `saidas/`, `scripts/`** — onde sai o trabalho. Tudo seu.
- **`dashboard.html`** — abre num duplo-clique pra ver o estado num olhar.

---

## A tese

IA não é uma ferramenta que sua empresa usa. É o sistema operacional em que ela roda.

A diferença não é velocidade. É capacidade nova — uma pessoa com IA constrói o que antes exigia time inteiro. Cada processo crítico que hoje roda em open loop (decide → executa → não mede → repete cego) vira closed loop dentro do Tagino_AIOS (decide → executa → captura → realimenta → ajusta sozinho).

O sistema não substitui você. Vira parte da sua empresa.

---

## Stack técnica (pra quem se interessa)

Tudo abaixo é gerenciado pelo Claude Code automaticamente — você não precisa instalar manualmente, exceto onde indicado.

- **Claude Code** — runtime das skills. Instalado no Passo 1.
- **Git** — versionamento. Vem com Claude Code.
- **Node.js (≥18)** — pra dashboard e renderização de carrosséis. Baixa de [nodejs.org](https://nodejs.org) se não tiver.
- **Python (≥3.10)** — pra transcrição de áudio e análise de dados. Baixa de [python.org](https://python.org) se não tiver.
- **ffmpeg** — pra compressão de vídeo. No Windows, instala via [Chocolatey](https://chocolatey.org) ou baixa de [ffmpeg.org](https://ffmpeg.org). Só precisa se for usar `/comprimir-video`.

Chaves de API **opcionais** (configura via `/conectar` quando precisar):
- `OPENAI_API_KEY` — pra gerar foto IA no `/carrossel` Tipo 2
- `HIGGSFIELD_API_KEY` — pras skills `higgsfield-*` (geração premium)
- `APIFY_API_TOKEN` — pra scrapers customizados

MCPs (extensões do Claude Code que conectam com serviços externos):
- Instagram, WhatsApp, Meta Ads, Google Ads, Google Calendar, Google Drive

Instala um MCP via `claude mcp add <nome>` quando o Claude pedir. Ele te guia.

---

**Dúvidas, sugestões, achou um bug?** Abre uma issue em [github.com/AllanTagino/tagino-aios/issues](https://github.com/AllanTagino/tagino-aios/issues) ou manda DM pro [@allantagino](https://instagram.com/allantagino).
