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
- Inquiry form: submissions are emailed to sales@ptsiphil.com through FormSubmit (formsubmit.co). The first
  submission sends a one-time activation email to that inbox; click "Activate Form" in it, and every later inquiry
  arrives automatically. If the service is unreachable, the visitor is offered a pre-filled Gmail draft instead.
