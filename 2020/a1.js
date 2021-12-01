const fs = require("fs")

const input = fs.readFileSync("./a1.txt", "utf8")

const nums = input.split("\n").map((entry) => Number(entry))

nums.forEach((firstNumber) => {
  nums.forEach((secondNumber) => {
    nums.forEach((thirdNumber) => {
      if (
        firstNumber !== secondNumber &&
        secondNumber !== thirdNumber &&
        thirdNumber !== firstNumber &&
        firstNumber + secondNumber + thirdNumber === 2020
      )
        console.log(firstNumber * secondNumber * thirdNumber)
    })
  })
})
