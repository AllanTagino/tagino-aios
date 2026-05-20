---
name: conectar
description: >
  Wizard pra configurar chave de API de qualquer serviço externo (kie.ai/Nano Banana,
  OpenAI, Anthropic, Apify e outros) sem o usuário precisar editar `.env` à mão. Pede
  a chave no chat, **valida com test call ao serviço**, grava no `.env` da raiz, garante
  que `.gitignore` cobre o arquivo. Use quando o usuário disser "conectar openai",
  "configurar chave da X", "/conectar", "como adiciono minha API key", ou quando outra
  skill falhar por falta de chave (ex: `/image-enhancer-aios` pediu kie.ai).
---

# /conectar — Wizard de API keys com validação

Skill que substitui o ritual de "achar `.env`, editar, salvar, esperar funcionar". Aqui o usuário cola a chave no chat, ela é **validada com uma call real ao serviço antes de gravar**, e o arquivo termina certinho com `.gitignore` cobrindo. Resolve o atrito #1 do cliente não-técnico.

---

## Pré-checagem

### 1. `.gitignore` cobre `.env`?

Antes de qualquer coisa, ler `.gitignore` da raiz do workspace. Se `.env` (ou padrão equivalente como `.env*`) **não estiver listado**, parar e mostrar:

> "Antes de gravar chave nenhuma, preciso garantir que o `.env` não vai parar no Git. Vou adicionar `.env` no `.gitignore` da raiz — confirma?"

Adicionar com `Edit`, então seguir.

**Se a pasta não é um repo git** (sem `.git/`), seguir sem checar `.gitignore` — não há risco de leak por commit. Mas avisar:

> "Não tem `.git` aqui, então não vou criar `.gitignore`. Quando virar repo, lembrar de cobrir `.env`."

### 2. Argumento

Aceita `<servico>` opcional como argumento. Serviços conhecidos: `kieai`, `openai`, `anthropic`, `apify`. Se vier qualquer outro nome ou `outro`, segue fluxo genérico.

Sem argumento → listar os 4 + "outro" e perguntar qual.

---

## Cards de serviços conhecidos

Cada card define: nome bonito · var name · onde pegar a chave · como validar.

### `kieai`

| Campo | Valor |
|---|---|
| Nome | kie.ai (Nano Banana Pro / Gemini 2.5 Flash Image) |
| Variável | `KIE_API_KEY` |
| Formato esperado | hex string ~32 chars (sem prefixo padrão) |
| Onde pegar | https://kie.ai/api-key |
| Pré-requisito | Conta no kie.ai com créditos (pay-as-you-go, ~$0.09 por imagem 2K) |
| Test endpoint | `GET https://api.kie.ai/api/v1/chat/credit` (consulta saldo, não consome) |
| Header | `Authorization: Bearer <chave>` |
| Sucesso | HTTP 200 com `{"code":200,"data":{...credit info...}}` |
| Erros | 401/code≠200 = inválida · saldo 0 = primeira call vai falhar (avisar) |
| Usado por | `scripts/nano-banana-enhance.py` + skill `/image-enhancer-aios` |

### `openai`

| Campo | Valor |
|---|---|
| Nome | OpenAI |
| Variável | `OPENAI_API_KEY` |
| Formato esperado | começa com `sk-` (geralmente `sk-proj-...`) |
| Onde pegar | https://platform.openai.com/api-keys |
| Pré-requisito | Billing ativo (cartão + crédito mínimo $5 — sem isso, chave existe mas nada funciona) |
| Test endpoint | `GET https://api.openai.com/v1/models` |
| Header | `Authorization: Bearer <chave>` |
| Sucesso | HTTP 200 com lista de models (não consome créditos) |
| Erros comuns | 401 = chave inválida · 429 = sem billing/rate · 403 = projeto sem permissão |
| Usado por | `/carrossel` Tipo 2 (foto IA) |

### `anthropic`

| Campo | Valor |
|---|---|
| Nome | Anthropic (Claude API direta) |
| Variável | `ANTHROPIC_API_KEY` |
| Formato | começa com `sk-ant-` |
| Onde pegar | https://console.anthropic.com/settings/keys |
| Test endpoint | `GET https://api.anthropic.com/v1/models` |
| Headers | `x-api-key: <chave>` + `anthropic-version: 2023-06-01` |
| Sucesso | HTTP 200 |
| Erros | 401 = inválida · 403 = sem créditos |
| Usado por | Skills que chamam Claude API diretamente (raras — a maioria usa o Claude Code próprio) |

### `apify`

