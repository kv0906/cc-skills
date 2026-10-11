#!/usr/bin/env python3
"""Generate SVG fractal patterns (trees, snowflakes, sierpinski, etc.).

Examples:
    # Fractal tree
    python generate_fractal.py --tree --depth 8 -o tree.svg

    # Koch snowflake
    python generate_fractal.py --koch --depth 4 -o snowflake.svg

    # Sierpinski triangle
    python generate_fractal.py --sierpinski --depth 5 -o sierpinski.svg

    # Recursive circles
    python generate_fractal.py --circles --depth 4 -o circles.svg
"""

import argparse
import math
import sys


def seeded_random(seed: int) -> float:
    """Deterministic pseudo-random number generator."""
    x = math.sin(seed * 9999) * 10000
    return x - math.floor(x)


def generate_tree(
    x: float,
    y: float,
    length: float,
    angle: float,
    depth: int,
    branch_angle: float,
    length_ratio: float,
    stroke: str,
    vary_angle: bool,
    seed: int,
) -> list:
    """Generate fractal tree branches recursively."""
    if depth == 0 or length < 1:
        return []

    x2 = x + length * math.cos(angle)
    y2 = y + length * math.sin(angle)

    stroke_width = max(0.5, depth * 0.8)
    line = f'<line x1="{x:.1f}" y1="{y:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{stroke}" stroke-width="{stroke_width:.1f}" stroke-linecap="round"/>'

    elements = [line]

    # Branch variations
    r = seeded_random(seed + depth * 100)
    left_angle = branch_angle * (0.8 + r * 0.4) if vary_angle else branch_angle
    right_angle = branch_angle * (0.8 + seeded_random(seed + depth * 100 + 1) * 0.4) if vary_angle else branch_angle

    # Left branch
    elements.extend(generate_tree(
        x2, y2, length * length_ratio,
        angle - left_angle,
        depth - 1, branch_angle, length_ratio, stroke, vary_angle, seed + 1
    ))

    # Right branch
    elements.extend(generate_tree(
        x2, y2, length * length_ratio,
        angle + right_angle,
        depth - 1, branch_angle, length_ratio, stroke, vary_angle, seed + 2
    ))

    return elements


def koch_segment(x1: float, y1: float, x2: float, y2: float, depth: int) -> str:
    """Generate Koch curve segment recursively."""
    if depth == 0:
        return f"L{x2:.1f},{y2:.1f}"

    dx = x2 - x1
    dy = y2 - y1

    # Divide into thirds
    ax = x1 + dx / 3
    ay = y1 + dy / 3
    bx = x1 + dx * 2 / 3
    by = y1 + dy * 2 / 3

    # Peak point (equilateral triangle)
    px = (ax + bx) / 2 - dy * math.sqrt(3) / 6
    py = (ay + by) / 2 + dx * math.sqrt(3) / 6

    return (
        koch_segment(x1, y1, ax, ay, depth - 1) +
        koch_segment(ax, ay, px, py, depth - 1) +
        koch_segment(px, py, bx, by, depth - 1) +
        koch_segment(bx, by, x2, y2, depth - 1)
    )


def generate_koch_snowflake(
    cx: float,
    cy: float,
    size: float,
    depth: int,
    stroke: str,
    stroke_width: float,
    fill: str,
) -> list:
    """Generate Koch snowflake."""
    # Start with equilateral triangle
    h = size * math.sqrt(3) / 2

    p1 = (cx, cy - h * 2 / 3)
    p2 = (cx - size / 2, cy + h / 3)
    p3 = (cx + size / 2, cy + h / 3)

    path_d = f"M{p1[0]:.1f},{p1[1]:.1f}"
    path_d += koch_segment(p1[0], p1[1], p2[0], p2[1], depth)
    path_d += koch_segment(p2[0], p2[1], p3[0], p3[1], depth)
    path_d += koch_segment(p3[0], p3[1], p1[0], p1[1], depth)
    path_d += " Z"

    fill_attr = f'fill="{fill}"' if fill != "none" else 'fill="none"'
    return [f'<path d="{path_d}" {fill_attr} stroke="{stroke}" stroke-width="{stroke_width}"/>']


def generate_sierpinski(
    x: float,
    y: float,
    size: float,
    depth: int,
    fill: str,
    stroke: str,
    stroke_width: float,
) -> list:
    """Generate Sierpinski triangle recursively."""
    h = size * math.sqrt(3) / 2

    if depth == 0:
        points = f"{x:.1f},{y + h:.1f} {x + size / 2:.1f},{y:.1f} {x + size:.1f},{y + h:.1f}"
        stroke_attr = f' stroke="{stroke}" stroke-width="{stroke_width}"' if stroke != "none" else ""
        return [f'<polygon points="{points}" fill="{fill}"{stroke_attr}/>']

    half = size / 2
    h_half = half * math.sqrt(3) / 2

    elements = []
    # Bottom-left triangle
    elements.extend(generate_sierpinski(x, y + h_half, half, depth - 1, fill, stroke, stroke_width))
    # Top triangle
    elements.extend(generate_sierpinski(x + half / 2, y, half, depth - 1, fill, stroke, stroke_width))
    # Bottom-right triangle
    elements.extend(generate_sierpinski(x + half, y + h_half, half, depth - 1, fill, stroke, stroke_width))

    return elements


