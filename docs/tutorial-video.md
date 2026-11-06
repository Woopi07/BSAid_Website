# Entry Point — Tutorial Video

A 1-minute (64 s) trailer-style tutorial of the Entry Point web game with voice-over and music, shown when you click
**TUTORIAL** on the landing page. Its style follows the team's reference trailer: dark pill captions at the bottom, a topic tag in
the top-right corner, and an end card with the BSAid logo, the case names and a "Play now on Entry Point" button.

| File | Format |
| --- | --- |
| `public/videos/entry-point-tutorial.mp4` | H.264 + AAC, 1280×720, 25 fps |
| `public/videos/entry-point-tutorial.webm` | VP9 + Opus (smaller, used first when supported) |
| `public/videos/entry-point-tutorial-poster.jpg` | Poster frame (BSAid title screen) |

## Script

| Time | Scene | Voice-over / caption |
| --- | --- | --- |
| 0:00.4 | Opening | Every transaction tells a story. |
| 0:03.5 | Title | Will you make the right entry? |
| 0:05.9 | Case Files | Open a case file, and step inside a real business. |
| 0:09.6 | Case Files | Seven businesses, each one harder than the last. Plus special detective cases. |
| 0:15.4 | Level Select | Pick a level. Four per case, from Rookie to Boss Round. |
| 0:20.0 | Question | Aling Rosa paid cash for her groceries. Which entry is right? |
| 0:24.3 | Quick Recall | Not sure? Quick Recall shows the key rule, for free. |
| 0:28.0 | Streaks | Answer before the timer runs out, and build your streak. |
| 0:34.8 | Stage Complete | Zero mistakes? That's an S rank. |
| 0:39.3 | Calculator | Got a computation? The calculator drops the answer right in. |
| 0:44.5 | Solutions | Miss one, and you'll see exactly why, step by step. |
| 0:49.0 | Rewards | Earn badges, daily goals, and a certificate with your name on it. |
| 0:54.0 | Special Cases | Then join Detective Alex, and crack the special cases. |
| 0:58.7 | End card | BSAid. Play now on Entry Point. |

## How it was made

1. A scripted Playwright recording of the real site (`/` then `/play/`) draws the cursor, captions, corner tags and end card as
   an overlay. Each caption flashes a small marker so the voice-over can be placed on exact frames.
2. Voice lines are generated with Kokoro TTS (voice `af_heart`).
3. Moments with voice play at normal speed; navigation in between is fast-forwarded (up to 6×) to land at about one minute.
4. The music bed is rendered offline from the game's own audio engine and ducked under the voice.

Re-record after major UI changes so the tutorial stays accurate.
