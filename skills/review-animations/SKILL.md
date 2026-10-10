---
name: review-animations
description: Reviews an existing animation implementation, diff, or focused motion surface for defects and regressions. Use for review-only requests, not implementation or codebase-wide planning.
disable-model-invocation: true
---

# Review Animation Changes

Review the requested motion surface or motion-relevant diff and enough surrounding code to judge it. Findings must be supported by `file:line` evidence; do not invent issues to avoid an approval.

Check whether motion has a clear purpose and suits interaction frequency; follows coherent origins and enter/exit paths; remains responsive and interruptible under repeated input; avoids avoidable layout/paint work; respects reduced motion and pointer/keyboard behavior; and uses the installed library's APIs correctly.

Use [STANDARDS.md](STANDARDS.md) when a finding needs an exact recipe, value, or technical explanation. Treat its values as informed defaults, not universal blockers: product context, documented intent, library behavior, and measured performance can justify alternatives.

## Output

- List findings first, ordered by impact, with location, observed behavior, consequence, and a concrete correction.
- Distinguish confirmed defects from feel checks that require rendering or a real device.
- Include a concise verdict: block only for material regressions; otherwise approve, optionally with non-blocking suggestions.
- If no material issue exists, say so plainly.

For meaningful visual changes, recommend or perform proportional rendered verification when available, including reduced-motion and interruption states. Do not impose a mandatory next-day review or fixed table format.
