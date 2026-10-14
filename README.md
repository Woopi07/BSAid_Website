# BSAid — Promotional Website

Landing page for **BSAid**, a simulation-based visual novel that helps first-year BSA students master
Financial Accounting and Reporting 1 (FAR1). All content is drawn from `public/Game-Design-Document.pdf`.

Built with React 18, Vite, and Tailwind CSS, in a retro pixel-arcade art style (hand-drawn SVG pixel sprites) with
clean type: **Helvetica Now Display** for headings and labels, **Montserrat** for body copy.

Helvetica Now Display is a licensed Monotype font and is not on Google Fonts. The font stack falls back to
Helvetica Neue → Helvetica → Arial. To serve it to every visitor, add your licensed `.woff2` files to `public/fonts/`
and declare them with `@font-face` in `src/styles/pixel.css`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## Pages

Clicking **TUTORIAL** on the landing page plays a captioned walkthrough video of the game
(`public/videos/`, details in `docs/tutorial-video.md`) with a step-by-step guide as a second tab.
A 28-second teaser with voice-over is in `public/videos/entry-point-teaser.mp4` (script in `docs/teaser-video.md`).

- `/` — promotional landing page (`index.html`, `src/`)
- `/play/` — **Entry Point** web game module (`play/index.html`, `src/game/`): fixed-viewport, app-like case files
  dashboard → level select → visual-novel intro → quiz workstation, with procedural lo-fi BGM and SFX (Web Audio API)

Both pages share the same retro pixel-arcade art style from `src/styles/pixel.css` (pixel borders, buttons, logotype,
scanlines, neon grid) and the sprites in `src/components/ui/PixelSprite.jsx`.

## Entry Point game module

```
src/game/
  App.jsx                      # view switch: DASHBOARD → LEVEL_MODAL → DIALOGUE_INTRO → QUIZ_WORKSTATION → LEVEL_RESULTS
  audio/engine.js              # Web Audio lo-fi loop + click/pop/chime/warning/unlock SFX (no audio files)
  context/AudioProvider.jsx    # mute/volume state; starts music on the first user gesture (autoplay policy)
  context/GameProvider.jsx     # navigation + progress reducer, ranks, level unlocking (saved to localStorage)
  data/cases.js                # case files, intro dialogue and questions — add levels/questions here
  components/                  # Header, Sidebar, CaseFilesScreen, LevelModal, Scene, DialogueIntro, QuizWorkstation, …
```

Character portraits are rasterized to 40×40 pixel art at runtime. To use real artwork, add `image: '/path.png'` to a case
(card thumbnail) and pass `src` to `Avatar` for portraits.
A level with an empty `questions` array shows as "coming soon" once unlocked.

## Structure

```
src/
  App.jsx                 # page composition
  data/content.js         # all copy, case files, characters, demo transactions
  components/
    Navbar.jsx            # sticky nav with mobile menu
    TitleScreen.jsx       # game title screen: headline, CTA, PLAY / TUTORIAL / QUIT menu (arrow keys + Enter)
    TutorialModal.jsx     # visual-novel style tutorial with Faraday
    QuitScreen.jsx        # "Quit game?" confirm + arcade "Continue?" countdown
    DemoStage.jsx         # PLAY target: controls + playable JournalDemo
    JournalDemo.jsx       # interactive debit/credit mini-challenge with hints & solution review
    About.jsx             # design goals + PLV-inspired campus locations
    Characters.jsx        # Faraday / Farahnaz tabs + branching storylines
    Gameplay.jsx          # core mechanics, rank & multiplier system
    CaseFiles.jsx         # selectable Case #01–#04 with level breakdowns
    HelpFeedback.jsx      # Help & Feedback system
    DownloadCTA.jsx
    Footer.jsx            # nav, GDD download, copyright
    ui/                   # Button, Icon, Coin, PixelSprite, Dialog, Section, SectionHeading
```

## Configuration

Set `ANDROID_DOWNLOAD_URL` in `src/data/content.js` to the Play Store or APK link once the build is published.
