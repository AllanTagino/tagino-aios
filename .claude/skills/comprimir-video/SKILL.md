---
name: comprimir-video
description: Comprime vídeos pra web (MP4 H.264 com faststart) usando ffmpeg. Aceita qualquer formato de entrada (HEVC 4K, MOV, MKV, AVI), aplica auto-crop de barras pretas se detectado, escala pra tamanho-alvo (web/social/hero/tour) e gera output com bitrate ~10× menor mantendo qualidade visual. Use quando o usuário pedir "comprimir esse vídeo", "deixar leve pra web", "preparar pro Netlify/Vercel", "video tá muito pesado", "converter pra MP4 web", "otimizar vídeo do reel", ou similar. Extrai automaticamente um poster frame (JPG) do timestamp escolhido.
---

# /comprimir-video — Comprimir vídeo pra web

Skill genérica de compressão. Pipeline ffmpeg com perfis pré-configurados pra diferentes casos de uso. Reduz tamanho 5-20× preservando qualidade visual.

---

## Quando invocar

- "Comprime esse vídeo"
- "Deixa leve pra web"
- "Prepara pro Netlify / Vercel / site"
- "Vídeo tá muito pesado, dá pra reduzir?"
- "Converte esse 4K pra MP4 leve"
- "Otimiza esse reel pra web"
- "Crop esse vídeo pra remover barras pretas"

## Pré-requisitos

**ffmpeg** instalado e no PATH. Verifica com:

```bash
ffmpeg -version
```

No Windows: baixar de gyan.dev/ffmpeg/builds/. No Mac: `brew install ffmpeg`. No Linux: `apt install ffmpeg`.

---

## Perfis de compressão

Escolha o perfil conforme uso:

| Perfil | Resolução | CRF | Bitrate alvo | Tamanho/min | Quando usar |
|---|---|---|---|---|---|
| **web-hero** | 720p (1280×720 ou 720×1280) | 28 | ~1.5 Mbps | ~10 MB | Hero da landing page, loop curto |
| **web-tour** | 720p | 26 | ~2 Mbps | ~15 MB | Tour walkthrough, narrativa |
| **web-bg** | 1080p | 26 | ~2.5 Mbps | ~18 MB | Background video full-bleed |
| **social-9-16** | 1080×1920 | 22 | ~4 Mbps | ~30 MB | Reel/Story pra publicar no IG |
| **social-16-9** | 1920×1080 | 22 | ~4 Mbps | ~30 MB | Vídeo landscape pra YouTube/LinkedIn |
| **max-quality** | mantém native | 20 | sem limite | varia | Quando "tem que ficar perfeito" — desktop com Wi-Fi |

---

## Workflow

### Passo 1 · Inspecionar source

```bash
ffprobe -v error \
  -select_streams v:0 \
  -show_entries stream=width,height,r_frame_rate,codec_name,bit_rate \
  -show_entries format=duration,size \
  -of default=noprint_wrappers=1 \
  "<source>"
```

Informa: dimensões nativas, codec atual, bitrate, duração, peso. Necessário pra escolher perfil e detectar problemas (barras pretas, codec ruim).

### Passo 2 · Detectar barras pretas (opcional)

Se o source tem barras pretas embutidas (vídeo vertical exportado em 16:9 ou vice-versa):

```bash
ffmpeg -i "<source>" -vf cropdetect=mode=black:limit=24 -t 5 -f null - 2>&1 \
  | grep -oP 'crop=[0-9:]+' | sort -u | tail -3
```

Retorna algo como `crop=400:720:440:0` (width:height:x-offset:y-offset). Aplica esse crop no encode pra remover as barras.

### Passo 3 · Encodar

**Pipeline padrão (web-hero):**

```bash
ffmpeg -y -i "<source>" \
  -vf "scale=720:-2" \
  -c:v libx264 -crf 28 -preset medium -pix_fmt yuv420p \
  -c:a aac -b:a 96k \
  -movflags +faststart \
  "<output>.mp4"
```

**Com crop aplicado:**

```bash
ffmpeg -y -i "<source>" \
  -vf "crop=600:1080:660:0,scale=720:-2" \
  -c:v libx264 -crf 28 -preset medium -pix_fmt yuv420p \
  -c:a aac -b:a 96k \
  -movflags +faststart \
  "<output>.mp4"
```

**Max quality (FullHD vertical):**

