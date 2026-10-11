#!/usr/bin/env python3
"""Generate SVG wave and organic patterns.

Examples:
    # Simple sine wave
    python generate_wave.py -o wave.svg

    # Multiple layered waves
    python generate_wave.py --layers 5 --fill

    # Noise-based organic wave
    python generate_wave.py --noise --amplitude 20

    # Sound wave / audio visualization style
    python generate_wave.py --bars --count 50
"""

import argparse
import math
import sys


def seeded_random(seed: int) -> float:
    """Deterministic pseudo-random number generator."""
    x = math.sin(seed * 9999) * 10000
    return x - math.floor(x)


def smooth_noise(x: float, seed: int = 0) -> float:
    """Simple smooth noise function."""
    x0 = int(math.floor(x))
    x1 = x0 + 1
    t = x - x0
    smooth = t * t * (3 - 2 * t)  # smoothstep

    n0 = seeded_random(x0 + seed * 1000)
    n1 = seeded_random(x1 + seed * 1000)

    return n0 + smooth * (n1 - n0)


def generate_wave_path(
    width: float,
    amplitude: float,
    frequency: float,
    phase: float,
    y_offset: float,
    steps: int,
    noise_amount: float,
    seed: int,
) -> str:
    """Generate a wave path."""
    points = []

    for i in range(steps + 1):
        t = i / steps
        x = t * width

        # Base sine wave
        y = y_offset + math.sin(t * frequency * math.pi * 2 + phase) * amplitude

        # Add noise if specified
        if noise_amount > 0:
            noise = (smooth_noise(t * 10, seed) - 0.5) * 2 * noise_amount
            y += noise

        if i == 0:
            points.append(f"M{x:.1f},{y:.1f}")
        else:
            points.append(f"L{x:.1f},{y:.1f}")

    return " ".join(points)


def generate_filled_wave(
    width: float,
    height: float,
    amplitude: float,
    frequency: float,
    phase: float,
    y_offset: float,
    steps: int,
    fill_to_bottom: bool,
) -> str:
    """Generate a filled wave area."""
    points = []

    for i in range(steps + 1):
        t = i / steps
        x = t * width
        y = y_offset + math.sin(t * frequency * math.pi * 2 + phase) * amplitude

        if i == 0:
            points.append(f"M{x:.1f},{y:.1f}")
        else:
            points.append(f"L{x:.1f},{y:.1f}")

    if fill_to_bottom:
        points.append(f"L{width:.1f},{height:.1f}")
        points.append(f"L0,{height:.1f}")
        points.append("Z")

    return " ".join(points)


def generate_layered_waves(
    layers: int,
    width: float,
    height: float,
    base_amplitude: float,
    base_frequency: float,
    base_hue: int,
    fill: bool,
    seed: int,
) -> list:
    """Generate multiple layered waves."""
    elements = []

    for i in range(layers):
        t = i / (layers - 1) if layers > 1 else 0

        # Each layer has different parameters
        y_offset = height * 0.3 + t * height * 0.5
        amplitude = base_amplitude * (1 - t * 0.3)
        frequency = base_frequency + i * 0.5
        phase = i * 0.5

        # Color gradient
        hue = (base_hue + i * 15) % 360
        lightness = 50 + i * 5
        opacity = 0.3 + t * 0.4
        color = f"hsl({hue}, 70%, {lightness}%)"

        if fill:
            path_d = generate_filled_wave(
                width, height, amplitude, frequency, phase, y_offset, 100, True
            )
            elements.append(f'<path d="{path_d}" fill="{color}" fill-opacity="{opacity:.2f}"/>')
        else:
            path_d = generate_wave_path(
                width, amplitude, frequency, phase, y_offset, 100, 0, seed + i
            )
            elements.append(f'<path d="{path_d}" fill="none" stroke="{color}" stroke-width="2" opacity="{opacity:.2f}"/>')

    return elements


def generate_noise_wave(
    width: float,
    height: float,
    amplitude: float,
    noise_scale: float,
    y_offset: float,
    steps: int,
    stroke: str,
    stroke_width: float,
    seed: int,
) -> list:
    """Generate organic noise-based wave."""
    points = []

    for i in range(steps + 1):
        t = i / steps
        x = t * width

        # Layer multiple noise frequencies
        noise = 0
        noise += (smooth_noise(t * noise_scale, seed) - 0.5) * 2
        noise += (smooth_noise(t * noise_scale * 2, seed + 100) - 0.5) * 1
        noise += (smooth_noise(t * noise_scale * 4, seed + 200) - 0.5) * 0.5

        y = y_offset + noise * amplitude

        if i == 0:
            points.append(f"M{x:.1f},{y:.1f}")
        else:
            points.append(f"L{x:.1f},{y:.1f}")

    path_d = " ".join(points)
    return [f'<path d="{path_d}" fill="none" stroke="{stroke}" stroke-width="{stroke_width}" stroke-linecap="round"/>']


