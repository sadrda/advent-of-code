const fs = require("fs")

const input = fs.readFileSync("./a02.txt", "utf8")

const commands = input.split("\n").map((line) => {
  const splitLine = line.split(" ")
  const occurs = splitLine[0].split("-")
  return {
    firstIndex: occurs[0] - 1,
    secondIndex: occurs[1] - 1,
    char: splitLine[1][0],
    password: splitLine[2],
  }
})

let validPasswords = 0
commands.forEach((command) => {
  if (
    (command.password[command.firstIndex] === command.char ||
      command.password[command.secondIndex] === command.char) &&
    command.password[command.firstIndex] !==
      command.password[command.secondIndex]
  ) {
    validPasswords++
  }
})
console.log(validPasswords)
