const fs = require("fs")
const input = fs.readFileSync("./a10.txt", "utf8")

const nums = input.split("\n").map((str) => +str)
nums.push(0)
nums.sort((a, b) => a - b)

let sumUps = []
for (let i = 0; i < nums.length; i++) {
  let thisSum = 0
  const num = nums[i]
  const numOneOff = nums[i - 1]
  const numTwoOff = nums[i - 2]
  const numThreeOff = nums[i - 3]

  if (!numOneOff) thisSum = 1
  else {
    if (num - numOneOff < 4) thisSum += sumUps[i - 1]
    if (num - numTwoOff < 4) thisSum += sumUps[i - 2]
    if (num - numThreeOff < 4) thisSum += sumUps[i - 3]
  }
  sumUps[i] = thisSum
}
console.log(sumUps[sumUps.length - 1])
