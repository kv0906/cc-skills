---
name: debate-brainstorm
description: "Run two independent subagents through a structured debate on the same prompt: independent answers, cross-critique, revision, and a synthesized unified response. Use when explicitly invoked as $debate-brainstorm or /debate-brainstorm with a prompt, or when the user asks for a two-agent debate or adversarial comparison of a plan, design, or other complex work. Best for plans and complex open-ended work, not simple factual questions."
---

# Debate Brainstorm: two-agent structured debate

Take the user's prompt and run it through two independent subagents using the protocol below. Synthesize their final answers into one unified response.

If the user did not provide a prompt, ask what question or plan to debate before starting.

Preserve independence through Round 1. Do not let either agent see the other's work before both original responses are complete. Relay responses and critiques verbatim; do not editorialize them.

## Core rules

- Call the subagents **Agent A** and **Agent B**.
- Use `spawn_agent` once for each agent and retain the returned agent IDs.
- Keep both agents read-only during the debate. If the task involves implementation, debate and synthesize the plan first; make changes afterward only if the user requested implementation.
- Run the two calls for each round concurrently when the interface permits.
- Use `followup_task` to continue with the same agents in Rounds 2 and 3. Never replace an agent mid-protocol merely because its prior turn completed.
- Use `wait_agent` until both agents have finished each round. Never invent a pending response or advance with only one response.
- If an agent or follow-up fails, retry once. If it fails again, explain which round broke and synthesize the best available material.
- Keep the user updated during waits because the full protocol can take several minutes.

By the end, each agent's context must contain:

1. The original prompt
2. Its own original response
3. The other agent's original response
4. Its own critique of the other response
5. The other agent's critique of its response

## Round 1: independent responses

Spawn Agent A and Agent B with the same core prompt:

> You are one of two agents independently working on the same task. Respond to the following prompt as thoroughly and well as you can. You will later see another agent's response and be asked to critique it, so make your reasoning explicit. If the task requires reading the codebase or other research, do that research now.
>
> PROMPT:
> {the user's prompt verbatim, plus only the relevant conversation context needed to perform it}

Include constraints such as “this is a planning task; do not modify files” when applicable.

For wide-open plans or designs, optionally add one complementary emphasis to each prompt, such as conservative/minimal for Agent A and ambitious/thorough for Agent B. Keep the core prompt identical. Skip this when the user already specified the angle.

Wait for both Round 1 responses.

## Round 2: cross-critique

Send Agent B's original response verbatim to Agent A, and Agent A's original response verbatim to Agent B:

> Here is the other agent's response to the same prompt:
>
> {other agent's Round 1 response, verbatim}
>
> Critique it. First verify its factual claims against the source—the codebase, docs, or data—where feasible. Then identify concrete weaknesses, errors, risks, and omissions, and note anything it does better than your own response. Be specific and adversarial but fair. The goal is to improve the final answer, not to win.

Wait for both critiques.

## Round 3: revise after receiving critique

Route critiques carefully:

- Send **Agent B's critique of Agent A** to Agent A.
- Send **Agent A's critique of Agent B** to Agent B.

Each agent must receive the critique written about its own work:

> Here is the other agent's critique of YOUR original response:
>
> {the other agent's Round 2 critique of this agent, verbatim}
>
> You now have the full exchange in context: the prompt, both original responses, your critique of theirs, and their critique of yours. Produce your final, complete response to the original prompt. Incorporate what the exchange showed to be right: adopt the other agent's good ideas, concede valid criticisms, and defend choices that survived scrutiny. Your final message is the deliverable. Make it a standalone response to the prompt, not a diff against your earlier draft.

Wait for both final responses.

## Synthesize

Write one unified answer to the user:

- Merge the best structure, ideas, and details from both final responses. Do not present a side-by-side comparison.
- Present post-debate convergence with confidence.
- Where disagreement remains, state both positions briefly and give a reasoned recommendation.
- Briefly mention any important correction or genuine change of view produced by the debate.
- Do not dump both agents' full final responses unless the user asks.

## Cost and fit

This protocol uses six subagent turns and can be slow and expensive. Do not use it for a simple question with one verifiable answer; recommend a direct answer instead.

Heavy convergence is a useful result. Report it rather than manufacturing disagreement.
