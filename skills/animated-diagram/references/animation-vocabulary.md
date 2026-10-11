# Animation Vocabulary

A shared vocabulary with the agent is the real unlock. Once "rise in fast on
enter" means one specific thing, you stop describing curves and start describing
intent. These are the words and what they compile to (`templates/animation.ts`).

## Transitions

| Phrase | Helper | Effect |
|--------|--------|--------|
| "rise in" | `riseIn` | fade in + translate up from an offset (default 24px) |
| "fade in" | `fadeIn` | opacity 0 → 1 |
| "pop in" | `scaleIn` | fade in + scale up from ~0.92 (use `from` to tune) |
| "draw in" | `drawIn` | a stroked path reveals along its length |

All take `{ frame, delay, duration, easing }`. `delay` is when it starts (in
frames); everything is clamped before/after.

## Durations

`DURATION.fast` = 10f · `DURATION.base` = 18f · `DURATION.slow` = 28f (at 30fps).

> "fast" / "base" / "slow" — say the word, pass the preset. At other frame rates
> scale by `fps / 30`.

## Easing

| Word | Curve | Feel |
|------|-------|------|
| "out" | `BEZIER.out` — `cubic-bezier(0.16,1,0.3,1)` | decelerate into place (default) |
| "snap" | `BEZIER.snap` — `cubic-bezier(0.34,1.56,0.64,1)` | slight overshoot, playful |
| "linear" | `BEZIER.linear` | constant speed (trace dots) |
| "in-out" | `BEZIER.inOut` — `cubic-bezier(0.65,0,0.35,1)` | symmetric (stroke draws, ambient) |

## Composing a phrase

> **"rise in fast on enter"**

```ts
riseIn({ frame, delay, duration: DURATION.fast, easing: BEZIER.out });
```

> **"pop in with a snap, slow"**

```ts
scaleIn({ frame, delay, duration: DURATION.slow, easing: BEZIER.snap });
```

## Reveal rhythm (board-level)

The board sequences entrances for you:

- `revealStart` — frame the first node appears.
- `nodeStagger` — frames between consecutive node reveals. ~6–7 reads as a
  deliberate build-on at 30fps; smaller feels eager, larger feels ceremonial.
- Edges draw a few frames after their source node lands (see `edgeDelay` in
  `DiagramBoard.tsx`).

## Trace events

A trace is the moving narrative beat:

- `startFrame` — when the dot starts.
- `segDuration` — frames per hop. Larger = more deliberate.
- `holdDuration` — how long a reached node stays lit (use a big number to keep
  it lit for the rest of the shot).

As the dot crosses each hop, the board lights the destination node and the edge
behind it in the accent color (with a glow). Run several traces at once for
parallel or competing paths.

## Coining new words

When a request needs a motion you don't have a word for, **name it and add a
preset** to `animation.ts` (a new entry in `BEZIER`/`DURATION`, or a new helper
modeled on `riseIn`). Next time, the word is enough.
