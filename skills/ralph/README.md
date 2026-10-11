# Ralph Skill - Autonomous AI Coding Loop

A Claude Code skill that sets up and runs the Ralph Wiggum approach - long-running autonomous AI agents that ship code while you sleep.

## Quick Start

```bash
# In any project directory:
/ralph setup      # Create Ralph infrastructure
/ralph init       # Build custom PRD interactively
/ralph run        # Execute the autonomous loop
/ralph            # Show help menu
```

## What is Ralph?

Ralph is a pattern for running AI coding agents autonomously over long periods (hours, days) by:

- **Clean slate iterations** - Each loop starts fresh, avoiding context rot
- **PRD-driven features** - Works on one user story at a time from a JSON-based PRD
- **CI quality gates** - Every commit must pass tests and typechecks
- **Progress tracking** - Maintains progress.txt across iterations
- **Auto-stop** - Exits when all features are complete or max iterations reached

## Commands

### `/ralph setup`

**What it does:** Creates Ralph infrastructure in your current directory

**Files created:**
- `ralph-loop.sh` - Main bash script (executable, max 10 iterations)
- `prd.json` - Product Requirements Document with example user stories
- `progress.txt` - Progress log (appended to each iteration)
- `README-RALPH.md` - Full documentation

**When to use:**
- Starting a new project that needs autonomous development
- Adding Ralph to an existing project
- Want to ship features overnight

**Example:**
```bash
cd ~/my-new-project
/ralph setup
# Edit prd.json to define your features
./ralph-loop.sh
```

---

### `/ralph init`

**What it does:** Guides you through creating a custom PRD from scratch

**Interactive prompts:**
- Project name?
- What features do you want? (collects 3-5 user stories)
- For each story:
  - Title?
  - Description?
  - Acceptance criteria? (3-5 specific, testable criteria)

**When to use:**
- You know exactly what features you want built
- Want a structured PRD without manual JSON editing
- Prefer interactive setup over editing files

**Example:**
```bash
cd ~/my-project
/ralph init
# Answer questions to build PRD
# Then run: ./ralph-loop.sh
```

---

### `/ralph run`

**What it does:** Executes the Ralph loop

**Pre-flight checks:**
- Verifies ralph-loop.sh exists
- Verifies prd.json exists
- Shows summary:
  - Total user stories
  - Incomplete stories
  - Max iterations configured
- Asks for confirmation
- Executes: `./ralph-loop.sh`

**When to use:**
- After setting up Ralph infrastructure
- After customizing your PRD
- Ready to let the agent work autonomously

**Example:**
```bash
/ralph run
# Sits back and watches the magic happen
```

---

### `/ralph`

**What it does:** Shows the help menu with all available commands

**When to use:**
- Forgot the command syntax
- Want to see all options

---

## Use Cases

### 🎯 Use Case 1: Overnight Feature Development

**Scenario:** You have 5 well-defined features to build for a side project, but limited time during the day.

**Workflow:**
```bash
cd ~/side-project
/ralph setup
# Edit prd.json with your 5 features
./ralph-loop.sh
# Go to sleep
# Wake up to completed features + passing tests
```

**Why Ralph?**
- Works while you sleep
- Each feature is tested and committed
- No context rot from single long session
- Progress log shows what was done

---

### 🎯 Use Case 2: Refactoring Legacy Code

**Scenario:** You need to refactor a legacy codebase piece by piece with strict test coverage.

**Workflow:**
```bash
cd ~/legacy-app
/ralph init
# Define refactoring tasks:
# US-001: Extract authentication logic
# US-002: Add unit tests for auth
# US-003: Refactor database layer
# US-004: Add integration tests
./ralph-loop.sh
```

**Why Ralph?**
- One refactor at a time (controlled scope)
- Tests must pass after each change
- Progress tracked in progress.txt
- Git history shows incremental improvements

---

### 🎯 Use Case 3: Building MVP Features

**Scenario:** You have a list of MVP features and want them implemented systematically.

**Workflow:**
```bash
cd ~/mvp-project
/ralph setup
# Edit prd.json:
# US-001: User registration
# US-002: User login
# US-003: Password reset
# US-004: Email verification
# US-005: User profile page
./ralph-loop.sh
```

**Why Ralph?**
- Systematic feature-by-feature development
- Each feature fully tested before moving to next
- Clear acceptance criteria prevent scope creep
- Can stop and resume anytime

---

### 🎯 Use Case 4: Bug Fixing Marathon

**Scenario:** You have a backlog of 10+ bugs that need systematic fixing.

