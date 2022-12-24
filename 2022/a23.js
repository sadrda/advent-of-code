const fs = require("fs");

const propositionDirections = ["north", "south", "west", "east"];
const PADDING = 100;

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a23.txt").toString();
  const map = getMap(input);
  applyMovements(map);
}

function printMap(map) {
  console.log("-----------------");
  map.forEach((row) => console.log(row.join("")));
  console.log("-----------------");
}

function applyMovement(map) {
  const propositions = getEmptyPropositions(map);
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      fieldDeclaresProposition(propositions, map, x, y);
    }
  }

  const elfMoved = moveElves(propositions, map);
  updatePropositionDirections();

  return elfMoved;
}

function fieldDeclaresProposition(propositions, map, x, y) {
  const field = map[y][x];
  if (field === ".") {
    return;
  }

  let hasSurroundingElves = getHasSurroundingElves(map, x, y);

  if (!hasSurroundingElves) {
    return;
  }

  for (const propositionDirection of propositionDirections) {
    if (propositionDirection === "north") {
      if (
        map[y - 1][x - 1] === "." &&
        map[y - 1][x] === "." &&
        map[y - 1][x + 1] === "."
      ) {
        propositions[y - 1][x].push([x, y]);
        return;
      }
    }
    if (propositionDirection === "south") {
      if (
        map[y + 1][x - 1] === "." &&
        map[y + 1][x] === "." &&
        map[y + 1][x + 1] === "."
      ) {
        propositions[y + 1][x].push([x, y]);
        return;
      }
    }
    if (propositionDirection === "west") {
      if (
        map[y - 1][x - 1] === "." &&
        map[y][x - 1] === "." &&
        map[y + 1][x - 1] === "."
      ) {
        propositions[y][x - 1].push([x, y]);
        return;
      }
    }
    if (propositionDirection === "east") {
      if (
        map[y - 1][x + 1] === "." &&
        map[y][x + 1] === "." &&
        map[y + 1][x + 1] === "."
      ) {
        propositions[y][x + 1].push([x, y]);
        return;
      }
    }
  }
}

function updatePropositionDirections() {
  propositionDirections.push(propositionDirections.shift());
}

function moveElves(propositions, map) {
  let elfMoved = false;
  for (let y = 0; y < propositions.length; y++) {
    for (let x = 0; x < propositions[0].length; x++) {
      const proposition = propositions[y][x];

      if (proposition.length === 1) {
        const [oldX, oldY] = proposition[0];

        map[y][x] = "#";
        map[oldY][oldX] = ".";
        elfMoved = true;
      }
    }
  }
  return elfMoved;
}

function getHasSurroundingElves(map, x, y) {
  for (let dy = y - 1; dy < y + 2; dy++) {
    for (let dx = x - 1; dx < x + 2; dx++) {
      if (dx === x && dy === y) {
        continue;
      }

      if (map[dy][dx] === "#") {
        return true;
      }
    }
  }
  return false;
}

function getEmptyPropositions(map) {
  const propositions = [];

  for (let y = 0; y < map.length; y++) {
    const row = [];
    for (let x = 0; x < map[0].length; x++) {
      row.push([]);
    }
    propositions.push(row);
  }

  return propositions;
}

function applyMovements(map) {
  let n = 0;
  while (true) {
    n++;
    let elfMoved = applyMovement(map);
    if (!elfMoved) {
      printMap(map);
      console.log(n);
      break;
    }
  }
}

function getMap(input) {
  const map = input.split("\n").map((row) => row.split(""));
  const paddedWidth = 2 * PADDING + map[0].length;
  const paddedHeight = 2 * PADDING + map.length;
  const paddedMap = [];

  for (let y = 0; y < paddedHeight; y++) {
    const row = [];
    for (let x = 0; x < paddedWidth; x++) {
      row.push(".");
    }
    paddedMap.push(row);
  }

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      paddedMap[PADDING + y][PADDING + x] = map[y][x];
    }
  }

  return paddedMap;
}
