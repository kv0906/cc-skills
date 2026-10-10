---
name: proving-changes
description: "Proves that a fix or feature works end to end and breaks nothing: reproduces the failure on the unchanged code, reruns the same scenario with the change on the real stack, covers a matrix of cases and controls, and reports before and after evidence such as recordings, screenshots, logs, database state, and numbers. Use when the user asks for proof (\"irrefutable proof\", \"prove it\", \"show me it works\"), asks to test a change end to end, asks for before and after numbers or a demo video, or asks whether a change breaks anything."
---

# Proving changes

Proof is evidence that convinces a reviewer who will not read the code that the change does what
was claimed and breaks nothing. The reviewer decides whether to ship from the proof alone, so build
it for a skeptic: every claim needs an observation that would have come out differently if the
claim were false.

Unit tests, type checks, and lint support proof but do not make it. A test that mocks the boundary
where the bug lives passes whether or not the bug is fixed. Report them as checks, and never
describe a change as verified or tested end to end on their strength alone.

Proof takes as long as it takes. Spend the time to run the real scenario instead of reasoning about
why it would pass.

## Workflow

### 1. List the claims and the cases

Write down what must be true for the change to be correct, then the case that shows each claim.
Include:

- **The reported scenario**, with the reporter's exact data and conditions: the same message,
  repository shape, platform, browser, text size, account state, or version.
- **Every surface the change reaches**, such as web, mobile, desktop app, interactive CLI, headless
  CLI, API, and SDK. Show each state the user can see, including loading, failure, and recovery.
- **A control case**: a nearby situation whose behavior must not change. It proves the change is
  targeted, for example that a menu item still appears when it should, rather than being deleted.
- **Adjacent features that share the changed code** and could regress.
- **The questions the reviewer will ask next**. Answer them in the proof instead of waiting for
  them:
  - Does it break anything else?
  - What is the performance cost, before and after?
  - Are resources such as watchers, sockets, sessions, and processes cleaned up?
  - Does it work on every platform the claim names?
  - Does it still work after a restart, a reload, or a reconnect?

When a request names only one of these, such as "show me it works", still cover the others that
the change puts at risk.

### 2. Reproduce on the unchanged code

Run the failing scenario on the code without the change and capture the failure. Use one script
or procedure that you will rerun unchanged for the after run. Stash the change, check out the base
commit, or build the old version.

Confirm which code each run executed:

- Restart servers, workers, and clients after switching code. Long-running processes keep serving
  the old code.
- Check a version string, build hash, log line, or file checksum that differs between the two
  builds.
- For a refactor or a new test harness, plant a deliberate behavior change and confirm the proof
  detects it. A harness that cannot detect a planted change proves nothing.

If the failure does not reproduce, an after run proves nothing. Change the environment until it
reproduces, for example the same platform, the same timing, or production-shaped data. If it still
does not reproduce, say so and lower the claim.

Feature work has no failure to reproduce. Capture the starting state instead, so the after state
has something to be compared with.

### 3. Exercise the real path

Drive the change the way a user reaches it. Ranked from strongest to weakest:

1. The deployed product, or a staging copy, used through its real interface
2. The full local stack: real UI, server, background workers, clients, and the real external
   services or their staging or sandbox versions
3. One real component with its true neighbors, for example the real CLI against a real server
4. Integration tests through a public interface
5. Unit tests and mocks

Use the strongest level the environment allows, and name the level in the report. Calling an
internal API, rendering an isolated component story, or injecting a mocked client skips code the
user hits. If you must take such a shortcut, name what it skipped.

For packaged software, test the artifact that ships: the built container, bundle, binary, or
installed package. A file missing from the package breaks production while every source-tree test
passes.

### 4. Apply the change and rerun the same scenario

Rerun the identical procedure on the changed code. Change nothing else between the runs: not the
data, not the timing, not the injected delays, not the viewport. When a bug is too fast to see,
slow it down the same way in both runs and show that the slowdown took effect in each.

Run the whole matrix from step 1, not only the reported case.

### 5. Collect independent evidence

Gather more than one kind of evidence per claim, so that each kind covers the others' blind spots:

- **Visual**: screenshots of each state, a recording when motion or timing matters, side-by-side
  before and after images, and frame strips for fast transitions.