**Workflow:**
```bash
cd ~/buggy-app
/ralph init
# Define bugs as user stories:
# US-001: Fix login redirect bug
# US-002: Fix cart calculation error
# US-003: Fix image upload timeout
# etc.
./ralph-loop.sh
```

**Why Ralph?**
- One bug at a time (focused debugging)
- Each fix must pass tests
- Progress log shows which bugs were fixed
- No half-fixed bugs committed

---

### 🎯 Use Case 5: Building Utility Libraries

**Scenario:** You want to create a utility library with 20+ helper functions.

**Workflow:**
```bash
mkdir ~/utils-library && cd ~/utils-library
npm init -y
/ralph setup
# Edit prd.json with utility functions:
# US-001: Date formatting utils
# US-002: String manipulation utils
# US-003: Array helpers
# US-004: Object manipulation
./ralph-loop.sh
```

**Why Ralph?**
- Each utility function gets proper tests
- TypeScript types for each function
- Documentation generated per function
- Library builds incrementally

---

### 🎯 Use Case 6: Test Coverage Improvement

**Scenario:** Your project has low test coverage and you want to systematically add tests.

**Workflow:**
```bash
cd ~/my-project
/ralph init
# Define test stories:
# US-001: Add tests for auth module (target 80%)
# US-002: Add tests for API routes (target 80%)
# US-003: Add tests for utils (target 90%)
./ralph-loop.sh
```

**Why Ralph?**
- Tests must pass before moving forward
- Each module gets thorough coverage
- CI stays green throughout
- Progress tracked module by module

---

## When to Use Ralph

### ✅ USE RALPH WHEN:

- **Well-defined features** - You have clear acceptance criteria
- **Multiple tasks** - 3+ features/bugs/refactors to complete
- **Systematic work** - Each task should be completed before the next
- **Quality matters** - Tests and types must pass
- **Long-running** - Work that takes hours/days
- **Autonomous work** - You want the agent to work without supervision
- **Incremental delivery** - Features can be shipped one at a time

### ❌ DON'T USE RALPH WHEN:

- **Single task** - Just one feature to build (use regular Claude Code)
- **Exploratory work** - Requirements are unclear or experimental
- **Quick prototyping** - Speed over quality, tests can wait
- **Highly interdependent** - All features must be built together
- **Complex architecture** - Requires human design decisions between tasks
- **Unclear requirements** - Acceptance criteria are vague
- **Real-time collaboration** - You want to guide each decision

---

## PRD Best Practices

### ✅ Good User Story

```json
{
  "id": "US-001",
  "priority": 1,
  "title": "Add date formatting utility",
  "description": "Create a utility function that formats Date objects into ISO 8601 strings",
  "acceptanceCriteria": [
    "File src/utils/date.ts exists",
    "Function formatDateISO(date: Date): string exists",
    "Function returns valid ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)",
    "Unit tests exist in src/utils/date.test.ts with 5+ test cases",
    "All tests pass with 100% coverage for this function",
    "TypeScript types are properly defined with no 'any' types"
  ],
  "passes": false
}
```

**Why it's good:**
- ✅ Specific and scoped (one function)
- ✅ Clear acceptance criteria (testable, unambiguous)
- ✅ Completable in one iteration
- ✅ Success is measurable

### ❌ Bad User Story

```json
{
  "id": "US-001",
  "priority": 1,
  "title": "Build the frontend",
  "description": "Create a nice UI for the app",
  "acceptanceCriteria": [
    "UI looks good",
    "Everything works",
    "Users like it"
  ],
  "passes": false
}
```

**Why it's bad:**
- ❌ Too vague and broad
- ❌ Unclear acceptance criteria (not testable)
- ❌ Too large for one iteration
- ❌ Success is subjective

---

## How Ralph Works

```
┌─────────────────────────────────────────────┐
│  ITERATION 1                                 │
│  ┌─────────────────────────────────────┐    │
│  │ 1. Read PRD + progress.txt          │    │
│  │ 2. Pick highest priority incomplete │    │
│  │ 3. Implement feature                │    │
│  │ 4. Run tests (must pass)            │    │
│  │ 5. Run typecheck (must pass)        │    │
│  │ 6. Commit code                      │    │
│  │ 7. Update prd.json (passes: true)   │    │
│  │ 8. Append to progress.txt           │    │
│  │ 9. Check if all done?               │    │
│  │    → Yes: Exit with COMPLETE        │    │
│  │    → No: Continue to iteration 2    │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│  ITERATION 2 (clean slate)                  │
│  ┌─────────────────────────────────────┐    │
│  │ Fresh context, repeat above...      │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
                      ↓
                    ... etc
```

