# Live Requests: guide for Claude

Live Requests (working name) is a song request and tip app for live musicians and DJs. Fans open a link or scan a QR code, request a song, and tip. The performer runs the queue from their phone.

- **Kyle** builds the product and decides how it works. He's a working guitarist in Wilmington, NC, so live-show details matter.
- **Rob** is Kyle's partner. He leads monetization and business: pricing, venues, marketing.

## Start every session here

1. Read `docs/ROADMAP.md` (what's done, what's next) and `docs/DECISIONS.md` (what's been decided and why).
2. Don't act against a decision marked **Decided**. If a task seems to conflict with one, say so and ask.
3. When you finish a roadmap item, or Kyle settles something, update both files in the same commit as the work.

Planning also happens in the claude.ai Project "Live Requests", which holds a matching brief, `claude/live-requests-brief.md`. If this session has the Projects tool, update that brief whenever `ROADMAP.md` or `DECISIONS.md` changes. If it doesn't, end your reply by reminding Kyle that the Project brief needs the same update. **This repo is the source of truth.** If the two disagree, the repo wins.

## The two repos

| Repo | What it is | Hosting |
| --- | --- | --- |
| `kyle38120/live-requests` (this one, private) | The real app on Firebase | Not deployed yet. Firebase Hosting config is ready (`firebase deploy`) |
| `kyle38120/live-requests-demo` (public) | A click-through demo with sample data and a fake in-browser Firebase, act "The Doorknobs" at "Waterline Brewing" | Cloudflare Workers static assets at https://live-requests-demo.oddnc.com, redeploys automatically on every push to `main` |

The demo pages were generated from this repo's pages by a one-off script that wasn't saved. Until the multi-artist app can host a demo act of its own, change the demo by editing its HTML directly, and keep its look in step with this repo. The plan is to retire the separate demo once that's possible (see the roadmap).

## How the app is built

- **Plain static pages, no build step:** `index.html` (stage view, for the performer, at `/`), `qr/index.html` (fan landing page, at `/[act-link]`), `request/index.html` (fan song list, at `/[act-link]/songs`). Each page holds its own CSS and JS.
- **One Firebase project holds every act.** Each act's data lives under `artists/{artistId}`. The act's link (its "slug", e.g. `the-doorknobs`) is separate from its ID, so renaming never moves data.
- **Artist links:** `firebase.json` rewrites `/*` to `qr/index.html` and `/*/songs` to `request/index.html`. A local server can't rewrite, so the fan pages also accept `/qr/?a=the-doorknobs` and `/request/?a=the-doorknobs`. `artist-link.js` (shared by all three pages) holds the slug rules, the reserved words, the link builders and `ArtistLink.resolve()`. Its slug rules must match `database.rules.json`.
- **Firebase compat SDK 10.12.0** from gstatic: Realtime Database plus Auth (Google or an emailed sign-in link for performers, Anonymous for fans).
- **`firebase-config.js`** holds the Firebase keys (still `PASTE_` placeholders), `APP_NAME`, `isFirebaseConfigured()` and `STARTER_SONGS` (71 songs tagged by decade and genre). A new act starts with all 71, active.
- **`database.rules.json`:** the security rules, summarized under "Who can do what" below. `tests/rules.test.mjs` covers them (see Testing).

Data:
```
artists/{artistId}/                   artistId is a push key and never changes
  members/{uid}: "owner"              who runs this act (a map, so bandmates can be added later)
  settings  { actName, slug, venue, tipLink, requestMode: "list", createdAt }
  songs/{songId}  { id, title, artist, era, genre, active }    keyed by the song's id
  requests/queue/{pushId}   { songId, title, artist, ts, fan, dismissed? }   fan = the fan's anonymous uid
  requests/played/{pushId}  { songId, title, artist, ts }      one entry per play
  requestNames/{pushId}: "Sarah"      fan names, readable only by the act
  fanLast/{uid}: ts                   the 30-second speed bump
  requestHistory/{sessions, requests, plays}   saved by "End the night"
slugs/{slug}: artistId                a link points at one act; old links keep pointing after a rename
users/{uid}/artists/{artistId}: true  which act(s) an account runs
```

Who can do what (all enforced in `database.rules.json`):
- **Anyone** can read one slug at a time, and an act's settings, songs, queue and played list. Nobody can list all acts or all slugs.
- **An act's members** (signed in with Google or email, never anonymous) can write their own act's settings, songs, requests, names and history. Nothing else.
- **Creating an act** is one atomic write: the member entry, settings, starter songs, the slug claim and the `users` entry. You can only make yourself owner of an act that doesn't exist yet, and only claim a free slug.
- **Fans** (anonymous) can only *create* a request, in one write with their optional name and a `fanLast` stamp. The song must exist and be active, its title and artist must match the song list, `fan` must be their own uid, `ts` must be server time, and their last request must be at least 30 seconds old.
- **Room for DJ open requests later:** `settings.requestMode` is `"list"` for now. Open requests will be a queue entry without `songId`, allowed only when `requestMode` is `"open"` or `"both"`. That's one new branch in the fan request rule; the data shape doesn't change.

### Code rules
- Escape every piece of user text before it goes into `innerHTML`, using `esc()`.
- Song IDs are permanent: a new song gets `max id + 1`, and existing songs are never renumbered. Songs are stored by ID (`songs/12`), never as an array.
- In the stage view, reach the act's data through `A('path')`, never `db.ref()` on a top-level path.
- A rule change needs a test in `tests/rules.test.mjs`, for both the allowed and the refused case.
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

**Security rules:** `npm install` once, then `npm run test:rules`. It starts the Realtime Database emulator (needs Java), runs `tests/rules.test.mjs` and stops it. Run it after any change to `database.rules.json`.

There are no automated page tests yet (Playwright smoke tests are on the roadmap). Until then, before you push:
- Serve the folder (`python3 -m http.server`) and click through all three pages at 390px wide.
- With the Firebase config unfilled, the pages run in preview mode. For real data, point `firebase-config.js` at a test Firebase project and never commit those keys. On a local server, open the fan pages as `/qr/?a=your-link` and `/request/?a=your-link`.
- Watch the console for errors.

## Commits

Write short, plain commit messages that say what changed, for example "Collapse the song list header into a compact bar on scroll". Cloud sessions push a branch; Kyle merges by pull request.

Never commit secrets: Stripe secret keys, service account files, or `.env` files. Stripe secret keys will live only in server-side environment settings.
