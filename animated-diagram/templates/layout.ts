import dagre from '@dagrejs/dagre';
import type { DiagramEdge, DiagramNode, ParsedDiagram } from './parse-mermaid';
import { layoutConfig } from './design-system';

/**
 * Auto-layout with dagre. You never place a box by hand — change the Mermaid or
 * the spacing tokens and the whole graph re-flows.
 */

export interface PositionedNode extends DiagramNode {
  /** top-left corner */
  x: number;
  y: number;
  /** center */
  cx: number;
  cy: number;
  width: number;
  height: number;
}

export interface PositionedEdge extends DiagramEdge {
  /** poly-line waypoints from dagre, in graph coordinates */
  points: { x: number; y: number }[];
}

export interface DiagramLayout {
  width: number;
  height: number;
  nodes: PositionedNode[];
  edges: PositionedEdge[];
}

export function layoutDiagram(diagram: ParsedDiagram): DiagramLayout {
  const g = new dagre.graphlib.Graph({ multigraph: true });
  g.setGraph({
    rankdir: diagram.direction,
    ranksep: layoutConfig.rankSep,
    nodesep: layoutConfig.nodeSep,
    marginx: layoutConfig.padding,
    marginy: layoutConfig.padding,
  });
  g.setDefaultEdgeLabel(() => ({}));

  for (const n of diagram.nodes) {
    g.setNode(n.id, {
      width: layoutConfig.nodeWidth,
      height: layoutConfig.nodeHeight,
    });
  }
  // Use an explicit edge name so parallel edges between the same pair survive.
  diagram.edges.forEach((e, i) => {
    g.setEdge(e.from, e.to, { label: e.label ?? '' }, `e${i}`);
  });

  dagre.layout(g);

  const nodes: PositionedNode[] = diagram.nodes.map((n) => {
    const gn = g.node(n.id);
    return {
      ...n,
      cx: gn.x,
      cy: gn.y,
      x: gn.x - gn.width / 2,
      y: gn.y - gn.height / 2,
      width: gn.width,
      height: gn.height,
    };
  });

  const edges: PositionedEdge[] = diagram.edges.map((e, i) => {
    const ge = g.edge(e.from, e.to, `e${i}`);
    return {
      ...e,
      points: ge.points.map((p) => ({ x: p.x, y: p.y })),
    };
  });

  const graph = g.graph();
  return {
    width: graph.width ?? 0,
    height: graph.height ?? 0,
    nodes,
    edges,
  };
}
