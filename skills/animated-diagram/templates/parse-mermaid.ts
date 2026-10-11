/**
 * Minimal Mermaid `flowchart`/`graph` parser.
 *
 * Supports the subset that covers almost every flow you'll describe in English:
 *   - direction:   flowchart TD | TB | BT | LR | RL   (and `graph` alias)
 *   - node shapes: id[rect]  id(round)  id([stadium])  id{diamond}  id{{hexagon}}
 *   - edges:       a --> b   a --- b   a -.-> b   a ==> b
 *   - edge labels: a -->|label| b
 *   - chains:      a --> b --> c
 *   - <br/> inside labels for line breaks
 *   - %% comments
 *
 * It intentionally does NOT implement subgraphs, classDef, or styling — keep
 * the diagram in the design system's hands, not Mermaid's.
 */

export type NodeShape = 'rect' | 'round' | 'stadium' | 'diamond' | 'hexagon';

export interface DiagramNode {
  id: string;
  label: string;
  shape: NodeShape;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export type Direction = 'TB' | 'BT' | 'LR' | 'RL';

export interface ParsedDiagram {
  direction: Direction;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

// Order matters: multi-char wrappers must be tried before their single-char
// prefixes (e.g. `([` before `[`, `{{` before `{`).
const SHAPES: { open: string; close: string; shape: NodeShape }[] = [
  { open: '([', close: '])', shape: 'stadium' },
  { open: '{{', close: '}}', shape: 'hexagon' },
  { open: '[', close: ']', shape: 'rect' },
  { open: '(', close: ')', shape: 'round' },
  { open: '{', close: '}', shape: 'diamond' },
];

const EDGE_OPS = /(-->|---|-\.->|==>)/;

/**
 * Parse a single node token (e.g. `action[Action]`), registering it in `nodes`
 * if not seen before. Returns the node id.
 */
function parseNodeToken(raw: string, nodes: Map<string, DiagramNode>): string {
  const token = raw.trim();
  for (const { open, close, shape } of SHAPES) {
    const openIdx = token.indexOf(open);
    if (openIdx > 0 && token.endsWith(close)) {
      const id = token.slice(0, openIdx).trim();
      const label = token.slice(openIdx + open.length, token.length - close.length).trim();
      if (!nodes.has(id)) nodes.set(id, { id, label, shape });
      return id;
    }
  }
  // Bare id reference (shape/label may be defined elsewhere on the same id).
  if (!nodes.has(token)) nodes.set(token, { id: token, label: token, shape: 'rect' });
  return token;
}

export function parseMermaid(src: string): ParsedDiagram {
  const lines = src
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('%%'));

  let direction: Direction = 'TB';
  const nodes = new Map<string, DiagramNode>();
  const edges: DiagramEdge[] = [];

  for (const line of lines) {
    const header = line.match(/^(?:flowchart|graph)\s+(TB|TD|BT|LR|RL)\b/i);
    if (header) {
      const d = header[1].toUpperCase();
      direction = (d === 'TD' ? 'TB' : d) as Direction;
      continue;
    }

    if (EDGE_OPS.test(line)) {
      // Split keeping operators: ['a ', '-->', ' b ', '-->', ' c']
      const parts = line.split(EDGE_OPS);
      for (let i = 0; i + 2 < parts.length; i += 2) {
        const left = parts[i];
        let right = parts[i + 2];

        // Optional |label| immediately after the operator, before the node.
        let label: string | undefined;
        const lm = right.match(/^\s*\|([^|]*)\|\s*(.*)$/);
        if (lm) {
          label = lm[1].trim();
          right = lm[2];
        }

        const from = parseNodeToken(left, nodes);
        const to = parseNodeToken(right, nodes);
        edges.push({ from, to, label });
      }
      continue;
    }

    // Standalone node definition (gives an id its shape/label).
    parseNodeToken(line, nodes);
  }

  return { direction, nodes: [...nodes.values()], edges };
}