| Campo | Valor |
|---|---|
| Nome | Apify (web scraping) |
| Variável | `APIFY_API_TOKEN` |
| Formato | string alfanumérica longa |
| Onde pegar | https://console.apify.com/account/integrations |
| Test endpoint | `GET https://api.apify.com/v2/users/me?token=<chave>` |
| Sucesso | HTTP 200 com `{ "data": { "id": ..., "username": ... } }` |
| Erros | 401 = inválida |
| Usado por | Scrapers customizados, eventualmente skill que use Apify direto |

### `outro`

Fluxo genérico — pra quando o serviço não tá nos cards acima:

1. Perguntar nome amigável (ex: "Resend", "Stripe Test")
2. Perguntar nome da variável de ambiente (ex: `RESEND_API_KEY`)
3. Perguntar URL de teste opcional (ex: `https://api.resend.com/api-keys`)
4. Perguntar header de auth (default: `Authorization: Bearer <chave>`)
5. Se forneceu URL de teste → validar; senão → gravar com warning "sem validação"

---

## Workflow

### Passo 1 — Identificar serviço

Se argumento `<servico>` veio, ir direto pro card. Senão:

> "Que serviço você quer conectar?
> 1. kie.ai (Nano Banana Pro — enhance/edit imagens) — `KIE_API_KEY`
> 2. OpenAI (gera fotos IA, transcrições) — `OPENAI_API_KEY`
> 3. Anthropic (Claude API direto) — `ANTHROPIC_API_KEY`
> 4. Apify (web scraping) — `APIFY_API_TOKEN`
> 5. Outro (qualquer chave simples)"

### Passo 2 — Onde pegar (orientação)

Mostrar o link do card + 1 frase do pré-requisito (ex: "lembra que OpenAI exige billing ativo — sem cartão + $5, a chave não funciona").

Esperar.

### Passo 3 — Coletar a chave

> "Cola a chave aqui. (Não vai aparecer em log — só vai pro `.env` local desse projeto.)"

Receber a chave do usuário.

**Validações leves antes da call:**
- OpenAI: começa com `sk-` (senão, perguntar "essa chave começa com `sk-`? Confere antes de continuar")
- Anthropic: começa com `sk-ant-`
- Outros: só checar tamanho mínimo razoável (≥ 20 chars)

### Passo 4 — Validar com call real

Rodar o test endpoint do card via Python (mais portable que curl em Windows):

```python
import urllib.request, urllib.error, json, sys
chave = "<chave>"
req = urllib.request.Request(
    "<endpoint>",
    headers={"<header-name>": "<header-value-com-chave>", ...}
)
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        body = resp.read().decode()[:500]
        print(f"OK {resp.status}: {body[:200]}")
except urllib.error.HTTPError as e:
    print(f"FAIL {e.code}: {e.read().decode()[:300]}")
except Exception as e:
    print(f"FAIL {type(e).__name__}: {e}")
```

**Nunca echoar a chave no comando.** Passar via stdin ou env var temporária.

**Tratamento de erro por código:**

| HTTP | Mensagem pro usuário |
|---|---|
| 200 | "✓ Chave válida. Vou gravar no `.env`." |
| 401 | "Chave inválida ou expirada. Confere se copiou inteira (sem espaço no fim)." |
| 403 | "Chave válida mas sem permissão. No OpenAI geralmente é billing — adiciona $5 de crédito em platform.openai.com/account/billing." |
| 429 | "Rate limit ou billing problema. Confere o limit/balance no dashboard do serviço." |
| 5xx | "Serviço fora do ar agora. Tenta de novo em alguns minutos." |
| timeout | "Não conectou no serviço. Pode ser rede tua." |

**Se falhar:** mostrar erro, perguntar "quer tentar de novo com outra chave?" — NÃO gravar nada.

### Passo 5 — Gravar no `.env`

1. Ler `.env` se existir (Read tool). Se não existir, criar vazio.
2. Verificar se a variável **já existe** no arquivo:
   - **Existe e é a mesma chave** → "Já tá gravada essa mesma chave. Nada a fazer."
   - **Existe e é diferente** → "Já existe `VAR=<últimos-4-chars-antigos>`. Sobrescrever pela nova `<últimos-4-chars-novos>`?"
   - **Não existe** → seguir.
3. Append (ou Edit pra substituir linha existente). Garantir newline final.
4. Confirmar mostrando **só os últimos 4 chars**:
   > "✓ Gravado: `OPENAI_API_KEY=sk-proj-...ABCD` em `.env` (gitignored)."

