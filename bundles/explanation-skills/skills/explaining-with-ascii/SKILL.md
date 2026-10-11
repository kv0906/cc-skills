---
name: explaining-with-ascii
description: Explains technical systems, abstract concepts, workflows, architecture, comparisons, loops, and tradeoffs using plain language and readable ASCII diagrams. Use when the user asks how something works, requests a visualization, seems confused by a difficult concept, or would benefit from a clear mental model before implementation details.
---

# Explaining With ASCII

Turn difficult ideas into simple visual mental models.

The goal is not to decorate an explanation with ASCII. The goal is to use a diagram to make the concept understandable before introducing technical detail.

## Core Principle

Use this teaching order:

```diagram
Difficult concept
      │
      ▼
Familiar analogy       ← when the concept is abstract
      │
      ▼
ASCII mental model     ← show structure or movement
      │
      ▼
Short explanation      ← explain what the picture means
      │
      ▼
Technical vocabulary   ← name the formal concepts
      │
      ▼
Concrete anchors       ← examples, code, files, or commands
```

Prefer one clear picture over several paragraphs.

Do not repeat every part of the diagram in prose.

## When to Use This Skill

Use this skill when explaining:

- system architecture;
- data flow;
- request lifecycle;
- agents and tool loops;
- state machines;
- retrieval and search;
- databases and memory;
- queues and asynchronous work;
- concurrency;
- networking;
- authentication;
- deployment pipelines;
- ownership boundaries;
- before-and-after changes;
- alternatives and tradeoffs;
- algorithms;
- unfamiliar code paths;
- any concept the user says is confusing.

Also use it when the user asks for:

- an ASCII explanation;
- a visual explanation;
- a simple mental model;
- a CEO-level explanation;
- an explanation “like I’m new”;
- a step-by-step flow;
- a comparison between two approaches;
- an explanation in Vietnamese or another requested language.

Do not force a diagram into a trivial answer where one sentence would be clearer.

## Explanation Workflow

### Step 1: Identify the Teaching Goal

Before writing, determine:

1. What should the user understand after reading?
2. What is the smallest useful mental model?
3. Is the important thing:
   - movement,
   - structure,
   - ownership,
   - sequence,
   - repetition,
   - state,
   - or comparison?
4. What details can be postponed?

Teach the invariant first, not every implementation detail.

For example:

- Authentication: “Who proves identity, and who trusts the proof?”
- A queue: “Producer leaves work; consumer processes it later.”
- Retrieval: “Search finds evidence before generation answers.”
- Caching: “Check the fast copy before asking the slow source.”

### Step 2: Use an Analogy When Needed

For abstract or difficult concepts, begin with one familiar analogy.

Good analogies map clearly:

```diagram
Library analogy                  Technical concept
───────────────                  ─────────────────
Question                         Query
Librarian                        Retriever
Shelf index                      Search index
Relevant books                   Retrieved documents
Written response                 Generated answer
```

Keep the analogy short. Stop using it when it no longer maps cleanly.

Do not stretch an analogy until it becomes less understandable than the original concept.

### Step 3: Choose the Correct Diagram Shape

Match the diagram to the concept.

#### A. Linear flow

Use for pipelines and request lifecycles.

```diagram
Input ──▶ Validate ──▶ Process ──▶ Store ──▶ Output
```

#### B. Branch or decision

Use when behavior depends on a condition.

```diagram
                ┌── yes ──▶ Use cached result
Request ──▶ Cache hit?
                └── no ───▶ Fetch source ──▶ Cache result
```

#### C. Loop

Use for retries, agents, review cycles, and iterative refinement.

```diagram
Plan ──▶ Act ──▶ Check
 ▲                │
 │      not done  │
 └────────────────┘
                  │ done
                  ▼
                Finish
```

#### D. Layers

Use for architecture and separation of responsibilities.

```diagram
┌─────────────────────────┐
│ User interface          │
├─────────────────────────┤
│ Application logic       │
├─────────────────────────┤
│ Data access             │
├─────────────────────────┤
│ Database                │
└─────────────────────────┘
```

