const fs = require("fs");

const OUTCOME_POINTS = {
  X: 0,
  Y: 3,
  Z: 6,
};

const input = fs.readFileSync("a02.txt").toString();
const matches = input.split("\n");
const points = matches.map((match) => getPointsFromMatch(match[0], match[2]));
const sum = points.reduce((acc, curr) => acc + curr, 0);
console.log(sum);

function getPointsFromMatch(opponent, me) {
  const outcomePoints = OUTCOME_POINTS[me];
  let signPoints = 0;

  if (opponent === "A") {
    if (me === "X") {
      signPoints = 3;
    }
    if (me === "Y") {
      signPoints = 1;
    }
    if (me === "Z") {
      signPoints = 2;
    }
  }

  if (opponent === "B") {
    if (me === "X") {
      signPoints = 1;
    }
    if (me === "Y") {
      signPoints = 2;
    }
    if (me === "Z") {
      signPoints = 3;
    }
  }

  if (opponent === "C") {
    if (me === "X") {
      signPoints = 2;
    }
    if (me === "Y") {
      signPoints = 3;
    }
    if (me === "Z") {
      signPoints = 1;
    }
  }

  return signPoints + outcomePoints;
}
