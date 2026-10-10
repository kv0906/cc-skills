# Visual Direction System

Treat visual style as an outcome of the article analysis. Maintain internal consistency within a video, but do not make every video share the same palette, surfaces, or UI vocabulary.

## Direction Principles

- Give each visual device a semantic role.
- Choose typography from the article's tone: analytical, editorial, playful, technical, reflective, or urgent.
- Choose color from the conceptual contrast and publishing context, then verify contrast.
- Decide whether the world should feel flat, spatial, tactile, diagrammatic, editorial, cinematic, or interface-driven.
- Carry one recurring object, shape, or spatial rule across scenes to make the video coherent.
- Preserve generous safe areas and screen-readable copy at the target resolution.

## Writing Harness Preset

Use this preset for packaged systems, agent skills, workflows, and process explainers where input → mechanism → output is the true argument.

### Palette

```css
:root {
  --yellow: #fff278;
  --cyan: #00a7c4;
  --cyan-bright: #28d9ef;
  --mint: #a9efe0;
  --ink: #171817;
  --slate: #292b2d;
  --paper: #ffffff;
  --soft: #e9e9e2;
  --gray: #70736f;
}
```

Adjust cyan slightly darker when small text needs stronger contrast.

### Typography

- Display: Inter or another heavy geometric sans, weight 850–900.
- Display size at 1920×1080: 96–124 px, line height 0.94–1.0, tight tracking.
- Monospace: deterministic bundled or generic monospace, 20–30 px for UI and 46–58 px for processing phrases.
- UI labels: 14–18 px, bold, uppercase only when useful.
- Do not use more than two font roles.

### Surfaces

- Canvas: pale yellow.
- Prompt: near-black, wide and low, 24–32 px radius, restrained shadow.
- Scan highlight: mint row fill with black text and checkmark.
- Output artifact: white card, subtle gray border, soft deep shadow.
- Control dock: dark slate rounded rectangle floating over the output card.
- Accent shape: small black curved corner tab and 5–8 px black bottom rule.

### Composition

- Maintain at least 80 px outer safe area at 1920×1080.
- Main display copy should occupy 65–80% of width.
- Prompt bars should occupy about 70–78% of width and 12–20% of height.
- System scans should be narrower, centered, and surrounded by empty space.
- Output cards should occupy 65–78% of width and 60–75% of height.
- Use asymmetry in the opening collage; use strict alignment in scan and output scenes.

### Signature Details

- UI elements explain the story rather than decorating it.
- Cyan highlights one critical word or status.
- Cards enter from different directions and settle with slight rotations.
- Tree/checklist rows are scanned sequentially.
- Processing states occupy the center alone.
- The final interaction is a cursor click or equivalent confirmation.

Do not use these signature details outside this preset by default.

## Alternative Direction Prompts

Use these to break away from the preset:

- **Layered conceptual space:** camera moves between concrete skills and higher-order thinking.
- **Editorial diagram:** restrained typography, annotated shapes, and evidence-led reveals.
- **Single-object transformation:** one central object continuously changes state instead of cutting between UI cards.
- **Parallel worlds:** synchronized split-screen paths reveal contrast and trade-offs.
- **Network traversal:** the camera follows dependencies, feedback, and second-order effects.
- **Material collage:** paper, marks, and fragments physically assemble into a conclusion.

The chosen direction may use a different palette and typography. Document the rationale in `STORYBOARD.md` and keep accessibility, determinism, and rendering constraints intact.
