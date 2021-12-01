const fs = require("fs")
const input = fs.readFileSync("./a5.txt", "utf8")

const getRow = (code) => {
  const rows = 128
  const rowRange = [0, rows]
  code.split("").forEach((char) => {
    if (char === "B") rowRange[0] += (rowRange[1] - rowRange[0]) / 2
    if (char === "F") rowRange[1] -= (rowRange[1] - rowRange[0]) / 2
  })
  return rowRange[0]
}
const getColumn = (code) => {
  const columns = 8
  const columnRange = [0, columns]
  code.split("").forEach((char) => {
    if (char === "R")
      columnRange[0] += (columnRange[1] - columnRange[0]) / 2
    if (char === "L")
      columnRange[1] -= (columnRange[1] - columnRange[0]) / 2
  })
  return columnRange[0]
}
const getSeatPosition = (code) => [
  getRow(code.slice(0, 7)),
  getColumn(code.slice(7, code.length)),
]
const getSeatID = (code) => {
  const seatPosition = getSeatPosition(code)
  return seatPosition[0] * 8 + seatPosition[1]
}

const passes = input.split("\n")

const positions = passes.map((pass) => getSeatPosition(pass))

for (let row = 0; row < 128; row++) {
  for (let column = 0; column < 8; column++) {
    let positionExists = false
    positions.forEach((position) => {
      if (position[0] === row && position[1] === column)
        positionExists = true
    })
    if (!positionExists) console.log(row, column, "doesnt exist")
  }
}
console.log(64 * 8 + 3)
