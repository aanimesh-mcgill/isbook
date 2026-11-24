const moves = ["rock", "paper", "scissors"];
const result = document.querySelector("#result");
const score = document.querySelector("#score");
const historyList = document.querySelector("#history");
let playerScore = 0;
let computerScore = 0;
let ties = 0;
const history = [];

function chooseComputerMove() {
  const index = Math.floor(Math.random() * moves.length);
  return moves[index];
}

function decideWinner(player, computer) {
  if (player === computer) return "tie";
  if (player === "rock" && computer === "scissors") return "win";
  if (player === "paper" && computer === "rock") return "win";
  if (player === "scissors" && computer === "paper") return "win";
  return "lose";
}

function renderScore() {
  score.textContent = "You: " + playerScore + " · Computer: " + computerScore + " · Ties: " + ties;
}

function renderHistory() {
  historyList.innerHTML = "";
  for (const round of history) {
    const item = document.createElement("li");
    item.textContent = round.player + " vs. " + round.computer + " · " + round.outcome;
    historyList.append(item);
  }
}

function showView(name) {
  for (const view of document.querySelectorAll("[data-view]")) {
    const on = view.dataset.view === name;
    view.hidden = !on;
  }
  for (const link of document.querySelectorAll("nav a")) {
    const on = link.getAttribute("href") === "#" + name;
    if (on) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
}

function viewFromHash() {
  const name = location.hash.replace("#", "");
  if (name === "rules" || name === "rounds") return name;
  return "play";
}

window.addEventListener("hashchange", () => showView(viewFromHash()));
showView(viewFromHash());

for (const button of document.querySelectorAll("[data-move]")) {
  button.addEventListener("click", () => {
    const player = button.dataset.move;
    const computer = chooseComputerMove();
    const outcome = decideWinner(player, computer);
    if (outcome === "win") playerScore += 1;
    else if (outcome === "lose") computerScore += 1;
    else ties += 1;
    history.unshift({ player, computer, outcome });
    if (history.length > 5) history.pop();
    result.textContent = "You chose " + player + ". Computer chose " + computer + ". Result: " + outcome + ".";
    renderScore();
    renderHistory();
  });
}

document.querySelector("#reset").addEventListener("click", () => {
  playerScore = 0;
  computerScore = 0;
  ties = 0;
  history.length = 0;
  result.textContent = "Choose a move.";
  renderScore();
  renderHistory();
});
