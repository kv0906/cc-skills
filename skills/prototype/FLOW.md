# Core Flow Prototype Mode

Use this mode for full-screen product walkthroughs intended to align stakeholders and engineers on the happy path. It is not a production implementation and does not need edge cases unless requested.

## Inputs

Collect these from the request and repository before designing:

1. Product areas, such as Seller Portal, Admin, customer web, or Mobile App.
2. The primary user and business outcome for each area.
3. The minimum ordered screens that complete one meaningful journey.
4. `DESIGN.md`, product screenshots, logos, photos, device frames, and existing UI assets.
5. Target viewport and handoff format.

If a `DESIGN.md` exists, map its YAML tokens into CSS custom properties or the host framework. Preserve typography, spacing, radii, component roles, and visual rationale. Brand colors are replaceable inputs, not part of this skill's identity.

## Scope the Journey

Write each area as a linear outcome:

`entry → choose/create → provide information → process/review → result/action`

Keep only screens needed to explain that path. One prototype screen should communicate one dominant task. Use realistic labels, statuses, product data, and calls to action from the domain.

Do not add authentication, validation failures, empty states, retries, permissions, settings, or technical implementation details unless the user asks for them.

## Presentation Structure

Create a full-screen harness with:

1. **Overview:** one card per product area, ordered screen list, user, outcome, and an entry CTA.
2. **Product-area views:** one representative screen at a time, filling the viewport.
3. **Flow documentation:** step number, purpose, key UI responsibilities, and previous/next controls. For desktop products this may live in the product shell; for mobile it may sit beside the device.
4. **Persistent picker:** switch areas without returning to the overview.

Use [PICKER.md](PICKER.md) for behavior. Store the selected area in `?v=1`, `?v=2`, and so on. Support picker clicks, number keys, and left/right keys. Flow steps should support visible previous/next controls and direct step dots when useful.

## Desktop Product Screens

- Show the real shell: sidebar or navigation, page header, context, and current user when relevant.
- Build screens around business actions rather than dashboard decoration.
- Use tables for comparison-heavy operational data; use forms for creation; use split review layouts for source-versus-result checks.
- Keep one primary CTA per task and maintain visible progress across multi-step flows.
- At 1440×900, the primary content and picker must not obscure each other.

## Mobile App Screens

- Present the app inside a device frame when the user supplies one.
- Inspect the frame's alpha channel and determine the transparent screen rectangle. Position one `.device-screen` behind one frame overlay.
- The frame overlay must be an image asset. Set the device and screen borders to zero so no duplicate CSS phone appears.
- Respect status bar, safe area, bottom navigation, and at least 44×44pt or 48×48dp touch targets in the intended implementation. Mockups may scale these proportionally for presentation.
- Use full-screen media for camera/AR flows. Controls should overlay the media, while selection and guidance should remain legible.
- Keep every key item above bottom navigation. Do not hide product cards or primary actions under device chrome.

## Visual Grammar

The default presentation style is editorial and product-led:

- Large, concise headings; compact eyebrow labels; generous whitespace.
- Strong contrast between product imagery and restrained application chrome.
- Numbered flow steps and short explanatory copy for engineering handoff.
- Tonal surfaces and hairlines before shadows.
- Reuse one token system across desktop and mobile, adapting density rather than inventing a second visual identity.

This grammar is stable across products. Colors, imagery, logo, and domain language come from the current product's `DESIGN.md` and assets.

## Copy

- Write for the actual user of each screen, not for the software team.
- Name the task and outcome: “Thông tin sản phẩm”, “Xem trước và gửi duyệt”, “Kết quả và liên hệ”.
- Prefer concise Vietnamese when the audience is Vietnamese. Keep established terms such as Mobile App, Seller Portal, AR, 3D, API, and Virtual Try-On when translation would sound unnatural.
- Avoid invented claims, exact metrics, or unsupported automation behavior.

## Verification

Run the prototype in a browser and verify:

1. Overview loads without page or console errors.
2. Picker clicks, keyboard shortcuts, and query parameters select the correct area.
3. Every previous/next path reaches all screens in both directions.
4. Direct step controls work when present.
5. All local assets load. For a device frame, verify its natural dimensions, computed background image, one frame instance, and zero CSS border widths.
6. Capture and inspect at minimum: overview, first desktop screen, final desktop review screen, first mobile screen, and immersive camera/AR screen.
7. At the target viewport, no CTA is hidden by the picker and no app content is hidden by bottom navigation or device chrome.

Report the preview link, included flows, verification result, and one inspected representative screenshot.
