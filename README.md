# FTC 36424 — Underengineered Toasters · Website

A **fully static, single-file website**. All CSS and JavaScript are inlined into
`index.html` — nothing to load, nothing to disconnect.

## Run it
**Just double-click `index.html`.** It works straight off your hard drive — no
server, no build step, no internet required (fonts gracefully fall back when offline).

To host it live, upload `index.html` (and the `images/` folder) to any static host:
GitHub Pages, Netlify, Vercel, Cloudflare Pages, or plain web hosting. That's it.

## Add your real logo ⭐
The site ships with a hand-built SVG of the flaming-toaster "36424" logo as a
placeholder. To use your **actual** logo:

1. Save it as **`images/logo.png`** (square-ish transparent PNG looks best).
2. Refresh — it auto-replaces the SVG in the navbar, hero, and footer.

No code changes needed; the script checks for `images/logo.png` and falls back to
the built-in SVG only if it's missing.

## Add a robot photo
Save it as `images/robot.jpg`, then in `index.html` replace the
`<div class="robot__placeholder">…</div>` block with:
`<img src="images/robot.jpg" alt="The Toaster" style="width:100%;height:100%;object-fit:cover;">`

## Customize content
Everything lives in `index.html`. Edit these JS arrays near the bottom (inside `<script>`):
- `TEAM` — member names + roles
- `AWARDS` — your real awards / timeline
- `SPONSORS` — sponsor names (or swap for `<img>` logos)

Contact email, social links, robot specs, and stats are in the HTML above.

## Structure
```
ftc_website(underengineered_toasters)/
├── index.html     ← the entire site (HTML + CSS + JS inlined)
├── images/        ← put logo.png and robot.jpg here
└── README.md
```
