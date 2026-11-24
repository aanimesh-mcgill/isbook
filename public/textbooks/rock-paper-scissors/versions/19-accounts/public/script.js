const moves = ["rock", "paper", "scissors"];
const result = document.querySelector("#result");
const score = document.querySelector("#score");
const historyList = document.querySelector("#history");
const jsonBox = document.querySelector("#json");
const parsed = document.querySelector("#parsed");
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
    view.hidden = view.dataset.view !== name;
  }
  for (const link of document.querySelectorAll("nav a")) {
    if (link.getAttribute("href") === "#" + name) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
}

function viewFromHash() {
  const name = location.hash.slice(1);
  if (name === "rules" || name === "rounds" || name === "account") return name;
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
    const round = {
      player: player,
      computer: computer,
      outcome: outcome,
      wins: playerScore,
      losses: computerScore,
      ties: ties
    };
    jsonBox.textContent = JSON.stringify(round, null, 2);
    if (window.recordRound) window.recordRound(round);
    result.textContent = "You chose " + player + ". Computer chose " + computer + ". Result: " + outcome + ".";
    renderScore();
    renderHistory();
  });
}

document.querySelector("#parse").addEventListener("click", () => {
  try {
    const round = JSON.parse(jsonBox.textContent);
    parsed.textContent = "Parsed outcome: " + round.outcome;
  } catch (error) {
    parsed.textContent = "That text is not JSON.";
  }
});

document.querySelector("#reset").addEventListener("click", () => {
  playerScore = 0;
  computerScore = 0;
  ties = 0;
  history.length = 0;
  result.textContent = "Choose a move.";
  renderScore();
  renderHistory();
});
