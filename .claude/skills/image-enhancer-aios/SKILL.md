---
name: image-enhancer-aios
description: Use this skill when transforming simple architectural renders, render descriptions, or uploaded architectural images into photorealistic and cinematic Nano Banana edit prompts. It is especially suited for making architecture, interiors, amenities, lobbies, patios, and residential renders feel more alive, humanized, Brazilian, editorial, luxurious, daylight-balanced, and camera-locked. Use this skill whenever the user mentions "ImageEnhancerAIOS", "Nano Banana", "arch prompt", "render prompt", "architectural prompt", "edit prompt for render", "make this render look real", "humanize this render", "Brazilian real estate", "luxury editorial", or wants to add life, people, or realism to any architectural visualization.
---

# Instructions

Use this skill to write Nano Banana prompts in the exact style demonstrated in the chat. Do not give generic prompt-engineering advice. Produce practical image-edit prompts that preserve the original render while adding life, Brazilian specificity, lighting richness, and editorial realism.

The skill assumes the user will submit an architectural render (as an image upload or a file path) and expects a structured prompt back. Always analyze the image first, then write the prompt — never write blind from a generic template.

---

## Workflow

### Step 1 — Read the image first

Before writing anything, look carefully at the image and identify:

- **Scene type**: interior amenity, exterior streetscape, workspace, lobby, pool deck, gym/spa, apartment unit interior, kids/pet area, etc. The scene type determines which adaptations to apply (see the cheatsheet below).
- **Architectural elements to preserve**: list the specific things visible — ceiling design, walls, glass, columns, tile patterns, materials, view through windows. These become part of the explicit preservation list in your prompt's opening sentence.
- **Furniture and built-structure inventory**: explicitly list every piece of furniture and built element visible — tables, chairs, counters, desks, sofas, podiums, shelving, niches, fridges, reception desks, bars. Note the *scale* of each element (small built-in vs. large freestanding, single vs. wraparound). This list defines what people can interact with. **Anything not on this list must not be added, and existing elements must not be enlarged or extended to fit an activity.** If the scene lacks seating for a particular activity (e.g., no dining table), the activity must be adjusted (e.g., standing and browsing instead of sitting and dining) — never invent furniture to support the activity.
- **Activity-to-furniture scale matching**: when choosing what people will be doing, match the activity to the *capacity* of existing furniture. If an existing element is too small for an activity (e.g., a tiny built-in cashier alcove for a sustained transaction), drop the activity entirely rather than describing it — Nano Banana tends to invent space (extending counters, adding kick plates, enlarging surfaces) when activities strain the available furniture. Pick a smaller-scope activity that fits the existing element exactly.
- **Prop-to-surface scale matching**: when choosing props for the scene, check whether each prop needs a flat surface to rest on. Body-resting and lounger-resting props (books, sunglasses, hats, towels) are safe in almost any scene. Surface-requiring props (drinks, glasses, cups, plates, trays, ice buckets, food, fruit) need a side table, counter, nightstand, wide arm-rest, or kitchen surface to land on. **If the scene has no such surface, omit the surface-requiring prop entirely — do not include it in the prompt at all.** Asking for "drinks held in hand only" still triggers the model to invent a side table because the placement is ambiguous; the only reliable fix is to leave the prop out of the prompt. This rule and the activity-scale rule above are a pair: don't ask for *anything* (activity or prop) that strains what the scene actually provides.
- **Current population state**: is the render empty, partially populated, or already busy? An empty render needs added life; a partially populated render needs enhancement and refinement, not a full repopulation.
- **Lighting situation**: daylight, blue-hour, interior-only, mixed practical. Default to daylight unless the user asks otherwise.
- **Existing plants and props**: note what is already there so your enhancement instructions build on the existing palette rather than fighting it.

The analysis directly drives the prompt specifics. Without it, the prompt becomes generic and the result drifts away from the source image. The furniture inventory in particular is what stops Nano Banana from hallucinating new tables, counters, or work surfaces that don't belong in the scene.

### Step 2 — Write the prompt

Apply the rules in the rest of this document. Always output in the required format defined at the end.

---

## Scene-type cheatsheet

Use this table as a starting point. Each scene type has its own characteristic people, props, plant approach, lighting accent, and editorial style reference. Adapt — do not copy verbatim.

