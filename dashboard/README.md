# Dashboard

Painel local do Tagino_IOS — abre com duplo-clique, mostra o estado atual
do workspace numa página única.

## Como abrir

- **Atalho na raiz:** `dashboard.html` (redireciona automaticamente)
- **Direto:** `dashboard/index.html`

Funciona 100% local. Não sobe pra lugar nenhum, não tem servidor, não
manda dados pra fora. Só HTML + CSS + JS aberto direto do disco.

## Como popular

O dashboard lê os dados de `dashboard/data.js`. Esse arquivo é gerado
automaticamente a partir do estado real do workspace:

```bash
node scripts/build-dashboard.mjs
```

Ou peça pro Claude rodar `/atualizar` — esse comando regenera o
dashboard junto com a varredura de memória.

Se `data.js` não existir, o dashboard mostra o estado vazio (template)
explicando como começar.

## O que aparece

- **Setup** — quais arquivos de memória estão preenchidos (`_memoria/`, `identidade/`)
- **Identidade visual** — paleta de cores e tipografia extraídas de `identidade/design-guide.md`
- **Foco atual** — frente principal + frentes ativas de `_memoria/estrategia.md`
- **Skills** — todas as skills instaladas em `.claude/skills/` (clique pra detalhes)
- **Produção** — peças geradas em `saidas/`, `marketing/conteudo/`, `site/`
- **Ferramentas conectadas** — status dos MCPs (Instagram, WhatsApp, Meta Ads, Google Ads, Calendar)
- **Próximas ações** — sugestões baseadas no que ainda falta

Cada item de memória, produção e template é clicável — abre o arquivo
ou pasta correspondente no navegador.

## Por que `data.js` é gitignored

Cada workspace tem o seu — o seu dashboard mostra o seu projeto, não
o de outra pessoa. O template (HTML + CSS + script gerador) vai pro
repo; os dados específicos do seu workspace ficam locais.
