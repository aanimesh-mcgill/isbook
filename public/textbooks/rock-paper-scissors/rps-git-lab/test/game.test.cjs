const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// Evaluate the same classic script that the browser loads, without a DOM.
const source = fs.readFileSync(path.join(__dirname, "../public/logic.js"), "utf8");
const { decideWinner, chooseComputerMove } = vm.runInNewContext(
  source + "\n({ decideWinner, chooseComputerMove });"
);

const cases = [
  ["rock", "rock", "tie"],
  ["rock", "paper", "lose"],
  ["rock", "scissors", "win"],
  ["paper", "rock", "win"],
  ["paper", "paper", "tie"],
  ["paper", "scissors", "lose"],
  ["scissors", "rock", "lose"],
  ["scissors", "paper", "win"],
  ["scissors", "scissors", "tie"]
];

for (const [player, computer, expected] of cases) {
  test(`${player} vs. ${computer} is ${expected}`, function () {
    assert.equal(decideWinner(player, computer), expected);
  });
}

for (const [sample, expected] of [[0, "rock"], [0.5, "paper"], [0.999, "scissors"]]) {
  test(`random sample ${sample} selects ${expected}`, function () {
    assert.equal(chooseComputerMove(() => sample), expected);
  });
}
