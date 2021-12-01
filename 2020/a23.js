const cups = {}

const input = "962713854".split("").map(Number)

for (let i = 0; i < input.length; i++) {
  cups[input[i]] =
    i !== input.length - 1 ? input[i + 1] : Math.max(...input) + 1
}
const maxCupElement = 1000000
for (let i = 10; i <= maxCupElement; i++) {
  cups[i] = i !== maxCupElement ? i + 1 : input[0]
}

const move = (cups, num) => {
  const next1 = cups[num]
  const next2 = cups[next1]
  const next3 = cups[next2]
  const oldEnd = cups[next3]
  cups[num] = oldEnd

  let index = num - 1

  while (true) {
    if (index <= 0) index = maxCupElement
    if (index !== next1 && index !== next2 && index !== next3) break
    index--
  }
  const oldNextElement = cups[index]
  cups[index] = next1
  cups[next3] = oldNextElement
  return oldEnd
}
let current = input[0]
for (let i = 0; i < 10000000; i++) {
  current = move(cups, current)
}

console.log(cups[1] * cups[cups[1]])