### Outdoor amenity (BBQ, patio, party deck, gourmet area)
- **People**: residents dining, gathering, socializing around the BBQ; optional chef working at the grill
- **Props**: glasses, pitchers (often with lime/lemon water), plates, bowls, fruit (pineapple, mango, pears), table styling, cocktails, woven placemats
- **Plants**: rich layered Brazilian tropical — bromeliads (with red bracts), heliconias, ferns, philodendrons, monsteras, dracaena, broad-leaf foliage, climbing greenery, small ornamental trees, vertical garden walls
- **Lighting accent**: warm practical at bar or grill area; daylight balanced
- **Style reference**: "luxury Brazilian real-estate editorial photography"

### Exterior streetscape (building facade from street level)
- **People**: pedestrians walking, residents entering the building, dog walkers, casual passersby
- **Props**: Brazilian-market cars only (compact sedans, hatchbacks, small SUVs — VW Polo, Hyundai Tucson, Jeep Compass, Honda Civic, Toyota Corolla); explicitly avoid European-looking mixes
- **Plants**: street trees, sidewalk landscape beds, varied balcony planting per apartment (personalized — bromeliads on one, palms on another, ferns/heliconias on a third), ground-floor lush foliage
- **Lighting accent**: warm practical visible through ground-floor glass (lobby, café, reception zones glow warmly against daylight)
- **Style reference**: "luxury Brazilian real-estate editorial photography"

### Workspace / business lounge / coworking
- **People**: professionals in a calm casual meeting, someone on a laptop, someone taking notes, a person walking near private booths
- **Props**: laptops, tablets, notebooks, coffee cups, water glasses/carafes, water bottles, headphones, pens, documents — curated and clean, not messy
- **Plants**: restrained, only if it fits naturally — small indoor philodendrons, monsteras, dracaena, ferns in pots near walls
- **Lighting accent**: warm ceiling/niche/coffee-station lighting mixed with interior daylight
- **Style reference**: "luxury Brazilian residential coworking or business lounge editorial photography"
- **Notes**: add Brazilian character through styling and atmosphere, not overt tropical clichés

### Lobby / reception (interior)
- **People**: well-dressed residents or guests entering, chatting with reception, waiting on lounge seating, walking through
- **Props**: book on coffee table, cup, handbag, small art object, casually placed personal touches — subtle, not staged
- **Plants**: tasteful indoor tropical accents — philodendrons, monsteras, broad-leaf potted plants, occasional planter wall
- **Lighting accent**: warm pendant or lobby/reception lighting + daylight from glass facade
- **Style reference**: "luxury Brazilian residential editorial photography"

### Pool deck / rooftop
- **People**: residents lounging on sun loungers, swimming, sitting at the bar, reading, drying off with towels — calm, upscale
- **Props**: towels (rolled or draped), pool floats (sparing, tasteful), drinks at the bar, sun loungers with cushions, books, sun hats, ice buckets
- **Plants**: rooftop tropical planting — palms (typically smaller varieties), heliconias, bromeliads in large planters, lush hedge backdrops, climbing greenery on screening walls
- **Lighting accent**: warm bar or cabana lighting (if applicable) + bright natural daylight
- **Style reference**: "luxury Brazilian residential editorial photography (rooftop)"
- **Notes**: city skyline backdrop should feel Brazilian — São Paulo, Rio, Belo Horizonte character — not generic Manhattan or European

### Gym / wellness / spa
- **People**: a few people training, stretching, walking through; calm, focused energy — never crowded
- **Props**: water bottles, towels, yoga mats, light dumbbells, gym bags, headphones
- **Plants**: minimal — occasional potted plant, vertical green wall accent if it fits the design
- **Lighting accent**: warm wall/ceiling accents + bright clean daylight
- **Style reference**: "luxury Brazilian residential wellness or gym editorial photography"

### Apartment unit interior (living, bedroom, kitchen)
- **People**: a resident or family enjoying the space — reading, having coffee, talking, cooking; or unpopulated with strong styling that implies presence
- **Props**: coffee table books, throws, cushions, fresh-cut flowers, fruit bowl, magazines, plates, glasses, framed art, family photos (subtle), bedside lamps, kitchen styling (cutting board, fresh produce)
- **Plants**: indoor plants — philodendrons, monsteras, ferns, small ornamental palms in floor planters or shelves
- **Lighting accent**: warm table lamps, pendant lights, kitchen under-cabinet lighting + daylight from windows
- **Style reference**: "luxury Brazilian residential editorial photography" or "lifestyle magazine interior photography"

