---
name: apresentacao-pdf
description: Gera PDF profissional editorial em A4 a partir de markdown, notas soltas ou conteúdo estruturado, aplicando a identidade visual da marca do usuário (cores + tipografia de `identidade/design-guide.md`). Suporta templates: case study, brand book, sales deck, executive summary, relatório. Imagens são opcionais — funciona perfeito só com texto. Use quando o usuário pedir "gerar PDF", "criar apresentação", "exportar pra PDF", "fazer um deck", "pitch deck", "executive summary", "case study em PDF", "apresentação pra cliente", "documento profissional", "relatório", "brand book", ou similar. Saída em `saidas/<nome>.pdf`.
---

# /apresentacao-pdf — PDF editorial com a marca

Skill standalone de geração de PDF profissional. **Não depende de outras skills** — funciona pra qualquer usuário do Tagino_IOS, mesmo quem nunca criou site, carrossel ou qualquer outra peça.

Pipeline: conteúdo (markdown ou estruturado) → HTML estilizado com a identidade da marca → renderiza via Playwright Chromium → PDF A4 pronto pra enviar.

Resultado: documento que parece feito por designer profissional, alinhado com a marca do usuário (não com template genérico).

---

## Quando invocar

- "Gera um PDF disso"
- "Cria uma apresentação"
- "Exporta pra PDF"
- "Faz um deck pro cliente"
- "Pitch deck", "Executive summary", "Case study"
- "Documento pra compartilhar", "Relatório profissional"
- "Brand book em PDF"
- "Manual / guia"
- "Proposta comercial"

## Pré-requisitos

```bash
# Python pra processar markdown
pip install markdown pymupdf

# Node.js + Playwright pra render PDF (já vem instalado se rodou /carrossel antes)
npm install -g playwright    # se ainda não tiver
npx playwright install chromium
```

---

## Workflow

### Passo 1 · Identificar o tipo de documento

Pergunte ao usuário (ou inferir pelo contexto). Escolha um dos 5 templates:

| Template | Quando usar | Tamanho típico |
|---|---|---|
| **executive-summary** | 1 ideia · 1 ação · uma mensagem | 1-3 páginas |
| **case-study** | Conta um projeto/cliente do começo ao fim | 5-10 páginas |
| **brand-book** | Identidade visual, tom de voz, regras | 8-15 páginas |
| **sales-deck** | Pitch comercial pra prospect | 8-12 páginas |
| **relatorio** | Métricas, progresso, próximo ciclo | 5-10 páginas |

Se o usuário não souber, **executive-summary** é o default mais seguro (1-3 páginas).

### Passo 2 · Coletar conteúdo

Conforme o template:

**executive-summary** precisa de:
- Título principal (1 frase)
- TL;DR (3-5 bullets)
- 1-2 parágrafos de contexto/justificativa
- CTA ou próxima ação

**case-study** precisa de:
- Nome do projeto/cliente + contexto
- Desafio (problema)
- Solução (o que foi feito)
- Resultados (números, antes/depois)
- Aprendizados / próximos passos

**brand-book** precisa de:
- Manifesto/missão (1 parágrafo)
- Paleta (cores + hex codes) — pode puxar do design-guide.md
- Tipografia (fontes + uso)
- Tom de voz (princípios + exemplos)
- Regras "faça / não faça"

**sales-deck** precisa de:
- Problema que resolve
- Solução proposta
- Como funciona (3-5 passos)
- Diferenciais (vs alternativas)
- Pricing/condições
- Próximo passo (CTA)

**relatorio** precisa de:
- Período coberto
- Métricas principais
- 3-5 conquistas
- Aprendizados
- Próximo ciclo

### Passo 3 · Ler identidade da marca

```python
# Lê design-guide.md (padrão Tagino_IOS)
import re
with open('identidade/design-guide.md', encoding='utf-8') as f:
    brand = f.read()

# Extrai hex codes
hex_codes = re.findall(r'#[A-Fa-f0-9]{6}', brand)
# Extrai família de fonte mencionada
fonts = re.findall(r"['\"]([A-Z][a-zA-Z ]+)['\"](?=,)", brand)
```

Se o `design-guide.md` não existir ou estiver vazio, use **defaults editoriais** (descritos na próxima seção).

Também ler `_memoria/empresa.md` pra puxar assinatura (nome, contato, CRECI/CNPJ se aplicável).

