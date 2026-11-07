# Skills for AI Agents

My collection of skills for writing, design, video, and coding with AI.

**A skill is a set of instructions that teaches an AI how to do a particular job.** Think of it as a recipe: you bring the task, and the skill gives the AI a method to follow.

Use these with Amp, Claude Code, Codex, or another AI agent that supports skills.

## Find a skill

| I want to… | Try this |
| --- | --- |
| Understand something complicated | [explain-to-me](skills/explain-to-me/) |
| Make my writing clearer and less robotic | [no-ai-slop](skills/no-ai-slop/) |
| See an idea as a diagram | [show-me](skills/show-me/) or [excalidraw-diagram](skills/excalidraw-diagram/) |
| Explore designs for an app or website | [prototype](skills/prototype/) |
| Give a website an Apple-inspired feel | [apple-design](skills/apple-design/) |
| Add smooth movement to buttons, menus, or panels | [animate](skills/animate/) |
| Create slides or a presentation | [huashu-design](skills/huashu-design/) |
| Write a client proposal in Vietnamese | [creating-client-proposals](skills/creating-client-proposals/) |
| Turn an idea into an animated video | [creating-ui-driven-motion-videos](skills/creating-ui-driven-motion-videos/) |
| Edit an existing video | [video-use](skills/video-use/) |
| Plan a complex task | [planning-with-files](skills/planning-with-files/) |
| Check that a code change really works | [proving-changes](skills/proving-changes/) |

Browse the [complete catalog of 34 standalone skills](skills/README.md), grouped by task. It includes 23 imported from my Amp setup, plus the separately supplied `interactive-diagram` skill. Each skill explains when to use it.

## Repository layout

```text
skills/<skill-name>/SKILL.md       Standalone skills and their supporting files
skills/README.md                  Complete catalog, grouped by task
bundles/explanation-skills/       A three-skill explanation bundle
README.md                        Browsing and installation guide
SOURCES.md                       Amp snapshot sources and revisions
```

- Put new standalone skills in `skills/<skill-name>/`. Match the folder name to the `name` in `SKILL.md`.
- Keep scripts, references, assets, and licenses inside the skill's folder so it can be copied intact.
- Use `bundles/` only for collections distributed together. The [explanation bundle](bundles/explanation-skills/) preserves an alternative `explain-to-me` and its companion skills; it does not replace the Amp snapshot version.
- Keep `.agents/skills/` and `.claude/skills/` for installation in a consuming project, not as duplicate copies in this catalog.

This is a distribution catalog, not an Amp global-skills repository. Keeping a skill here does not automatically install it or update the version loaded by Amp.

## Get started

**You can ask your AI agent to handle the setup.** Give it this repository link and a request like:

> Install the explain-to-me skill from https://github.com/kv0906/cc-skills, in skills/explain-to-me. Use your supported skills folder. Keep all supporting files and ask before replacing an existing skill.

Once installed, try:

> Use explain-to-me to explain how online payments work. Assume I have no technical background.

Or:

> Use no-ai-slop to edit this draft. Make it clearer, but keep my voice.

### Manual setup

1. Download this repository using **Code → Download ZIP**, then unzip it.
2. Choose a skill from `skills/` and copy its **whole folder** into your project's location below. Check before replacing an existing skill.
3. Restart your AI agent or ask it to reload skills.

| Your agent | Folder inside your project |
| --- | --- |
| Amp or Codex | `.agents/skills/` |
| Claude Code | `.claude/skills/` |
| Other agents | Check their skill installation instructions |

For example, the installed file should be `.agents/skills/explain-to-me/SKILL.md`. Create the destination folders if they do not exist.

## Before you use a skill

- Start with one skill that fits your task. You do not need to install everything.
- Some skills need extra software or service accounts. Ask your agent to check the requirements first.
- Amp-only workflows that require its special tools, portals, or cloud environment are excluded. Other agents may still need adjustments.
- Review scripts before running them, and check the result before publishing or sending it.

## Credits and licenses

This collection includes my own work and skills from other creators. See [sources and revisions](SOURCES.md) for the imported skills.

Licenses vary. Keep the original credits and check each skill's license before redistributing it. Some imported skills have no bundled license and need permission confirmed first.
