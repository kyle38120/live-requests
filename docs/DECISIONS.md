# Decisions

A dated log of what's been settled, newest first. **Decided** means build on it. **Leaning** means it's the working plan but not final. **Open** means it's still being discussed.

When something changes, add a new entry instead of rewriting an old one, and change the old entry's status to "Replaced by [date]".

| Date | Status | Decision | Why |
| --- | --- | --- | --- |
| 2026-11-11 | Decided | Next build: artist accounts and a setup flow that takes under five minutes | Nobody but us can use the app until it supports many artists. Fast setup is the whole pitch |
| 2026-11-11 | Leaning | Patrons always use the web, with no download. A native app comes later, for artists and regular fans | Making a casual patron download an app to request one song would lose most of them. Kyle's position; Rob first wanted app-only. Confirm with Rob |
| 2026-11-11 | Open | DJ support in the first round: "open requests" where fans type any song | DJ catalogs are effectively unlimited, so a fixed song list doesn't work for them |
| 2026-11-11 | Open | Paid requests and queue-jumping | Revenue like TouchTunes, but the Live Music Network patent application (US20230297898) needs a lawyer's check first |
| 2026-11-11 | Leaning | Rob's direction: TouchTunes as the model, venues as the way to reach artists, a gig discovery map later, music-shop marketing, and don't depend on QR codes alone | Shapes the order of the roadmap. Venues first as a pilot. The map waits until there are enough artists |
| 2026-11-04 | Leaning | Card tips run on Stripe Connect. Payments go straight into the artist's own Stripe account, our fee is split off automatically, and we never hold the money | Fans pay without leaving the app (Apple Pay, card, Cash App Pay), and it avoids money-transmitter licensing. Artists turn it on after setup, so it doesn't slow signup down |
| 2026-11-04 | Leaning | The fan covers Stripe's fee and ours, so the artist keeps 100% of the tip. Example: a $10 tip at a 5% fee costs the fan about $11.13 | "Keep 100% of your tips" is the easiest pitch to artists. If artists paid, they'd lose about 11% and go back to a free Venmo QR code |
| 2026-11-04 | Open | Fee level: 5%, 7% or 10% per card tip, or a paid tier with no fee from us | Sing Us A Song charges 10%. Stripe's cut (about 2.9% + 30¢) applies either way |
| 2026-11-04 | Open | PayPal platform program, for fees on Venmo payments | It's the only way to take a fee on Venmo payments, and it needs PayPal's approval |
| Oct 2026 | Open | App name. "Live Requests" is a placeholder; NextSong was floated | Needed before buying a domain and giving testers links |
| 2026-10-26 | Decided | Apple-style look: system font, true black, liquid glass, collapsing headers | Kyle's direction. Details are in CLAUDE.md |
| 2026-10-26 | Decided | Demo hosted on Cloudflare at live-requests-demo.oddnc.com, demo act "The Doorknobs" | Free, and a test link separate from Jaden's site. Move to the app's own domain and account at launch |
| Oct 2026 | Decided | Requests only. Shows, tasks, income, checklists and the calendar are cut | Focus on what other musicians would actually use |
| Oct 2026 | Decided | Jaden's branding and the email whitelist are removed | The app is for any act now |
| Oct 2026 | Open | Tip amounts. Recommendation: buttons start at $5. Also open: whether tipping goes inside the request sheet | Stripe's flat 30¢ eats too much of $1 to $3 tips |
