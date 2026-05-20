---
name: miniatura-aios
description: >
  Converte um render arquitetônico (interior ou semi-aberto) em uma miniatura
  isométrica estilo dollhouse cutaway — caixa 3D com uma face removida,
  preservando todos os móveis, materiais e cores do original. Use quando o
  usuário disser "miniatura", "miniatura isométrica", "dollhouse", "maquete",
  "/miniatura-aios", ou pedir pra transformar um render fotorrealista em
  visualização tipo brinquedo/caixa 3D. Saída em `marketing/enhanced/miniatura-<slug>-<data>/`.
---

# /miniatura-aios — Render → Miniatura isométrica dollhouse

Transforma um render arquitetônico fotorrealista numa miniatura isométrica
"caixa 3D com cutaway" — o ambiente vira um modelo em escala, com a face
frontal e o lado aberto removidos pra revelar o interior, todos os móveis e
materiais preservados, fundo creme neutro.

Inspirado na ferramenta "Miniatura Isométrica" do renderlab.club, mas rodando
no nosso pipeline via kie.ai Nano Banana Pro. Padrão validado em produção
no workspace 1800 Oscar Pinheiros (Liege).

---

## Pré-requisitos

1. **`KIE_API_KEY` no `.env`** — pega em https://kie.ai/api-key. Setup via `/conectar kieai`.
2. **`pip install -r scripts/requirements.txt`** — uma vez por workspace.
3. **Imagem de input** — render interior ou semi-aberto, JPG/PNG, qualquer resolução (será upscaled na API).

Se algum desses faltar, parar e mostrar o que precisa ser feito antes.

---

## Workflow

### Passo 1 — Identificar a imagem

Aceitar:
- Caminho direto (ex: `dados/oficial/empreendimento/IMAGENS/13 - COWORKING_TERREO_FINAL.jpg`)
- Caminho relativo ao workspace
- Imagem anexada na conversa (Claude lê o path automaticamente)

Se o usuário só disser "transforma essa em miniatura" sem path:
- Verificar se há imagem na conversa atual
- Senão, listar imagens em `dados/oficial/empreendimento/IMAGENS/` e perguntar qual

### Passo 2 — Analisar a cena

Antes de escrever o prompt, ler a imagem e identificar:
- **Tipo de espaço**: interior fechado (escritório, sala) | semi-aberto (varanda, churrasqueira) | aberto (rooftop, jardim)
- **Estrutura**: quantas paredes visíveis, tem teto, tem janela/vidro?
- **Inventário de móveis**: enumerar TUDO — cadeiras, mesas, sofás, balcões, prateleiras, decoração, equipamentos, plantas internas
- **Materiais distintivos**: pedra, madeira, vidro, tecido, ladrilho, planta verde
- **Elementos arquitetônicos**: arco, parede curva, mezanino, escada, brise

Essa análise vai pro prompt como enumeração explícita de preservação.

### Passo 3 — Escrever o prompt

Usar o template abaixo, substituindo `<...>` com os achados da análise:

```
Convert this <interior|outdoor patio|semi-open> render into an isometric
miniature diorama, viewed from a fixed 45-degree angle slightly above.
Frame the scene as a 3D box with visible exterior wall thickness: keep the
<wall A description> and the <wall B description> as the structural sides,
keep the floor as the base, and keep the <ceiling/overhang> visible.
Remove the <front side / open garden side / glazed wall> as if cut away
to reveal the interior. Preserve every piece of furniture exactly as in
the source (<enumerar TUDO: cadeira X, mesa Y, sofá Z, prateleira W, planta
P, etc>), every material and every color — do not invent, add, simplify,
or remove anything. Photoreal miniature scale, matte finish. Warm cream
seamless background with a subtle warm cast across the entire scene. Wide
16:9 composition.
```

**Regras do prompt** (descobertas via teste):
- **CURTO ganha de LONGO** — Nano Banana Pro drifta com prompts grandes prescritivos. ~120 palavras max.
- **"3D box with visible exterior wall thickness"** é a chave estrutural — sem isso vira dollhouse fofo, com isso vira maquete arquitetônica.
- **MANTER o teto, não remover** — diferente do que parece intuitivo. Tirar só uma parede.
- **Enumerar móveis por nome** — não dizer "preserve all furniture", dizer "preserve the wooden bar stools, the round table with green chairs, the woven loungers, the slatted bench". Per-item ganha.
- **"Warm cream seamless background with a subtle warm cast"** unifica a estética.

