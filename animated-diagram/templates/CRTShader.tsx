import React from 'react';
import { useCurrentFrame } from 'remotion';

/**
 * CRT post-process wrapper — the "finish". Scanlines, a rolling scan band,
 * vignette, flicker and a faint chroma glow give the retro-terminal look.
 *
 * It's a separate component on purpose: the board stays clean and reusable, and
 * the aesthetic is one wrapper you add or drop. Pure CSS/SVG and fully
 * deterministic (sine-driven, no Math.random), so it renders reliably in
 * Remotion across all frames.
 */

export const CRTShader: React.FC<{ children: React.ReactNode; tint?: string }> = ({
  children,
  tint = 'rgba(80,120,255,0.08)',
}) => {
  const frame = useCurrentFrame();

  // Deterministic flicker.
  const flicker = 0.985 + Math.sin(frame * 0.8) * 0.01 + Math.sin(frame * 2.3) * 0.004;
  // Rolling scan band position (loops down the screen).
  const bandTop = ((frame * 0.6) % 140) - 20;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#000' }}>
      {/* content */}
      <div style={{ position: 'absolute', inset: 0, opacity: flicker, filter: 'saturate(1.08) contrast(1.04)' }}>
        {children}
      </div>

      {/* scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 1px, transparent 1px, transparent 3px)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* rolling scan band */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${bandTop}%`,
          height: '16%',
          pointerEvents: 'none',
          background: 'linear-gradient(transparent, rgba(255,255,255,0.045), transparent)',
        }}
      />

      {/* vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* chroma glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          boxShadow: `inset 0 0 140px ${tint}`,
        }}
      />
    </div>
  );
};
