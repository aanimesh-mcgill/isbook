const moves = ["rock", "paper", "scissors"];

function chooseComputerMove(random = Math.random) {
  const index = Math.floor(random() * moves.length);
  return moves[index];
}

function decideWinner(player, computer) {
  if (player === computer) {
    return "tie";
  }
  if ((player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")) {
    return "win";
  }
  return "lose";
}
