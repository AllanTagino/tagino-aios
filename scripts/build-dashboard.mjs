#!/usr/bin/env node
/**
 * Tagino_AIOS · build-dashboard
 * Scaneia o workspace e gera dashboard/data.js — o arquivo de dados
 * que o dashboard/index.html lê pra mostrar o estado real do projeto.
 *
 * Uso:
 *   node scripts/build-dashboard.mjs
 *
 * Sem dependências externas — só Node 18+.
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { execFileSync } from "node:child_process";
import { platform } from "node:os";

const ROOT = process.cwd();
const log = (m) => process.stdout.write(m + "\n");

// ── ZIP helper ──
// Browsers refusam download attribute em file:// origin, entao bulk
// download nao funciona. Solucao: pre-empacotar slides em .zip que
// o browser nao consegue exibir inline e portanto baixa.
// Windows: usa PowerShell Compress-Archive (built-in, sem dep externa).
// Mac/Linux: tenta `zip` (geralmente instalado).
const makeZip = (sourceFiles, zipPath) => {
  if (sourceFiles.length === 0) return false;
  try {
    if (platform() === "win32") {
      const args = [
        "-NoProfile", "-NonInteractive", "-Command",
        `Compress-Archive -Path @(${sourceFiles.map((f) => `'${f.replace(/'/g, "''")}'`).join(",")}) -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force`,
      ];
      execFileSync("powershell", args, { stdio: "pipe" });
    } else {
      // -j junk paths (so o filename, sem estrutura de pasta)
      execFileSync("zip", ["-j", "-q", zipPath, ...sourceFiles], { stdio: "pipe" });
    }
    return true;
  } catch (e) {
    log(`  ⚠ ZIP falhou: ${e.message}`);
    return false;
  }
};

// ── helpers ──
// Normaliza BOM (UTF-8 BOM em arquivos editados no Windows) e CRLF → LF
// pra que os regexes funcionem em qualquer plataforma.
const read = (p) => {
  try {
    return readFileSync(p, "utf8").replace(/^﻿/, "").replace(/\r\n/g, "\n");
  } catch {
    return null;
  }
};
const exists = (p) => existsSync(p);
const lsDir  = (p) => { try { return readdirSync(p, { withFileTypes: true }); } catch { return []; } };
const mtime  = (p) => { try { return statSync(p).mtime; } catch { return null; } };
const today  = new Date().toISOString().slice(0, 10);
const fmtDate = (d) => (d ? d.toISOString().slice(0, 10) : "—");

// ── gallery generator pra carrosseis ──
// Substitui o listing DOS de pasta quando o usuario clica numa peca
// de marketing no dashboard. Gera <folder>/gallery.html com o mesmo
// visual do dashboard (tokens neutros, serif Iowan, sans Inter).
//
// Detecta carrossel pela presenca de instagram/slide-*.png OU bg/slide-*.jpg.
// Idempotente — sempre sobrescreve com a versao mais recente do template.
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));

const buildCarrosselGallery = (folderAbsPath, folderName) => {
  // Detectar slides — preferir instagram/ (final export) sobre bg/ (raws)
  const igDir = join(folderAbsPath, "instagram");
  const bgDir = join(folderAbsPath, "bg");
  let slides = [];
  let slidesDirRel = "";
  if (exists(igDir)) {
    slides = lsDir(igDir)
      .filter((e) => e.isFile() && /\.(png|jpe?g)$/i.test(e.name))
      .map((e) => e.name)
      .sort();
    slidesDirRel = "instagram/";
  } else if (exists(bgDir)) {
    slides = lsDir(bgDir)
      .filter((e) => e.isFile() && /\.(png|jpe?g)$/i.test(e.name))
      .map((e) => e.name)
      .sort();
    slidesDirRel = "bg/";
  }
  if (slides.length === 0) return; // nao eh carrossel, pular

  // Empacota slides num .zip pra download confiavel (browsers nao
  // baixam multiplos arquivos de file:// origin)
  const slidesAbsDir = join(folderAbsPath, slidesDirRel);
  const slideAbsPaths = slides.map((s) => join(slidesAbsDir, s));
  const zipPath = join(folderAbsPath, "slides.zip");
  const zipOk = makeZip(slideAbsPaths, zipPath);

  // Legenda (caption pra IG/FB)
  const legenda = read(join(folderAbsPath, "legenda.md")) || "";

  // Meta
  const niceName = folderName
    .replace(/^carrossel[-_]?/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+\d{4}\s+\d{2}\s+\d{2}$/, ""); // remove data do fim
  const dateMatch = folderName.match(/(\d{4})[-_](\d{2})[-_](\d{2})/);
  const dateStr = dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` : "";
  const slideCount = slides.length;

  const slidesHtml = slides
    .map(
      (name, i) => `
      <a class="slide" href="${escapeHtml(slidesDirRel + name)}" target="_blank" rel="noopener" title="Abrir slide ${i + 1} em tamanho cheio">
        <div class="slide-thumb"><img src="${escapeHtml(slidesDirRel + name)}" alt="Slide ${i + 1}" loading="lazy"></div>
        <div class="slide-meta"><span class="slide-num">${String(i + 1).padStart(2, "0")}</span><span class="slide-name">${escapeHtml(name)}</span></div>
      </a>`
    )
    .join("");

  const legendaHtml = legenda
    ? `<pre class="legenda-text" id="legenda-text">${escapeHtml(legenda)}</pre>`
    : `<div class="legenda-empty">Nenhuma legenda em <code>legenda.md</code> ainda.</div>`;

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Carrossel · ${escapeHtml(niceName)} · Tagino_AIOS</title>
<style>
  :root {
    --bg: #F5F1E8; --paper: #FBF8F1; --ink: #15140F; --ink-soft: #4A4742; --ink-mute: #8A857B;
    --line: #E5DECC; --line-soft: #EFEADC; --accent: #6B4A2F; --ok: #4F6B3A;
    --radius: 4px;
    --serif: ui-serif, 'Iowan Old Style', 'Georgia', 'Times New Roman', serif;
    --sans: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', system-ui, sans-serif;
    --mono: ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--ink); font-family: var(--sans); font-size: 14px; line-height: 1.45; -webkit-font-smoothing: antialiased; }
  .wrap { max-width: 1240px; margin: 0 auto; padding: 32px 28px 64px; }
  .topbar { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; padding-bottom: 22px; border-bottom: 1px solid var(--line); margin-bottom: 28px; }
  .brand { display: flex; align-items: baseline; gap: 14px; }
  .brand-mark { font-family: var(--serif); font-size: 26px; letter-spacing: -0.01em; }
  .brand-mark .dot { color: var(--accent); }
  .brand-sub { color: var(--ink-mute); font-size: 12px; font-family: var(--mono); letter-spacing: 0.04em; }
  .back-link { font-family: var(--mono); font-size: 12px; color: var(--ink-soft); text-decoration: none; padding: 6px 10px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--paper); transition: all 0.15s; }
  .back-link:hover { color: var(--ink); border-color: var(--ink-mute); }
  h1 { font-family: var(--serif); font-size: 32px; line-height: 1.15; font-weight: 400; margin: 0 0 6px; letter-spacing: -0.01em; }
  .kicker { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--ink-mute); margin-bottom: 8px; }
  .meta-row { display: flex; gap: 18px; color: var(--ink-mute); font-size: 13px; margin-bottom: 32px; }
  .meta-row span strong { color: var(--ink); font-weight: 500; }
  .section-head { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--ink-mute); margin: 36px 0 14px; padding-bottom: 8px; border-bottom: 1px solid var(--line-soft); }
  .slides-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 8px; }
  @media (max-width: 760px) { .slides-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px) { .slides-grid { grid-template-columns: 1fr; } }
  .slide { display: block; text-decoration: none; color: inherit; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; transition: all 0.15s; }
  .slide:hover { border-color: var(--ink-mute); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(21,20,15,0.06); }
  .slide-thumb { background: #fff; aspect-ratio: 1080 / 1350; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .slide-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .slide-meta { display: flex; align-items: baseline; gap: 10px; padding: 10px 12px; border-top: 1px solid var(--line); background: var(--paper); font-family: var(--mono); font-size: 11px; }
  .slide-num { color: var(--accent); font-weight: 600; }
  .slide-name { color: var(--ink-mute); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .legenda-card { background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); padding: 20px 22px; margin-bottom: 8px; }
  .legenda-text { font-family: var(--sans); font-size: 14px; line-height: 1.55; color: var(--ink); white-space: pre-wrap; word-wrap: break-word; margin: 0; }
  .legenda-empty { color: var(--ink-mute); font-style: italic; font-size: 13px; }
  .legenda-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--line-soft); }
  .btn { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; padding: 8px 14px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--bg); color: var(--ink-soft); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s; }
  .btn:hover { color: var(--ink); border-color: var(--ink-mute); }
  .btn-ok { color: var(--ok); border-color: var(--ok); }
  .btn-primary { background: var(--ink); color: var(--paper); border-color: var(--ink); }
  .btn-primary:hover { color: #fff; border-color: var(--ink); background: var(--accent); }
  .actions { display: flex; gap: 12px; flex-wrap: wrap; }
  .footer { margin-top: 48px; padding-top: 18px; border-top: 1px solid var(--line); color: var(--ink-mute); font-family: var(--mono); font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; }
</style>
</head>
<body>
<div class="wrap">
  <div class="topbar">
    <div class="brand">
      <div class="brand-mark">Tagino_AIOS<span class="dot">.</span></div>
      <div class="brand-sub">— produção</div>
    </div>
    <a class="back-link" href="../../../dashboard/index.html">← voltar ao dashboard</a>
  </div>

  <div class="kicker">Carrossel</div>
  <h1>${escapeHtml(niceName)}</h1>
  <div class="meta-row">
    <span><strong>${slideCount}</strong> slides</span>
    ${dateStr ? `<span><strong>${escapeHtml(dateStr)}</strong> · data</span>` : ""}
    <span><strong>Instagram</strong> · 1080×1350</span>
  </div>

  <div class="section-head">Slides</div>
  <div class="slides-grid">${slidesHtml}
  </div>

  <div class="section-head">Legenda</div>
  <div class="legenda-card">
    ${legendaHtml}
    ${legenda ? `<div class="legenda-actions">
      <button class="btn" id="download-legenda-btn" type="button">📥 Baixar .txt</button>
      <button class="btn" id="copy-btn" type="button">📋 Copiar legenda</button>
    </div>` : ""}
  </div>

  <div class="section-head">Ações</div>
  <div class="actions">
    ${zipOk ? `<a class="btn btn-primary" href="slides.zip" download="${escapeHtml(folderName)}-slides.zip">📥 Baixar slides (.zip · ${slideCount} arquivos)</a>` : `<button class="btn" id="download-fallback" type="button" disabled title="ZIP nao foi gerado nesse build">📥 ZIP indisponivel — abre a pasta</button>`}
    <a class="btn" href="." target="_blank" rel="noopener">📂 Abrir pasta</a>
    <a class="btn" href="../../../dashboard/index.html">← Voltar ao dashboard</a>
  </div>

  <div class="footer">gerado por scripts/build-dashboard.mjs · ${today}</div>
</div>
<script>
  // Copiar legenda pro clipboard
  const txt = document.getElementById('legenda-text');
  const copyBtn = document.getElementById('copy-btn');
  if (copyBtn && txt) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(txt.textContent || '');
        const orig = copyBtn.textContent;
        copyBtn.textContent = '✓ Copiado';
        copyBtn.classList.add('btn-ok');
        setTimeout(() => { copyBtn.textContent = orig; copyBtn.classList.remove('btn-ok'); }, 1800);
      } catch (e) {
        copyBtn.textContent = '⚠ Erro';
        setTimeout(() => { copyBtn.textContent = '📋 Copiar legenda'; }, 1800);
      }
    });
  }

  // Baixar legenda como .txt via Blob URL (funciona em file:// origin,
  // diferente do <a href download> direto que o browser ignora).
  const dlLegBtn = document.getElementById('download-legenda-btn');
  if (dlLegBtn && txt) {
    dlLegBtn.addEventListener('click', () => {
      const blob = new Blob([txt.textContent || ''], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'legenda.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 200);
      const orig = dlLegBtn.textContent;
      dlLegBtn.textContent = '✓ Baixado';
      dlLegBtn.classList.add('btn-ok');
      setTimeout(() => { dlLegBtn.textContent = orig; dlLegBtn.classList.remove('btn-ok'); }, 1800);
    });
  }
</script>
</body>
</html>
`;

  writeFileSync(join(folderAbsPath, "gallery.html"), html);
};

// ── CLAUDE.md ──
const claude = read(join(ROOT, "CLAUDE.md")) || "";

const matchOne = (re) => {
  const m = claude.match(re);
  return m ? m[1].trim() : null;
};

// Profile: "Perfil aplicado: **Solopreneur**" ou variantes
const profile =
  matchOne(/Perfil aplicado:\s*\*\*([^*]+?)\*\*/i) ||
  matchOne(/Perfil aplicado:\s*([^\n.]+)/i) ||
  "—";

