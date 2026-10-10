# Proposal Layout and Delivery

## Stable Visual Grammar

Keep these qualities across products:

- Editorial composition rather than a dashboard-shaped slide deck.
- A strong split cover: concise thesis on one side, product or customer imagery on the other.
- Large, sentence-like headings that carry the argument.
- Numbered sections and restrained eyebrow labels for orientation.
- Generous whitespace with dense information grouped into deliberate panels.
- Product imagery and UI mockups as evidence, not decoration.
- Repeated geometric rules for cards, dividers, labels, and page numbers.
- Tonal hierarchy and borders before gratuitous shadows or gradients.

## Replaceable Brand Layer

Define semantic tokens once:

```css
:root {
  --primary: /* main dark or brand anchor */;
  --secondary: /* primary interaction or supporting brand */;
  --accent: /* scarce emphasis */;
  --accent-soft: /* subdued accent */;
  --canvas: /* page ground */;
  --surface: /* content surface */;
  --ink: /* main text */;
  --muted: /* supporting text */;
  --border: /* structural line */;
  --font: /* approved family */;
}
```

Source these values from `DESIGN.md`. When adapting to another product, replace this layer plus logo, imagery, and domain language. Do not change layout merely because the palette changed.

Check contrast after every palette substitution. Accent colors often fail for small text; use them for lines, large labels, fills with dark text, or selected states as appropriate.

## Page Construction

- Set a consistent physical page ratio and fixed render dimensions.
- Keep the main heading, section argument, visual, and page number inside one visible page.
- Use 2–4 column structures only when each column remains readable in the exported PDF.
- Roadmaps need explicit date labels, workstream names, and milestones; bar length must derive from actual dates rather than visual guesswork.
- Flow diagrams need a clear reading direction and named outputs between stages.
- Device mockups must use the supplied frame asset when available. Inspect transparency and place the UI behind the screen opening; never stack a second CSS device border.

## Browser Review

At the exact target viewport:

1. Capture every page or a full-page screenshot that can be split reliably.
2. Inspect title wrapping, body overflow, visual crops, tiny labels, and page-number placement.
3. Confirm all local images have `naturalWidth > 0` and no page errors are reported.
4. Check that intended page bounds match actual section bounds.
5. Review the document at fit-to-page scale, not only zoomed in.

## PDF Export

Use print rules equivalent to:

```css
@media print {
  @page { size: 15in 9.375in; margin: 0; }
  body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  .page { width: 1440px; height: 900px; break-after: page; }
}
```

Adjust the physical size only when the target ratio changes. Export from Chromium with backgrounds enabled and zero margins.

After export:

1. Confirm page count.
2. Rasterize every PDF page.
3. Inspect for font fallback, clipping, blank pages, shifted backgrounds, broken image paths, and thin-line loss.
4. Check file size and openability.
5. Keep intermediate screenshots outside the final artifact folder; retain only reviewable final visuals and deliverables.
