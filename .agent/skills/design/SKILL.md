```markdown
# Design System Specification: Editorial Precision

## 1. Overview & Creative North Star: "The Kinetic Manuscript"

This design system moves beyond the standard documentation template to create **The Kinetic Manuscript**. It is a high-end, developer-centric experience that treats code and technical prose with the reverence of a prestige editorial publication.

The aesthetic is built on **Precise Asymmetry** and **Tonal Depth**. By moving away from rigid, boxed-in grids and embracing white space as a structural element, we create an interface that feels lightweight and "fast," mimicking the efficiency of the underlying technology. We avoid the "template look" by utilizing dramatic typographic scales and overlapping layers that break the traditional container boundaries.

---

## 2. Colors & Surface Architecture

The palette is rooted in a pristine, warm-neutral base (`#fcf9f8`) activated by a high-energy "Kinetic Orange" (`#af2800`).

### The "No-Line" Rule

**Strict Mandate:** 1px solid borders are prohibited for sectioning or containment. Structural separation must be achieved exclusively through background shifts. For example, a `surface-container-low` code block should sit directly on a `surface` background. The eye should perceive the change in tone, not a hard "cut" line.

### Surface Hierarchy & Nesting

Treat the UI as a physical stack of fine paper.

- **Base Layer:** `surface` (#fcf9f8) for global backgrounds.
- **Secondary Layer:** `surface-container-low` (#f6f3f2) for sidebar or secondary navigation.
- **Emphasis Layer:** `surface-container-highest` (#e5e2e1) for high-utility modules or code headers.
- **The Depth Rule:** When nesting, an inner container must always be at least one tier higher or lower than its parent to maintain "Natural Depth."

### Signature Textures & Glassmorphism

To add "soul" to the precision:

- **Floating Navigation:** Use `surface-container-lowest` at 80% opacity with a `20px` backdrop-blur for headers, allowing content to bleed through softly as the user scrolls.
- **The Kinetic Gradient:** For hero CTAs and primary action states, use a subtle linear gradient from `primary` (#af2800) to `primary-container` (#db3400) at a 135-degree angle. This prevents the orange from feeling "flat" or "plastic."

---

## 3. Typography: The Editorial Engine

The system uses a sophisticated mix of **Space Grotesk** for structural authority and **Inter** for technical clarity.

- **Display (Space Grotesk):** Large, airy, and bold. Used for page titles and major section starts. High-contrast sizing (3.5rem) creates a clear point of entry.
- **Headline (Space Grotesk):** Tight tracking, high-impact. Used to anchor content modules.
- **Body & Labels (Inter):** Chosen for its exceptional readability in dense technical documentation.
- **The Hierarchy Strategy:** We use "Scale Gaps." A `display-lg` heading followed by a `body-md` description creates intentional white space that makes the content feel approachable and premium.

---

## 4. Elevation & Depth

We eschew the "material" look of heavy drop shadows in favor of **Ambient Luminosity**.

- **The Layering Principle:** Avoid elevation levels 1-5. Instead, use Tonal Layering. A `surface-container-lowest` card placed on a `surface-container` background creates a "lift" through color value alone.
- **Ambient Shadows:** For "floating" elements like Tooltips or Modals, use a 32px blur with 4% opacity of the `on-surface` color. It should feel like a soft glow, not a shadow.
- **The Ghost Border:** If a border is required for extreme accessibility cases, use `outline-variant` (#e7bdb3) at **15% opacity**. Never 100%.
- **Glassmorphism:** Navigation rails and floating action buttons must use semi-transparent surface colors to integrate with the layout rather than feeling "pasted" on top.

---

## 5. Components

### Buttons

- **Primary:** Gradient-filled (Kinetic Orange), `md` (0.375rem) roundedness. No border. Text is `on-primary` (#ffffff).
- **Secondary:** `surface-container-high` background with `primary` text. This creates a "soft" action that doesn't compete with the main CTA.
- **Tertiary:** Pure text with a 2px `primary` underline that appears only on hover.

### Cards & Modules

- **Constraint:** No borders, no dividers.
- **Separation:** Use `spacing-8` (2rem) of vertical white space or a shift to `surface-container-low`.
- **Interaction:** On hover, a card should shift from `surface-container-low` to `surface-container-lowest` to simulate "lifting" toward the user.

### Input Fields

- **Styling:** `surface-container-highest` background with a bottom-only "Ghost Border" (20% `outline-variant`).
- **Focus State:** The bottom border transforms into a 2px `primary` line.

### Code Blocks (Developer Specific)

- **Background:** `inverse-surface` (#303030).
- **Typography:** Fira Code (or equivalent mono).
- **Detail:** Use `primary-fixed-dim` (#ffb4a2) for syntax highlighting to keep the brand present even in code.

---

## 6. Do's and Don'ts

### Do

- **DO** use dramatic white space. If you think there's enough room, add `spacing-4` more.
- **DO** lean on typography for hierarchy. A larger font size is often better than a bolder color.
- **DO** use the "Kinetic Orange" sparingly. It is a laser, not a paint bucket.

### Don't

- **DON'T** use 1px solid grey lines to separate content. It clutters the "Kinetic Manuscript" feel.
- **DON'T** use standard "drop shadows." They feel dated and heavy. Use Tonal Layering.
- **DON'T** use pure black (#000000). Always use `on-surface` (#1b1b1c) for text to maintain a high-end, soft-ink look.
- **DON'T** use "Hard Corners." While precise, we use a `DEFAULT` (0.25rem) or `md` (0.375rem) radius to keep the interface feeling modern and approachable.
```
