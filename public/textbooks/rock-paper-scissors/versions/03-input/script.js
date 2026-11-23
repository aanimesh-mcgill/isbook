const result = document.querySelector("#result");

function play(player) {
  result.textContent =
    `You chose ${player}.`;
}

for (const button of document.querySelectorAll("[data-move]")) {
  button.addEventListener("click", function () {
    play(button.dataset.move);
  });
}
