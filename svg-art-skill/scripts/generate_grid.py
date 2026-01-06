#!/usr/bin/env python3
"""Generate SVG grid patterns.

Examples:
    # Basic grid
    python generate_grid.py -c 6 -r 6 -o grid.svg

    # Grid with variations
    python generate_grid.py -c 8 -r 8 --vary-size --vary-opacity -o varied.svg

    # Diamond grid with hue variation
    python generate_grid.py -c 5 -r 5 --shape diamond --vary-hue -o diamonds.svg

    # Circles with custom colors
    python generate_grid.py -c 10 -r 10 --shape circle --fill "#E11D48" -o circles.svg
"""

import argparse
import math
import sys


def seeded_random(seed: int) -> float:
    """Deterministic pseudo-random number generator."""
    x = math.sin(seed * 9999) * 10000
    return x - math.floor(x)


def generate_rect(x: float, y: float, size: float, fill: str, opacity: float) -> str:
    """Generate rectangle element."""
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{size:.1f}" height="{size:.1f}" fill="{fill}" opacity="{opacity:.2f}"/>'


def generate_circle(x: float, y: float, size: float, fill: str, opacity: float) -> str:
    """Generate circle element."""
    r = size / 2
    cx = x + r
    cy = y + r
    return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="{fill}" opacity="{opacity:.2f}"/>'


def generate_diamond(x: float, y: float, size: float, fill: str, opacity: float) -> str:
    """Generate diamond (rotated square) element."""
    cx = x + size / 2
    cy = y + size / 2
    half = size / 2
    points = f"{cx},{cy - half} {cx + half},{cy} {cx},{cy + half} {cx - half},{cy}"
    return f'<polygon points="{points}" fill="{fill}" opacity="{opacity:.2f}"/>'


def hsl_to_hex(h: float, s: float, l: float) -> str:
    """Convert HSL to hex color."""
    c = (1 - abs(2 * l - 1)) * s
    x = c * (1 - abs((h / 60) % 2 - 1))
    m = l - c / 2

    if h < 60:
        r, g, b = c, x, 0
    elif h < 120:
        r, g, b = x, c, 0
    elif h < 180:
        r, g, b = 0, c, x
    elif h < 240:
        r, g, b = 0, x, c
    elif h < 300:
        r, g, b = x, 0, c
    else:
        r, g, b = c, 0, x

    r, g, b = int((r + m) * 255), int((g + m) * 255), int((b + m) * 255)
    return f"#{r:02x}{g:02x}{b:02x}"


def generate_grid(
    cols: int,
    rows: int,
    size: float,
    gap: float,
    shape: str,
    fill: str,
    base_hue: int,
    vary_size: bool,
    vary_opacity: bool,
    vary_hue: bool,
    seed: int,
) -> str:
    """Generate complete SVG grid."""
    width = cols * (size + gap) - gap
    height = rows * (size + gap) - gap

    shape_funcs = {
        "rect": generate_rect,
        "circle": generate_circle,
        "diamond": generate_diamond,
    }
    shape_func = shape_funcs.get(shape, generate_rect)

    elements = []
    rand_idx = seed

    for row in range(rows):
        for col in range(cols):
            x = col * (size + gap)
            y = row * (size + gap)

            # Apply variations
            elem_size = size
            opacity = 1.0
            elem_fill = fill

            if vary_size:
                rand_idx += 1
                scale = 0.5 + seeded_random(rand_idx) * 0.5
                elem_size = size * scale
                x += (size - elem_size) / 2
                y += (size - elem_size) / 2

            if vary_opacity:
                rand_idx += 1
                opacity = 0.3 + seeded_random(rand_idx) * 0.7

            if vary_hue:
                rand_idx += 1
                hue = (base_hue + seeded_random(rand_idx) * 60 - 30) % 360
                elem_fill = hsl_to_hex(hue, 0.7, 0.55)

            elements.append(shape_func(x, y, elem_size, elem_fill, opacity))

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.1f} {height:.1f}" width="{width:.0f}" height="{height:.0f}">
  <title>Grid Pattern</title>
  {chr(10).join("  " + e for e in elements)}
</svg>'''

    return svg


def main():
    parser = argparse.ArgumentParser(description="Generate SVG grid patterns")
    parser.add_argument("-c", "--cols", type=int, default=6, help="Number of columns")
    parser.add_argument("-r", "--rows", type=int, default=6, help="Number of rows")
    parser.add_argument("-s", "--size", type=float, default=10, help="Element size")
    parser.add_argument("-g", "--gap", type=float, default=2, help="Gap between elements")
    parser.add_argument("--shape", choices=["rect", "circle", "diamond"], default="rect", help="Shape type")
    parser.add_argument("--fill", default="#3B82F6", help="Fill color")
    parser.add_argument("--base-hue", type=int, default=210, help="Base hue for variations")
    parser.add_argument("--vary-size", action="store_true", help="Randomize sizes")
    parser.add_argument("--vary-opacity", action="store_true", help="Randomize opacity")
    parser.add_argument("--vary-hue", action="store_true", help="Randomize hue")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")
    parser.add_argument("-o", "--output", help="Output file (default: stdout)")

    args = parser.parse_args()

    svg = generate_grid(
        cols=args.cols,
        rows=args.rows,
        size=args.size,
        gap=args.gap,
        shape=args.shape,
        fill=args.fill,
        base_hue=args.base_hue,
        vary_size=args.vary_size,
        vary_opacity=args.vary_opacity,
        vary_hue=args.vary_hue,
        seed=args.seed,
    )

    if args.output:
        with open(args.output, "w") as f:
            f.write(svg)
    else:
        print(svg)


if __name__ == "__main__":
    main()
