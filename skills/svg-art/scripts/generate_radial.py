#!/usr/bin/env python3
"""Generate SVG radial and spiral patterns.

Examples:
    # Simple radial distribution
    python generate_radial.py -n 12 -r 40 --element-size 8 -o radial.svg

    # Spiral pattern
    python generate_radial.py --spiral -n 50 --start-radius 10 --end-radius 45 --turns 3

    # Concentric rings
    python generate_radial.py --concentric --rings 5 --elements-per-ring 8

    # Sunburst pattern
    python generate_radial.py --sunburst -n 24 -r 40
"""

import argparse
import math
import sys


def seeded_random(seed: int) -> float:
    """Deterministic pseudo-random number generator."""
    x = math.sin(seed * 9999) * 10000
    return x - math.floor(x)


def generate_radial(
    count: int,
    radius: float,
    center_x: float,
    center_y: float,
    element_size: float,
    fill: str,
    stroke: str,
    stroke_width: float,
    shape: str,
    start_angle: float,
    vary_size: bool,
    vary_opacity: bool,
    seed: int,
) -> list:
    """Generate elements in a radial pattern."""
    elements = []

    for i in range(count):
        angle = math.radians(start_angle) + (2 * math.pi * i) / count
        x = center_x + radius * math.cos(angle)
        y = center_y + radius * math.sin(angle)

        r = seeded_random(seed + i)
        size = element_size * (0.5 + r * 0.5) if vary_size else element_size
        opacity = 0.4 + seeded_random(seed + i + 1000) * 0.6 if vary_opacity else 1.0

        opacity_attr = f' opacity="{opacity:.2f}"' if opacity < 1 else ""
        stroke_attr = f' stroke="{stroke}" stroke-width="{stroke_width}"' if stroke != "none" else ""

        if shape == "circle":
            elem = f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{size:.1f}" fill="{fill}"{stroke_attr}{opacity_attr}/>'
        elif shape == "rect":
            elem = f'<rect x="{x - size:.1f}" y="{y - size:.1f}" width="{size * 2:.1f}" height="{size * 2:.1f}" fill="{fill}"{stroke_attr}{opacity_attr} transform="rotate({math.degrees(angle):.1f} {x:.1f} {y:.1f})"/>'
        else:  # line (for sunburst)
            x2 = center_x + (radius + size * 3) * math.cos(angle)
            y2 = center_y + (radius + size * 3) * math.sin(angle)
            elem = f'<line x1="{x:.1f}" y1="{y:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{fill}" stroke-width="{stroke_width}"{opacity_attr}/>'

        elements.append(elem)

    return elements


def generate_spiral(
    count: int,
    start_radius: float,
    end_radius: float,
    turns: float,
    center_x: float,
    center_y: float,
    element_size: float,
    fill: str,
    stroke: str,
    stroke_width: float,
    vary_size: bool,
    seed: int,
) -> list:
    """Generate elements in a spiral pattern."""
    elements = []

    for i in range(count):
        t = i / (count - 1) if count > 1 else 0
        angle = turns * 2 * math.pi * t - math.pi / 2
        radius = start_radius + (end_radius - start_radius) * t

        x = center_x + radius * math.cos(angle)
        y = center_y + radius * math.sin(angle)

        r = seeded_random(seed + i)
        size = element_size * (0.5 + t * 0.5) if vary_size else element_size

        stroke_attr = f' stroke="{stroke}" stroke-width="{stroke_width}"' if stroke != "none" else ""
        elem = f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{size:.1f}" fill="{fill}"{stroke_attr}/>'
        elements.append(elem)

    return elements


def generate_concentric(
    rings: int,
    elements_per_ring: int,
    min_radius: float,
    max_radius: float,
    center_x: float,
    center_y: float,
    element_size: float,
    fill: str,
    stroke: str,
    stroke_width: float,
    vary_hue: bool,
    base_hue: int,
    seed: int,
) -> list:
    """Generate concentric rings of elements."""
    elements = []

    for ring in range(rings):
        t = ring / (rings - 1) if rings > 1 else 0
        radius = min_radius + (max_radius - min_radius) * t
        count = elements_per_ring + ring * 4  # More elements in outer rings

        if vary_hue:
            hue = (base_hue + ring * 30) % 360
            ring_fill = f"hsl({hue}, 70%, 55%)"
        else:
            ring_fill = fill

        for i in range(count):
            angle = (2 * math.pi * i) / count + (ring * 0.2)  # Offset each ring
            x = center_x + radius * math.cos(angle)
            y = center_y + radius * math.sin(angle)

            size = element_size * (0.6 + t * 0.4)

            stroke_attr = f' stroke="{stroke}" stroke-width="{stroke_width}"' if stroke != "none" else ""
            elem = f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{size:.1f}" fill="{ring_fill}"{stroke_attr}/>'
            elements.append(elem)

    return elements


