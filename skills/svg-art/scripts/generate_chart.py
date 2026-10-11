#!/usr/bin/env python3
"""Generate SVG charts and data visualizations.

Examples:
    # Bar chart
    python generate_chart.py --bar --data "30,50,80,45,90" --labels "A,B,C,D,E"

    # Line chart
    python generate_chart.py --line --data "20,45,30,60,50,80" -o line.svg

    # Pie chart
    python generate_chart.py --pie --data "30,25,20,15,10" --labels "A,B,C,D,E"

    # Donut chart
    python generate_chart.py --donut --data "40,30,20,10"

    # Area chart
    python generate_chart.py --area --data "10,30,20,50,40,60"
"""

import argparse
import math
import sys


def parse_data(data_str: str) -> list:
    """Parse comma-separated data string into list of floats."""
    return [float(x.strip()) for x in data_str.split(",")]


def parse_labels(labels_str: str) -> list:
    """Parse comma-separated labels string."""
    if not labels_str:
        return []
    return [x.strip() for x in labels_str.split(",")]


def get_color(index: int, base_hue: int, total: int) -> str:
    """Generate color for data point."""
    hue = (base_hue + (index * 360 / total)) % 360
    return f"hsl({hue:.0f}, 70%, 55%)"


def generate_bar_chart(
    data: list,
    labels: list,
    width: float,
    height: float,
    base_hue: int,
    show_values: bool,
    horizontal: bool,
) -> list:
    """Generate bar chart."""
    elements = []

    # Chart area with margins
    margin = {"top": 20, "right": 20, "bottom": 40, "left": 50}
    chart_width = width - margin["left"] - margin["right"]
    chart_height = height - margin["top"] - margin["bottom"]

    max_val = max(data)
    n = len(data)

    # Bar dimensions
    gap_ratio = 0.2
    if horizontal:
        bar_height = chart_height / n * (1 - gap_ratio)
        gap = chart_height / n * gap_ratio
    else:
        bar_width = chart_width / n * (1 - gap_ratio)
        gap = chart_width / n * gap_ratio

    # Axes
    elements.append(f'<line x1="{margin["left"]}" y1="{margin["top"]}" '
                   f'x2="{margin["left"]}" y2="{height - margin["bottom"]}" '
                   f'stroke="#E5E7EB" stroke-width="1"/>')
    elements.append(f'<line x1="{margin["left"]}" y1="{height - margin["bottom"]}" '
                   f'x2="{width - margin["right"]}" y2="{height - margin["bottom"]}" '
                   f'stroke="#E5E7EB" stroke-width="1"/>')

    # Grid lines
    for i in range(5):
        y = margin["top"] + (chart_height * i / 4)
        elements.append(f'<line x1="{margin["left"]}" y1="{y:.1f}" '
                       f'x2="{width - margin["right"]}" y2="{y:.1f}" '
                       f'stroke="#F3F4F6" stroke-width="1"/>')

    # Bars
    for i, val in enumerate(data):
        color = get_color(i, base_hue, n)

        if horizontal:
            bar_w = (val / max_val) * chart_width
            x = margin["left"]
            y = margin["top"] + i * (bar_height + gap) + gap / 2
            elements.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{bar_w:.1f}" '
                           f'height="{bar_height:.1f}" fill="{color}" rx="2"/>')
            if labels and i < len(labels):
                elements.append(f'<text x="{margin["left"] - 5}" y="{y + bar_height / 2:.1f}" '
                               f'text-anchor="end" dominant-baseline="middle" '
                               f'font-size="10" fill="#6B7280">{labels[i]}</text>')
        else:
            bar_h = (val / max_val) * chart_height
            x = margin["left"] + i * (bar_width + gap) + gap / 2
            y = height - margin["bottom"] - bar_h
            elements.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{bar_width:.1f}" '
                           f'height="{bar_h:.1f}" fill="{color}" rx="2"/>')

            # Labels
            if labels and i < len(labels):
                label_x = x + bar_width / 2
                label_y = height - margin["bottom"] + 15
                elements.append(f'<text x="{label_x:.1f}" y="{label_y:.1f}" '
                               f'text-anchor="middle" font-size="10" fill="#6B7280">{labels[i]}</text>')

            # Values
            if show_values:
                val_y = y - 5
                elements.append(f'<text x="{x + bar_width / 2:.1f}" y="{val_y:.1f}" '
                               f'text-anchor="middle" font-size="9" fill="#374151">{val:.0f}</text>')

    return elements


