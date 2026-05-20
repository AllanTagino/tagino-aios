# Development Notes

These notes capture exceptions, edge cases, and historical corrections from the original chat where this skill was developed. They are not required reading for normal use of the skill, but they help explain *why* certain rules became dominant and what earlier patterns were superseded.

Read this file only when:
- A prompt is producing unexpected results and you want to understand the reasoning behind a rule.
- You are improving or revising the skill and want to preserve original intent.
- The user is requesting a style variation that resembles an early exploratory pattern (e.g., blue-hour, layout space for magazine titles).

---

## Rule 1 — Structural order

Earlier exploratory prompts before the user requested camera locking sometimes started with style or lighting rather than preservation. For example:

> "Create a high-end architectural visualization of a modern luxury residential tower..."

Once the user said:

> "make sure not changing camera"

the camera lock became the first major rule in nearly every prompt.

---

## Rule 2 — Repeated vocabulary

The first prompt used more generic architectural visualization vocabulary:

> "photorealistic architectural photography, ultra-detailed, premium real estate render, realistic proportions, sharp vertical lines, balanced composition..."

Later prompts became more specific and repetitive around Brazilian humanization, camera locking, and lived-in editorial realism.

---

## Rule 3 — Vocabulary to avoid

The first prompt did include one more generic camera/style phrase:

> "35mm lens, high resolution, natural depth"

Later camera language shifted away from lens specs and toward preserving the original viewpoint:

> "camera position, angle, framing, crop, perspective, lens feel, and overall composition."

---

## Rule 4 — Length and density

The earliest style-only prompt was shorter and less scene-specific:

> "Apply the visual style, lighting, and atmosphere of a premium blue-hour architectural photograph."

The later image-specific prompts are longer because they include camera lock, Brazilian localization, people, plants, lighting, details, and negative constraints.

---

## Rule 5 — Lighting language

The user later corrected away from blue-hour:

> "now a daylight for magazine cover"

After that, daylight became dominant. Blue-hour language should only be used if the request specifically asks for it.

---

## Rule 6 — Camera and lens

The first architectural prompt included:

> "35mm lens"

After the user emphasized camera preservation, later prompts stopped adding new lens specifications and instead used "lens feel" to preserve the original image.

---

## Rule 7 — Materials and textures

Most later prompts do not list materials explicitly. Instead, they rely on preservation of the existing render and add realism through lighting, people, greenery, and props.

---

## Rule 8 — Style references

No photographers, films, or render engines are cited in the later established pattern. The closest exception is the first generic phrase:

> "premium real estate render"

That should not become the dominant style reference.

---

## Rule 9 — Unusual inclusions

Cars only apply to exterior street scenes. For interiors and amenities, use people, table styling, plants, office objects, or personal items instead.

---

## Rule 10 — Omissions

The first magazine-cover prompt briefly allowed layout space:

> "Leave clean space at the top for a magazine title and balanced open areas on the sides or lower section for cover text."

The user immediately corrected:

> "no text overlays"

After that, "no text or graphic overlays" became mandatory.

---

## Rule 11 — Negative prompt

For style-only prompts, the negative prompt focuses more on not copying content:

> "Do not copy the architecture, building shape, layout, facade, balconies, street, cars, signs, or any specific objects from the reference image."

For edit prompts, preservation and realism constraints are stronger.
