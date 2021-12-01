const fs = require("fs")

const input = fs.readFileSync("./a24.txt", "utf8")

const commands = input.split("\n").map((line) => {
  const command = []
  const splitLine = line.split("")
  splitLine.forEach((char, i) => {
    let verticalDirection = ""
    let horizontalDirection = ""
    if (char === "e" || char === "w") {
      if (char === "e") horizontalDirection = "e"
      if (char === "w") horizontalDirection = "w"
      const charBefore = splitLine[i - 1]
      if (charBefore) {
        if (charBefore === "n") verticalDirection = "n"
        if (charBefore === "s") verticalDirection = "s"
      }
      command.push(verticalDirection + horizontalDirection)
    }
  })
  return command
})
let grid = {}

commands.forEach((command) => {
  let x = 0
  let y = 0
  command.forEach((dir) => {
    switch (dir) {
      case "e":
        x += 2
        break
      case "w":
        x -= 2
        break
      case "nw":
        x -= 1
        y += 1
        break
      case "ne":
        x += 1
        y += 1
        break
      case "sw":
        x -= 1
        y -= 1
        break
      case "se":
        x += 1
        y -= 1
        break
    }
  })
  if (!grid[x + "," + y]) grid[x + "," + y] = "black"
  else {
    const field = grid[x + "," + y]
    if (field === "white") grid[x + "," + y] = "black"
    else grid[x + "," + y] = "white"
  }
})

const fillGrid = (grid) => {
  Object.entries(grid).forEach(([key, value]) => {
    if (value === "black") {
      const splitCoordinate = key.split(",")
      const x = +splitCoordinate[0]
      const y = +splitCoordinate[1]
      if (!grid[x + 1 + "," + (y - 1)])
        grid[x + 1 + "," + (y - 1)] = "white"

      if (!grid[x - 1 + "," + (y - 1)])
        grid[x - 1 + "," + (y - 1)] = "white"

      if (!grid[x - 2 + "," + y]) grid[x - 2 + "," + y] = "white"

      if (!grid[x - 1 + "," + (y + 1)])
        grid[x - 1 + "," + (y + 1)] = "white"

      if (!grid[x + 1 + "," + (y + 1)])
        grid[x + 1 + "," + (y + 1)] = "white"

      if (!grid[x + 2 + "," + y]) grid[x + 2 + "," + y] = "white"
    }
  })
}

const day = (grid) => {
  fillGrid(grid)
  const newGrid = JSON.parse(JSON.stringify(grid))
  Object.entries(newGrid).forEach(([key, value]) => {
    let adjacentBlacks = 0

    const splitCoordinate = key.split(",")
    const x = +splitCoordinate[0]
    const y = +splitCoordinate[1]
    if (
      grid[x + 1 + "," + (y - 1)] &&
      grid[x + 1 + "," + (y - 1)] === "black"
    )
      adjacentBlacks++
    if (
      grid[x - 1 + "," + (y - 1)] &&
      grid[x - 1 + "," + (y - 1)] === "black"
    )
      adjacentBlacks++
    if (grid[x - 2 + "," + y] && grid[x - 2 + "," + y] === "black")
      adjacentBlacks++
    if (
      grid[x - 1 + "," + (y + 1)] &&
      grid[x - 1 + "," + (y + 1)] === "black"
    )
      adjacentBlacks++
    if (
      grid[x + 1 + "," + (y + 1)] &&
      grid[x + 1 + "," + (y + 1)] === "black"
    )
      adjacentBlacks++
    if (grid[x + 2 + "," + y] && grid[x + 2 + "," + y] === "black")
      adjacentBlacks++

    if (value === "black") {
      if (adjacentBlacks === 0 || adjacentBlacks > 2) {
        newGrid[key] = "white"
      }
    }
    if (value === "white") {
      if (adjacentBlacks === 2) {
        newGrid[key] = "black"
      }
    }
  })

  return newGrid
}
for (let i = 0; i < 100; i++) {
  grid = day(grid)
}
console.log(
  Object.values(grid).reduce(
    (acc, val) => acc + (val === "black" ? 1 : 0),
    0,
  ),
)