```bash
ffmpeg -y -i "<source>" \
  -vf "crop=600:1080:660:0,scale=1080:1920:flags=lanczos" \
  -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  "<output>.mp4"
```

**Sem áudio (background loop):**

Adiciona `-an` no comando — economiza ~80 KB por minuto + remove pop de áudio acidental.

### Passo 4 · Extrair poster

Pra usar como `poster=""` no `<video>` tag (carrega instantaneamente enquanto o vídeo buffera):

```bash
ffmpeg -y -i "<output>.mp4" \
  -ss 00:00:01.5 \
  -vframes 1 \
  -q:v 4 \
  "<output>-poster.jpg"
```

`-ss 00:00:01.5` pega frame em 1.5s. Trocar pra timestamp com conteúdo bom (não preto/transição).

### Passo 5 · Validar

```bash
ffprobe -v error -show_entries stream=width,height -show_entries format=size,bit_rate -of default=noprint_wrappers=1 "<output>.mp4"
```

Confirma dimensões e tamanho final. Se peso > esperado, subir CRF (28 → 30 → 32) ou reduzir resolução.

---

## Parâmetros explicados

- **`-c:v libx264`** — codec H.264 (compatibilidade universal, todos os browsers)
- **`-crf X`** — Constant Rate Factor. Lower = melhor qualidade, maior arquivo. Range: 18 (visualmente lossless) a 35 (ruim). Sweet spots: 20-22 (high), 24-26 (good), 28-30 (web)
- **`-preset slow`** — gasta mais CPU pra comprimir melhor. Slow = ~30% menor que medium. Use pra max quality. Para iteração rápida, `medium`.
- **`-pix_fmt yuv420p`** — formato de pixel compatível com todos os players + browsers
- **`-c:a aac -b:a 96k`** — áudio AAC 96 kbps (qualidade decente, ~720 KB/min)
- **`-movflags +faststart`** — move o moov atom pra começo do arquivo. **Crítico pra streaming web** — sem isso, o vídeo só toca depois de baixar inteiro

---

## Casos especiais

### Vídeo vertical (9:16) com barras pretas

Comum em vídeos exportados de apps mobile pra "vertical-in-horizontal frame". Source típico: 1920×1080 com conteúdo central de 600×1080 e barras pretas de 660px cada lado.

**Detecção:** `cropdetect` retorna `crop=600:1080:660:0`.

**Solução:** aplicar o crop antes do scale.

### Vídeo HEVC 4K mobile

iPhones e câmeras modernas exportam em HEVC (H.265) 4K. Excelente qualidade, péssima compatibilidade com browsers antigos. **Sempre converter pra H.264** pra web.

```bash
# 4K HEVC → 720p H.264 (~95% redução)
ffmpeg -y -i "<4K-hevc-source>" \
  -vf "scale=1280:-2" \
  -c:v libx264 -crf 26 -preset medium -pix_fmt yuv420p \
  -c:a aac -b:a 96k \
  -movflags +faststart \
  "<output>.mp4"
```

### Múltiplos vídeos em batch

Sequencial (evita disputar CPU):

```bash
for f in *.mp4; do
  ffmpeg -y -i "$f" -vf "scale=720:-2" -c:v libx264 -crf 28 \
    -preset medium -pix_fmt yuv420p -c:a aac -b:a 96k \
    -movflags +faststart "compressed-$f"
done
```

---

## Resultados típicos

Source → Output (perfis padrão):

| Source | Output (web-hero) | Redução |
|---|---|---|
| 4K HEVC 2160×3840 · 273 MB · 60s | 720p H.264 · 14 MB · 60s | **95%** |
| FullHD 1920×1080 · 75 MB · 68s | 720p H.264 · 4-10 MB · 68s | **86-95%** |
| 1080×1920 · 25 MB · 30s | 720×1280 · 3-5 MB · 30s | **80%** |

---

## Limites + dicas

- **Não comprime áudio puro** — use outras tools (`ffmpeg -c:a libmp3lame -b:a 96k`)
- **WebM/AV1** é mais leve que H.264 mas tem suporte inconsistente em iOS Safari. Pra web universal, fica com H.264.
- **Dimensão ímpar** (ex: 721×1281) quebra o encoder — use `scale=720:-2` que arredonda automaticamente
- **Filename com espaços** — sempre entre aspas: `"file with spaces.mp4"`
- **HTML5 `<video>` precisa de:** `controls preload="metadata" poster="..." playsinline muted loop autoplay` pra autoplay funcionar em todos browsers (mobile inclusive)
