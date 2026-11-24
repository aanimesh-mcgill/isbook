const status = document.querySelector("#account-status");
const board = document.querySelector("#board");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const nameInput = document.querySelector("#name");
const noteInput = document.querySelector("#note");

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  appId: "YOUR_APP_ID",
  measurementId: "G-XXXXXXXX"
};

const ready = firebaseConfig.apiKey.startsWith("AIza");
const sdk = "https://www.gstatic.com/firebasejs/13.4.0/";
let auth = null;
let db = null;
let analytics = null;
let user = null;
let logEvent = null;
let setDoc = null;
let doc = null;
let stopNote = null;

window.recordRound = function (round) {
  if (analytics && logEvent) {
    logEvent(analytics, "round_played", { outcome: round.outcome });
  }
  if (!user || !db) return;
  setDoc(doc(db, "profiles", user.uid), {
    name: nameInput.value || "Player",
    wins: round.wins,
    losses: round.losses,
    ties: round.ties
  }, { merge: true });
  setDoc(doc(db, "private", user.uid), {
    lastRound: {
      player: round.player,
      computer: round.computer,
      outcome: round.outcome
    }
  }, { merge: true });
};

function needConfig() {
  status.textContent = "Paste your web app config in account.js, then deploy to your own project.";
}

document.querySelector("#create").addEventListener("click", async () => {
  if (!auth) return needConfig();
  const { createUserWithEmailAndPassword } = await import(sdk + "firebase-auth.js");
  try {
    await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
  } catch (error) {
    status.textContent = error.message;
  }
});

document.querySelector("#signin").addEventListener("click", async () => {
  if (!auth) return needConfig();
  const { signInWithEmailAndPassword } = await import(sdk + "firebase-auth.js");
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
  } catch (error) {
    status.textContent = error.message;
  }
});

document.querySelector("#signout").addEventListener("click", async () => {
  if (!auth) return needConfig();
  const { signOut } = await import(sdk + "firebase-auth.js");
  await signOut(auth);
});

document.querySelector("#save-note").addEventListener("click", async () => {
  if (!user || !db) {
    status.textContent = "Sign in before saving a private note.";
    return;
  }
  await setDoc(doc(db, "private", user.uid), { note: noteInput.value }, { merge: true });
  status.textContent = "Private note saved.";
});

async function start() {
  if (!ready) {
    needConfig();
    return;
  }
  const { initializeApp } = await import(sdk + "firebase-app.js");
  const { getAuth, onAuthStateChanged } = await import(sdk + "firebase-auth.js");
  const firestore = await import(sdk + "firebase-firestore.js");
  const analyticsSdk = await import(sdk + "firebase-analytics.js");
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = firestore.getFirestore(app);
  setDoc = firestore.setDoc;
  doc = firestore.doc;
  try {
    if (await analyticsSdk.isSupported()) analytics = analyticsSdk.getAnalytics(app);
  } catch (error) {
    analytics = null;
  }
  logEvent = analyticsSdk.logEvent;
  firestore.onSnapshot(firestore.collection(db, "profiles"), (snap) => {
    board.innerHTML = "";
    snap.forEach((item) => {
      const data = item.data();
      const row = document.createElement("li");
      row.textContent = (data.name || "Player") + " · " + data.wins + " wins";
      board.append(row);
    });
  });
  onAuthStateChanged(auth, (next) => {
    user = next;
    if (stopNote) {
      stopNote();
      stopNote = null;
    }
    if (!user) {
      status.textContent = "Signed out.";
      noteInput.value = "";
      return;
    }
    status.textContent = "Signed in.";
    stopNote = firestore.onSnapshot(firestore.doc(db, "private", user.uid), (snap) => {
      if (snap.exists() && typeof snap.data().note === "string") {
        noteInput.value = snap.data().note;
      }
    });
  });
}

start();
