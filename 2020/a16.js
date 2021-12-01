const fs = require("fs")

const input = fs.readFileSync("./a16.txt", "utf8")

const sections = input.split("\n\n")

const rules = sections[0].split("\n").map((row) => {
  const keyValue = row.split(": ")
  const conditions = keyValue[1].split(" or ")
  const lowerCondSplit = conditions[0].split("-")
  const higherCondSplit = conditions[1].split("-")
  const lowerCond = {
    min: +lowerCondSplit[0],
    max: +lowerCondSplit[1],
  }
  const higherCond = {
    min: +higherCondSplit[0],
    max: +higherCondSplit[1],
  }
  return {
    id: keyValue[0],
    ranges: [lowerCond, higherCond],
  }
})

const myTicket = sections[1].split("\n")[1].split(",").map(Number)

let otherTickets = sections[2].split("\n")
otherTickets = otherTickets.slice(1, otherTickets.length)
otherTickets = otherTickets.map((row) => row.split(",").map(Number))

const validOtherTickets = []

otherTickets.forEach((ticket) => {
  const validNums = ticket.map((num) => {
    let isValid = false
    rules.forEach((rule) => {
      if (num >= rule.ranges[0].min && num <= rule.ranges[0].max)
        isValid = true
      if (num >= rule.ranges[1].min && num <= rule.ranges[1].max)
        isValid = true
    })
    return isValid
  })
  if (validNums.every((valid) => valid))
    validOtherTickets.push(ticket)
})

rules.forEach((rule) => (rule.validColumns = []))

for (let i = 0; i < rules.length; i++) {
  const column = validOtherTickets.map((ticket) => ticket[i])

  rules.forEach((rule) => {
    let fitsAll = true
    column.forEach((num) => {
      if (
        (num < rule.ranges[0].min || num > rule.ranges[0].max) &&
        (num < rule.ranges[1].min || num > rule.ranges[1].max)
      )
        fitsAll = false
    })
    if (fitsAll) rule.validColumns.push(i)
  })
}

while (rules.some((rule) => rule.validColumns.length > 1)) {
  rules.forEach((rule) => {
    if (rule.validColumns.length === 1) {
      const validColumn = rule.validColumns[0]
      //console.log(validColumn)
      rules.forEach((otherRule) => {
        if (rule !== otherRule) {
          otherRule.validColumns = otherRule.validColumns.filter(
            (otherValidColumn) => otherValidColumn !== validColumn,
          )
        }
      })
    }
  })
}
let product = 1
rules.forEach((rule) => {
  if (rule.id.startsWith("departure"))
    product *= myTicket[rule.validColumns[0]]
})
console.log(product)