### Passo 4 · Defaults editoriais (quando não tem design-guide)

| Token | Default |
|---|---|
| Background | `#FAFAF7` (off-white quente) |
| Texto primário | `#1A1A1A` (grafite) |
| Texto secundário | `rgba(26, 26, 26, 0.72)` |
| Card / bloco | `#F0EBE0` (sand suave) |
| Acento | `#B8865A` (terracota) ou cor primária da marca |
| Hairline | `rgba(26, 26, 26, 0.14)` |
| Serif (títulos) | Cormorant Garamond 500 |
| Sans (corpo) | Inter 500 |
| Mono (código) | JetBrains Mono 500 |

Esses defaults seguem **regras editoriais universais** (não vinculados a nenhum projeto). Funcionam pra advogado, médico, arquiteto, consultor, professor — qualquer profissional liberal.

### Passo 5 · Gerar HTML estilizado

Crie um único arquivo HTML com **TUDO inline** (CSS + conteúdo). Estrutura mínima:

```html
<!doctype html>
<html lang="pt-br">
<head>
<meta charset="utf-8">
<title>...</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --primary: <from design-guide ou default>;
    --text: <from design-guide ou default>;
    --accent: <from design-guide ou default>;
    --muted: <derivado>;
    --hairline: <derivado>;
  }
  @page { size: A4; margin: 0; }
  .page {
    width: 210mm; min-height: 297mm;
    padding: 22mm 20mm;
    page-break-after: always;
    background: var(--primary);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    font-size: 10pt;
    line-height: 1.55;
  }
  h1, h2, h3 { font-family: 'Cormorant Garamond', serif; font-weight: 500; ... }
  em { font-style: italic; color: var(--accent); }
  /* ... */
</style>
</head>
<body>
  <section class="page cover">...</section>
  <section class="page">...</section>
</body>
</html>
```

### Passo 6 · Renderizar via Playwright

```javascript
// render-pdf.js
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext()).newPage();
  const url = 'file://' + path.join(__dirname, 'doc.html').replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  await page.pdf({
    path: path.join(__dirname, 'saida.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });
  await browser.close();
})();
```

Rodar:
```bash
NODE_PATH="<caminho>/playwright/node_modules" node render-pdf.js
```

### Passo 7 · Validar visualmente

Sempre converter o PDF de volta pra imagens e mostrar pro usuário:

```python
import fitz
doc = fitz.open('saida.pdf')
for i in range(min(3, len(doc))):  # primeiras 3 páginas
    pix = doc[i].get_pixmap(matrix=fitz.Matrix(1.2, 1.2))
    pix.save(f'.preview-p{i+1}.png')
```

Mostrar capa, miolo, conclusão. Aguardar aprovação antes de finalizar.

### Passo 8 · Limpar artefatos

Apagar:
- HTML/JS intermediários (`*.html`, `*.js` na pasta `saidas/`)
- Previews (`.preview-*.png`, `.thumb-*.jpg`)
- Imagens otimizadas em pastas temp (se houver)

Manter apenas: `saidas/<nome>.pdf`.

---

## Imagens (opcional)

Imagens deixam o PDF mais rico, mas **não são obrigatórias**. Pra documentos só com texto, o PDF fica perfeito com apenas tipografia + cards + tabelas.

Quando o usuário fornecer imagens:
- Otimizar pra ≤ 200 KB cada (Pillow `JPEG quality=80, optimize=True, progressive=True`)
- Embedar com `<img src="...">` ou via `background-image` em divs
- Sempre dar `alt` descritivo (mesmo que ninguém leia, ajuda em leitores de tela)
- Aspect ratio: respeitar o nativo da imagem ou usar `object-fit: cover` com proporção fixa

Tipos de imagens úteis em PDFs:
- Capa: foto temática large (full bleed) OU sem foto (cover tipográfica)
- Case study: screenshots de antes/depois, fotos do projeto
- Brand book: amostras da marca aplicada
- Sales deck: mockups, ícones de features
- Relatório: gráficos, dashboards

---

## Padrões editoriais (não-AI)

Pra ficar profissional e não parecer template AI genérico:

