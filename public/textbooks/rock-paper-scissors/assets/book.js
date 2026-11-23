const chapters = [...document.querySelectorAll(".chapter")];
const landing = document.querySelector("#overview");
const chapterIds = new Set(chapters.map(chapter => chapter.id));

function showPage(moveFocus = false) {
  const requested = window.location.hash.slice(1);
  const activeId = chapterIds.has(requested) ? requested : "overview";
  landing.hidden = activeId !== "overview";
  for (const chapter of chapters) {
    chapter.hidden = chapter.id !== activeId;
  }
  for (const link of document.querySelectorAll(".nav")) {
    const current = link.hash === "#" + activeId;
    link.classList.toggle("active", current);
    if (current) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }
  if (moveFocus) {
    const heading = document.querySelector("#" + activeId + " .page-title");
    heading.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem("rps-textbook-2026") || "[]");
    return new Set(Array.isArray(saved) ? saved.filter(id => chapterIds.has(id)) : []);
  } catch {
    return new Set();
  }
}

const complete = loadProgress();
const progress = document.querySelector("#progress");
function updateProgress() {
  progress.value = complete.size;
  document.querySelector("#progresslabel").textContent =
    `${complete.size} of ${chapters.length} practice sets marked complete`;
}

for (const checkbox of document.querySelectorAll(".done")) {
  checkbox.checked = complete.has(checkbox.value);
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      complete.add(checkbox.value);
    } else {
      complete.delete(checkbox.value);
    }
    try {
      localStorage.setItem("rps-textbook-2026", JSON.stringify([...complete]));
    } catch {
      // The current reading session still works when storage is unavailable.
    }
    updateProgress();
  });
}

for (const quiz of document.querySelectorAll(".quiz")) {
  const questions = [...quiz.querySelectorAll("fieldset")];
  const summary = quiz.querySelector(".quiz-summary");
  quiz.addEventListener("click", event => {
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
    feedback.textContent = (correct ? "Correct. " : "Try again. ") + choice.dataset.reason;
    const score = questions.filter(item => item.dataset.status === "correct").length;
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

for (const trace of document.querySelectorAll(".trace")) {
  const rows = [...trace.querySelectorAll("tbody tr")];
  const output = trace.querySelector(".trace-status");
  let step = -1;
  trace.querySelector(".trace-next").addEventListener("click", () => {
    step = (step + 1) % rows.length;
    rows.forEach((row, index) => row.classList.toggle("highlight", index === step));
    output.textContent = [...rows[step].cells].map(cell => cell.textContent).join(" · ");
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

const sidebar = document.querySelector(".contents");
if (window.matchMedia("(min-width:851px)").matches) sidebar.open = true;
sidebar.addEventListener("click", event => {
  if (event.target.closest(".nav") && window.matchMedia("(max-width:850px)").matches) {
    sidebar.open = false;
  }
});
window.addEventListener("hashchange", () => {
  if (window.location.hash !== "#main") showPage(true);
});
updateProgress();
showPage();
