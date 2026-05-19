# Tagino_IOS

> O sistema operacional do seu negócio dentro do Claude Code.

Você acaba de instalar o Tagino_IOS. Em alguns minutos, sua empresa
tem memória própria, identidade visual aplicada em tudo que o sistema
gerar, 19 skills prontas pra marketing, SEO, ads, mídia e operação, e
um dashboard local pra ver o estado do sistema num olhar.

Bora voar.

---

## Ligando o sistema

Dois caminhos. Escolhe o que combina contigo.

### Pelo Claude (mais rápido)

Abre o Claude Code em qualquer pasta e cola:

```
Clona o https://github.com/AllanTagino/tagino-ios.git na pasta atual,
entra nela e roda o /instalar.
```

Ele clona, entra na pasta nova e dispara a entrevista de setup. Você
só responde.

### Pelo terminal (mais previsível)

```
git clone https://github.com/AllanTagino/tagino-ios.git
cd Tagino_IOS
code .
```

Na janela do VS Code que abrir: terminal integrado → `claude` → `/instalar`.

---

Quando o `/instalar` terminar, renomeia a pasta `Tagino_IOS/` pro nome do teu
negócio (fecha o VS Code, renomeia no Explorer/Finder, abre de novo). A
pasta não fica como "Tagino_IOS" — ela é o teu negócio agora.

O `/instalar` roda uma vez só. Te entrevista sobre o negócio, monta a
memória e configura o sistema. Depois disso, é só usar.

---

## O sistema

**Núcleo** — o jeito de operar o dia a dia
`/abrir` carrega o contexto antes de cada sessão de trabalho · `/salvar`
faz commit + push no GitHub · `/atualizar` varre o projeto e atualiza
a memória · `/novo-projeto` cria pasta isolada pra cada cliente ou
iniciativa · `/mapear-rotinas` descobre o que você repete e transforma
em skill personalizada.

**Conteúdo e SEO** — vitrine pública da empresa
`/carrossel` cria carrosséis 1080×1350 com identidade da marca (com ou
sem foto IA) · `/publicar-tema` pega um tema e entrega artigo de blog +
carrossel + 3 legendas amarradas · `/seo` roda fluxo completo de 8 passos
(demanda, concorrência, GMB, on-page, conteúdo, ads, monitoramento, GEO)
· `/responder-avaliacoes` escreve respostas humanas pras reviews do
Google · `/aprovar-post` publica blog + Instagram + Facebook num comando.

**Mídia rica** — peças além do post
`/apresentacao-pdf` gera PDF editorial A4 a partir de markdown com a
paleta e tipografia da marca (case study, brand book, sales deck,
executive summary, relatório) · `/transcrever-audio` passa áudio
(MP3, MP4, WAV, M4A) pra texto timecoded em PT-BR via faster-whisper
local — sem custo de API, sem upload · `/comprimir-video` comprime
vídeo (HEVC 4K, MOV, MKV) pra MP4 H.264 web-ready com bitrate ~10×
menor, auto-crop de barras pretas e poster JPG extraído.

**Anúncios pagos** — onde o dinheiro entra
`/anuncio-google` monta a campanha inteira em CSV pronto pra importar
no Google Ads Editor · `/relatorio-ads` lê os exports de Google + Meta
e devolve relatório semanal com alertas e recomendações.

**Lançamentos e sites** — captação direta
`/premium-website-lancamento-aios` constrói landing page premium de
lançamento imobiliário (HTML + CSS + JS, deploy-ready pra Netlify ou
Vercel) com galeria, ficha, formulário pra WhatsApp e Maps embed sem
API key.

**Produção** — ferramentas do dia a dia
`/analisar-dados` lê CSV/XLSX/PDF e gera resumo executivo ·
`/email-profissional` rascunha email a partir de contexto livre.

---

## Dashboard local

Abre o `dashboard.html` na raiz do projeto (duplo-clique, sem servidor,
sem internet) pra ver num olhar o estado do sistema: o que da memória
tá preenchido, quais skills você tem instaladas, qual a paleta da
marca, o que já foi produzido, e quais ferramentas (Instagram, WhatsApp,
Meta Ads, Google Ads, Calendar) podem ser conectadas.

O dashboard se popula sozinho via `node scripts/build-dashboard.mjs` —
scan do workspace inteiro pra gerar `dashboard/data.js`. Cada workspace
tem o seu, gitignored. Detalhes em [`dashboard/README.md`](dashboard/README.md).

---

## A tese

IA não é uma ferramenta que sua empresa usa. É o sistema operacional em
que ela roda.

A diferença não é velocidade. É capacidade nova — uma pessoa com IA
constrói o que antes exigia time inteiro. Cada processo crítico que hoje
roda em open loop (decide → executa → não mede → repete cego) vira
closed loop dentro do Tagino_IOS (decide → executa → captura → realimenta →
ajusta sozinho).

O sistema não substitui você. Vira parte da sua empresa.

---

## Como o Tagino_IOS pensa

`_memoria/` é o cérebro. Tudo que importa do seu negócio mora aqui —
quem é a empresa, como ela fala, o que tá em foco essa semana. O Claude
lê isso antes de cada resposta. Quanto melhor a memória, melhor o sistema.

`identidade/` é o rosto. Cores, fontes, logo, padrão visual. Todo
carrossel, slide, peça que o sistema gera respeita isso.

`marketing/`, `saidas/` e `scripts/` são o resultado. O sistema produz,
versiona no GitHub, fica tudo seu.

---

## Entrevista web pra cliente que não usa Claude

Tagino_IOS é o sistema operacional pra quem **vai usar Claude Code**. Pra atender clientes que **não vão usar Claude**, montei uma entrevista web separada que roda em qualquer browser e captura as respostas via Netlify Forms:

→ Repo do hub: **[tagino-entrevista-hub](https://github.com/AllanTagino/tagino-entrevista-hub)** (privado, é o meu setup)

Pra quem quiser montar uma própria, o hub é um único `public/index.html` + `deploy.ps1` no Netlify. Clone, customize o `CLIENTES` map, deploya.
