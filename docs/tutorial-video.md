# Entry Point — Tutorial Video

A 2:39 captioned walkthrough of the Entry Point web game (`/play/`), shown when you click **TUTORIAL** on the landing page.

| File | Format | Size |
| --- | --- | --- |
| `public/videos/entry-point-tutorial.mp4` | H.264 MP4, 1280×720, 25 fps, no audio | 8.4 MB |
| `public/videos/entry-point-tutorial.webm` | VP9 WebM, 1280×720 (smaller, used first when supported) | 5.6 MB |
| `public/videos/entry-point-tutorial-poster.jpg` | Poster frame (title card) | 68 KB |

Live URLs once deployed: `/videos/entry-point-tutorial.mp4` and `/videos/entry-point-tutorial.webm`.

## Chapters & captions

| Time | Step | On-screen caption |
| --- | --- | --- |
| 0:00 | Title card | **How to Play** — Solve accounting case files for real businesses — one mini-game at a time. |
| 0:04 | Step 1 · Case Files | Six businesses, six different mini-games — and every case is open from the start. |
| 0:08 | Step 1 · Case Files | The bar up top tracks finished cases and the coins you earn. |
| 0:12 | Step 2 · Choose a Level | Each case has four levels. Every level is harder: fewer hearts, less time, tougher questions. |
| 0:21 | Step 3 · Meet the Owner | Each level opens with a short story. Read on, or skip straight to the game. |
| 0:29 | Step 3 · How to Play | The rules card explains the mini-game. Press Start when you are ready. |
| 0:38 | Step 4 · Hearts & Timer | Answer before time runs out. A wrong answer costs a heart — lose them all and it's Game Over. |
| 0:43 | Step 4 · Need a Hint? | Tap Hint when you are stuck. It halves that round's points. |
| 0:47 | Step 4 · Learn from Mistakes | Wrong? You see the solution and every step of the computation. |
| 0:58 | Step 4 · Combos | Chain correct answers for a combo — it multiplies your points! |
| 1:12 | Step 4 · Keep Going | Clear every round to finish the level. |
| 1:33 | Step 5 · Stage Clear | Fewer mistakes = more stars and a higher rank. Your score becomes coins. |
| 1:37 | Step 5 · Rewards | Badges, goals and the next, harder level unlock as you play. |
| 1:45 | Step 6 · Achievements | Open the trophy tab for three new daily goals every day. |
| 1:48 | Step 6 · Claim Rewards | Claim finished goals and milestone medals for bonus coins. |
| 1:52 | Step 6 · Career Rank | Collect stars to climb from Accounting Intern all the way to CPA. |
| 1:56 | Step 7 · Calculator | Need to compute? Every mini-game has a built-in calculator. |
| 2:24 | Step 7 · Use Answer | "Use answer" drops the result straight into your entry. |
| 2:34 | End card | **Press Start!** — Open PLAY ONLINE on the BSAid website and crack your first case file. |

Timestamps are approximate (±2 s).

## Re-recording

The video is a scripted browser recording of the real game (Playwright `recordVideo`), with the cursor,
captions and title cards drawn as an overlay during recording. Re-record after major UI changes so the
tutorial stays accurate, then re-encode:

```bash
ffmpeg -i tutorial.webm -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart -an public/videos/entry-point-tutorial.mp4
ffmpeg -i tutorial.webm -c:v libvpx-vp9 -b:v 0 -crf 40 -row-mt 1 -an public/videos/entry-point-tutorial.webm
```
