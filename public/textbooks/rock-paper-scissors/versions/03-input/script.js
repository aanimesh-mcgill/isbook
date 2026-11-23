const result = document.querySelector("#result");

for (const button of document.querySelectorAll("[data-move]")) {
  button.addEventListener("click", () => {
    const player = button.dataset.move;
    result.textContent = "You chose " + player + ".";
  });
}