### Passo 6 — Próximo passo sugerido

Baseado no serviço, dizer o que destrava:

- kie.ai → "Agora `/image-enhancer-aios` + `scripts/nano-banana-enhance.py` rodam. Próximo: `pip install -r scripts/requirements.txt` (uma vez só)."
- OpenAI → "Agora `/carrossel` aceita Tipo 2 (foto IA). Tenta com qualquer tema."
- Anthropic → "Skills que chamam Claude API direta agora funcionam."
- Apify → "Scrapers customizados podem usar essa chave."
- Outro → "Qualquer skill que ler `process.env.VAR` agora encontra."

---

## Regras

- **Nunca logar a chave completa.** Em qualquer ponto que mostrar status: últimos 4 chars apenas.
- **Nunca commitar.** Pré-checagem do `.gitignore` é bloqueante. Se o usuário se recusar a adicionar, REFUSE de gravar e explica o risco.
- **Nunca enviar pra Allan / servidor externo.** A chave é do cliente, fica no .env local, ponto.
- **Test call usa endpoint barato.** `models.list` no OpenAI, `users/me` no Apify — não consome créditos significativos.
- **Idempotente.** Re-rodar `/conectar openai` com mesma chave = no-op. Com chave nova = pergunta antes de sobrescrever.
- **Fluxo genérico ("outro") é último recurso.** Se possível, criar card próprio pra serviços recorrentes em vez de cair no genérico (vira backlog: "essa skill virou popular, adiciona card").
- **Sem `.env.example`.** Não gerar arquivo de exemplo automaticamente — vira ruído. Cliente vê o `.env` real e copia se precisar.
- **OAuth está fora do escopo.** Pra Meta Graph, Google Ads, Calendar etc. (que precisam OAuth flow), a skill mostra:
  > "Esse serviço usa OAuth, não cabe num `/conectar`. O caminho recomendado é instalar o MCP correspondente (`claude mcp add ...`) ou seguir o tutorial dedicado em `referencias/<servico>-setup.md` se existir."

---

## Exemplos

**Caso 1 — primeira vez, cliente sabe qual serviço:**

```
> /conectar openai
"OpenAI exige billing ativo (cartão + ~$5 crédito). Pega a chave em platform.openai.com/api-keys.
 Cola aqui:"
[cliente cola sk-proj-abc...]
"Testando..."
"✓ Válida. Gravado: OPENAI_API_KEY=sk-proj-...wXyZ em .env (gitignored)."
"Agora /carrossel aceita Tipo 2 (foto IA)."
```

**Caso 2 — não sabe qual serviço:**

```
> /conectar
"Que serviço?
 1. kie.ai · 2. OpenAI · 3. Anthropic · 4. Apify · 5. Outro"
[1]
[segue caso 2b]
```

**Caso 2b — kie.ai (Nano Banana Pro):**

```
> /conectar kieai
"kie.ai (Nano Banana Pro). Pega a chave em https://kie.ai/api-key
 — cobra pay-as-you-go (~$0.09 por imagem 2K). Cola aqui:"
[cliente cola a chave]
"Testando saldo..."
"✓ Válida. Gravado: KIE_API_KEY=...XXXX em .env (gitignored)."
"Agora `/image-enhancer-aios` + `scripts/nano-banana-enhance.py` rodam.
 Próximo: `pip install -r scripts/requirements.txt` (uma vez só)."
```

**Caso 3 — chave errada:**

```
> /conectar openai
[cola algo inválido]
"FAIL 401: Incorrect API key provided"
"Chave inválida. Confere se copiou inteira (sem espaço no fim). Quer tentar de novo?"
```

**Caso 4 — chave com billing problema:**

```
> /conectar openai
[cola sk-proj válida mas sem billing]
"FAIL 429: You exceeded your current quota"
"Chave válida mas sem crédito. Adiciona $5 em platform.openai.com/account/billing e tenta de novo."
```

**Caso 5 — já existe:**

```
> /conectar openai
[cola chave nova]
"Já existe OPENAI_API_KEY=sk-proj-...PqRs. Sobrescrever pela nova sk-proj-...wXyZ?"
[s]
"✓ Substituído."
```

---

## Quando expandir

Adicionar card novo (em vez de cair no fluxo "outro") quando:

- Skill conhecida começa a depender daquele serviço (ex: nova skill `/gerar-thumb` usa Resend pra notificar → adicionar card Resend)
- Cliente perguntar pelo serviço 2+ vezes
- Aparecer no `npm outdated` ou nos plugins do Claude Code do Allan
