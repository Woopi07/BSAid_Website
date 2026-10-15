# PTSI — Modernized single page

A modernized, single-page version of the Productivity Technologies Services, Inc. site (ptsiphil.com) in plain
HTML, CSS and JavaScript. It needs no framework and no build step.

- `index.html` — markup and content
- `styles.css` — styles; all brand colours and fonts are in the `:root` token block at the top
- `script.js` — interactions

Open `index.html` through any static server (e.g. `python3 -m http.server` in this folder). On Vercel, deploy
with the **Other** preset, root directory `./` and an empty build command.

## Content

All copy, contact details, partner logos, product brands, awards and the NPC registration come from the official
PTSI website design (PDF). Brand colours (navy `#002769`, orange `#FFA100`) and the Montserrat typeface match it.
Images live in `images/` (`brand/`, `photos/`, `awards/`, `partners/`, `global/`, `products/`, `npc/`).

## Still to do

- Company video: `videos/ptsi-company.mp4` (60 s, voice-over and captions) was produced from the site's own photos,
  awards and logo. To use an official PTSI video instead, replace that file (and the `.vtt` captions and poster).
- The inquiry form opens the visitor's email app (mailto) addressed to sales@ptsiphil.com; connect a form service
  (e.g. Formspree) if submissions should arrive without the visitor's email app.
