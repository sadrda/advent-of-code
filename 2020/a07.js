const fs = require("fs")

const input = fs.readFileSync("./a07.txt", "utf8")

const lines = input.split("\n")

const rules = {}
lines.forEach((line) => {
  const splitLine = line.split(" contain ")
  const containingBag = splitLine[0]
    .replace(".", "")
    .replace("bags", "")
    .replace("bag", "")
    .trim()
  if (splitLine[1] === "no other bags.") rules[containingBag] = []
  else {
    const includingBags = splitLine[1].split(",").map((bagRule) => {
      const newBagRule = bagRule.trim().split("")

      const num = +newBagRule[0]
      newBagRule.splice(0, 1)
      return [
        num,
        newBagRule
          .join("")
          .replace(".", "")
          .replace("bags", "")
          .replace("bag", "")
          .trim(),
      ]
    })
    rules[containingBag] = includingBags
  }
})
let sum = 0

const searchBag = (bag) => {
  let bagSum = 1
  const rule = rules[bag]

  rule.forEach((includer) => {
    bagSum += includer[0] * searchBag(includer[1])
  })

  return bagSum
}
const shinyGoldRule = rules["shiny gold"]

shinyGoldRule.forEach((bags) => {
  sum += bags[0] * searchBag(bags[1])
})

console.log(sum)