#### E. Ownership boundaries

Use to explain which component is responsible for what.

```diagram
┌──────────── Client ────────────┐
│ Collect input                  │
│ Display result                 │
└──────────────┬─────────────────┘
               │ HTTP
┌──────────────▼─────────────────┐
│ Server                         │
│ Validate, authorize, calculate │
└──────────────┬─────────────────┘
               │ query
┌──────────────▼─────────────────┐
│ Database                       │
│ Persist and retrieve records   │
└────────────────────────────────┘
```

#### F. Before and after

Use for refactors, optimizations, and behavior changes.

```diagram
Before                         After
──────                         ─────
Client ──▶ Slow source         Client ──▶ Cache
                                            │ miss
                                            ▼
                                        Slow source
```

#### G. Side-by-side comparison

Use when comparing alternatives.

```diagram
Synchronous                    Asynchronous
───────────                    ────────────
Caller waits                   Caller submits work
     │                              │
     ▼                              ▼
Work completes                 Queue ──▶ Worker
     │                              │
     ▼                              ▼
Caller continues               Result available later
```

#### H. State transition

Use when an object changes status over time.

```diagram
Created ──▶ Running ──▶ Completed
                │
                ├──▶ Failed
                │
                └──▶ Cancelled
```

#### I. Tree or hierarchy

Use for parent-child relationships and decomposition.

```diagram
Application
├── Frontend
│   ├── Pages
│   └── Components
├── Backend
│   ├── API
│   └── Services
└── Data
    ├── Database
    └── Cache
```

### Step 4: Draw the Smallest Complete Diagram

A good diagram should answer one main question.

Use:

- clear nouns inside boxes;
- verbs or conditions on arrows;
- a consistent reading direction;
- whitespace to separate paths;
- square-corner boxes;
- short labels;
- aligned connectors;
- visible ownership boundaries.

Prefer:

```diagram
Question ──▶ Retrieve evidence ──▶ Generate answer
```

over:

```diagram
Input request from the user
            │
            ▼
Perform a retrieval operation over the configured data source
            │
            ▼
Use all retrieved context to invoke the response generation model
```

If labels become sentences, simplify the model or move details into prose.

### Step 5: Add a Short Caption

After the diagram, explain its central meaning in one to three sentences.

Good:

> The cache is checked first because it is fast. The database is used only when the cache does not already contain the result.

Avoid:

> First, as shown in the diagram, the request goes to the cache. Then, as the next arrow shows, if the cache contains the data, it returns the data. Otherwise, as shown by the other arrow...

The prose should reveal the meaning of the picture, not narrate every arrow.

### Step 6: Introduce Technical Terms

After the user has the mental model, attach formal vocabulary to it.

```diagram
Everyday idea                 Technical term
─────────────                 ──────────────
Remember a previous result    Cache
Ask again after failure       Retry
Choose the next action        Routing
Repeat until acceptable       Evaluation loop
Save progress                 Persistence
```

Use jargon as a label for an understood idea—not as the starting point.

### Step 7: Anchor the Explanation in Reality

When working in a codebase, point to concrete files, functions, classes, configuration, or commands after the conceptual explanation.

Use this order:

```diagram
Mental model
     │
     ▼
Component responsibilities
     │
     ▼
Concrete files and symbols
     │
     ▼
Implementation details
```

Example:

- `api.py` receives the request.
- `service.py` owns the business decision.
- `repository.py` reads and writes stored data.

Use real paths and symbols. Do not invent anchors that have not been verified.

For local files in Amp responses, link them using Markdown file links with absolute paths and relevant line ranges.

## Default Response Structure

Use the smallest subset that fits the question.

### Simple concept

1. ASCII diagram
2. One-to-three-sentence explanation
3. Concrete example

### Hard abstract concept

1. Familiar analogy
2. ASCII diagram
3. Short explanation
4. Technical terms
5. Concrete example or code anchors

### Architecture explanation

1. High-level architecture diagram
2. Short responsibility summary
3. Small ownership table if needed
4. Concrete files
5. Detailed node or function flow only if requested

### Comparison

