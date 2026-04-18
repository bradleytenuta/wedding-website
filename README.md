# Wedding Website

A static wedding website for Bradley & Louise, hosted on Firebase Hosting.

## Project Structure

```
├── index.html              Main (and only) HTML page
├── assets/
│   ├── style.css           All styles, organised by section
│   ├── script.js           Envelope animation, countdown timer, smooth scroll
│   ├── botanical-border.jpg   Hero background image
│   └── woodlands-park.png     Venue photo
├── firebase.json           Firebase Hosting configuration
├── .firebaserc             Firebase project alias (bradley-louise-wedding)
└── .gitignore              Git ignore rules
```

## Firebase Commands

You need the Firebase CLI installed globally. If you don't have it:

```bash
npm install -g firebase-tools
```

### `firebase login`

Authenticates your local machine with your Firebase/Google account. Opens a browser window to complete sign-in. You only need to do this once per machine.

```bash
firebase login
```

### `firebase emulators:start`

Runs a local development server so you can preview the site before deploying. Serves the site at `http://localhost:5000` by default.

```bash
firebase emulators:start
```

### `firebase deploy`

Deploys the site to Firebase Hosting, making it live at your production URL. Uploads all files from the project root (except those listed in `firebase.json` → `ignore`).

```bash
firebase deploy
```

To deploy only hosting (skipping other Firebase services if configured):

```bash
firebase deploy --only hosting
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