| Elemento | Valor | Por quê |
|---|---|---|
| **Headline serif** | Cormorant Garamond 500 (32-86pt) · letter-spacing -0.024em | Peso editorial sem ser pesado |
| **Body sans** | Inter 500 (9-11pt) · line-height 1.55 | Legibilidade excelente |
| **Eyebrow** | Inter 800 · 7-9pt · letter-spacing 0.32em · UPPERCASE · cor accent | Pontuação visual clara |
| **Régua** | 36-80pt × 2.5-3pt · cor accent | Divisor editorial discreto |
| **Itálico de destaque** | Em palavras-chave dentro de h2, cor accent | Ativa o olho sem ser bold |
| **Cards de stat** | Background sand + border-left 3pt accent + numeral grande serif accent | Destaca números |
| **Tables** | Header com bg sand + border-bottom 1.5pt accent · rows alternadas | Editorial, não planilha |
| **Link card / CTA** | Background graphite + texto cream + accent left-border | Quebra visual forte |

## Anti-AI checklist (NÃO fazer)

- ❌ Gradiente colorido (roxo, índigo, neon)
- ❌ Rounded-2xl em tudo
- ❌ Shadow forte / glow
- ❌ Stock illustrations
- ❌ Ícone genérico em toda seção
- ❌ Páginas 100% texto sem hierarquia visual
- ❌ Tabelas com bordas grossas + fundo cinza claro
- ❌ Copy genérica de slide ("Realize seus sonhos")

---

## Estrutura de cada template

### executive-summary (1-3 páginas)
```
Página 1 — Capa compacta com título + TL;DR + assinatura
Página 2 (opcional) — Contexto/justificativa
Página 3 (opcional) — CTA + dados de contato
```

### case-study (5-10 páginas)
```
Página 1 — Capa (título + cliente + período)
Página 2 — TL;DR (resumo do case)
Página 3 — Desafio (contexto + problema)
Página 4-6 — Solução (etapas + decisões)
Página 7 — Resultados (números, comparativos)
Página 8 — Aprendizados + próximos passos
Página 9 — Fechamento + assinatura
```

### brand-book (8-15 páginas)
```
Página 1 — Capa com logo
Página 2 — Manifesto
Página 3 — Paleta de cores
Página 4 — Tipografia
Página 5 — Tom de voz
Página 6-7 — Aplicações (exemplos de uso)
Página 8 — Faça / não faça
Página 9 — Assinatura institucional
```

### sales-deck (8-12 páginas)
```
Página 1 — Capa
Página 2 — Problema
Página 3 — Solução proposta
Página 4-6 — Como funciona (3 passos)
Página 7 — Diferenciais vs alternativas
Página 8 — Cases / prova social (se houver)
Página 9 — Pricing
Página 10 — Próximo passo + CTA
```

### relatorio (5-10 páginas)
```
Página 1 — Capa (período coberto)
Página 2 — Sumário executivo
Página 3 — Métricas principais (cards)
Página 4-6 — Conquistas (3-5)
Página 7 — Aprendizados
Página 8 — Próximo ciclo
```

---

## Output esperado

```
saidas/
└── <nome-do-documento>.pdf    ← entregável final
```

PDF deve:
- A4 portrait (padrão internacional brasileiro/europeu)
- ≤ 5 MB (imagens otimizadas) ou ≤ 1 MB (só texto)
- Fontes embedded (Google Fonts via link)
- `printBackground: true` habilitado
- Tipografia consistente em todas as páginas
- Cor accent presente em cada página (régua, eyebrow, ou itálico)
- Páginas com número/header de identificação
- Última página com assinatura (nome + contato + CRECI/CNPJ se aplicável)

---

## Limites + dicas

- **Não use frameworks** (React, Vue, etc.) — HTML+CSS puro renderiza mais previsível no Playwright
- **Google Fonts via preconnect** carrega rápido; não use @font-face com arquivos locais
- **Imagens otimizadas**: max 800-1600px wide, JPEG quality 80, progressive. PNG só pra gráficos com transparência
- **page-break-inside: avoid** em tabelas e cards pra não cortar no meio da página
- **preferCSSPageSize: true** + `@page { size: A4; margin: 0 }` dá controle total
- **Sempre aguardar fontes carregarem**: `await page.evaluate(() => document.fonts.ready)` antes do `page.pdf()`
- **Português com acento**: usar `<meta charset="utf-8">` + encoding UTF-8 no arquivo HTML
- **Quebra de página manual**: `page-break-after: always` na seção .page
