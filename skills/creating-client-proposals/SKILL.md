---
name: creating-client-proposals
description: Creates polished Vietnamese HTML proposals for business owners and investment partners, focused on product scope, customer experience, roadmap, and operating model. Use when preparing a client-facing proposal, pitch document, or HTML-to-PDF presentation.
---

# Creating Client Proposals

Create a decision-ready proposal that helps a business owner understand what the product does, how it operates, what the MVP includes, and how delivery unfolds. The deliverable is a polished HTML document designed for later PDF export.

This skill preserves the editorial layout and direct business writing style established by the VTO proposal while treating brand colors, imagery, logo, product facts, and domain terms as replaceable inputs.

## Inputs

Before writing, inspect or obtain:

- Recipient and decision: who will read this and what commitment should the proposal support?
- Product name, one-sentence promise, target users, and business context.
- Confirmed scope, feature list, user journeys, roadmap, and dependencies.
- `DESIGN.md`, brand colors, typography, logo, imagery, screenshots, and device frames.
- Statements that are confirmed versus open for discussion.

Verify factual claims from project sources. Do not turn assumptions, research tasks, technical options, or estimates into settled promises.

## Content Strategy

Load [CONTENT.md](CONTENT.md) and use its narrative sequence and writing rules. Start from the reader's business outcome, then explain the complete operating journey. Translate implementation detail into observable capability unless technical comparison is explicitly requested.

For Vietnamese recipients, write natural Vietnamese throughout. Keep established terms such as Mobile App, Seller Portal, AR, 3D, API, SaaS, and Virtual Try-On when translating them would sound awkward. Do not mix English into headings for decoration.

## Visual Strategy

Load [LAYOUT.md](LAYOUT.md) before implementation.

- Use the project's `DESIGN.md` as the token source. If it does not exist, define a small semantic palette before layout.
- Preserve the system's editorial grammar: large thesis-led headings, numbered sections, generous whitespace, strong product imagery, structured flow diagrams, and restrained application chrome.
- Replace colors by semantic role (`primary`, `secondary`, `accent`, `canvas`, `ink`, `muted`, `border`), never by searching and replacing scattered hex values.
- Use one primary type family. Default to Be Vietnam Pro for Vietnamese proposals unless the project specifies another font.
- Generate or build product mockups only when they clarify scope or flow. Use supplied brand and device assets faithfully.

If this is a new visual direction rather than an adaptation of an approved style, follow the Huashu three-direction exploration workflow before producing the final document. If the user explicitly requests this established proposal style, proceed directly with product-specific tokens and content.

## Implementation

1. Produce semantic standalone HTML and CSS. Avoid a framework unless it materially improves the requested deliverable.
2. Use CSS custom properties for all palette roles and typography.
3. Build one fixed presentation page per section. Default to 1440×900 or a consistent 16:10 page unless the user specifies another format.
4. Add print CSS with an explicit page size, zero browser margins, exact color adjustment, and one forced page break per section.
5. Use real content and actual product assets. Do not use lorem ipsum, fake testimonials, or unsupported performance claims.
6. Keep screen mockups and diagrams legible at PDF size; details too small to survive export do not belong in the proposal.

## Verification and Delivery

Load [LAYOUT.md](LAYOUT.md) for the full checklist.

- Run the HTML through a browser at the target viewport.
- Inspect every page for overflow, clipping, awkward wrapping, contrast, and inconsistent rhythm.
- Verify all image requests and page/console errors.
- Export the PDF from the verified HTML, then rasterize and inspect every PDF page; HTML screenshots alone do not verify the PDF.
- Deliver the HTML preview link first. Deliver the PDF when requested, with one representative inspected visual.

Do not publish, email, or send the proposal to an external recipient without explicit approval.
