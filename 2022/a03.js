const fs = require("fs");

const input = fs.readFileSync("a03.txt").toString();
const rawRucksacks = input.split("\n");

const commonLetters = [];

for (let i = 0; i < rawRucksacks.length; i += 3) {
  const r1 = rawRucksacks[i];
  const r2 = rawRucksacks[i + 1];
  const r3 = rawRucksacks[i + 2];
  let found = false;

  for (const l1 of r1) {
    for (const l2 of r2) {
      for (const l3 of r3) {
        if (!found && l1 === l2 && l2 === l3) {
          commonLetters.push(l1);
          found = true;
        }
      }
    }
  }
}

const pointsPerRucksack = commonLetters.map((content) => {
  const shiftedPoints = content.charCodeAt(0);

  return shiftedPoints - (content === content.toUpperCase() ? 38 : 96);
});

const sumOfPoints = pointsPerRucksack.reduce((acc, curr) => acc + curr, 0);

console.log(sumOfPoints);
