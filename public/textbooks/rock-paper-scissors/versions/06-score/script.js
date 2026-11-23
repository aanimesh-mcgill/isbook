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

function play(player) {
  const computer = chooseComputerMove();
  const outcome = decideWinner(player, computer);
  updateScore(outcome);
  renderScore();
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
  result.textContent = "Scores reset. Choose a move.";
});