### Kids / pet / playground area
- **People**: children playing (calm, not chaotic), parents watching, small kids with toys, pet owners with well-groomed small dogs
- **Props**: child-scaled furniture, soft toys, small balls, picture books, pet bowls, leashes
- **Plants**: durable tropical greenery, soft hedges, lush border planting (nothing thorny or fragile)
- **Lighting accent**: bright natural daylight, soft shadow play through trees or pergolas
- **Style reference**: "luxury Brazilian residential family amenity editorial photography"

---

## 1. Structural order

### Rule
Write prompts in this repeated order:

1. Start with the edit target and camera lock.
2. Preserve existing architecture, layout, composition, design language, **and all existing furniture and built structures**. Explicitly state that no new furniture, tables, counters, desks, podiums, or built elements may be added.
3. State the emotional and market direction: more alive, human, Brazilian, elegant, high-end.
4. Add people or activity specific to the scene.
5. Define lighting as daylight plus warm practical or architectural lighting.
6. Add Brazilian tropical/subtropical greenery where relevant.
7. Add subtle lived-in details.
8. End with the final desired style sentence.
9. Add a separate Negative prompt.
10. Usually add a Short version for direct Nano Banana use.

### Evidence

> "Edit the provided image while **keeping the exact same camera viewpoint**. Preserve the same camera position, angle, framing, crop, perspective, lens feel, and overall composition. Do not change the architectural layout, double-height space, window design, furniture arrangement, or general interior design language."

Then:

> "Make the scene feel more alive, human, and clearly **Brazilian**, while keeping it elegant, refined, and high-end."

Then:

> "Add a few well-dressed residents or guests naturally using the lobby..."

(See `references/development-notes.md` for the exploratory pre-camera-lock pattern.)

---

## 2. Repeated vocabulary to use

### Rule
Use the following exact words and phrases repeatedly. These are characteristic of the prompt style:

- "Edit the provided image"
- "keeping the exact same camera viewpoint"
- "Preserve the same camera position, angle, framing, crop, perspective, lens feel, and overall composition"
- "Do not change"
- "Make the scene feel more alive"
- "human"
- "clearly Brazilian"
- "elegant, refined, and high-end"
- "well-dressed residents"
- "stylish residents"
- "tasteful"
- "subtle"
- "calm"
- "upscale"
- "believable"
- "bright natural daylight"
- "premium editorial feel"
- "soft sunlight"
- "balanced exposure"
- "crisp detail"
- "realistic reflections"
- "warm practical lighting"
- "Brazilian tropical planting"
- "tropical and subtropical"
- "lived-in"
- "curated"
- "photorealistic"
- "luxury Brazilian real-estate editorial photography"
- "warm, sophisticated, inhabited, and visually rich"
- "No text or overlays"

### Evidence

> "Make the image feel clearly **Brazilian**, not European. Add tasteful life with a few residents and a realistic mix of **Brazilian-market cars** common in upscale Brazilian cities."

> "The final image should feel like **luxury Brazilian real-estate editorial photography**: photorealistic, warm, sophisticated, tropical, elegant, lived-in, and visually rich, with no text or graphic overlays."

> "The activity should feel calm, upscale, social, and believable, not crowded or staged."

---

## 3. Vocabulary to avoid

### Rule
Avoid generic AI-art hype terms and software or engine references. Do not use:

- "masterpiece"
- "award-winning"
- "trending on ArtStation"
- "8k"
- "hyperreal"
- "Unreal Engine"
- "Octane Render"
- "V-Ray"
- "Corona Renderer"
- "cinematic masterpiece"
- specific photographer names
- specific film names
- "bokeh"
- "anamorphic"
- "volumetric lighting"
- "global illumination"
- "ray tracing"
- excessive camera specs

Instead, use restrained editorial and real-estate language.

### Evidence

> "Aim for the look of premium real-estate campaign photography or an architectural feature in a luxury lifestyle magazine."

> "The result should feel photorealistic, elegant, and visually rich, with subtle human presence and a warm, upscale atmosphere."

---

## 4. Length and density

### Rule
Use a medium-dense, production-ready format.

Typical output structure:

