const fs = require("fs");

const COLUMNS = 1000;

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a14.txt").toString();
  const map = getMap(input);
  const sandCount = fillMapWithSand(map);
  console.log(sandCount);
}

function fillMapWithSand(map) {
  let sandCount = 0;

  while (true) {
    const successfulDrop = dropSand(map);

    if (successfulDrop) {
      sandCount++;
    } else {
      break;
    }
  }

  return sandCount;
}

function dropSand(map) {
  let x = 500;
  let y = 0;

  while (true) {
    if (map[0][500] === "o") {
      return false;
    }
    if (map[y + 1][x] === ".") {
      y++;
      continue;
    }
    if (map[y + 1][x - 1] === ".") {
      y++;
      x--;
      continue;
    }
    if (map[y + 1][x + 1] === ".") {
      y++;
      x++;
      continue;
    }

    map[y][x] = "o";
    break;
  }

  return true;
}

function getMap(input) {
  const rawLines = input.split("\n");
  const steps = rawLines.map((rawLine) => rawLine.split(" -> "));
  const lines = steps.map((step) =>
    step.map((point) => {
      const [x, y] = point.split(",").map(Number);

      return { x, y };
    })
  );

  let maxY = -Infinity;
  for (const line of lines) {
    for (const point of line) {
      if (point.y > maxY) maxY = point.y;
    }
  }

  const map = [];
  for (let y = 0; y <= maxY + 2; y++) {
    const row = [];
    for (let x = 0; x < COLUMNS; x++) {
      row.push(y === maxY + 2 ? "#" : ".");
    }
    map.push(row);
  }

  for (const line of lines) {
    for (let p = 0; p < line.length - 1; p++) {
      const p1 = line[p];
      const p2 = line[p + 1];

      const smallerX = Math.min(p1.x, p2.x);
      const biggerX = Math.max(p1.x, p2.x);
      const smallerY = Math.min(p1.y, p2.y);
      const biggerY = Math.max(p1.y, p2.y);

      for (let y = smallerY; y <= biggerY; y++) {
        for (let x = smallerX; x <= biggerX; x++) {
          map[y][x] = "#";
        }
      }
    }
  }

  return map;
}
