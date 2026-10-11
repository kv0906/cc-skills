# Mermaid Input Reference

Mermaid is the **input language**. You write it fluently, the components turn it
into a laid-out, animated board. This is the subset `parse-mermaid.ts` supports
— deliberately small, because the design system (not Mermaid) owns styling.

## Header / direction

```
flowchart TD     # top -> down  (TD and TB are aliases)
flowchart BT     # bottom -> top
flowchart LR     # left -> right
flowchart RL     # right -> left
graph LR         # `graph` is accepted as an alias for `flowchart`
```

Direction maps straight to dagre's `rankdir`.

## Node shapes

| Mermaid | Shape | Typical use |
|---------|-------|-------------|
| `id[Label]` | rectangle | process / step |
| `id(Label)` | rounded rect | soft step |
| `id([Label])` | stadium / pill | start, end, terminal state |
| `id{Label}` | diamond | decision |
| `id{{Label}}` | hexagon | special / preparation |

A bare `id` (no wrapper) is treated as a rectangle labeled with its id. Define a
node's shape once; later references by bare id reuse it.

## Edges

| Mermaid | Meaning |
|---------|---------|
| `a --> b` | directed edge |
| `a --- b` | edge (rendered the same; arrowhead still drawn) |
| `a -.-> b` | dotted intent (rendered as a normal edge in this subset) |
| `a ==> b` | thick intent (rendered as a normal edge in this subset) |
| `a -->\|label\| b` | edge with a label at the midpoint |
| `a --> b --> c` | chain (expands to two edges) |

## Labels

Use `<br/>` for line breaks inside any label:

```
t1[Tier 1<br/>read-only]
```

Labels are rendered as HTML in a `<foreignObject>`, so the break just works.

## Comments

Lines starting with `%%` are ignored.

## Worked example (the tier check)

```
flowchart TD
  action[Action] --> t1[Tier 1<br/>read-only]
  action --> t2[Tier 2<br/>in-project writes]
  action --> t3[Tier 3<br/>everything else]
  t1 --> skip([Skips classifier])
  t2 --> skip
  t3 --> classifier{Classifier}
  classifier --> approve[Approve]
  classifier --> deny[Deny]
```

Node ids (`action`, `t3`, `classifier`, `deny`, …) are what you reference in a
trace `path`.

## Not supported (on purpose)

- `subgraph` blocks
- `classDef` / `class` / inline `style` — styling lives in `design-system.ts`
- click/link directives

If you need any of these, add them to `parse-mermaid.ts` and the renderer — but
prefer expressing intent through the design system so every diagram stays
consistent.