// Owner + headline: o /instalar pode deixar 1 ou 2 H1s no CLAUDE.md.
// Caso A — template original intacto: H1[0] = "Tagino_AIOS — Sistema..." + H1[1] = "<Owner> — ..."
// Caso B — /instalar reescreveu o H1 original: existe só H1[0] = "<Owner> — ..."
// Filtra qualquer H1 que casa com o template generico e pega o primeiro restante.
let owner = "—";
const headings = [...claude.matchAll(/(?:^|\n)# ([^\n]+)/g)].map((m) => m[1].trim());
const candidates = headings.filter((h) => !/Tagino_?AIOS\s*[—-]\s*Sistema/i.test(h));
if (candidates.length > 0) {
  // Estrutura tipica: "<Owner> — <System> · <Contexto>" ou "<Owner> · <Contexto>"
  owner = candidates[0].split(/\s+[—·]\s+/)[0].trim();
}

// ── workspace ──
const workspaceName = basename(ROOT);

// Lead: primeiro parágrafo descritivo após o H1 do usuário (não o do template).
// Aceita callouts (`>`), só remove o marcador.
let lead = "";
const userHeading = candidates[0] || "";
if (userHeading) {
  const idx = claude.indexOf("# " + userHeading);
  if (idx >= 0) {
    const tail = claude.slice(idx + userHeading.length + 2);
    const paragraphs = tail.split(/\n{2,}/).map((p) => p.trim());
    const usefulPara = paragraphs.find((p) => {
      if (!p) return false;
      if (p.startsWith("#")) return false;
      const stripped = p.replace(/^>\s*/gm, "").replace(/\s+/g, " ").trim();
      return stripped.length > 60;
    });
    if (usefulPara) {
      lead = usefulPara
        .replace(/^>\s*/gm, "")
        .replace(/\*\*/g, "")
        .replace(/\s+/g, " ")
        .trim();
      if (lead.length > 280) lead = lead.slice(0, 277) + "…";
    }
  }
}
if (!lead) {
  lead =
    "Esse workspace é seu sistema operacional. Memória, identidade, skills e produção em um só lugar. Rode /instalar pra começar.";
}

// Headline: tirar a parte do "Tagino_AIOS · " e ficar com o contexto significativo
let headline = "";
if (userHeading) {
  const parts = userHeading.split(/\s+—\s+/);
  let after = parts.length > 1 ? parts.slice(1).join(" — ") : userHeading;
  after = after.replace(/^Tagino[_ ]?IOS\s*[·:]?\s*/i, "").trim();
  headline = after || userHeading;
}
if (!headline) {
  headline = profile !== "—" ? `Workspace ativo · perfil ${profile}.` : "Workspace ativo.";
}

// ── setup (memory files) ──
const checkMem = (path, label, fallbackMeta) => {
  const full = join(ROOT, path);
  if (!exists(full))
    return { file: path, label, status: "miss", meta: `Pendente — ${fallbackMeta}` };
  const content = read(full) || "";
  const tooSmall = content.length < 800;
  const looksTemplate =
    /\[Resumo de uma linha/i.test(content) ||
    /\[preencher\]/i.test(content) ||
    /TODO:/i.test(content);
  if (tooSmall || looksTemplate)
    return { file: path, label, status: "pend", meta: "Aguarda preenchimento (/instalar)" };
  // Primeiro parágrafo descritivo
  const firstPara = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .find((p) => p && !p.startsWith("#") && !p.startsWith(">"));
  let m = (firstPara || "").replace(/\s+/g, " ").trim().slice(0, 70);
  if (firstPara && firstPara.length > 70) m += "…";
  return { file: path, label, status: "ok", meta: m || fallbackMeta };
};

const setup = [
  checkMem("_memoria/empresa.md", "Empresa", "quem você é e o que faz"),
  checkMem("_memoria/preferencias.md", "Preferências", "tom de voz e estilo"),
  checkMem("_memoria/estrategia.md", "Estratégia", "foco e prioridades"),
  checkMem("identidade/design-guide.md", "Identidade", "paleta, tipografia, logo"),
];
// Logo assets
[
  ["identidade/logo.png", "Logo (asset)", "adicionar arquivo PNG"],
  ["identidade/logo-creme.png", "Logo claro", "versão pra fundo escuro"],
].forEach(([p, label, note]) => {
  if (!exists(join(ROOT, p))) {
    setup.push({ file: p, label, status: "miss", meta: `Pendente — ${note}` });
  } else {
    setup.push({ file: p, label, status: "ok", meta: "Presente" });
  }
});

// ── identity (parse hex codes from design-guide.md) ──
const guide = read(join(ROOT, "identidade/design-guide.md")) || "";
const hexFound = [
  ...new Set((guide.match(/#[0-9A-Fa-f]{6}\b/g) || []).map((h) => h.toUpperCase())),
].slice(0, 5);
const swatches =
  hexFound.length >= 4
    ? hexFound.map((h, i) => ({ name: `Cor ${i + 1}`, hex: h, role: "" }))
    : [
        { name: "Cor 1", hex: "#E5DECC", role: "Aguardando identidade" },
        { name: "Cor 2", hex: "#D9D2BF", role: "Aguardando identidade" },
        { name: "Cor 3", hex: "#CFC8B5", role: "Aguardando identidade" },
        { name: "Cor 4", hex: "#BFB7A2", role: "Aguardando identidade" },
        { name: "Cor 5", hex: "#A89F87", role: "Aguardando identidade" },
      ];

const brandToken = owner !== "—" ? owner.split(/\s+/)[0] : "";
const wordmarkSample = brandToken ? brandToken.toUpperCase() : "SUA MARCA";
const brand = {
  pill: brandToken ? brandToken.toUpperCase() : "SUA MARCA",
  title: brandToken ? brandToken.toLowerCase() : "sua marca",
};

// ── strategy ──
const estrat = read(join(ROOT, "_memoria/estrategia.md")) || "";
let stratHeadline = "Defina o foco em _memoria/estrategia.md.";
let frentes = [];
let targetNum = "—";
let targetLbl = "Meta-norte do seu negócio";
if (estrat.length > 600) {
  const faseM = estrat.match(/## Fase\s*\n+([^\n#][^\n]+)/);
  if (faseM) stratHeadline = faseM[1].replace(/\*\*/g, "").trim();
  // Frentes ativas (numeradas) — aceita "**Frentes ativas:**" ou "Frentes ativas:"
  const frBlock = estrat.match(/Frentes ativas[^\n]*\n([\s\S]*?)(?:\n##|\n#|$)/i);
  if (frBlock) {
    const items = [...frBlock[1].matchAll(/^\s*\d+\.\s+\*\*([^*]+)\*\*\s*[—-]\s*(.+?)$/gm)];
    frentes = items.map((m) => ({ title: m[1].trim(), note: m[2].trim() })).slice(0, 4);
  }
  // Meta numerica explícita ("meta interna **800 unidades**")
  const targetM = estrat.match(/meta[^.\n]*?\*\*([0-9.,]+)\s+([^\n*]+?)\*\*/i);
  if (targetM) {
    targetNum = targetM[1].replace(/\./g, "");
    targetLbl = targetM[2].trim() + " · meta-norte";
  }
}
if (frentes.length === 0) frentes = [{ title: "—", note: "preencha _memoria/estrategia.md" }];
const strategy = { headline: stratHeadline, targetNum, targetLbl, frentes };

// ── skills (.claude/skills/*/SKILL.md) ──
// Parser de YAML frontmatter — só pra extrair "description", incluindo
// formato block-scalar (description: > ou |) com continuação indentada.
const parseFrontmatterDesc = (fmBody) => {
  const lines = fmBody.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^description:\s*(.*)$/);
    if (!m) continue;
    const first = m[1].trim();
    // Block scalar — coletar linhas indentadas seguintes
    if (first === ">" || first === "|" || first === "") {
      const collected = [];
      for (let j = i + 1; j < lines.length; j++) {
        const l = lines[j];
        // Próxima chave top-level (não-indentada, com `key:`) encerra o bloco
        if (/^[A-Za-z_][\w-]*:/.test(l)) break;
        if (l.trim() === "") {
          // Linha em branco — em folded scalar isso significa quebra forte;
          // continuar coletando se vier mais conteúdo indentado
          continue;
        }
        collected.push(l.trim());
      }
      return collected.join(" ");
    }
    // Inline value — pode ter aspas opcionais
    return first.replace(/^["'](.*)["']$/, "$1");
  }
  return "";
};

const skillsDir = join(ROOT, ".claude/skills");
const skills = [];
for (const entry of lsDir(skillsDir)) {
  if (!entry.isDirectory()) continue;
  const md = read(join(skillsDir, entry.name, "SKILL.md"));
  if (!md) continue;
  const fm = md.match(/^---\n([\s\S]*?)\n---/);
  const desc = fm ? parseFrontmatterDesc(fm[1]).replace(/\s+/g, " ").trim() : "";
  const short = desc.length > 90 ? desc.slice(0, 87) + "…" : desc;
  skills.push({
    name: "/" + entry.name,
    folder: entry.name,
    scope: "local",
    desc: short || "(sem descrição em SKILL.md)",
    long: desc || "Veja SKILL.md pra detalhes.",
    examples: [`/${entry.name}`, `rodar ${entry.name}`],
    output: "Veja SKILL.md pra detalhes",
  });
}
skills.sort((a, b) => a.name.localeCompare(b.name));

// ── expand.mcps (parse "Ferramentas conectadas" checklist do CLAUDE.md) ──
const mcpDefs = [
  { name: "Instagram", note: "Publicação automática via Graph API" },
  { name: "WhatsApp Business", note: "Atendimento + envio de material via Cloud API" },
  { name: "Meta Ads", note: "Criação e leitura de campanhas via Marketing API" },
  { name: "Google Ads", note: "Criação e métricas via OAuth" },
  { name: "Google Calendar", note: "Agendamento automático de reuniões" },
];
const mcps = mcpDefs.map((m) => {
  const escaped = m.name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const re = new RegExp(`-\\s*\\[(x| )\\]\\s*${escaped}`, "i");
  const match = claude.match(re);
  return { ...m, status: match && match[1].toLowerCase() === "x" ? "connected" : "available" };
});

// ── expand.templates ──
const templates = [];
const tplFiles = [
  { path: "templates/ferramentas/catalogo.md", title: "Catálogo de ferramentas", note: "APIs, CLIs e conectores disponíveis pra skills" },
  { path: "templates/identidade/exemplos/",   title: "Exemplos de identidade",   note: "Design guides de referência por perfil" },
  { path: "templates/perfis/",                title: "Perfis de CLAUDE.md",      note: "Solopreneur · Freelancer · Agência · Empresa" },
  { path: "templates/skills/catalogo.md",     title: "Catálogo de skills",       note: "Skills sugeridas como ponto de partida" },
];
for (const t of tplFiles) {
  if (exists(join(ROOT, t.path))) templates.push(t);
}

// ── output (saidas/, marketing/conteudo/, site/) ──
// Pra cada peça produzida calculamos um `viewUrl` que aponta pra
// preview decente em vez de jogar o usuario num listing DOS de pasta:
//   1. gallery.html (gerada por nos pra carrosseis — ver buildGallery)
//   2. index.html (ja existe pra sites/landings)
//   3. folder/ (fallback DOS)
const output = [];
const resolveViewUrl = (folderAbsPath, relPath) => {
  if (exists(join(folderAbsPath, "gallery.html"))) return relPath + "gallery.html";
  if (exists(join(folderAbsPath, "index.html"))) return relPath + "index.html";
  return relPath;
};
const scanFlat = (dir, type) => {
  const base = join(ROOT, dir);
  if (!exists(base)) return;
  for (const entry of lsDir(base)) {
    if (entry.name.startsWith(".") || entry.name === "README.md") continue;
    const full = join(base, entry.name);
    let path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) path += "/";
    const viewUrl = entry.isDirectory() ? resolveViewUrl(full, path) : path;
    output.push({
      type,
      name: entry.name.replace(/[-_]/g, " ").replace(/\.[a-z]+$/i, ""),
      path,
      viewUrl,
      date: fmtDate(mtime(full)),
    });
  }
};
scanFlat("saidas", "Saída");
const marketingConteudo = join(ROOT, "marketing/conteudo");
if (exists(marketingConteudo)) {
  for (const entry of lsDir(marketingConteudo)) {
    if (entry.name.startsWith(".")) continue;
    if (entry.isDirectory()) {
      const full = join(marketingConteudo, entry.name);
      // Auto-gera gallery.html pra carrosseis (detecta por presenca
      // de instagram/slide-*.png ou bg/slide-*.jpg)
      buildCarrosselGallery(full, entry.name);
      const relPath = `marketing/conteudo/${entry.name}/`;
      output.push({
        type: "Marketing",
        name: entry.name.replace(/[-_]/g, " "),
        path: relPath,
        viewUrl: resolveViewUrl(full, relPath),
        date: fmtDate(mtime(full)),
      });
    }
  }
}
scanFlat("site", "Site");
output.sort((a, b) => b.date.localeCompare(a.date));

// ── actions (sugestões inteligentes) ──
const actions = [];
const missing = setup.filter((s) => s.status !== "ok");
if (missing.length > 0) {
  actions.push({
    text: "Completar o setup inicial",
    note: `${missing.length} item(s) pendente(s) — ${missing.map((s) => s.label).join(", ")}`,
    cmd: "/instalar",
  });
}
if (skills.length > 0 && output.length === 0) {
  actions.push({
    text: "Produzir o primeiro conteúdo",
    note: "use /carrossel ou /publicar-tema pra gerar peça pronta",
    cmd: "/carrossel",
  });
}
if (output.length > 0) {
  actions.push({
    text: "Aprovar e publicar conteúdo",
    note: `${output.length} peça(s) na pasta de produção`,
    cmd: "/aprovar-post",
  });
}
actions.push({
  text: "Mapear o que dá pra automatizar",
  note: "descobre rotinas que podem virar skill",
  cmd: "/mapear-rotinas",
});
actions.push({
  text: "Salvar tudo no GitHub",
  note: "commit + push + deploy automático",
  cmd: "/salvar",
});

// ── final ──
const data = {
  workspace: { name: workspaceName, profile, owner, today, headline, lead },
  setup,
  identity: {
    brand,
    swatches,
    type: [
      { key: "Display",  sample: "Tipografia da sua marca.",                                family: "serif" },
      { key: "Wordmark", sample: wordmarkSample,                                            family: "pill" },
      { key: "Corpo",    sample: "Edite identidade/design-guide.md pra ajustar o tipo aqui.", family: "sans" },
    ],
  },
  strategy,
  skills,
  expand: { mcps, templates },
  output,
  actions: actions.slice(0, 4),
};

const dataJs = `/* ──────────────────────────────────────────────────────────────────
   Dashboard data — gerado em ${today} por scripts/build-dashboard.mjs

   NÃO editar à mão. Pra atualizar, rode novamente:
     node scripts/build-dashboard.mjs
   Esse arquivo é gitignored — cada workspace tem o seu.
   ────────────────────────────────────────────────────────────────── */
window.DASHBOARD_DATA = ${JSON.stringify(data, null, 2)};
`;

const target = join(ROOT, "dashboard", "data.js");
writeFileSync(target, dataJs, "utf8");

const okCount = setup.filter((s) => s.status === "ok").length;
log(`✓ dashboard/data.js gerado`);
log(`  · ${okCount}/${setup.length} arquivos de memória preenchidos`);
log(`  · ${skills.length} skills`);
log(`  · ${output.length} peça(s) produzida(s)`);
log(`  · ${mcps.filter((m) => m.status === "connected").length}/${mcps.length} MCPs conectados`);
log("");
log("  Abra: dashboard/index.html  (ou dashboard.html na raiz)");
