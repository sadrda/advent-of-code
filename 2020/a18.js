const fs = require("fs")

const input = fs.readFileSync("./a18.txt", "utf8")

const lines = input
  .split("\n")
  .map((line) => line.split(" ").join(""))
  .map((line) => {
    const tree = []
    const arrayTree = [tree]
    let depth = 0
    line.split("").forEach((char) => {
      if (Number.isNaN(+char)) {
        if (char === "+" || char === "*") arrayTree[depth].push(char)
        else {
          if (char === "(") {
            depth++
            arrayTree[depth] = []
          } else if (char === ")") {
            depth--
            arrayTree[depth].push(arrayTree[depth + 1])
          }
        }
      } else {
        arrayTree[depth].push(+char)
      }
    })
    return tree
  })

const evaluateTerm = (term) => {
  let num1 = null
  let operation = null

  while (term.some((char) => char === "+")) {
    for (let i = 0; i < term.length; i++) {
      const char = term[i]
      if (char === "+") {
        let term1 = Array.isArray(term[i - 1])
          ? evaluateTerm(term[i - 1])
          : term[i - 1]
        let term2 = Array.isArray(term[i + 1])
          ? evaluateTerm(term[i + 1])
          : term[i + 1]
        term.splice(i - 1, 3, term1 + term2)
        break
      }
    }
  }

  term.forEach((char) => {
    if (num1 === null) {
      num1 = Array.isArray(char) ? evaluateTerm(char) : char
    } else if (!operation) {
      operation = char
    } else {
      num1 *= Array.isArray(char) ? evaluateTerm(char) : char
      operation = null
    }
  })
  return num1
}

let sum = 0
lines.forEach((line) => {
  sum += evaluateTerm(line)
})
console.log(sum)
