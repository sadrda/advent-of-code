const fs = require("fs");

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a08.txt").toString();
  const field = input.split("\n").map((row) => row.split("").map(Number));

  let maxScore = 0;
  for (let y = 1; y < field.length - 1; y++) {
    for (let x = 1; x < field[0].length - 1; x++) {
      const entry = field[y][x];

      const scores = [];

      let score = 0;
      for (let dx = x + 1; dx < field[0].length; dx++) {
        score++;
        if (field[y][dx] >= entry) {
          break;
        }
      }
      scores.push(score);
      score = 0;

      for (let dx = x - 1; dx > -1; dx--) {
        score++;
        if (field[y][dx] >= entry) {
          break;
        }
      }
      scores.push(score);
      score = 0;

      for (let dy = y - 1; dy > -1; dy--) {
        score++;
        if (field[dy][x] >= entry) {
          break;
        }
      }
      scores.push(score);
      score = 0;

      for (let dy = y + 1; dy < field.length; dy++) {
        score++;
        if (field[dy][x] >= entry) {
          break;
        }
      }
      scores.push(score);

      const newScore = scores.reduce((acc, curr) => acc * curr, 1);
      maxScore = Math.max(maxScore, newScore);
    }
  }
  console.log(maxScore);
}
