const fs = require("fs")

const input = fs.readFileSync("./a14.txt", "utf8")

let latest = null
const lines = input.split("\n")

const commands = []
lines.forEach((line) => {
  if (line.startsWith("mask")) {
    const strippedLine = line.replace("mask = ", "")
    if (latest) commands.push(latest)
    latest = {
      mask: strippedLine,
      additions: [],
    }
  } else {
    const address = +line.split("[")[1].split("]")[0]
    const value = +line.split(" = ")[1]
    latest.additions.push({
      address: address.toString(2).padStart(latest.mask.length, "0"),
      value,
    })
  }
})
commands.push(latest)

const findSubNums = (addresses, currAddress) => {
  let foundX = false
  for (let i = 0; i < currAddress.length; i++) {
    const char = currAddress[i]
    if (char === "X") {
      foundX = true
      const zeroNum = [...currAddress]
      zeroNum[i] = "0"
      const oneNum = [...currAddress]
      oneNum[i] = "1"
      findSubNums(addresses, zeroNum)
      findSubNums(addresses, oneNum)
      break
    }
  }
  if (!foundX) {
    addresses.push(parseInt(currAddress.join(""), 2))
  }
}
const getAddresses = (mask, address) => {
  let copyVal = address.split("")

  mask.split("").forEach((char, i) => {
    if (char !== "0") {
      copyVal[i] = char
    }
  })
  const addresses = []
  findSubNums(addresses, copyVal)
  return addresses
}

let memory = {}
commands.forEach((command) => {
  command.additions.forEach((addition) => {
    const addresses = getAddresses(command.mask, addition.address)
    addresses.forEach((address) => {
      memory[address] = addition.value
    })
  })
})
console.log(Object.values(memory).reduce((acc, curr) => acc + curr))
