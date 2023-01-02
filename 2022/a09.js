const fs = require("fs");

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a9.txt").toString();
  const instructions = getInstructions(input);
  const placesCount = getPlacesCount(instructions);
  console.log(placesCount);
}

function getPlacesCount(instructions) {
  const places = new Set();
  places.add("0,0");

  const head = { x: 0, y: 0 };
  const knots = [];
  for (let i = 0; i < 9; i++) {
    knots.push({ x: 0, y: 0 });
  }

  for (const { direction, value } of instructions) {
    for (let i = 0; i < value; i++) {
      if (direction === "U") {
        head.y++;
      }
      if (direction === "D") {
        head.y--;
      }
      if (direction === "R") {
        head.x++;
      }
      if (direction === "L") {
        head.x--;
      }

      for (let j = 0; j < knots.length; j++) {
        const h1 = j === 0 ? head : knots[j - 1];
        const h2 = knots[j];

        if (h1.x > h2.x + 1) {
          h2.x++;
          if (h1.y < h2.y) {
            h2.y--;
          }
          if (h1.y > h2.y) {
            h2.y++;
          }
        }
        if (h1.x < h2.x - 1) {
          h2.x--;
          if (h1.y < h2.y) {
            h2.y--;
          }
          if (h1.y > h2.y) {
            h2.y++;
          }
        }
        if (h1.y > h2.y + 1) {
          h2.y++;
          if (h1.x < h2.x) {
            h2.x--;
          }
          if (h1.x > h2.x) {
            h2.x++;
          }
        }
        if (h1.y < h2.y - 1) {
          h2.y--;
          if (h1.x < h2.x) {
            h2.x--;
          }
          if (h1.x > h2.x) {
            h2.x++;
          }
        }

        if (j === knots.length - 1) {
          places.add(`${h2.x},${h2.y}`);
        }
      }
    }
  }

  return places.size;
}

function getInstructions(input) {
  return input.split("\n").map((row) => {
    const [direction, value] = row.split(" ");

    return {
      direction,
      value: Number(value),
    };
  });
}
