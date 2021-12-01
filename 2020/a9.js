const fs = require("fs")

const input = fs.readFileSync("./a9.txt", "utf8")

const nums = input.split("\n").map((string) => +string)
const evilNumber = 70639851

for (let x = 0; x < 561; x++) {
  for (let y = 0; y < 561; y++) {
    if (y > x) {
      let sum = 0
      for (let dif = x; dif < y; dif++) {
        sum += nums[dif]
      }
      if (sum === evilNumber) {
        let smallestNum = Infinity
        let biggestNum = 0

        for (let i = x; i < y; i++) {
          const currNum = nums[i]
          if (currNum > biggestNum) biggestNum = currNum
          if (currNum < smallestNum) smallestNum = currNum
        }
        console.log(smallestNum + biggestNum)
      }
    }
  }
}
