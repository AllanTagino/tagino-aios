#!/usr/bin/env node
/**
 * Tagino_IOS · build-dashboard
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

const ROOT = process.cwd();
const log = (m) => process.stdout.write(m + "\n");

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

// Owner + headline: o template tem o H1 "Tagino_IOS — Sistema operacional do negócio";
// o /instalar adiciona um segundo H1 com nome do usuário/projeto. Pegar esse segundo.
let owner = "—";
let userHeading = "";
const headings = [...claude.matchAll(/(?:^|\n)# ([^\n]+)/g)].map((m) => m[1].trim());
if (headings.length >= 2) {
  userHeading = headings[1];
  // Estrutura típica: "<Owner> — <System> · <Contexto>" ou "<Owner> · <Contexto>"
  owner = userHeading.split(/\s+[—·]\s+/)[0].trim();
}

// ── workspace ──
const workspaceName = basename(ROOT);

// Lead: primeiro parágrafo descritivo após o H1 do usuário (não o do template).
// Aceita callouts (`>`), só remove o marcador.
let lead = "";
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

// Headline: tirar a parte do "Tagino_IOS · " e ficar com o contexto significativo
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

const wordmarkSample =
  owner !== "—" ? owner.split(/\s+/)[0].toUpperCase() : "SUA MARCA";

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
const output = [];
const scanFlat = (dir, type) => {
  const base = join(ROOT, dir);
  if (!exists(base)) return;
  for (const entry of lsDir(base)) {
    if (entry.name.startsWith(".") || entry.name === "README.md") continue;
    const full = join(base, entry.name);
    let path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) path += "/";
    output.push({
      type,
      name: entry.name.replace(/[-_]/g, " ").replace(/\.[a-z]+$/i, ""),
      path,
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
      output.push({
        type: "Marketing",
        name: entry.name.replace(/[-_]/g, " "),
        path: `marketing/conteudo/${entry.name}/`,
        date: fmtDate(mtime(join(marketingConteudo, entry.name))),
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
