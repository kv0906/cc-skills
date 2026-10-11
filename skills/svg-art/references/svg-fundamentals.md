# SVG Fundamentals Reference

Quick reference for SVG structure, elements, and best practices.

## Core Structure

```xml
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 100 100"
     width="100" height="100"
     role="img" aria-labelledby="title desc">
  <title id="title">Descriptive title</title>
  <desc id="desc">Detailed description</desc>
  <!-- Content -->
</svg>
```

**Critical**: Always use `viewBox` for proper scaling. Coordinate system: origin top-left, +x right, +y down.

## Elements

| Element | Attributes | Example |
|---------|------------|---------|
| `<rect>` | x, y, width, height, rx, ry | `<rect x="10" y="10" width="80" height="40" rx="5"/>` |
| `<circle>` | cx, cy, r | `<circle cx="50" cy="50" r="25"/>` |
| `<ellipse>` | cx, cy, rx, ry | `<ellipse cx="50" cy="50" rx="40" ry="20"/>` |
| `<line>` | x1, y1, x2, y2 | `<line x1="0" y1="0" x2="100" y2="100"/>` |
| `<polyline>` | points | `<polyline points="10,10 50,50 90,10"/>` |
| `<polygon>` | points | `<polygon points="50,10 90,90 10,90"/>` |
| `<path>` | d | `<path d="M10 10 L90 90"/>` |
| `<text>` | x, y, font-* | `<text x="50" y="50">Hello</text>` |
| `<g>` | transform, id | `<g transform="translate(10,10)">...</g>` |

## Path Commands

| Cmd | Name | Parameters | Example |
|-----|------|------------|---------|
| M/m | Move | x y | `M10 10` |
| L/l | Line | x y | `L90 90` |
| H/h | Horizontal | x | `H90` |
| V/v | Vertical | y | `V90` |
| C/c | Cubic Bézier | x1 y1 x2 y2 x y | `C20 20 80 20 90 90` |
| S/s | Smooth cubic | x2 y2 x y | `S80 80 90 90` |
| Q/q | Quadratic | x1 y1 x y | `Q50 0 90 90` |
| T/t | Smooth quad | x y | `T90 90` |
| A/a | Arc | rx ry rot large sweep x y | `A25 25 0 0 1 90 90` |
| Z/z | Close | — | `Z` |

**Uppercase = absolute, lowercase = relative**

## Styling

```xml
<!-- Inline -->
<rect fill="#3B82F6" stroke="#1E40AF" stroke-width="2" opacity="0.8"/>

<!-- CSS -->
<style>
  .primary { fill: #3B82F6; stroke: none; }
</style>
<rect class="primary"/>
```

**Colors**: HEX (`#RGB`, `#RRGGBB`), HSL (`hsl(210, 70%, 50%)`), `currentColor`

## Transforms

```xml
<g transform="translate(50, 50) rotate(45) scale(1.5)">
  <!-- transforms apply right-to-left -->
</g>
```

| Transform | Syntax |
|-----------|--------|
| Translate | `translate(x, y)` |
| Rotate | `rotate(angle)` or `rotate(angle, cx, cy)` |
| Scale | `scale(s)` or `scale(sx, sy)` |
| Skew | `skewX(angle)`, `skewY(angle)` |

## Gradients

```xml
<defs>
  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#3B82F6"/>
    <stop offset="100%" stop-color="#8B5CF6"/>
  </linearGradient>

  <radialGradient id="radial" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#FFF"/>
    <stop offset="100%" stop-color="#3B82F6"/>
  </radialGradient>
</defs>

<rect fill="url(#grad)"/>
```

## Reusable Elements

```xml
<defs>
  <symbol id="icon" viewBox="0 0 24 24">
    <path d="M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z"/>
  </symbol>
</defs>

<use href="#icon" x="10" y="10" width="24" height="24"/>
<use href="#icon" x="50" y="10" width="24" height="24"/>
```

## Clipping & Masking

```xml
<defs>
  <clipPath id="clip">
    <circle cx="50" cy="50" r="40"/>
  </clipPath>
</defs>

<rect clip-path="url(#clip)" width="100" height="100" fill="#3B82F6"/>
```

## Accessibility

```xml
<!-- Informative SVG -->
<svg role="img" aria-labelledby="title desc">
  <title id="title">Chart Title</title>
  <desc id="desc">Description of the graphic</desc>
</svg>

<!-- Decorative SVG -->
<svg aria-hidden="true">...</svg>
```

## Optimization Checklist

1. ✓ Use `viewBox` for scalability
2. ✓ Round coordinates to reduce precision
3. ✓ Use relative path commands when shorter
4. ✓ Remove default attributes (x="0", opacity="1")
5. ✓ Shorten hex colors (#RRGGBB → #RGB when possible)
6. ✓ Use `<use>` for repeated elements
7. ✓ Remove unnecessary IDs and comments
8. ✓ Combine paths with same styling
