# Live Requests (working name)

A song request page for live performers. Fans scan a QR code, pick a song and send it to the stage. The performer runs the queue from their phone.

| Page | Address | Who uses it |
| --- | --- | --- |
| Stage view | `/` | The performer, signed in with Google |
| Fan page | `/qr` | Fans, from the QR code |
| Song list | `/request` | Fans, from the fan page |

## One-time setup

### 1. Create the Firebase project
1. Go to [console.firebase.google.com](https://console.firebase.google.com) and choose **Create a project**. Analytics isn't needed.
2. **Build → Realtime Database → Create database.** Pick the US location and start in **locked mode**. The rules in this repo replace those defaults on deploy.
3. **Build → Authentication → Get started.** Turn on two sign-in providers:
   - **Google**, for the performer.
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
1. Open `https://<project-id>.web.app` on your phone and sign in with Google. The starter song list loads on first sign-in.
2. Open **Your fan page** at the bottom, then fill in your act name, tonight's venue and your tip link (Venmo, Cash App or PayPal).
3. Make a QR code that points to `https://<project-id>.web.app/qr`.

## How access works
- Anyone signed in with Google can run the stage view. Fine for testing between a few people. Not ready for public sign-ups, because everyone shares one song list and one queue.
- Fans are signed in anonymously in the background. They can add requests but can't change songs, settings or history.
- The rules live in `database.rules.json` and deploy with `firebase deploy`.

## Files
- `index.html`: stage view (queue, crowd favorites, song list, history, fan page settings)
- `request/index.html`: fan song list and request form
- `qr/index.html`: fan landing page with request and tip buttons
- `firebase-config.js`: Firebase keys, app name and the starter song catalog
- `database.rules.json`: who can read and write what
- `firebase.json`: hosting settings
