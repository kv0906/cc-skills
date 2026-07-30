# Explanation Skills Bundle

This bundle contains three complete Agent Skills in the visible `skills/` directory:

- `explain-to-me`
- `asd-ste100`, including its license, examples, and references
- `explaining-with-ascii`

## Project-local installation

Copy the skill directories into your project's `.agents/skills/` directory:

```bash
mkdir -p <project>/.agents/skills
cp -R explanation-skills/skills/* <project>/.agents/skills/
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
cp -R explanation-skills/skills/* ~/.config/agents/skills/
```

Each skill can be installed independently. Install all three to retain the complete sibling references used by `explain-to-me`.
