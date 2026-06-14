/**
 * The guardrails: one source of truth for color, type, node sizing and spacing.
 * Change a token here and every diagram updates. This is what keeps generated
 * diagrams on-brand without re-specifying styling each time.
 */

export const theme = {
  bg: '#0b0e14',
  surface: '#11161f',
  node: {
    fill: '#161c28',
    stroke: '#2b3648',
    text: '#e6edf6',
  },
  accent: '#5b8cff',
  edge: '#42506b',
  edgeLabel: '#8b97ad',
  /**
   * Semantic tints. Map a node id (or a mermaid class) to one of these in the
   * board if you want start/decision/approve/deny coloring. Kept here so the
   * palette is centralized.
   */
  semantic: {
    start: '#3fb950',
    decision: '#d29922',
    approve: '#3fb950',
    deny: '#f85149',
  },
  font: {
    body: '"Inter", system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
  },
} as const;

export const layoutConfig = {
  nodeWidth: 168,
  nodeHeight: 64,
  /** Gap between ranks (levels of the graph). */
  rankSep: 84,
  /** Gap between sibling nodes within a rank. */
  nodeSep: 52,
  /** Padding the layout reserves around the graph. */
  padding: 48,
  fontSize: 15,
  borderRadius: 12,
  edgeStrokeWidth: 1.75,
  nodeStrokeWidth: 1.5,
} as const;
