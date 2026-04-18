# Wedding Website

A static wedding website for Bradley & Louise, hosted on Firebase Hosting. RSVP submissions are stored in Cloud Firestore, protected by Firebase App Check with reCAPTCHA Enterprise.

## Project Structure

```
├── index.html              Main (and only) HTML page
├── assets/
│   ├── style.css           All styles, organised by section
│   ├── script.js           Firebase init, envelope animation, countdown, RSVP form, smooth scroll
│   ├── botanical-border.jpg   Hero background image
│   └── woodlands-park.png     Venue photo
├── firestore.rules         Firestore security rules (create-only on /rsvps)
├── firebase.json           Firebase Hosting + Firestore configuration
├── .firebaserc             Firebase project alias (bradley-louise-wedding)
└── .gitignore              Git ignore rules
```

## Firebase Services Used

- **Hosting** — serves the static site
- **Cloud Firestore** — stores RSVP submissions in the `rsvps` collection
- **App Check (reCAPTCHA Enterprise)** — verifies requests come from the real website, not bots

## Initial Setup

### Prerequisites

Install the Firebase CLI globally:

```bash
npm install -g firebase-tools
```

### Firebase Console Setup

These steps are required before the RSVP form will work:

1. **Enable Firestore** — Firebase console > Build > Firestore Database > Create database (production mode)
2. **Enable reCAPTCHA Enterprise API** — Google Cloud Console > APIs & Services > Enable the reCAPTCHA Enterprise API
3. **Create a reCAPTCHA Enterprise key** — Google Cloud Console > reCAPTCHA Enterprise > Create Key. Use type "Score-based (no challenge)" and add your hosting domains (e.g. `bradley-louise-wedding.web.app`)
4. **Register App Check** — Firebase console > App Check > Register your web app with the reCAPTCHA Enterprise provider using the public site key from step 3
5. **Enforce App Check** — In App Check settings, click "Enforce" for Cloud Firestore
6. **Deploy Firestore rules** — Run `firebase deploy --only firestore:rules`

### Local Development

To test locally, add the following line in `assets/script.js` before the `firebase.appCheck().activate(...)` call:

```javascript
self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
```

The first time you load the site locally, the browser console will print a debug token. Register this token in Firebase console > App Check > Manage debug tokens. Remove the debug line before deploying to production.

## Firebase Commands

### `firebase login`

Authenticates your local machine with your Firebase/Google account. Opens a browser window to complete sign-in. You only need to do this once per machine.

```bash
firebase login
```

### `firebase serve --only hosting`

Serves the site locally at `http://localhost:5000` for previewing. Firestore writes go to production.

```bash
firebase serve --only hosting
```

### `firebase emulators:start`

Runs a local development server with a Firestore emulator so no data touches production. Serves the site at `http://localhost:5000` with Firestore emulated on `http://localhost:8080`.

```bash
firebase emulators:start
```

### `firebase deploy`

Deploys the site, Firestore rules, and all other configured services to production.

```bash
firebase deploy
```

To deploy specific services only:

```bash
firebase deploy --only hosting
firebase deploy --only firestore:rules
```

### `firebase hosting:channel:deploy <channel-name>`

Creates a temporary preview URL for testing without affecting the live site. Useful for sharing a draft with someone before going live.

```bash
firebase hosting:channel:deploy preview
```

### `firebase open hosting:site`

Opens the live production URL in your browser.

```bash
firebase open hosting:site
```
