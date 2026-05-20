#!/usr/bin/env python3
"""
nano-banana-enhance.py · kie.ai Nano Banana Pro image edit/enhance

Recebe uma ou mais imagens de referencia + prompt + negative prompt opcional,
chama a API do kie.ai (Nano Banana Pro - Gemini 2.5 Flash Image), salva o
resultado no caminho indicado.

Padrao validado em producao na pipeline KARINA (closet renders) — endpoint,
auth, shape de request e parsing de resposta sao os mesmos. Ver
referencias/nano-banana-setup.md no canonical pra detalhes.

Variavel de ambiente requerida:
  KIE_API_KEY=sk-...

Pega em: https://kie.ai/api-key

Uso basico (1 imagem - enhancement / restyle):
  python nano-banana-enhance.py \\
    --input "./imagem.jpg" \\
    --prompt-file "./prompt.txt" \\
    --negative-file "./negative.txt" \\
    --output "./resultado.png"

Uso multi-ref (inpaint com mask, ou referencias de estilo):
  python nano-banana-enhance.py \\
    --input "./base.png" \\
    --ref "./mask.png" \\
    --prompt-file "./prompt.txt" \\
    --output "./resultado.png"

Custo aproximado: $0.09 por chamada @ 2K.
"""
import argparse
import base64
import json
import os
import sys
import time
from io import BytesIO
from pathlib import Path

# python-dotenv eh opcional — env var ja pode estar setada
try:
    from dotenv import load_dotenv, find_dotenv
    load_dotenv(find_dotenv(usecwd=True))
except ImportError:
    pass

try:
    import requests
except ImportError:
    sys.exit(
        "ERRO: pacote `requests` nao instalado.\n"
        "Roda: pip install -r scripts/requirements.txt\n"
        "(Ou: pip install requests pillow python-dotenv)"
    )

try:
    from PIL import Image
except ImportError:
    sys.exit(
        "ERRO: pacote `Pillow` nao instalado.\n"
        "Roda: pip install -r scripts/requirements.txt"
    )


# ──────────────────────────────────────────────────────────
# CONSTANTES (endpoints validados em producao - Karina pipeline)
# ──────────────────────────────────────────────────────────

API_BASE = "https://api.kie.ai/api/v1/jobs"
UPLOAD_URL = "https://kieai.redpandaai.co/api/file-base64-upload"
CREATE_URL = f"{API_BASE}/createTask"
POLL_URL_TEMPLATE = f"{API_BASE}/recordInfo?taskId={{task_id}}"

DEFAULT_MODEL = "nano-banana-pro"
DEFAULT_ASPECT = "16:9"
DEFAULT_RESOLUTION = "2K"  # 2K = ~2688x1520 — sweet spot custo/qualidade
DEFAULT_OUTPUT_FORMAT = "png"
TARGET_2K = (2688, 1520)  # quando aspecto eh 16:9


# ──────────────────────────────────────────────────────────
# HELPERS
# ──────────────────────────────────────────────────────────

def fail(msg, code=1):
    print(f"[ERRO] {msg}", file=sys.stderr)
    sys.exit(code)