def generate_line_chart(
    data: list,
    labels: list,
    width: float,
    height: float,
    stroke: str,
    stroke_width: float,
    show_points: bool,
    show_area: bool,
    smooth: bool,
) -> list:
    """Generate line chart."""
    elements = []

    margin = {"top": 20, "right": 20, "bottom": 40, "left": 50}
    chart_width = width - margin["left"] - margin["right"]
    chart_height = height - margin["top"] - margin["bottom"]

    max_val = max(data)
    min_val = min(data)
    val_range = max_val - min_val or 1
    n = len(data)

    # Axes
    elements.append(f'<line x1="{margin["left"]}" y1="{margin["top"]}" '
                   f'x2="{margin["left"]}" y2="{height - margin["bottom"]}" '
                   f'stroke="#E5E7EB" stroke-width="1"/>')
    elements.append(f'<line x1="{margin["left"]}" y1="{height - margin["bottom"]}" '
                   f'x2="{width - margin["right"]}" y2="{height - margin["bottom"]}" '
                   f'stroke="#E5E7EB" stroke-width="1"/>')

    # Calculate points
    points = []
    for i, val in enumerate(data):
        x = margin["left"] + (i / (n - 1)) * chart_width if n > 1 else margin["left"] + chart_width / 2
        y = margin["top"] + chart_height - ((val - min_val) / val_range) * chart_height
        points.append((x, y))

    # Build path
    if smooth and len(points) > 2:
        # Catmull-Rom to Bezier approximation
        path_d = f"M{points[0][0]:.1f},{points[0][1]:.1f}"
        for i in range(1, len(points)):
            p0 = points[max(0, i - 2)]
            p1 = points[max(0, i - 1)]
            p2 = points[i]
            p3 = points[min(len(points) - 1, i + 1)]

            cp1x = p1[0] + (p2[0] - p0[0]) / 6
            cp1y = p1[1] + (p2[1] - p0[1]) / 6
            cp2x = p2[0] - (p3[0] - p1[0]) / 6
            cp2y = p2[1] - (p3[1] - p1[1]) / 6

            path_d += f" C{cp1x:.1f},{cp1y:.1f} {cp2x:.1f},{cp2y:.1f} {p2[0]:.1f},{p2[1]:.1f}"
    else:
        path_d = " ".join([f"{'M' if i == 0 else 'L'}{p[0]:.1f},{p[1]:.1f}" for i, p in enumerate(points)])

    # Area fill
    if show_area:
        area_d = path_d + f" L{points[-1][0]:.1f},{height - margin['bottom']:.1f} L{points[0][0]:.1f},{height - margin['bottom']:.1f} Z"
        elements.append(f'<path d="{area_d}" fill="{stroke}" fill-opacity="0.2"/>')

    # Line
    elements.append(f'<path d="{path_d}" fill="none" stroke="{stroke}" '
                   f'stroke-width="{stroke_width}" stroke-linecap="round" stroke-linejoin="round"/>')

    # Points
    if show_points:
        for i, (x, y) in enumerate(points):
            elements.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4" fill="white" stroke="{stroke}" stroke-width="2"/>')

    # Labels
    for i, (x, y) in enumerate(points):
        if labels and i < len(labels):
            elements.append(f'<text x="{x:.1f}" y="{height - margin["bottom"] + 15:.1f}" '
                           f'text-anchor="middle" font-size="10" fill="#6B7280">{labels[i]}</text>')

    return elements


