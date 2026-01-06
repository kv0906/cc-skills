#!/usr/bin/env python3
"""Optimize SVG files for smaller size and better performance.

Examples:
    # Basic optimization
    python optimize_svg.py input.svg -o output.svg

    # Aggressive optimization
    python optimize_svg.py input.svg --aggressive

    # Optimize and show stats
    python optimize_svg.py input.svg --stats

    # Process from stdin
    cat input.svg | python optimize_svg.py
"""

import argparse
import re
import sys
from typing import Tuple


def remove_comments(svg: str) -> str:
    """Remove XML comments."""
    return re.sub(r'<!--[\s\S]*?-->', '', svg)


def remove_metadata(svg: str) -> str:
    """Remove metadata and editor-specific elements."""
    # Remove metadata tags
    svg = re.sub(r'<metadata[\s\S]*?</metadata>', '', svg, flags=re.IGNORECASE)
    # Remove sodipodi, inkscape namespaces
    svg = re.sub(r'<sodipodi:[^>]*/?>''', '', svg)
    svg = re.sub(r'<inkscape:[^>]*/?>''', '', svg)
    # Remove namespace declarations
    svg = re.sub(r'\s+xmlns:(sodipodi|inkscape|dc|cc|rdf)="[^"]*"', '', svg)
    return svg


def remove_empty_groups(svg: str) -> str:
    """Remove empty <g> elements."""
    # Iteratively remove empty groups
    prev = ""
    while prev != svg:
        prev = svg
        svg = re.sub(r'<g[^>]*>\s*</g>', '', svg)
    return svg


def collapse_whitespace(svg: str) -> str:
    """Collapse excessive whitespace."""
    # Collapse multiple spaces/newlines
    svg = re.sub(r'\s+', ' ', svg)
    # Remove space before closing tags
    svg = re.sub(r'\s+/>', '/>', svg)
    svg = re.sub(r'\s+>', '>', svg)
    # Remove space after opening bracket
    svg = re.sub(r'<\s+', '<', svg)
    return svg


def minify_whitespace(svg: str) -> str:
    """More aggressive whitespace removal."""
    # Remove newlines and excess spaces
    svg = re.sub(r'>\s+<', '><', svg)
    svg = re.sub(r'\s+', ' ', svg)
    return svg.strip()


def round_numbers(svg: str, precision: int = 2) -> str:
    """Round floating point numbers to reduce precision."""
    def round_match(match):
        num = float(match.group())
        if precision == 0:
            return str(int(round(num)))
        rounded = round(num, precision)
        # Remove trailing zeros
        result = f"{rounded:.{precision}f}".rstrip('0').rstrip('.')
        return result

    # Match floating point numbers (including negative)
    svg = re.sub(r'-?\d+\.\d+', round_match, svg)
    return svg


def shorten_hex_colors(svg: str) -> str:
    """Convert 6-digit hex to 3-digit where possible."""
    def shorten(match):
        color = match.group(1)
        if len(color) == 6:
            if color[0] == color[1] and color[2] == color[3] and color[4] == color[5]:
                return f"#{color[0]}{color[2]}{color[4]}"
        return f"#{color}"

    return re.sub(r'#([0-9A-Fa-f]{6})\b', shorten, svg)


def remove_default_attributes(svg: str) -> str:
    """Remove attributes that are set to their default values."""
    defaults = [
        (r'\s+fill-opacity="1"', ''),
        (r'\s+stroke-opacity="1"', ''),
        (r'\s+opacity="1"', ''),
        (r'\s+stroke="none"', ''),
        (r'\s+stroke-width="1"', ''),
        (r'\s+fill-rule="nonzero"', ''),
        (r'\s+clip-rule="nonzero"', ''),
        (r'\s+font-style="normal"', ''),
        (r'\s+font-weight="normal"', ''),
        (r'\s+x="0"(?=[\s/>])', ''),
        (r'\s+y="0"(?=[\s/>])', ''),
        (r'\s+cx="0"(?=[\s/>])', ''),
        (r'\s+cy="0"(?=[\s/>])', ''),
        (r'\s+rx="0"(?=[\s/>])', ''),
        (r'\s+ry="0"(?=[\s/>])', ''),
        (r'\s+transform="translate\(0[,\s]+0\)"', ''),
        (r'\s+transform="translate\(0\)"', ''),
        (r'\s+transform="rotate\(0\)"', ''),
        (r'\s+transform="scale\(1\)"', ''),
        (r'\s+transform="scale\(1[,\s]+1\)"', ''),
    ]

    for pattern, replacement in defaults:
        svg = re.sub(pattern, replacement, svg)

    return svg


def convert_colors_to_hex(svg: str) -> str:
    """Convert rgb() colors to hex."""
    def rgb_to_hex(match):
        r, g, b = int(match.group(1)), int(match.group(2)), int(match.group(3))
        return f"#{r:02x}{g:02x}{b:02x}"

    svg = re.sub(r'rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)', rgb_to_hex, svg)
    return svg


