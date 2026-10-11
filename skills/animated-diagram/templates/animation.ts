import { interpolate, Easing } from 'remotion';

/**
 * Shared animation vocabulary.
 *
 * The names here map to how you talk to the agent. "rise in fast on enter"
 * means riseIn() with the `fast` duration preset and the `out` easing curve.
 * When you and the user coin a new phrase, add it here so it sticks.
 *
 * NOTE: durations are in frames and assume 30fps. At other frame rates, scale
 * by (fps / 30) at the call site.
 */

// Easing curves. Talk about these by name: "out", "snap", "linear", "in-out".
export const BEZIER = {
  /** Standard ease-out — the default for reveals. Decelerates into place. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Snappy with a hint of overshoot — playful entrances. */
  snap: Easing.bezier(0.34, 1.56, 0.64, 1),
  /** No easing — for trace dots moving at constant speed along a path. */
  linear: Easing.linear,
  /** Symmetric ease-in-out — ambient motion and stroke draws. */
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
} as const;

// Duration presets in frames (at 30fps).
export const DURATION = {
  fast: 10,
  base: 18,
  slow: 28,
} as const;

// Default translate offsets in px.
export const OFFSET = {
  rise: 24,
  drop: -24,
  slide: 32,
} as const;

export type EnterArgs = {
  frame: number;
  delay?: number;
  duration?: number;
  easing?: (n: number) => number;
};

/** Normalized 0 -> 1 progress for an enter that starts at `delay`. */
const enterProgress = ({
  frame,
  delay = 0,
  duration = DURATION.base,
  easing = BEZIER.out,
}: EnterArgs): number =>
  interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** "rise in" — fade in while translating up from an offset. */
export const riseIn = (args: EnterArgs & { distance?: number }) => {
  const p = enterProgress(args);
  const distance = args.distance ?? OFFSET.rise;
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * distance}px)`,
  } as const;
};

/** "fade in" — opacity 0 -> 1. */
export const fadeIn = (args: EnterArgs) => ({
  opacity: enterProgress(args),
}) as const;

/** "pop in" — fade in while scaling up from `from` (default 0.92). */
export const scaleIn = (args: EnterArgs & { from?: number }) => {
  const p = enterProgress(args);
  const from = args.from ?? 0.92;
  return {
    opacity: p,
    transform: `scale(${from + (1 - from) * p})`,
  } as const;
};

/**
 * "draw in" — reveal a stroked path from 0 to its full length.
 * Pass the path's total length; returns strokeDasharray/offset to spread on
 * the <path>/<line>/<polyline>.
 */
export const drawIn = (args: EnterArgs & { length: number }) => {
  const p = enterProgress({ ...args, easing: args.easing ?? BEZIER.inOut });
  return {
    strokeDasharray: args.length,
    strokeDashoffset: (1 - p) * args.length,
  } as const;
};
