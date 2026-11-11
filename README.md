# Live Requests (working name)

A song request page for live performers. Fans scan a QR code, pick a song and send it to the stage. The performer runs the queue from their phone. Any number of acts can share one deployment, each with its own link.

| Page | Address | Who uses it |
| --- | --- | --- |
| Stage view | `/` | The performer, signed in with Google or an emailed link |
| Setup | `/setup` | A performer setting up a new act, right after first sign-in |
| Fan page | `/the-doorknobs` (the act's link) | Fans, from the QR code |
| Song list | `/the-doorknobs/songs` | Fans, from the fan page |

On a local server, which can't rewrite addresses, the fan pages also work as `/qr/?a=the-doorknobs` and `/request/?a=the-doorknobs`.

## One-time setup

### 1. Create the Firebase project
1. Go to [console.firebase.google.com](https://console.firebase.google.com) and choose **Create a project**. Analytics isn't needed.
2. **Build → Realtime Database → Create database.** Pick the US location and start in **locked mode**. The rules in this repo replace those defaults on deploy.
3. **Build → Authentication → Get started.** Turn on three sign-in providers:
   - **Google**, for performers.
   - **Email/Password**, with **Email link (passwordless sign-in)** turned on, for performers who'd rather not use Google. Leave plain password sign-in off.
   - **Anonymous**, so fans can send requests without an account.
4. **Project settings → General → Your apps → Web (`</>`).** Register an app with any nickname, skip Firebase Hosting setup there, and copy the `firebaseConfig` values.
5. Paste those values into `firebase-config.js`, replacing every `PASTE_...` placeholder.

### 2. Deploy
You need Node.js installed. Then, in this folder:

```
npm install -g firebase-tools
firebase login
firebase use --add            # pick the project you just created
firebase deploy
```

Your app is now live at `https://<project-id>.web.app`. Firebase adds that address to Authentication's authorized domains automatically.

To redeploy after changes, run `firebase deploy` again. To deploy automatically on every push to GitHub, run `firebase init hosting:github` once.

### 3. First run
1. Open `https://<project-id>.web.app` on your phone and sign in with Google or an emailed link.
2. The setup flow opens. Name your act: your link is suggested from the name (`the-doorknobs`) and checked live. Tap **Create my page**.
3. Pick your songs from the 71-song starter list (filter by genre or decade, or tap **Select all 71**), or paste your own list, one `Title - Artist` per line. Or skip and add them later.
4. Add a tip link by typing your Venmo username or Cash App $cashtag, or paste any other link. Optional.
5. **You're live** shows your link and a QR code you can download. Tap **Open the stage view** to run the night.

Anything you skipped can be finished later from the stage view: the **Add songs** card, **Song list**, and **Your fan page** (tip link and QR code). Tonight's venue is set in **Your fan page** too.

## How access works
- Anyone can sign up and create an act. Each act can edit only its own settings, songs, queue and history.
- Fans are signed in anonymously in the background. They can send requests (one every 30 seconds) but can't change songs, settings or history, and can't see other fans' names.
- The rules live in `database.rules.json` and deploy with `firebase deploy`. To test them: `npm install` once, then `npm run test:rules` (starts the Realtime Database emulator, which needs Java).

## Files
- `index.html`: stage view (sign-in, queue, crowd favorites, song list, history, fan page settings)
- `setup/index.html`: setup flow for a new act (name and link, songs, tip link, link and QR code)
- `request/index.html`: fan song list and request form
- `qr/index.html`: fan landing page with request and tip buttons
- `firebase-config.js`: Firebase keys, app name and the starter song catalog
- `artist-link.js`: act links (slug rules, reserved words, looking up an act by its link)
- `vendor/qrcode-generator.js`: QR code drawing (qrcode-generator 1.4.4, MIT), used by the setup page
- `database.rules.json`: who can read and write what
- `tests/rules.test.mjs`: security rules tests, run with `npm run test:rules`
- `firebase.json`: hosting settings, including the rewrites that make act links work
- `package.json`: dev tools only (the rules tests). The app has no build step

## For Claude and contributors

See `CLAUDE.md` for how the app is built and the design rules, `docs/ROADMAP.md` for what is next, and `docs/DECISIONS.md` for what has been decided.
