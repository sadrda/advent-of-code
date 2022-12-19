const fs = require("fs");

const stream = fs.readFileSync("a17.txt").toString();

const SHAPES = ["horizontal", "cross", "reverse-L", "vertical", "block"];
const field = [];
const testShapesNum = 25000;
const targetShapesNum = 1000000000000;
let height = 0;
let shapeCounter = 0;
let jetCounter = 0;

addRowsToField(testShapesNum * 2);

const heights = [];
const deltaHeights = [];
for (let n = 0; n < testShapesNum; n++) {
  heights.push(height);
  const shape = SHAPES[shapeCounter++ % SHAPES.length];
  addShapeToField(shape);
  const oldHeight = height;
  moveShape();
  deltaHeights.push(height - oldHeight);
}

const customSequence = [];
const customSequenceLength = 100;

for (
  let i = testShapesNum / 2;
  i < testShapesNum / 2 + customSequenceLength;
  i++
) {
  customSequence.push(deltaHeights[i]);
}

const repeatingIndices = [];

for (let i = 0; i < testShapesNum; i++) {
  let foundRepeat = true;
  for (let j = i; j < i + customSequenceLength; j++) {
    if (deltaHeights[j] !== customSequence[j - i]) {
      foundRepeat = false;
    }
  }
  if (foundRepeat) {
    repeatingIndices.push(i);
  }
}
const startingIndex = repeatingIndices[repeatingIndices.length - 2];
const startingIndexPlusOnePeriod =
  repeatingIndices[repeatingIndices.length - 1];
const startingHeight = heights[startingIndex];
const startingHeightPlusOnePeriod = heights[startingIndexPlusOnePeriod];

const periodLength = startingIndexPlusOnePeriod - startingIndex;
const deltaHeightPerPeriod = startingHeightPlusOnePeriod - startingHeight;

const restIndicesNum = targetShapesNum - startingIndex;
const restPeriods = Math.floor(restIndicesNum / periodLength);
const restPeriodHeight = restPeriods * deltaHeightPerPeriod;

const restIndex = restIndicesNum % periodLength;
const restHeight = heights[startingIndex + restIndex] - heights[startingIndex];

console.log(startingHeight + restPeriodHeight + restHeight);

function moveShape() {
  let hasLanded = false;

  while (!hasLanded) {
    const streamDirection = stream[jetCounter++ % stream.length];
    applyJetMovement(streamDirection);
    const successfulMovement = applyVerticalMovement();
    hasLanded = !successfulMovement;
    if (hasLanded) {
      petrifyShape();
      setNewHeight();
    }
  }
}

function printField() {
  console.log("----");
  for (let i = 15; i >= 0; i--) {
    console.log(field[i].join(""));
  }
  console.log("----");
}

function setNewHeight() {
  for (let y = Math.max(height - 100, 0); y < height + 100; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] === "#") {
        height = y + 1;
      }
    }
  }
}

function petrifyShape() {
  for (let y = Math.max(height - 100, 0); y < height + 100; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] === "@") {
        field[y][x] = "#";
      }
    }
  }
}

function applyVerticalMovement() {
  for (let y = Math.max(height - 100, 0); y < height + 100; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] === "@" && (y < 1 || field[y - 1][x] === "#")) {
        return false;
      }
    }
  }

  const toMove = [];
  for (let y = Math.max(height - 100, 0); y < height + 100; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] === "@") {
        toMove.push([y - 1, x]);
        field[y][x] = ".";
      }
    }
  }

  for (const targetSpot of toMove) {
    const [y, x] = targetSpot;
    field[y][x] = "@";
  }

  return true;
}

function applyJetMovement(streamDirection) {
  for (let y = Math.max(height - 100, 0); y < height + 100; y++) {
    const row = field[y];
    for (let x = 0; x < row.length; x++) {
      if (
        row[x] === "@" &&
        ((streamDirection === "<" && (x === 0 || row[x - 1] === "#")) ||
          (streamDirection === ">" &&
            (x === row.length - 1 || row[x + 1] === "#")))
      ) {
        return;
      }
    }
  }

  const toMove = [];
  for (let y = Math.max(height - 100, 0); y < height + 100; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] === "@") {
        toMove.push([y, x]);
        field[y][x] = ".";
      }
    }
  }

  const targetSpots = toMove.map((oldSpot) => [
    oldSpot[0],
    oldSpot[1] + (streamDirection === "<" ? -1 : 1),
  ]);

  for (const targetSpot of targetSpots) {
    const [y, x] = targetSpot;
    field[y][x] = "@";
  }
}

function addShapeToField(shape) {
  if (shape === "horizontal") {
    field[height + 3][2] = "@";
    field[height + 3][3] = "@";
    field[height + 3][4] = "@";
    field[height + 3][5] = "@";
  }
  if (shape === "cross") {
    field[height + 3][3] = "@";
    field[height + 4][2] = "@";
    field[height + 4][3] = "@";
    field[height + 4][4] = "@";
    field[height + 5][3] = "@";
  }
  if (shape === "reverse-L") {
    field[height + 3][2] = "@";
    field[height + 3][3] = "@";
    field[height + 3][4] = "@";
    field[height + 4][4] = "@";
    field[height + 5][4] = "@";
  }
  if (shape === "vertical") {
    field[height + 3][2] = "@";
    field[height + 4][2] = "@";
    field[height + 5][2] = "@";
    field[height + 6][2] = "@";
  }
  if (shape === "block") {
    field[height + 3][2] = "@";
    field[height + 3][3] = "@";
    field[height + 4][2] = "@";
    field[height + 4][3] = "@";
  }
}

function addRowsToField(n) {
  for (let i = 0; i < n; i++) {
    field.push([".", ".", ".", ".", ".", ".", "."]);
  }
}
