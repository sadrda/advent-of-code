const fs = require("fs");

const DIRECTION_POINTS = {
  right: 0,
  down: 1,
  left: 2,
  up: 3,
};

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a22.txt").toString();
  const cube = getCube(input);
  const player = getPlayer();
  const directions = getDirections(input);

  applyDirections(player, cube, directions);

  const playerPoints = getPointsFromPlayer(player);
  console.log(playerPoints);
}

function getPointsFromPlayer(player) {
  const cubeTableX = {
    back: 50,
    up: 50,
    front: 50,
    right: 100,
    left: 0,
    down: 0,
  };
  const cubeTableY = {
    back: 0,
    up: 50,
    front: 100,
    right: 0,
    left: 100,
    down: 150,
  };

  return (
    DIRECTION_POINTS[player.direction] +
    4 * (1 + player.x + cubeTableX[player.side]) +
    1000 * (1 + player.y + cubeTableY[player.side])
  );
}

function getPlayer() {
  const player = {
    x: 0,
    y: 0,
    direction: "right",
    side: "back",
  };
  return player;
}

function applyDirections(player, cube, directions) {
  for (const direction of directions) {
    if (direction === "R") {
      if (player.direction === "right") player.direction = "down";
      else if (player.direction === "down") player.direction = "left";
      else if (player.direction === "left") player.direction = "up";
      else if (player.direction === "up") player.direction = "right";
    } else if (direction === "L") {
      if (player.direction === "right") player.direction = "up";
      else if (player.direction === "up") player.direction = "left";
      else if (player.direction === "left") player.direction = "down";
      else if (player.direction === "down") player.direction = "right";
    } else {
      for (let i = 0; i < direction; i++) {
        const newPosition = { x: player.x, y: player.y };
        if (player.direction === "right") newPosition.x++;
        if (player.direction === "up") newPosition.y--;
        if (player.direction === "left") newPosition.x--;
        if (player.direction === "down") newPosition.y++;

        if (
          newPosition.x < 0 ||
          newPosition.y < 0 ||
          newPosition.x >= 50 ||
          newPosition.y >= 50
        ) {
          beam(player, cube);
        } else {
          const newField = cube[player.side][newPosition.y][newPosition.x];
          if (newField === "#") {
            continue;
          } else if (newField === ".") {
            player.x = newPosition.x;
            player.y = newPosition.y;
          }
        }
      }
    }
  }
}

function beam(player, cube) {
  const side = player.side;

  if (side === "front") {
    if (player.direction === "up") {
      const newX = player.x;
      const newY = 49;
      const newSide = "up";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "up";
      return;
    }
    if (player.direction === "down") {
      const newX = 49;
      const newY = player.x;
      const newSide = "down";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "left";
      return;
    }
    if (player.direction === "right") {
      const newX = 49;
      const newY = 49 - player.y;
      const newSide = "right";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "left";
      return;
    }
    if (player.direction === "left") {
      const newX = 49;
      const newY = player.y;
      const newSide = "left";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "left";
      return;
    }
  }
  if (side === "up") {
    if (player.direction === "up") {
      const newX = player.x;
      const newY = 49;
      const newSide = "back";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "up";
      return;
    }
    if (player.direction === "down") {
      const newX = player.x;
      const newY = 0;
      const newSide = "front";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "down";
      return;
    }
    if (player.direction === "left") {
      const newX = player.y;
      const newY = 0;
      const newSide = "left";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "down";
      return;
    }
    if (player.direction === "right") {
      const newX = player.y;
      const newY = 49;
      const newSide = "right";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "up";
      return;
    }
  }
  if (side === "back") {
    if (player.direction === "up") {
      const newX = 0;
      const newY = player.x;
      const newSide = "down";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "right";
      return;
    }
    if (player.direction === "down") {
      const newX = player.x;
      const newY = 0;
      const newSide = "up";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "down";
      return;
    }
    if (player.direction === "right") {
      const newX = 0;
      const newY = player.y;
      const newSide = "right";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "right";
      return;
    }
    if (player.direction === "left") {
      const newX = 0;
      const newY = 49 - player.y;
      const newSide = "left";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "right";
      return;
    }
  }
  if (side === "right") {
    if (player.direction === "up") {
      const newX = player.x;
      const newY = 49;
      const newSide = "down";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "up";
      return;
    }
    if (player.direction === "down") {
      const newX = 49;
      const newY = player.x;
      const newSide = "up";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "left";
      return;
    }
    if (player.direction === "right") {
      const newX = 49;
      const newY = 49 - player.y;
      const newSide = "front";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "left";
      return;
    }
    if (player.direction === "left") {
      const newX = 49;
      const newY = player.y;
      const newSide = "back";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "left";
      return;
    }
  }
  if (side === "left") {
    if (player.direction === "up") {
      const newX = 0;
      const newY = player.x;
      const newSide = "up";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "right";
      return;
    }
    if (player.direction === "down") {
      const newX = player.x;
      const newY = 0;
      const newSide = "down";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "down";
      return;
    }
    if (player.direction === "right") {
      const newX = 0;
      const newY = player.y;
      const newSide = "front";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "right";
      return;
    }
    if (player.direction === "left") {
      const newX = 0;
      const newY = 49 - player.y;
      const newSide = "back";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "right";
      return;
    }
  }
  if (side === "down") {
    if (player.direction === "up") {
      const newX = player.x;
      const newY = 49;
      const newSide = "left";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "up";
      return;
    }
    if (player.direction === "down") {
      const newX = player.x;
      const newY = 0;
      const newSide = "right";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "down";
      return;
    }
    if (player.direction === "right") {
      const newX = player.y;
      const newY = 49;
      const newSide = "front";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "up";
      return;
    }
    if (player.direction === "left") {
      const newX = player.y;
      const newY = 0;
      const newSide = "back";

      if (cube[newSide][newY][newX] === "#") return;
      player.x = newX;
      player.y = newY;
      player.side = newSide;
      player.direction = "down";
      return;
    }
  }
}

function getCube(input) {
  const rawMap = input.split("\n\n")[0];
  const map = rawMap
    .split("\n")
    .map((row) => row.replaceAll(" ", "o").split(""));
  const maxRowLength = Math.max(...map.map((e) => e.length));

  for (const row of map) {
    const spacesToPush = maxRowLength - row.length;
    for (let i = 0; i < spacesToPush; i++) {
      row.push("o");
    }
  }

  const back = [];
  const up = [];
  const front = [];
  const right = [];
  const left = [];
  const down = [];

  for (let y = 0; y < 50; y++) {
    back.push(map[y].slice(50, 100));
  }
  for (let y = 50; y < 100; y++) {
    up.push(map[y].slice(50, 100));
  }
  for (let y = 100; y < 150; y++) {
    front.push(map[y].slice(50, 100));
  }
  for (let y = 0; y < 50; y++) {
    right.push(map[y].slice(100, 150));
  }
  for (let y = 100; y < 150; y++) {
    left.push(map[y].slice(0, 50));
  }
  for (let y = 150; y < 200; y++) {
    down.push(map[y].slice(0, 50));
  }

  const cube = { up, right, left, front, back, down };
  return cube;
}

function getDirections(input) {
  const rawDirections = input.split("\n\n")[1];
  const directions = rawDirections
    .split(/(R|L)/)
    .map((e) => (Number(e) ? Number(e) : e));
  return directions;
}
