# Atualiza o site no Netlify a partir do HTML fonte em saidas/.
#
# Pre-requisito: site Netlify ja criado e linkado.
#   1. netlify login
#   2. netlify sites:create --name <seu-site>
#      (copia o "Project ID" que ele devolve)
#   3. Salva o ID na variavel de ambiente $env:TAGINO_NETLIFY_SITE_ID
#      ou edita a linha abaixo com seu ID.
#
# Uso: powershell -ExecutionPolicy Bypass -File scripts\deploy-web.ps1

$root = Split-Path -Parent $PSScriptRoot
$src  = Join-Path $root "saidas\instalar-entrevista.html"
$dst  = Join-Path $root "web\index.html"

$siteId = $env:TAGINO_NETLIFY_SITE_ID
if (-not $siteId) {
  Write-Error "Faltou setar `$env:TAGINO_NETLIFY_SITE_ID com o ID do site no Netlify."
  Write-Host "Roda primeiro: netlify sites:create --name <nome-do-seu-site>"
  exit 1
}

if (-not (Test-Path $src)) { Write-Error "Fonte nao encontrada: $src"; exit 1 }

Copy-Item -Path $src -Destination $dst -Force
Write-Host "OK: copiado saidas/instalar-entrevista.html -> web/index.html"

Push-Location $root
try {
  netlify deploy --prod --dir "web" --site $siteId --message "Update entrevista"
} finally {
  Pop-Location
}
