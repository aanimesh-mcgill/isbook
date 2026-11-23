const result = document.querySelector("#result");

function play(player) {
  const computer = chooseComputerMove();
  result.textContent =
    `You chose ${player}. Computer chose ${computer}.`;
}

for (const button of document.querySelectorAll("[data-move]")) {
  button.addEventListener("click", function () {
    play(button.dataset.move);
  });
}
