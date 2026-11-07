# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repository contains custom skills for Claude Code. Skills are prompt-based tools that extend Claude Code's capabilities for specialized tasks.

## Skill Structure

Each skill is a directory containing:
- `SKILL.md` - Main skill definition with YAML frontmatter (name, description) and prompt instructions
- Supporting files (templates, examples, references, assets)

Standalone skills live in `skills/<skill-name>/`. Keep complete multi-skill bundles in `bundles/`; `bundles/explanation-skills/` contains an alternative explanation collection. Do not put new skill folders at the repository root.

## Available Skills

| Skill | Purpose |
|-------|---------|
| `skills/premium-frontend-design/` | Awwwards-level frontend interfaces with WebGL, shaders, animations |
| `skills/animated-diagram/` | Animated flowcharts/decision trees as Remotion + React videos (Mermaid input, node/edge reveals, trace dots, CRT shader) |
| `skills/excalidraw/` | Generate Excalidraw JSON diagrams programmatically |
| `skills/excalidraw-diagram/` | Excalidraw diagrams that argue visually (concept-driven layout, Playwright render-validation loop) — vendored from coleam00/excalidraw-diagram-skill |
| `skills/interactive-diagram/` | Interactive architecture diagrams with React Flow, official icons, and looping directional arrows |
| `skills/animating-expo/` | Gesture-driven animations in React Native and Expo |
| `skills/optimizing-animation-performance/` | Diagnose dropped frames and improve web animation performance |
| `skills/ui-ux/` | App interface design and review with briefs, wireframes, and component guidance |
| `skills/ralph/` | Ralph Wiggum autonomous coding loop - PRD-driven with CI gates |
| `skills/svg-art/` | Programmatic SVG generation (grids, fractals, charts, icons) |

See `skills/README.md` for the full catalog. Keep this index updated when adding, removing, or renaming a skill; group entries by task without nesting skill folders by category.

## Installation

Copy skill folder to Claude Code skills directory:
```bash
cp -r skills/<skill-name> ~/.claude/skills/
```

## Creating New Skills

1. Create `skills/<skill-name>/`
2. Add `SKILL.md` with YAML frontmatter:
   ```yaml
   ---
   name: skill-name
   description: When/how to trigger this skill
   ---
   ```
3. Add prompt instructions in markdown
4. Optionally include:
   - `templates/` - Reusable code templates
   - `examples/` - Reference implementations
   - `references/` - Supporting documentation
   - `assets/` - Static files (JSON, images)