def simplify_path_commands(svg: str) -> str:
    """Simplify path data commands."""
    def simplify_path(match):
        d = match.group(1)

        # Remove unnecessary spaces in path commands
        d = re.sub(r'([MLHVCSQTAZmlhvcsqtaz])\s+', r'\1', d)
        d = re.sub(r'\s+([MLHVCSQTAZmlhvcsqtaz])', r'\1', d)

        # Use space instead of comma between numbers
        d = re.sub(r',', ' ', d)

        # Remove space before negative numbers (they have implicit separator)
        d = re.sub(r'\s+(-)', r'\1', d)

        # Collapse multiple spaces
        d = re.sub(r'\s+', ' ', d)

        return f'd="{d.strip()}"'

    svg = re.sub(r'd="([^"]*)"', simplify_path, svg)
    return svg


def remove_unnecessary_ids(svg: str) -> str:
    """Remove IDs that aren't referenced anywhere."""
    # Find all ID definitions
    ids = re.findall(r'\bid="([^"]+)"', svg)

    # Check each ID for references
    for id_val in ids:
        # Check for url(#id), href="#id", xlink:href="#id"
        patterns = [
            f'url\\(#{re.escape(id_val)}\\)',
            f'href="#{re.escape(id_val)}"',
            f'xlink:href="#{re.escape(id_val)}"',
        ]

        referenced = any(re.search(p, svg) for p in patterns)

        if not referenced:
            # Remove the id attribute (but keep the element)
            svg = re.sub(f'\\s+id="{re.escape(id_val)}"', '', svg)

    return svg


def optimize_svg(
    svg: str,
    aggressive: bool = False,
    precision: int = 2,
    keep_ids: bool = False,
) -> str:
    """Apply all optimizations to SVG."""

    # Basic optimizations (always applied)
    svg = remove_comments(svg)
    svg = remove_metadata(svg)
    svg = remove_empty_groups(svg)
    svg = remove_default_attributes(svg)
    svg = convert_colors_to_hex(svg)
    svg = shorten_hex_colors(svg)
    svg = collapse_whitespace(svg)

    if not keep_ids:
        svg = remove_unnecessary_ids(svg)

    # Aggressive optimizations
    if aggressive:
        svg = round_numbers(svg, precision)
        svg = simplify_path_commands(svg)
        svg = minify_whitespace(svg)

    return svg


def get_size_stats(original: str, optimized: str) -> Tuple[int, int, float]:
    """Calculate size statistics."""
    orig_size = len(original.encode('utf-8'))
    opt_size = len(optimized.encode('utf-8'))
    reduction = (1 - opt_size / orig_size) * 100 if orig_size > 0 else 0
    return orig_size, opt_size, reduction


def format_size(size: int) -> str:
    """Format byte size for display."""
    if size < 1024:
        return f"{size} B"
    elif size < 1024 * 1024:
        return f"{size / 1024:.1f} KB"
    else:
        return f"{size / (1024 * 1024):.1f} MB"


def main():
    parser = argparse.ArgumentParser(description="Optimize SVG files")

    parser.add_argument("input", nargs="?", help="Input SVG file (or stdin if omitted)")
    parser.add_argument("-o", "--output", help="Output file (default: stdout)")
    parser.add_argument("--aggressive", action="store_true",
                       help="Apply aggressive optimizations (minification, path simplification)")
    parser.add_argument("--precision", type=int, default=2,
                       help="Decimal precision for numbers (default: 2)")
    parser.add_argument("--keep-ids", action="store_true",
                       help="Keep all IDs even if unreferenced")
    parser.add_argument("--stats", action="store_true",
                       help="Show size statistics")

    args = parser.parse_args()

    # Read input
    if args.input:
        with open(args.input, 'r') as f:
            svg = f.read()
    else:
        svg = sys.stdin.read()

    # Optimize
    optimized = optimize_svg(
        svg,
        aggressive=args.aggressive,
        precision=args.precision,
        keep_ids=args.keep_ids,
    )

    # Output
    if args.output:
        with open(args.output, 'w') as f:
            f.write(optimized)
        print(f"Optimized: {args.output}", file=sys.stderr)
    else:
        if not args.stats:
            print(optimized)

    # Stats
    if args.stats:
        orig_size, opt_size, reduction = get_size_stats(svg, optimized)
        print(f"\nOptimization Statistics:", file=sys.stderr)
        print(f"  Original:  {format_size(orig_size)}", file=sys.stderr)
        print(f"  Optimized: {format_size(opt_size)}", file=sys.stderr)
        print(f"  Reduction: {reduction:.1f}%", file=sys.stderr)


if __name__ == "__main__":
    main()
