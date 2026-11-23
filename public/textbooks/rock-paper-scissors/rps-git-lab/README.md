# Rock · Paper · Scissors release project

Open public/index.html in a browser. Run these commands from this folder.

- Local server: `python3 -m http.server 8000 --bind 127.0.0.1 --directory public`
- Unit checks with Node.js 22 or newer: `node --test`
- Local Firebase preview: `firebase emulators:start --only hosting --project demo-rps`
- Cloud preview: `firebase hosting:channel:deploy class-review --project PROJECT_ID`
- Live release: `firebase deploy --only hosting --project PROJECT_ID`

Replace PROJECT_ID with an authorized project ID. The Firebase CLI must be
installed. Cloud commands require Firebase sign-in and project access.

GitHub Actions runs the local test command on pushes and pull requests.
Keep .github in the project when you copy it. The public folder contains
the deployed assets. The test folder and workflow stay outside that folder.

## Browser acceptance checks

1. Load the game and confirm all three scores are zero.
2. Use the keyboard to choose Rock. Check the result and one changed score.
3. Play five more rounds. Check that the scores total six and five rows appear.
4. Reset. Check zero scores and an empty history, then play another move.
5. Open a second tab and confirm it starts with a fresh score.
