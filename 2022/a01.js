const fs = require("fs");

const input = fs.readFileSync("a01.txt").toString();
const caloriesPerElf = input
  .split("\n\n")
  .map((e) => e.split("\n").map(Number));

const sums = caloriesPerElf
  .map((cals) => cals.reduce((acc, curr) => acc + curr, 0))
  .sort((a, b) => b - a);

console.log(sums[0] + sums[1] + sums[2]);