def generate_recursive_circles(
    cx: float,
    cy: float,
    radius: float,
    depth: int,
    fill: str,
    stroke: str,
    stroke_width: float,
    ratio: float,
) -> list:
    """Generate recursively nested circles."""
    if depth == 0 or radius < 1:
        return []

    stroke_attr = f' stroke="{stroke}" stroke-width="{stroke_width}"' if stroke != "none" else ""
    elements = [f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{radius:.1f}" fill="{fill}" fill-opacity="0.3"{stroke_attr}/>']

    # Four smaller circles at cardinal points
    new_radius = radius * ratio
    offset = radius - new_radius

    for angle in [0, math.pi / 2, math.pi, 3 * math.pi / 2]:
        nx = cx + offset * math.cos(angle)
        ny = cy + offset * math.sin(angle)
        elements.extend(generate_recursive_circles(nx, ny, new_radius, depth - 1, fill, stroke, stroke_width, ratio))

    return elements


def main():
    parser = argparse.ArgumentParser(description="Generate SVG fractal patterns")

    # Pattern type
    parser.add_argument("--tree", action="store_true", help="Generate fractal tree")
    parser.add_argument("--koch", action="store_true", help="Generate Koch snowflake")
    parser.add_argument("--sierpinski", action="store_true", help="Generate Sierpinski triangle")
    parser.add_argument("--circles", action="store_true", help="Generate recursive circles")

    # Common options
    parser.add_argument("--depth", type=int, default=5, help="Recursion depth")
    parser.add_argument("--size", type=float, default=80, help="Base size")
    parser.add_argument("--fill", default="#3B82F6", help="Fill color")
    parser.add_argument("--stroke", default="#1E40AF", help="Stroke color")
    parser.add_argument("--stroke-width", type=float, default=1, help="Stroke width")
    parser.add_argument("--viewbox", type=int, default=100, help="ViewBox size")

    # Tree options
    parser.add_argument("--branch-angle", type=float, default=0.5, help="Branch angle in radians")
    parser.add_argument("--length-ratio", type=float, default=0.7, help="Length reduction ratio")
    parser.add_argument("--vary-angle", action="store_true", help="Add random variation to angles")

    # Circle options
    parser.add_argument("--ratio", type=float, default=0.45, help="Size ratio for recursive circles")

    parser.add_argument("--seed", type=int, default=42, help="Random seed")
    parser.add_argument("-o", "--output", help="Output file (default: stdout)")

    args = parser.parse_args()

    vb = args.viewbox
    cx, cy = vb / 2, vb / 2

    if args.tree:
        # Tree grows upward from bottom center
        elements = generate_tree(
            x=cx,
            y=vb - 10,
            length=args.size * 0.3,
            angle=-math.pi / 2,  # Point upward
            depth=args.depth,
            branch_angle=args.branch_angle,
            length_ratio=args.length_ratio,
            stroke=args.stroke,
            vary_angle=args.vary_angle,
            seed=args.seed,
        )
        title = "Fractal Tree"
        desc = f"A fractal tree with depth {args.depth}"
    elif args.koch:
        elements = generate_koch_snowflake(
            cx=cx,
            cy=cy,
            size=args.size,
            depth=args.depth,
            stroke=args.stroke,
            stroke_width=args.stroke_width,
            fill=args.fill,
        )
        title = "Koch Snowflake"
        desc = f"A Koch snowflake with depth {args.depth}"
    elif args.sierpinski:
        # Center the triangle
        h = args.size * math.sqrt(3) / 2
        start_x = cx - args.size / 2
        start_y = cy - h / 2
        elements = generate_sierpinski(
            x=start_x,
            y=start_y,
            size=args.size,
            depth=args.depth,
            fill=args.fill,
            stroke=args.stroke,
            stroke_width=args.stroke_width,
        )
        title = "Sierpinski Triangle"
        desc = f"A Sierpinski triangle with depth {args.depth}"
    elif args.circles:
        elements = generate_recursive_circles(
            cx=cx,
            cy=cy,
            radius=args.size / 2,
            depth=args.depth,
            fill=args.fill,
            stroke=args.stroke,
            stroke_width=args.stroke_width,
            ratio=args.ratio,
        )
        title = "Recursive Circles"
        desc = f"Recursive circles with depth {args.depth}"
    else:
        # Default to tree
        elements = generate_tree(
            x=cx, y=vb - 10, length=args.size * 0.3, angle=-math.pi / 2,
            depth=args.depth, branch_angle=args.branch_angle,
            length_ratio=args.length_ratio, stroke=args.stroke,
            vary_angle=args.vary_angle, seed=args.seed,
        )
        title = "Fractal Tree"
        desc = f"A fractal tree with depth {args.depth}"

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {vb} {vb}" width="{vb}" height="{vb}">
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
