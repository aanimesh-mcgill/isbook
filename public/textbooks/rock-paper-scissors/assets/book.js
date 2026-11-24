const chapters = [
  ["01-editor.html", "Download an editor"],
  ["02-html.html", "Write a page with HTML and CSS"],
  ["04-only-you.html", "See why nobody else can open it"],
  ["05-firebase.html", "Learn what Firebase Hosting does"],
  ["06-host.html", "Host the page and open the link"],
  ["07-css.html", "Meet the CSS requirements"],
  ["08-why-git.html", "See why the project needs Git"],
  ["09-repo.html", "Create the repository"],
  ["10-git-loop.html", "Change the project with Git"],
  ["11-rules.html", "Put the game rules on the page"],
  ["12-choice.html", "Read the player's click"],
  ["13-computer.html", "Let the computer choose"],
  ["14-winner.html", "Decide who won"],
  ["15-score.html", "Keep score"],
  ["16-history.html", "Show the recent rounds"],
  ["17-spa.html", "Make the game one page with three views"],
  ["18-pwa.html", "Let the game install and open offline"],
];

const inChapter = /\/chapters\//.test(location.pathname);
const root = inChapter ? ".." : ".";

if (/[?&]swbypass=1(?:&|$)/.test(location.search)) {
  const query = location.search.replace(/([?&])swbypass=1&/, "$1").replace(/[?&]swbypass=1$/, "");
  history.replaceState(null, "", location.pathname + query + location.hash);
}

function chapterHref(file) {
  return inChapter ? file : `chapters/${file}`;
}

function currentFile() {
  const name = location.pathname.split("/").pop() || "index.html";
  return name === "" ? "index.html" : name;
}

const navHost = document.querySelector("[data-nav]");
if (navHost) {
  const here = currentFile();
  const items = chapters
    .map(([file, title], index) => {
      const current = here === file;
      const number = String(index + 1).padStart(2, "0");
      return `<li><a class="nav${current ? " active" : ""}" href="${chapterHref(file)}"${current ? ' aria-current="page"' : ""}><small>${number}</small>${title}</a></li>`;
    })
    .join("");
  navHost.innerHTML = `
    <p class="brand">THE PRACTICAL WEB LAB</p>
    <h2><a href="${root}/index.html">A page other<br>people can open</a></h2>
    <progress id="progress" max="${chapters.length}" value="0" aria-label="Chapters marked complete"></progress>
    <p id="progresslabel" class="muted" aria-live="polite"></p>
    <details class="contents">
      <summary>Chapters</summary>
      <nav aria-label="Chapters"><ul>${items}</ul></nav>
    </details>`;
  const sidebar = navHost.querySelector(".contents");
  if (window.matchMedia("(min-width:851px)").matches) sidebar.open = true;
  sidebar.addEventListener("click", (event) => {
    if (event.target.closest(".nav") && window.matchMedia("(max-width:850px)").matches) {
      sidebar.open = false;
    }
  });
}

const complete = loadProgress();
const progress = document.querySelector("#progress");
function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem("rps-book-path-2026") || "[]");
    const known = new Set(chapters.map(([file]) => file.replace(".html", "")));
    return new Set(Array.isArray(saved) ? saved.filter((id) => known.has(id)) : []);
  } catch {
    return new Set();
  }
}
function updateProgress() {
  if (!progress) return;
  progress.value = complete.size;
  const label = document.querySelector("#progresslabel");
  if (label) label.textContent = `${complete.size} of ${chapters.length} chapters marked complete`;
}
for (const checkbox of document.querySelectorAll(".done")) {
  checkbox.checked = complete.has(checkbox.value);
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) complete.add(checkbox.value);
    else complete.delete(checkbox.value);
    try {
      localStorage.setItem("rps-book-path-2026", JSON.stringify([...complete]));
    } catch {
      // The chapter still works when storage is unavailable.
    }
    updateProgress();
  });
}
updateProgress();

for (const quiz of document.querySelectorAll(".quiz")) {
  const questions = [...quiz.querySelectorAll("fieldset")];
  const summary = quiz.querySelector(".quiz-summary");
  quiz.addEventListener("click", (event) => {
    const choice = event.target.closest(".option");
    if (!choice) return;
    const question = choice.closest("fieldset");
    const correct = choice.dataset.correct === "true";
    for (const option of question.querySelectorAll(".option")) {
      option.classList.toggle("selected", option === choice);
      option.setAttribute("aria-pressed", String(option === choice));
    }
    question.dataset.status = correct ? "correct" : "retry";
    const feedback = question.querySelector(".feedback");
    feedback.className = correct ? "feedback good" : "feedback bad";
    feedback.textContent = `${correct ? "Correct. " : "Try again. "}${choice.dataset.reason}`;
    const score = questions.filter((item) => item.dataset.status === "correct").length;
    summary.textContent = `${score} of ${questions.length} correct`;
  });
  quiz.querySelector(".retry").addEventListener("click", () => {
    for (const question of questions) {
      delete question.dataset.status;
      question.querySelector(".feedback").textContent = "";
      for (const option of question.querySelectorAll(".option")) {
        option.classList.remove("selected");
        option.setAttribute("aria-pressed", "false");
      }
    }
    summary.textContent = "Choose an answer for each question.";
    questions[0].querySelector(".option").focus();
  });
}

for (const button of document.querySelectorAll(".copy")) {
  button.addEventListener("click", async () => {
    const code = document.getElementById(button.dataset.copy);
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = "Copied";
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = "Selected · press Ctrl/Cmd+C";
    }
  });
}
