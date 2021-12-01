const fs = require("fs")

const input = fs.readFileSync("./a20.txt", "utf8")

const pieces = input.split("\n\n").map((piece) => {
  const puzzle = {
    field: [],
  }
  piece.split("\n").forEach((row, i) => {
    if (i === 0) puzzle.id = +row.split(" ")[1].replace(":", "")
    else {
      puzzle.field[i - 1] = row.split("")
    }
  })
  return puzzle
})

const horizontalFlip = (piece) => {
  const newPuzzle = JSON.parse(JSON.stringify(piece))
  const oldField = piece.field
  const length = oldField.length

  for (let y = 0; y < length; y++) {
    const row = oldField[y]
    for (let x = 0; x < row.length; x++) {
      const char = row[x]
      newPuzzle.field[length - y - 1][x] = char
    }
  }
  return newPuzzle
}

const rotate = (piece) => {
  const newPuzzle = {
    field: JSON.parse(JSON.stringify(piece.field)),
    id: piece.id,
  }
  const oldField = piece.field
  const length = oldField.length

  for (let y = 0; y < length; y++) {
    const row = oldField[y]
    for (let x = 0; x < row.length; x++) {
      const char = row[x]
      newPuzzle.field[x][length - 1 - y] = char
    }
  }
  return newPuzzle
}

const areEqualRows = (r1, r2) => {
  return JSON.stringify(r1) === JSON.stringify(r2)
}

const getTopRow = (field) => field[0]
const getRightRow = (field) => field.map((row) => row[row.length - 1])
const getBotRow = (field) => field[field.length - 1]
const getLeftRow = (field) => field.map((row) => row[0])

const getPossibleFields = (piece) => {
  const fields = []
  fields.push(piece.field)
  let currentPiece = rotate(piece)
  fields.push(currentPiece.field)
  currentPiece = rotate(currentPiece)
  fields.push(currentPiece.field)
  currentPiece = rotate(currentPiece)
  fields.push(currentPiece.field)
  currentPiece = rotate(currentPiece)
  currentPiece = horizontalFlip(currentPiece)
  fields.push(currentPiece.field)
  currentPiece = rotate(currentPiece)
  fields.push(currentPiece.field)
  currentPiece = rotate(currentPiece)
  fields.push(currentPiece.field)
  currentPiece = rotate(currentPiece)
  fields.push(currentPiece.field)
  return fields
}
const findMatchingPiece = (p1, p2, WHERE) => {
  const p2Fields = getPossibleFields(p2)
  if (WHERE === "TOP") {
    for (const p2Field of p2Fields) {
      if (areEqualRows(getTopRow(p1.field), getBotRow(p2Field))) {
        p2.field = p2Field
        return p2
      }
    }
  }
  if (WHERE === "BOT") {
    for (const p2Field of p2Fields) {
      if (areEqualRows(getBotRow(p1.field), getTopRow(p2Field))) {
        p2.field = p2Field
        return p2
      }
    }
  }
  if (WHERE === "LEFT") {
    for (const p2Field of p2Fields) {
      if (areEqualRows(getLeftRow(p1.field), getRightRow(p2Field))) {
        p2.field = p2Field
        return p2
      }
    }
  }
  if (WHERE === "RIGHT") {
    for (const p2Field of p2Fields) {
      if (areEqualRows(getRightRow(p1.field), getLeftRow(p2Field))) {
        p2.field = p2Field
        return p2
      }
    }
  }
  return null
}

