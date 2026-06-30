---
name: The Spark & Steel Workshop
description: Industrial garage grit meets high-contrast, professional engineering structure
colors:
  primary: "#f93e1b"
  secondary: "#ff901e"
  feedback-success: "#4ade80"
  neutral-bg: "#0c0b0d"
  neutral-surface: "#121115"
  neutral-border: "#706c79"
  neutral-text: "#f4f1ee"
  neutral-muted: "#9d9893"
typography:
  display:
    fontFamily: "League Spartan, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.85rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
---

# Design System: The Spark & Steel Workshop

## 1. Overview

**Creative North Star: "The Spark & Steel Workshop"**

"The Spark & Steel Workshop" design system combines the raw, industrial garage feel of a robotics workshop with the precision, grid alignment, and clean structure of a professional engineering portal. It rejects the soft, friendly SaaS curves and cream backdrops of typical template sites in favor of a sharp, high-contrast dark palette, heavy typographic weights, and robust layouts.

  Garage Black (#0c0b0d): The main background color. A deep, solid near-black that provides maximum contrast.
  Steel Container (#121115): The surface color for structured container areas, lists, and form inputs.
  Welding Seam (#222026): The border color, used for sharp layout dividers and input boundaries.
  Bright Ash (#f4f1ee): The primary body text color, offering excellent contrast against the dark background.
  Cold Soot (#9d9893): The muted text and icon color, maintaining readability while establishing hierarchy.
  Spark Green (#4ade80): The success feedback color, used for positive system status.

The palette is rooted in industrial steel and high-heat combustion.

### Primary
- **Combustion Red** (#f93e1b): The primary brand accent, used for high-importance interactions, buttons, and selective key headings. It represents the heat of the toaster.
### Secondary
- **Embers Orange** (#ff901e): The secondary accent color, used for secondary states, hover highlights, and technical data points.

### Neutral
- **Garage Black** (#0c0b0d): The main background color. A deep, solid near-black that provides maximum contrast.
- **Steel Container** (#121115): The surface color for structured container areas, lists, and form inputs.
- **Welding Seam** (#706c79): The border color, used for sharp layout dividers and input boundaries (providing WCAG AA contrast).
- **Bright Ash** (#f4f1ee): The primary body text color, offering excellent contrast against the dark background.
- **Cold Soot** (#9d9893): The muted text and icon color, maintaining readability while establishing hierarchy.
- **Spark Green** (#4ade80): The success feedback color, used for positive system status.

### Named Rules
**The Accented Restraint Rule.** The combustion red accent must occupy ≤10% of any screen surface. It is a spark, not a wash. Under no circumstances should body text, large background blocks, or non-interactive containers be fully red.

## 3. Typography

**Display Font:** League Spartan (with system-ui fallbacks)
**Body Font:** Public Sans (with system-ui fallbacks)
**Label/Mono Font:** JetBrains Mono (with monospace fallbacks)

**Character:** A modern, highly technical look. Display text relies on League Spartan's extra-bold geometric weights and tight letter-spacing for maximum presence. Body text utilizes Public Sans with a generous line-height to ensure reading comfort. Technical details and labels are set in JetBrains Mono.

### Hierarchy
- **Display** (800, clamp(2.5rem, 7vw, 5rem), 1.05): Used for main hero headlines only.
- **Headline** (800, clamp(1.8rem, 4.5vw, 2.8rem), 1.1): Used for major section headers.
- **Title** (700, 1.25rem, 1.3): Used for cards, member names, and specs.
- **Body** (400, 1rem, 1.6): Used for description copy, team roles, and details.
- **Label** (500, 0.85rem, 1.2): Used for buttons, specs, and form labels.

### Named Rules
**The Balance Rule.** All display and headline text must use `text-wrap: balance` to prevent orphans and unbalanced line breaks. Long paragraphs must use `text-wrap: pretty` to maintain reading flow.

## 4. Elevation

The system is flat by default, rejecting decorative elevation and ambient shadows. Depth is conveyed strictly through contrasting flat color surfaces.

### Named Rules
**The Flat-Surface Rule.** All cards, sections, and navigation layers reside on a flat grid. Shadows are forbidden except as subtle interactive feedback (e.g., a glowing border or red glow on hover).

## 5. Components

Components are styled with sharp borders and clean padding to enforce the industrial feeling.

### Buttons
- **Shape:** Soft-square (6px radius)
- **Primary:** Combustion Red (#f93e1b) background, Garage Black (#0c0b0d) text. 12px 24px padding.
- **Ghost:** Transparent background with a Welding Seam (#222026) border. Bright Ash (#f4f1ee) text.
- **Hover / Focus:** Hovering primary buttons shifts background to Embers Orange (#ff901e). Hovering ghost buttons shifts border to Combustion Red (#f93e1b). Transition timing must be 0.15s ease-out.

### Cards / Containers
- **Corner Style:** Rounded (12px radius)
- **Background:** Steel Container (#121115)
- **Border:** Welding Seam (#222026), 1px solid.
- **Internal Padding:** Generous padding (32px) on all sides to prevent cramped layouts.

### Inputs / Fields
- **Style:** Steel Container (#121115) background, Welding Seam (#222026) border.
- **Focus:** Sharp transition to a Combustion Red (#f93e1b) border. No glow rings.

### Navigation
- **Style:** Fixed to the top. Blended with Garage Black at 90% opacity. Simple text links in Cold Soot (#9d9893) transitioning to Bright Ash (#f4f1ee) on hover.

## 6. Do's and Don'ts

### Do:
- **Do** use asymmetrical grid layouts to divide text and media/robot specs.
- **Do** keep body copy constrained to a maximum width of 65ch for reading comfort.
- **Do** use strict border lines and surface color differences to establish sections.
- **Do** disable animations for users with `prefers-reduced-motion: reduce`.

### Don't:
- **Don't** use gradient text under any circumstances; rely on size, weight, and color contrast.
- **Don't** use uppercase, wide-tracked kicks or eyebrows on every section (such as "// who we are" or "ABOUT"). Let the headlines speak for themselves.
- **Don't** use side-stripe borders (borders >1px on one side of an element) for accents.
- **Don't** use decorative glassmorphism or back-blurs unless physically contextual (like a sticky navbar).
- **Don't** use a cream or beige background; the canvas must remain Garage Black.
- **Don't** use numbered section markers (01, 02, etc.) as decorative eyebrows.
