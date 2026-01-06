# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repository contains custom skills for Claude Code. Skills are prompt-based tools that extend Claude Code's capabilities for specialized tasks.

## Skill Structure

Each skill is a directory containing:
- `SKILL.md` - Main skill definition with YAML frontmatter (name, description) and prompt instructions
- Supporting files (templates, examples, references, assets)

## Available Skills

| Skill | Purpose |
|-------|---------|
| `advanced-frontend-skill/` | Awwwards-level frontend interfaces with WebGL, shaders, animations |
| `excalidraw/` | Generate Excalidraw JSON diagrams programmatically |
| `ralph/` | Ralph Wiggum autonomous coding loop - PRD-driven with CI gates |
| `svg-art-skill/` | SVG artwork generation (WIP) |

## Installation

Copy skill folder to Claude Code skills directory:
```bash
cp -r <skill-folder> ~/.claude/skills/
```

## Creating New Skills

1. Create a new directory with skill name
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
