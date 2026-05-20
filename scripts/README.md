# scripts/ — utilitários do Tagino_AIOS

Scripts Node.js e Python que as skills chamam quando precisam fazer coisas fora do alcance da IA pura (gerar imagem, postar em rede social, renderizar HTML em PNG).

## Scripts já incluídos

| Arquivo | Stack | O que faz |
|---|---|---|
| `nano-banana-enhance.py` | Python | Roda prompt + imagem(ns) através do kie.ai Nano Banana Pro (Gemini 2.5 Flash Image) e salva o resultado local. Usado pela skill `/image-enhancer-aios`. |
| `build-dashboard.mjs` | Node | Compila os dados do workspace pro dashboard JSON. |
| `requirements.txt` | — | Dependências Python (`pip install -r scripts/requirements.txt`). |

## Scripts gerados sob demanda

Conforme você for ativando skills, isso aqui vai sendo populado. Lista do que cada skill espera encontrar:

| Skill | Script esperado | O que faz |
|---|---|---|
| `/carrossel` (com foto IA) | `gerar-imagem.js` | Gera foto realista via OpenAI API (DALL-E 3) |
| `/carrossel` (render PNG) | `render.js` (gerado por carrossel, fica na pasta do conteúdo) | Playwright tira screenshot 1080x1350 de cada slide |
| `/aprovar-post` | `postar-instagram.js` | Publica carrossel no Instagram via Meta Graph API |
| `/aprovar-post` | `postar-facebook.js` | Publica carrossel no Facebook via Meta Graph API |
| `/anuncio-google` | (nenhum — gera CSV direto) | — |
| `/relatorio-ads` | (lê CSV exportado das plataformas) | — |

## Pré-requisitos comuns

**Python 3.10+** (pro `nano-banana-enhance.py`)
```powershell
pip install -r scripts/requirements.txt
```

**Node.js 20+** (pros scripts JS — opcional, só se for usar carrossel/Meta Graph)

**`.env`** na raiz do projeto com as chaves de API. Copia `.env.example` pra `.env` e cola tuas chaves, **ou** roda `/conectar <servico>` no Claude Code que ele faz o setup com validação:

```bash
KIE_API_KEY=...                     # pra nano-banana-enhance.py + /image-enhancer-aios
OPENAI_API_KEY=sk-...               # pra gerar-imagem.js + /carrossel Tipo 2
META_PAGE_ACCESS_TOKEN=...          # pra postar-instagram.js + postar-facebook.js
META_PAGE_ID=...
META_IG_USER_ID=...
SITE_URL=https://seudominio.com.br
```

**Playwright** (pra renderizar HTML em PNG, gerado quando precisar):
```powershell
npm install playwright
npx playwright install chromium
```

## Como o Tagino_AIOS lida com isso

Quando você roda uma skill que precisa de script ausente, o Claude vai:

1. Detectar que falta o script
2. Te perguntar se quer configurar agora
3. Te guiar no setup das chaves de API (`/conectar`)
4. Criar o script já configurado
5. Rodar a skill

Você não precisa decorar nada. Roda a skill, segue o fluxo.

## Quick start — Nano Banana enhance

```powershell
# 1. Setup uma vez por workspace
pip install -r scripts/requirements.txt
# (e adiciona KIE_API_KEY no .env via /conectar kieai)

# 2. Rodar enhancement
python scripts/nano-banana-enhance.py `
  --input "dados/oficial/.../render.jpg" `
  --prompt-file "marketing/enhanced/cena/prompt.txt" `
  --negative-file "marketing/enhanced/cena/negative.txt" `
  --output "marketing/enhanced/cena/render-enhanced.png"
```

Custo ~$0.09 USD por imagem @ 2K · 30-90s por render.
