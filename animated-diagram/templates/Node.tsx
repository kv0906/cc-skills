import React from 'react';
import { useCurrentFrame } from 'remotion';
import { theme, layoutConfig } from './design-system';
import { riseIn } from './animation';
import type { PositionedNode } from './layout';

/**
 * A single diagram node. Rendered inside the board's <svg>: the shape is an SVG
 * primitive (so any polygon gets a clean stroke) and the label lives in a
 * <foreignObject> (so HTML, including <br/>, just works). Both share one
 * animated <g> so they reveal together.
 */

const Shape: React.FC<{ node: PositionedNode; stroke: string }> = ({ node, stroke }) => {
  const { cx, cy, width: w, height: h, shape } = node;
  const x = cx - w / 2;
  const y = cy - h / 2;
  const common = {
    fill: theme.node.fill,
    stroke,
    strokeWidth: layoutConfig.nodeStrokeWidth,
  };

  switch (shape) {
    case 'diamond':
      return <polygon points={`${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`} {...common} />;
    case 'hexagon': {
      const i = w * 0.22;
      return (
        <polygon
          points={`${x + i},${y} ${x + w - i},${y} ${x + w},${cy} ${x + w - i},${y + h} ${x + i},${y + h} ${x},${cy}`}
          {...common}
        />
      );
    }
    case 'stadium':
    case 'round':
      return <rect x={x} y={y} width={w} height={h} rx={h / 2} ry={h / 2} {...common} />;
    case 'rect':
    default:
      return <rect x={x} y={y} width={w} height={h} rx={layoutConfig.borderRadius} {...common} />;
  }
};

export const Node: React.FC<{
  node: PositionedNode;
  delay: number;
  active?: boolean;
}> = ({ node, delay, active }) => {
  const frame = useCurrentFrame();
  const { opacity, transform } = riseIn({ frame, delay });
  const stroke = active ? theme.accent : theme.node.stroke;

  return (
    <g
      style={{
        opacity,
        transform,
        transformBox: 'fill-box',
        transformOrigin: 'center',
        filter: active ? `drop-shadow(0 0 12px ${theme.accent})` : 'none',
      }}
    >
      <Shape node={node} stroke={stroke} />
      <foreignObject
        x={node.cx - node.width / 2}
        y={node.cy - node.height / 2}
        width={node.width}
        height={node.height}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 14px',
            boxSizing: 'border-box',
            color: theme.node.text,
            fontFamily: theme.font.body,
            fontSize: layoutConfig.fontSize,
            lineHeight: 1.25,
          }}
          // labels come from trusted Mermaid you authored; <br/> is the point
          dangerouslySetInnerHTML={{ __html: node.label }}
        />
      </foreignObject>
    </g>
  );
};
