# Entry Point — Teaser (0:28, with voice-over)

`public/videos/entry-point-teaser.mp4` — H.264 1280×720 + AAC stereo, 28 s, 4.4 MB, loudness-normalized to −16 LUFS.
Poster frame: `public/videos/entry-point-teaser-poster.jpg`.

## Voice-over script

| Time | Shot | Voice-over |
| --- | --- | --- |
| 0:00 | BSAid title screen | *Every transaction tells a story.* |
| 0:03 | BSAid title screen | *Will you make the right entry?* |
| 0:04 | "Introducing Entry Point" card → Case Files ("Real businesses") | *Welcome to Entry Point, where real businesses need your help with their books.* |
| 0:10 | Story intro with Nayeom ("Real stories") | *Meet the owners. Hear their stories.* |
| 0:14 | Quiz — picking and submitting the right entry ("Make the entry") | *Then decide what goes into the accounts.* |
| 0:18 | Wrong answer with the explanation ("Learn why") | *Get it wrong? You'll learn exactly why.* |
| 0:20 | "S · A · B — Unlock new levels" card → Stage Clear | *Clear each case, earn your rank, and unlock what's next.* |
| 0:23 | End card: "Entry Point — Play online · BSAid website" | *Entry Point. Play now, on the BSAid website.* |

## How it was made

- **Footage:** scripted browser recording of the real landing page and `/play/` game, with kinetic captions and
  title cards drawn as an overlay. Small on-screen sync markers (hidden in the final cut) make the audio frame-accurate.
- **Voice:** Kokoro neural text-to-speech (voice `af_heart`), generated offline.
- **Music & SFX:** rendered from the game's own Web Audio engine (`src/game/audio/engine.js`) at 92 BPM — the same
  click, chime, warning and unlock sounds players hear in the game. Music is ducked under the voice.
