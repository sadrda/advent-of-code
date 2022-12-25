const fs = require("fs");

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a24.txt").toString();
  logMinSteps(input);
}

function logMinSteps(input) {
  let playerStates = new Set();
  playerStates.add("1,0,f,f");
  let minute = 0;
  let map = getMap(input);

  while (true) {
    if (playerStates.length === 0) {
      return;
    }

    for (const state of playerStates) {
      const [x, y, endCheckpoint, startCheckpoint] =
        getEntriesFromStateString(state);

      if (y === map.length - 1 && !endCheckpoint && !startCheckpoint) {
        playerStates.delete(state);
        playerStates.add(getStringFromEntries(x, y, true, false));
      } else if (y === 0 && endCheckpoint && !startCheckpoint) {
        playerStates.delete(state);
        playerStates.add(getStringFromEntries(x, y, true, true));
      } else if (y === map.length - 1 && endCheckpoint && startCheckpoint) {
        console.log(minute);
        return;
      }
    }

    map = getNewMap(map);
    playerStates = getNewPlayerStates(playerStates, map);
    minute++;
  }
}

function getEntriesFromStateString(state) {
  const splitState = state.split(",");
  const x = Number(splitState[0]);
  const y = Number(splitState[1]);
  const endCheckpoint = splitState[2] === "t";
  const startCheckpoint = splitState[3] === "t";

  return [x, y, endCheckpoint, startCheckpoint];
}

function getStringFromEntries(x, y, endCheckpoint, startCheckpoint) {
  return `${x},${y},${endCheckpoint ? "t" : "f"},${
    startCheckpoint ? "t" : "f"
  }`;
}

function getNewPlayerStates(states, map) {
  const newPlayerStates = new Set();

  for (const state of states) {
    const [x, y, endCheckpoint, startCheckpoint] =
      getEntriesFromStateString(state);
    if (map[y][x].length === 0) {
      newPlayerStates.add(
        getStringFromEntries(x, y, endCheckpoint, startCheckpoint)
      );
    }

    if (y > 0) {
      const up = map[y - 1][x];
      if (Array.isArray(up) && up.length === 0) {
        newPlayerStates.add(
          getStringFromEntries(x, y - 1, endCheckpoint, startCheckpoint)
        );
      }
    }

    if (y < map.length - 1) {
      const down = map[y + 1][x];
      if (Array.isArray(down) && down.length === 0) {
        newPlayerStates.add(
          getStringFromEntries(x, y + 1, endCheckpoint, startCheckpoint)
        );
      }
    }

    const right = map[y][x + 1];
    if (Array.isArray(right) && right.length === 0) {
      newPlayerStates.add(
        getStringFromEntries(x + 1, y, endCheckpoint, startCheckpoint)
      );
    }

    const left = map[y][x - 1];
    if (Array.isArray(left) && left.length === 0) {
      newPlayerStates.add(
        getStringFromEntries(x - 1, y, endCheckpoint, startCheckpoint)
      );
    }
  }

  return newPlayerStates;
}

function printMap(map) {
  console.log("----");
  for (const row of map) {
    const rowString = row
      .map((e) => {
        if (Array.isArray(e)) {
          if (e.length === 0) {
            return ".";
          } else if (e.length === 1) {
            return e[0];
          } else {
            return e.length;
          }
        } else return e;
      })
      .join("");
    console.log(rowString);
  }
  console.log("----");
}

function getNewMap(map) {
  const newMap = structuredClone(map);

  for (let y = 1; y < newMap.length - 1; y++) {
    for (let x = 1; x < newMap[0].length - 1; x++) {
      newMap[y][x] = [];
    }
  }

  for (let y = 1; y < map.length - 1; y++) {
    for (let x = 1; x < map[0].length - 1; x++) {
      const blizzards = map[y][x];

      for (const blizzard of blizzards) {
        if (blizzard === ">") {
          if (x + 1 === map[0].length - 1) {
            newMap[y][1].push(">");
          } else {
            newMap[y][x + 1].push(">");
          }
        }
        if (blizzard === "<") {
          if (x - 1 === 0) {
            newMap[y][map[0].length - 2].push("<");
          } else {
            newMap[y][x - 1].push("<");
          }
        }
        if (blizzard === "^") {
          if (y - 1 === 0) {
            newMap[map.length - 2][x].push("^");
          } else {
            newMap[y - 1][x].push("^");
          }
        }
        if (blizzard === "v") {
          if (y + 1 === map.length - 1) {
            newMap[1][x].push("v");
          } else {
            newMap[y + 1][x].push("v");
          }
        }
      }
    }
  }

  return newMap;
}

function getMap(input) {
  const map = input.split("\n").map((row) => row.split(""));

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (y === 0 && map[y][x] === ".") {
        map[y][x] = [];
      } else if (y === map.length - 1 && map[y][x] === ".") {
        map[y][x] = [];
      } else if (map[y][x] === ".") {
        map[y][x] = [];
      } else if (map[y][x] === ">") {
        map[y][x] = [">"];
      } else if (map[y][x] === "v") {
        map[y][x] = ["v"];
      } else if (map[y][x] === "<") {
        map[y][x] = ["<"];
      } else if (map[y][x] === "^") {
        map[y][x] = ["^"];
      }
    }
  }

  return map;
}