- Main prompt: about 220 to 360 words.
- Negative prompt: about 50 to 100 words.
- Short version: about 45 to 80 words.

Sentences should be imperative and direct. Use repeated command forms such as:

- "Edit..."
- "Keep..."
- "Preserve..."
- "Do not..."
- "Make..."
- "Add..."
- "Use..."
- "Enhance..."
- "The final image should feel..."

### Evidence

> "Edit the provided image while **keeping the exact same camera viewpoint**. Preserve the same camera position, angle, framing, crop, perspective, lens feel, and overall composition. Do not change the architectural layout, glass walls, dining area, kitchen/bar, lounge zone, furniture placement, ceiling, columns, shelving, TV wall, or general interior design language."

> "Add subtle lived-in office details: notebooks, coffee cups, water glasses, tablets, open laptops, pens, documents, headphones, and small personal work items. Keep everything curated, clean, and premium, not messy."

---

## 5. Lighting language patterns

### Rule
Lighting should be described as realistic, editorial, and layered. Use daylight plus warm practical lighting, not dramatic fantasy lighting.

Repeated daylight formula:

- "bright natural daylight"
- "premium editorial feel"
- "soft sunlight"
- "balanced exposure"
- "crisp detail"
- "realistic shadows"
- "realistic reflections"
- "subtle warm practical lighting"
- "warm architectural lighting"
- "welcoming and inhabited even during the day"

For blue-hour style-only prompts (use only when explicitly requested):

- "deep clear blue sky"
- "warm golden interior glow"
- "soft ambient reflections"
- "cool exterior tones and warm illuminated areas"

### Evidence

> "Keep the lighting as **bright natural daylight** with a premium editorial feel. Use soft sunlight, balanced exposure, crisp detail, realistic shadows, and subtle warm practical lighting in the bar or grill area so the space feels welcoming and inhabited even during the day."

> "Keep the lighting as **premium interior daylight mixed with warm architectural lighting**. Use soft daylight entering the space, balanced exposure, crisp detail, realistic shadows, and subtle warm ceiling and niche lighting."

---

## 6. Camera and lens language patterns

### Rule
Camera preservation is mandatory. Always state the camera lock early and strongly.

Use this exact style:

> "Keep the exact same camera viewpoint. Preserve the same camera position, angle, framing, crop, perspective, lens feel, and overall composition."

Also include where relevant:

- "Do not zoom in or out"
- "Do not shift the viewpoint"
- "Do not alter the perspective, framing, crop, or viewpoint"
- "Do not redesign the building"
- "Do not move the main furniture zones"
- "Do not add new furniture, tables, counters, desks, podiums, bars, work surfaces, or built structures"
- "Do not invent seating, work setups, or display elements that aren't already in the source image"
- "Do not extend, lengthen, widen, deepen, enlarge, or modify the dimensions of any existing built element — preserve their exact size, shape, and form"
- "Do not add kick plates, counter wraps, fascia panels, foot rests, or surface extensions to any existing built structure"
- "People may only interact with furniture and elements visible in the original, at their original size"

Do not add new focal lengths, shot types, or lens effects unless the user explicitly asks.

The "no added furniture" and "no modified dimensions" instructions are especially important for scenes that look sparse or are populated with activity that normally needs more substantial furniture (dining, working, meeting, transactions). Without these constraints, Nano Banana tends to either invent new furniture entirely or quietly enlarge existing built elements (extending counters, adding kick plates, widening niches) to support the suggested activity. If a scene lacks the right furniture for an activity, change the activity — not the furniture.

### Evidence

> "**Do not change the camera viewpoint. Keep the exact same camera position, angle, framing, crop, lens feel, perspective, and composition as the original image.** Do not zoom in or out, do not shift the viewpoint, and do not alter the architectural massing or overall scene structure."

> "No text, no masthead, no captions, no logos, no borders, no graphic overlays. **Do not change the camera. Do not alter the perspective, framing, crop, or viewpoint.**"

---

## 7. Material and texture language patterns

### Rule
Material language is present but secondary. Mention materials only when they support realism, luxury, and preservation. Do not over-specify material shaders.

Use:

- "realistic materials"
- "visible wood texture"
- "smooth concrete"
- "dark metal frames"
- "transparent glass"
- "warm ambient reflections"
- "realistic reflections"
- "crisp detail"
- "polished"
- "curated"
- "clean"

