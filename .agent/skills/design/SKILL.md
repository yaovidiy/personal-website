# Design System Specification: The Ethereal Glass Aesthetic

## 1. Overview & Creative North Star: "The Luminescent Prism"

This design system is anchored by a Creative North Star we call **"The Luminescent Prism."**

We are moving away from the "flat box" era of UI. Instead, we treat the interface as a high-end physical installation of layered obsidian, frosted violet glass, and focused light. By leveraging the Inter typeface’s geometric precision against a backdrop of deep, shifting gradients, we create an editorial experience that feels both authoritative and atmospheric.

The goal is **Intentional Depth**. We break the traditional grid by using overlapping containers, asymmetrical white space (using our 1.4rem to 2.75rem spacing tokens), and "ghost" elements that bleed into the background. This is not just a dark mode; it is a curated digital environment where light doesn't just hit a surface—it passes through it.

---

## 2. Colors & Surface Philosophy

The palette is a sophisticated transition from the deep void of `#0c0c1f` to the vibrant energy of `primary` (#c59aff) and `secondary` (#00cffc).

### The "No-Line" Rule

**Designers are strictly prohibited from using 1px solid, 100% opaque borders for sectioning.**
Structural separation must be achieved through:

1. **Tonal Shifts:** Placing a `surface-container-high` card against a `surface-dim` background.
2. **Negative Space:** Utilizing the `spacing-8` (2.75rem) or `spacing-10` (3.5rem) tokens to let the layout breathe.
3. **Gradient Bleeds:** Using a subtle linear gradient from `surface` to `surface-bright` to imply a change in section.

### Surface Hierarchy & Nesting

Treat the UI as a physical stack. The closer an element is to the user, the more "light" it catches:

- **Base Layer:** `surface` (#0c0c1f)
- **Secondary Content Areas:** `surface-container-low` (#111126)
- **Interactive Cards/Modules:** `surface-container-high` (#1d1d36)
- **Floating Modals/Popovers:** `surface-bright` (#292947) with 80% opacity and 20px backdrop-blur.

### Signature Textures (Glass & Gradient)

To achieve the premium "soul," use a 15° linear gradient for primary CTAs: `primary` (#c59aff) to `primary-container` (#ba88ff). This subtle shift adds dimension that flat fills lack.

---

## 3. Typography: Editorial Authority

We use **Inter** exclusively, but we treat it with editorial intent. The contrast between `display-lg` and `label-sm` is our primary tool for hierarchy.

- **Display & Headlines:** Use `display-md` (2.75rem) for hero statements. Tighten letter-spacing by -0.02em to give it a "machined" look. Headlines should always use `on-surface` (#e5e3fe).
- **Body Copy:** Use `body-lg` (1rem) for readability. For secondary information, use `body-md` with the `on-surface-variant` (#aaa8c2) token to reduce visual noise.
- **Labels:** `label-md` (0.75rem) should be used for all-caps "eyebrow" text above headlines to create a sophisticated, tiered reading experience.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are too heavy for this aesthetic. We use **Ambient Illumination**.

- **The Layering Principle:** Depth is achieved by stacking. An inner container should always be one "tier" higher than its parent (e.g., a `surface-container-highest` element inside a `surface-container-low` section).
- **Ambient Shadows:** For floating elements, use a wide, soft shadow: `0 20px 40px rgba(0, 0, 0, 0.4)`. The shadow should feel like a natural occlusion of light, not a black smudge.
- **The "Ghost Border":** When containment is functionally required (e.g., input fields), use the `outline-variant` (#46465c) at **20% opacity**. This creates a hint of an edge that catches the "light" without breaking the glass illusion.
- **Glassmorphism:** All "Top Layer" elements (Modals, Navigation Bars, Tooltips) must use a semi-transparent `surface-container` fill (approx 70% opacity) combined with a `backdrop-filter: blur(12px)`.

---

## 5. Components & Primitives

### Buttons

- **Primary:** A gradient fill (`primary` to `primary-container`) with a `full` roundedness. No border. Text color: `on-primary` (#420082).
- **Secondary:** Transparent background with a "Ghost Border" (20% `outline-variant`).
- **Tertiary:** Text-only using `secondary` (#00cffc), used for low-priority actions.

### Cards & Containers

- **Style:** No internal dividers. Use `spacing-4` (1.4rem) internal padding.
- **Edge:** Apply `rounded-lg` (1rem) or `rounded-xl` (1.5rem) for a modern, friendly feel.
- **Hover State:** Increase background brightness from `surface-container-high` to `surface-bright` and apply a subtle `primary` outer glow (4% opacity).

### Input Fields

- **Background:** `surface-container-lowest` (#000000) at 40% opacity.
- **Indicator:** On focus, the "Ghost Border" transitions to 100% opacity `primary` (#c59aff) with a 2px stroke.

### Specialized Component: The "Glass Prism" Chip

- A selection chip using `surface-variant` (#23233f) with a 10% opacity white top-border to mimic the "glint" on the edge of a piece of glass.

---

## 6. Do's and Don'ts

### Do:

- **DO** use `surface-tint` to add a very subtle 2% purple overlay to background sections to maintain color harmony.
- **DO** embrace asymmetry. Offset images or text blocks to create a dynamic, "non-template" flow.
- **DO** prioritize legibility. Ensure text on glass backgrounds always uses `on-surface` or `primary` for high contrast.

### Don't:

- **DON'T** use pure `#000000` for backgrounds unless it is the `surface-container-lowest` tier intended for deep contrast.
- **DON'T** use 1px solid white borders. They shatter the "premium glass" illusion and look dated.
- **DON'T** crowd the layout. If in doubt, increase the spacing by one level on the scale (e.g., move from `spacing-6` to `spacing-8`).
