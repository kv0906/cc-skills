import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { parseMermaid } from './parse-mermaid';
import { layoutDiagram } from './layout';
import { theme } from './design-system';
import { Node } from './Node';
import { Edge } from './Edge';
import {
  TraceDot,
  activeTraceEdges,
  activeTraceNodes,
  type NodeMap,
  type Trace,
} from './TraceDot';

/**
 * The board. Give it Mermaid (and optional trace events) and it parses, lays
 * out, reveals on a timeline, and plays the events. You change the Mermaid or
 * the design tokens — never the geometry.
 */

export interface DiagramBoardProps {
  mermaid: string;
  /** frame the first node appears */
  revealStart?: number;
  /** frames between consecutive node reveals */
  nodeStagger?: number;
  /** trace events */
  traces?: Trace[];
  /** scale the graph to fit the canvas (default true) */
  fit?: boolean;
}

export const DiagramBoard: React.FC<DiagramBoardProps> = ({
  mermaid,
  revealStart = 0,
  nodeStagger = 6,
  traces = [],
  fit = true,
}) => {
  const frame = useCurrentFrame();
  const { width: vw, height: vh } = useVideoConfig();

  const layout = useMemo(() => layoutDiagram(parseMermaid(mermaid)), [mermaid]);

  const nodeMap: NodeMap = useMemo(
    () => Object.fromEntries(layout.nodes.map((n) => [n.id, n])),
    [layout]
  );
  const nodeIndex: Record<string, number> = useMemo(
    () => Object.fromEntries(layout.nodes.map((n, i) => [n.id, i])),
    [layout]
  );

  // Which nodes/edges are lit by trace events this frame.
  const activeNodes = new Set<string>();
  const activeEdges = new Set<string>();
  for (const t of traces) {
    activeTraceNodes(t, frame).forEach((id) => activeNodes.add(id));
    activeTraceEdges(t, frame).forEach((e) => activeEdges.add(e));
  }

  // Reveal timing: a node appears at revealStart + index*stagger; an edge draws
  // shortly after its source node has landed.
  const nodeDelay = (id: string) => revealStart + (nodeIndex[id] ?? 0) * nodeStagger;
  const edgeDelay = (from: string) => nodeDelay(from) + 4;

  // Fit the graph into the canvas.
  const scale = fit
    ? Math.min(1, (vw * 0.92) / layout.width, (vh * 0.92) / layout.height)
    : 1;

  return (
    <div style={{ position: 'absolute', inset: 0, background: theme.bg, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        <svg
          width={layout.width}
          height={layout.height}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          style={{ overflow: 'visible' }}
        >
          {/* edges behind nodes */}
          {layout.edges.map((e, i) => (
            <Edge
              key={`${e.from}->${e.to}-${i}`}
              edge={e}
              delay={edgeDelay(e.from)}
              active={activeEdges.has(`${e.from}->${e.to}`)}
            />
          ))}
          {layout.nodes.map((n) => (
            <Node key={n.id} node={n} delay={nodeDelay(n.id)} active={activeNodes.has(n.id)} />
          ))}
          {traces.map((t, i) => (
            <TraceDot key={i} trace={t} nodeMap={nodeMap} />
          ))}
        </svg>
      </div>
    </div>
  );
};
