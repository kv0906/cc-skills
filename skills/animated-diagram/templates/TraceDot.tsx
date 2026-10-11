import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { theme } from './design-system';
import { BEZIER } from './animation';
import type { PositionedNode } from './layout';

/**
 * The trace event: a dot that walks a list of node ids. As it reaches each
 * node, the board lights up that node (and the edge it just crossed). This is
 * how follow-ups become *data* — you describe a traversal, not a redraw.
 */

export interface Trace {
  /** node ids, in visit order */
  path: string[];
  /** frame the dot starts moving */
  startFrame: number;
  /** frames to travel one hop (default 16) */
  segDuration?: number;
  /** frames a reached node stays lit (default Infinity) */
  holdDuration?: number;
}

export type NodeMap = Record<string, PositionedNode>;

const seg = (t: Trace) => t.segDuration ?? 16;
const hold = (t: Trace) => t.holdDuration ?? Number.POSITIVE_INFINITY;

/** Set of node ids that should be lit at `frame`. */
export const activeTraceNodes = (t: Trace, frame: number): Set<string> => {
  const set = new Set<string>();
  t.path.forEach((id, i) => {
    const reachAt = t.startFrame + i * seg(t);
    if (frame >= reachAt && frame <= reachAt + hold(t)) set.add(id);
  });
  return set;
};

/** Set of "from->to" keys for edges the trace has crossed by `frame`. */
export const activeTraceEdges = (t: Trace, frame: number): Set<string> => {
  const set = new Set<string>();
  for (let i = 0; i < t.path.length - 1; i++) {
    const startAt = t.startFrame + i * seg(t);
    if (frame >= startAt) set.add(`${t.path[i]}->${t.path[i + 1]}`);
  }
  return set;
};

export const TraceDot: React.FC<{ trace: Trace; nodeMap: NodeMap }> = ({ trace, nodeMap }) => {
  const frame = useCurrentFrame();
  const s = seg(trace);

  const pts = trace.path.map((id) => nodeMap[id]).filter(Boolean).map((n) => ({ x: n.cx, y: n.cy }));
  if (pts.length < 1) return null;

  const raw = (frame - trace.startFrame) / s;
  if (raw < 0) return null;

  const clamped = Math.min(raw, pts.length - 1);
  const i0 = Math.floor(clamped);
  const i1 = Math.min(i0 + 1, pts.length - 1);
  const f = interpolate(clamped - i0, [0, 1], [0, 1], { easing: BEZIER.inOut });

  const x = pts[i0].x + (pts[i1].x - pts[i0].x) * f;
  const y = pts[i0].y + (pts[i1].y - pts[i0].y) * f;

  return (
    <g>
      <circle cx={x} cy={y} r={11} fill={theme.accent} opacity={0.22} />
      <circle cx={x} cy={y} r={5} fill={theme.accent} style={{ filter: `drop-shadow(0 0 8px ${theme.accent})` }} />
    </g>
  );
};
