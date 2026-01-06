---
name: ralph
description: Set up and run Ralph Wiggum loop - autonomous AI coding with clean slate iterations, PRD-driven features, and CI quality gates. Use for long-running autonomous coding tasks.
---

# Ralph Wiggum Loop Skill

You are setting up or running a Ralph Wiggum loop - an autonomous AI coding pattern that runs agents in iterations with clean context, working on PRD-driven features while maintaining CI green.

## When This Skill is Invoked

The user can invoke this skill with:
- `/ralph` - Interactive setup
- `/ralph setup` - Set up Ralph infrastructure in current directory
- `/ralph init` - Initialize a new PRD from scratch
- `/ralph run` - Run the Ralph loop

## Arguments

Parse the arguments after `/ralph`:
- `setup` - Create all Ralph files (ralph-loop.sh, prd.json, progress.txt, README-RALPH.md)
- `init` - Guide user through PRD creation
- `run` - Execute the ralph-loop.sh script
- No args - Show options and let user choose

## Core Files to Create

### 1. ralph-loop.sh

The main bash script that runs the autonomous loop:

```bash
#!/bin/bash

# Ralph Wiggum Loop - Autonomous AI Coding Agent
set -e

MAX_ITERATIONS=10
ITERATION=0
PRD_FILE="prd.json"
PROGRESS_FILE="progress.txt"
COMPLETE_MARKER="<promise>COMPLETE</promise>"

echo "🚀 Starting Ralph Wiggum Loop..."
echo "Max iterations: $MAX_ITERATIONS"
echo "PRD file: $PRD_FILE"
echo ""

while [ $ITERATION -lt $MAX_ITERATIONS ]; do
  ITERATION=$((ITERATION + 1))
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔄 ITERATION $ITERATION of $MAX_ITERATIONS"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  PRD_CONTENT=$(cat "$PRD_FILE")
  PROGRESS_CONTENT=""
  if [ -f "$PROGRESS_FILE" ]; then
    PROGRESS_CONTENT=$(cat "$PROGRESS_FILE")
  fi

  PROMPT=$(cat <<'EOF_PROMPT'
You are working on a feature from the PRD below. Follow these rules EXACTLY:

## PRD
```json
PRD_CONTENT_PLACEHOLDER
```

## Previous Progress
```
PROGRESS_CONTENT_PLACEHOLDER
```

## Your Task

1. **Pick ONE feature**: Select the HIGHEST priority user story where "passes": false
2. **Scope check**: If the feature seems too large, break it into smaller sub-tasks and only do the first sub-task
3. **Implement**: Write code to satisfy ALL acceptance criteria for that feature
4. **Test & Type Check**:
   - Run all tests: `pnpm test` (or `npm test`)
   - Run type check: `pnpm tsc --noEmit` (or appropriate command)
   - Fix any failures until CI is green
5. **Commit**:
   - Commit your changes with a clear message
   - Use conventional commit format: "feat: description" or "fix: description"
6. **Update PRD**:
   - Update prd.json to set "passes": true for the completed user story
   - Commit this change separately
7. **Update Progress**:
   - APPEND (do not overwrite) a new entry to progress.txt with:
     - Iteration number (ITERATION_PLACEHOLDER)
     - User story ID completed
     - Brief summary of what was done
     - Test/typecheck status
     - Timestamp
8. **Check completion**:
   - If ALL user stories now have "passes": true, reply with: <promise>COMPLETE</promise>
   - Otherwise, just confirm what you completed

## Critical Rules
- ✅ Keep CI green - all tests and types must pass before committing
- ✅ Only work on ONE feature per iteration
- ✅ APPEND to progress.txt (don't overwrite previous entries)
- ✅ Commit after implementation AND after updating PRD
- ✅ Reply with <promise>COMPLETE</promise> only when ALL stories pass
- ❌ Do NOT work on multiple features at once
- ❌ Do NOT skip tests or type checking
- ❌ Do NOT create new user stories (only work on existing PRD items)

Begin now.
EOF_PROMPT
)

  PROMPT="${PROMPT//PRD_CONTENT_PLACEHOLDER/$PRD_CONTENT}"
  PROMPT="${PROMPT//PROGRESS_CONTENT_PLACEHOLDER/$PROGRESS_CONTENT}"
  PROMPT="${PROMPT//ITERATION_PLACEHOLDER/$ITERATION}"

  echo "📝 Running Claude Code..."
  OUTPUT=$(claude-code --yes "$PROMPT" 2>&1 || true)

  echo "$OUTPUT"
  echo ""

  if echo "$OUTPUT" | grep -q "$COMPLETE_MARKER"; then
    echo "✅ COMPLETE marker detected! All PRD items finished."
    echo "🎉 Ralph loop completed successfully in $ITERATION iterations."
    exit 0
  fi

  echo "⏭️  Moving to next iteration..."
  echo ""
  sleep 2
done

echo "⚠️  Reached maximum iterations ($MAX_ITERATIONS) without completion."
echo "📊 Check progress.txt and prd.json for current status."
```

