# Wedding Website

A static wedding website for Bradley & Louise, hosted on Firebase Hosting. RSVP submissions are stored in Cloud Firestore, protected by Firebase App Check with reCAPTCHA Enterprise.

## Project Structure

```
├── index.html              Main (and only) HTML page
├── assets/
│   ├── style.css           All styles, organised by section
│   ├── fonts.css           Self-hosted web fonts (Bellefair, Cormorant Garamond)
│   ├── fonts/              WOFF2 font files (served from same origin for mobile browser compatibility)
│   ├── script.js           Firebase init, envelope animation, countdown, RSVP form, smooth scroll
│   ├── botanical-border.jpg   Hero background image
│   └── woodlands-park.png     Venue photo
├── firestore.rules         Firestore security rules (create-only on /rsvps)
├── firebase.json           Firebase Hosting + Firestore configuration
├── .firebaserc             Firebase project alias (bradley-louise-wedding)
├── export-rsvps.ps1        PowerShell script to export RSVPs to CSV
├── export-rsvps.js         Node.js export logic (called by export-rsvps.ps1)
├── package.json            Node dependencies for the RSVP export script
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

### Previewing locally

**Do not open `index.html` directly** (double-click or `file://` in the address bar). Browsers block self-hosted fonts and many scripts on `file://` due to CORS, which causes console errors and broken styling.

Always preview over HTTP:

```bash
firebase serve --only hosting
```

Then open **http://localhost:5000** in your browser.

If you do not have the Firebase CLI handy, any static server works, for example:

```bash
npx --yes serve .
```

### Local Development (App Check Debug Token)

> **Important:** App Check will block all Firestore writes unless you register a debug token for local development.

`self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;` is already set at the top of `assets/script.js` — it **must** appear before `firebase.initializeApp(...)` to work.

To get your debug token:

1. Run `firebase serve --only hosting` and open **http://localhost:5000** (not `file://`).
2. Open browser DevTools (F12) → **Console** tab
3. Look for the log line:
   ```
   App Check debug token: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```
4. Copy the token UUID
5. Go to [Firebase Console](https://console.firebase.google.com/) → **App Check** → your web app → **Manage debug tokens**
6. Click **Add debug token**, paste the UUID, give it a name (e.g. "local dev"), and save

Once registered, Firestore writes will work locally. The token is per-browser — clearing site data or switching browsers will generate a new one that needs registering again.

> **Before deploying to production**, remove or comment out the `self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;` line so real users go through reCAPTCHA verification.

## Downloading RSVPs

RSVP submissions can be exported from Firestore to a CSV file (one row per RSVP) using `export-rsvps.ps1`. The script uses the Firebase Admin SDK with a service account, because Firestore rules only allow **create** from the website — not read.

### Usage

1. **Get credentials** (one-time). Download a service account key from [Firebase Console](https://console.firebase.google.com/) → Project Settings → Service Accounts → Generate new private key.

2. **Set the key path** in PowerShell:

   ```powershell
   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account-key.json"
   ```

3. **Run the export**:

   ```powershell
   .\export-rsvps.ps1
   ```

   Or specify an output file:

   ```powershell
   .\export-rsvps.ps1 -OutputPath ".\rsvps.csv"
   ```

The first run installs dependencies automatically. Output defaults to `rsvps-export-YYYYMMDD-HHMMSS.csv` in the project root.

### CSV columns

One row per RSVP document in the `rsvps` collection:

- `documentId`
- `fullName`
- `attending` (`yes` / `no`)
- `starter`
- `main`
- `dessert`
- `dietary`
- `submittedAt` (ISO 8601)

Rows are sorted by submission time (newest first), then by name.

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
