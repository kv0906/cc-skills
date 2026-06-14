# Setup

Get a Remotion project running, drop in the templates, preview, render.

## 1. Scaffold a Remotion project

```bash
npm create video@latest    # choose the "Blank" (or "Hello World") template
cd <your-project>
```

This gives you `src/Root.tsx` (composition registry), `src/index.ts`
(`registerRoot`), and a `remotion.config.ts`.

## 2. Install the layout engine

The only extra dependency is dagre (auto-layout):

```bash
npm i @dagrejs/dagre
```

`@dagrejs/dagre` ships its own TypeScript types — no `@types/dagre` needed.

## 3. Add the templates

Copy this skill's `templates/` into your project as `src/diagram/`:

```
src/
  diagram/
    animation.ts
    design-system.ts
    parse-mermaid.ts
    layout.ts
    Node.tsx
    Edge.tsx
    TraceDot.tsx
    DiagramBoard.tsx
    CRTShader.tsx
  Root.tsx
```

Then copy `examples/tier-check.tsx` next to your compositions and register it.
Either merge `examples/Root.tsx` into your `src/Root.tsx`, or add the
`<Composition>` directly:

```tsx
import { Composition } from 'remotion';
import { TierCheck } from './tier-check';

export const RemotionRoot = () => (
  <Composition
    id="TierCheck"
    component={TierCheck}
    durationInFrames={210}
    fps={30}
    width={1920}
    height={1080}
  />
);
```

> Adjust the import paths to match where you put the files
> (`./diagram/DiagramBoard`, etc.).

## 4. Preview

```bash
npx remotion studio
```

Open the `TierCheck` composition. Scrub the timeline to watch the reveal and the
trace dot. Tweak `revealStart` / `nodeStagger` and the trace `startFrame` /
`segDuration` live.

## 5. Render

```bash
# MP4
npx remotion render TierCheck out/tier-check.mp4

# Transparent WebM (e.g. to composite the diagram over other footage)
npx remotion render TierCheck out/tier-check.webm --codec=vp8 --image-format=png
```

## Fonts

The design system references **Inter** (body) and **JetBrains Mono** (labels).
Load them so the render matches the preview — e.g. with `@remotion/google-fonts`:

```bash
npm i @remotion/google-fonts
```

```tsx
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';
loadInter();
loadMono();
```

Or fall back to the system stack already declared in `design-system.ts`.

## Sizing the composition

Set `durationInFrames` to cover the last beat: the final node lands at
`revealStart + (nodeCount - 1) * nodeStagger`, and a trace finishes at
`startFrame + (path.length - 1) * segDuration` (plus any hold you want on
screen). Give it a second of breathing room at the end.
