---
name: premium-website-lancamento-aios
description: Build a production-quality real estate launch website (single-page, vanilla HTML+CSS+JS, deploy-ready for Netlify/Vercel). Use when the user asks for "landing page de lançamento", "site do empreendimento", "página do lançamento imobiliário", or wants a premium static site for a new property launch. Follows real estate launch conventions (Gafisa/Lopes structure — hero + sobre + assinatura + galeria + unidades + lazer + localização + ficha + contato) with editorial architectural aesthetic (Archies/magazine vibe). Lead capture goes to WhatsApp (wa.me link), Google Maps embed without API key, brand tokens from `identidade/design-guide.md`. Outputs to `site/lancamento-<slug>/`.
---

# /premium-website-lancamento-aios — Site de lançamento imobiliário

Skill que transforma um briefing de empreendimento em landing page completa, hospedável e deploy-ready em <30min. Convenção de mercado imobiliário (Gafisa/Lopes) + estética editorial (revista de arquitetura). Vanilla HTML+CSS+JS, zero build, zero framework — funciona em qualquer host estático.

---

## Quando invocar

- "Criar landing page do <empreendimento>"
- "Site do lançamento", "página do empreendimento"
- Novo lançamento entra na carteira e precisa de presença web
- Substituir / melhorar página institucional pobre do incorporador
- O usuário menciona Netlify/Vercel + site de imóvel

## Pré-requisitos (ler antes)

1. `identidade/design-guide.md` — cores, fontes, régua, palavra-chave em itálico terracota
2. `_memoria/preferencias.md` — tom direto, sem floreio, número antes de adjetivo
3. `_memoria/empresa.md` — Creci da intermediadora, contato

## Skills relacionadas (combinar quando útil)

- **`/frontend-design`** (`frontend-design:frontend-design`) — invocar paralelamente quando precisar de **anti-AI aesthetic check** do build. Essa skill é específica em "create distinctive, production-grade frontend interfaces" e ajuda a evitar layouts genéricos.
- **`/frontend-ui-engineering`** — guidelines de acessibilidade WCAG, state management, focus management. Bom como referência geral.
- **`/higgsfield-generate`** — quando faltar render do empreendimento, gerar imagem AI ou animar perspectiva existente.
- **`/browser-testing-with-devtools`** — pra validar performance/CWV depois do build (requer chrome-devtools MCP).

## Convenção de pasta

```
site/lancamento-<slug>/
```

`<slug>` = nome do empreendimento em kebab-case minúsculo.
Exemplos: `site/lancamento-villaggio-perdizes/`, `site/lancamento-tonino-lamborghini/`, `site/lancamento-jardim-europa/`.

---

## Workflow

### Passo 1 · Entrevista de coleta

Use `AskUserQuestion` pra coletar o briefing em **uma única passada**. Veja `references/brief.md` pra checklist completo, mas o mínimo é:

- **Identidade:** nome + tagline (1 frase) + slug pra URL
- **Endereço:** completo, com bairro + cidade + UF (vai pro Google Maps)
- **Parceiros:** realização / incorporação / intermediação
- **Assinatura:** arquitetura / paisagismo / interiores (3 escritórios)
- **Mix de unidades:** tabela (tipologia, metragem, qtd, faixa de preço/condição)
- **Áreas comuns:** lista — separar por pavimento (térreo / lazer / wellness / etc)
- **Status:** lançamento / em obra / em aprovação / pronto pra morar
- **Imagens:** pasta de origem (renders, fotos, perspectivas)
- **WhatsApp:** número do corretor em E.164 sem `+` (ex `5511987654321`)
- **Domínio target:** pra meta tags Open Graph e canonical

Se faltar algum dado crítico, **pergunte antes de codar** — placeholder dá retrabalho.

### Passo 2 · Otimizar imagens

Renders/fotos costumam ser 30MB+ em PNG. Comprimir antes de copiar pra `site/lancamento-<slug>/images/`:

```python
from PIL import Image
src_path = "..."  # caminho original
dst_path = "site/lancamento-<slug>/images/hero-torre.jpg"
im = Image.open(src_path).convert('RGB')
w, h = im.size
maxw = 2200  # hero: 2200 | gallery: 1600 | mobile: 1400
if w > maxw:
    nh = int(h * maxw / w)
    im = im.resize((maxw, nh), Image.LANCZOS)
im.save(dst_path, 'JPEG', quality=82, optimize=True, progressive=True)
```

**Target:** cada imagem < 1.3MB. Se a soma das imagens passa de 8MB, baixe quality pra 78 ou use WebP.

Nomes limpos e descritivos: `hero-torre.jpg`, `lobby.jpg`, `piscina.jpg`, `coworking.jpg`, `apto-portrait.jpg`, etc.

### Passo 3 · Estrutura de arquivos

```
site/lancamento-<slug>/
├── index.html       # 10 seções semânticas, ~600 linhas
├── styles.css       # Mobile-first, design tokens da marca
├── script.js        # Sticky nav, mobile menu, form→WhatsApp, smooth scroll
├── README.md        # Deploy Netlify/Vercel + onde trocar WhatsApp
└── images/          # JPGs progressivos otimizados
```

