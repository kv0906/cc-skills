#!/usr/bin/env python3
"""Generate common SVG icons.

Examples:
    # List available icons
    python generate_icon.py --list

    # Generate specific icon
    python generate_icon.py --icon check -o check.svg

    # Generate with custom size and color
    python generate_icon.py --icon heart --size 32 --stroke "#E11D48"

    # Generate filled variant
    python generate_icon.py --icon star --filled
"""

import argparse
import sys

# Icon definitions: path data for 24x24 viewBox
# Format: {name: {"path": d, "filled_path": d (optional)}}
ICONS = {
    # UI Icons
    "check": {
        "path": "M5 12l5 5 9-9",
    },
    "x": {
        "path": "M6 6l12 12M18 6l-12 12",
    },
    "plus": {
        "path": "M12 5v14M5 12h14",
    },
    "minus": {
        "path": "M5 12h14",
    },
    "chevron-right": {
        "path": "M9 6l6 6-6 6",
    },
    "chevron-left": {
        "path": "M15 6l-6 6 6 6",
    },
    "chevron-down": {
        "path": "M6 9l6 6 6-6",
    },
    "chevron-up": {
        "path": "M6 15l6-6 6 6",
    },
    "arrow-right": {
        "path": "M5 12h14M12 5l7 7-7 7",
    },
    "arrow-left": {
        "path": "M19 12H5M12 5l-7 7 7 7",
    },
    "menu": {
        "path": "M3 6h18M3 12h18M3 18h18",
    },
    "more-horizontal": {
        "path": "M12 12h.01M6 12h.01M18 12h.01",
        "stroke_width": 3,
    },
    "more-vertical": {
        "path": "M12 12h.01M12 6h.01M12 18h.01",
        "stroke_width": 3,
    },

    # Common Icons
    "search": {
        "path": "M21 21l-5-5m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    },
    "home": {
        "path": "M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10",
    },
    "user": {
        "path": "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    "settings": {
        "path": "M12 15a3 3 0 100-6 3 3 0 000 6z",
        "extra": "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
    },
    "mail": {
        "path": "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    "phone": {
        "path": "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z",
    },
    "calendar": {
        "path": "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18",
    },
    "clock": {
        "path": "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
    },
    "bell": {
        "path": "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
    },

    # Status Icons
    "heart": {
        "path": "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
        "filled_path": "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
    },
    "star": {
        "path": "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
        "filled_path": "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    },
    "thumbs-up": {
        "path": "M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3",
    },
    "alert-circle": {
        "path": "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01",
    },
    "check-circle": {
        "path": "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3",
    },
    "info": {
        "path": "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 16v-4M12 8h.01",
    },

    # Media Icons
    "play": {
        "path": "M5 3l14 9-14 9V3z",
        "filled_path": "M5 3l14 9-14 9V3z",
    },
    "pause": {
        "path": "M6 4h4v16H6zM14 4h4v16h-4z",
    },
    "skip-forward": {
        "path": "M5 4l10 8-10 8V4zM19 5v14",
    },
    "volume": {
        "path": "M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07",
    },
    "image": {
        "path": "M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21",
    },
    "camera": {
        "path": "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z",
    },

    # File Icons
    "file": {
        "path": "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
    },
    "folder": {
        "path": "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
    },
    "download": {
        "path": "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
    },
    "upload": {
        "path": "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
    },
    "trash": {
        "path": "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6",
    },
    "edit": {
        "path": "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    },
    "copy": {
        "path": "M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1",
    },

    # Social Icons
    "share": {
        "path": "M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98",
    },
    "link": {
        "path": "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
    },
    "external-link": {
        "path": "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3",
    },

    # Misc
    "loader": {
        "path": "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
    },
    "refresh": {
        "path": "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
    },
    "eye": {
        "path": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z",
        "extra": "M12 15a3 3 0 100-6 3 3 0 000 6z",
    },
    "lock": {
        "path": "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
    },
    "unlock": {
        "path": "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 019.9-1",
    },
    "sun": {
        "path": "M12 17a5 5 0 100-10 5 5 0 000 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42",
    },
    "moon": {
        "path": "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
    },
}


def generate_icon(
    icon_name: str,
    size: int,
    stroke: str,
    stroke_width: float,
    filled: bool,
    include_background: bool,
    bg_color: str,
) -> str:
    """Generate SVG icon."""

    if icon_name not in ICONS:
        available = ", ".join(sorted(ICONS.keys()))
        raise ValueError(f"Unknown icon: {icon_name}. Available: {available}")

    icon = ICONS[icon_name]
    custom_stroke_width = icon.get("stroke_width", stroke_width)

    # Use filled path if available and requested
    if filled and "filled_path" in icon:
        path_d = icon["filled_path"]
        fill_attr = f'fill="{stroke}"'
        stroke_attr = 'stroke="none"'
    else:
        path_d = icon["path"]
        fill_attr = 'fill="none"'
        stroke_attr = f'stroke="{stroke}" stroke-width="{custom_stroke_width}"'

    elements = []

    # Background
    if include_background:
        elements.append(f'<rect width="24" height="24" rx="4" fill="{bg_color}"/>')

    # Main path
    elements.append(f'<path d="{path_d}" {fill_attr} {stroke_attr} stroke-linecap="round" stroke-linejoin="round"/>')

    # Extra paths (for complex icons)
    if "extra" in icon:
        elements.append(f'<path d="{icon["extra"]}" {fill_attr} {stroke_attr} stroke-linecap="round" stroke-linejoin="round"/>')

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="{size}" height="{size}">
  <title>{icon_name.replace("-", " ").title()} Icon</title>
  {chr(10).join("  " + e for e in elements)}
</svg>'''

    return svg


def list_icons():
    """Print available icons."""
    print("Available icons:")
    print("-" * 40)

    categories = {
        "UI": ["check", "x", "plus", "minus", "chevron-right", "chevron-left",
               "chevron-down", "chevron-up", "arrow-right", "arrow-left",
               "menu", "more-horizontal", "more-vertical"],
        "Common": ["search", "home", "user", "settings", "mail", "phone",
                   "calendar", "clock", "bell"],
        "Status": ["heart", "star", "thumbs-up", "alert-circle", "check-circle", "info"],
        "Media": ["play", "pause", "skip-forward", "volume", "image", "camera"],
        "File": ["file", "folder", "download", "upload", "trash", "edit", "copy"],
        "Social": ["share", "link", "external-link"],
        "Misc": ["loader", "refresh", "eye", "lock", "unlock", "sun", "moon"],
    }

    for cat, icons in categories.items():
        print(f"\n{cat}:")
        print("  " + ", ".join(icons))


def main():
    parser = argparse.ArgumentParser(description="Generate SVG icons")

    parser.add_argument("--icon", help="Icon name to generate")
    parser.add_argument("--list", action="store_true", help="List available icons")
    parser.add_argument("--size", type=int, default=24, help="Icon size in pixels")
    parser.add_argument("--stroke", default="currentColor", help="Stroke color")
    parser.add_argument("--stroke-width", type=float, default=2, help="Stroke width")
    parser.add_argument("--filled", action="store_true", help="Use filled variant if available")
    parser.add_argument("--background", action="store_true", help="Include background")
    parser.add_argument("--bg-color", default="#F3F4F6", help="Background color")
    parser.add_argument("-o", "--output", help="Output file")

    args = parser.parse_args()

    if args.list:
        list_icons()
        return

    if not args.icon:
        parser.error("--icon is required (or use --list to see available icons)")

    try:
        svg = generate_icon(
            icon_name=args.icon,
            size=args.size,
            stroke=args.stroke,
            stroke_width=args.stroke_width,
            filled=args.filled,
            include_background=args.background,
            bg_color=args.bg_color,
        )

        if args.output:
            with open(args.output, "w") as f:
                f.write(svg)
            print(f"Generated: {args.output}", file=sys.stderr)
        else:
            print(svg)

    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