def generate_pie_chart(
    data: list,
    labels: list,
    cx: float,
    cy: float,
    radius: float,
    base_hue: int,
    donut: bool,
    inner_radius_ratio: float,
) -> list:
    """Generate pie or donut chart."""
    elements = []

    total = sum(data)
    n = len(data)
    start_angle = -90  # Start from top

    inner_radius = radius * inner_radius_ratio if donut else 0

    for i, val in enumerate(data):
        # Calculate angles
        sweep = (val / total) * 360
        end_angle = start_angle + sweep

        # Convert to radians
        start_rad = math.radians(start_angle)
        end_rad = math.radians(end_angle)

        # Calculate arc points
        x1 = cx + radius * math.cos(start_rad)
        y1 = cy + radius * math.sin(start_rad)
        x2 = cx + radius * math.cos(end_rad)
        y2 = cy + radius * math.sin(end_rad)

        large_arc = 1 if sweep > 180 else 0
        color = get_color(i, base_hue, n)

        if donut:
            # Inner arc points
            ix1 = cx + inner_radius * math.cos(start_rad)
            iy1 = cy + inner_radius * math.sin(start_rad)
            ix2 = cx + inner_radius * math.cos(end_rad)
            iy2 = cy + inner_radius * math.sin(end_rad)

            path_d = (f"M{x1:.1f},{y1:.1f} "
                     f"A{radius},{radius} 0 {large_arc} 1 {x2:.1f},{y2:.1f} "
                     f"L{ix2:.1f},{iy2:.1f} "
                     f"A{inner_radius},{inner_radius} 0 {large_arc} 0 {ix1:.1f},{iy1:.1f} Z")
        else:
            path_d = (f"M{cx},{cy} "
                     f"L{x1:.1f},{y1:.1f} "
                     f"A{radius},{radius} 0 {large_arc} 1 {x2:.1f},{y2:.1f} Z")

        elements.append(f'<path d="{path_d}" fill="{color}" stroke="white" stroke-width="1"/>')

        # Label
        if labels and i < len(labels):
            mid_angle = math.radians(start_angle + sweep / 2)
            label_radius = radius * (0.7 if not donut else (1 + inner_radius_ratio) / 2)
            label_x = cx + label_radius * math.cos(mid_angle)
            label_y = cy + label_radius * math.sin(mid_angle)

            elements.append(f'<text x="{label_x:.1f}" y="{label_y:.1f}" '
                           f'text-anchor="middle" dominant-baseline="middle" '
                           f'font-size="10" fill="white" font-weight="bold">{labels[i]}</text>')

        start_angle = end_angle

    return elements


def main():
    parser = argparse.ArgumentParser(description="Generate SVG charts")

    # Chart type
    parser.add_argument("--bar", action="store_true", help="Generate bar chart")
    parser.add_argument("--line", action="store_true", help="Generate line chart")
    parser.add_argument("--pie", action="store_true", help="Generate pie chart")
    parser.add_argument("--donut", action="store_true", help="Generate donut chart")
    parser.add_argument("--area", action="store_true", help="Generate area chart")

    # Data
    parser.add_argument("--data", required=True, help="Comma-separated data values")
    parser.add_argument("--labels", default="", help="Comma-separated labels")

    # Dimensions
    parser.add_argument("--width", type=float, default=300, help="Chart width")
    parser.add_argument("--height", type=float, default=200, help="Chart height")

    # Styling
    parser.add_argument("--base-hue", type=int, default=217, help="Base hue for colors")
    parser.add_argument("--stroke", default="#3B82F6", help="Line stroke color")
    parser.add_argument("--stroke-width", type=float, default=2, help="Line stroke width")

    # Options
    parser.add_argument("--show-values", action="store_true", help="Show values on bars")
    parser.add_argument("--show-points", action="store_true", help="Show points on line")
    parser.add_argument("--horizontal", action="store_true", help="Horizontal bar chart")
    parser.add_argument("--smooth", action="store_true", help="Smooth line curves")
    parser.add_argument("--inner-radius", type=float, default=0.5, help="Donut inner radius ratio")

    parser.add_argument("-o", "--output", help="Output file")

    args = parser.parse_args()

    data = parse_data(args.data)
    labels = parse_labels(args.labels)

    if args.pie or args.donut:
        cx, cy = args.width / 2, args.height / 2
        radius = min(args.width, args.height) / 2 - 20
        elements = generate_pie_chart(
            data=data,
            labels=labels,
            cx=cx,
            cy=cy,
            radius=radius,
            base_hue=args.base_hue,
            donut=args.donut,
            inner_radius_ratio=args.inner_radius,
        )
        title = "Donut Chart" if args.donut else "Pie Chart"
    elif args.line or args.area:
        elements = generate_line_chart(
            data=data,
            labels=labels,
            width=args.width,
            height=args.height,
            stroke=args.stroke,
            stroke_width=args.stroke_width,
            show_points=args.show_points,
            show_area=args.area,
            smooth=args.smooth,
        )
        title = "Area Chart" if args.area else "Line Chart"
    else:  # Default to bar
        elements = generate_bar_chart(
            data=data,
            labels=labels,
            width=args.width,
            height=args.height,
            base_hue=args.base_hue,
            show_values=args.show_values,
            horizontal=args.horizontal,
        )
        title = "Bar Chart"

    desc = f"Data visualization with {len(data)} data points"

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {args.width} {args.height}" width="{args.width:.0f}" height="{args.height:.0f}" role="img" aria-labelledby="title desc">
  <title id="title">{title}</title>
  <desc id="desc">{desc}</desc>
  <style>text {{ font-family: system-ui, -apple-system, sans-serif; }}</style>
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