### Passo 4 · 10 seções obrigatórias

**Ordem fixa** (convenção real-estate aprendida da Gafisa Tonino Lamborghini):

| # | Seção | Conteúdo |
|---|---|---|
| 1 | Header sticky | Logo lockup · nav inline · CTA WhatsApp · hamburger mobile |
| 2 | Hero | Foto full-bleed escuro + eyebrow + título Cormorant massivo + tagline italic + lead + 2 CTAs + 3 facts (parceiros) + scroll cue |
| 3 | Sobre + Stats grid | 2-col grid (head + body) + grid de 6 stats (número grande + label) |
| 4 | Assinatura | 3 cards (arquitetura · paisagismo · interiores) com `border-left: 3px terracota` |
| 5 | Galeria bento | Grid 4-col com `tall`/`wide` modifiers, gradient bottom overlay, caption (tag + nome) |
| 6 | Tabela de unidades | `<table>` semântica, HIS/HMP destacados com `tr.highlight` em areia |
| 7 | Áreas comuns | 3 colunas (térreo · lazer principal · pequenos pavimentos + técnicos) |
| 8 | Localização | Grid: iframe Google Maps (sem API key) + lista de proximidade a pé |
| 9 | Ficha técnica | `<dl>` definition list em 2 colunas |
| 10 | Contato + Footer | Form 2-col (copy + form) → WhatsApp · Footer 4-col + disclaimer LGPD/INCC |

Adicionar **botão flutuante WhatsApp** verde (`#25D366`) bottom-right em todas as seções.

### Passo 5 · Google Maps embed (sem API key)

```html
<iframe
  title="Mapa: <endereço> — <bairro>, <cidade>"
  src="https://www.google.com/maps?q=<URL_ENCODED_ADDRESS>&t=&z=15&ie=UTF8&iwloc=&output=embed"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  allowfullscreen></iframe>
```

Aplicar `filter: grayscale(15%)` no iframe pra harmonizar com a paleta.

### Passo 6 · Form → WhatsApp (no backend)

JS captura o submit, valida, monta mensagem pré-preenchida, abre `wa.me`:

```js
const text =
  `Oi <CORRETOR>, sou ${nome}.\n` +
  `Interesse: ${interesseLabel}\n` +
  `WhatsApp: ${telefone}\n` +
  `Gostaria de receber ficha técnica, plantas e tabela do <EMPREENDIMENTO>.`;

window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
```

Máscara de telefone brasileiro `(XX) 9XXXX-XXXX` no input — implementar via JS inline no `script.js`.

### Passo 7 · Testar localmente

```bash
cd site/lancamento-<slug>
python -m http.server 8000
# abre: http://localhost:8000
```

**Nunca abrir via `file://`** — iframe do Google Maps e algumas features falham.

Use Playwright pra validar nos 3 breakpoints (320 · 768 · 1440) e capturar screenshots.

### Passo 8 · Deploy

Mostrar instruções pro usuário **escolher**:

1. **Netlify drop** (mais rápido): https://app.netlify.com/drop → arrasta a pasta
2. **Vercel CLI**: `vercel --prod` na pasta
3. **Vercel Git**: import repo, Root Directory `site/lancamento-<slug>`, Framework `Other`

---

## Design tokens (do `identidade/design-guide.md`)

```css
:root {
  --cream:     #F2EDE4;   /* fundo principal */
  --sand:      #E8DFD0;   /* cards · diferenciação suave */
  --graphite:  #1C1C1A;   /* texto · CTA */
  --terracota: #B8865A;   /* acento · régua · palavra-chave */
}
```

Fontes: **Cormorant Garamond** (serif · weight 500) + **Inter** (sans · 400/500/700/800/900).

## Padrões do design language

- **H1/H2 em Cormorant 500**, `letter-spacing: -0.024em`, peso visual sem ser pesado
- **Eyebrow em Inter 800**, `letter-spacing: 0.32em`, `text-transform: uppercase`, `font-size: 0.7-0.75rem`
- **Régua terracota** 56×3px como divisor entre eyebrow/H2 e corpo
- **Palavra-chave em itálico terracota** dentro de h2 (`<em>endereço</em>`)
- **Borda terracota 3px à esquerda** em cards de destaque
- **Hairline** 1px `rgba(28,28,26,0.12)` pra separadores discretos
- **Sem rounded** — `border-radius: 0 a 4px` no máximo
- **Sem shadow forte** — usar variações de fundo (cream → sand) pra diferenciar planos

---

## Anti-AI checklist (DO NOT do)

Antes de entregar, varrer o HTML/CSS atrás de:

