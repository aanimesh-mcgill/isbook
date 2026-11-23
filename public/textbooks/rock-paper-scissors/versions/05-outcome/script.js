const moves = ["rock", "paper", "scissors"];
const result = document.querySelector("#result");

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

for (const button of document.querySelectorAll("[data-move]")) {
  button.addEventListener("click", () => {
    const player = button.dataset.move;
    const computer = chooseComputerMove();
    const outcome = decideWinner(player, computer);
    result.textContent = "You chose " + player + ". Computer chose " + computer + ". Result: " + outcome + ".";
  });
}