1. Side-by-side ASCII picture
2. Small comparison table
3. Recommendation tied to the user’s situation

### Debugging or code-path explanation

1. Expected flow
2. Actual flow
3. Highlight where they diverge
4. Point to the responsible code
5. State the consequence and fix

Example:

```diagram
Expected
Request ──▶ Validate ──▶ Save ──▶ Success

Actual
Request ──▶ Validate ──▶ Save
                            │
                            ▼
                       exception
                            │
                            ▼
                    success returned anyway
```

## Progressive Detail

Start at the highest useful level.

```diagram
Level 1: Why
User goal ──▶ System outcome

Level 2: What
Component A ──▶ Component B ──▶ Component C

Level 3: How
Function ──▶ condition ──▶ tool call ──▶ state update
```

Do not begin at Level 3 unless the user asks for implementation detail.

After giving the basic model, offer or provide deeper detail only when it helps answer the actual question.

## Comparisons and Tables

Use a table only when the user must compare dimensions.

Keep it small:

| Question | Option A | Option B |
|---|---|---|
| Who waits? | Caller | Worker |
| When is the result ready? | Immediately after work | Later |
| Best for | Fast operations | Slow background work |

Do not use a table to restate a flow already shown clearly in the diagram.

## Language Adaptation

Match the user’s language and vocabulary.

When explaining in Vietnamese:

- keep important English technical terms in parentheses when useful;
- explain the idea naturally instead of translating jargon word-for-word;
- use short sentences;
- preserve readable ASCII labels;
- introduce terminology only after the mental model.

Example:

> Queue giống như khay nhận việc. Người gửi đặt việc vào khay rồi tiếp tục; worker lấy việc ra xử lý sau.

```diagram
Người gửi ──▶ [ Queue / khay việc ] ──▶ Worker ──▶ Kết quả
```

## Diagram Quality Rules

Every diagram must satisfy these checks:

- It has one clear purpose.
- The reading direction is obvious.
- Every box represents a meaningful thing.
- Every arrow represents movement, dependency, or transition.
- Branch conditions are labeled.
- Loop-back arrows clearly show why repetition occurs.
- Components are named consistently.
- The diagram fits comfortably in a normal terminal width where possible.
- The explanation remains understandable without color.
- Decorative characters do not overpower the content.

## Common Failure Modes

### Diagram after a wall of prose

Bad order:

```diagram
Long explanation ──▶ Long explanation ──▶ Diagram at the end
```

Fix: show the mental model first.

### Too many details

Bad:

```diagram
One diagram containing every module, function, database table,
environment variable, retry rule, and error path
```

Fix: draw the main path first, then a second focused diagram only if needed.

### Diagram and prose say the same thing

Fix: let the diagram show structure; let prose explain meaning, purpose, or tradeoff.

### Undefined jargon

Bad:

> The conditional edge routes the state to a retriever node.

Better:

```diagram
Agent checks: “Do I need outside information?”
          │
          ├── yes ──▶ Search documents
          └── no ───▶ Answer directly
```

The check is implemented as a **conditional edge**.

### Misleading analogy

Fix: explicitly state where an analogy stops matching the real system.

### Unverified code references

Fix: inspect the code before naming files, symbols, behavior, or ownership.

### Decorative ASCII art

Do not draw pictures that look impressive but do not explain relationships.

Every line should contribute to understanding.

## Final Self-Check

Before sending an explanation, ask:

1. Can the user understand the main idea from the diagram alone?
2. Did I lead with the picture instead of jargon?
3. Is the caption shorter than the diagram’s implied explanation?
4. Did I choose the right shape: flow, branch, loop, layers, comparison, state, or hierarchy?
5. Did I remove details that are not needed yet?
6. Are all code anchors real and verified?
7. Did I adapt to the user’s requested language and depth?
8. Am I teaching one mental model rather than displaying everything I know?

If not, simplify before responding.

## Guiding Principle

```diagram
See it ──▶ Understand it ──▶ Name it ──▶ Apply it
```

First make the idea visible. Then explain it. Only then introduce its formal name and implementation details.
