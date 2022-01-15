const fs = require("fs");

const input = fs.readFileSync("./a01.txt", "utf8");
let sum = 0;
input.split("\n").forEach((s, i) => {
  let fuel = Number(s);
  while (fuel > 0) {
    fuel = Math.floor(fuel / 3) - 2;
    if (fuel > 0) sum += fuel;
  }
});
console.log(sum);
