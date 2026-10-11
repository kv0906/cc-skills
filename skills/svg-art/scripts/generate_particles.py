#!/usr/bin/env python3
"""Generate SVG particle patterns (scatter, clusters, constellations).

Examples:
    # Random scatter
    python generate_particles.py -n 50 -o scatter.svg

    # Clustered particles
    python generate_particles.py --cluster -n 100 -o cluster.svg

    # Constellation with connections
    python generate_particles.py --constellation -n 30 --connect-distance 25 -o network.svg

    # Gradient particles
    python generate_particles.py --gradient -n 80 -o gradient.svg
"""

import argparse
import math
import sys


def seeded_random(seed: int) -> float:
    """Deterministic pseudo-random number generator."""
    x = math.sin(seed * 9999) * 10000
    return x - math.floor(x)


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


def generate_particles(
    n: int,
    width: float,
    height: float,
    fill: str,
    min_size: float,
    max_size: float,
    seed: int,
) -> list:
    """Generate random scatter particles."""
    particles = []
    rand_idx = seed

    for _ in range(n):
        rand_idx += 1
        x = seeded_random(rand_idx) * width
        rand_idx += 1
        y = seeded_random(rand_idx) * height
        rand_idx += 1
        size = min_size + seeded_random(rand_idx) * (max_size - min_size)
        rand_idx += 1
        opacity = 0.3 + seeded_random(rand_idx) * 0.7

        particles.append((x, y, size, opacity))

    elements = []
    for x, y, size, opacity in particles:
        elements.append(
            f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{size:.1f}" fill="{fill}" opacity="{opacity:.2f}"/>'
        )

    return elements, particles


def generate_cluster(
    n: int,
    width: float,
    height: float,
    clusters: int,
    fill: str,
    base_hue: int,
    vary_hue: bool,
    seed: int,
) -> list:
    """Generate clustered particles."""
    elements = []
    rand_idx = seed

    # Generate cluster centers
    centers = []
    for _ in range(clusters):
        rand_idx += 1
        cx = 10 + seeded_random(rand_idx) * (width - 20)
        rand_idx += 1
        cy = 10 + seeded_random(rand_idx) * (height - 20)
        centers.append((cx, cy))

    # Generate particles around centers
    for i in range(n):
        rand_idx += 1
        center = centers[int(seeded_random(rand_idx) * len(centers))]

        rand_idx += 1
        angle = seeded_random(rand_idx) * 2 * math.pi
        rand_idx += 1
        distance = seeded_random(rand_idx) ** 0.5 * 15  # Square root for uniform distribution

        x = center[0] + distance * math.cos(angle)
        y = center[1] + distance * math.sin(angle)

        rand_idx += 1
        size = 1 + seeded_random(rand_idx) * 2
        rand_idx += 1
        opacity = 0.4 + seeded_random(rand_idx) * 0.6

        particle_fill = fill
        if vary_hue:
            hue = (base_hue + i * (60 / n)) % 360
            particle_fill = hsl_to_hex(hue, 0.7, 0.55)

        elements.append(
            f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{size:.1f}" fill="{particle_fill}" opacity="{opacity:.2f}"/>'
        )

    return elements


def generate_constellation(
    n: int,
    width: float,
    height: float,
    connect_distance: float,
    fill: str,
    stroke: str,
    seed: int,
) -> list:
    """Generate constellation pattern with connected particles."""
    elements = []
    rand_idx = seed

    # Generate points
    points = []
    for _ in range(n):
        rand_idx += 1
        x = 5 + seeded_random(rand_idx) * (width - 10)
        rand_idx += 1
        y = 5 + seeded_random(rand_idx) * (height - 10)
        points.append((x, y))

    # Generate connections (lines first, so dots appear on top)
    for i, p1 in enumerate(points):
        for j, p2 in enumerate(points):
            if i >= j:
                continue
            dist = math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2)
            if dist < connect_distance:
                opacity = 1 - (dist / connect_distance)
                elements.append(
                    f'<line x1="{p1[0]:.1f}" y1="{p1[1]:.1f}" x2="{p2[0]:.1f}" y2="{p2[1]:.1f}" '
                    f'stroke="{stroke}" stroke-width="0.5" opacity="{opacity:.2f}"/>'
                )

    # Generate dots
    for x, y in points:
        elements.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2" fill="{fill}"/>')

    return elements


def generate_gradient_particles(
    n: int,
    width: float,
    height: float,
    base_hue: int,
    seed: int,
) -> list:
    """Generate particles with gradient coloring based on position."""
    elements = []
    rand_idx = seed

    for _ in range(n):
        rand_idx += 1
        x = seeded_random(rand_idx) * width
        rand_idx += 1
        y = seeded_random(rand_idx) * height
        rand_idx += 1
        size = 1 + seeded_random(rand_idx) * 3

        # Color based on position
        hue = (base_hue + (x / width) * 60 + (y / height) * 30) % 360
        fill = hsl_to_hex(hue, 0.7, 0.55)

        rand_idx += 1
        opacity = 0.5 + seeded_random(rand_idx) * 0.5

        elements.append(
            f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{size:.1f}" fill="{fill}" opacity="{opacity:.2f}"/>'
        )

    return elements


def main():
    parser = argparse.ArgumentParser(description="Generate SVG particle patterns")
    parser.add_argument("-n", "--count", type=int, default=50, help="Number of particles")
    parser.add_argument("--cluster", action="store_true", help="Generate clustered particles")
    parser.add_argument("--clusters", type=int, default=3, help="Number of clusters")
    parser.add_argument("--constellation", action="store_true", help="Generate constellation")
    parser.add_argument("--connect-distance", type=float, default=20, help="Max connection distance")
    parser.add_argument("--gradient", action="store_true", help="Position-based gradient coloring")
    parser.add_argument("--fill", default="#3B82F6", help="Fill color")
    parser.add_argument("--stroke", default="#3B82F6", help="Stroke color for connections")
    parser.add_argument("--min-size", type=float, default=1, help="Minimum particle size")
    parser.add_argument("--max-size", type=float, default=4, help="Maximum particle size")
    parser.add_argument("--base-hue", type=int, default=210, help="Base hue")
    parser.add_argument("--vary-hue", action="store_true", help="Vary hue")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")
    parser.add_argument("-o", "--output", help="Output file")

    args = parser.parse_args()

    width, height = 100, 100

    if args.cluster:
        elements = generate_cluster(
            n=args.count,
            width=width,
            height=height,
            clusters=args.clusters,
            fill=args.fill,
            base_hue=args.base_hue,
            vary_hue=args.vary_hue,
            seed=args.seed,
        )
    elif args.constellation:
        elements = generate_constellation(
            n=args.count,
            width=width,
            height=height,
            connect_distance=args.connect_distance,
            fill=args.fill,
            stroke=args.stroke,
            seed=args.seed,
        )
    elif args.gradient:
        elements = generate_gradient_particles(
            n=args.count,
            width=width,
            height=height,
            base_hue=args.base_hue,
            seed=args.seed,
        )
    else:
        elements, _ = generate_particles(
            n=args.count,
            width=width,
            height=height,
            fill=args.fill,
            min_size=args.min_size,
            max_size=args.max_size,
            seed=args.seed,
        )

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
  <title>Particle Pattern</title>
  {chr(10).join("  " + e for e in elements)}
</svg>'''

    if args.output:
        with open(args.output, "w") as f:
            f.write(svg)
    else:
        print(svg)


if __name__ == "__main__":
    main()
