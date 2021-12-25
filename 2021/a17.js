const fs = require("fs");

const input = fs.readFileSync("a17.txt").toString();
const rangeMatcher = /[-0-9]+..[-0-9]+/g;
const [xRange, yRange] = input
  .match(rangeMatcher)
  .map((range) => range.split("..").map(Number));

const validXStartSpeeds = [];
for (let startVelocityX = 0; startVelocityX <= xRange[1]; startVelocityX++) {
  let posX = 0;
  let velocityX = startVelocityX;
  let hasStoppedPrematurely = false;
  let hasOvershotTarget = false;

  while (!hasStoppedPrematurely && !hasOvershotTarget) {
    posX += velocityX;
    velocityX -= 1;
    if (posX >= xRange[0] && posX <= xRange[1]) {
      validXStartSpeeds.push(startVelocityX);
      break;
    }
    hasOvershotTarget = posX > xRange[1];
    hasStoppedPrematurely = velocityX <= 0 && posX < xRange[0];
  }
}

const validPairs = [];

for (let startVelocityY = -1000; startVelocityY <= 1000; startVelocityY++) {
  for (const startVelocityX of validXStartSpeeds) {
    let posY = 0;
    let posX = 0;
    let maxY = -Infinity;
    let velocityY = startVelocityY;
    let velocityX = startVelocityX;
    let hasOvershotTarget = false;
    while (!hasOvershotTarget) {
      posX += velocityX;
      posY += velocityY;
      velocityX -= 1;
      if (velocityX < 0) velocityX = 0;
      velocityY -= 1;
      if (posY > maxY) maxY = posY;
      if (
        posY >= yRange[0] &&
        posY <= yRange[1] &&
        posX >= xRange[0] &&
        posX <= xRange[1]
      ) {
        validPairs.push(maxY);
        break;
      }
      hasOvershotTarget = posY < 0 && posY < yRange[1] && posX > xRange[0];
    }
  }
}
console.log(validPairs.length);
