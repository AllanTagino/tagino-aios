# Briefing — entrevista de coleta pra site de lançamento

> Checklist completo. Use `AskUserQuestion` em uma única passada com os 8-10 pontos críticos. O resto pode preencher depois ou pedir nas iterações.

## Crítico (perguntar SEMPRE antes de codar)

### 1. Identidade
- **Nome do empreendimento:** ex "Villaggio Perdizes", "Tonino Lamborghini Residences", "Jardim Europa Tower"
- **Slug pra URL:** kebab-case, sem acento — ex `villaggio-perdizes`, `tonino-lamborghini`, `jardim-europa`
- **Tagline (1 frase, ≤ 6 palavras):** ex "236 unidades. Uma assinatura."
- **Status:** Breve lançamento · Lançamento · Em obra · Pronto pra morar

### 2. Endereço (vai pro Google Maps)
- Endereço completo: rua, número, bairro, cidade, UF, CEP (opcional)
- Linha de metrô / estação próxima (com distância em metros se sabido)
- 5-8 pontos de interesse a pé (parque, shopping, hospital, escolas, gastronomia)

### 3. Parceiros / Realização
- **Realização:** ex "Construtora X + Y"
- **Incorporação:** ex "Incorporadora X"
- **Intermediação:** ex "Imobiliária Y · Creci XXXXX-J"
- **CRECI da intermediadora** (obrigatório no footer)
- **Endereço da intermediadora** (obrigatório no footer)
- **Telefone fixo da intermediadora**

### 4. Tripé de assinatura
- **Arquitetura:** ex "Königsberger Vannucchi", "Aflalo Gasperini", "Triptyque"
- **Paisagismo:** ex "Cenário", "Burle Marx Paisagismo"
- **Interiores:** ex "Superlimão", "Diego Revollo", "Studio Roca"
- 1 frase descritiva de cada (opcional — pode escrever na hora)

### 5. Mix de unidades (tabela)

Pra cada tipologia:
- Nome (Studio · 1 dorm · 1 dorm Garden · HMP · HIS-2 · Loja)
- Metragem (range mín-máx)
- Quantidade
- Faixa de preço/condição (ou "Mercado livre" se não pode divulgar preço)

### 6. Áreas comuns

Listar separado por pavimento:
- **Térreo:** Lobby · Coworking · Pet · Mini-market · etc.
- **Pavimento de lazer/wellness (se houver):** Piscina · Fitness · Sauna · Espaço zen · etc.
- **Outros pavimentos especiais:** Lavanderia compartilhada · Salão · etc.

### 7. Diferenciais técnicos (opcional)

- Ar-condicionado entregue instalado
- Aquecimento central de água
- Iluminação com sensor
- Gerador de conforto
- Sustentabilidade (águas pluviais, gestão de resíduos)

### 8. Imagens disponíveis

- **Pasta de origem:** onde estão os renders/fotos
- **Imagem hero recomendada:** qual arquivo deve ser o "rosto" do site
- **6-8 ambientes pra galeria:** lobby · coworking · piscina · gourmet · apto · etc.
- **Formato dos originais:** PNG / JPG / HEIC / PDF (book)

### 9. Lead capture

- **WhatsApp do corretor** em formato E.164 sem `+` (ex `5511987654321`)
- **Mensagem padrão de saudação** (opcional — default: "Oi <CORRETOR>, sou <NOME>. Interesse: <X>...")
- **Email backup** (opcional, caso queira Formspree também)
- **Instagram do corretor** (pro footer · ex `@nome-do-corretor`)

### 10. SEO + Deploy

- **Domínio target:** ex `nome-empreendimento.com.br` (pra `<link rel="canonical">` e Open Graph)
- **Plataforma de deploy preferida:** Netlify · Vercel · Hostinger · Outro
- **Tracking pixel?** Meta Pixel ID · GA4 ID (adicionar depois)

---

## Não-crítico (pode coletar nas iterações)

- Vídeo / Tour 360° (URL YouTube ou Vimeo)
- Vista panorâmica / foto aérea da região
- Logos dos parceiros em SVG/PNG (pro footer institucional)
- Plantas individuais em PDF (pra página `/plantas/` futura)
- Documentos pra download (ficha técnica, book, simulação)
- Texto institucional do incorporador (1-2 parágrafos)
- Depoimentos de moradores (se já habitado / similar)
- Calendário de obra com milestones

---

## Template de prompt pro `AskUserQuestion`

Em **uma única passada**, perguntar (multi-question):

```
1. Nome do empreendimento + slug pra URL? (header: "Identidade")
2. Endereço completo? (header: "Endereço")
3. Realização + Intermediação (com Creci)? (header: "Parceiros")
4. Tripé arquitetura/paisagismo/interiores? (header: "Assinatura")
5. Pasta com as imagens disponíveis? (header: "Imagens")
6. WhatsApp do corretor em E.164? (header: "WhatsApp")
```

Mix de unidades / áreas comuns / diferenciais pode coletar via uma segunda passada ou pedir um documento (PDF da ficha técnica geralmente tem tudo).
