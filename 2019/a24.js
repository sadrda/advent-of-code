const fs = require("fs");
const lodash = require("lodash");

const input = fs.readFileSync("./a24.txt", "utf8");

let field = [];
input.split("\n").forEach((row, i) => {
  field[i] = [];
  row.split("").forEach((char) => {
    field[i].push(char);
  });
});
field[5] = null;
field[6] = null;
field[7] = false; //emptied
field[8] = false; //updated

const copyField = (field) => lodash.cloneDeep(field);

const getEmptyField = () => {
  return [
    [".", ".", ".", ".", "."],
    [".", ".", ".", ".", "."],
    [".", ".", "?", ".", "."],
    [".", ".", ".", ".", "."],
    [".", ".", ".", ".", "."],
    null,
    null,
    false, //emptied
    false, //updated
  ];
};

const emptyNeighbours = (field) => {
  if (!field || field[7]) return;
  field[7] = true;
  emptyNeighbours(field[5]);
  emptyNeighbours(field[6]);

  let generateInner = false;
  let generateOuter = false;

  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if (field[y][x] === "#" && (y === 0 || y === 4)) generateOuter = true;
      if (field[y][x] === "#" && (x === 0 || x === 4)) generateOuter = true;
      if (field[y][x] === "#" && x === 2 && y === 1) generateInner = true;
      if (field[y][x] === "#" && x === 2 && y === 3) generateInner = true;
      if (field[y][x] === "#" && x === 1 && y === 2) generateInner = true;
      if (field[y][x] === "#" && x === 3 && y === 2) generateInner = true;
    }
  }
  if (generateInner && !field[5]) {
    field[5] = getEmptyField();
    field[5][6] = field;
  }
  if (generateOuter && !field[6]) {
    field[6] = getEmptyField();
    field[6][5] = field;
  }
};

const updateField = (newField, oldField) => {
  if (!newField || newField[8]) return;
  newField[8] = true;
  updateField(newField[5], oldField[5], "5");
  updateField(newField[6], oldField[6], "6");
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      let bugCount = 0;
      //count top bugs
      if (y === 0) {
        if (oldField[5] && oldField[5][1][2] === "#") bugCount++;
      } else if (y === 3 && x === 2) {
        if (oldField[6]) {
          let recBugCount = 0;
          for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
              if (y === 4 && oldField[6][y][x] === "#") recBugCount++;
            }
          }
          bugCount += recBugCount;
        }
      } else {
        if (oldField[y - 1][x] === "#") bugCount++;
      }
      //count right bugs
      if (x === 4) {
        if (oldField[5] && oldField[5][2][3] === "#") bugCount++;
      } else if (y === 2 && x === 1) {
        if (oldField[6]) {
          let recBugCount = 0;
          for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
              if (x === 0 && oldField[6][y][x] === "#") recBugCount++;
            }
          }
          bugCount += recBugCount;
        }
      } else {
        if (oldField[y][x + 1] === "#") bugCount++;
      }
      //count bottom bugs
      if (y === 4) {
        if (oldField[5] && oldField[5][3][2] === "#") bugCount++;
      } else if (y === 1 && x === 2) {
        if (oldField[6]) {
          let recBugCount = 0;
          for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
              if (y === 0 && oldField[6][y][x] === "#") recBugCount++;
            }
          }
          bugCount += recBugCount;
        }
      } else {
        if (oldField[y + 1][x] === "#") bugCount++;
      }
      //count left bugs
      if (x === 0) {
        if (oldField[5] && oldField[5][2][1] === "#") bugCount++;
      } else if (y === 2 && x === 3) {
        if (oldField[6]) {
          let recBugCount = 0;
          for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
              if (x === 4 && oldField[6][y][x] === "#") recBugCount++;
            }
          }
          bugCount += recBugCount;
        }
      } else {
        if (oldField[y][x - 1] === "#") bugCount++;
      }

      //eval
      if (oldField[y][x] === "#") {
        if (bugCount !== 1) {
          newField[y][x] = ".";
        }
      }
      if (oldField[y][x] === ".") {
        if (bugCount === 1 || bugCount === 2) {
          newField[y][x] = "#";
        }
      }
    }
  }
};
const resetInner = (field) => {
  resetFlags(field);
  if (field[5]) resetInner(field[5]);
};
const resetOuter = (field) => {
  resetFlags(field);
  if (field[6]) resetOuter(field[6]);
};
const resetFlags = (field) => {
  field[7] = false;
  field[8] = false;
};
const evolution = (field) => {
  emptyNeighbours(field);
  const newField = copyField(field);
  updateField(newField, field);

  resetFlags(newField);
  resetInner(newField[5]);
  resetOuter(newField[6]);
  return newField;
};

const countBugs = (field) => {
  let bugCount = 0;
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if (field[y][x] === "#") bugCount++;
    }
  }
  return bugCount;
};
const countInnerBugs = (field, bugCount) => {
  bugCount += countBugs(field);
  if (field[5]) bugCount = countInnerBugs(field[5], bugCount);
  return bugCount;
};

const countOuterBugs = (field, bugCount) => {
  bugCount += countBugs(field);
  if (field[6]) bugCount = countOuterBugs(field[6], bugCount);
  return bugCount;
};

for (let i = 0; i < 200; i++) {
  field = evolution(field);
}

const fieldBugs = countBugs(field);
const innerBugs = countInnerBugs(field[5], 0);
const outerBugs = countOuterBugs(field[6], 0);
console.log(fieldBugs + innerBugs + outerBugs);