### Passo 4 — Escrever o negative

Template padrão (raramente precisa ajustar):

```
No text, no captions, no logos, no borders. No people, no figurines, no pets.
Do not add or remove any furniture, do not simplify or substitute any piece.
Do not flatten or change the materials (<repetir os materiais distintivos da
análise — ex: stone stays stone, wood stays wood, green wall stays lush
layered foliage>). Do not invent architecture (no extra walls, no extra
columns, no extra screens). Do not change the floor pattern. Do not
over-saturate, do not switch to cartoon or plastic-toy aesthetic. No harsh
shadows, no blown highlights, no oversharpened edges.
```

### Passo 5 — Salvar os arquivos

Layout obrigatório (mantém histórico iterável):

```
marketing/enhanced/miniatura-<slug>-<YYYY-MM-DD>/
├── prompt.txt         ← prompt do Passo 3
├── negative.txt       ← negative do Passo 4
└── miniatura-<slug>.png   ← resultado do Passo 6
```

`<slug>` = descrição curta da cena (ex: `churrasqueira`, `coworking`, `brinquedoteca`, `rooftop-pool`).
`<YYYY-MM-DD>` = data atual.

### Passo 6 — Rodar o script

Comando padrão (16:9, 2K por default, sem resize):

```powershell
python scripts/nano-banana-enhance.py `
  --input "<caminho do source>" `
  --prompt-file "marketing/enhanced/miniatura-<slug>-<data>/prompt.txt" `
  --negative-file "marketing/enhanced/miniatura-<slug>-<data>/negative.txt" `
  --output "marketing/enhanced/miniatura-<slug>-<data>/miniatura-<slug>.png" `
  --aspect "16:9" `
  --resolution "2K" `
  --no-resize