- ❌ `rounded-2xl`, `rounded-full` em cards/seções (só botão se necessário)
- ❌ Gradiente colorido (purple → pink, etc) — só gradient `rgba(graphite, X→Y)` sobre foto
- ❌ Glow, neon, drop-shadow forte
- ❌ Stock-photo de "casal feliz com chave"
- ❌ "Realize o sonho", "imperdível", "última chance"
- ❌ Hashtag enfileirada na arte
- ❌ Lorem ipsum (use copy real)
- ❌ Mais de 2 famílias tipográficas
- ❌ Cor roxa/índigo (a paleta é cream/grafite/terracota — fim)

Se algo violou, refatorar antes de mostrar.

---

## Acessibilidade obrigatória (WCAG 2.1 AA)

- HTML5 semântico: `<header>` `<main>` `<section>` `<nav>` `<article>` `<footer>`
- Hierarquia de headings: **1× h1**, depois h2/h3 (não pular níveis)
- `aria-label` em ícones SVG e botões sem texto visível (hamburger, WhatsApp float)
- `<label>` associado a cada `<input>` no form
- Mapa em `<iframe>` com `title` descritivo
- `:focus-visible` em terracota com `outline-offset: 3px`
- `prefers-reduced-motion` desabilita animações
- Imagens com `alt` descritivo (real, não "imagem")
- `loading="lazy"` em todas as imagens abaixo do fold
- Contraste mínimo: cream/grafite ≈ 13:1 (WCAG AAA — OK)

---

## Trust signals obrigatórios

No footer:

- **Creci da intermediadora** (puxa de `_memoria/empresa.md`)
- Endereço físico da imobiliária
- Disclaimer: "imagens meramente ilustrativas. Móveis e objetos de decoração mostrados não fazem parte do contrato."
- Se memorial não registrado: "Memorial de incorporação em aprovação — processo <NÚMERO>. Preços e disponibilidade sujeitos a registro."
- Se HIS/HMP: "Valores corrigidos pelo INCC a partir de <data>."
- Aviso LGPD no checkbox do form: "Aceito receber contato sobre <empreendimento>."

---

## Responsive obrigatório

Mobile-first. 3 breakpoints:

| Breakpoint | Comportamento |
|---|---|
| **< 768px** (mobile) | Menu hamburger, stats 2-col, bento 1-col, tabela vira cards, form full |
| **< 1024px** (tablet) | Stats 3-col, signature/amenities 1-col, location 1-col |
| **≥ 1024px** (desktop) | Layouts completos, stats 6-col, bento 4-col |

Testar em DevTools com `390 · 768 · 1440`.

---

## SEO obrigatório

```html
<title><EMPREENDIMENTO> · Lançamento · <BAIRRO> · <CIDADE></title>
<meta name="description" content="<TAGLINE> · <UNIDADES> · <DISTÂNCIA METRÔ> · <PARCEIROS>">
<meta name="theme-color" content="#F2EDE4">
<link rel="canonical" href="<DOMAIN>">

<meta property="og:type" content="website">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="images/hero-torre.jpg">
```

`lang="pt-br"`, imagens com `alt` descritivo.

---

## Reaproveitamento entre lançamentos

Depois do primeiro build, ~80% do código é reutilizável. Quando construir um novo lançamento:

1. Abra `site/lancamento-<slug-anterior>/` em paralelo
2. Copie a estrutura completa (HTML + CSS + JS + README) pra `site/lancamento-<novo-slug>/`
3. Troque só o conteúdo (texto · imagens · endereço · parceiros) e renomeie classes/IDs se necessário
4. Os tokens da marca em `identidade/design-guide.md` permanecem — só ajustar se a marca mudar

O ganho é exponencial — o primeiro lançamento educa o sistema, do segundo em diante é montagem.

---

## Pós-build — verificação final

- [ ] Servidor local sobe sem erro (`python -m http.server 8000`)
- [ ] Página carrega em < 3s no DevTools (Performance throttling 3G)
- [ ] Mobile 390px: menu hamburger funciona, hero ocupa tela inteira
- [ ] Tablet 768px: stats em 3-col, bento em 2-col
- [ ] Desktop 1440px: layouts completos
- [ ] Google Maps carrega no endereço correto
- [ ] Form preenchido → abre `wa.me` com mensagem montada
- [ ] Sticky header transparente sobre hero, vira cream sólido ao rolar
- [ ] Footer tem Creci, disclaimer LGPD, parceiros
- [ ] Sem warning de acessibilidade (rodar Lighthouse mental)
- [ ] `WHATSAPP_NUMBER` ainda é placeholder? Lembrar usuário antes do deploy

---

## Próximas melhorias possíveis (mencionar no README)

- Página `/plantas/` com cada planta individual (extraída do book PDF)
- Lightbox/galeria expansível no bento
- Form backup via Formspree (caso WhatsApp falhe)
- Meta Pixel + GA4 + eventos PageView/Lead/Contact
- Schema.org structured data (`RealEstateAgent` · `Apartment` · `LocalBusiness`)
- Versão `en-US` pra investidor estrangeiro
- Tour 360° / vídeo embed (YouTube ou Vimeo)
- Calculadora de financiamento (SBPE · FGTS · juros · entrada)
