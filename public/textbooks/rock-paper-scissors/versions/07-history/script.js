const result = document.querySelector("#result");

let playerScore = 0;
let computerScore = 0;
let ties = 0;

function updateScore(outcome) {
  if (outcome === "win") {
    playerScore += 1;
  } else if (outcome === "lose") {
    computerScore += 1;
  } else {
    ties += 1;
  }
}

function renderScore() {
  document.querySelector("#score").textContent =
    `You: ${playerScore} · Computer: ${computerScore} · Ties: ${ties}`;
}

const history = [];

function addRound(player, computer, outcome) {
  history.unshift({ player, computer, outcome });
  if (history.length > 5) {
    history.pop();
  }
}

function renderHistory() {
  const list = document.querySelector("#history");
  list.replaceChildren();
  for (const round of history) {
    const item = document.createElement("li");
    item.textContent = `${round.player} vs. ${round.computer} · ${round.outcome}`;
    list.append(item);
  }
}

function play(player) {
  const computer = chooseComputerMove();
  const outcome = decideWinner(player, computer);
  updateScore(outcome);
  renderScore();
  addRound(player, computer, outcome);
  renderHistory();
  result.textContent =
    `You chose ${player}. Computer chose ${computer}. Result: ${outcome}.`;
}

for (const button of document.querySelectorAll("[data-move]")) {
  button.addEventListener("click", function () {
    play(button.dataset.move);
  });
}

document.querySelector("#reset").addEventListener("click", function () {
  playerScore = 0;
  computerScore = 0;
  ties = 0;
  renderScore();
  history.length = 0;
  renderHistory();
  result.textContent = "Scores reset. Choose a move.";
});
