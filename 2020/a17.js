const fs = require("fs")
const input = fs.readFileSync("./a17.txt", "utf8")

const slice = input.split("\n").map((row) => row.split(","))

const cubes = []
cubes[0] = []
cubes[0][0] = []
slice.forEach((row, y) => {
  cubes[0][0][y] = []
  row.forEach((val) => {
    cubes[0][0][y].push(...val.split(""))
  })
})

const extend = (cubes) => {
  cubes.forEach((dim, w) => {
    dim.forEach((slice, z) => {
      slice.forEach((row, y) => {
        row.unshift(".")
        row.push(".")
      })
    })
  })
  let xLength = cubes[0][0][0].length
  const emptyRow = ".".repeat(xLength).split("")

  cubes.forEach((dim) => {
    dim.forEach((slice) => {
      slice.unshift(emptyRow)
      slice.push(emptyRow)
    })
  })

  let yLength = cubes[0][0].length
  const emptySlice = Array(yLength).fill(emptyRow)
  cubes.forEach((dim) => {
    dim.unshift(emptySlice)
    dim.push(emptySlice)
  })

  let zLength = cubes[0].length
  const emptyDim = Array(zLength).fill(emptySlice)
  cubes.unshift(emptyDim)
  cubes.push(emptyDim)
}

const countAdjacentActives = (cubes, w, z, y, x) => {
  let sum = 0
  for (let compW = w - 1; compW < w + 2; compW++) {
    for (let compZ = z - 1; compZ < z + 2; compZ++) {
      for (let compY = y - 1; compY < y + 2; compY++) {
        for (let compX = x - 1; compX < x + 2; compX++) {
          if (
            cubes[compW] &&
            cubes[compW][compZ] &&
            cubes[compW][compZ][compY] &&
            cubes[compW][compZ][compY][compX] &&
            cubes[compW][compZ][compY][compX] === "#" &&
            (compW !== w || compZ !== z || compY !== y || compX !== x)
          )
            sum++
        }
      }
    }
  }

  return sum
}

const evolution = (cubes) => {
  extend(cubes)
  const newCubes = JSON.parse(JSON.stringify(cubes))
  for (let w = 0; w < cubes.length; w++) {
    for (let z = 0; z < cubes[0].length; z++) {
      for (let y = 0; y < cubes[0][0].length; y++) {
        for (let x = 0; x < cubes[0][0][0].length; x++) {
          let adjacentActives = countAdjacentActives(
            cubes,
            w,
            z,
            y,
            x,
          )
          let char = cubes[w][z][y][x]

          if (char === "#") {
            if (adjacentActives !== 2 && adjacentActives !== 3)
              newCubes[w][z][y][x] = "."
          } else if (char === ".") {
            if (adjacentActives === 3) {
              newCubes[w][z][y][x] = "#"
            }
          }
        }
      }
    }
  }

  return newCubes
}
let newCubes = cubes
for (let i = 0; i < 6; i++) {
  newCubes = evolution(newCubes)
}

let activeSum = 0
for (let w = 0; w < newCubes.length; w++) {
  for (let z = 0; z < newCubes[0].length; z++) {
    for (let y = 0; y < newCubes[0][0].length; y++) {
      for (let x = 0; x < newCubes[0][0][0].length; x++) {
        if (newCubes[w][z][y][x] === "#") activeSum++
      }
    }
  }
}

console.log(activeSum)
