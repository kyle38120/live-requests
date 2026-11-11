# Roadmap

Last updated: 2026-11-11

Live Requests is a requests-only test build. A demo of it is live at https://live-requests-demo.oddnc.com. **The next step is artist accounts, so any act can sign up and set itself up in under five minutes.**

## Done

| When | What |
| --- | --- |
| Oct 2026 | Cut Duo Ops down to requests only, removed Jaden's branding and the email whitelist, added a neutral new look |
| Oct 2026 | Fan flow: QR landing page, searchable song list with genre and decade filters, request with optional name, tip link offered after sending |
| Oct 2026 | Performer flow: live queue grouped by song, Played/Skip, crowd favorites, played tonight with undo, End the night saved to history, insights, song list editing, fan page settings |
| Oct 26 | Apple-style redesign: system font, true black, liquid glass |
| Oct 26 | Demo moved to Cloudflare at live-requests-demo.oddnc.com; demo act renamed "The Doorknobs" |
| Oct 26 | Big headers collapse into a compact bar on scroll (stage view and song list) |

## Now: artist accounts and setup

1. **Multi-artist foundation.** Store each artist's settings, songs, requests and history under their own artist record. Each artist gets their own link (`/[act-name]`), and security rules let artists edit only their own data. Sign-in with Google or an emailed sign-in link.
2. **Setup flow, under five minutes, and everything after the act name can be skipped.** Sign in, choose an act name (which claims the link, checked live), pick songs from the starter list or paste a list, add a Venmo or Cash App handle, then see "You're live" with the link, the QR code and the stage view.
3. **Share kit.** Downloadable QR code, printable table tent, and the short link.
4. **Settings to edit later.** Act name, tip link, songs.
5. **Testing.** Kyle sets up a brand-new act alone, then 2 or 3 artist friends try it while someone watches and times them. Fix every spot where they hesitate.
6. **Move the demo onto the real app** as a demo act, then retire the separate demo repo.
7. **Add Playwright smoke tests to the repo.**

Open question for this phase: **DJs.** Do we support "open requests" (fans type any song) in the first round? See DECISIONS.md.

## Next

- **Card and Apple Pay tips through Stripe Connect.** The artist turns this on later, after setup. Tip links keep working.
- **Venue pilot with 1 or 2 Wilmington venues.** A "Tonight at [venue]" page, the venue's acts using the app, and a monthly report for the venue.

## Later

- **Paid requests.** Put a hold on the fan's card when they request, and charge it only when the artist taps Played. Get a lawyer to check the Live Music Network patent application (US20230297898) before building any paid queue-jump.
- **More ways to request without a QR code:** a spoken short link, NFC tap tags, and search by act or venue.
- **Gig discovery map and "playing near you".** Needs a critical mass of artists in one town. Save every gig with requests open (artist, venue, date) from day one so the map has data.
- **Native app** for artists and regular fans, with push notifications for followed artists. Possibly an App Clip. Patrons always keep a no-download web path.
- **Marketing to artists through music shops.**

## Waiting on someone

| Item | Who |
| --- | --- |
| Fee percentage and who pays (fan or artist) | Kyle and Rob |
| App name and domain. Artist links depend on it | Kyle and Rob |
| Venue pilot conversations | Rob |
| Lawyer or accountant review of fees, terms and the patent question | Rob |
| Ownership split and business entity (LLC), in writing | Kyle and Rob |
| Whether to apply to PayPal's platform program (the only way to take a fee on Venmo payments) | Rob |
