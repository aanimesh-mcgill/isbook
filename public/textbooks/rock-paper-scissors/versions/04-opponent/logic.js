const moves = ["rock", "paper", "scissors"];

function chooseComputerMove(random = Math.random) {
  const index = Math.floor(random() * moves.length);
  return moves[index];
}