const solve = (piece) => {
  pieces.forEach((otherPiece) => {
    if (piece.id !== otherPiece.id) {
      if (!piece.top) {
        const matchingPiece = findMatchingPiece(
          piece,
          otherPiece,
          "TOP",
        )
        if (matchingPiece) {
          piece.top = matchingPiece
          matchingPiece.bot = piece
          solve(matchingPiece)
        }
      }
      if (!piece.bot) {
        const matchingPiece = findMatchingPiece(
          piece,
          otherPiece,
          "BOT",
        )
        if (matchingPiece) {
          piece.bot = matchingPiece
          matchingPiece.top = piece
          solve(matchingPiece)
        }
      }
      if (!piece.right) {
        const matchingPiece = findMatchingPiece(
          piece,
          otherPiece,
          "RIGHT",
        )
        if (matchingPiece) {
          piece.right = matchingPiece
          matchingPiece.left = piece
          solve(matchingPiece)
        }
      }
      if (!piece.left) {
        const matchingPiece = findMatchingPiece(
          piece,
          otherPiece,
          "LEFT",
        )
        if (matchingPiece) {
          piece.left = matchingPiece
          matchingPiece.right = piece
          solve(matchingPiece)
        }
      }
    }
  })
}

solve(pieces[8])
let topLeft = pieces[8]
while (topLeft.top || topLeft.left) {
  if (topLeft.top) topLeft = topLeft.top
  if (topLeft.left) topLeft = topLeft.left
}

const getCenterRowNumber = (field, number) =>
  field[number].slice(1, field[number].length - 1)

const assembledField = []

let currentElement = topLeft
let saveLeft = currentElement

while (saveLeft) {
  for (let y = 1; y < topLeft.field.length - 1; y++) {
    let assembled = []
    while (currentElement) {
      assembled.push(...getCenterRowNumber(currentElement.field, y))
      currentElement = currentElement.right
    }
    assembledField.push(assembled)
    currentElement = saveLeft
  }
  saveLeft = saveLeft.bot
  currentElement = saveLeft
}
let assembler = {
  id: "not important",
  field: assembledField,
}
const possibleAssembledFields = getPossibleFields(assembler)

const monsterFields = possibleAssembledFields.map((field) =>
  field.map(
    (row) =>
      (row = row.map((char) => {
        if (char === "#")
          return {
            char,
            isMonster: false,
          }
        else return char
      })),
  ),
)
const isSeaMonster = (subField) =>
  subField[0][18].char === "#" &&
  subField[1][0].char === "#" &&
  subField[1][5].char === "#" &&
  subField[1][6].char === "#" &&
  subField[1][11].char === "#" &&
  subField[1][12].char === "#" &&
  subField[1][17].char === "#" &&
  subField[1][18].char === "#" &&
  subField[1][19].char === "#" &&
  subField[2][1].char === "#" &&
  subField[2][4].char === "#" &&
  subField[2][7].char === "#" &&
  subField[2][10].char === "#" &&
  subField[2][13].char === "#" &&
  subField[2][16].char === "#"

const findMonster = (field) => {
  let foundMonster = false
  for (let y = 0; y < field.length - 3; y++) {
    for (let x = 0; x < field[0].length - 20; x++) {
      let r1 = field[y].slice(x, x + 20)
      let r2 = field[y + 1].slice(x, x + 20)
      let r3 = field[y + 2].slice(x, x + 20)
      if (isSeaMonster([r1, r2, r3])) {
        foundMonster = true
        field[y + 0][x + 18].isMonster = true
        field[y + 1][x + 0].isMonster = true
        field[y + 1][x + 5].isMonster = true
        field[y + 1][x + 6].isMonster = true
        field[y + 1][x + 11].isMonster = true
        field[y + 1][x + 12].isMonster = true
        field[y + 1][x + 17].isMonster = true
        field[y + 1][x + 18].isMonster = true
        field[y + 1][x + 19].isMonster = true
        field[y + 2][x + 1].isMonster = true
        field[y + 2][x + 4].isMonster = true
        field[y + 2][x + 7].isMonster = true
        field[y + 2][x + 10].isMonster = true
        field[y + 2][x + 13].isMonster = true
        field[y + 2][x + 16].isMonster = true
      }
    }
  }
  return foundMonster
}
monsterFields.forEach((monsterField) => {
  if (findMonster(monsterField)) {
    let sum = 0
    monsterField.forEach((row) =>
      row.forEach((char) => {
        if (char.char === "#" && !char.isMonster) sum++
      }),
    )
    console.log(sum, "monster found")
  }
})
