const moves = ["rock", "paper", "scissors"];
const result = document.querySelector("#result");

function chooseComputerMove() {
  const index = Math.floor(Math.random() * moves.length);
  return moves[index];
}

for (const button of document.querySelectorAll("[data-move]")) {
  button.addEventListener("click", () => {
    const player = button.dataset.move;
    const computer = chooseComputerMove();
    result.textContent = "You chose " + player + ". Computer chose " + computer + ".";
  });
}
