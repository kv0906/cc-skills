import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { theme, layoutConfig } from './design-system';
import { drawIn } from './animation';
import type { PositionedEdge } from './layout';

/**
 * An edge: a poly-line through dagre's waypoints that "draws in" along its
 * length, with an arrowhead that fades in once the line reaches its target, and
 * an optional label at the midpoint.
 */

type Pt = { x: number; y: number };

const toPath = (pts: Pt[]): string =>
  pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

const polyLength = (pts: Pt[]): number =>
  pts.reduce((acc, p, i) => (i === 0 ? 0 : acc + Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y)), 0);

const Arrow: React.FC<{ pts: Pt[]; color: string; appearAt: number }> = ({ pts, color, appearAt }) => {
  const frame = useCurrentFrame();
  const a = pts[pts.length - 2] ?? pts[0];
  const b = pts[pts.length - 1];
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const size = 9;
  const spread = Math.PI / 7;
  const p1 = { x: b.x - size * Math.cos(ang - spread), y: b.y - size * Math.sin(ang - spread) };
  const p2 = { x: b.x - size * Math.cos(ang + spread), y: b.y - size * Math.sin(ang + spread) };
  const opacity = interpolate(frame, [appearAt, appearAt + 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <polygon points={`${b.x},${b.y} ${p1.x},${p1.y} ${p2.x},${p2.y}`} fill={color} opacity={opacity} />;
};

export const Edge: React.FC<{
  edge: PositionedEdge;
  delay: number;
  duration?: number;
  active?: boolean;
}> = ({ edge, delay, duration = 22, active }) => {
  const pts = edge.points;
  if (pts.length < 2) return null;

  const frame = useCurrentFrame();
  const len = polyLength(pts);
  const { strokeDasharray, strokeDashoffset } = drawIn({ frame, delay, duration, length: len });
  const color = active ? theme.accent : theme.edge;

  const mid = pts[Math.floor(pts.length / 2)];

  return (
    <g style={{ filter: active ? `drop-shadow(0 0 8px ${theme.accent})` : 'none' }}>
      <path
        d={toPath(pts)}
        fill="none"
        stroke={color}
        strokeWidth={layoutConfig.edgeStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
      />
      <Arrow pts={pts} color={color} appearAt={delay + duration - 4} />
      {edge.label ? (
        <g
          style={{
            opacity: interpolate(frame, [delay + duration - 6, delay + duration + 4], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <rect
            x={mid.x - edge.label.length * 4 - 6}
            y={mid.y - 11}
            width={edge.label.length * 8 + 12}
            height={22}
            rx={6}
            fill={theme.bg}
          />
          <text
            x={mid.x}
            y={mid.y + 4}
            textAnchor="middle"
            fill={theme.edgeLabel}
            fontFamily={theme.font.mono}
            fontSize={12}
          >
            {edge.label}
          </text>
        </g>
      ) : null}
    </g>
  );
};
