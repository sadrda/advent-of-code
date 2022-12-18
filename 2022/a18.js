const fs = require("fs");

const input = fs.readFileSync("a18.txt").toString();
const cubes = input.split("\n").map((line) => line.split(",").map(Number));

let xMin = Infinity;
let xMax = -Infinity;
let yMin = Infinity;
let yMax = -Infinity;
let zMin = Infinity;
let zMax = -Infinity;

for (const cube of cubes) {
  const [x, y, z] = cube;

  if (x < xMin) xMin = x;
  if (x > xMax) xMax = x;
  if (y < yMin) yMin = y;
  if (y > yMax) yMax = y;
  if (z < zMin) zMin = z;
  if (z > zMax) zMax = z;
}

xMin--;
xMax++;
yMin--;
yMax++;
zMin--;
zMax++;

const outerSurface = [];

fillExterior(xMin, yMin, zMin);
const exteriorSurfaceCount = cubes
  .map(countOuterSurfaceNeighbours)
  .reduce((acc, curr) => acc + curr, 0);

console.log(exteriorSurfaceCount);

function fillExterior(x, y, z) {
  for (const outerField of outerSurface) {
    const [ox, oy, oz] = outerField;
    if (x === ox && y === oy && z === oz) {
      return;
    }
  }

  for (const cube of cubes) {
    const [ox, oy, oz] = cube;
    if (x === ox && y === oy && z === oz) {
      return;
    }
  }

  outerSurface.push([x, y, z]);

  if (x - 1 >= xMin) fillExterior(x - 1, y, z);
  if (x + 1 <= xMax) fillExterior(x + 1, y, z);
  if (y - 1 >= yMin) fillExterior(x, y - 1, z);
  if (y + 1 <= yMax) fillExterior(x, y + 1, z);
  if (z - 1 >= zMin) fillExterior(x, y, z - 1);
  if (z + 1 <= zMax) fillExterior(x, y, z + 1);
}

function countOuterSurfaceNeighbours(cube) {
  let outerSurfaceNeighbourCount = 0;
  const [x, y, z] = cube;

  for (const outerSurfaceField of outerSurface) {
    const [ox, oy, oz] = outerSurfaceField;

    if (x - 1 === ox && y === oy && z === oz) outerSurfaceNeighbourCount++;
    if (x + 1 === ox && y === oy && z === oz) outerSurfaceNeighbourCount++;
    if (x === ox && y - 1 === oy && z === oz) outerSurfaceNeighbourCount++;
    if (x === ox && y + 1 === oy && z === oz) outerSurfaceNeighbourCount++;
    if (x === ox && y === oy && z - 1 === oz) outerSurfaceNeighbourCount++;
    if (x === ox && y === oy && z + 1 === oz) outerSurfaceNeighbourCount++;
  }

  return outerSurfaceNeighbourCount;
}
