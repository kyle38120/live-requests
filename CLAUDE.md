# Live Requests: guide for Claude

Live Requests (working name) is a song request and tip app for live musicians and DJs. Fans open a link or scan a QR code, request a song, and tip. The performer runs the queue from their phone.

- **Kyle** builds the product and decides how it works. He's a working guitarist in Wilmington, NC, so live-show details matter.
- **Rob** is Kyle's partner. He leads monetization and business: pricing, venues, marketing.

## Start every session here

1. Read `docs/ROADMAP.md` (what's done, what's next) and `docs/DECISIONS.md` (what's been decided and why).
2. Don't act against a decision marked **Decided**. If a task seems to conflict with one, say so and ask.
3. When you finish a roadmap item, or Kyle settles something, update both files in the same commit as the work.

Planning also happens in a claude.ai Project (currently named "Duo Ops"), which holds a matching brief, `live-requests-brief.md`. If this session has the Projects tool, update that brief whenever `ROADMAP.md` or `DECISIONS.md` changes. If it doesn't, end your reply by reminding Kyle that the Project brief needs the same update. **This repo is the source of truth.** If the two disagree, the repo wins.

## The two repos

| Repo | What it is | Hosting |
| --- | --- | --- |
| `kyle38120/live-requests` (this one, private) | The real app on Firebase | Not deployed yet. Firebase Hosting config is ready (`firebase deploy`) |
| `kyle38120/live-requests-demo` (public) | A click-through demo with sample data and a fake in-browser Firebase, act "The Doorknobs" at "Waterline Brewing" | Cloudflare Workers static assets at https://live-requests-demo.oddnc.com, redeploys automatically on every push to `main` |

The demo pages were generated from this repo's pages by a one-off script that wasn't saved. Until the multi-artist app can host a demo act of its own, change the demo by editing its HTML directly, and keep its look in step with this repo. The plan is to retire the separate demo once that's possible (see the roadmap).

## How the app is built

- **Plain static pages, no build step:** `index.html` (stage view, for the performer), `request/index.html` (fan song list), `qr/index.html` (fan landing page). Each page holds its own CSS and JS.
- **Firebase compat SDK 10.12.0** from gstatic: Realtime Database plus Auth (Google for performers, Anonymous for fans).
- **`firebase-config.js`** holds the Firebase keys (still `PASTE_` placeholders), `APP_NAME`, `isFirebaseConfigured()` and `STARTER_SONGS` (71 songs tagged by decade and genre).
- **`database.rules.json`:** anyone can read settings and songs. Only signed-in, non-anonymous users can write. Anonymous fans can only *create* a request under `requests/queue`, and the rules validate it: songId, title, artist, ts, and an optional name of 40 characters or fewer.

Current data (one act per Firebase project; this is the next thing to change):
```
settings       { actName, venue, tipLink }
songs[]        { id, title, artist, era, genre, active }
requests/queue/{pushId}   { songId, title, artist, name?, ts }
requests/played/{pushId}  { songId, title, artist, ts }
requestHistory/sessions/... saved when the performer taps "End the night"
```

### Code rules
- Escape every piece of user text before it goes into `innerHTML`, using `esc()`.
- Song IDs are permanent: a new song gets `max id + 1`, and existing songs are never renumbered.
- Don't use `alert()`, `confirm()` or `prompt()` for new UI. Use the app's own sheets and toasts.
- Design for phone width first (390px), then check desktop.
- Respect `prefers-reduced-motion`, and keep the solid-panel fallback for browsers without `backdrop-filter`.

## Design system (Apple-like, decided Oct 2026)

- **Font:** the system stack `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", ...`. Inter loads from Google Fonts only as a fallback for devices without SF Pro. Large titles are 34px bold, body 17px, secondary 15px, footnote 13px.
- **True black:** `--bg:#000`. Text colors follow Apple's dark mode: `--label` white, `--label2` 62% and `--label3` 32% grey-white.
- **Colors:** `--accent:#FF375F` (pink) for main actions, `--warm:#FFC98B` for the "up next" spotlight, `--green:#30D158` for live and success, `--red:#FF453A` for removing things.
- **Liquid glass:** panels use `--glass`, `--glass-blur` and `--glass-shadow`, plus a highlighted edge (`::after` with `--rim`). A faint warm, pink and violet stage glow sits behind everything, because glass needs color behind it to read as glass.
- **Shapes:** buttons and chips are capsules (`border-radius:999px`). Main actions are pink, secondary ones are grey glass, and a selected chip is solid white with black text.
- **Collapsing headers:** on the stage view and song list, the big title scrolls away and a slim glass bar slides in (`.mini`, shown by an IntersectionObserver). Use the same pattern on any new long page.
- **Words:** sentence case, plain verbs, buttons named for what they do ("Send request", "End the night"). No all-caps labels.

## Testing

There are no automated tests in the repo yet (adding Playwright smoke tests is on the roadmap). Until then, before you push:
- Serve the folder (`python3 -m http.server`) and click through all three pages at 390px wide.
- With the Firebase config unfilled, the pages run in preview mode. For real data, point `firebase-config.js` at a test Firebase project and never commit those keys.
- Watch the console for errors.

## Commits

Write short, plain commit messages that say what changed, for example "Collapse the song list header into a compact bar on scroll". Commit straight to `main` while Kyle is the only developer, unless he asks for a branch.

Never commit secrets: Stripe secret keys, service account files, or `.env` files. Stripe secret keys will live only in server-side environment settings.
