const fs = require("fs")

const input = fs.readFileSync("./a12.txt", "utf8")
const commands = input
  .split("\n")
  .map((row) => [row.slice(0, 1), +row.slice(1)])

const ship = {
  x: 0,
  y: 0,
}
const wayPoint = {
  x: 10,
  y: 1,
}

const move = (ship, command) => {
  switch (command[0]) {
    case "N":
      wayPoint.y += command[1]
      break
    case "E":
      wayPoint.x += command[1]
      break
    case "S":
      wayPoint.y -= command[1]
      break
    case "W":
      wayPoint.x -= command[1]
      break
    case "R":
      let degs = command[1] / 90
      if (degs === 1) {
        let pl = wayPoint.x
        wayPoint.x = wayPoint.y
        wayPoint.y = -pl
      }
      if (degs === 2) {
        wayPoint.x = -wayPoint.x
        wayPoint.y = -wayPoint.y
      }
      if (degs === 3) {
        let pl = wayPoint.x
        wayPoint.x = -wayPoint.y
        wayPoint.y = pl
      }
      break
    case "L":
      degs2 = 4 - command[1] / 90
      if (degs2 === 1) {
        let pl = wayPoint.x
        wayPoint.x = wayPoint.y
        wayPoint.y = -pl
      }
      if (degs2 === 2) {
        wayPoint.x = -wayPoint.x
        wayPoint.y = -wayPoint.y
      }
      if (degs2 === 3) {
        let pl = wayPoint.x
        wayPoint.x = -wayPoint.y
        wayPoint.y = pl
      }
      break
    case "F":
      ship.x += command[1] * wayPoint.x
      ship.y += command[1] * wayPoint.y
      break
  }
}

commands.forEach((command) => {
  move(ship, command)
})
console.log(Math.abs(ship.x) + Math.abs(ship.y))
