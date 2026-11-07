# Amp skill snapshot

Captured on 2026-10-10 from the skills available in this Amp session. Includes 20 top-level skills and all 152 files in their materialized directories, including nested resources. This is a selected session snapshot, not an export of every skill that may exist in the account.

Excluded 10 workflows tied to Amp-specific tools, portals, or orbs: `browser-use`, `building-plugins`, `building-schedules`, `building-skills`, `creating-artifacts`, `creating-charts`, `creating-webhooks`, `orb-setup`, `setup-tmux`, and `using-agent-browser`.

The source is Amp's `ampcode.com` global-skills cache. Folder suffixes provide the revision identifiers below; they are not assumed to be Git commit hashes. Destination folders omit the suffix so the directory name matches the skill's frontmatter. Source files are copied unchanged.

## Personal collection

| Destination | Revision |
| --- | --- |
| [animate](skills/animate/) | `9ae9344e59f474b3` |
| [animation-vocabulary](skills/animation-vocabulary/) | `4498667ba167cd1a` |
| [apple-design](skills/apple-design/) | `4498667ba167cd1a` |
| [ask-sonner](skills/ask-sonner/) | `639b5b70fb1e0a92` |
| [creating-client-proposals](skills/creating-client-proposals/) | `ec60532da99297c3` |
| [creating-ui-driven-motion-videos](skills/creating-ui-driven-motion-videos/) | `25a74827edb3b568` |
| [eli5](skills/eli5/) | `4498667ba167cd1a` |
| [emil-design-eng](skills/emil-design-eng/) | `67f45d80d383ff1b` |
| [explain-to-me](skills/explain-to-me/) | `4498667ba167cd1a` |
| [find-animation-opportunities](skills/find-animation-opportunities/) | `4498667ba167cd1a` |
| [huashu-design](skills/huashu-design/) | `1c55efde7ba44de5` |
| [improve-animations](skills/improve-animations/) | `0e3409dbe7bbe6c0` |
| [no-ai-slop](skills/no-ai-slop/) | `67e8a97def94ece5` |
| [pick-ui-library](skills/pick-ui-library/) | `173702728bd2dedb` |
| [prototype](skills/prototype/) | `69c13548f40c0b00` |
| [review-animations](skills/review-animations/) | `b5e199967d49a86e` |
| [show-me](skills/show-me/) | `4498667ba167cd1a` |
| [video-use](skills/video-use/) | `763202f023d6dc3e` |

## Official Amp collection

| Destination | Revision |
| --- | --- |
| [explaining-code](skills/explaining-code/) | `2f375cf13881f970` |
| [proving-changes](skills/proving-changes/) | `314a3e38d219383e` |

## Updating the snapshot

Copy each complete skill directory from a trusted source and compare it against the existing copy before replacement. Preserve licenses, scripts, references, and nested resources. Update this table and the README together. Review the diff for secrets and machine-specific state before publishing.

These source labels record provenance, not a grant of redistribution rights. Bundled licenses apply to their respective material; missing licenses need confirmation from the source owner before redistribution.

## Writing, UI, and animation additions — 2026-11-07

Compared all 16 User Skills in the writing/explanation, UI/design, and animation groups against Will's Amp User Skills repository (`https://ampcode.com/git/@willtran/-/skills`), at revision `97a7d1cfbf0b47e92cca40785501a448aa134bc2`. The 13 already present matched byte-for-byte, including supporting files. Added the three missing skills, preserving all 60 files and bundled licenses. The only source normalization removes one extra blank line at EOF in `ui-ux/references/layouts/overlay.md` to pass the whitespace check; all other files are unchanged:

| Destination | Amp skill revision | Notes |
| --- | --- | --- |
| [animating-expo](skills/animating-expo/) | `c17ed73b470f41fc` | Includes recipes and an MIT license. |
| [optimizing-animation-performance](skills/optimizing-animation-performance/) | `f21e2c63589d34a1` | Includes an MIT license. |
| [ui-ux](skills/ui-ux/) | `a466c483a06c0408` | Version 0.8.0; includes references, layouts, and scripts. No bundled license; confirm redistribution rights before publishing. |

The `ui-ux` update checker reads the public `evondev/evondevKit` VERSION file and writes a local cache; it does not install updates. Its authoring linter expects the upstream repository's `.claude-plugin/plugin.json`, which is not included in this standalone skill. These upstream behaviors are preserved rather than rewritten for this catalog.
