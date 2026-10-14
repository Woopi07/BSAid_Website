# BSAid — Promotional Website

Landing page for **BSAid**, a simulation-based visual novel that helps first-year BSA students master
Financial Accounting and Reporting 1 (FAR1). All content is drawn from `public/Game-Design-Document.pdf`.

Built with React 18, Vite, and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## Structure

```
src/
  App.jsx                 # page composition
  data/content.js         # all copy, case files, characters, demo transactions
  components/
    Navbar.jsx            # sticky nav with mobile menu
    Hero.jsx              # headline, CTA, playable JournalDemo
    JournalDemo.jsx       # interactive debit/credit mini-challenge with hints & solution review
    About.jsx             # design goals + PLV-inspired campus locations
    Characters.jsx        # Faraday / Farahnaz tabs + branching storylines
    Gameplay.jsx          # core mechanics, rank & multiplier system
    CaseFiles.jsx         # selectable Case #01–#04 with level breakdowns
    HelpFeedback.jsx      # Help & Feedback system
    DownloadCTA.jsx
    Footer.jsx            # nav, GDD download, copyright
    ui/                   # Button, Icon, Coin, Section, SectionHeading
```

## Configuration

Set `ANDROID_DOWNLOAD_URL` in `src/data/content.js` to the Play Store or APK link once the build is published.
