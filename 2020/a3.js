const fs = require("fs")

const input = fs.readFileSync("./a3.txt", "utf8")

const grid = input.split("\n")

const gridWidth = grid[0].length
const slopes = [
  [1, 1],
  [1, 3],
  [1, 5],
  [1, 7],
  [2, 1],
]
const treeCounts = []

for (let i = 0; i < slopes.length; i++) {
  const xSlope = slopes[i][1]
  const ySlope = slopes[i][0]
  let x = 0
  let treeCount = 0
  for (let y = 0; y < grid.length; y += ySlope) {
    if (grid[y][x] === "#") treeCount++
    x = (x + xSlope) % gridWidth
  }
  treeCounts.push(treeCount)
}

console.log(treeCounts.reduce((acc, curr) => acc * curr, 1))
