# Entry Point — Tutorial Video

A 1:55 captioned walkthrough of the Entry Point web game (`/play/`), shown when you click **TUTORIAL** on the landing page.

| File | Format | Size |
| --- | --- | --- |
| `public/videos/entry-point-tutorial.mp4` | H.264 MP4, 1280×720, 25 fps, no audio | 6.5 MB |
| `public/videos/entry-point-tutorial.webm` | VP9 WebM, 1280×720 (smaller, used first when supported) | 4.3 MB |
| `public/videos/entry-point-tutorial-poster.jpg` | Poster frame (title card) | 70 KB |

Live URLs once deployed: `/videos/entry-point-tutorial.mp4` and `/videos/entry-point-tutorial.webm`.

## Chapters & captions

| Time | Step | On-screen caption |
| --- | --- | --- |
| 0:00 | Title card | **How to Play** — Solve accounting case files for real businesses, one journal entry at a time. |
| 0:04 | Step 1 · Case Files | Every business is a case file. The badges up top track your progress. |
| 0:08 | Step 1 · Case Files | Filter by status or search for a business. Locked cases open in future updates. |
| 0:17 | Step 2 · Pick a Case | Open a case to see its story and its four levels. Let's start with Nayeom's Groceria. |
| 0:21 | Step 2 · Choose a Level | Levels unlock one at a time. Clear Level 1 to open Level 2. |
| 0:25 | Step 3 · Meet the Owner | Each level opens with a short story. Click Next to keep reading. |
| 0:34 | Step 4 · Read the Case | Check the business event and the challenge, then read the question. |
| 0:39 | Step 4 · Need a Hint? | Tap the yellow hint button whenever you are stuck. |
| 0:43 | Step 4 · Answer | Pick an answer, then press Submit. |
| 0:46 | Step 4 · Learn from Mistakes | Wrong? You see the correct answer and the reason why — mistakes are part of the lesson. |
| 0:52 | Step 4 · Earn Points | Correct answers turn green and add to your score. |
| 0:58 | Step 4 · Keep Going | Clear every question to finish the level. |
| 1:36 | Step 5 · Stage Clear | Fewer mistakes = higher rank. S rank is a perfect run worth 100 points. |
| 1:40 | Step 5 · Unlocked | Clearing a level unlocks the next one in the case. |
| 1:50 | End card | **Press Start!** — Open PLAY ONLINE on the BSAid website and crack your first case file. |

## Re-recording

The video is a scripted browser recording of the real game (Playwright `recordVideo`), with the cursor,
captions and title cards drawn as an overlay during recording. Re-record after major UI changes so the
tutorial stays accurate, then re-encode:

```bash
ffmpeg -i tutorial.webm -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart -an public/videos/entry-point-tutorial.mp4
ffmpeg -i tutorial.webm -c:v libvpx-vp9 -b:v 0 -crf 40 -row-mt 1 -an public/videos/entry-point-tutorial.webm
```
