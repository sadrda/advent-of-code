const fs = require("fs")

const input = fs.readFileSync("./a06.txt", "utf8")

const groups = input
  .split("\n\n")
  .map((group) => group.split("\n"))

let sum = 0
const letters = "abcdefghijklmnopqrstuvwxyz"
groups.forEach((group) => {
  letters.split("").forEach((letter) => {
    let includesLetter = true
    group.forEach((form) => {
      if (!form.includes(letter)) includesLetter = false
    })
    if (includesLetter) sum++
  })
})
console.log(sum)
