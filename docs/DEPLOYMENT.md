# Deployment

## Firebase Hosting

### First-time setup

```bash
firebase login
firebase use istextbook-e8a3b
```

### Deploy everything

```bash
npm run firebase:deploy
```

This builds the app and deploys to Firebase Hosting.

### Deploy rules only

```bash
npm run firebase:rules
```

### Deploy hosting only

```bash
npm run build
firebase deploy --only hosting
```

## Environment Variables

Production builds read from `.env` at build time (Vite embeds `VITE_*` variables).

For CI/CD, set these as GitHub Actions secrets or environment variables.

## Custom Domain

1. Firebase Console → Hosting → Add custom domain
2. Follow DNS verification steps
3. SSL is provisioned automatically

## Firestore Indexes

If queries fail with "index required", either:

1. Click the link in the error message to create the index in Firebase Console
2. Or deploy indexes: `firebase deploy --only firestore:indexes`

## Post-Deploy Checklist

- [ ] Home page loads
- [ ] Authentication works (sign in, guest)
- [ ] Book list shows published books
- [ ] Chapter reader renders content blocks
- [ ] PWA installs on mobile
- [ ] Dark mode toggles correctly
