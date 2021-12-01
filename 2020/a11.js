const fs = require("fs")
const cloneDeep = require("lodash.clonedeep")

const input = fs.readFileSync("./a11.txt", "utf8")

const seats = input.split("\n").map((row) => row.split(""))

const getAdjacentsSeatCount = (x, y, seats) => {
  let seatsAround = [null, null, null, null, null, null, null, null]
  let dx = x
  let dy = y

  dx = x
  dy = y
  while (!seatsAround[0]) {
    dx--
    dy--
    if (seats[dy] && seats[dy][dx] && seats[dy][dx] === "#") {
      seatsAround[0] = "#"
    } else if (seats[dy] && seats[dy][dx] && seats[dy][dx] === "L") {
      seatsAround[0] = "L"
    }
    if (!seats[dy] || !seats[dy][dx]) {
      seatsAround[0] = "L"
      break
    }
  }
  dx = x
  dy = y
  while (!seatsAround[1]) {
    dy--
    if (seats[dy] && seats[dy][dx] && seats[dy][dx] === "#") {
      seatsAround[1] = "#"
    } else if (seats[dy] && seats[dy][dx] && seats[dy][dx] === "L") {
      seatsAround[1] = "L"
    }
    if (!seats[dy] || !seats[dy][dx]) {
      seatsAround[1] = "L"
      break
    }
  }
  dx = x
  dy = y
  while (!seatsAround[2]) {
    dx++
    dy--
    if (seats[dy] && seats[dy][dx] && seats[dy][dx] === "#") {
      seatsAround[2] = "#"
    } else if (seats[dy] && seats[dy][dx] && seats[dy][dx] === "L") {
      seatsAround[2] = "L"
    }
    if (!seats[dy] || !seats[dy][dx]) {
      seatsAround[2] = "L"
      break
    }
  }
  dx = x
  dy = y
  while (!seatsAround[3]) {
    dx--
    if (seats[dy] && seats[dy][dx] && seats[dy][dx] === "#") {
      seatsAround[3] = "#"
    } else if (seats[dy] && seats[dy][dx] && seats[dy][dx] === "L") {
      seatsAround[3] = "L"
    }
    if (!seats[dy] || !seats[dy][dx]) {
      seatsAround[3] = "L"
      break
    }
  }
  dx = x
  dy = y
  while (!seatsAround[4]) {
    dx++
    if (seats[dy] && seats[dy][dx] && seats[dy][dx] === "#") {
      seatsAround[4] = "#"
    } else if (seats[dy] && seats[dy][dx] && seats[dy][dx] === "L") {
      seatsAround[4] = "L"
    }
    if (!seats[dy] || !seats[dy][dx]) {
      seatsAround[4] = "L"
      break
    }
  }
  dx = x
  dy = y
  while (!seatsAround[5]) {
    dy++
    dx--
    if (seats[dy] && seats[dy][dx] && seats[dy][dx] === "#") {
      seatsAround[5] = "#"
    } else if (seats[dy] && seats[dy][dx] && seats[dy][dx] === "L") {
      seatsAround[5] = "L"
    }
    if (!seats[dy] || !seats[dy][dx]) {
      seatsAround[5] = "L"
      break
    }
  }
  dx = x
  dy = y
  while (!seatsAround[6]) {
    dy++
    if (seats[dy] && seats[dy][dx] && seats[dy][dx] === "#") {
      seatsAround[6] = "#"
    } else if (seats[dy] && seats[dy][dx] && seats[dy][dx] === "L") {
      seatsAround[6] = "L"
    }
    if (!seats[dy] || !seats[dy][dx]) {
      seatsAround[6] = "L"
      break
    }
  }
  dx = x
  dy = y
  while (!seatsAround[7]) {
    dx++
    dy++
    if (seats[dy] && seats[dy][dx] && seats[dy][dx] === "#") {
      seatsAround[7] = "#"
    } else if (seats[dy] && seats[dy][dx] && seats[dy][dx] === "L") {
      seatsAround[7] = "L"
    }
    if (!seats[dy] || !seats[dy][dx]) {
      seatsAround[7] = "L"
      break
    }
  }

  return seatsAround.filter((dir) => dir === "#").length
}

const generation = (seats) => {
  const newSeats = cloneDeep(seats)
  for (let y = 0; y < seats.length; y++) {
    for (let x = 0; x < seats[0].length; x++) {
      const seat = seats[y][x]
      const seatsCount = getAdjacentsSeatCount(x, y, seats)
      if (seat === "L" && seatsCount === 0) newSeats[y][x] = "#"
      if (seat === "#" && seatsCount >= 5) newSeats[y][x] = "L"
    }
  }
  return newSeats
}
const countOccupiedSeats = (seats) => {
  let occupiedCount = 0
  seats.forEach((row) => {
    row.forEach((seat) => {
      if (seat === "#") occupiedCount++
    })
  })
  return occupiedCount
}

let currentSeats = seats

while (true) {
  let newSeats = generation(currentSeats)
  if (JSON.stringify(newSeats) === JSON.stringify(currentSeats)) {
    console.log(countOccupiedSeats(newSeats))
    break
  }
  currentSeats = newSeats
}
