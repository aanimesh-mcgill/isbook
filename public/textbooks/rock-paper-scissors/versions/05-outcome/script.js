const result = document.querySelector("#result");

function play(player) {
  const computer = chooseComputerMove();
  const outcome = decideWinner(player, computer);
  result.textContent =
    `You chose ${player}. Computer chose ${computer}. Result: ${outcome}.`;
}

for (const button of document.querySelectorAll("[data-move]")) {
  button.addEventListener("click", function () {
    play(button.dataset.move);
  });
}