For interiors, focus more on furniture, tableware, plants, lighting, and lived-in details than on technical material settings.

### Evidence

> "Materials should look realistic, with visible wood texture, smooth concrete, dark metal frames, transparent glass, and warm ambient reflections."

> "Keep everything curated, clean, and premium, not messy."

---

## 8. Style references cited

### Rule
Use commercial editorial references, not named artists, films, or engines.

Repeated style references:

- "premium real-estate campaign photography"
- "architectural feature in a luxury lifestyle magazine"
- "luxury Brazilian real-estate editorial photography"
- "luxury Brazilian residential editorial photography"
- "luxury Brazilian residential coworking or business lounge editorial photography"
- "premium magazine-cover feel"
- "professional magazine cover photography"
- "architectural photography"

### Evidence

> "Aim for the look of premium real-estate campaign photography or an architectural feature in a luxury lifestyle magazine."

> "The final image should feel like **luxury Brazilian residential coworking or business lounge editorial photography**: photorealistic, warm, sophisticated, productive, elegant, lived-in, and visually rich..."

---

## 9. Unusual inclusions

### Rule
Include details that are not generic prompt-writing defaults but are repeated in this style:

1. Brazilian localization:
   - "clearly Brazilian"
   - "not European"
   - "Brazilian-market cars"
   - "Brazilian tropical/subtropical planting"

2. Humanization without overcrowding:
   - "few well-dressed residents"
   - "calm, upscale, and believable"
   - "not crowded"

3. Lived-in props:
   - "coffee cups"
   - "water glasses"
   - "tableware"
   - "fruit"
   - "books"
   - "handbag"
   - "notebooks"
   - "documents"
   - "headphones"

4. Plant species lists:
   - "philodendrons"
   - "monsteras"
   - "ferns"
   - "bromeliads"
   - "heliconias"
   - "dracaena"
   - "lush broad-leaf foliage"
   - "small ornamental trees"

5. Exact camera preservation as a core prompt feature.

6. Carried items and prop placement principles:
   - Handbags, shopping baskets, takeaway cups, books, towels, gym bags, and other small portable props should be **held by people** or placed on **existing surfaces** only.
   - Never on the floor as standalone styling.
   - Never on invented surfaces.
   - If there is no existing surface to place the prop on, the prop must stay in hand.
   - Fruit, in particular, must never be added as a displayed item on its own — any fruit must be inside a carried basket or sitting on an existing kitchen/dining/coffee surface that the source image already shows.
   - **Surface-requiring props (drinks, glasses, cups, plates, trays, ice buckets, food bowls) must be omitted entirely if the scene has no existing surface to hold them.** Do not include them in the prompt at all when the scene lacks an obvious resting place — telling the model "hold in hand only" still triggers it to fabricate a side table or tray-stand to resolve the placement ambiguity. The reliable fix is silence: leave the prop out of the prompt.

### Evidence

> "Use realistic compact sedans, hatchbacks, and small SUVs typical of Brazil, with a locally appropriate vehicle mix and streetscape feel. Avoid a European-looking car selection."

> "Use species and visual character typical of Brazil, such as palms, philodendrons, bromeliads, ferns, heliconias, dracaena, lush planter boxes, layered foliage, and small ornamental trees."

> "Add subtle humanizing details that make the lobby feel used and welcoming, such as a book on the coffee table, a cup, a handbag, a casually placed object, or other small lived-in touches."

---

## 10. Omissions compared with generic prompt writers

### Rule
Do not include these unless the user explicitly requests them:

- No text overlays.
- No masthead.
- No captions.
- No logos.
- No borders.
- No graphic elements.
- No named photographers.
- No film references.
- No render-engine references.
- No aspect ratio.
- No resolution specs.
- No seed.
- No camera brand.
- No new composition direction if camera must be preserved.
- No excessive lens/focal length instructions.
- No abstract mood boards.

### Evidence

> "No text, no masthead, no captions, no logos, no borders, no graphic overlays."

> "The image should feel like a cover-quality image, but purely visual and uncluttered, with no typography or layout elements added."

---

## 11. Negative prompt pattern

### Rule
Always include a negative prompt after the main prompt. It should not be generic only. It must repeat the key preservation constraints and scene-specific failure modes.

Standard components:

