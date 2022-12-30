const fs = require("fs");

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a10.txt").toString();
  const instructions = getInstructions(input);
  const sprite = getSprite(instructions);
  console.log(sprite.map((row) => row.join("")));
}

function getSprite(instructions) {
  let cycle = 0;
  let x = 1;
  const sprite = [];

  for (let y = 0; y < 6; y++) {
    const row = [];
    for (let x = 0; x < 40; x++) {
      row.push(" ");
    }
    sprite.push(row);
  }

  for (const instruction of instructions) {
    cycle++;
    let arrCycle = cycle - 1;
    if (arrCycle % 40 >= x - 1 && arrCycle % 40 <= x + 1) {
      sprite[Math.floor(arrCycle / 40)][arrCycle % 40] = "X";
    }
    const { operator, value } = instruction;
    if (operator === "noop") {
      continue;
    }

    cycle++;
    arrCycle = cycle - 1;
    if (arrCycle % 40 >= x - 1 && arrCycle % 40 <= x + 1) {
      sprite[Math.floor(arrCycle / 40)][arrCycle % 40] = "X";
    }

    x += value;
  }

  return sprite;
}

function getInstructions(input) {
  return input.split("\n").map((line) => {
    const [operator, value] = line.split(" ");

    return { operator, value: Number(value) };
  });
}