- **State**: DOM and accessibility facts, database rows, files and git state on disk, API
  responses, and process lists.
- **Logs**: timestamped server, client, and worker lines that show the code path taken, correlated
  across components.
- **Numbers**: counts, latencies, and sizes. For performance, report medians over repeated runs
  with the same input, and say what was measured and where.

A picture alone can mislead. Back each screenshot with a state fact that confirms what it shows,
for example an attribute value, a row count, or a log line. When a tooltip or hover state cannot be
captured, cite the underlying attribute instead.

Make demo fixtures realistic. A fixture that prints placeholder labels proves the plumbing, not
that users see useful output.

### 6. Check every run before trusting it

Inspect each artifact against the claim it supports, the way a reviewer would. Look at the frames
and read the numbers. Discard a run, rerun it, and report the discarded run when any of these
happened:

- A process still ran old code.
- State carried over from the before run, such as a selection, cache, or open dialog.
- The capture landed during an animation, a scroll, or a retry timer.
- A setup step failed silently, such as a missing flag, a wrong account, or a disconnected client.
- An error appeared that the claim did not predict.

Treat unexplained differences between runs as findings. Run both sides enough times to tell
flakiness that exists on the base from flakiness the change introduced.

### 7. Prove what will ship

Rebase onto the current target branch and rerun the decisive cases before reporting. Proof against
an old base does not cover the code that will merge.

Account for the whole diff. For every removed line, changed comment, touched shared file,
configuration edit, and secret, either show that it is required or remove it. A refactor needs
evidence that behavior is identical, not only that tests pass.

Afterwards, delete what the proof created in shared systems: test accounts, organizations,
sandboxes, branches, and rows in staging services.

## Evidence by kind of change

| Change | Decisive evidence |
| --- | --- |
| Visual or layout bug | Before and after screenshots of the same state; measured positions or sizes; every affected size, theme, and input method |
| Interaction or flow | A recording of the real flow; state facts after each step; the state after a reload |
| Race, crash, or timing bug | Failure reproduced with the timing forced; logs showing the bad interleaving before and its absence after; a test that fails when the fix is reverted |
| Distributed or backend behavior | Timestamped logs across components; database and API state before and after; the failure and recovery paths |
| Performance | Median before and after over repeated runs with the same input; profiles showing where the time went |
| Refactor | Identical recorded behavior before and after across a matrix of inputs; a planted change that the comparison detects |
| Security or access | The denied case denied and the allowed case allowed, against the real identity provider or its staging version; no collateral revocations |
| Delivery ("is it live?") | The deployed version contains the commit; production logs or metrics show the new path running |

## Reporting the proof

Lead with one sentence that states what was proven and at what level, for example "Verified end to
end on the local stack with a real runner; not yet deployed." Then:

- A table of cases with before, after, and expected results.
- Screenshots and recordings embedded inline, each labeled with the state it shows.
- The decisive facts: log lines, state values, and numbers.
- What went wrong during the proof and how you resolved it, including invalid runs and corrected
  claims.
- What is not proven, and why, for example an untested platform, production timing, or a skipped
  surface.
- Where the artifacts and repro scripts are, so that a reviewer can rerun the proof.

Keep the claim no larger than the evidence. When a gap remains, call the proof strong rather than
irrefutable and name the gap. When asked whether you are sure, give your actual confidence and what
would raise it. An honest "no, and here is what I did not test" is more useful than an overclaim.

Distinguish fixed from not yet exercised. Silence in production logs means the case did not occur
unless you show that it occurred and was handled.

## Common ways proof fails

- The end-to-end test called an internal API, so it passed while the user-facing UI never sent the
  new value.
- A unit test mocked the dependency whose real behavior was the bug, so the fix silently did
  nothing in production.
- The before run used a stale server process, so its log contradicted the code under test.
- The bug reproduced only in one runtime, such as a native app web view, so passing runs in another
  browser proved nothing.
- The fix removed intentional code. It looked like the culprit, and only a question about the
  removed comment revealed that it was not.
- A packaging step omitted a new file, so the deployed service would have crashed at startup.
- A demo showed placeholder output, so it proved streaming but not the feature.
- The proof ran against a base many commits behind, and the merge changed the result.