```

**Por que `--resolution 2K` por default**: balanço custo/qualidade. 2K consome ~18 créditos kie.ai (~$0.09), 4K consome ~24 (~$0.12) — 33% mais caro. Pra preview/iteração e a maioria dos usos (carrossel Instagram, WhatsApp, landing), 2K já dá excelente fidelidade de material. Subir pra 4K só quando for impressão grande ou material super-detalhado (mármore, tecido fino, vidro com reflexo complexo).

**Quando subir pra `--resolution 4K`**: o usuário pediu impressão grande (banner, totem), ou viu na v1 a 2K que ficou material achatado e quer comparar. Custa ~33% mais, demora ~3x mais (60s → 200s+).

**Por que sempre `--no-resize`**: o resize default do script só roda em 16:9 + 2K — pra ficar consistente com 4K opt-in, deixamos o resize off e mandamos o source intacto pra API decidir.

Tempo médio: 60-90s a 2K, 180-220s a 4K.

### Passo 7 — Abrir o resultado e mostrar link clicável

Logo após o `Salvo: ...`:

```powershell
Start-Process "marketing/enhanced/miniatura-<slug>-<data>/miniatura-<slug>.png"
```

E na resposta do chat, sempre incluir link clicável em markdown:

```
[miniatura-<slug>.png](file:///C:/caminho/absoluto/encoded%20with%20%20espacos/miniatura-<slug>.png)
```

Espaços viram `%20`, contrabarras viram `/`. Per [[feedback-easy-image-access]].

### Passo 8 — Avaliar e oferecer refinamento

Olhar o resultado e checar honestamente:
- ✓ Estrutura de caixa 3D com espessura de parede?
- ✓ Apenas a face frontal removida (teto e demais paredes preservados)?
- ✓ Todos os móveis principais visíveis e reconhecíveis?
- ✓ Materiais preservados (madeira como madeira, pedra como pedra)?
- ✓ Cores fiéis ao original?
- ✓ Fundo creme neutro com leve calor?

Se 90%+ do checklist passar: **entregar como está**, oferecer dois caminhos de iteração (chips no estilo [[refinement-chips]]):

```
1. Refazer — gerar outra variação com o mesmo prompt (resultado vai variar)
2. Refinar — segundo passe pra restaurar elementos específicos que faltaram
3. Outro ângulo — versão com a câmera espelhada (parede direita removida em vez da esquerda)
4. Está bom — fechar
```

Se 70-90% passar: **propor refinamento ANTES de entregar como final**. Listar o que faltou (ex: "perdeu os bancos de bar, o frigobar e a palmeira lateral"), oferecer fazer um segundo passe.

Se <70% passar: **regenerar de cara**, ajustando o prompt antes. Provavelmente faltou enumerar móvel chave, ou a cena tem estrutura difícil (parede curva, mezanino, planta complexa).

---

## Segundo passe (refinamento)

Quando o usuário sinaliza "tá quase, mas faltou X, Y, Z":

Não regenerar do zero. Usar o resultado anterior como input + prompt direcionado:

```powershell
python scripts/nano-banana-enhance.py `
  --input "marketing/enhanced/miniatura-<slug>-<data>/miniatura-<slug>.png" `
  --prompt "Restore the following elements from the original render in their exact positions and materials: <X>, <Y>, <Z>. Keep the camera, the box framing, the cream background, and everything else exactly as it is. Photoreal miniature scale." `
  --output "marketing/enhanced/miniatura-<slug>-<data>/miniatura-<slug>-v2.png" `
  --aspect "16:9" `
  --resolution "2K" `
  --no-resize
```

Salvar como `<slug>-v2.png` (v3, v4 se precisar) — manter histórico pra comparação.

---

## Casos resolvidos (referência)

### Interior fechado — kids' room / brinquedoteca
- Paredes: 2 visíveis (back + left)
- Teto: preservar (com pendentes ovais)
- Front + janela direita: remover
- Móveis críticos: mesa + cadeiras, escorregador espiral, ball pit, fogãozinho play, brinquedos de cavalinho, prateleiras, mural de planetas

### Interior semi-aberto — churrasqueira gourmet
- Paredes: pedra (back) + jardim vertical verde (right)
- Teto: cobertura parcial preservada
- Front + lado do jardim (palmeira): remover
- Móveis críticos: ilha+banquetas, mesa+cadeiras verdes, lounges, banco de ripas, geladeira, churrasqueira

### Rooftop / piscina (caso especial)
- Sem paredes laterais reais — não força "caixa 3D"
- Tratar como diorama plano: piso quadrado + piscina embutida + perímetro de glass railings + plantas perimetrais
- Cubo cabana volumétrico
- "Place the entire pool deck as a miniature diorama on a warm cream seamless base, with the glass railings forming the perimeter walls and the cabana cube as a solid 3D volume."

---

## Configurações finais (sempre)

| Parâmetro | Valor default | Por quê |
|---|---|---|
| `--aspect` | `16:9` | Match renderlab + funciona pra interior e semi-aberto |
| `--resolution` | `2K` | Balanço custo/qualidade — usuário pode pedir `4K` se for pra impressão grande |
| `--no-resize` | sempre | Manter consistência entre 2K e 4K (resize default só pega 2K+16:9) |
| `--model` | `nano-banana-pro` | Pro tem fidelidade maior pra preservação |

**Custo de referência:**
- 2K → ~18 créditos kie.ai (~$0.09), 60-90s render
- 4K → ~24 créditos (~$0.12), 180-220s render

Pra batch (8-10 imagens dum carrossel): 2K = ~$0.80, 4K = ~$1.10.

---

## Falhas conhecidas

- **Prompt longo prescritivo (>200 palavras)** → drift. Quanto mais detalhe, mais o modelo improvisa.
- **Pedir pra remover teto** → modelo remove parede e teto juntos, fica vazio.
- **"Preserve everything"** vago → simplifica móveis. Sempre enumerar.
- **2K em material super-detalhado (mármore com veios finos, tecidos com trama)** → pode achatar. Subir pra 4K resolve. Materiais comuns (madeira, pedra básica, fabric simples) renderizam bem a 2K.
- **Aspect 1:1** → composição apertada, perde laterais. 16:9 é o ponto certo pra cenários horizontais.

---

## Quando não usar essa skill

- **Renders externos (fachadas, paisagismo amplo)** → não tem estrutura de "caixa" pra cortar. Usa `/image-enhancer-aios` em vez disso.
- **Cenas com perspectiva extrema (frog-eye, bird-eye)** → modelo não consegue rebater pra isométrica. Pede pra trocar a câmera primeiro (ferramenta de fora).
- **Fotos reais** (não-render) → funciona às vezes mas inconsistente. Designed pra render arquitetônico CG.
