---
name: transcrever-audio
description: Transcreve áudio (MP3, MP4, WAV, M4A, etc) pra texto timecoded em PT-BR usando faster-whisper local — sem custo de API, sem upload pra terceiros. Use quando o usuário pedir "transcrever áudio", "passar o áudio pra texto", "extrair fala desse vídeo", "transcrever o reel", "transcrição do podcast", "que esse áudio tá falando", ou similar. Saída inclui timestamps por segmento + texto limpo concatenado. Detecta automaticamente o idioma se não for especificado. Use também quando um workflow precisar de transcrição como input (ex: criar carrossel baseado em áudio de reel).
---

# /transcrever-audio — Transcrever áudio pra texto

Skill genérica de transcrição. Roda 100% local via faster-whisper (sem custo de API, sem upload, sem dependência de internet depois da primeira execução). Idioma default PT-BR, mas detecta automaticamente.

---

## Quando invocar

- "Transcreva esse áudio"
- "Passa o áudio pra texto"
- "Extrai a fala desse vídeo"
- "Que esse áudio tá falando?"
- "Transcrição do podcast / reel / call"
- Workflow precisa de transcrição como input (ex: criar carrossel baseado em áudio de reel)

## Pré-requisitos

### Python + faster-whisper

```bash
pip install faster-whisper
```

Primeira execução baixa o modelo (~70-150 MB dependendo do tamanho). Modelos disponíveis:

| Modelo | Tamanho | Qualidade PT-BR | Tempo (60s áudio em CPU) |
|---|---|---|---|
| `tiny` | 39 MB | Baixa | ~5s |
| `base` | 74 MB | **Boa** (recomendado) | ~10s |
| `small` | 244 MB | Muito boa | ~30s |
| `medium` | 769 MB | Excelente | ~90s |

Para PT-BR, `base` é o sweet spot. Trocar pra `small` se precisar de mais precisão (nomes próprios, gírias, jargão técnico).

### ffmpeg (opcional)

Se o input for vídeo (.mp4, .mov, .mkv), faster-whisper extrai o áudio sozinho — desde que ffmpeg esteja instalado e no PATH. Já vem na maioria dos sistemas.

---

## Workflow

### Passo 1 · Identificar input

Pergunte (ou descubra pelo contexto):
- **Caminho do arquivo:** ex `dados/audio.mp3`, `videos/reel.mp4`
- **Idioma esperado:** PT-BR (default), EN, ES, ou autodetect (`None`)
- **Onde salvar:** ex `saidas/transcricao.md` (default na mesma pasta do input)

### Passo 2 · Rodar a transcrição

```python
from faster_whisper import WhisperModel

model = WhisperModel('base', device='cpu', compute_type='int8')
segments, info = model.transcribe(
    'caminho/do/audio.mp3',
    language='pt',          # ou None pra auto-detect
    beam_size=5,
    vad_filter=True,        # filtra silêncios — melhora qualidade
)

print(f'lang={info.language} prob={info.language_probability:.2f} dur={info.duration:.1f}s')

full = []
for seg in segments:
    print(f'[{seg.start:6.2f} - {seg.end:6.2f}]  {seg.text.strip()}')
    full.append(seg.text.strip())

print('FULL: ' + ' '.join(full))
```

### Passo 3 · Limpar transcrição (importante)

Whisper às vezes troca palavras parecidas, especialmente:
- Nomes próprios ("Lisbô" → "Lisboa", "Tagino" → "Tabino", etc.)
- Jargão técnico ("coworking" → "coorquem")
- Termos regionais ("rolês" → "Romés")

**Sempre revisar** a transcrição bruta antes de usar. Mostre ao usuário side-by-side a versão bruta e a versão limpa pra confirmar correções.

### Passo 4 · Salvar saída

Estrutura recomendada do arquivo `transcricao.md`:

```markdown
# Transcrição — <nome do arquivo>

> Fonte: <caminho>
> Duração: <X>s · Idioma: <pt-BR> · Engine: faster-whisper (<modelo>, int8)

## Transcrição bruta (timecoded)

```
[ 0.00 - 10.56]  ...
[10.56 - 19.16]  ...
```

## Roteiro estruturado (limpo)

> Versão com correções de nomes próprios, pontuação e quebras lógicas.

**Bloco 1 · 0-10s**
> ...

**Bloco 2 · 10-19s**
> ...

## Notas

- Whisper trocou "X" → "Y" (corrigido)
- ...
```

---

## Casos de uso comuns

1. **Reel → carrossel**: transcrição vira base do roteiro do carrossel de suporte
2. **Podcast → newsletter**: transcrição vira draft de artigo escrito
3. **Call de cliente → ata**: transcrição vira summary + action items
4. **Aula / palestra → resumo**: transcrição vira material de estudo

---

## Privacidade

Tudo roda **local** no seu computador:
- Áudio nunca sai da máquina
- Nenhuma API externa é chamada
- Modelo baixa uma vez e fica em `~/.cache/huggingface/hub/`

Diferença vs OpenAI Whisper API: API é mais rápida e tem modelo melhor (large), mas você paga por minuto + envia áudio pro servidor da OpenAI. Pra material confidencial (calls de cliente, briefings), **sempre use local**.

---

## Limites + dicas

- **Áudio muito ruidoso:** subir pro `small` ou `medium`. Vale também rodar com `vad_filter=True` (já tá no default).
- **Áudio multilíngue:** Whisper detecta automaticamente. Se for português intercalado com inglês (comum em tech), use `language=None`.
- **Vídeos longos (> 30 min):** prefere processar em chunks de 5-10 min e concatenar.
- **Resultado decepcionante:** tentar `model_size='medium'` antes de desistir. CPU vai ficar 5-10× mais lento, mas qualidade pula muito.