def img_to_base64(path, target_size=None):
    """Abre imagem, opcionalmente resize, retorna data URI base64 PNG."""
    img = Image.open(path).convert("RGB")
    original = img.size
    if target_size and img.size != target_size:
        img = img.resize(target_size, Image.LANCZOS)
        print(f"  Resized {os.path.basename(path)}: {original} -> {target_size}")
    buf = BytesIO()
    img.save(buf, format="PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    print(f"  Base64: {len(b64)/1024:.0f} KB")
    return f"data:image/png;base64,{b64}"


def upload_to_kie(data_uri, filename, api_key, upload_path="images/tagino-aios"):
    """Sobe data URI base64 pro file storage do kie.ai, retorna downloadUrl."""
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {
        "base64Data": data_uri,
        "uploadPath": upload_path,
        "fileName": filename,
    }
    r = requests.post(UPLOAD_URL, headers=headers, json=payload, timeout=120)
    j = r.json()
    if not j.get("success") or j.get("code") != 200:
        fail(f"Upload falhou (HTTP {r.status_code}): {j}")
    url = j["data"]["downloadUrl"]
    print(f"  Uploaded: {url}")
    return url


def create_task(image_urls, prompt, negative, api_key, model, aspect, resolution, output_format):
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {
        "model": model,
        "input": {
            "prompt": prompt,
            "image_input": image_urls,
            "aspect_ratio": aspect,
            "resolution": resolution,
            "output_format": output_format,
        },
    }
    if negative:
        payload["input"]["negative_prompt"] = negative

    r = requests.post(CREATE_URL, headers=headers, json=payload, timeout=60)
    data = r.json()
    if data.get("code") != 200:
        fail(f"createTask falhou ({data.get('code')}): {data.get('msg', data)}")
    task_id = data["data"]["taskId"]
    return task_id


def poll_task(task_id, api_key, max_wait=300, interval=5):
    headers = {"Authorization": f"Bearer {api_key}"}
    url = POLL_URL_TEMPLATE.format(task_id=task_id)
    start = time.time()
    last_state = None
    while time.time() - start < max_wait:
        time.sleep(interval)
        try:
            info = requests.get(url, headers=headers, timeout=30).json()
        except Exception as e:
            print(f"  poll err (vai tentar de novo): {e}")
            continue
        if info.get("code") != 200:
            print(f"  poll code != 200: {info}")
            continue
        state = info["data"].get("state", "unknown")
        elapsed = int(time.time() - start)
        if state != last_state:
            print(f"  [{elapsed:3d}s] state={state}")
            last_state = state
        if state == "success":
            return info["data"]
        if state in ("failed", "fail", "error"):
            fail(f"Task falhou: {info['data'].get('failMsg', '(sem msg)')}")
    fail(f"Timeout apos {max_wait}s. Ultimo state: {last_state}")


def extract_result_url(data):
    raw = data.get("resultJson", "{}")
    try:
        parsed = json.loads(raw) if isinstance(raw, str) else raw
    except json.JSONDecodeError:
        fail(f"resultJson nao parseou: {raw[:300]}")
    urls = parsed.get("resultUrls", [])
    if not urls:
        fail(f"Sem resultUrls no payload: {parsed}")
    return urls[0]


def download_image(url, output_path):
    print(f"  Baixando: {url}")
    r = requests.get(url, timeout=120)
    r.raise_for_status()
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(r.content)
    size_kb = os.path.getsize(output_path) / 1024
    print(f"  Salvo: {output_path} ({size_kb:.0f} KB)")


# ──────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--input", required=True, help="Imagem principal de input")
    ap.add_argument("--ref", action="append", default=[], help="Imagens de referencia extras (mask, style ref). Pode repetir.")
    ap.add_argument("--prompt", help="Prompt direto (ou usa --prompt-file)")
    ap.add_argument("--prompt-file", help="Arquivo com o prompt")
    ap.add_argument("--negative", default="", help="Negative prompt direto")
    ap.add_argument("--negative-file", help="Arquivo com negative prompt")
    ap.add_argument("--output", required=True, help="Onde salvar a imagem resultado")
    ap.add_argument("--model", default=DEFAULT_MODEL, help=f"Modelo (default: {DEFAULT_MODEL})")
    ap.add_argument("--aspect", default=DEFAULT_ASPECT, help=f"Aspect ratio (16:9, 9:16, 1:1, 3:2 etc) (default: {DEFAULT_ASPECT})")
    ap.add_argument("--resolution", default=DEFAULT_RESOLUTION, help=f"Resolution (default: {DEFAULT_RESOLUTION})")
    ap.add_argument("--output-format", default=DEFAULT_OUTPUT_FORMAT, choices=["png", "jpeg"])
    ap.add_argument("--no-resize", action="store_true", help="Nao faz resize do input pre-upload (usa tamanho original)")
    ap.add_argument("--upload-path", default="images/tagino-aios", help="Pasta no storage do kie.ai")
    args = ap.parse_args()

    api_key = os.environ.get("KIE_API_KEY")
    if not api_key:
        fail(
            "KIE_API_KEY nao setada.\n"
            "  1. Pega chave em https://kie.ai/api-key\n"
            "  2. Copia .env.example pra .env e cola a chave la (KIE_API_KEY=...)\n"
            "  3. Ou roda `/conectar kieai` no Claude Code que ele faz o setup."
        )

    if not os.path.isfile(args.input):
        fail(f"Input nao existe: {args.input}")

    # Resolver prompt
    if args.prompt_file:
        with open(args.prompt_file, encoding="utf-8") as f:
            prompt = f.read().strip()
    elif args.prompt:
        prompt = args.prompt
    else:
        fail("Passa --prompt ou --prompt-file")

    # Resolver negative
    negative = args.negative or ""
    if args.negative_file and os.path.isfile(args.negative_file):
        with open(args.negative_file, encoding="utf-8") as f:
            negative = f.read().strip()

    # Resize default = 2K se aspect 16:9, senao mantem original
    target_size = None
    if not args.no_resize and args.aspect == "16:9" and args.resolution == "2K":
        target_size = TARGET_2K

    print("=" * 60)
    print(f"kie.ai Nano Banana Pro -- {args.model}")
    print(f"  Key ...{api_key[-4:]}  |  Aspect {args.aspect}  |  Res {args.resolution}")
    print("=" * 60)

    # [1] Encode + upload todas as imagens
    image_urls = []
    inputs = [args.input] + args.ref
    for i, path in enumerate(inputs, 1):
        label = "INPUT" if i == 1 else f"REF{i-1}"
        print(f"\n[{i}] Encoding {label}: {path}")
        uri = img_to_base64(path, target_size=target_size)
        print(f"\n[{i}] Uploading {label}...")
        filename = f"{Path(path).stem}_{int(time.time())}.png"
        url = upload_to_kie(uri, filename, api_key, upload_path=args.upload_path)
        image_urls.append(url)

    # [N+1] Submit
    print(f"\n[{len(inputs)+1}] Submitting task to kie.ai...")
    print(f"  Prompt: {prompt[:100]}{'...' if len(prompt) > 100 else ''}")
    if negative:
        print(f"  Negative: {negative[:100]}{'...' if len(negative) > 100 else ''}")
    task_id = create_task(
        image_urls, prompt, negative, api_key,
        model=args.model, aspect=args.aspect,
        resolution=args.resolution, output_format=args.output_format,
    )
    print(f"  taskId: {task_id}")

    # [N+2] Poll
    print(f"\n[{len(inputs)+2}] Polling...")
    result_data = poll_task(task_id, api_key)
    result_url = extract_result_url(result_data)
    credits = result_data.get("creditsConsumed", "?")

    # [N+3] Download
    print(f"\n[{len(inputs)+3}] Downloading result")
    download_image(result_url, args.output)

    print(f"\n[OK] Done. Creditos: {credits}  |  Custo aprox: $0.09")


if __name__ == "__main__":
    main()