- No text or graphics.
- Do not change camera.
- Do not redesign architecture or layout.
- **No added furniture, new tables, new counters, new desks, new podiums, new bars, new shelving, or any invented built structures.**
- **Do not invent work setups, dining setups, or display surfaces that aren't in the original image.**
- **No invented display surfaces — no fruit displays, no produce pedestals, no merchandising tables, no harvest counters, no product display stands.**
- **No extension, lengthening, widening, or modification of existing built elements — preserve exact dimensions and form. No kick plates, no counter wraps, no fascia panels, no surface extensions added to existing structures.**
- **No portable props (baskets, handbags, towels, cups, books) placed on the floor as standalone styling — carried items must be held in hand or rest on existing surfaces only.**
- **No surface-requiring props (drinks, glasses, cups, plates, trays, ice buckets) when the scene lacks a surface to hold them — omit them from the prompt rather than describing them as "held in hand," because the model will invent a side table to resolve placement.**
- Avoid empty or sterile scene.
- Avoid too many people.
- Avoid clutter or messy props.
- Avoid harsh shadows, oversaturation, fake people, unrealistic plants.
- Avoid non-Brazilian or European cues where relevant.

### Evidence

> "No text, no captions, no logos, no borders, no graphic overlays. Do not change the camera, crop, framing, angle, or perspective. Do not redesign the space or move the main architectural elements. Avoid a sterile or empty look."

> "Avoid an empty or lifeless scene. Avoid too many people, traffic congestion, clutter, random crowding, harsh shadows, flat lighting, oversaturation, unrealistic plants, artificial-looking people, or a sterile showroom feeling."

> "Avoid European-looking cars, European streetscape cues, and non-Brazilian planting palettes."

---

## 12. Required output format

When writing a Nano Banana prompt in this style, output exactly:

```markdown
## Prompt

[main prompt — 220 to 360 words, structured per Rule 1]

## Negative prompt

[negative prompt — 50 to 100 words, scene-specific]

## Short version

[compressed one-paragraph direct-use prompt — 45 to 80 words]
```

Do not add headings before or after these three sections. Do not add commentary, disclaimers, or meta-explanations unless the user explicitly asks for them.

---

## 13. Executing the prompt (Tagino_AIOS pipeline)

After writing the prompt, the user typically wants to actually render it. The Tagino_AIOS canonical ships with `scripts/nano-banana-enhance.py`, which runs the prompt through the kie.ai Nano Banana Pro API (Gemini 2.5 Flash Image) and saves the result locally.

### Standard save layout

For each render, save the artifacts in a dated folder so we can iterate later:

```
marketing/enhanced/<slug>-<YYYY-MM-DD>/
├── prompt.txt           ← the main prompt from section 12
├── negative.txt         ← the negative prompt from section 12
├── source.jpg           ← (optional) symlink/copy of the input render
└── <slug>-enhanced.png  ← the result from kie.ai
```

The slug should describe the scene (e.g., `09-rooftop-pool`, `coworking-lounge`, `fachada-noturna`).

### Run

```powershell
python scripts/nano-banana-enhance.py `
  --input "dados/oficial/.../<source>.jpg" `
  --prompt-file "marketing/enhanced/<slug>-<date>/prompt.txt" `
  --negative-file "marketing/enhanced/<slug>-<date>/negative.txt" `
  --output "marketing/enhanced/<slug>-<date>/<slug>-enhanced.png"
```

### Requirements (one-time setup per workspace)

1. `KIE_API_KEY` no `.env` — pega em https://kie.ai/api-key, grava via `/conectar kieai` (recomendado) ou copia `.env.example` pra `.env` e cola a chave.
2. `pip install -r scripts/requirements.txt` — instala `requests`, `Pillow`, `python-dotenv`.

### Cost + timing

- ~$0.09 USD por imagem @ 2K (default)
- 30 a 90 segundos por render (varia com fila do kie.ai)
- Se rodar para um carrossel inteiro (8-10 cenas), prever ~$0.80-$0.90 + 10-15 min total

### When the result needs another pass

If the first render misses something (camera shifted, invented a side table, people look fake), don't rewrite the whole prompt from scratch. Tweak the specific failure mode in the prompt or negative — see Rule 1 (structure) and Rule 11 (negative prompt) — and re-run. Save the v2 output as `<slug>-enhanced-v2.png` next to v1 so we can compare and pick the best.
