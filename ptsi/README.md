# PTSI — Modernized single page

A modernized, single-page version of the Productivity Technologies Services, Inc. site (ptsiphil.com) in plain
HTML, CSS and JavaScript. It needs no framework and no build step.

- `index.html` — markup and content
- `styles.css` — styles; all brand colours and fonts are in the `:root` token block at the top
- `script.js` — interactions

Open `index.html` through any static server (e.g. `python3 -m http.server` in this folder), or run `npm run dev`
from the repo root and visit `/ptsi/`.

## Before going live

1. **Brand tokens** — set `--brand-*` colours and `--font-heading` / `--font-body` in `styles.css` to the exact
   values from ptsiphil.com, and update the Google Fonts `<link>` in `index.html` to match.
2. **Images** — every `<img src="/api/placeholder/W/H" data-label="…">` is a slot for an original photo. Until a real
   `src` is set, `script.js` draws a dashed box showing the label and size. Each slot also has an
   `<!-- INSERT: … -->` comment above it. The slots are: header logo, hero banner, About Us photo, 10 partner logos,
   6 award graphics, 3 client avatars and the footer logo.
3. **Copy** — comments marked `<!-- REPLACE: … -->` (About Us text, client reviews) and `<!-- VERIFY: … -->`
   (phone number, office address) still hold sample or placeholder text.

## Features

Sticky header that shrinks and turns translucent on scroll · hero parallax and typed tagline · Intersection
Observer fade/slide-up reveals · service cards that lift and reveal a description and "Learn More" on hover or
focus (shown by default on touch screens) · 0 → 32 counter · two seamless auto-scrolling marquees (partners,
awards) that pause on hover · auto-advancing review slider with swipe · expandable quick-contact FAB (Esc or an
outside click closes it) · mobile slide-in nav · `prefers-reduced-motion` support.