**Key insight:** Each iteration has a clean slate (fresh context), but maintains "memory" through:
- Git history (code changes)
- progress.txt (what was done)
- prd.json (what's left to do)

---

## Monitoring Progress

### During the loop:

```bash
# Terminal 1: Run Ralph
./ralph-loop.sh

# Terminal 2: Watch progress
tail -f progress.txt

# Terminal 3: Watch git commits
watch -n 5 'git log --oneline -10'
```

### After the loop:

```bash
# Check what was completed
cat progress.txt

# Check PRD status
cat prd.json | grep -A 5 '"passes": true'

# Review git history
git log --oneline --since="1 hour ago"

# Run tests to verify
pnpm test
```

---

## Configuration

Edit `ralph-loop.sh` to customize:

```bash
MAX_ITERATIONS=10        # Max loops (prevent infinite)
PRD_FILE="prd.json"      # PRD location
PROGRESS_FILE="progress.txt"  # Progress log location

# Customize test commands for your project:
# pnpm test → npm test
# pnpm tsc --noEmit → yarn typecheck
```

---

## Troubleshooting

### Problem: Loop runs but doesn't complete anything

**Solution:**
- Check if tests/typecheck commands are correct in ralph-loop.sh
- Simplify acceptance criteria in PRD
- Reduce scope of user stories

### Problem: Agent picks wrong priority

**Solution:**
- Ensure priority numbers are correct (1 = highest)
- Check that "passes": false on incomplete stories

### Problem: Tests keep failing

**Solution:**
- Run tests manually to verify they work
- Update test command in ralph-loop.sh
- Check if acceptance criteria are achievable

### Problem: Reached max iterations without completion

**Solution:**
- Increase MAX_ITERATIONS in ralph-loop.sh
- Break down user stories into smaller tasks
- Check progress.txt to see what's blocking

---

## Tips & Tricks

### 1. Start Small
Test Ralph with 2-3 simple user stories first before running overnight with 20 stories.

### 2. Watch the First Iteration
Monitor the first iteration closely to catch issues early.

### 3. Scoped Acceptance Criteria
Each criterion should be a single, testable fact. Use file paths and specific function names.

### 4. Use Conventional Commits
Ralph uses conventional commit format (feat:, fix:, refactor:) for clean git history.

### 5. Break Large Features
If a feature seems too big, break it into multiple user stories with dependencies via priority.

### 6. Keep CI Healthy
Make sure your tests are fast and reliable before running Ralph.

---

## Files Reference

| File | Purpose | Modified By |
|------|---------|-------------|
| `ralph-loop.sh` | Main loop script | You (one-time setup) |
| `prd.json` | User stories to implement | You (before run) + Agent (during run) |
| `progress.txt` | Progress log | Agent (appended each iteration) |
| `README-RALPH.md` | Full documentation | Skill (generated) |

---

## Example Session

```bash
$ cd ~/my-new-library

$ /ralph setup
✅ Created ralph-loop.sh
✅ Created prd.json (3 example user stories)
✅ Created progress.txt
✅ Created README-RALPH.md

Next steps:
1. Edit prd.json to define your features
2. Run: ./ralph-loop.sh

$ vim prd.json
# (customize user stories)

$ ./ralph-loop.sh
🚀 Starting Ralph Wiggum Loop...
Max iterations: 10
PRD file: prd.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 ITERATION 1 of 10
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Running Claude Code...
[Agent implements US-001, runs tests, commits...]
⏭️  Moving to next iteration...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 ITERATION 2 of 10
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Running Claude Code...
[Agent implements US-002, runs tests, commits...]
⏭️  Moving to next iteration...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 ITERATION 3 of 10
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Running Claude Code...
[Agent implements US-003, runs tests, commits...]
✅ COMPLETE marker detected! All PRD items finished.
🎉 Ralph loop completed successfully in 3 iterations.

$ cat progress.txt
# See detailed log of all completed work

$ git log --oneline
a1b2c3d chore: update PRD - US-003 complete
d4e5f6g feat: add array utility functions
g7h8i9j chore: update PRD - US-002 complete
j1k2l3m feat: add string manipulation utils
m4n5o6p chore: update PRD - US-001 complete
p7q8r9s feat: add date formatting utility

$ pnpm test
✅ All tests passing
```

---

## Support

If you encounter issues:

1. Check `README-RALPH.md` in your project (generated by setup)
2. Review `progress.txt` to see what was attempted
3. Examine git history: `git log --oneline`
4. Verify tests work: `pnpm test`
5. Check PRD structure: `cat prd.json | jq`

---

## Version

Ralph Skill v1.0.0 - Autonomous AI Coding Loop for Claude Code

Last updated: 2026-01-05
