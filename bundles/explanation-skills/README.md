# Explanation Skills Bundle

This bundle contains three complete Agent Skills in the visible `skills/` directory:

- `explain-to-me`
- `asd-ste100`, including its license, examples, and references
- `explaining-with-ascii`

This bundle's `explain-to-me` differs from the standalone Amp snapshot in `../../skills/explain-to-me/`. Choose one version; do not install both into the same destination. The installation commands below run from the `cc-skills` repository root. Check for existing skills before copying, since `cp` can overwrite files.

## Project-local installation

Copy the skill directories into your project's `.agents/skills/` directory:

```bash
mkdir -p <project>/.agents/skills
cp -R bundles/explanation-skills/skills/* <project>/.agents/skills/
```

Expected installed layout:

```text
<project>/.agents/skills/
├── explain-to-me/
├── asd-ste100/
└── explaining-with-ascii/
```

## Global installation

```bash
mkdir -p ~/.config/agents/skills
cp -R bundles/explanation-skills/skills/* ~/.config/agents/skills/
```

Each skill can be installed independently. Install all three to retain the complete sibling references used by `explain-to-me`.
