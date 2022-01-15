const fs = require("fs")
const cloneDeep = require("lodash.clonedeep")
const input = fs.readFileSync("./a08.txt", "utf8")

const commands = input
  .split("\n")
  .map((line) => line.split(" "))
  .map((stringCommand) => [stringCommand[0], +stringCommand[1]])

for (
  let commandIndex = 0;
  commandIndex < commands.length;
  commandIndex++
) {
  let acc = 0
  let globalIndex = 0
  const checkedCommandIndices = []

  const copyCommands = cloneDeep(commands)

  if (commands[commandIndex][0] === "jmp") {
    copyCommands[commandIndex][0] = "nop"
  } else if (commands[commandIndex][0] === "nop") {
    copyCommands[commandIndex][0] = "jmp"
  }
  while (true) {
    const currentCommand = copyCommands[globalIndex]
    if (checkedCommandIndices.find((index) => index === globalIndex))
      break
    checkedCommandIndices.push(globalIndex)

    if (globalIndex === commands.length) console.log(acc)
    switch (currentCommand[0]) {
      case "nop":
        globalIndex++
        break
      case "acc":
        globalIndex++
        acc += currentCommand[1]
        break
      case "jmp":
        globalIndex += currentCommand[1]
        break
    }
  }
}