### 2. prd.json Template

```json
{
  "project": "PROJECT_NAME",
  "userStories": [
    {
      "id": "US-001",
      "priority": 1,
      "title": "Feature title",
      "description": "What needs to be built",
      "acceptanceCriteria": [
        "Specific, testable criterion 1",
        "Specific, testable criterion 2"
      ],
      "passes": false
    }
  ]
}
```

### 3. progress.txt Template

```
# Ralph Loop Progress

This file tracks the progress of each Ralph loop iteration.
Each entry below is appended by the AI agent after completing a feature.

---
```

### 4. README-RALPH.md

Create comprehensive documentation explaining:
- What Ralph is
- How it works
- How to customize the PRD
- How to run it
- Troubleshooting
- Best practices

## Workflow

### When user invokes `/ralph setup`:

1. Check if Ralph files already exist
2. Create all 4 core files:
   - ralph-loop.sh (make executable)
   - prd.json (with example user stories)
   - progress.txt (empty template)
   - README-RALPH.md (full documentation)
3. Confirm setup complete and show next steps

### When user invokes `/ralph init`:

1. Ask user questions to build a custom PRD:
   - Project name?
   - What features do you want to build? (collect 3-5 user stories)
   - For each story:
     - Title?
     - Description?
     - Acceptance criteria? (3-5 specific, testable criteria)
2. Generate prd.json with their input
3. Offer to create other Ralph files if not present

### When user invokes `/ralph run`:

1. Verify ralph-loop.sh exists
2. Verify prd.json exists
3. Show a summary of:
   - How many user stories are in the PRD
   - How many are incomplete
   - Max iterations configured
4. Ask for confirmation
5. Execute: `./ralph-loop.sh`

### When user invokes `/ralph` with no args:

Present options:
```
Ralph Wiggum Loop - Autonomous AI Coding

What would you like to do?

1. setup  - Create Ralph infrastructure in this directory
2. init   - Create a new PRD from scratch
3. run    - Run the Ralph loop

Usage: /ralph [setup|init|run]
```

## Key Principles to Maintain

1. **Clean slate each iteration** - Fresh context, no baggage
2. **One feature at a time** - Prevents scope creep
3. **CI must stay green** - Tests and types pass every commit
4. **Progress tracking** - Append to progress.txt each iteration
5. **Clear stop condition** - `<promise>COMPLETE</promise>` when all stories pass
6. **Safety limit** - Max iterations prevents infinite loops

## PRD Best Practices to Teach

**Good user story:**
- Specific and scoped (completable in one iteration)
- Clear acceptance criteria (testable, unambiguous)
- Properly prioritized
- Has "passes": false initially

**Bad user story:**
- Too vague ("build the UI")
- Too large (touches many systems)
- Unclear criteria ("make it nice")

## Customization Options

When setting up, detect project context:
- Check for package.json to determine package manager (pnpm, npm, yarn)
- Check for tsconfig.json to know if TypeScript is used
- Adjust test commands in ralph-loop.sh accordingly

## Important Notes

- Always make ralph-loop.sh executable: `chmod +x ralph-loop.sh`
- Warn user if no test runner is configured
- The script uses `claude-code --yes` to avoid interactive prompts
- Each iteration is autonomous - doesn't share context with previous iterations
- Progress.txt is the only "memory" besides git history

## Example Invocations

User: `/ralph setup`
→ Create all 4 files with sensible defaults

User: `/ralph init`
→ Guide through PRD creation interactively

User: `/ralph run`
→ Execute the loop

User: `/ralph`
→ Show options menu

## Success Criteria

Setup is successful when:
1. All 4 core files are created
2. ralph-loop.sh is executable
3. prd.json has valid JSON with at least 1 user story
4. User understands how to customize and run it

Run is successful when:
1. Loop executes without errors
2. Agent completes at least one user story
3. PRD is updated with "passes": true
4. Progress is appended to progress.txt
5. Commits are made with passing tests