def generate_sunburst(
    count: int,
    inner_radius: float,
    outer_radius: float,
    center_x: float,
    center_y: float,
    fill: str,
    stroke_width: float,
    vary_length: bool,
    seed: int,
) -> list:
    """Generate sunburst/ray pattern."""
    elements = []

    for i in range(count):
        angle = (2 * math.pi * i) / count - math.pi / 2

        r = seeded_random(seed + i)
        length = outer_radius * (0.6 + r * 0.4) if vary_length else outer_radius

        x1 = center_x + inner_radius * math.cos(angle)
        y1 = center_y + inner_radius * math.sin(angle)
        x2 = center_x + length * math.cos(angle)
        y2 = center_y + length * math.sin(angle)

        elem = f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{fill}" stroke-width="{stroke_width}" stroke-linecap="round"/>'
        elements.append(elem)

    return elements


def main():
    parser = argparse.ArgumentParser(description="Generate SVG radial patterns")

    # Pattern type
    parser.add_argument("--spiral", action="store_true", help="Generate spiral pattern")
    parser.add_argument("--concentric", action="store_true", help="Generate concentric rings")
    parser.add_argument("--sunburst", action="store_true", help="Generate sunburst pattern")

    # Common options
    parser.add_argument("-n", "--count", type=int, default=12, help="Number of elements")
    parser.add_argument("-r", "--radius", type=float, default=40, help="Radius")
    parser.add_argument("--element-size", type=float, default=5, help="Size of each element")
    parser.add_argument("--fill", default="#3B82F6", help="Fill color")
    parser.add_argument("--stroke", default="none", help="Stroke color")
    parser.add_argument("--stroke-width", type=float, default=2, help="Stroke width")
    parser.add_argument("--shape", choices=["circle", "rect", "line"], default="circle", help="Shape type")
    parser.add_argument("--start-angle", type=float, default=-90, help="Start angle in degrees")
    parser.add_argument("--viewbox", type=int, default=100, help="ViewBox size")

    # Spiral options
    parser.add_argument("--start-radius", type=float, default=10, help="Spiral start radius")
    parser.add_argument("--end-radius", type=float, default=45, help="Spiral end radius")
    parser.add_argument("--turns", type=float, default=3, help="Number of spiral turns")

    # Concentric options
    parser.add_argument("--rings", type=int, default=4, help="Number of concentric rings")
    parser.add_argument("--elements-per-ring", type=int, default=6, help="Elements in innermost ring")

    # Variation options
    parser.add_argument("--vary-size", action="store_true", help="Vary element sizes")
    parser.add_argument("--vary-opacity", action="store_true", help="Vary element opacity")
    parser.add_argument("--vary-hue", action="store_true", help="Vary hue across rings")
    parser.add_argument("--vary-length", action="store_true", help="Vary ray length (sunburst)")
    parser.add_argument("--base-hue", type=int, default=217, help="Base hue (0-360)")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")

    parser.add_argument("-o", "--output", help="Output file (default: stdout)")

    args = parser.parse_args()

    vb = args.viewbox
    cx, cy = vb / 2, vb / 2

    if args.spiral:
        elements = generate_spiral(
            count=args.count,
            start_radius=args.start_radius,
            end_radius=args.end_radius,
            turns=args.turns,
            center_x=cx,
            center_y=cy,
            element_size=args.element_size,
            fill=args.fill,
            stroke=args.stroke,
            stroke_width=args.stroke_width,
            vary_size=args.vary_size,
            seed=args.seed,
        )
        desc = f"A spiral pattern with {args.count} elements"
    elif args.concentric:
        elements = generate_concentric(
            rings=args.rings,
            elements_per_ring=args.elements_per_ring,
            min_radius=args.element_size * 3,
            max_radius=args.radius,
            center_x=cx,
            center_y=cy,
            element_size=args.element_size,
            fill=args.fill,
            stroke=args.stroke,
            stroke_width=args.stroke_width,
            vary_hue=args.vary_hue,
            base_hue=args.base_hue,
            seed=args.seed,
        )
        desc = f"Concentric rings with {args.rings} layers"
    elif args.sunburst:
        elements = generate_sunburst(
            count=args.count,
            inner_radius=args.element_size * 2,
            outer_radius=args.radius,
            center_x=cx,
            center_y=cy,
            fill=args.fill,
            stroke_width=args.stroke_width,
            vary_length=args.vary_length,
            seed=args.seed,
        )
        desc = f"A sunburst pattern with {args.count} rays"
    else:
        elements = generate_radial(
            count=args.count,
            radius=args.radius,
            center_x=cx,
            center_y=cy,
            element_size=args.element_size,
            fill=args.fill,
            stroke=args.stroke,
            stroke_width=args.stroke_width,
            shape=args.shape,
            start_angle=args.start_angle,
            vary_size=args.vary_size,
            vary_opacity=args.vary_opacity,
            seed=args.seed,
        )
        desc = f"A radial pattern with {args.count} elements"

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {vb} {vb}" width="{vb}" height="{vb}">
  <title>Radial Pattern</title>
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