def generate_bar_wave(
    count: int,
    width: float,
    height: float,
    max_bar_height: float,
    bar_width: float,
    gap: float,
    fill: str,
    vary_height: bool,
    seed: int,
) -> list:
    """Generate bar/equalizer style wave visualization."""
    elements = []

    total_width = count * bar_width + (count - 1) * gap
    start_x = (width - total_width) / 2
    center_y = height / 2

    for i in range(count):
        x = start_x + i * (bar_width + gap)

        if vary_height:
            # Use noise for smooth variation
            t = i / count
            noise = smooth_noise(t * 5, seed)
            bar_h = max_bar_height * (0.2 + noise * 0.8)
        else:
            # Sine wave pattern
            t = i / count
            bar_h = max_bar_height * (0.3 + math.sin(t * math.pi * 4) * 0.5 + 0.2)

        y = center_y - bar_h / 2

        elements.append(
            f'<rect x="{x:.1f}" y="{y:.1f}" width="{bar_width:.1f}" height="{bar_h:.1f}" '
            f'fill="{fill}" rx="{bar_width / 2:.1f}"/>'
        )

    return elements


def main():
    parser = argparse.ArgumentParser(description="Generate SVG wave patterns")

    # Pattern type
    parser.add_argument("--layers", type=int, default=0, help="Number of layered waves (0 for single)")
    parser.add_argument("--noise", action="store_true", help="Generate noise-based organic wave")
    parser.add_argument("--bars", action="store_true", help="Generate bar/equalizer style")

    # Wave options
    parser.add_argument("--amplitude", type=float, default=15, help="Wave amplitude")
    parser.add_argument("--frequency", type=float, default=2, help="Wave frequency")
    parser.add_argument("--phase", type=float, default=0, help="Phase offset")
    parser.add_argument("--fill", action="store_true", help="Fill waves to bottom")

    # Bar options
    parser.add_argument("--count", type=int, default=30, help="Number of bars")
    parser.add_argument("--bar-width", type=float, default=3, help="Width of each bar")
    parser.add_argument("--bar-gap", type=float, default=2, help="Gap between bars")

    # Noise options
    parser.add_argument("--noise-scale", type=float, default=8, help="Noise scale")

    # Common options
    parser.add_argument("--width", type=float, default=200, help="SVG width")
    parser.add_argument("--height", type=float, default=100, help="SVG height")
    parser.add_argument("--stroke", default="#3B82F6", help="Stroke color")
    parser.add_argument("--stroke-width", type=float, default=2, help="Stroke width")
    parser.add_argument("--base-hue", type=int, default=217, help="Base hue for colors")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")

    parser.add_argument("-o", "--output", help="Output file (default: stdout)")

    args = parser.parse_args()

    if args.bars:
        elements = generate_bar_wave(
            count=args.count,
            width=args.width,
            height=args.height,
            max_bar_height=args.height * 0.7,
            bar_width=args.bar_width,
            gap=args.bar_gap,
            fill=args.stroke,
            vary_height=True,
            seed=args.seed,
        )
        title = "Bar Wave"
        desc = f"Audio visualization with {args.count} bars"
    elif args.noise:
        elements = generate_noise_wave(
            width=args.width,
            height=args.height,
            amplitude=args.amplitude,
            noise_scale=args.noise_scale,
            y_offset=args.height / 2,
            steps=200,
            stroke=args.stroke,
            stroke_width=args.stroke_width,
            seed=args.seed,
        )
        title = "Noise Wave"
        desc = "Organic noise-based wave pattern"
    elif args.layers > 0:
        elements = generate_layered_waves(
            layers=args.layers,
            width=args.width,
            height=args.height,
            base_amplitude=args.amplitude,
            base_frequency=args.frequency,
            base_hue=args.base_hue,
            fill=args.fill,
            seed=args.seed,
        )
        title = "Layered Waves"
        desc = f"Multiple layered wave pattern with {args.layers} layers"
    else:
        path_d = generate_wave_path(
            width=args.width,
            amplitude=args.amplitude,
            frequency=args.frequency,
            phase=args.phase,
            y_offset=args.height / 2,
            steps=100,
            noise_amount=0,
            seed=args.seed,
        )
        elements = [f'<path d="{path_d}" fill="none" stroke="{args.stroke}" stroke-width="{args.stroke_width}"/>']
        title = "Sine Wave"
        desc = "Simple sine wave pattern"

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {args.width} {args.height}" width="{args.width:.0f}" height="{args.height:.0f}">
  <title>{title}</title>
  <desc>{desc}</desc>
  {chr(10).join("  " + e for e in elements)}
</svg>'''

    if args.output:
        with open(args.output, "w") as f:
            f.write(svg)
        print(f"Generated: {args.output}", file=sys.stderr)
    else:
        print(svg)


if __name__ == "__main__":
    main()
