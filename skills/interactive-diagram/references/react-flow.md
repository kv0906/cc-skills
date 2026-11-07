# React Flow implementation patterns

Use these patterns without importing a fixed system topology.

## Data and state

Separate content from rendering:

- **Components:** stable ID, display name, plain-language function, principle, strengths, weaknesses, fit, evidence and optional logo provenance.
- **Layout nodes:** component ID, position and optional lane. One component can have separate layout nodes in overview and focused layouts.
- **Connections:** stable ID, source layout-node ID, target ID, label, kind (`request`, `data`, `logical`) and any routing hints.
- **Focused views (optional):** relevant node/edge IDs and a short explanation. Every reference must exist.

For example, a cache-hit scenario may follow client → gateway → API → cache → API → gateway → client. Cache-miss adds the authoritative store and optional cache population only when supported by the sources. A logical “configures” relationship is not part of this runtime trace.

Keep only the state needed for the selected component, optional focused view, loop toggle and node geometry. No playback state machine is needed.

## Controlled node geometry

Define `nodeTypes` and `edgeTypes` outside render. Handle position and dimensions changes with `applyNodeChanges`. Preserve **both position and measured dimensions** across controlled updates; losing dimensions can make nodes disappear. Keep geometry keyed by layout as well as node ID when layouts differ.

Use React Flow handles with consistent `Position` values and source/target IDs. Choose sides from the relative node positions. Explicitly route long cross-lane edges around intervening cards. Recalculate edge motion paths when nodes move.

## Directional ambient loops

Render a custom edge with `BaseEdge`. Use `getSmoothStepPath` for normal routing and explicit orthogonal paths only where needed. Pass the same SVG path to the edge and its moving glyphs so they cannot drift apart.

Two small SVG chevrons can travel continuously along that path:

```jsx
{loop && !reduced && !dim && kind !== 'logical' &&
  [0, 1].map(pulse => (
    <path
      key={pulse}
      className="flow-pulse"
      d="M -5 -4 L 1 0 L -5 4"
      fill="none"
      stroke={kind === 'data' ? '#ff791f' : '#1476ff'}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        offsetPath: `path('${path}')`,
        offsetRotate: 'auto',
        animationDelay: `${-pulse * 1.5}s`,
      }}
      aria-hidden="true"
    />
  ))}
```

```css
.flow-pulse { pointer-events: none; animation: flow-travel 3s linear infinite; }
@keyframes flow-travel {
  from { offset-distance: 0%; }
  to { offset-distance: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .flow-pulse { animation: none; }
}
```

Animate only relevant edges in focused views and all meaningful flows in overview. Unmount the glyphs when the loop toggle is off or reduced motion becomes active. Use CSS rather than re-rendering React every frame. Route opposite-direction edges separately instead of drawing indistinguishable paths on top of one another.

## Offline delivery

Use the existing project's build setup when available. For a standalone artifact, esbuild can bundle React, React DOM and `@xyflow/react`, with CSS imported from `@xyflow/react/dist/style.css` and local styles. Use data-URL loaders for downloaded SVG/PNG logos. Bundle with `write: false`, inline the resulting CSS and JS into a UTF-8 HTML document with a viewport meta tag and `#root`.

Escape closing script tags before inserting bundled JS into HTML (`js.replaceAll('</script', '<\\/script')`). Keep dependency legal notices. Preserve source, package manifest and lockfile separately from the generated artifact. Do not ship `node_modules` or depend on network fonts/CDNs if promising offline operation.

Verify installed library versions rather than treating these notes as API documentation. Use source-relative paths, not the original author's absolute workspace paths. Download official assets only as needed; preserve their provenance and do not invent permissive licenses for vendor trademarks.
