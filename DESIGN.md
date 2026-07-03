# Design

Visual system for the Underengineered Toasters (FTC 36424) site. Dark & fiery, drenched-to-committed color strategy: charcoal sheet-metal surfaces, flame as the brand color carrying 30–50% of every fold. Reference lane: skate-brand acid-maximalism (Liquid Death energy) built with workshop precision — NOT editorial, NOT SaaS.

## Color

All colors OKLCH. Derived from the team logo (flaming toaster: golden-yellow flame core, orange mid, red edges, gray toaster body).

| Token | Value | Role |
|---|---|---|
| `--bg` | `oklch(0.15 0.012 45)` | Body background — warm near-black charcoal |
| `--surface` | `oklch(0.20 0.018 50)` | Raised panels, nav |
| `--surface-2` | `oklch(0.24 0.02 55)` | Second-level raise, hover |
| `--ink` | `oklch(0.96 0.015 85)` | Body text — warm off-white (≥4.5:1 on all surfaces) |
| `--ink-muted` | `oklch(0.76 0.02 70)` | Secondary text (still ≥4.5:1 on `--bg`) |
| `--flame` | `oklch(0.78 0.16 70)` | Primary brand — golden flame orange |
| `--ember` | `oklch(0.68 0.19 48)` | Deep orange — hovers, gradients |
| `--scorch` | `oklch(0.58 0.21 32)` | Red-orange — hot edges, emphasis bands |
| `--crumb` | `oklch(0.42 0.06 60)` | Toast-crust brown — borders, dividers |

Contrast rules: body text always `--ink` or `--ink-muted`, never lighter. `--flame` on `--bg` passes AA for all text sizes. On flame-filled surfaces, text is `--bg` (dark on flame), never white.

## Typography

- **Display / brand voice: "Bungee"** (Google Fonts) — DJR's sign-painting font. Loud, urban, chromatic. Used for h1, section titles, the ticker, buttons. All-caps by design. Letter-spacing 0 to +0.02em (never negative — Bungee is already tight).
- **Body / engineering voice: "Archivo"** (variable: weight + width) — industrial grotesque with signage DNA. Body at 400/430, subheads at 800 expanded. The precision under the chaos.
- Scale: 1.333 ratio. Body 1rem/1.6. Fluid headings via clamp(), display ceiling 5.5rem.
- `text-wrap: balance` on h1–h3; body max 68ch.

## Components

- **Nav**: sticky top bar on `--surface`, logo mark + wordmark left, page links right; current page gets a flame underline (3px). Mobile: horizontal scroll, no hamburger.
- **Buttons**: "toaster lever" — sharp 6px radius, Bungee, flame fill with dark text (primary) or 2px flame border (secondary). Press state translates down 2px like pushing the lever.
- **Panels**: `--surface` on 10px radius, 1px `--crumb` border, NO drop shadows (sheet metal doesn't glow).
- **Ticker**: full-width marquee band in `--flame` with dark Bungee text. One per page max.
- **Dividers**: "crumb line" — dotted 3px `--crumb` border, not solid rules.

## Motion

- Ease: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out). Durations 300–700ms. No bounce.
- Hero: Three.js procedural fire shader (fbm noise) + GPU ember particles. Sub-pages get a lighter ember-field band.
- Scroll reveals enhance visible defaults (content never hidden without JS); per-section treatments, not one uniform fade.
- **Page transitions: the toast-pop** (`navigate.js` + `main.css`). Internal navigations swap only `<main>` client-side; nav, footer, and document persist. Choreography is one toaster cycle, ≤400ms wall time: lever press (12px down, 70ms) → eject (up 22vh with fade, quad-out — travel must stay visible ~150ms or it reads as a flicker) → bread-drop (new page falls in from −8vh, expo-out, dead stop — sheet metal, no settle bounce). Old page ejects UNDER the sticky nav (`--z-page-exit: 9`). Pages prefetch on hover/focus; any fetch failure falls back to a real navigation; the CSS cross-document view-transition covers no-JS browsers.
- `prefers-reduced-motion`: shaders render a single static frame; ticker stops; reveals become instant; page swaps are instant (no eject/drop classes ever added).

## Layout

- Content column: `min(1100px, 92vw)`. Fluid section spacing `clamp(4rem, 10vh, 8rem)`.
- Asymmetric folds: alternate text-heavy / visual-heavy sides. No identical card grids — vary spans.
- z-scale: `--z-ticker: 5; --z-page-exit: 9; --z-nav: 10; --z-modal: 50; --z-toast: 60`.
